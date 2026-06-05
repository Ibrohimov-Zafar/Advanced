const express = require('express');
const router = express.Router();
const OrderHistoryLog = require('../patterns/Singleton');

router.get('/', (req, res) => {
  const { from, to, tableId } = req.query;
  const log = OrderHistoryLog.getInstance();

  let records;
  if (from && to) {
    records = log.getByDateRange(from, to);
  } else if (tableId) {
    records = log.getByTable(String(tableId));
  } else {
    records = log.getAll();
  }

  res.json(records);
});

router.get('/summary', (req, res) => {
  res.json(OrderHistoryLog.getInstance().getSummary());
});

router.get('/top-items', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  res.json(OrderHistoryLog.getInstance().getMostFrequentItem(limit));
});

module.exports = router;
