const { v4: uuidv4 } = require('uuid');

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PREPARATION: 'in_preparation',
  READY: 'ready',
  SERVED: 'served',
  CANCELLED: 'cancelled',
};

class OrderItem {
  constructor(menuItem, quantity = 1, notes = '') {
    this.id = uuidv4();
    this.menuItem = menuItem;
    this.quantity = quantity;
    this.notes = notes;
  }

  getSubtotal() {
    return this.menuItem.getPrice() * this.quantity;
  }

  toJSON() {
    return {
      id: this.id,
      menuItem: this.menuItem.toJSON(),
      quantity: this.quantity,
      notes: this.notes,
      subtotal: this.getSubtotal(),
    };
  }
}

class Order {
  constructor(tableId, staffId) {
    this.id = uuidv4();
    this.tableId = tableId;
    this.staffId = staffId;
    this.items = [];
    this.status = ORDER_STATUS.PENDING;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.notes = '';
  }

  addItem(menuItem, quantity = 1, notes = '') {
    if (this.status !== ORDER_STATUS.PENDING) {
      throw new Error('Cannot modify order after it has been confirmed');
    }
    const item = new OrderItem(menuItem, quantity, notes);
    this.items.push(item);
    this.updatedAt = new Date().toISOString();
    return item;
  }

  removeItem(itemId) {
    if (this.status !== ORDER_STATUS.PENDING) {
      throw new Error('Cannot modify order after it has been confirmed');
    }
    this.items = this.items.filter((i) => i.id !== itemId);
    this.updatedAt = new Date().toISOString();
  }

  confirm() {
    if (this.items.length === 0) {
      throw new Error('Cannot confirm an empty order');
    }
    this.status = ORDER_STATUS.CONFIRMED;
    this.updatedAt = new Date().toISOString();
  }

  startPreparation() {
    this.status = ORDER_STATUS.IN_PREPARATION;
    this.updatedAt = new Date().toISOString();
  }

  markReady() {
    this.status = ORDER_STATUS.READY;
    this.updatedAt = new Date().toISOString();
  }

  markServed() {
    this.status = ORDER_STATUS.SERVED;
    this.updatedAt = new Date().toISOString();
  }

  cancel() {
    this.status = ORDER_STATUS.CANCELLED;
    this.updatedAt = new Date().toISOString();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  toJSON() {
    return {
      id: this.id,
      tableId: this.tableId,
      staffId: this.staffId,
      items: this.items.map((i) => i.toJSON()),
      status: this.status,
      total: this.getTotal(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      notes: this.notes,
    };
  }
}

module.exports = { Order, OrderItem, ORDER_STATUS };
