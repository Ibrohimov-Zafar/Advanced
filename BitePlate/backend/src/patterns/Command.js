// PATTERN 1: Command Pattern — Kitchen Action Queue
// Each kitchen action is encapsulated as an object with execute() and undo()

// Command interface (simulated via base class)
class KitchenCommand {
  execute() { throw new Error('execute() must be implemented'); }
  undo() { throw new Error('undo() must be implemented'); }
  getDescription() { return 'KitchenCommand'; }
}

class PrepareOrderCommand extends KitchenCommand {
  constructor(order) {
    super();
    this.order = order;
    this.previousStatus = order.status;
  }

  execute() {
    this.order.startPreparation();
    return { success: true, orderId: this.order.id, status: this.order.status };
  }

  undo() {
    this.order.status = this.previousStatus;
    this.order.updatedAt = new Date().toISOString();
    return { success: true, orderId: this.order.id, status: this.order.status, undone: true };
  }

  getDescription() {
    return `PrepareOrder #${this.order.id.slice(0, 8)} (Table ${this.order.tableId})`;
  }
}

class CancelOrderCommand extends KitchenCommand {
  constructor(order) {
    super();
    this.order = order;
    this.previousStatus = order.status;
  }

  execute() {
    this.order.cancel();
    return { success: true, orderId: this.order.id, status: this.order.status };
  }

  undo() {
    this.order.status = this.previousStatus;
    this.order.updatedAt = new Date().toISOString();
    return { success: true, orderId: this.order.id, status: this.order.status, undone: true };
  }

  getDescription() {
    return `CancelOrder #${this.order.id.slice(0, 8)} (Table ${this.order.tableId})`;
  }
}

class ReadyOrderCommand extends KitchenCommand {
  constructor(order) {
    super();
    this.order = order;
    this.previousStatus = order.status;
  }

  execute() {
    this.order.markReady();
    return { success: true, orderId: this.order.id, status: this.order.status };
  }

  undo() {
    this.order.status = this.previousStatus;
    this.order.updatedAt = new Date().toISOString();
    return { success: true, orderId: this.order.id, status: this.order.status, undone: true };
  }

  getDescription() {
    return `MarkReady #${this.order.id.slice(0, 8)} (Table ${this.order.tableId})`;
  }
}

// Invoker: KitchenQueue stores history and supports undo
class KitchenQueue {
  constructor() {
    this._queue = [];       // pending commands
    this._history = [];     // executed commands
  }

  enqueue(command) {
    this._queue.push(command);
    return { queued: true, description: command.getDescription(), queueLength: this._queue.length };
  }

  executeNext() {
    if (this._queue.length === 0) return { success: false, message: 'Queue is empty' };
    const command = this._queue.shift();
    const result = command.execute();
    this._history.push(command);
    return result;
  }

  executeCommand(command) {
    const result = command.execute();
    this._history.push(command);
    return result;
  }

  undoLast() {
    if (this._history.length === 0) return { success: false, message: 'Nothing to undo' };
    const command = this._history.pop();
    return command.undo();
  }

  getQueue() {
    return this._queue.map((c) => c.getDescription());
  }

  getHistory() {
    return this._history.map((c) => c.getDescription());
  }
}

module.exports = { KitchenQueue, PrepareOrderCommand, CancelOrderCommand, ReadyOrderCommand };
