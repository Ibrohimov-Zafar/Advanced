const STORAGE_KEY = 'biteplate_store';
const TAX_RATE = 0.08;

const SEED_MENU = [
  { id: 'm-001', name: 'Garlic Bread', price: 4.5, category: 'starter', allergens: ['gluten'], type: 'Starter' },
  { id: 'm-002', name: 'Soup of the Day', price: 5, category: 'starter', allergens: [], type: 'Starter' },
  { id: 'm-003', name: 'Bruschetta', price: 6, category: 'starter', allergens: ['gluten'], type: 'Starter' },
  { id: 'm-004', name: 'Prawn Cocktail', price: 7.5, category: 'starter', allergens: ['shellfish'], type: 'Starter' },
  { id: 'm-005', name: 'Grilled Chicken', price: 14, category: 'main', allergens: [], type: 'MainCourse' },
  { id: 'm-006', name: 'Beef Burger', price: 13.5, category: 'main', allergens: ['gluten', 'dairy'], type: 'MainCourse' },
  { id: 'm-007', name: 'Vegetable Pasta', price: 11, category: 'main', allergens: ['gluten', 'dairy'], type: 'MainCourse' },
  { id: 'm-008', name: 'Salmon Fillet', price: 16, category: 'main', allergens: ['fish'], type: 'MainCourse' },
  { id: 'm-009', name: 'Margherita Pizza', price: 12, category: 'main', allergens: ['gluten', 'dairy'], type: 'MainCourse' },
  { id: 'm-010', name: 'Chocolate Cake', price: 5.5, category: 'dessert', allergens: ['gluten', 'dairy', 'eggs'], type: 'Dessert' },
  { id: 'm-011', name: 'Cheesecake', price: 5, category: 'dessert', allergens: ['gluten', 'dairy'], type: 'Dessert' },
  { id: 'm-012', name: 'Fruit Sorbet', price: 4, category: 'dessert', allergens: [], type: 'Dessert' },
  { id: 'm-013', name: 'Still Water', price: 1.5, category: 'beverage', allergens: [], type: 'Beverage' },
  { id: 'm-014', name: 'Sparkling Water', price: 2, category: 'beverage', allergens: [], type: 'Beverage' },
  { id: 'm-015', name: 'Orange Juice', price: 3, category: 'beverage', allergens: [], type: 'Beverage' },
  { id: 'm-016', name: 'Soft Drink', price: 2.5, category: 'beverage', allergens: [], type: 'Beverage' },
  { id: 'm-017', name: 'House Wine (glass)', price: 5.5, category: 'beverage', allergens: ['sulphites'], type: 'Beverage' },
  { id: 'm-018', name: 'Craft Beer', price: 4.5, category: 'beverage', allergens: ['gluten'], type: 'Beverage' },
  { id: 'sm-001', name: 'Business Lunch', price: 17.55, category: 'combo', allergens: [], type: 'SetMeal' },
  { id: 'sm-002', name: 'Family Deal', price: 29.75, category: 'combo', allergens: [], type: 'SetMeal' },
];

const SEED_STAFF = [
  { id: 'staff-001', name: 'Alice Johnson', role: 'manager', permissions: { seatCustomers: true, takeOrders: true, manageKitchen: true, accessBilling: true, manageStaff: true } },
  { id: 'staff-002', name: 'Bob Smith', role: 'waiter', permissions: { seatCustomers: true, takeOrders: true, manageKitchen: false, accessBilling: false, manageStaff: false } },
  { id: 'staff-003', name: 'Carol White', role: 'waiter', permissions: { seatCustomers: true, takeOrders: true, manageKitchen: false, accessBilling: false, manageStaff: false } },
  { id: 'staff-004', name: 'David Brown', role: 'chef', permissions: { seatCustomers: false, takeOrders: false, manageKitchen: true, accessBilling: false, manageStaff: false } },
  { id: 'staff-005', name: 'Eva Green', role: 'cashier', permissions: { seatCustomers: false, takeOrders: false, manageKitchen: false, accessBilling: true, manageStaff: false } },
];

function seedState() {
  return {
    tables: [
      { id: 1, capacity: 2, state: 'free', currentReservation: null, currentOrder: null, customerName: null, seatedAt: null },
      { id: 2, capacity: 2, state: 'free', currentReservation: null, currentOrder: null, customerName: null, seatedAt: null },
      { id: 3, capacity: 4, state: 'free', currentReservation: null, currentOrder: null, customerName: null, seatedAt: null },
      { id: 4, capacity: 4, state: 'free', currentReservation: null, currentOrder: null, customerName: null, seatedAt: null },
      { id: 5, capacity: 6, state: 'free', currentReservation: null, currentOrder: null, customerName: null, seatedAt: null },
      { id: 6, capacity: 8, state: 'free', currentReservation: null, currentOrder: null, customerName: null, seatedAt: null },
    ],
    orders: {},
    bills: {},
    history: [],
    kitchenCommands: [],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt store */
  }
  const state = seedState();
  saveState(state);
  return state;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mutate(fn) {
  const state = loadState();
  const result = fn(state);
  saveState(state);
  return result;
}

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function apiError(message, status = 400) {
  const err = new Error(message);
  err.response = { status, data: { error: message } };
  throw err;
}

function delay(data) {
  return Promise.resolve(data);
}

function getMenuItem(id) {
  return SEED_MENU.find((m) => m.id === id);
}

function getStaff(id) {
  return SEED_STAFF.find((s) => s.id === id);
}

function getTable(state, id) {
  return state.tables.find((t) => t.id === parseInt(id, 10));
}

function getOrder(state, id) {
  return state.orders[id];
}

function orderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.subtotal, 0);
}

function buildOrderItem(menuItem, quantity, notes = '') {
  return {
    id: uuid(),
    menuItem: { ...menuItem },
    quantity,
    notes,
    subtotal: menuItem.price * quantity,
  };
}

function orderToJSON(order) {
  return {
    ...order,
    total: orderTotal(order),
  };
}

function pricingStrategy(name) {
  switch (name) {
    case 'happyhour':
      return { name: 'HappyHour', calc: (total) => total * 0.8 };
    case 'loyalty':
      return {
        name: 'LoyaltyCard',
        calc: (order) => {
          const base = orderTotal(order) * 0.9;
          const beverages = order.items.filter((i) => i.menuItem.category === 'beverage');
          const freeDrink = beverages.length
            ? Math.min(...beverages.map((i) => i.menuItem.price))
            : 0;
          return Math.max(0, base - freeDrink);
        },
      };
    case 'group':
      return { name: 'GroupDiscount', calc: (total) => total * 0.85 };
    default:
      return { name: 'Standard', calc: (total) => total };
  }
}

function buildBill(order, strategyKey, tipPercent, tip, guests) {
  const strategy = pricingStrategy(strategyKey);
  const gross = orderTotal(order);
  const subtotal = strategyKey === 'loyalty'
    ? strategy.calc(order)
    : strategy.calc(gross);
  const discount = gross - subtotal;

  const lineItems = order.items.map((item) => ({
    description: `${item.menuItem.name} x${item.quantity}`,
    amount: item.subtotal,
  }));
  if (discount > 0) {
    lineItems.push({ description: `Discount (${strategy.name})`, amount: -discount });
  }

  const tax = subtotal * TAX_RATE;
  let tipAmount = 0;
  if (tipPercent !== undefined && !Number.isNaN(tipPercent)) {
    tipAmount = subtotal * (tipPercent / 100);
  } else if (tip !== undefined && !Number.isNaN(tip)) {
    tipAmount = tip;
  }

  const guestCount = guests && guests >= 1 ? guests : 1;
  const total = subtotal + tax + tipAmount;

  return {
    id: uuid(),
    orderId: order.id,
    tableId: order.tableId,
    lineItems,
    subtotal,
    tax,
    tip: tipAmount,
    total,
    perGuest: guestCount > 1 ? total / guestCount : null,
    guestCount,
    strategyName: strategy.name,
    paid: false,
    createdAt: new Date().toISOString(),
  };
}

function appendHistory(state, order, strategyName) {
  state.history.push({
    orderId: order.id,
    tableId: order.tableId,
    staffId: order.staffId,
    items: order.items.map((i) => ({
      name: i.menuItem.name,
      category: i.menuItem.category,
      quantity: i.quantity,
      price: i.menuItem.price,
    })),
    total: orderTotal(order),
    pricingStrategy: strategyName || 'Standard',
    timestamp: new Date().toISOString(),
    status: order.status,
  });
}

function getKitchenQueue(state) {
  const activeOrders = Object.values(state.orders)
    .filter((o) => ['confirmed', 'in_preparation', 'ready'].includes(o.status))
    .map(orderToJSON);

  return {
    activeOrders,
    pendingCommands: [],
    commandHistory: state.kitchenCommands.map((c) => c.description),
  };
}

function pushKitchenCommand(state, order, type, previousStatus) {
  const labels = { prepare: 'PrepareOrder', ready: 'MarkReady', cancel: 'CancelOrder' };
  state.kitchenCommands.push({
    type,
    orderId: order.id,
    previousStatus,
    description: `${labels[type]} #${order.id.slice(0, 8)} (Table ${order.tableId})`,
  });
}

export const tablesApi = {
  getAll: () => delay(loadState().tables),
  seat: (id, customerName) => delay(mutate((state) => {
    const table = getTable(state, id);
    if (!table) apiError('Table not found', 404);
    if (table.state !== 'free' && table.state !== 'reserved') {
      apiError(`Table ${id} cannot be seated — current state: ${table.state}`, 409);
    }
    table.state = 'occupied';
    table.customerName = customerName.trim();
    table.seatedAt = new Date().toISOString();
    return { ...table };
  })),
  clear: (id) => delay(mutate((state) => {
    const table = getTable(state, id);
    if (!table) apiError('Table not found', 404);
    table.state = 'free';
    table.currentReservation = null;
    table.currentOrder = null;
    table.customerName = null;
    table.seatedAt = null;
    return { ...table };
  })),
  requestBill: (id) => delay(mutate((state) => {
    const table = getTable(state, id);
    if (!table) apiError('Table not found', 404);
    if (table.state !== 'occupied') apiError(`Table ${id} must be occupied to request a bill`, 409);
    table.state = 'awaiting_bill';
    return { ...table };
  })),
};

export const menuApi = {
  getAll: () => delay([...SEED_MENU]),
};

export const staffApi = {
  getAll: () => delay([...SEED_STAFF]),
};

export const ordersApi = {
  getAll: (params = {}) => {
    let result = Object.values(loadState().orders).map(orderToJSON);
    if (params.tableId) result = result.filter((o) => String(o.tableId) === String(params.tableId));
    if (params.status) result = result.filter((o) => o.status === params.status);
    return delay(result);
  },
  create: (data) => delay(mutate((state) => {
    const { tableId, staffId, items, notes, customerName } = data;
    const table = getTable(state, tableId);
    if (!table) apiError('Table not found', 404);

    if (table.state !== 'occupied') {
      const name = typeof customerName === 'string' ? customerName.trim() : '';
      if (name && (table.state === 'free' || table.state === 'reserved')) {
        table.state = 'occupied';
        table.customerName = name;
        table.seatedAt = new Date().toISOString();
      } else {
        apiError('Table must be occupied to place an order', 409);
      }
    }

    const staff = getStaff(staffId);
    if (!staff) apiError('Staff member not found', 404);
    if (!staff.permissions.takeOrders) apiError('Staff member cannot take orders', 403);

    const orderItems = items.map((item) => {
      const menuItem = getMenuItem(item.menuItemId);
      if (!menuItem) apiError(`Menu item ${item.menuItemId} not found`, 404);
      const qty = parseInt(item.quantity, 10) || 1;
      if (qty < 1 || qty > 20) apiError('Quantity must be between 1 and 20', 400);
      return buildOrderItem(menuItem, qty, item.notes || '');
    });

    const now = new Date().toISOString();
    const order = {
      id: uuid(),
      tableId: String(tableId),
      staffId,
      items: orderItems,
      status: 'confirmed',
      createdAt: now,
      updatedAt: now,
      notes: notes ? String(notes).slice(0, 500) : '',
    };

    table.currentOrder = order.id;
    state.orders[order.id] = order;
    return orderToJSON(order);
  })),
  cancel: (id) => delay(mutate((state) => {
    const order = getOrder(state, id);
    if (!order) apiError('Order not found', 404);
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    return orderToJSON(order);
  })),
  serve: (id) => delay(mutate((state) => {
    const order = getOrder(state, id);
    if (!order) apiError('Order not found', 404);
    order.status = 'served';
    order.updatedAt = new Date().toISOString();
    return orderToJSON(order);
  })),
};

export const kitchenApi = {
  getQueue: () => delay(getKitchenQueue(loadState())),
  prepare: (orderId) => delay(mutate((state) => {
    const order = getOrder(state, orderId);
    if (!order) apiError('Order not found', 404);
    if (order.status !== 'confirmed') apiError('Order must be confirmed before preparation', 409);
    const previousStatus = order.status;
    order.status = 'in_preparation';
    order.updatedAt = new Date().toISOString();
    pushKitchenCommand(state, order, 'prepare', previousStatus);
    return { success: true, orderId: order.id, status: order.status, order: orderToJSON(order) };
  })),
  markReady: (orderId) => delay(mutate((state) => {
    const order = getOrder(state, orderId);
    if (!order) apiError('Order not found', 404);
    if (order.status !== 'in_preparation') apiError('Order must be in preparation', 409);
    const previousStatus = order.status;
    order.status = 'ready';
    order.updatedAt = new Date().toISOString();
    pushKitchenCommand(state, order, 'ready', previousStatus);
    return { success: true, orderId: order.id, status: order.status, order: orderToJSON(order) };
  })),
  cancel: (orderId) => delay(mutate((state) => {
    const order = getOrder(state, orderId);
    if (!order) apiError('Order not found', 404);
    const previousStatus = order.status;
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    pushKitchenCommand(state, order, 'cancel', previousStatus);
    return { success: true, orderId: order.id, status: order.status, order: orderToJSON(order) };
  })),
  undo: () => delay(mutate((state) => {
    const cmd = state.kitchenCommands.pop();
    if (!cmd) return { success: false, message: 'Nothing to undo' };
    const order = getOrder(state, cmd.orderId);
    if (order) {
      order.status = cmd.previousStatus;
      order.updatedAt = new Date().toISOString();
    }
    return {
      success: true,
      orderId: cmd.orderId,
      status: order?.status,
      undone: true,
    };
  })),
};

export const billsApi = {
  getAll: () => delay(Object.values(loadState().bills)),
  create: (data) => delay(mutate((state) => {
    const { orderId, pricingStrategy: strategyKey = 'standard', tip, tipPercent, guests } = data;
    const order = getOrder(state, orderId);
    if (!order) apiError('Order not found', 404);
    if (!['confirmed', 'in_preparation', 'ready', 'served'].includes(order.status)) {
      apiError('Order is not in a billable state', 409);
    }

    const bill = buildBill(
      order,
      strategyKey,
      tipPercent !== undefined ? parseFloat(tipPercent) : undefined,
      tip !== undefined ? parseFloat(tip) : undefined,
      guests !== undefined ? parseInt(guests, 10) : 1
    );

    state.bills[bill.id] = bill;
    appendHistory(state, order, bill.strategyName);

    const table = getTable(state, order.tableId);
    if (table && table.state === 'occupied') table.state = 'awaiting_bill';

    return bill;
  })),
  pay: (id) => delay(mutate((state) => {
    const bill = state.bills[id];
    if (!bill) apiError('Bill not found', 404);
    if (bill.paid) apiError('Bill already paid', 409);
    bill.paid = true;

    const order = getOrder(state, bill.orderId);
    if (order) {
      const table = getTable(state, order.tableId);
      if (table) {
        table.state = 'free';
        table.currentReservation = null;
        table.currentOrder = null;
        table.customerName = null;
        table.seatedAt = null;
      }
    }
    return { ...bill };
  })),
};

export const historyApi = {
  getAll: () => delay(loadState().history),
  getSummary: () => {
    const records = loadState().history;
    const totalRevenue = records.reduce((sum, r) => sum + r.total, 0);
    const counts = {};
    records.forEach((record) => {
      record.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    const topItems = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const revenue = {};
    records.forEach((record) => {
      record.items.forEach((item) => {
        revenue[item.category] = (revenue[item.category] || 0) + item.price * item.quantity;
      });
    });

    const hours = {};
    records.forEach((record) => {
      const h = new Date(record.timestamp).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });
    const peakHours = Object.entries(hours)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour, 10), count }));

    return delay({
      totalOrders: records.length,
      totalRevenue,
      averageOrderValue: records.length ? totalRevenue / records.length : 0,
      topItems,
      revenueByCategory: revenue,
      peakHours,
    });
  },
  getTopItems: () => {
    const records = loadState().history;
    const counts = {};
    records.forEach((record) => {
      record.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    const topItems = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    return delay(topItems);
  },
};

export function resetLocalStore() {
  localStorage.removeItem(STORAGE_KEY);
}
