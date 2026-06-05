import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { tablesApi } from '../utils/api';
import toast from 'react-hot-toast';
import OrderModal from './OrderModal';
import BillModal  from './BillModal';

const STATE = {
  free:          { label: "Bo'sh",          dot: 'bg-emerald-400',  ring: 'ring-emerald-500/20', card: 'border-emerald-500/15 hover:border-emerald-500/35', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  reserved:      { label: 'Band',           dot: 'bg-blue-400',     ring: 'ring-blue-500/20',    card: 'border-blue-500/15 hover:border-blue-500/35',    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  occupied:      { label: 'Egallangan',     dot: 'bg-amber-400',    ring: 'ring-amber-500/20',   card: 'border-amber-500/15 hover:border-amber-500/35',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  awaiting_bill: { label: 'Hisob kutmoqda', dot: 'bg-violet-400',   ring: 'ring-violet-500/20',  card: 'border-violet-500/15 hover:border-violet-500/35', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  cleared:       { label: 'Tozalangan',     dot: 'bg-gray-600',     ring: 'ring-gray-600/20',    card: 'border-white/[0.05] hover:border-white/[0.1]',    badge: 'bg-gray-800 text-gray-500 border-gray-700' },
};

export default function TablesView() {
  const { tables, staff, refreshTables, refreshKitchen } = useApp();
  const [seatModal, setSeatModal] = useState(null);
  const [orderModal, setOrderModal] = useState(null);
  const [billModal,  setBillModal]  = useState(null);
  const [name,       setName]       = useState('');
  const [selStaff,   setSelStaff]   = useState('');

  const waiters = staff.filter(s => ['waiter','manager'].includes(s.role));

  const counts = {
    free:     tables.filter(t => t.state === 'free').length,
    occupied: tables.filter(t => t.state === 'occupied').length,
    awaiting: tables.filter(t => t.state === 'awaiting_bill').length,
    total:    tables.length,
  };

  async function handleSeat(table) {
    if (!name.trim())  { toast.error('Mijoz ismini kiriting'); return; }
    if (!selStaff)     { toast.error('Xodimni tanlang'); return; }
    try {
      await tablesApi.seat(table.id, name.trim());
      await refreshTables();
      setSeatModal(null); setName('');
      toast.success(`${table.id}-stol egallandi`);
    } catch (e) { toast.error(e.response?.data?.error || 'Xatolik'); }
  }

  async function handleClear(id) {
    try {
      await tablesApi.clear(id);
      await refreshTables();
      toast.success(`${id}-stol tozalandi`);
    } catch { toast.error('Tozalashda xatolik'); }
  }

  return (
    <div className="space-y-6 fade-up">

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Bo'sh",       val: counts.free,     color: 'emerald', icon: '🟢' },
          { label: 'Egallangan',  val: counts.occupied, color: 'amber',   icon: '🟡' },
          { label: 'Hisob kutish',val: counts.awaiting, color: 'violet',  icon: '🟣' },
          { label: 'Jami stol',   val: counts.total,    color: 'gray',    icon: '⬜' },
        ].map(k => (
          <div key={k.label}
            className={`card border-l-2 ${k.color === 'gray' ? 'border-white/10' : `border-${k.color}-500/50`} px-4 py-3 flex items-center gap-3`}>
            <span className="text-xl">{k.icon}</span>
            <div>
              <p className={`text-xl font-bold ${k.color === 'gray' ? 'text-gray-300' : `text-${k.color}-400`}`}>{k.val}</p>
              <p className="text-gray-600 text-[10px] font-medium">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tables grid ── */}
      <div id="tour-tables-grid" className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tables.map(table => {
          const s = STATE[table.state] || STATE.free;
          const isFirstFree = table.state === 'free' && tables.find(t=>t.state==='free')?.id === table.id;
          const isFirstOccupied = table.state === 'occupied' && tables.find(t=>t.state==='occupied')?.id === table.id;
          return (
            <div key={table.id}
              className={`card border transition-all duration-200 ring-1 ${s.ring} ${s.card} group`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between p-4 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-2 h-2 rounded-full ${s.dot} ${table.state === 'in_preparation' ? 'animate-pulse' : ''}`} />
                    <span className="text-white font-bold text-sm">{table.id}-stol</span>
                  </div>
                  <p className="text-gray-700 text-[10px]">{table.capacity} kishi sig'adi</p>
                </div>
                <span className={`badge border ${s.badge}`}>{s.label}</span>
              </div>

              {/* Guest name */}
              {table.customerName && (
                <div className="mx-4 mb-3 px-3 py-2 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                  <p className="text-[10px] text-gray-600 mb-0.5">Mijoz</p>
                  <p className="text-white text-sm font-medium truncate">{table.customerName}</p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-white/[0.05] mx-4" />

              {/* Actions */}
              <div className="p-3 flex flex-col gap-2">
                {table.state === 'free' && (
                  <button
                    id={isFirstFree ? 'tour-seat-btn' : undefined}
                    onClick={() => { setSeatModal(table); setSelStaff(waiters[0]?.id || ''); }}
                    className="btn btn-sm btn-success w-full"
                  >
                    <span>🪑</span> Mijoz o'tqazish
                  </button>
                )}

                {table.state === 'occupied' && (
                  <div className="flex gap-2">
                    <button
                      id={isFirstOccupied ? 'tour-order-btn' : undefined}
                      onClick={() => setOrderModal(table)}
                      className="btn btn-sm btn-warning flex-1"
                    >
                      🍽️ Buyurtma
                    </button>
                    <button
                      id={isFirstOccupied ? 'tour-bill-btn' : undefined}
                      onClick={() => setBillModal(table)}
                      className="btn btn-sm btn-primary flex-1"
                    >
                      🧾 Hisob
                    </button>
                  </div>
                )}

                {['occupied','awaiting_bill','cleared'].includes(table.state) && (
                  <button onClick={() => handleClear(table.id)}
                    className="btn btn-sm btn-ghost w-full text-gray-500 text-[11px]">
                    Stolni tozalash
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Seat modal ── */}
      {seatModal && (
        <div className="modal-backdrop" onClick={() => setSeatModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-2xl">🪑</div>
              <div>
                <h3 className="text-white font-bold">Mijoz o'tqazish</h3>
                <p className="text-gray-600 text-xs">{seatModal.id}-stol · {seatModal.capacity} kishi sig'adi</p>
              </div>
              <button onClick={() => setSeatModal(null)} className="ml-auto text-gray-700 hover:text-gray-400 text-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Mijoz ismi</label>
                <input className="input" placeholder="Masalan: Karimov Jasur"
                  value={name} onChange={e => setName(e.target.value)} maxLength={80} autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSeat(seatModal)}
                />
              </div>
              <div>
                <label className="label">Xizmat ko'rsatuvchi xodim</label>
                <select className="input" value={selStaff} onChange={e => setSelStaff(e.target.value)}>
                  <option value="">Tanlang...</option>
                  {waiters.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role === 'manager' ? 'Menejer' : 'Ofitsiant'})</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => handleSeat(seatModal)} className="btn btn-success flex-1">✓ Tasdiqlash</button>
              <button onClick={() => setSeatModal(null)} className="btn btn-ghost flex-1">Bekor</button>
            </div>
          </div>
        </div>
      )}

      {orderModal && <OrderModal table={orderModal} staffId={selStaff || waiters[0]?.id}
        onClose={() => { setOrderModal(null); refreshTables(); refreshKitchen(); }} />}
      {billModal  && <BillModal  table={billModal}
        onClose={() => { setBillModal(null); refreshTables(); }} />}
    </div>
  );
}
