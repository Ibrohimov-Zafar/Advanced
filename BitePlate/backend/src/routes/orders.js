const express = require('express');
const router = express.Router();
const { Order } = require('../models/Order');
const { orders, getTableById, getMenuItemById, getStaffById } = require('../utils/dataStore');
const { validateOrderBody } = require('../middleware/validate');

router.get('/', (req, res) => {
  const { tableId, status } = req.query;
  let result = Array.from(orders.values()).map((o) => o.toJSON());
  if (tableId) result = result.filter((o) => o.tableId === tableId);
  if (status) result = result.filter((o) => o.status === status);
  res.json(result);
});

router.get('/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order.toJSON());
});

router.post('/', validateOrderBody, (req, res) => {
  const { tableId, staffId, items, notes } = req.body;

  const table = getTableById(tableId);
  if (!table) return res.status(404).json({ error: 'Table not found' });
  if (table.state !== 'occupied') return res.status(409).json({ error: 'Table must be occupied to place an order' });

  const staff = getStaffById(staffId);
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });
  if (!staff.canTakeOrders()) return res.status(403).json({ error: 'Staff member cannot take orders' });

  const order = new Order(String(tableId), staffId);
  if (notes) order.notes = String(notes).slice(0, 500);

  for (const item of items) {
    const menuItem = getMenuItemById(item.menuItemId);
    if (!menuItem) return res.status(404).json({ error: `Menu item ${item.menuItemId} not found` });
    const qty = parseInt(item.quantity) || 1;
    if (qty < 1 || qty > 20) return res.status(400).json({ error: 'Quantity must be between 1 and 20' });
    order.addItem(menuItem, qty, item.notes ? String(item.notes).slice(0, 200) : '');
  }

  order.confirm();
  table.currentOrder = order.id;
  orders.set(order.id, order);

  res.status(201).json(order.toJSON());
});

router.patch('/:id/cancel', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  try {
    order.cancel();
    res.json(order.toJSON());
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

router.patch('/:id/serve', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.markServed();
  res.json(order.toJSON());
});

module.exports = router;
