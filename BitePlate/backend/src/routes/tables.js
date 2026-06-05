const express = require('express');
const router = express.Router();
const { tables, getTableById } = require('../utils/dataStore');
const { validateTableId } = require('../middleware/validate');

router.get('/', (req, res) => {
  res.json(tables.map((t) => t.toJSON()));
});

router.get('/:id', validateTableId, (req, res) => {
  const table = getTableById(req.params.id);
  if (!table) return res.status(404).json({ error: 'Table not found' });
  res.json(table.toJSON());
});

router.post('/:id/seat', validateTableId, (req, res) => {
  const table = getTableById(req.params.id);
  if (!table) return res.status(404).json({ error: 'Table not found' });

  const { customerName } = req.body;
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    return res.status(400).json({ error: 'customerName is required' });
  }

  try {
    table.seat(customerName.trim());
    res.json(table.toJSON());
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

router.post('/:id/request-bill', validateTableId, (req, res) => {
  const table = getTableById(req.params.id);
  if (!table) return res.status(404).json({ error: 'Table not found' });

  try {
    table.requestBill();
    res.json(table.toJSON());
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

router.post('/:id/clear', validateTableId, (req, res) => {
  const table = getTableById(req.params.id);
  if (!table) return res.status(404).json({ error: 'Table not found' });
  table.clear();
  res.json(table.toJSON());
});

module.exports = router;
