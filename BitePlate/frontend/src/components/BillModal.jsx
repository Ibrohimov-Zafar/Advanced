import React, { useState, useEffect } from 'react';
import { ordersApi, billsApi } from '../utils/api';
import toast from 'react-hot-toast';
import ReceiptModal from './ReceiptModal';

const STRATEGIES = [
  { value: 'standard',  label: 'Oddiy narx',       desc: "Chegirmasiz to'liq narx",     emoji: '💰' },
  { value: 'happyhour', label: 'Baxtli soat',       desc: '20% chegirma barcha taomga',  emoji: '🎉' },
  { value: 'loyalty',   label: "Doimiy mijoz",      desc: "10% chegirma + 1 ta ichimlik",emoji: '⭐' },
  { value: 'group',     label: 'Guruh chegirmasi',  desc: '15% chegirma (6+ kishi)',      emoji: '👥' },
];

export default function BillModal({ table, onClose }) {
  const [tableOrders, setTableOrders]   = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [strategy, setStrategy]         = useState('standard');
  const [tipPercent, setTipPercent]     = useState('');
  const [guests, setGuests]             = useState('1');
  const [bill, setBill]                 = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [paying, setPaying]             = useState(false);
  const [receipt, setReceipt]           = useState(null); // paid bill shown as receipt

  useEffect(() => {
    ordersApi.getAll({ tableId: String(table.id) }).then((data) => {
      const billable = data.filter((o) =>
        ['confirmed', 'in_preparation', 'ready', 'served'].includes(o.status)
      );
      setTableOrders(billable);
      if (billable.length > 0) setSelectedOrder(billable[0].id);
    });
  }, [table.id]);

  async function handleGenerateBill() {
    if (!selectedOrder) { toast.error('Buyurtmani tanlang'); return; }
    setSubmitting(true);
    try {
      const data = await billsApi.create({
        orderId:         selectedOrder,
        pricingStrategy: strategy,
        tipPercent:      tipPercent ? parseFloat(tipPercent) : undefined,
        guests:          parseInt(guests) || 1,
      });
      setBill(data);
      toast.success('Hisob yaratildi');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    if (!bill) return;
    setPaying(true);
    try {
      await billsApi.pay(bill.id);
      toast.success("To'lov qabul qilindi! Stol tozalandi.", { duration: 3000, icon: '✅' });
      setReceipt(bill); // trigger receipt display
    } catch (err) {
      toast.error(err.response?.data?.error || "To'lovda xatolik");
      setPaying(false);
    }
  }

  const selectedStrategy = STRATEGIES.find((s) => s.value === strategy);

  // Show receipt after payment
  if (receipt) {
    return (
      <ReceiptModal
        bill={receipt}
        table={table}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">🧾</div>
            <div>
              <h3 className="text-white font-bold text-lg">Hisob-kitob</h3>
              <p className="text-gray-500 text-sm">{table.id}-stol • {table.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-xl">✕</button>
        </div>

        {!bill ? (
          <div className="space-y-5">
            {tableOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400">Hisoblash mumkin bo'lgan buyurtma topilmadi</p>
              </div>
            ) : (
              <>
                {/* Order select */}
                <div>
                  <label className="label">Buyurtma</label>
                  <select className="input" value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
                    {tableOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        #{o.id.slice(0, 8)} — ${o.total.toFixed(2)} ({o.items.length} ta taom)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strategy */}
                <div>
                  <label className="label">Narxlash usuli</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STRATEGIES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setStrategy(s.value)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          strategy === s.value
                            ? 'bg-violet-600/20 border-violet-500/50 text-white'
                            : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{s.emoji}</span>
                          <span className="text-xs font-semibold">{s.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip & Guests */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Chayqa (%)</label>
                    <input className="input" type="number" min="0" max="100" placeholder="0"
                      value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Mehmonlar soni</label>
                    <input className="input" type="number" min="1" max="20"
                      value={guests} onChange={(e) => setGuests(e.target.value)} />
                  </div>
                </div>

                <button onClick={handleGenerateBill} disabled={submitting} className="btn btn-primary w-full">
                  {submitting ? 'Hisoblanmoqda...' : 'Hisob yaratish'}
                </button>
              </>
            )}
            <button onClick={onClose} className="btn btn-ghost w-full">Yopish</button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Strategy badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <span>{selectedStrategy?.emoji}</span>
              <span className="text-violet-300 text-sm font-medium">{selectedStrategy?.label}</span>
              <span className="text-gray-500 text-xs ml-auto">{bill.strategyName}</span>
            </div>

            {/* Line items */}
            <div className="bg-white/[0.03] rounded-xl p-4 space-y-2">
              {bill.lineItems.map((item, i) => (
                <div key={i} className={`flex justify-between text-sm py-1 ${i < bill.lineItems.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                  <span className="text-gray-300">{item.description}</span>
                  <span className={item.amount < 0 ? 'text-red-400 font-medium' : 'text-white'}>
                    {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t border-white/[0.08] pt-2 space-y-1.5 mt-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Asosiy summa</span><span>${bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Soliq (8%)</span><span>${bill.tax.toFixed(2)}</span>
                </div>
                {bill.tip > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Chayqa</span><span>${bill.tip.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/[0.08]">
                <span className="text-white font-bold">Jami to'lov</span>
                <span className="text-emerald-400 font-bold text-xl">${bill.total.toFixed(2)}</span>
              </div>

              {bill.perGuest && bill.guestCount > 1 && (
                <div className="flex justify-between text-sm mt-1 px-3 py-2 bg-amber-500/10 rounded-lg">
                  <span className="text-amber-300">Har bir kishi ({bill.guestCount} ta)</span>
                  <span className="text-amber-400 font-bold">${bill.perGuest.toFixed(2)}</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="btn btn-success w-full text-base py-3"
            >
              {paying ? 'Qayta ishlanmoqda...' : '💳  To\'lovni qabul qilish'}
            </button>
            <button onClick={onClose} className="btn btn-ghost w-full">Yopish</button>
          </div>
        )}
      </div>
    </div>
  );
}
