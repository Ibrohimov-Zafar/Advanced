import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tablesApi, menuApi, staffApi, kitchenApi } from '../utils/api';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [staff, setStaff] = useState([]);
  const [kitchenQueue, setKitchenQueue] = useState({ activeOrders: [], pendingCommands: [], commandHistory: [] });
  const [loading, setLoading] = useState(true);

  const refreshTables = useCallback(async () => {
    try {
      const data = await tablesApi.getAll();
      setTables(data);
    } catch {
      toast.error('Failed to load tables');
    }
  }, []);

  const refreshKitchen = useCallback(async () => {
    try {
      const data = await kitchenApi.getQueue();
      setKitchenQueue(data);
    } catch {
      toast.error('Failed to load kitchen queue');
    }
  }, []);

  useEffect(() => {
    Promise.all([
      tablesApi.getAll().then(setTables),
      menuApi.getAll().then(setMenu),
      staffApi.getAll().then(setStaff),
      kitchenApi.getQueue().then(setKitchenQueue),
    ])
      .catch(() => toast.error('Failed to load initial data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppContext.Provider value={{ tables, menu, staff, kitchenQueue, loading, refreshTables, refreshKitchen }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
