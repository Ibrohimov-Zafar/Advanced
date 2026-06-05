// Abstract base class for all menu items
class MenuItem {
  constructor(id, name, price, category, allergens = []) {
    if (new.target === MenuItem) {
      throw new Error('MenuItem is abstract and cannot be instantiated directly');
    }
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.allergens = allergens;
  }

  getPrice() {
    return this.price;
  }

  getDescription() {
    return `${this.name} - $${this.price.toFixed(2)}`;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      allergens: this.allergens,
      type: this.constructor.name,
    };
  }
}

class Starter extends MenuItem {
  constructor(id, name, price, allergens = []) {
    super(id, name, price, 'starter', allergens);
    this.prepTime = 10;
  }
}

class MainCourse extends MenuItem {
  constructor(id, name, price, allergens = []) {
    super(id, name, price, 'main', allergens);
    this.prepTime = 20;
  }
}

class Dessert extends MenuItem {
  constructor(id, name, price, allergens = []) {
    super(id, name, price, 'dessert', allergens);
    this.prepTime = 8;
  }
}

class Beverage extends MenuItem {
  constructor(id, name, price, allergens = []) {
    super(id, name, price, 'beverage', allergens);
    this.prepTime = 3;
  }
}

// Composite pattern: SetMeal treats individual items and combos uniformly
class SetMeal {
  constructor(id, name, items = [], discount = 0) {
    this.id = id;
    this.name = name;
    this.items = items;
    this.discount = discount;
    this.category = 'combo';
  }

  getPrice() {
    const total = this.items.reduce((sum, item) => sum + item.getPrice(), 0);
    return total * (1 - this.discount);
  }

  getDescription() {
    const itemList = this.items.map((i) => i.name).join(', ');
    return `${this.name} (${itemList}) - $${this.getPrice().toFixed(2)}`;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.getPrice(),
      category: this.category,
      items: this.items.map((i) => i.toJSON()),
      discount: this.discount,
      type: 'SetMeal',
    };
  }
}

module.exports = { MenuItem, Starter, MainCourse, Dessert, Beverage, SetMeal };
