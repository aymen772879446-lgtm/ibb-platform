import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, X, MessageCircle, Phone, ChevronRight } from 'lucide-react';

interface TrustModalProps {
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function TrustModal({ onClose, lang }: TrustModalProps) {
  // Background click handler
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Sequencing delay items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 220, damping: 18 },
    },
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none"
      onClick={handleOverlayClick}
    >
      {/* Dark Grey Overlay with Backdrop Blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Container: Sliding Smoothly from Bottom */}
      <motion.div
        initial={{ y: '80vh', opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '80vh', opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative bg-white dark:bg-zinc-90 w-full max-w-md shadow-2xl rounded-[24px] border border-slate-105 dark:border-zinc-800 p-6 sm:p-8 text-slate-800 dark:text-zinc-100 overflow-hidden"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        style={{ contentVisibility: 'auto' }}
      >
        {/* Subtle top green bar */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#128C7E]" />

        {/* Elegant traditional architecture outline pattern blended with modern column structures */}
        <div className="absolute inset-x-0 bottom-0 top-12 pointer-events-none select-none opacity-[0.05] dark:opacity-[0.025] flex items-end justify-center overflow-hidden mix-blend-multiply dark:mix-blend-overlay">
          <svg width="420" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-800 dark:text-zinc-100 max-w-full scale-110">
            {/* Traditional Ibb Arch 1 */}
            <path d="M 50 300 L 50 140 C 50 85, 100 45, 150 45 C 200 45, 250 85, 250 140 L 250 300" stroke="currentColor" strokeWidth="2" />
            <circle cx="150" cy="115" r="32" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M 118 115 L 182 115" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 150 83 L 150 147" stroke="currentColor" strokeWidth="0.8" />
            
            {/* Traditional Ibb Arch 2 */}
            <path d="M 230 300 L 230 170 C 230 125, 260 95, 295 95 C 330 95, 360 125, 360 170 L 360 300" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="295" cy="155" r="24" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
            
            {/* Modern High-Rise/Building Lines intersecting gently to show modern trust */}
            <g stroke="currentColor" strokeWidth="1.5" opacity="0.6">
              <line x1="25" y1="300" x2="25" y2="35" />
              <line x1="10" y1="300" x2="10" y2="65" />
              <line x1="380" y1="300" x2="380" y2="55" />
              
              <line x1="10" y1="65" x2="25" y2="65" />
              <line x1="10" y1="105" x2="25" y2="105" />
              <line x1="10" y1="145" x2="25" y2="145" />
              <line x1="10" y1="185" x2="25" y2="185" />
              <line x1="10" y1="225" x2="25" y2="225" />
              <line x1="10" y1="265" x2="25" y2="265" />
              
              <line x1="360" y1="85" x2="380" y2="85" />
              <line x1="360" y1="125" x2="380" y2="125" />
              <line x1="360" y1="165" x2="380" y2="165" />
              <line x1="360" y1="205" x2="380" y2="205" />
              <line x1="360" y1="245" x2="380" y2="245" />
            </g>
          </svg>
        </div>

        {/* Small Elegant Close Button (X) - Quarter Rotation on Hover */}
        <button 
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-all duration-300 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer hover:rotate-90 z-20"
          title={lang === 'ar' ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Sequenced entries inside the popup card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col justify-between h-full"
        >
          <div>
            {/* 1. Shield Icon: pulsing and modern gradient glass */}
            <motion.div 
              variants={itemVariants}
              className="text-center pt-4 mb-4 select-none"
            >
              <motion.div 
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-18 h-18 bg-gradient-to-b from-[#128C7E]/10 to-[#25D366]/10 dark:from-[#128C7E]/15 dark:to-[#25D366]/5 rounded-full flex items-center justify-center mx-auto mb-1 border border-[#128C7E]/25 shadow-xs"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white rounded-[18px] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-8 h-8 text-white filter drop-shadow-sm" />
                </div>
              </motion.div>
            </motion.div>

            {/* 2. Text contents */}
            <motion.div variants={itemVariants} className="text-center space-y-3 mb-6 px-1">
              <h3 className="text-[#0d6158] dark:text-[#32d8c6] text-base sm:text-lg font-black [font-family:'Cairo',sans-serif] leading-tight">
                {lang === 'ar' ? 'التحقق أولاً.. لمصداقية تامة!' : 'Verification First.. For absolute credibility!'}
              </h3>
              <p className="text-xs sm:text-xs text-slate-700 dark:text-zinc-300 font-medium leading-relaxed [font-family:'Cairo',sans-serif] text-justify select-text">
                {lang === 'ar' 
                  ? 'لضمان مصداقية الإعلانات وحماية حقوق البائع والمشتري نقوم بالتحقق من العقار قبل النشر. تواصل معنا عبر الواتساب أو الاتصال مباشر تزويدنا بالتفاصيل وتأكيد إعلانك على أرض الواقع. ليتم نشره في الحال.'
                  : 'To ensure listing credibility and protect the rights of both buyer and seller, we physically verify properties on-ground before publishing. Connect with us via WhatsApp or call us directly to provide details and confirm your local advertisement. It will be published immediately.'}
              </p>
            </motion.div>

            {/* 3. Contact buttons */}
            <div className="space-y-3 select-none">
              {/* WhatsApp button - #25D366 */}
              <motion.a 
                variants={itemVariants}
                href={`https://wa.me/${(import.meta as any).env.VITE_WHATSAPP_NUMBER || "966504245645"}?text=${encodeURIComponent(
                  lang === 'ar' 
                    ? 'أهلاً منصة الأمان، أرغب بإضافة إعلان جديد لديكم يرجى معاينته وتوثيقه ونشره.' 
                    : 'Hello Aman Platform, I would like to physically verify and publish a new listing.'
                )}`}
                target="_blank"
                rel="no-referrer"
                whileHover={{ scale: 1.025, filter: 'brightness(1.05)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl flex items-center justify-between transition-all duration-300 shadow-md shadow-[#25D366]/20 cursor-pointer border-0 group [font-family:'Cairo',sans-serif]"
              >
                <div className="flex items-center gap-3">
                  {/* Wiggling WhatsApp design */}
                  <motion.div 
                    animate={{ rotate: [-3, 3, -3, 3, 0], scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1.2 }}
                    className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-[#25D366] stroke-2" />
                  </motion.div>
                  
                  <div className="text-right rtl:text-right ltr:text-left">
                    <span className="block font-extrabold text-xs sm:text-sm tracking-wide">
                      {lang === 'ar' ? 'تواصل معنا عبر الواتساب' : 'Chat with Us on WhatsApp'}
                    </span>
                    <span className="block text-[10px] sm:text-[11px] font-bold opacity-90 tracking-wider">
                      (772879446)
                    </span>
                  </div>
                </div>
                
                <ChevronRight className={`w-4.5 h-4.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </motion.a>

              {/* Classic direct call button */}
              <motion.a 
                variants={itemVariants}
                href="tel:772879446"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-5 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[#128C7E] border-2 border-[#128C7E] dark:border-[#159a8c] rounded-2xl flex items-center justify-between transition-all duration-300 shadow-xs cursor-pointer group [font-family:'Cairo',sans-serif]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#128C7E]/10 dark:bg-[#128C7E]/20 p-2 rounded-xl group-hover:rotate-[-12deg] transition-transform duration-300">
                    <Phone className="w-5 h-5 text-[#128C7E] dark:text-[#32d8c6]" />
                  </div>
                  
                  <div className="text-right rtl:text-right ltr:text-left">
                    <span className="block font-extrabold text-xs sm:text-sm text-slate-800 dark:text-zinc-100">
                      {lang === 'ar' ? 'اتصال مباشر' : 'Direct Line Call'}
                    </span>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-[#128C7E]/80 dark:text-[#32d8c6]/80">
                      (772879446)
                    </span>
                  </div>
                </div>
                
                <ChevronRight className={`w-4.5 h-4.5 text-[#128C7E] dark:text-[#32d8c6] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </motion.a>
            </div>
          </div>

          {/* 4. Small classy Footer */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-6 pt-1 border-t border-slate-100 dark:border-zinc-800/80 text-[9px] sm:text-[10px] text-slate-400 dark:text-zinc-500 font-extrabold select-none leading-relaxed"
          >
            {lang === 'ar' 
              ? 'منصة الأمان - محافظة إب، الجمهورية اليمنية | تواصل بنا: 772879446' 
              : 'Aman Platform - Ibb, Republic of Yemen | Call Us: 772879446'}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
