import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import TablesView  from './components/TablesView';
import KitchenView from './components/KitchenView';
import HistoryView from './components/HistoryView';
import StaffView   from './components/StaffView';
import TutorialView from './components/TutorialView';
import TourGuide   from './components/TourGuide';

const NAV = [
  {
    id: 'tables', label: 'Stollar', tourId: 'tour-nav-tables',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" /></svg>,
  },
  {
    id: 'kitchen', label: 'Oshxona', tourId: 'tour-nav-kitchen',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>,
  },
  {
    id: 'history', label: 'Statistika', tourId: 'tour-nav-history',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    id: 'staff', label: 'Xodimlar', tourId: 'tour-nav-staff',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m4-10a4 4 0 118 0 4 4 0 01-8 0zm13 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" /></svg>,
  },
  {
    id: 'tutorial', label: "Qo'llanma", tourId: 'tour-nav-tutorial', highlight: true,
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
];

const PAGE_TITLES = {
  tables: { title: 'Stol Boshqaruvi', sub: 'Barcha stollar holati va buyurtmalar' },
  kitchen: { title: 'Oshxona Navbati', sub: 'Faol buyurtmalar va tayyorlanish holati' },
  history: { title: 'Statistika va Tahlil', sub: 'Daromad, ommabop taomlar, to\'lov tarixi' },
  staff: { title: 'Xodimlar', sub: 'Rol va ruxsatlar boshqaruvi' },
  tutorial: { title: "Foydalanish Qo'llanmasi", sub: 'Bosqichma-bosqich tizimdan foydalanish yo\'riqnomasi' },
};

function Layout() {
  const [active, setActive] = useState('tables');
  const page = PAGE_TITLES[active];

  const views = {
    tables: <TablesView />,
    kitchen: <KitchenView />,
    history: <HistoryView />,
    staff: <StaffView />,
    tutorial: <TutorialView />,
  };

  return (
    <div className="min-h-screen bg-[#060912] flex">

      {/* ── Sidebar ──────────────────────────────── */}
      <aside
        id="tour-sidebar"
        className="w-60 bg-[#080c16] border-r border-white/[0.05] flex flex-col fixed inset-y-0 left-0 z-20"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-[15px] leading-none tracking-tight">BitePlate</h1>
              <p className="text-gray-600 text-[10px] mt-0.5 font-medium">Restoran tizimi</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 text-[9px] font-bold text-gray-700 uppercase tracking-[0.15em] mb-2">
            Asosiy Bo'limlar
          </p>
          {NAV.map((item) => (
            <button
              key={item.id}
              id={item.tourId}
              onClick={() => setActive(item.id)}
              className={`nav-item ${active === item.id ? 'nav-active' : 'nav-inactive'}`}
            >
              <span className={active === item.id ? 'text-indigo-400' : 'text-gray-600'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.highlight && active !== item.id && (
                <span className="ml-auto badge bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[9px]">
                  Yangi
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Online indicator */}
        <div className="px-5 py-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-indigo-900/80 flex items-center justify-center text-[10px] font-bold text-indigo-300">BP</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#080c16]" />
            </div>
            <div>
              <p className="text-gray-300 text-xs font-medium">Tizim Faol</p>
              <p className="text-gray-700 text-[10px]">BTEC L5 · Unit 27</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <main className="flex-1 ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-[#060912]/80 backdrop-blur-2xl border-b border-white/[0.05] px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-[15px] tracking-tight">{page.title}</h2>
              <p className="text-gray-600 text-xs mt-0.5">{page.sub}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-500 text-[11px] font-medium">Jonli rejim</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 fade-up">
          {views[active]}
        </div>
      </main>

      {/* Tour guide */}
      <TourGuide />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f1420',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            fontSize: '13px',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0f1420' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#0f1420' } },
        }}
      />
      <Layout />
    </AppProvider>
  );
}
