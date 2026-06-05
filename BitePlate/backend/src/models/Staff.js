// Base Staff class (inheritance)
class Staff {
  constructor(id, name, role) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  canSeatCustomers() { return false; }
  canTakeOrders() { return false; }
  canManageKitchen() { return false; }
  canAccessBilling() { return false; }
  canManageStaff() { return false; }

  getPermissions() {
    return {
      seatCustomers: this.canSeatCustomers(),
      takeOrders: this.canTakeOrders(),
      manageKitchen: this.canManageKitchen(),
      accessBilling: this.canAccessBilling(),
      manageStaff: this.canManageStaff(),
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      permissions: this.getPermissions(),
    };
  }
}

class Waiter extends Staff {
  constructor(id, name) {
    super(id, name, 'waiter');
    this.assignedTables = [];
    this.coversServed = 0;
  }

  canSeatCustomers() { return true; }
  canTakeOrders() { return true; }
}

class Chef extends Staff {
  constructor(id, name) {
    super(id, name, 'chef');
  }

  canManageKitchen() { return true; }
}

class Cashier extends Staff {
  constructor(id, name) {
    super(id, name, 'cashier');
  }

  canAccessBilling() { return true; }
}

class Manager extends Staff {
  constructor(id, name) {
    super(id, name, 'manager');
  }

  canSeatCustomers() { return true; }
  canTakeOrders() { return true; }
  canManageKitchen() { return true; }
  canAccessBilling() { return true; }
  canManageStaff() { return true; }
}

module.exports = { Staff, Waiter, Chef, Cashier, Manager };
