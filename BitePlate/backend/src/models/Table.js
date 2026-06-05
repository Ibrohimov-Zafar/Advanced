// State pattern: Table lifecycle management
const TABLE_STATES = {
  FREE: 'free',
  RESERVED: 'reserved',
  OCCUPIED: 'occupied',
  AWAITING_BILL: 'awaiting_bill',
  CLEARED: 'cleared',
};

class Table {
  constructor(id, capacity) {
    this.id = id;
    this.capacity = capacity;
    this.state = TABLE_STATES.FREE;
    this.currentReservation = null;
    this.currentOrder = null;
    this.customerName = null;
    this.seatedAt = null;
  }

  seat(customerName) {
    if (this.state !== TABLE_STATES.FREE && this.state !== TABLE_STATES.RESERVED) {
      throw new Error(`Table ${this.id} cannot be seated — current state: ${this.state}`);
    }
    this.state = TABLE_STATES.OCCUPIED;
    this.customerName = customerName;
    this.seatedAt = new Date().toISOString();
  }

  requestBill() {
    if (this.state !== TABLE_STATES.OCCUPIED) {
      throw new Error(`Table ${this.id} must be occupied to request a bill`);
    }
    this.state = TABLE_STATES.AWAITING_BILL;
  }

  clear() {
    this.state = TABLE_STATES.FREE;
    this.currentReservation = null;
    this.currentOrder = null;
    this.customerName = null;
    this.seatedAt = null;
  }

  reserve(reservationId) {
    if (this.state !== TABLE_STATES.FREE) {
      throw new Error(`Table ${this.id} is not available for reservation`);
    }
    this.state = TABLE_STATES.RESERVED;
    this.currentReservation = reservationId;
  }

  toJSON() {
    return {
      id: this.id,
      capacity: this.capacity,
      state: this.state,
      customerName: this.customerName,
      seatedAt: this.seatedAt,
      currentOrder: this.currentOrder,
    };
  }
}

module.exports = { Table, TABLE_STATES };
