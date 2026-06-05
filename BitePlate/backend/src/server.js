const express = require('express');
const cors = require('cors');

const tablesRouter = require('./routes/tables');
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');
const kitchenRouter = require('./routes/kitchen');
const billsRouter = require('./routes/bills');
const historyRouter = require('./routes/history');
const staffRouter = require('./routes/staff');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/tables', tablesRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/kitchen', kitchenRouter);
app.use('/api/bills', billsRouter);
app.use('/api/history', historyRouter);
app.use('/api/staff', staffRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Global error handler — never expose stack traces to clients
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`BitePlate API running on port ${PORT}`);
});

module.exports = app;
