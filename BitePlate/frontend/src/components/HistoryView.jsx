import React, { useState, useEffect } from 'react';
import { historyApi } from '../utils/api';
import toast from 'react-hot-toast';

const CAT = { starter: 'Salatlar', main: 'Asosiy', dessert: 'Desert', beverage: 'Ichimlik', combo: 'Kompleks' };

export default function HistoryView() {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([historyApi.getSummary(), historyApi.getAll()])
      .then(([s, r]) => { setSummary(s); setRecords(r); })
      .catch(() => toast.error("Ma'lumot yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600 text-sm">Yuklanmoqda...</p>
    </div>
  );

  const maxItem = summary?.topItems?.[0]?.count || 1;
  const maxCat  = summary?.revenueByCategory ? Math.max(...Object.values(summary.revenueByCategory)) : 1;

  return (
    <div className="space-y-6 fade-up">

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon="📦" label="Jami buyurtmalar" val={summary?.totalOrders ?? 0}         accent="indigo"  />
        <Kpi icon="💵" label="Jami daromad"      val={`$${(summary?.totalRevenue??0).toFixed(2)}`}  accent="emerald" />
        <Kpi icon="🧾" label="O'rtacha hisob"    val={`$${(summary?.averageOrderValue??0).toFixed(2)}`} accent="amber" />
        <Kpi icon="🏆" label="Eng ommabop taom"  val={summary?.topItems?.[0]?.name ?? '—'} accent="violet" small />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Top items */}
        {(summary?.topItems?.length ?? 0) > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">🥇</span>
              <p className="text-white font-bold text-sm">Eng ommabop taomlar</p>
            </div>
            <div className="space-y-3.5">
              {summary.topItems.map((item, i) => {
                const pct = Math.round((item.count / maxItem) * 100);
                const medals = ['🥇','🥈','🥉'];
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{medals[i] || `${i+1}.`}</span>
                        <span className="text-gray-200 text-sm">{item.name}</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">{item.count}x</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Revenue by category */}
        {summary?.revenueByCategory && Object.keys(summary.revenueByCategory).length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">📊</span>
              <p className="text-white font-bold text-sm">Kategoriya bo'yicha daromad</p>
            </div>
            <div className="space-y-3.5">
              {Object.entries(summary.revenueByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, rev]) => {
                  const pct = Math.round((rev / maxCat) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-gray-200 text-sm">{CAT[cat] || cat}</span>
                        <span className="text-amber-400 font-bold text-sm">${rev.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Records */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <p className="text-white font-bold text-sm">To'lovlar tarixi</p>
          </div>
          <span className="badge bg-white/5 text-gray-500 border border-white/[0.06]">{records.length} yozuv</span>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-2xl mb-3">📭</div>
            <p className="text-gray-500 text-sm font-medium">Hali hech qanday to'lov yo'q</p>
            <p className="text-gray-700 text-xs mt-1">To'lov qabul qilingandan so'ng bu yerda ko'rinadi</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto">
            {[...records].reverse().map((r, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                    {r.tableId}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">#{r.orderId?.slice(0,8)}</p>
                    <p className="text-gray-600 text-[10px]">{new Date(r.timestamp).toLocaleString('uz-UZ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">${r.total?.toFixed(2)}</p>
                  <p className="text-gray-700 text-[10px]">{r.pricingStrategy}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ icon, label, val, accent, small }) {
  const t = { indigo: 'text-indigo-400', emerald: 'text-emerald-400', amber: 'text-amber-400', violet: 'text-violet-400' };
  const b = { indigo: 'border-indigo-500/15', emerald: 'border-emerald-500/15', amber: 'border-amber-500/15', violet: 'border-violet-500/15' };
  return (
    <div className={`card border ${b[accent]} p-4`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-tight">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`font-bold ${small ? 'text-sm truncate' : 'text-2xl'} ${t[accent]}`}>{val}</p>
    </div>
  );
}
