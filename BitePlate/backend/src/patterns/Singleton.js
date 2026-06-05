// PATTERN 2: Singleton — Order History Log
// Guarantees one globally accessible log across all subsystems
class OrderHistoryLog {
  constructor() {
    this._records = [];
  }

  static getInstance() {
    if (!OrderHistoryLog._instance) {
      OrderHistoryLog._instance = new OrderHistoryLog();
    }
    return OrderHistoryLog._instance;
  }

  append(order, pricingStrategyName) {
    const record = {
      orderId: order.id,
      tableId: order.tableId,
      staffId: order.staffId,
      items: order.items.map((i) => ({
        name: i.menuItem.name,
        category: i.menuItem.category,
        quantity: i.quantity,
        price: i.menuItem.getPrice(),
      })),
      total: order.getTotal(),
      pricingStrategy: pricingStrategyName || 'standard',
      timestamp: new Date().toISOString(),
      status: order.status,
    };
    this._records.push(record);
    return record;
  }

  // Iterator: get all records in a date range
  getByDateRange(from, to) {
    const start = new Date(from).getTime();
    const end = new Date(to).getTime();
    return this._records.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= start && t <= end;
    });
  }

  // Iterator: get all records for a specific table
  getByTable(tableId) {
    return this._records.filter((r) => r.tableId === tableId);
  }

  // Analytics: most frequently ordered item
  getMostFrequentItem(limit = 10) {
    const counts = {};
    this._records.forEach((record) => {
      record.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  }

  // Analytics: revenue by category
  getRevenueByCategory() {
    const revenue = {};
    this._records.forEach((record) => {
      record.items.forEach((item) => {
        revenue[item.category] = (revenue[item.category] || 0) + item.price * item.quantity;
      });
    });
    return revenue;
  }

  // Analytics: peak hours
  getPeakHours() {
    const hours = {};
    this._records.forEach((record) => {
      const h = new Date(record.timestamp).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });
    return Object.entries(hours)
      .sort((a, b) => b[1] - a[1])
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));
  }

  getAll() {
    return [...this._records];
  }

  getSummary() {
    const totalRevenue = this._records.reduce((sum, r) => sum + r.total, 0);
    return {
      totalOrders: this._records.length,
      totalRevenue,
      averageOrderValue: this._records.length ? totalRevenue / this._records.length : 0,
      topItems: this.getMostFrequentItem(5),
      revenueByCategory: this.getRevenueByCategory(),
      peakHours: this.getPeakHours().slice(0, 3),
    };
  }
}

OrderHistoryLog._instance = null;

module.exports = OrderHistoryLog;
