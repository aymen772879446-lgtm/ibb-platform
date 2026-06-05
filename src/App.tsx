import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import AmanMarketplace from './components/AmanMarketplace';
import { Particle } from './types';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animKey, setAnimKey] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // Initialize atmospheric floating background particles
  useEffect(() => {
    const generated: Particle[] = [];
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      generated.push({
        id: i,
        size: Math.random() * 8 + 4,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 10,
        color: Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(212, 175, 55, 0.3)'
      });
    }
    setParticles(generated);
  }, []);

  // Sync theme changes with document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync direction & language meta definitions
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Handle CTA button click: triggers a premium micro-interaction & transitions to the marketplace
  const handleCtaClick = () => {
    setAnimKey(prev => prev + 1);
    setIsTransitioning(true);
    
    const msg = lang === 'ar' 
      ? 'أهلاً بك! جاري تهيئة منصة الأمان وتجهيز العروض الفاخرة...' 
      : 'Welcome! Initializing the Aman secure catalog...';
    
    setToastMessage(msg);

    // Dynamic delay for filling progress bar loading transition
    setTimeout(() => {
      setIsEntered(true);
      setIsTransitioning(false);
    }, 1200);
  };

  // Automatically hide clean toast notices
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Translation sets for Welcoming Gate
  const translations = {
    ar: {
      gateway: "الريادة في فخامة الاختيار",
      titleLine1: "لسنا الوحيدون ولكننا الأفضل",
      titleLine2: "منصة أحمد الهمداني هي وجهتكم الأولى في عالم العقارات والسيارات",
      fixedPhrase: "وداعاً لعناء البحث والتواصل مع الوسطاء؛ كل عروضنا العقارية والسيارات موثقة بالصور والفيديو بين يديك",
      enterBtn: "استكشف العروض",
      langName: "English",
      copyright: "© 2026 منصة أحمد الهمداني الفاخرة. جميع الحقوق محفوظة.",
      toggleDark: "المظهر الداكن",
      toggleLight: "المظهر الفاتح"
    },
    en: {
      gateway: "Pioneering in the Luxury of Choice",
      titleLine1: "We Are Not The Only Ones, But We Are The Best",
      titleLine2: "Al-Hamdani Platform is Your Premier Destination for Real Estate & Cars",
      fixedPhrase: "Bid farewell to the hassle of searching and middle-men; all our real estate & vehicle offers are fully documented with photos and videos in your hands.",
      enterBtn: "Explore Offers",
      langName: "العربية",
      copyright: "© 2026 Al-Hamdani Luxury Platform. All rights reserved.",
      toggleDark: "Dark Mode",
      toggleLight: "Light Mode"
    }
  }[lang];

  return (
    <div 
      className="bg-[#f8fafc] text-slate-800 dark:bg-[#07070d] dark:text-slate-100 transition-colors duration-700 min-h-screen relative overflow-x-hidden flex flex-col justify-between"
      id="splash-standalone-root"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Cairo Font and Core Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap');
        
        #splash-standalone-root {
          font-family: 'Cairo', sans-serif;
        }

        /* Filling progress line animation */
        .filling-line {
          width: 0%;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          border-radius: 2px;
          animation: fillUpProgress 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fillUpProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* Floating background particles style */
        .splash-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.25;
          animation: float-up 15s infinite linear;
        }

        @keyframes float-up {
          0% {
            transform: translateY(110vh) translateX(0) scale(1);
          }
          100% {
            transform: translateY(-10vh) translateX(100px) scale(1.5);
          }
        }
      `}</style>

      {/* Atmospheric Floating Dust Particles - Only rendered on Welcoming page for performance */}
      {!isEntered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="splash-particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                background: p.color
              }}
            />
          ))}
        </div>
      )}

      {/* Dynamic Main view switcher */}
      {isEntered ? (
        <AmanMarketplace lang={lang} onBackToWelcome={() => setIsEntered(false)} />
      ) : (
        <>
          {/* Welcoming View Render */}
          <div className="flex-grow flex flex-col justify-between">
            
            {/* Soft decorative visual glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#d4af37]/10 dark:bg-[#d4af37]/5 blur-[100px] rounded-full pointer-events-none z-0" />

            {/* Toast HUD */}
            {toastMessage && (
              <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900/90 dark:bg-zinc-900/95 border border-slate-700/50 dark:border-zinc-800/50 text-white rounded-2xl shadow-xl backdrop-blur-md animate-fade-in text-xs md:text-sm font-bold flex items-center gap-2 select-none">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* LOBBY HEADER SECTION */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm font-black tracking-wider text-slate-400 dark:text-zinc-500 uppercase select-none line-clamp-1">
                  {translations.gateway}
                </span>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                {/* Language Switch Button */}
                <button 
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-zinc-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all flex items-center gap-2 bg-white/50 dark:bg-zinc-955/50 backdrop-blur-sm cursor-pointer shadow-sm active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                  <span>{translations.langName}</span>
                </button>

                {/* Theme Switcher Button */}
                <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-905 shadow-sm hover:scale-105 transition-all cursor-pointer active:scale-95" 
                >
                  <span className="text-[10px] md:text-xs font-black text-slate-500 dark:text-zinc-400 tracking-wide select-none">
                    {theme === 'light' ? translations.toggleDark : translations.toggleLight}
                  </span>
                  <div 
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                      theme === 'dark' ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center transition-all">
                      {theme === 'dark' ? (
                        <Sun className="w-2.5 h-2.5 text-amber-500" />
                      ) : (
                        <Moon className="w-2.5 h-2.5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </header>

            {/* CENTRAL WELCOMING HERO */}
            <main className="container mx-auto px-6 max-w-4xl text-center flex-grow flex flex-col justify-center items-center py-10 z-10 relative">
              
              <div className="mb-6 md:mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-5xl lg:text-5.5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white drop-shadow-sm px-4 leading-normal select-none">
                  {translations.titleLine1}
                  <br />
                  <span className="text-blue-600 dark:text-blue-400 mt-4 md:mt-5 block leading-relaxed text-2xl md:text-4xl lg:text-3xl font-extrabold hero-gradient">
                    {translations.titleLine2}
                  </span>
                </h1>
              </div>

              {/* Progress filling indicator bar rendered on click transition */}
              <div className="w-64 md:w-96 bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-8 md:mb-12">
                <div key={animKey} className={isTransitioning ? "filling-line" : "w-0"} />
              </div>

              {/* Centered focal trust statement card */}
              <div className="w-full max-w-xl bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800 rounded-2xl py-4.5 px-6 shadow-lg shadow-slate-200/20 dark:shadow-none mb-8 text-center select-none">
                <p className="text-sm md:text-base font-extrabold text-slate-700 dark:text-zinc-200 leading-relaxed">
                  {translations.fixedPhrase}
                </p>
              </div>

              {/* Action Trigger CTA Button */}
              <div className="mt-2 text-center">
                <button 
                  onClick={handleCtaClick}
                  disabled={isTransitioning}
                  className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base md:text-lg rounded-xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center gap-3 overflow-hidden cursor-pointer active:scale-95 mx-auto"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>{translations.enterBtn}</span>
                  {lang === 'en' ? (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
                  )}
                </button>
              </div>

            </main>

            {/* FOOTER SECTION */}
            <footer className="container mx-auto px-6 py-6 border-t border-slate-205 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
              <p className="font-semibold text-xs text-slate-400 dark:text-zinc-500 order-2 sm:order-1">{translations.copyright}</p>
              
              <div className="flex items-center gap-3.5 order-1 sm:order-2 select-none">
                {/* Direct WhatsApp link */}
                <a 
                  href={`https://wa.me/${(import.meta as any).env.VITE_WHATSAPP_NUMBER || "966504245645"}`}
                  target="_blank" 
                  rel="no-referrer"
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                  title={lang === 'ar' ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat via WhatsApp'}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.013-5.091-2.859-6.937C16.578 1.993 14.113 1.011 11.5 1.011c-5.45 0-9.88 4.414-9.883 9.831-.001 1.734.512 3.426 1.482 4.909l-.976 3.565 3.654-.959zm10.662-7.31c-.247-.123-1.463-.722-1.692-.805-.229-.083-.396-.123-.562.124-.166.248-.644.805-.79.972-.146.165-.291.186-.538.063-.247-.123-1.044-.384-1.988-1.226-.735-.656-1.232-1.467-1.377-1.714-.145-.247-.015-.38.109-.502.112-.11.247-.29.37-.434.124-.145.166-.248.248-.413.083-.165.042-.31-.02-.434-.063-.124-.562-1.353-.77-1.85-.202-.487-.406-.42-.562-.428-.145-.008-.31-.01-.478-.01-.167 0-.439.063-.668.312-.23.248-.875.855-.875 2.086 0 1.231.896 2.42 1.016 2.585.12.166 1.761 2.689 4.267 3.77.597.257 1.062.411 1.425.526.6.19 1.144.163 1.575.099.48-.072 1.463-.598 1.67-1.176.208-.578.208-1.074.146-1.176-.062-.102-.229-.166-.476-.29z" />
                  </svg>
                </a>

                {/* Direct Facebook Link */}
                <a 
                  href="https://www.facebook.com/share/1LGJwbFDNZ/"
                  target="_blank" 
                  rel="no-referrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                  title={lang === 'ar' ? 'صفحتنا على فيسبوك' : 'Our Facebook Page'}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </footer>

          </div>
        </>
      )}
    </div>
  );
}
