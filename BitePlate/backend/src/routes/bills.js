const express = require('express');
const router = express.Router();
const { Bill } = require('../models/Bill');
const { orders, bills, getTableById } = require('../utils/dataStore');
const { getPricingStrategy } = require('../patterns/Strategy');
const OrderHistoryLog = require('../patterns/Singleton');
const { validateBillBody } = require('../middleware/validate');

router.get('/', (req, res) => {
  res.json(Array.from(bills.values()).map((b) => b.toJSON()));
});

router.get('/:id', (req, res) => {
  const bill = bills.get(req.params.id);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  res.json(bill.toJSON());
});

router.post('/', validateBillBody, (req, res) => {
  const { orderId, pricingStrategy = 'standard', tip, tipPercent, guests } = req.body;

  const order = orders.get(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (!['confirmed', 'in_preparation', 'ready', 'served'].includes(order.status)) {
    return res.status(409).json({ error: 'Order is not in a billable state' });
  }

  const strategy = getPricingStrategy(pricingStrategy);
  const bill = new Bill(order, strategy);

  if (tipPercent !== undefined) {
    const pct = parseFloat(tipPercent);
    if (isNaN(pct) || pct < 0 || pct > 100) return res.status(400).json({ error: 'tipPercent must be 0-100' });
    bill.addTipPercent(pct);
  } else if (tip !== undefined) {
    const t = parseFloat(tip);
    if (isNaN(t) || t < 0) return res.status(400).json({ error: 'tip must be a non-negative number' });
    bill.addTip(t);
  }

  if (guests !== undefined) {
    const g = parseInt(guests);
    if (isNaN(g) || g < 1 || g > 50) return res.status(400).json({ error: 'guests must be 1-50' });
    bill.splitBill(g);
  }

  bills.set(bill.id, bill);

  // Record to Singleton history log when bill is generated
  OrderHistoryLog.getInstance().append(order, strategy.getName());

  // Update table state
  const table = getTableById(parseInt(order.tableId));
  if (table) table.requestBill();

  res.status(201).json(bill.toJSON());
});

router.post('/:id/pay', (req, res) => {
  const bill = bills.get(req.params.id);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  if (bill.paid) return res.status(409).json({ error: 'Bill already paid' });

  bill.markPaid();

  // Clear the table after payment
  const order = orders.get(bill.orderId);
  if (order) {
    const table = getTableById(parseInt(order.tableId));
    if (table) table.clear();
  }

  res.json(bill.toJSON());
});

module.exports = router;
