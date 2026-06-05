// PATTERN 3: Strategy — Pricing / Discount Engine
// PricingStrategy interface — swap algorithms at runtime without changing Bill class

class PricingStrategy {
  calculateTotal(order) { throw new Error('calculateTotal() must be implemented'); }
  getName() { throw new Error('getName() must be implemented'); }
  getDescription() { throw new Error('getDescription() must be implemented'); }
}

class StandardPricing extends PricingStrategy {
  calculateTotal(order) {
    return order.getTotal();
  }

  getName() { return 'Standard'; }
  getDescription() { return 'Full price — no discounts applied'; }
}

class HappyHourPricing extends PricingStrategy {
  constructor(discountRate = 0.20) {
    super();
    this.discountRate = discountRate;
  }

  calculateTotal(order) {
    return order.getTotal() * (1 - this.discountRate);
  }

  getName() { return 'HappyHour'; }
  getDescription() { return `Happy Hour — ${this.discountRate * 100}% off all items`; }
}

class LoyaltyCardPricing extends PricingStrategy {
  constructor(discountRate = 0.10) {
    super();
    this.discountRate = discountRate;
  }

  calculateTotal(order) {
    // 10% off and one beverage free (cheapest beverage)
    const base = order.getTotal() * (1 - this.discountRate);
    const beverages = order.items.filter((i) => i.menuItem.category === 'beverage');
    const freeDrink = beverages.length > 0
      ? Math.min(...beverages.map((i) => i.menuItem.getPrice()))
      : 0;
    return Math.max(0, base - freeDrink);
  }

  getName() { return 'LoyaltyCard'; }
  getDescription() { return `Loyalty Card — ${this.discountRate * 100}% off + 1 free drink`; }
}

class GroupDiscountPricing extends PricingStrategy {
  constructor(minGroup = 6, discountRate = 0.15) {
    super();
    this.minGroup = minGroup;
    this.discountRate = discountRate;
  }

  calculateTotal(order) {
    return order.getTotal() * (1 - this.discountRate);
  }

  getName() { return 'GroupDiscount'; }
  getDescription() { return `Group Discount (${this.minGroup}+ guests) — ${this.discountRate * 100}% off`; }
}

// Factory to resolve strategy by name
function getPricingStrategy(name) {
  switch (name) {
    case 'happyhour': return new HappyHourPricing();
    case 'loyalty': return new LoyaltyCardPricing();
    case 'group': return new GroupDiscountPricing();
    default: return new StandardPricing();
  }
}

module.exports = {
  PricingStrategy,
  StandardPricing,
  HappyHourPricing,
  LoyaltyCardPricing,
  GroupDiscountPricing,
  getPricingStrategy,
};
