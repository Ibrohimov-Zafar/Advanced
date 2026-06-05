import React from 'react';
import { useApp } from '../context/AppContext';

const ROLES = {
  manager: { label: 'Menejer',   emoji: '👔', color: 'violet', border: 'border-violet-500/20', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  waiter:  { label: 'Ofitsiant', emoji: '🧑‍🍳', color: 'blue',   border: 'border-blue-500/20',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  chef:    { label: 'Oshpaz',    emoji: '👨‍🍳', color: 'amber',  border: 'border-amber-500/20',  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  cashier: { label: 'Kassir',    emoji: '💰', color: 'emerald', border: 'border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

const PERMS = {
  seatCustomers:  { label: "Mijoz o'tqazish",       icon: '🪑' },
  takeOrders:     { label: 'Buyurtma qabul qilish', icon: '🍽️' },
  manageKitchen:  { label: 'Oshxonani boshqarish',  icon: '🔥' },
  accessBilling:  { label: 'Hisob-kitob',           icon: '🧾' },
  manageStaff:    { label: 'Xodimlar boshqaruvi',   icon: '👥' },
};

const TEXT_C = { violet: 'text-violet-400', blue: 'text-blue-400', amber: 'text-amber-400', emerald: 'text-emerald-400' };

export default function StaffView() {
  const { staff } = useApp();
  const total = Object.keys(PERMS).length;

  return (
    <div className="space-y-6 fade-up">

      {/* Role summary */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(ROLES).map(([role, meta]) => {
          const count = staff.filter(s => s.role === role).length;
          return (
            <div key={role} className={`card border ${meta.border} p-4 flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-xl bg-${meta.color}-500/10 border ${meta.border} flex items-center justify-center text-xl`}>
                {meta.emoji}
              </div>
              <div>
                <p className={`text-xl font-bold ${TEXT_C[meta.color]}`}>{count}</p>
                <p className="text-gray-600 text-[10px] font-medium">{meta.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map(member => {
          const meta = ROLES[member.role] || ROLES.waiter;
          const allowed = Object.values(member.permissions || {}).filter(Boolean).length;
          const pct = Math.round((allowed / total) * 100);

          return (
            <div key={member.id} className={`card border ${meta.border} overflow-hidden`}>
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-${meta.color}-500/10 border ${meta.border} flex items-center justify-center text-2xl shrink-0`}>
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{member.name}</p>
                  <span className={`badge border ${meta.badge} text-[10px]`}>{meta.label}</span>
                </div>
                {/* Permission ring */}
                <div className="shrink-0 relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none"
                      stroke={meta.color === 'violet' ? '#a78bfa' : meta.color === 'blue' ? '#60a5fa' : meta.color === 'amber' ? '#fbbf24' : '#34d399'}
                      strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${pct * 0.974} 97.4`} />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${TEXT_C[meta.color]}`}>
                    {allowed}/{total}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/[0.05]" />

              {/* Permissions */}
              <div className="p-4 space-y-2">
                {Object.entries(PERMS).map(([key, perm]) => {
                  const on = member.permissions?.[key];
                  return (
                    <div key={key} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors ${on ? 'bg-white/[0.03]' : ''}`}>
                      <span className={`text-sm ${on ? '' : 'opacity-30'}`}>{perm.icon}</span>
                      <span className={`text-xs flex-1 ${on ? 'text-gray-300' : 'text-gray-700'}`}>{perm.label}</span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0
                        ${on ? `bg-${meta.color}-500/20 text-${meta.color === 'violet' ? 'violet' : meta.color === 'blue' ? 'blue' : meta.color === 'amber' ? 'amber' : 'emerald'}-400` : 'bg-white/[0.05] text-gray-700'}`}>
                        {on ? '✓' : '×'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ID */}
              <div className="px-4 py-2.5 border-t border-white/[0.05]">
                <p className="text-[9px] text-gray-800 font-mono tracking-wider">{member.id}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
