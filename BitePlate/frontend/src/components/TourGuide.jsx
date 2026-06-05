import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

/* ─────────────────────────────────────────────────────────────
   TOUR STEPS  (target: CSS selector | 'center' for modal)
───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    target: 'center',
    emoji: '👋',
    title: "BitePlate'ga xush kelibsiz!",
    accent: '#6366f1',
    body: (
      <>
        Bu yerda siz restoran ish jarayonining <strong style={{color:'#a5b4fc'}}>barcha bosqichlarini</strong> boshqarasiz —
        stol egallashdan to'lov chekigacha.<br/><br/>
        Keling, tizimni birga ko'rib chiqaylik!<br/>
        <span style={{color:'#818cf8', fontWeight:600}}>Atigi 2–3 daqiqa vaqtingizni olamiz.</span>
      </>
    ),
  },
  {
    target: '#tour-sidebar',
    placement: 'right',
    emoji: '🗂️',
    title: 'Asosiy Menyu',
    accent: '#6366f1',
    body: (
      <>
        Chap tarafdagi menyu orqali barcha bo'limlarga o'tasiz:
        <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:6}}>
          {[['🍽️','#34d399','Stollar','stol boshqaruvi'],
            ['🔥','#fbbf24','Oshxona','buyurtmalar navbati'],
            ['📊','#60a5fa','Statistika','daromad tahlili'],
            ['👥','#a78bfa','Xodimlar','rol va ruxsatlar'],
          ].map(([ic,cl,name,desc])=>(
            <div key={name} style={{display:'flex',alignItems:'center',gap:8}}>
              <span>{ic}</span>
              <span style={{color:cl,fontWeight:700,fontSize:12}}>{name}</span>
              <span style={{color:'#6b7280',fontSize:11}}>— {desc}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    target: '#tour-tables-grid',
    placement: 'bottom',
    emoji: '🟢',
    title: 'Stol holatlari',
    accent: '#10b981',
    body: (
      <>
        Har bir stol <strong style={{color:'#6ee7b7'}}>rang bilan belgilanadi</strong>:
        <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:6}}>
          {[['#10b981',"Bo'sh",'o\'tirishi mumkin'],
            ['#f59e0b','Egallangan','taom yeyapti'],
            ['#8b5cf6','Hisob kutmoqda','to\'lov kutilmoqda'],
            ['#3b82f6','Band','oldindan bron'],
          ].map(([cl,lbl,desc])=>(
            <div key={lbl} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:cl,flexShrink:0}}/>
              <span style={{color:'#f3f4f6',fontWeight:600,fontSize:12}}>{lbl}</span>
              <span style={{color:'#6b7280',fontSize:11}}>— {desc}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    target: '#tour-seat-btn',
    placement: 'top',
    emoji: '🪑',
    title: "Mijoz o'tqazish",
    accent: '#10b981',
    body: (
      <>
        Bo'sh stoldagi <strong style={{color:'#6ee7b7'}}>"Mijoz o'tqazish"</strong> tugmasini bosing.
        <ol style={{marginTop:10, paddingLeft:16, color:'#9ca3af', fontSize:12, lineHeight:1.8}}>
          <li>Mijoz ismini kiriting</li>
          <li>Xodimni tanlang</li>
          <li>"Tasdiqlash" tugmasini bosing</li>
        </ol>
        <div style={{marginTop:10,padding:'8px 12px',background:'rgba(16,185,129,0.1)',borderRadius:10,color:'#34d399',fontSize:11}}>
          💡 Stol holati "Egallangan"ga o'zgaradi
        </div>
      </>
    ),
  },
  {
    target: '#tour-nav-kitchen',
    placement: 'right',
    emoji: '🔥',
    title: 'Oshxona Boshqaruvi',
    accent: '#f59e0b',
    body: (
      <>
        <strong style={{color:'#fde68a'}}>Oshxona</strong> bo'limida buyurtmalarni 3 bosqichda boshqarasiz:
        <div style={{display:'flex',gap:8,marginTop:12}}>
          {[['⏳','#3b82f6','Navbatda'],['🔥','#f59e0b','Tayyorlanmoqda'],['✅','#10b981','Tayyor']].map(([ic,cl,lbl])=>(
            <div key={lbl} style={{flex:1,textAlign:'center',padding:'8px 6px',borderRadius:10,border:`1px solid ${cl}40`,background:`${cl}10`}}>
              <div style={{fontSize:18}}>{ic}</div>
              <div style={{color:cl,fontSize:10,fontWeight:700,marginTop:4}}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,padding:'8px 12px',background:'rgba(245,158,11,0.1)',borderRadius:10,color:'#fbbf24',fontSize:11}}>
          💡 "Ortga qaytarish" — Command Pattern: oxirgi amalni bekor qiladi
        </div>
      </>
    ),
  },
  {
    target: '#tour-nav-history',
    placement: 'right',
    emoji: '📊',
    title: 'Statistika va Tahlil',
    accent: '#3b82f6',
    body: (
      <>
        Menejer uchun to'liq hisobot:
        <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:6}}>
          {[['💵','Jami daromad va o\'rtacha hisob'],
            ['🏆','TOP-5 ommabop taomlar'],
            ['📈','Kategoriya bo\'yicha grafik'],
            ['📋','Barcha to\'lovlar tarixi'],
          ].map(([ic,txt])=>(
            <div key={txt} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:12,color:'#9ca3af'}}>
              <span style={{flexShrink:0}}>{ic}</span><span>{txt}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,padding:'8px 12px',background:'rgba(59,130,246,0.1)',borderRadius:10,color:'#60a5fa',fontSize:11}}>
          💡 Singleton Design Pattern — bitta global jurnal
        </div>
      </>
    ),
  },
  {
    target: '#tour-nav-tutorial',
    placement: 'right',
    emoji: '📚',
    title: "Qo'llanma sahifasi",
    accent: '#f59e0b',
    body: (
      <>
        <strong style={{color:'#fde68a'}}>Qo'llanma</strong> sahifasida barcha funksiyalar haqida batafsil ma'lumot:
        <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:6}}>
          {[['📋','Bosqichma-bosqich ko\'rsatmalar'],
            ['💳','4 ta narxlash usuli tushuntirishi'],
            ['🏗️','Design Pattern\'lar haqida'],
            ['❓','Ko\'p so\'raladigan savollar'],
          ].map(([ic,txt])=>(
            <div key={txt} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:12,color:'#9ca3af'}}>
              <span style={{flexShrink:0}}>{ic}</span><span>{txt}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    target: 'center',
    emoji: '🎉',
    title: 'Tayyor! Boshlashingiz mumkin',
    accent: '#10b981',
    body: (
      <>
        Siz BitePlate tizimidan foydalanishni o'rgandingiz!
        <div style={{marginTop:12,padding:12,background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:12}}>
          <div style={{color:'#10b981',fontWeight:700,fontSize:11,marginBottom:6}}>Eslatmalar:</div>
          {[['📚',"Qo'llanma sahifasida batafsil ma'lumot"],
            ['🔄','Pastdagi "Tour" tugmasi — qayta boshlash'],
            ['❓','FAQ bo\'limida javoblar'],
          ].map(([ic,txt])=>(
            <div key={txt} style={{display:'flex',gap:8,fontSize:11,color:'#9ca3af',marginTop:4}}>
              <span>{ic}</span><span>{txt}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   UTILITY: get element rect relative to viewport
───────────────────────────────────────────────────────────── */
function getRect(selector) {
  if (!selector || selector === 'center') return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

function calcTooltipPos(rect, placement, tw, th) {
  const pad = 16;
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;

  if (!rect) return { top: vh/2 - th/2, left: vw/2 - tw/2 };

  let top, left;

  if (placement === 'right') {
    top  = rect.top + rect.height/2 - th/2;
    left = rect.right + pad;
  } else if (placement === 'left') {
    top  = rect.top + rect.height/2 - th/2;
    left = rect.left - tw - pad;
  } else if (placement === 'bottom') {
    top  = rect.bottom + pad;
    left = rect.left + rect.width/2 - tw/2;
  } else { // top
    top  = rect.top - th - pad;
    left = rect.left + rect.width/2 - tw/2;
  }

  // clamp
  top  = Math.max(8, Math.min(top,  vh - th - 8));
  left = Math.max(8, Math.min(left, vw - tw - 8));
  return { top, left };
}

/* ─────────────────────────────────────────────────────────────
   TOOLTIP CARD
───────────────────────────────────────────────────────────── */
function Tooltip({ step, index, total, onPrev, onNext, onSkip, style }) {
  const pct = ((index + 1) / total) * 100;

  return (
    <div style={{
      position: 'fixed',
      width: 340,
      backgroundColor: 'rgb(10, 13, 25)',
      background: 'linear-gradient(145deg, rgb(14,18,32) 0%, rgb(10,13,25) 100%)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20,
      boxShadow: '0 40px 100px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
      overflow: 'hidden',
      zIndex: 100000,
      fontFamily: 'Inter, sans-serif',
      animation: 'tourFadeIn 0.2s ease',
      isolation: 'isolate',
      ...style,
    }}>
      {/* Accent bar */}
      <div style={{height:3, background:'#1e2535', position:'relative'}}>
        <div style={{
          height:'100%',
          width:`${pct}%`,
          background:`linear-gradient(90deg, ${step.accent}, ${step.accent}cc)`,
          transition:'width 0.4s ease',
          borderRadius:3,
        }}/>
      </div>

      <div style={{padding:'20px 20px 0'}}>
        {/* Top row */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:22}}>{step.emoji}</span>
            <div style={{
              padding:'3px 10px',
              background:`${step.accent}18`,
              border:`1px solid ${step.accent}40`,
              borderRadius:20,
              color: step.accent,
              fontSize:10,
              fontWeight:700,
              letterSpacing:'0.05em',
            }}>
              {index+1} / {total}
            </div>
          </div>
          <button onClick={onSkip} style={{
            background:'transparent',border:'none',color:'#4b5563',cursor:'pointer',
            fontSize:18,lineHeight:1,padding:4,borderRadius:6,
            transition:'color 0.15s',
          }} onMouseEnter={e=>e.target.style.color='#9ca3af'} onMouseLeave={e=>e.target.style.color='#4b5563'}>
            ✕
          </button>
        </div>

        {/* Title */}
        <div style={{fontSize:16,fontWeight:700,color:'#f9fafb',marginBottom:10,lineHeight:1.3}}>
          {step.title}
        </div>

        {/* Body */}
        <div style={{fontSize:12.5,color:'#9ca3af',lineHeight:1.7}}>
          {step.body}
        </div>
      </div>

      {/* Buttons */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',gap:8}}>
        <button onClick={onSkip} style={{
          background:'transparent',border:'1px solid rgba(255,255,255,0.08)',
          color:'#6b7280',cursor:'pointer',borderRadius:10,padding:'7px 14px',
          fontSize:11,fontWeight:600,fontFamily:'inherit',transition:'all 0.15s',
        }} onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,0.05)';e.target.style.color='#9ca3af'}}
           onMouseLeave={e=>{e.target.style.background='transparent';e.target.style.color='#6b7280'}}>
          O'tkazib yuborish
        </button>

        <div style={{display:'flex',gap:8}}>
          {index > 0 && (
            <button onClick={onPrev} style={{
              background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',
              color:'#d1d5db',cursor:'pointer',borderRadius:10,padding:'7px 14px',
              fontSize:11,fontWeight:600,fontFamily:'inherit',transition:'all 0.15s',
            }} onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.1)'}
               onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.06)'}>
              ← Orqaga
            </button>
          )}
          <button onClick={onNext} style={{
            background: index === total-1 ? '#10b981' : step.accent,
            border:'none',color:'#fff',cursor:'pointer',borderRadius:10,
            padding:'7px 18px',fontSize:11,fontWeight:700,fontFamily:'inherit',
            transition:'opacity 0.15s',boxShadow:`0 4px 16px ${step.accent}40`,
          }} onMouseEnter={e=>e.target.style.opacity='0.85'}
             onMouseLeave={e=>e.target.style.opacity='1'}>
            {index === total-1 ? '🎉 Tugatish' : 'Keyingi →'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SPOTLIGHT: dims page, highlights target
   Muammo: alohida blur <div> spotlight teshigini ham qorartiradi.
   Yechim: faqat bitta SVG + mask — hech qanday backdrop-filter yo'q.
───────────────────────────────────────────────────────────── */
function Spotlight({ rect, accent }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Center modal — to'liq qora overlay (blur bilan)
  if (!rect) {
    return ReactDOM.createPortal(
      <div style={{
        position:'fixed', inset:0,
        backgroundColor:'rgba(0,0,0,0.88)',
        backdropFilter:'blur(10px)',
        WebkitBackdropFilter:'blur(10px)',
        zIndex:99997,
        pointerEvents:'none',
      }} />,
      document.body
    );
  }

  // Element spotlight: faqat SVG mask — div overlay YO'Q
  const pad = 12;
  const x   = Math.max(0, rect.left   - pad);
  const y   = Math.max(0, rect.top    - pad);
  const w   = rect.width  + pad * 2;
  const h   = rect.height + pad * 2;

  return ReactDOM.createPortal(
    <svg
      style={{
        position:'fixed', inset:0,
        width:'100%', height:'100%',
        zIndex:99997,
        pointerEvents:'none',
        overflow:'visible',
      }}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="none"
    >
      <defs>
        <mask id="bp-spotlight-mask">
          {/* Hamma joyni oq (ko'rinadigan qatlam) */}
          <rect width={vw} height={vh} fill="white" />
          {/* Spotlight teshigi — qora (overlay teshadi) */}
          <rect x={x} y={y} width={w} height={h} rx={16} fill="black" />
        </mask>
      </defs>

      {/* Qorong'i overlay — faqat teshik joyi ochiq qoladi */}
      <rect
        width={vw} height={vh}
        fill="rgba(0,0,0,0.80)"
        mask="url(#bp-spotlight-mask)"
      />

      {/* Yaltiroq ramka */}
      <rect
        x={x} y={y} width={w} height={h} rx={16}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        opacity="0.95"
      />
      {/* Tashqi glow */}
      <rect
        x={x-3} y={y-3} width={w+6} height={h+6} rx={19}
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.25"
      />
    </svg>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function TourGuide() {
  const [active, setActive]     = useState(false);
  const [index,  setIndex]      = useState(0);
  const [pos,    setPos]        = useState({ top: 0, left: 0 });
  const [rect,   setRect]       = useState(null);
  const TW = 340, TH = 360;

  const step = STEPS[index];

  // Inject keyframe animation once
  useEffect(() => {
    if (document.getElementById('tour-style')) return;
    const s = document.createElement('style');
    s.id = 'tour-style';
    s.textContent = `@keyframes tourFadeIn { from { opacity:0; transform:scale(0.95) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }`;
    document.head.appendChild(s);
  }, []);

  // Auto-start on first visit
  useEffect(() => {
    const done = localStorage.getItem('bp_tour_done');
    if (!done) {
      const t = setTimeout(() => setActive(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  // Recalculate tooltip position when step changes
  useEffect(() => {
    if (!active) return;
    const r = getRect(step.target);
    setRect(r);

    if (step.target === 'center') {
      setPos({
        top:  window.innerHeight / 2 - TH / 2,
        left: window.innerWidth  / 2 - TW / 2,
      });
    } else {
      // scroll element into view first
      const el = document.querySelector(step.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // wait for scroll then position
      setTimeout(() => {
        const r2 = getRect(step.target);
        setRect(r2);
        setPos(calcTooltipPos(r2, step.placement || 'bottom', TW, TH));
      }, 300);
    }
  }, [active, index]);

  function next() {
    if (index < STEPS.length - 1) { setIndex(i => i + 1); }
    else { end(); }
  }
  function prev() { if (index > 0) setIndex(i => i - 1); }
  function end()  { setActive(false); localStorage.setItem('bp_tour_done', '1'); }
  function start(){ setIndex(0); setActive(true); }

  return (
    <>
      {/* ── Floating restart button ── */}
      {!active && (
        <button onClick={start} style={{
          position:'fixed', bottom:24, right:24, zIndex:9998,
          display:'flex', alignItems:'center', gap:8,
          padding:'10px 20px', borderRadius:50,
          background:'linear-gradient(135deg,#6366f1,#4f46e5)',
          color:'#fff', fontFamily:'Inter,sans-serif',
          fontSize:13, fontWeight:700, border:'none', cursor:'pointer',
          boxShadow:'0 8px 32px rgba(99,102,241,0.5)',
          transition:'transform 0.2s, box-shadow 0.2s',
          animation:'tourFadeIn 0.3s ease',
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 12px 40px rgba(99,102,241,0.6)'}}
        onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 8px 32px rgba(99,102,241,0.5)'}}>
          <span style={{fontSize:16}}>🎯</span> Tour
        </button>
      )}

      {/* ── Active tour ── */}
      {active && ReactDOM.createPortal(
        <>
          {/* Overlay + spotlight */}
          <Spotlight rect={rect} accent={step.accent} />

          {/* Click outside to close */}
          <div style={{position:'fixed',inset:0,zIndex:99999}} onClick={end} />

          {/* Tooltip */}
          <Tooltip
            step={step}
            index={index}
            total={STEPS.length}
            onPrev={prev}
            onNext={next}
            onSkip={end}
            style={{ top: pos.top, left: pos.left }}
          />
        </>,
        document.body
      )}
    </>
  );
}
