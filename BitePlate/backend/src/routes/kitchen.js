const express = require('express');
const router = express.Router();
const { orders, kitchenQueue } = require('../utils/dataStore');
const { PrepareOrderCommand, CancelOrderCommand, ReadyOrderCommand } = require('../patterns/Command');

router.get('/queue', (req, res) => {
  const confirmed = Array.from(orders.values())
    .filter((o) => ['confirmed', 'in_preparation'].includes(o.status))
    .map((o) => o.toJSON());
  res.json({
    activeOrders: confirmed,
    pendingCommands: kitchenQueue.getQueue(),
    commandHistory: kitchenQueue.getHistory(),
  });
});

router.post('/prepare', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const order = orders.get(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'confirmed') return res.status(409).json({ error: 'Order must be confirmed before preparation' });

  const cmd = new PrepareOrderCommand(order);
  const result = kitchenQueue.executeCommand(cmd);
  res.json({ ...result, order: order.toJSON() });
});

router.post('/ready', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const order = orders.get(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'in_preparation') return res.status(409).json({ error: 'Order must be in preparation' });

  const cmd = new ReadyOrderCommand(order);
  const result = kitchenQueue.executeCommand(cmd);
  res.json({ ...result, order: order.toJSON() });
});

router.post('/cancel', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const order = orders.get(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const cmd = new CancelOrderCommand(order);
  const result = kitchenQueue.executeCommand(cmd);
  res.json({ ...result, order: order.toJSON() });
});

router.post('/undo', (req, res) => {
  const result = kitchenQueue.undoLast();
  res.json(result);
});

module.exports = router;
