import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { kitchenApi } from '../utils/api';
import toast from 'react-hot-toast';

const COL = {
  confirmed:      { label: 'Navbatda',       icon: '⏳', color: 'blue',    dot: 'bg-blue-400' },
  in_preparation: { label: 'Tayyorlanmoqda', icon: '🔥', color: 'amber',   dot: 'bg-amber-400 animate-pulse' },
  ready:          { label: 'Tayyor!',         icon: '✅', color: 'emerald', dot: 'bg-emerald-400' },
};

const BORDER = { blue: 'border-blue-500/20 hover:border-blue-500/40', amber: 'border-amber-500/20 hover:border-amber-500/40', emerald: 'border-emerald-500/20 hover:border-emerald-500/40' };
const BG     = { blue: 'bg-blue-500/[0.07]',  amber: 'bg-amber-500/[0.07]',  emerald: 'bg-emerald-500/[0.07]' };
const HEAD   = { blue: 'text-blue-400 border-blue-500/20 bg-blue-500/10', amber: 'text-amber-400 border-amber-500/20 bg-amber-500/10', emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' };

export default function KitchenView() {
  const { kitchenQueue, refreshKitchen, refreshTables } = useApp();
  const [busy, setBusy] = useState('');

  async function act(fn, key, msg) {
    setBusy(key);
    try { await fn(); await Promise.all([refreshKitchen(), refreshTables()]); toast.success(msg); }
    catch (e) { toast.error(e.response?.data?.error || 'Xatolik'); }
    finally { setBusy(''); }
  }

  const { activeOrders = [], commandHistory = [] } = kitchenQueue;
  const cols = {
    confirmed:      activeOrders.filter(o => o.status === 'confirmed'),
    in_preparation: activeOrders.filter(o => o.status === 'in_preparation'),
    ready:          activeOrders.filter(o => o.status === 'ready'),
  };

  return (
    <div className="space-y-5 fade-up">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3">
        {Object.entries(COL).map(([key, meta]) => (
          <div key={key} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${HEAD[meta.color]} text-sm font-semibold`}>
            <span>{meta.icon}</span>
            <span>{cols[key].length} ta {meta.label}</span>
          </div>
        ))}
        <button
          id="tour-undo-btn"
          onClick={() => act(
            () => kitchenApi.undo().then(r => { if (!r.success) throw new Error(r.message); return r; }),
            'undo', 'Oxirgi amal bekor qilindi'
          )}
          disabled={!!busy || commandHistory.length === 0}
          className="btn btn-ghost ml-auto disabled:opacity-30"
        >
          ↩ Ortga qaytarish
        </button>
      </div>

      {/* ── Kanban ── */}
      {activeOrders.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-4xl mb-4">👨‍🍳</div>
          <p className="text-white font-semibold">Oshxona hozircha bo'sh</p>
          <p className="text-gray-600 text-sm mt-1">Buyurtma qabul qilingach shu yerda ko'rinadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(COL).map(([status, meta]) => (
            <div key={status} className="card flex flex-col">
              <div className={`card-header rounded-t-2xl ${HEAD[meta.color]} border-b`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">{meta.icon}</span>
                  <span className="font-bold text-sm">{meta.label}</span>
                </div>
                <span className="badge border border-current/30">{cols[status].length}</span>
              </div>

              <div className="p-3 flex-1 space-y-3 min-h-[120px] overflow-y-auto">
                {cols[status].length === 0 && (
                  <p className="text-gray-700 text-xs text-center py-6">Bo'sh</p>
                )}
                {cols[status].map(order => (
                  <div key={order.id} className={`rounded-xl border ${BORDER[meta.color]} ${BG[meta.color]} p-3.5 transition-all`}>
                    <div className="flex justify-between items-start mb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                          <span className="text-white font-bold text-sm">{order.tableId}-stol</span>
                        </div>
                        <span className="text-gray-700 text-[9px] font-mono">#{order.id.slice(0,8)}</span>
                      </div>
                      <span className="text-gray-600 text-[9px]">
                        {new Date(order.createdAt).toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'})}
                      </span>
                    </div>

                    <div className="space-y-0.5 mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-gray-300 truncate">{item.menuItem.name}</span>
                          <span className="text-gray-600 shrink-0 ml-1">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      {order.status === 'confirmed' && (
                        <button disabled={!!busy}
                          onClick={() => act(() => kitchenApi.prepare(order.id), `p${order.id}`, 'Tayyorlanish boshlandi')}
                          className="btn-sm btn-warning w-full">🔥 Tayyorlashni boshlash</button>
                      )}
                      {order.status === 'in_preparation' && (
                        <button disabled={!!busy}
                          onClick={() => act(() => kitchenApi.markReady(order.id), `r${order.id}`, 'Buyurtma tayyor!')}
                          className="btn-sm btn-success w-full">✅ Tayyor deb belgilash</button>
                      )}
                      <button disabled={!!busy}
                        onClick={() => act(() => kitchenApi.cancel(order.id), `c${order.id}`, 'Bekor qilindi')}
                        className="btn-sm btn-ghost w-full text-red-500/70 hover:text-red-400 border-red-500/10 text-[11px]">
                        ✕ Bekor qilish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Command history ── */}
      {commandHistory.length > 0 && (
        <div className="card p-4">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Amallar tarixi (Command Pattern)</p>
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
            {[...commandHistory].reverse().map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500 bg-white/[0.02] rounded-lg px-3 py-1.5">
                <span className="text-gray-700 font-mono w-5 text-right">{commandHistory.length - i}.</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
