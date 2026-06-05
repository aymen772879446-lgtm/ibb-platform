import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Award, ThumbsUp } from 'lucide-react';

interface ConsultationFormProps {
  lang: 'ar' | 'en';
}

export default function ConsultationForm({ lang }: ConsultationFormProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [preference, setPreference] = useState<string>('call');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert(lang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please provide name and phone');
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setPhone('');
      setBudget('');
    }, 5000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl sm:rounded-[32px] p-5 sm:p-7 md:p-10 border border-indigo-500/10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-auto md:min-h-[450px]" id="consultation-form-root">
      
      {/* Background radial overlays */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 flex-grow flex flex-col justify-between h-full">
        
        <div className="mb-4 sm:mb-6">
          {/* Section Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[9px] sm:text-[10px] md:text-xs font-black rounded-full border border-indigo-500/20 uppercase tracking-widest mb-3 sm:mb-4">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-spin-slow" />
            <span>{lang === 'ar' ? 'خدمة كبار الشخصيات VIP' : 'Elite Luxury Consultations'}</span>
          </div>

          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold sm:font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">
            {lang === 'ar' ? 'اطلب استشارة عقارية خاصة ومجانية' : 'Request Premium VIP Guidance'}
          </h3>
          
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
            {lang === 'ar' 
              ? 'هل تبحث عن فرص استثمارية مدروسة أو فيلا مخصصة لذوقك؟ اترك بياناتك وسيقوم أحمد الهمداني بتقديم استشارة نخبوية شاملة تضمن لك أعلى جودة وأضمن قرار استثماري.' 
              : 'Looking for a verified high-yield luxury estate or custom bespoke villas? Connect with Al-Hamdani exclusive advisors details to plan your layout.'}
          </p>
        </div>

        {success ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 text-center flex flex-col items-center justify-center gap-4 flex-grow my-auto animate-fade-in">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 animate-bounce" />
            <div className="space-y-1">
              <p className="font-extrabold text-xs sm:text-sm md:text-base text-yellow-100">
                {lang === 'ar' ? `طلبك العقاري قيد الدراسة يا ${name}!` : `VIP file prepared for ${name}!`}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed">
                {lang === 'ar' 
                  ? 'تم تسجيل طلبك بأعلى درجات السرية والخصوصية. سيتصل بك فريقنا الاستشاري برئاسة أحمد الهمداني مباشرة.' 
                  : 'Your interest has been logged securely under NDA. Our elite team will connect shortly.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400 font-semibold border-t border-white/5 pt-3 w-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ar' ? 'تشفير بيانات آمن مبرهن ٢٥٦ بت' : 'Symmetric 256-bit encryption active'}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-grow flex flex-col justify-end">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
              <input 
                type="text" 
                placeholder={lang === 'ar' ? 'الاسم الكريم بالكامل' : 'Full Name'}
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs md:text-sm rounded-xl bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-bold placeholder-slate-400/90 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input 
                type="tel" 
                placeholder={lang === 'ar' ? 'رقم الجوال الخاص بك' : 'Phone Number'}
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs md:text-sm rounded-xl bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-bold placeholder-slate-400/90 transition-all text-left"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
              <input 
                type="text" 
                placeholder={lang === 'ar' ? 'الميزانية التقريبية (مثال: ٢ مليون)' : 'Target Budget (e.g. 2M SAR)'}
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs md:text-sm rounded-xl bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-bold placeholder-slate-400/90 transition-all"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              {/* Preferences Selection */}
              <select 
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs md:text-sm rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-bold"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              >
                <option value="call" className="bg-slate-900">{lang === 'ar' ? 'اتصال هاتفي مباشر' : 'Voice Call Connection'}</option>
                <option value="whatsapp" className="bg-slate-900">{lang === 'ar' ? 'رسالة واتساب مشفرة' : 'WhatsApp Encrypted Chat'}</option>
                <option value="office" className="bg-slate-900">{lang === 'ar' ? 'موعد فرع المكتب الرئيسي' : 'Direct HQ Office Visit'}</option>
              </select>
            </div>

            {/* Premium action send button */}
            <button 
              type="submit"
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs md:text-sm rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2 sm:mt-4 hover:brightness-105"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إرسال طلب الاستشاري الحصري مجانًا' : 'Get Connected With CEO Council'}</span>
            </button>

            <p className="text-[9px] sm:text-[10px] text-slate-400 text-center font-bold flex items-center justify-center gap-1.5 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'ar' ? 'نحمي بياناتك بالكامل ونلتزم بعدم مشاركتها مطلقاً' : 'Total customer dataset safety under privacy act guarantees.'}</span>
            </p>

          </form>
        )}

      </div>

    </div>
  );
}
