import React, { useState, useRef } from 'react';
import { X, MapPin, Share2, Phone, Calendar, Send, Sparkles, Check, Camera } from 'lucide-react';
import { Listing } from '../data';

interface ListingModalProps {
  listing: Listing;
  lang: 'ar' | 'en';
  onClose: () => void;
  onImageChange?: (id: string, newImageBase64: string) => void;
}

export default function ListingModal({ listing, lang, onClose, onImageChange }: ListingModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    notes: ''
  });

  const title = lang === 'ar' ? listing.titleAr : listing.titleEn;
  const price = lang === 'ar' ? listing.priceAr : listing.priceEn;
  const location = lang === 'ar' ? listing.locationAr : listing.locationEn;
  const category = lang === 'ar' ? listing.categoryAr : listing.categoryEn;
  const specs = lang === 'ar' ? listing.specsAr : listing.specsEn;
  const details = lang === 'ar' ? listing.detailsAr : listing.detailsEn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert(lang === 'ar' ? 'الرجاء ملء الاسم ورقم الهاتف' : 'Please fill in Name and Phone');
      return;
    }
    
    // Smooth custom callback message
    const responseText = lang === 'ar' 
      ? `شكرًا لك يا ${formData.name}. تم تسجيل طلب حجز معاينة لـ (${title}) بنجاح! سيتصل بك فريق أحمد الهمداني قريباً لإتمام الموعد.`
      : `Thank you ${formData.name}. Your inspection request for (${title}) has been registered successfully! Ahmed Al-Hamdani team will contact you shortly to confirm.`;
      
    setSuccessMsg(responseText);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(lang === 'ar' ? 'تم نسخ رابط المنصة إلى الحافظة!' : 'Copied platform link to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden" id="listing-modal-backdrop">
      {/* Background overlay with premium glass backdrop blur */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Wrapper */}
      <div className="relative bg-[#FAF7F2] dark:bg-[#0c0d12] rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-500/10 dark:border-amber-400/15 z-10 flex flex-col md:flex-row animate-fade-in">
        
        {/* Close Switch Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-black/60 dark:bg-zinc-950/65 backdrop-blur-md text-white hover:bg-red-500 rounded-full p-2.5 transition-all cursor-pointer shadow-lg active:scale-90 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Media Showcase */}
        <div className="w-full md:w-1/2 relative bg-slate-950 min-h-[250px] md:min-h-full">
          {/* Hidden file input for custom direct replacement in details */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onImageChange) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                  if (evt.target?.result) {
                    onImageChange(listing.id, evt.target.result as string);
                  }
                };
                reader.readAsDataURL(file);
              }
            }} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Upload original photo inside modal (on top left) */}
          {onImageChange && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-4 left-4 z-20 p-2.5 bg-black/65 backdrop-blur-md hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-xs border border-amber-400/20 flex items-center gap-1.5 cursor-pointer font-black"
              title={lang === 'ar' ? 'تحميل صورتك الأصلية كما هي بدقتها الكاملة' : 'Load your exact full-resolution photo'}
            >
              <Camera className="w-4 h-4" />
              <span className="text-[10px] md:text-2xs font-extrabold">
                {lang === 'ar' ? 'رفع صورتك الأصلية كما هي' : 'Upload your photo (as is)'}
              </span>
            </button>
          )}

          <img 
            src={listing.image} 
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040508]/90 via-[#040508]/20 to-transparent pointer-events-none" />
          
          {/* Sider Badges/Tags overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
            <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-550 text-slate-950 text-xs font-black tracking-wide rounded-full uppercase border border-amber-400/30">
              {category}
            </span>
            <h2 className="text-xl md:text-2xl font-black mt-3 leading-snug drop-shadow-md text-[#FFFDF9]">
              {title}
            </h2>
            <p className="text-sm text-amber-250 mt-2 flex items-center gap-1.5 font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{location}</span>
            </p>
          </div>
        </div>

        {/* Column 2: Specifics Form & Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
          <div>
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className="text-2xl md:text-3xl font-black text-amber-800 dark:text-transparent bg-clip-text bg-gradient-to-r dark:from-amber-200 dark:to-yellow-400">
                {price}
              </div>
              <button 
                onClick={handleShare}
                className="p-2.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 hover:bg-amber-500/20 dark:hover:bg-amber-400/20 transition-colors text-amber-850 dark:text-amber-300 cursor-pointer border border-amber-500/10"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sub description */}
            <div className="py-2.5 border-t border-b border-amber-500/15 dark:border-amber-400/10 mb-6">
              <h4 className="text-xs font-black text-amber-800/80 dark:text-amber-400/70 uppercase tracking-widest">{lang === 'ar' ? 'الوصف العقاري الفاخر' : 'Luxury Description'}</h4>
              <p className="text-amber-950 dark:text-amber-100/80 text-xs md:text-sm leading-relaxed mt-2 whitespace-pre-line font-medium">
                {details}
              </p>
            </div>

            {/* Quick specifications grid */}
            <div className="mb-6">
              <h4 className="text-xs font-black text-amber-800/80 dark:text-amber-400/70 uppercase tracking-widest mb-3">{lang === 'ar' ? 'مواصفات حصرية' : 'Exclusive Specs'}</h4>
              <div className="grid grid-cols-2 gap-2">
                {specs.map((spec, i) => (
                  <div 
                    key={i} 
                    className="p-2 bg-amber-500/10 dark:bg-amber-400/10 rounded-xl text-amber-950 dark:text-amber-250 text-xs font-bold leading-normal flex items-center gap-2 border border-amber-500/15 dark:border-amber-400/15"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Booking Module */}
          <div className="bg-amber-500/5 dark:bg-amber-400/5 p-5 rounded-2xl border border-amber-500/15 dark:border-amber-400/15">
            {successMsg ? (
              <div className="text-center p-4 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-black text-xl animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-amber-950 dark:text-amber-100/90 leading-relaxed text-center">
                  {successMsg}
                </p>
                <button 
                  onClick={() => setSuccessMsg('')} 
                  className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {lang === 'ar' ? 'تقديم طلب آخر' : 'Submit another request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <h4 className="text-xs font-black text-amber-[#2C211A] dark:text-amber-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-550" />
                  <span>{lang === 'ar' ? 'طلب معاينة واتصال فوري مخصص' : 'Schedule VIP Viewing Request'}</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                    className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-amber-950 dark:text-amber-100 placeholder-amber-900/40"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder={lang === 'ar' ? 'رقم جوالك' : 'Phone Number'}
                    className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-amber-950 dark:text-amber-100 placeholder-amber-900/40"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <input 
                    type="date"
                    className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 text-amber-900 dark:text-amber-100 font-bold"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-semibold leading-snug">
                    {lang === 'ar' ? 'واتساب مباشر متاح ٢٤ ساعة' : 'Direct VIP contact agent active'}
                  </div>
                </div>

                <textarea 
                  placeholder={lang === 'ar' ? 'أي ملاحظات إضافية أو تفاصيل مخصصة تريدها...' : 'Any additional comments...'}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-medium h-14 resize-none text-amber-950 dark:text-amber-100 placeholder-amber-900/40"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {/* WhatsApp click */}
                  <a 
                    href={`https://wa.me/966XXXXXXXXX?text=${encodeURIComponent(lang === 'ar' ? `السلام عليكم، أرغب في الاستفسار عن: ${title}` : `Hello, I'm interested in: ${title}`)}`}
                    target="_blank" 
                    rel="no-referrer"
                    className="py-2.5 bg-green-650 hover:bg-green-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-green-600/10 active:scale-95 text-center bg-green-600"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'واتساب مباشر' : 'WhatsApp'}</span>
                  </a>

                  {/* Submit Book request */}
                  <button 
                    type="submit"
                    className="py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-600 hover:to-yellow-600 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-550/10 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-950" />
                    <span>{lang === 'ar' ? 'إرسال الطلب' : 'Send Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
