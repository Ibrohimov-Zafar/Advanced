import axios from 'axios';
import * as localStore from './localStore';

const USE_LOCAL = process.env.NODE_ENV === 'production';

const api = axios.create({
  baseURL: '/api',
});

const remote = {
  tablesApi: {
    getAll: () => api.get('/tables').then((r) => r.data),
    seat: (id, customerName) => api.post(`/tables/${id}/seat`, { customerName }).then((r) => r.data),
    clear: (id) => api.post(`/tables/${id}/clear`).then((r) => r.data),
    requestBill: (id) => api.post(`/tables/${id}/request-bill`).then((r) => r.data),
  },
  menuApi: {
    getAll: () => api.get('/menu').then((r) => r.data),
  },
  staffApi: {
    getAll: () => api.get('/staff').then((r) => r.data),
  },
  ordersApi: {
    getAll: (params) => api.get('/orders', { params }).then((r) => r.data),
    create: (data) => api.post('/orders', data).then((r) => r.data),
    cancel: (id) => api.patch(`/orders/${id}/cancel`).then((r) => r.data),
    serve: (id) => api.patch(`/orders/${id}/serve`).then((r) => r.data),
  },
  kitchenApi: {
    getQueue: () => api.get('/kitchen/queue').then((r) => r.data),
    prepare: (orderId) => api.post('/kitchen/prepare', { orderId }).then((r) => r.data),
    markReady: (orderId) => api.post('/kitchen/ready', { orderId }).then((r) => r.data),
    cancel: (orderId) => api.post('/kitchen/cancel', { orderId }).then((r) => r.data),
    undo: () => api.post('/kitchen/undo').then((r) => r.data),
  },
  billsApi: {
    create: (data) => api.post('/bills', data).then((r) => r.data),
    pay: (id) => api.post(`/bills/${id}/pay`).then((r) => r.data),
    getAll: () => api.get('/bills').then((r) => r.data),
  },
  historyApi: {
    getSummary: () => api.get('/history/summary').then((r) => r.data),
    getAll: () => api.get('/history').then((r) => r.data),
    getTopItems: () => api.get('/history/top-items').then((r) => r.data),
  },
};

const active = USE_LOCAL ? localStore : remote;

export const tablesApi = active.tablesApi;
export const menuApi = active.menuApi;
export const staffApi = active.staffApi;
export const ordersApi = active.ordersApi;
export const kitchenApi = active.kitchenApi;
export const billsApi = active.billsApi;
export const historyApi = active.historyApi;

export const isLocalStorageMode = USE_LOCAL;
