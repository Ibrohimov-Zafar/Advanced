const { v4: uuidv4 } = require('uuid');

const TAX_RATE = 0.08;

class BillLineItem {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
  }

  toJSON() {
    return { description: this.description, amount: this.amount };
  }
}

// Facade pattern: single interface over tax, tip, split-bill logic
class Bill {
  constructor(order, pricingStrategy) {
    this.id = uuidv4();
    this.orderId = order.id;
    this.tableId = order.tableId;
    this.lineItems = [];
    this.tip = 0;
    this.guestCount = 1;
    this.paid = false;
    this.createdAt = new Date().toISOString();
    this.strategyName = pricingStrategy.getName();

    const subtotal = pricingStrategy.calculateTotal(order);
    const discount = order.getTotal() - subtotal;

    order.items.forEach((item) => {
      this.lineItems.push(
        new BillLineItem(
          `${item.menuItem.name} x${item.quantity}`,
          item.getSubtotal()
        )
      );
    });

    if (discount > 0) {
      this.lineItems.push(new BillLineItem(`Discount (${this.strategyName})`, -discount));
    }

    this._subtotal = subtotal;
    this._tax = subtotal * TAX_RATE;
  }

  addTip(amount) {
    if (amount < 0) throw new Error('Tip cannot be negative');
    this.tip = amount;
  }

  addTipPercent(percent) {
    this.tip = this._subtotal * (percent / 100);
  }

  getSubtotal() { return this._subtotal; }
  getTax() { return this._tax; }
  getTotal() { return this._subtotal + this._tax + this.tip; }

  splitBill(guests) {
    if (guests < 1) throw new Error('Guest count must be at least 1');
    this.guestCount = guests;
    return this.getTotal() / guests;
  }

  markPaid() { this.paid = true; }

  toJSON() {
    return {
      id: this.id,
      orderId: this.orderId,
      tableId: this.tableId,
      lineItems: this.lineItems.map((l) => l.toJSON()),
      subtotal: this._subtotal,
      tax: this._tax,
      tip: this.tip,
      total: this.getTotal(),
      perGuest: this.guestCount > 1 ? this.getTotal() / this.guestCount : null,
      guestCount: this.guestCount,
      strategyName: this.strategyName,
      paid: this.paid,
      createdAt: this.createdAt,
    };
  }
}

module.exports = { Bill, BillLineItem };
