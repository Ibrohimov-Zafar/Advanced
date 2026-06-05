const fs = require('fs');
const os = require('os');
const path = require('path');
const { Table } = require('../models/Table');
const { Waiter, Chef, Cashier, Manager } = require('../models/Staff');
const { Starter, MainCourse, Dessert, Beverage, SetMeal } = require('../models/MenuItem');
const { KitchenQueue } = require('../patterns/Command');

const STORE_PATH = path.join(os.tmpdir(), 'biteplate-store.json');

function createMenuItems() {
  const menuItems = [
    new Starter('m-001', 'Garlic Bread', 4.50, ['gluten']),
    new Starter('m-002', 'Soup of the Day', 5.00, []),
    new Starter('m-003', 'Bruschetta', 6.00, ['gluten']),
    new Starter('m-004', 'Prawn Cocktail', 7.50, ['shellfish']),
    new MainCourse('m-005', 'Grilled Chicken', 14.00, []),
    new MainCourse('m-006', 'Beef Burger', 13.50, ['gluten', 'dairy']),
    new MainCourse('m-007', 'Vegetable Pasta', 11.00, ['gluten', 'dairy']),
    new MainCourse('m-008', 'Salmon Fillet', 16.00, ['fish']),
    new MainCourse('m-009', 'Margherita Pizza', 12.00, ['gluten', 'dairy']),
    new Dessert('m-010', 'Chocolate Cake', 5.50, ['gluten', 'dairy', 'eggs']),
    new Dessert('m-011', 'Cheesecake', 5.00, ['gluten', 'dairy']),
    new Dessert('m-012', 'Fruit Sorbet', 4.00, []),
    new Beverage('m-013', 'Still Water', 1.50, []),
    new Beverage('m-014', 'Sparkling Water', 2.00, []),
    new Beverage('m-015', 'Orange Juice', 3.00, []),
    new Beverage('m-016', 'Soft Drink', 2.50, []),
    new Beverage('m-017', 'House Wine (glass)', 5.50, ['sulphites']),
    new Beverage('m-018', 'Craft Beer', 4.50, ['gluten']),
  ];

  const setMeals = [
    new SetMeal('sm-001', 'Business Lunch', [menuItems[0], menuItems[4], menuItems[12]], 0.10),
    new SetMeal('sm-002', 'Family Deal', [menuItems[2], menuItems[5], menuItems[9], menuItems[14]], 0.15),
  ];

  return { menuItems, setMeals };
}

function createSeedStore() {
  const { menuItems, setMeals } = createMenuItems();

  return {
    tables: [
      new Table(1, 2), new Table(2, 2), new Table(3, 4),
      new Table(4, 4), new Table(5, 6), new Table(6, 8),
    ],
    staff: [
      new Manager('staff-001', 'Alice Johnson'),
      new Waiter('staff-002', 'Bob Smith'),
      new Waiter('staff-003', 'Carol White'),
      new Chef('staff-004', 'David Brown'),
      new Cashier('staff-005', 'Eva Green'),
    ],
    menuItems,
    setMeals,
    orders: new Map(),
    bills: new Map(),
    kitchenQueue: new KitchenQueue(),
  };
}

function serializeTables(tables) {
  return tables.map((t) => ({
    id: t.id,
    capacity: t.capacity,
    state: t.state,
    currentReservation: t.currentReservation,
    currentOrder: t.currentOrder,
    customerName: t.customerName,
    seatedAt: t.seatedAt,
  }));
}

function applyTableSnapshot(tables, snapshot) {
  snapshot.forEach((saved) => {
    const table = tables.find((t) => t.id === saved.id);
    if (!table) return;
    table.state = saved.state;
    table.currentReservation = saved.currentReservation;
    table.currentOrder = saved.currentOrder;
    table.customerName = saved.customerName;
    table.seatedAt = saved.seatedAt;
  });
}

function loadPersistedTables() {
  if (!process.env.VERCEL) return null;
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data.tables) ? data.tables : null;
  } catch {
    return null;
  }
}

function initStore() {
  if (globalThis.__biteplateStore) return globalThis.__biteplateStore;

  const store = createSeedStore();
  const savedTables = loadPersistedTables();
  if (savedTables) applyTableSnapshot(store.tables, savedTables);

  globalThis.__biteplateStore = store;
  return store;
}

function persistStore() {
  if (!process.env.VERCEL || !globalThis.__biteplateStore) return;
  try {
    fs.writeFileSync(
      STORE_PATH,
      JSON.stringify({ tables: serializeTables(globalThis.__biteplateStore.tables) })
    );
  } catch (err) {
    console.error('Failed to persist BitePlate store:', err.message);
  }
}

const store = initStore();
const { tables, staff, menuItems, setMeals, orders, bills, kitchenQueue } = store;

function getTableById(id) {
  return tables.find((t) => t.id === parseInt(id, 10));
}

function getMenuItemById(id) {
  return [...menuItems, ...setMeals].find((m) => m.id === id);
}

function getStaffById(id) {
  return staff.find((s) => s.id === id);
}

module.exports = {
  tables,
  staff,
  menuItems,
  setMeals,
  orders,
  bills,
  kitchenQueue,
  getTableById,
  getMenuItemById,
  getStaffById,
  persistStore,
};
