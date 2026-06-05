// Input validation middleware for secure coding practices
function validateTableId(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid table ID' });
  }
  req.params.id = id;
  next();
}

function validateOrderBody(req, res, next) {
  const { tableId, staffId, items } = req.body;
  if (!tableId || !staffId) {
    return res.status(400).json({ error: 'tableId and staffId are required' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }
  next();
}

function validateBillBody(req, res, next) {
  const { orderId } = req.body;
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'orderId is required' });
  }
  next();
}

module.exports = { validateTableId, validateOrderBody, validateBillBody };
