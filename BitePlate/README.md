# BitePlate — Smart Restaurant Management System

**Unit 27: Advanced Programming | BTEC Level 5 | Y/615/1651**

## Language & IDE Justification

This project uses **JavaScript (Node.js + React)** for the following reasons:

JavaScript was chosen as the implementation language because it enables a full-stack solution with a single language across both the backend REST API (Node.js/Express) and the interactive frontend (React). This reduces cognitive overhead when switching contexts, and the event-driven, non-blocking architecture of Node.js maps naturally to a restaurant system where multiple concurrent requests (orders, kitchen updates, billing) must be handled efficiently. React's component model aligns well with the modular design pattern architecture required by this assignment — each pattern can be encapsulated in its own module and composed cleanly. The IDE used is VS Code with ESLint for linting and Prettier for formatting.

## Architecture Overview

```
BitePlate/
├── backend/                  # Node.js + Express REST API (port 5000)
│   └── src/
│       ├── models/           # Core domain classes (OOP)
│       │   ├── MenuItem.js   # Abstract base + Starter/Main/Dessert/Beverage/SetMeal
│       │   ├── Order.js      # Order, OrderItem with state transitions
│       │   ├── Table.js      # Table with State pattern lifecycle
│       │   ├── Staff.js      # Staff hierarchy (Manager/Waiter/Chef/Cashier)
│       │   └── Bill.js       # Facade over tax/tip/split-bill logic
│       ├── patterns/         # Design pattern implementations
│       │   ├── Command.js    # PATTERN 1: KitchenQueue + Commands (undo/redo)
│       │   ├── Singleton.js  # PATTERN 2: OrderHistoryLog (global audit log)
│       │   └── Strategy.js   # PATTERN 3: Pricing strategies (swappable at runtime)
│       ├── routes/           # Express REST endpoints
│       └── middleware/       # Input validation
└── frontend/                 # React SPA (port 3000)
    └── src/
        ├── components/       # UI views (Tables, Kitchen, Analytics, Staff)
        ├── context/          # React Context (global state)
        └── utils/            # Axios API client
```

## Design Patterns Implemented

| Pattern | Category | Location | Purpose |
|---------|----------|----------|---------|
| **Command** | Behavioural | `patterns/Command.js` | Kitchen queue with undo/redo |
| **Singleton** | Creational | `patterns/Singleton.js` | Global order history log |
| **Strategy** | Behavioural | `patterns/Strategy.js` | Runtime pricing/discount swapping |
| **State** | Behavioural | `models/Table.js` | Table lifecycle (Free→Reserved→Occupied→Awaiting Bill→Cleared) |
| **Composite** | Structural | `models/MenuItem.js` | SetMeal treats items and combos uniformly |
| **Facade** | Structural | `models/Bill.js` | Single billing interface over tax/tip/split complexity |
| **Factory Method** | Creational | `patterns/Strategy.js` | `getPricingStrategy()` factory |

## Setup & Run Instructions

### Prerequisites
- Node.js 18+ and npm

### Backend
```bash
cd backend
npm install
npm start
# API available at http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# App available at http://localhost:3000
```

### Run Both (two terminals)
Terminal 1: `cd backend && npm start`
Terminal 2: `cd frontend && npm start`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tables` | List all tables with state |
| POST | `/api/tables/:id/seat` | Seat customer at table |
| POST | `/api/tables/:id/clear` | Clear table after payment |
| GET | `/api/menu` | List all menu items |
| GET | `/api/staff` | List all staff with permissions |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | List orders (filter by tableId/status) |
| GET | `/api/kitchen/queue` | View active kitchen orders |
| POST | `/api/kitchen/prepare` | Start preparation (Command pattern) |
| POST | `/api/kitchen/ready` | Mark order ready (Command pattern) |
| POST | `/api/kitchen/undo` | Undo last kitchen action |
| POST | `/api/bills` | Generate bill (Strategy pattern applied) |
| POST | `/api/bills/:id/pay` | Process payment, clear table |
| GET | `/api/history/summary` | Analytics dashboard (Singleton) |

## OOP Concepts Demonstrated

- **Encapsulation**: `Bill` hides tax/tip/split logic behind clean methods
- **Inheritance**: `MenuItem → Starter/MainCourse/Dessert/Beverage`; `Staff → Waiter/Chef/Cashier/Manager`
- **Polymorphism**: `getPrice()` called uniformly on `MenuItem` and `SetMeal`; `calculateTotal()` swapped via Strategy
- **Abstraction**: `MenuItem` and `PricingStrategy` throw errors if base methods called directly
- **Generics/Containers**: `Map<string, Order>` for O(1) order lookup; `Array<KitchenCommand>` for history

## Screenshots

See `screenshots/` folder for:
1. Table management — seating and order flow
2. Kitchen queue — prepare/cancel/undo
3. Billing — strategy selection and bill generation
4. Analytics dashboard — order history and top items
