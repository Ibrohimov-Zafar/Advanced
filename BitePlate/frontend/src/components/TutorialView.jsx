import React, { useState } from 'react';

const STEPS = [
  {
    id: 1,
    icon: '🪑',
    title: 'Mijozni stol boshiga o\'tqazish',
    color: 'emerald',
    summary: 'Yangi mijoz kelganda avvalo unga mos stol tanlang va o\'tqazing.',
    steps: [
      { text: '"Stollar" sahifasiga o\'ting (chap menyu)', icon: '📌' },
      { text: 'Yashil rangli "Bo\'sh" statusdagi stolni toping', icon: '🟢' },
      { text: '"Mijoz o\'tqazish" tugmasini bosing', icon: '🖱️' },
      { text: 'Mijozning ismini kiriting (masalan: "Aliyev Bobur")', icon: '✏️' },
      { text: 'Xizmat ko\'rsatuvchi ofitsiannt tanlang', icon: '👤' },
      { text: '"Tasdiqlash" tugmasini bosing — stol holati "Egallangan"ga o\'zgaradi', icon: '✅' },
    ],
    tip: 'Stol sig\'imi (kishi soni) har bir stol kartochkasida ko\'rsatilgan. Guruh soniga qarab stol tanlang.',
    badge: '1-qadam',
  },
  {
    id: 2,
    icon: '🍽️',
    title: 'Buyurtma berish',
    color: 'amber',
    summary: 'Mijoz o\'tirgandan so\'ng ofitsiant menyu orqali buyurtma qabul qiladi.',
    steps: [
      { text: '"Egallangan" statusdagi stolni toping', icon: '🟡' },
      { text: '"Buyurtma berish" tugmasini bosing', icon: '🖱️' },
      { text: 'Kategoriyalardan (Salatlar / Asosiy / Dessert / Ichimliklar) tanlang', icon: '📂' },
      { text: 'Taomni bosing — avtomatik savatga qo\'shiladi', icon: '➕' },
      { text: 'Miqdorni +/- tugmalar bilan sozlang', icon: '🔢' },
      { text: '"Oshxonaga yuborish" tugmasini bosing', icon: '📤' },
    ],
    tip: 'Allergen ma\'lumotlari har bir taom yonida oranж rangda ko\'rsatiladi. Mijoz allergiyasini tekshirib oling!',
    badge: '2-qadam',
  },
  {
    id: 3,
    icon: '🔥',
    title: 'Oshxona boshqaruvi',
    color: 'orange',
    summary: 'Oshpaz yoki boshqaruvchi buyurtmalarni kuzatib, tayyorlanish jarayonini boshqaradi.',
    steps: [
      { text: '"Oshxona" sahifasiga o\'ting', icon: '📌' },
      { text: '"Navbatda" ustunida yangi buyurtmalar ko\'rinadi', icon: '⏳' },
      { text: '"Tayyorlashni boshlash" → buyurtma "Tayyorlanmoqda"ga o\'tadi', icon: '🔥' },
      { text: 'Taom tayyor bo\'lgach "Tayyor deb belgilash" tugmasini bosing', icon: '✅' },
      { text: 'Xato qilsangiz — "Ortga qaytarish" tugmasi oxirgi amalni bekor qiladi', icon: '↩' },
      { text: 'Amallar tarixi pastda ko\'rinib turadi', icon: '📋' },
    ],
    tip: '"Ortga qaytarish" — bu Command Pattern (dizayn namunasi). U har bir amalni yadda saqlaydi va bekor qilish imkonini beradi.',
    badge: '3-qadam',
  },
  {
    id: 4,
    icon: '🧾',
    title: 'Hisob-kitob va To\'lov',
    color: 'violet',
    summary: 'Mijoz ovqatlanib bo\'lgach kassir hisob yaratadi va to\'lovni qabul qiladi.',
    steps: [
      { text: '"Stollar" sahifasida "Egallangan" stolni toping', icon: '🟡' },
      { text: '"Hisob-kitob" tugmasini bosing', icon: '🖱️' },
      { text: 'Narxlash usulini tanlang (4 ta variant mavjud)', icon: '💳' },
      { text: 'Ixtiyoriy: Chayqa foizini kiriting (masalan: 10%)', icon: '💰' },
      { text: 'Ixtiyoriy: Mehmonlar sonini kiriting (hisob taqsimlanadi)', icon: '👥' },
      { text: '"Hisob yaratish" → "To\'lovni qabul qilish" tugmasini bosing', icon: '✅' },
    ],
    tip: 'To\'lov qabul qilinganidan so\'ng stol avtomatik "Bo\'sh"ga qaytadi va Statistika sahifasida yozuv paydo bo\'ladi.',
    badge: '4-qadam',
  },
  {
    id: 5,
    icon: '📊',
    title: 'Statistika va Tahlil',
    color: 'blue',
    summary: 'Menejer kundagi daromad, ommabop taomlar va kategoriya bo\'yicha hisobotni ko\'radi.',
    steps: [
      { text: '"Statistika" sahifasiga o\'ting', icon: '📌' },
      { text: 'Jami buyurtmalar va daromadni ko\'ring', icon: '💵' },
      { text: 'Eng ko\'p buyurtma qilingan TOP-5 taomni ko\'ring', icon: '🏆' },
      { text: 'Kategoriya bo\'yicha daromadni solishtiring', icon: '📊' },
      { text: '"Buyurtmalar tarixi" bo\'limida har bir to\'lovni ko\'ring', icon: '📋' },
    ],
    tip: 'Bu sahifadagi ma\'lumotlar Singleton Design Pattern orqali saqlanadi — barcha subsistemalar bitta markaziy jurnal bilan ishlaydi.',
    badge: '5-qadam',
  },
];

const PRICING_INFO = [
  { emoji: '💰', name: 'Oddiy narx',     desc: 'Hech qanday chegirmasiz to\'liq narx hisoblanadi.' },
  { emoji: '🎉', name: 'Baxtli soat',    desc: 'Barcha taom va ichimliklardan 20% chegirma. Odatda kun o\'rtasida (15:00–17:00) qo\'llaniladi.' },
  { emoji: '⭐', name: 'Doimiy mijoz',   desc: '10% chegirma + eng arzon ichimlik bepul beriladi. Sodiqlik kartasi bor mijozlar uchun.' },
  { emoji: '👥', name: 'Guruh chegirma', desc: '6 va undan ko\'p kishi uchun 15% chegirma. Katta guruhlarni jalb qilish uchun.' },
];

const FAQ = [
  {
    q: 'Noto\'g\'ri buyurtma berdim, bekor qila olamanmi?',
    a: '"Oshxona" sahifasidagi "Bekor qilish" tugmasi orqali buyurtmani bekor qilsa bo\'ladi. Lekin buyurtma "Tayyorlanmoqda" bosqichiga o\'tgach, bekor qilish moddiy zarar keltiradi.',
  },
  {
    q: 'Stol tozalanmayapti, nima qilaman?',
    a: 'Avval hisob to\'langanligini tekshiring. To\'lov qabul qilingach stol avtomatik tozalanadi. Qo\'lda ham "Stolni tozalash" tugmasi mavjud.',
  },
  {
    q: '"Ortga qaytarish" tugmasi nima qiladi?',
    a: 'Oshxonadagi eng oxirgi amal (tayyorlash, bekor qilish, tayyor belgilash) bekor qilinadi va buyurtma oldingi holatiga qaytadi.',
  },
  {
    q: 'Hisob nechta kishi uchun bo\'linishi mumkin?',
    a: 'Hisob yaratishda "Mehmonlar soni" maydoniga raqam kiriting. Jami summa avtomatik teng taqsimlanadi.',
  },
  {
    q: 'Statistika sahifasidagi ma\'lumotlar qachon yangilanadi?',
    a: 'Har bir to\'lov qabul qilingandan so\'ng Singleton log ga avtomatik yoziladi. Sahifani yangilasangiz yangi ma\'lumotlar ko\'rinadi.',
  },
];

const COLOR = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-400',  badge: 'bg-orange-500/20 text-orange-300' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-400',  badge: 'bg-violet-500/20 text-violet-300' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    badge: 'bg-blue-500/20 text-blue-300' },
};

export default function TutorialView() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero */}
      <div className="card border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-[#12161f] p-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
            📚
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">BitePlate Qo'llanmasi</h1>
            <p className="text-gray-400 leading-relaxed">
              Ushbu qo'llanma restoran boshqaruv tizimidan to'g'ri foydalanishni o'rgatadi.
              Har bir qadam ketma-ket bajarilsa, buyurtmadan to'lovgacha hamma narsa silliq ishlaydi.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="badge bg-violet-500/20 text-violet-300">5 ta asosiy bosqich</span>
              <span className="badge bg-emerald-500/20 text-emerald-300">4 ta narxlash usuli</span>
              <span className="badge bg-amber-500/20 text-amber-300">7 ta dizayn namunasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick overview */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>🗺️</span> Tizim umumiy ko'rinishi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🍽️', title: 'Stollar',    desc: 'Stol holati, mijoz o\'tqazish, buyurtma va hisob' },
            { icon: '🔥', title: 'Oshxona',    desc: 'Buyurtmalar navbati, tayyorlanish holati, undo' },
            { icon: '📊', title: 'Statistika', desc: 'Daromad, ommabop taomlar, buyurtmalar tarixi' },
            { icon: '👥', title: 'Xodimlar',   desc: 'Rol va ruxsatlar boshqaruvi' },
          ].map((item) => (
            <div key={item.title} className="card border border-white/[0.06] p-4">
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step by step */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>📋</span> Bosqichma-bosqich ko'rsatma
        </h2>
        <div className="space-y-3">
          {STEPS.map((step) => {
            const c = COLOR[step.color];
            const isOpen = activeStep === step.id;
            return (
              <div key={step.id} className={`card border ${c.border} overflow-hidden transition-all`}>
                {/* Header — clickable */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setActiveStep(isOpen ? null : step.id)}
                >
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl shrink-0`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`badge ${c.badge} text-xs`}>{step.badge}</span>
                    </div>
                    <h3 className="text-white font-bold">{step.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5 truncate">{step.summary}</p>
                  </div>
                  <span className={`shrink-0 text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${c.text}`}>
                    ↓
                  </span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/[0.06]">
                    <div className="pt-4 space-y-2.5">
                      {step.steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-lg ${c.bg} flex items-center justify-center text-xs shrink-0 mt-0.5`}>
                            <span>{i + 1}</span>
                          </div>
                          <div className="flex items-start gap-2 flex-1">
                            <span className="text-base shrink-0">{s.icon}</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{s.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Tip */}
                    <div className={`mt-4 flex items-start gap-3 ${c.bg} border ${c.border} rounded-xl p-3.5`}>
                      <span className="text-lg shrink-0">💡</span>
                      <p className={`text-sm ${c.text} leading-relaxed`}>{step.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing guide */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>💳</span> Narxlash usullari haqida
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRICING_INFO.map((p) => (
            <div key={p.name} className="card border border-white/[0.06] p-4 flex items-start gap-4">
              <span className="text-3xl shrink-0">{p.emoji}</span>
              <div>
                <p className="text-white font-semibold mb-1">{p.name}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-3 flex items-center gap-2">
          <span>ℹ️</span>
          Narxlash usuli hisob yaratilayotganda tanlanadi. Bu Strategy Design Pattern orqali amalga oshirilgan.
        </p>
      </div>

      {/* Design patterns cheatsheet */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏗️</span> Tizimda ishlatiladigan dizayn namunalari
        </h2>
        <div className="card border border-white/[0.06] divide-y divide-white/[0.04]">
          {[
            { pattern: 'Command',    cat: 'Xulqiy',    desc: 'Oshxonadagi har bir amal (tayyorla/bekor) ob\'ekt sifatida saqlanadi. Undo/Redo ishlaydi.',              icon: '⚙️' },
            { pattern: 'Singleton', cat: 'Yaratuvchi', desc: 'OrderHistoryLog — butun tizimda bitta jurnal. Barcha buyurtmalar shu yerda saqlanadi.',                  icon: '🔒' },
            { pattern: 'Strategy',  cat: 'Xulqiy',    desc: 'Narxlash algoritmi hisob yaratish paytida almashtiriladi. Bill klassi o\'zgarmaydi.',                    icon: '🎯' },
            { pattern: 'State',     cat: 'Xulqiy',    desc: 'Stol holati: Bo\'sh → Band → Egallangan → Hisob Kutmoqda → Tozalangan.',                                 icon: '🔄' },
            { pattern: 'Composite', cat: 'Strukturaviy','desc': 'SetMeal va oddiy MenuItem bir xil `getPrice()` interfeysi orqali narxi hisoblanadi.',               icon: '🧩' },
            { pattern: 'Facade',    cat: 'Strukturaviy', desc: 'Bill klassi — soliq, chayqa, taqsimlash mantiqini yashiruvchi sodda interfeys.',                      icon: '🎭' },
            { pattern: 'Factory',   cat: 'Yaratuvchi', desc: 'getPricingStrategy() funksiyasi nom orqali kerakli narxlash ob\'ektini qaytaradi.',                     icon: '🏭' },
          ].map((p) => (
            <div key={p.pattern} className="flex items-start gap-4 px-5 py-4">
              <span className="text-2xl shrink-0 mt-0.5">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-semibold">{p.pattern}</span>
                  <span className="badge bg-white/5 text-gray-500 text-[10px]">{p.cat}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>❓</span> Ko'p so'raladigan savollar
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="card border border-white/[0.06] overflow-hidden">
              <button
                className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <p className="text-white font-medium text-sm">{item.q}</p>
                <span className={`text-gray-500 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>↓</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 border-t border-white/[0.06]">
                  <p className="text-gray-400 text-sm leading-relaxed pt-3">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="card border border-white/[0.04] p-5 text-center">
        <p className="text-gray-600 text-sm">
          BitePlate — BTEC Level 5 Unit 27 Advanced Programming loyihasi
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Node.js + Express (backend) • React.js (frontend) • 7 ta dizayn namunasi
        </p>
      </div>
    </div>
  );
}
