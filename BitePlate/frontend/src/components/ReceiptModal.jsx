import React, { useRef, useEffect } from 'react';

const STRATEGY_LABELS = {
  Standard:      { uz: 'Oddiy narx',         emoji: '💰' },
  HappyHour:     { uz: 'Baxtli soat (-20%)', emoji: '🎉' },
  LoyaltyCard:   { uz: 'Doimiy mijoz',        emoji: '⭐' },
  GroupDiscount: { uz: 'Guruh chegirma',      emoji: '👥' },
};

export default function ReceiptModal({ bill, table, onClose }) {
  const receiptRef = useRef();
  const modalShellRef = useRef();
  const backdropRef = useRef();

  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const shell = modalShellRef.current;
      const receipt = receiptRef.current;
      const backdrop = backdropRef.current;
      const shellH = shell?.offsetHeight ?? 0;
      const receiptH = receipt?.offsetHeight ?? 0;
      const backdropScrollH = backdrop?.scrollHeight ?? 0;
      const backdropClientH = backdrop?.clientHeight ?? 0;
      const shellRect = shell?.getBoundingClientRect();
      const overflowsTop = shellRect ? shellRect.top < 0 : false;
      const overflowsBottom = shellRect ? shellRect.bottom > vh : false;
      const itemCount = bill.lineItems.filter(l => l.amount > 0).length;
      // #region agent log
      fetch('http://127.0.0.1:7534/ingest/484400c1-8656-4463-b5ce-62b41f74882b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b5ead1'},body:JSON.stringify({sessionId:'b5ead1',location:'ReceiptModal.jsx:useEffect',message:'modal layout measure',data:{vh,vw,shellH,receiptH,backdropScrollH,backdropClientH,shellTop:shellRect?.top,shellBottom:shellRect?.bottom,overflowsTop,overflowsBottom,itemCount,exceedsViewport:shellH>vh-32,maxHeightApplied:vh-32},timestamp:Date.now(),hypothesisId:'H1-H5',runId:'post-fix'})}).catch(()=>{});
      // #endregion
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [bill.lineItems]);

  const now       = new Date();
  const receiptNo = `BP-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${bill.id.slice(0,6).toUpperCase()}`;
  const timeStr   = now.toLocaleTimeString('uz-UZ',  { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const dateStr   = now.toLocaleDateString('uz-UZ',  { day:'2-digit', month:'2-digit', year:'numeric' });
  const stratLabel = STRATEGY_LABELS[bill.strategyName] || { uz: bill.strategyName, emoji: '💳' };

  const discount  = bill.lineItems.find(l => l.amount < 0);
  const itemLines = bill.lineItems.filter(l => l.amount > 0);
  const grossSum  = itemLines.reduce((s,l) => s + l.amount, 0);
  const fiscalNo  = String(Math.floor(Math.random() * 9000) + 1000);

  function handlePrint() {
    const printWin = window.open('', '_blank', 'width=420,height=750');
    printWin.document.write(`
      <html>
        <head>
          <title>BitePlate Chek #${receiptNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:'Courier Prime','Courier New',monospace; background:#fff; color:#111;
                   font-size:12px; padding:20px 16px; width:320px; }
            .center { text-align:center; }
            .row { display:flex; justify-content:space-between; margin-bottom:2px; }
            .bold { font-weight:700; }
            .sep { border-top:1px dashed #aaa; margin:8px 0; }
            .sep2 { border-top:2px solid #222; border-bottom:2px solid #222; margin:8px 0; padding:6px 0; }
            .red { color:#c00; }
          </style>
        </head>
        <body>${receiptRef.current.innerHTML}
          <script>window.onload=()=>{window.print();window.close();}<\/script>
        </body>
      </html>
    `);
    printWin.document.close();
  }

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      style={{ alignItems: 'flex-start', overflowY: 'auto', padding: '16px 12px' }}
      onClick={onClose}
    >
      <div
        ref={modalShellRef}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0a0d19',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 420,
          maxHeight: 'calc(100vh - 32px)',
          margin: 'auto',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}> 
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'rgba(16,185,129,0.15)',
              border:'1px solid rgba(16,185,129,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18,
            }}>🧾</div>
            <div>
              <div style={{ color:'#f9fafb', fontWeight:700, fontSize:14, fontFamily:'Inter,sans-serif' }}>To'lov cheki</div>
              <div style={{ color:'#10b981', fontSize:11, fontFamily:'Inter,sans-serif', fontWeight:500 }}>✓ Muvaffaqiyatli to'landi</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
            background:'rgba(255,255,255,0.04)', color:'#6b7280', cursor:'pointer',
            fontSize:16, display:'flex', alignItems:'center', justifyContent:'center',
          }}>✕</button>
        </div>

        {/* Receipt — ichki scroll, header/footer doim ko'rinadi */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 18px' }}>
          <div
            ref={receiptRef}
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              background: '#fafaf7',
              color: '#111',
              borderRadius: 6,
              fontSize: '11.5px',
              lineHeight: 1.65,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Torn top */}
            <div style={{ height:10, background:'repeating-linear-gradient(90deg,#fafaf7 0,#fafaf7 6px,#ddd 6px,#ddd 8px)' }} />

            <div style={{ padding:'14px 20px 16px' }}>

              {/* Logo */}
              <div style={{ textAlign:'center', marginBottom:10 }}>
                <div style={{ fontSize:20, fontWeight:'bold', letterSpacing:'4px' }}>BITEPLATE</div>
                <div style={{ fontSize:10, color:'#555', marginTop:3 }}>Smart Restoran Boshqaruv Tizimi</div>
                <div style={{ fontSize:10, color:'#777', marginTop:2 }}>Tel: +998 71 200-00-00</div>
                <div style={{ fontSize:10, color:'#777' }}>Toshkent, Yunusobod tumani</div>
              </div>

              <DashLine />

              {/* Meta */}
              <div style={{ fontSize:11 }}>
                <Row l="Sana:"   r={dateStr} bold />
                <Row l="Vaqt:"   r={timeStr} bold />
                <Row l="Stol:"   r={`№ ${table.id}`} bold />
                <Row l="Mijoz:"  r={table.customerName || '—'} bold />
                <Row l="Chek №:" r={receiptNo} bold small />
              </div>

              <DashLine />

              {/* Items */}
              <div style={{ fontWeight:'bold', fontSize:9.5, color:'#444', letterSpacing:'1.5px', marginBottom:8 }}>
                BUYURTMA TARKIBI
              </div>
              {itemLines.map((item, i) => {
                const match = item.description.match(/^(.+?)\s+x(\d+)$/);
                const name  = match ? match[1] : item.description;
                const qty   = match ? parseInt(match[2]) : 1;
                const unit  = (item.amount / qty).toFixed(2);
                return (
                  <div key={i} style={{ marginBottom:7 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700 }}>
                      <span style={{ flex:1, paddingRight:8 }}>{name}</span>
                      <span style={{ whiteSpace:'nowrap' }}>${item.amount.toFixed(2)}</span>
                    </div>
                    <div style={{ color:'#888', fontSize:10, paddingLeft:4, marginTop:1 }}>
                      {qty} × ${unit}
                    </div>
                  </div>
                );
              })}

              <DashLine />

              {/* Totals */}
              <div style={{ fontSize:11.5 }}>
                <Row l="Jami (chegirmasiz)" r={`$${grossSum.toFixed(2)}`} />
                {discount && <Row l={`Chegirma (${stratLabel.emoji} ${stratLabel.uz})`} r={`-$${Math.abs(discount.amount).toFixed(2)}`} red />}
                <Row l="Soliq (QQS 8%)"    r={`$${bill.tax.toFixed(2)}`} />
                {bill.tip > 0 && <Row l="Chayqa (xizmat haqi)" r={`$${bill.tip.toFixed(2)}`} />}
              </div>

              <div style={{ borderTop:'2px solid #111', borderBottom:'2px solid #111', margin:'10px 0', padding:'8px 0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:17 }}>
                  <span>JAMI TO'LOV:</span>
                  <span>${bill.total.toFixed(2)}</span>
                </div>
              </div>

              {bill.perGuest && bill.guestCount > 1 && (
                <div style={{ background:'#f0efe6', borderRadius:4, padding:'6px 10px', marginBottom:8, fontSize:11 }}>
                  <Row l={`Har bir kishi (${bill.guestCount} mehmon):`} r={`$${bill.perGuest.toFixed(2)}`} bold />
                </div>
              )}

              {/* Stamp */}
              <div style={{ textAlign:'center', margin:'12px 0 10px' }}>
                <div style={{
                  display:'inline-block', border:'1.5px solid #1a7a3a',
                  borderRadius:4, padding:'6px 20px', color:'#1a7a3a',
                  fontWeight:'bold', fontSize:12, letterSpacing:'2px',
                }}>✓ TO'LOV QABUL QILINDI</div>
              </div>

              <DashLine />

              {/* Fiscal */}
              <div style={{ fontSize:10, color:'#555', lineHeight:1.9 }}>
                <Row l="Soliq to'lovchi kodi:" r="123456789" />
                <Row l="Fiskal apparati №:"    r={`FP-${bill.id.slice(0,8).toUpperCase()}`} />
                <Row l="Tartib raqami:"        r={fiscalNo} />
                <Row l="Narxlash usuli:"       r={stratLabel.uz} />
              </div>

              <DashLine />

              {/* QR */}
              <div style={{ textAlign:'center', fontFamily:'monospace', fontSize:9, color:'#999', lineHeight:1.5, margin:'8px 0' }}>
                <div>█▀▀▀▀▀█  ▄▄▄▄▄  █▀▀▀▀▀█</div>
                <div>█ ███ █  █   █  █ ███ █</div>
                <div>█ ▀▀▀ █  ▀▀▀▀▀  █ ▀▀▀ █</div>
                <div>▀▀▀▀▀▀▀  ▀ ▀ ▀  ▀▀▀▀▀▀▀</div>
                <div style={{ marginTop:4, fontSize:8, color:'#bbb' }}>tekshirish.biteplate.uz/{receiptNo}</div>
              </div>

              {/* Thank you */}
              <div style={{ textAlign:'center', fontWeight:'bold', fontSize:12, marginBottom:3, marginTop:4 }}>
                *** RAHMAT! YANA KELING! ***
              </div>
              <div style={{ textAlign:'center', fontSize:10, color:'#888' }}>
                Taomlarimiz sifatiga ishonchingiz komil
              </div>
              <div style={{ textAlign:'center', fontSize:9, color:'#bbb', marginTop:4 }}>
                www.biteplate.uz • @biteplate_uz
              </div>
            </div>

            {/* Torn bottom */}
            <div style={{ height:10, background:'repeating-linear-gradient(90deg,#fafaf7 0,#fafaf7 6px,#ddd 6px,#ddd 8px)' }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          gap: 10,
          flexShrink: 0,
        }}>
          <button onClick={handlePrint} style={{
            flex:1, padding:'10px', borderRadius:12,
            border:'1px solid rgba(255,255,255,0.1)',
            background:'rgba(255,255,255,0.04)', color:'#9ca3af',
            cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif',
          }}>🖨️ Chop etish</button>
          <button onClick={onClose} style={{
            flex:1, padding:'10px', borderRadius:12,
            border:'none',
            background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff',
            cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Inter,sans-serif',
            boxShadow:'0 4px 16px rgba(99,102,241,0.4)',
          }}>✓ Yopish</button>
        </div>
      </div>
    </div>
  );
}

function DashLine() {
  return <div style={{ borderTop:'1px dashed #bbb', margin:'8px 0' }} />;
}

function Row({ l, r, bold, small, red }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, marginBottom:3 }}>
      <span style={{ color: red ? '#c00' : '#444', flexShrink:0 }}>{l}</span>
      <span style={{
        fontWeight: bold ? 700 : 600,
        fontSize: small ? 10 : 'inherit',
        color: red ? '#c00' : '#111',
        textAlign:'right',
        wordBreak:'break-all',
      }}>{r}</span>
    </div>
  );
}
