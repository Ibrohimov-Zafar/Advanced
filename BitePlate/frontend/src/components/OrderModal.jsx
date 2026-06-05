import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ordersApi } from '../utils/api';
import toast from 'react-hot-toast';

const CATS = {
  starter:  { label: 'Salatlar',       emoji: '🥗' },
  main:     { label: 'Asosiy Taomlar', emoji: '🍖' },
  dessert:  { label: 'Desertlar',      emoji: '🍰' },
  beverage: { label: 'Ichimliklar',    emoji: '🥤' },
  combo:    { label: 'Kompleks',       emoji: '🎁' },
};

export default function OrderModal({ table, staffId, onClose }) {
  const { menu, staff } = useApp();
  const [cart, setCart]       = useState([]);
  const [selStaff, setSelStaff] = useState(staffId || staff[0]?.id || '');
  const [activeCat, setActiveCat] = useState('main');
  const [submitting, setSubmitting] = useState(false);

  const waiters   = staff.filter(s => ['waiter','manager'].includes(s.role));
  const categories = [...new Set(menu.map(m => m.category))];

  function addToCart(item) {
    setCart(prev => {
      const ex = prev.find(c => c.menuItemId === item.id);
      return ex
        ? prev.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c)
        : [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }
  function changeQty(id, delta) {
    setCart(prev => prev.map(c => c.menuItemId === id ? { ...c, quantity: c.quantity + delta } : c).filter(c => c.quantity > 0));
  }

  const total     = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  async function submit() {
    if (!cart.length) { toast.error('Kamida 1 ta taom tanlang'); return; }
    setSubmitting(true);
    try {
      await ordersApi.create({
        tableId: String(table.id),
        staffId: selStaff,
        customerName: table.customerName,
        items:   cart.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
      });
      toast.success('Buyurtma oshxonaga yuborildi!');
      onClose();
    } catch (e) { toast.error(e.response?.data?.error || 'Xatolik'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0">🍽️</div>
          <div className="flex-1">
            <h3 className="text-white font-bold">Buyurtma berish</h3>
            <p className="text-gray-600 text-xs">{table.id}-stol · {table.customerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-400 text-lg">✕</button>
        </div>

        <div className="flex gap-5 h-[62vh]">

          {/* ── Menu panel ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Cat tabs */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {categories.map(cat => {
                const m = CATS[cat] || { label: cat, emoji: '🍴' };
                return (
                  <button key={cat} onClick={() => setActiveCat(cat)}
                    className={`btn-sm flex items-center gap-1.5 ${activeCat === cat ? 'btn-primary' : 'btn-ghost'}`}>
                    <span>{m.emoji}</span>
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {menu.filter(m => m.category === activeCat).map(item => {
                const inCart = cart.find(c => c.menuItemId === item.id);
                return (
                  <div key={item.id} onClick={() => addToCart(item)}
                    className={`flex justify-between items-center rounded-xl p-3.5 cursor-pointer transition-all border
                      ${inCart
                        ? 'bg-indigo-600/10 border-indigo-500/30'
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'
                      }`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm truncate">{item.name}</p>
                        {inCart && <span className="badge bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 shrink-0">{inCart.quantity}x</span>}
                      </div>
                      {item.allergens?.length > 0 && (
                        <p className="text-[10px] text-amber-500/80 mt-0.5">⚠️ {item.allergens.join(', ')}</p>
                      )}
                    </div>
                    <span className="text-emerald-400 font-bold text-sm ml-3 shrink-0">${item.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Cart panel ── */}
          <div className="w-52 shrink-0 flex flex-col border-l border-white/[0.06] pl-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Savat</p>
              {cartCount > 0 && <span className="badge bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">{cartCount} ta</span>}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="text-3xl mb-2">🛒</span>
                  <p className="text-gray-700 text-xs">Taomni bosib qo'shing</p>
                </div>
              )}
              {cart.map(item => (
                <div key={item.menuItemId} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5">
                  <p className="text-white text-xs font-medium leading-tight mb-2 truncate">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => changeQty(item.menuItemId, -1)}
                        className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center font-bold">−</button>
                      <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => changeQty(item.menuItemId, 1)}
                        className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center font-bold">+</button>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">${(item.price*item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] pt-3 mt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">Jami</span>
                <span className="text-emerald-400 font-bold text-base">${total.toFixed(2)}</span>
              </div>
              <select className="input py-2 text-xs" value={selStaff} onChange={e => setSelStaff(e.target.value)}>
                {waiters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={submit} disabled={submitting || !cart.length} className="btn btn-warning w-full">
                {submitting ? 'Yuborilmoqda...' : '📤 Oshxonaga yuborish'}
              </button>
              <button onClick={onClose} className="btn btn-ghost w-full text-xs">Bekor qilish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
