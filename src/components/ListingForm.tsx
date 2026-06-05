import React, { useState } from 'react';
import { Plus, Check, ImageIcon, Sparkles, Building, Car, X } from 'lucide-react';
import { Listing } from '../data';

interface ListingFormProps {
  lang: 'ar' | 'en';
  onAddListing: (newListing: Listing) => void;
}

export default function ListingForm({ lang, onAddListing }: ListingFormProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const [type, setType] = useState<'property' | 'car'>('property');
  const [titleAr, setTitleAr] = useState<string>('');
  const [titleEn, setTitleEn] = useState<string>('');
  const [priceAr, setPriceAr] = useState<string>('');
  const [priceEn, setPriceEn] = useState<string>('');
  const [locationAr, setLocationAr] = useState<string>('');
  const [locationEn, setLocationEn] = useState<string>('');
  const [categoryAr, setCategoryAr] = useState<string>('');
  const [categoryEn, setCategoryEn] = useState<string>('');
  const [specsAr, setSpecsAr] = useState<string>('');
  const [specsEn, setSpecsEn] = useState<string>('');
  const [detailsAr, setDetailsAr] = useState<string>('');
  const [detailsEn, setDetailsEn] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleTypeSelect = (selected: 'property' | 'car') => {
    setType(selected);
    // Autofill nice demo images & categories based on choice to ease user testing input!
    if (selected === 'property') {
      setImageUrl('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
      setCategoryAr('فلل حديثة');
      setCategoryEn('Modern Villas');
    } else {
      setImageUrl('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80');
      setCategoryAr('سيارات رياضية');
      setCategoryEn('Sport Cars');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: Listing = {
      id: `custom-${Date.now()}`,
      type,
      titleAr: titleAr || (lang === 'ar' ? 'إعلان جديد' : 'New Advertisement'),
      titleEn: titleEn || (lang === 'ar' ? 'إعلان جديد' : 'New Advertisement'),
      priceAr: priceAr,
      priceEn: priceEn,
      locationAr: locationAr,
      locationEn: locationEn,
      categoryAr: categoryAr,
      categoryEn: categoryEn,
      specsAr: specsAr ? specsAr.split(',').map(s => s.trim()) : [],
      specsEn: specsEn ? specsEn.split(',').map(s => s.trim()) : [],
      image: imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      detailsAr: detailsAr,
      detailsEn: detailsEn
    };

    onAddListing(newListing);
    setSuccess(true);
    
    // Reset state values
    setTitleAr('');
    setTitleEn('');
    setPriceAr('');
    setPriceEn('');
    setLocationAr('');
    setLocationEn('');
    setCategoryAr('');
    setCategoryEn('');
    setSpecsAr('');
    setSpecsEn('');
    setDetailsAr('');
    setDetailsEn('');
    setImageUrl('');

    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="bg-[#FFFDF9]/90 dark:bg-[#0c0d12]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-amber-500/15 dark:border-amber-400/10 shadow-lg" id="listing-form-root">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-500/10 dark:bg-amber-400/10 rounded-2xl text-amber-550 dark:text-amber-400 border border-amber-500/10">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#2C211A] dark:text-amber-100">
            {lang === 'ar' ? 'إضافة عقار أو سيارة لعرضك الخاص' : 'Submit Luxury Property or Car'}
          </h3>
          <p className="text-xs text-amber-900/60 dark:text-amber-200/55 mt-0.5 font-medium">
            {lang === 'ar' ? 'أدخل التفاصيل والتقسيمات وسيقوم نظام أحمد الهمداني بإدراج العرض مباشرة بالواجهة' : 'Submit any VIP unit details and have it seamlessly queued into our active catalogue instantly'}
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 p-6 rounded-2xl border border-emerald-500/20 dark:border-emerald-900/40 text-center flex flex-col items-center gap-3 animate-fade-in">
          <Check className="w-10 h-10 text-emerald-500" />
          <p className="font-bold text-sm md:text-base">
            {lang === 'ar' ? 'تهانينا! تم إدراج عرضك الخاص بنجاح على المنصة.' : 'Congratulations! Your premium listing has been published instantly to Al-Hamdani portal.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Main selection toggle for Property/Car */}
          <div className="flex justify-center gap-4 bg-amber-500/5 dark:bg-[#07080a]/60 p-1.5 rounded-2xl max-w-sm mx-auto border border-amber-500/15 dark:border-amber-400/10">
            <button
              type="button"
              onClick={() => handleTypeSelect('property')}
              className={`flex-1 py-1.5 md:py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                type === 'property' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md' 
                  : 'text-amber-900/60 dark:text-amber-300/50 hover:bg-amber-500/10 dark:hover:bg-amber-400/10'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{lang === 'ar' ? 'عقار فاخر' : 'Luxury Estate'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeSelect('car')}
              className={`flex-1 py-1.5 md:py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                type === 'car' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md' 
                  : 'text-amber-900/60 dark:text-amber-300/50 hover:bg-amber-500/10 dark:hover:bg-amber-400/10'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{lang === 'ar' ? 'سيارة سوبر كار' : 'Super Car'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Arabic Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}</label>
              <input 
                type="text" 
                placeholder="مثال: فيلا قصر الياسمين الفاخرة"
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
              />
            </div>

            {/* English Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'العنوان بالإنجليزية' : 'Title (English)'}</label>
              <input 
                type="text" 
                placeholder="Example: Al-Yasmin Palace Villa"
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
            </div>

            {/* Price AR & EN */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'السعر بالعربية' : 'Price (Arabic)'}</label>
              <input 
                type="text" 
                placeholder="مثال: ٤,٢٠٠,٠٠٠ ريال"
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={priceAr}
                onChange={(e) => setPriceAr(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'السعر بالإنجليزية' : 'Price (English)'}</label>
              <input 
                type="text" 
                placeholder="Example: 4,200,000 SAR"
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={priceEn}
                onChange={(e) => setPriceEn(e.target.value)}
              />
            </div>

            {/* Location AR & EN */}
            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'الموقع بالعربية' : 'Location (Arabic)'}</label>
                <input 
                  type="text" 
                  placeholder="مثال: الرياض، حي حطين" 
                  className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                  value={locationAr}
                  onChange={(e) => setLocationAr(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'الموقع بالإنجليزية' : 'Location (English)'}</label>
                <input 
                  type="text" 
                  placeholder="Example: Riyadh, Hettin" 
                  className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                  value={locationEn}
                  onChange={(e) => setLocationEn(e.target.value)}
                />
              </div>
            </div>

            {/* Specifications Details separators */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'المواصفات (مفصولة بفاصلة) بالعربية' : 'Specs (comma separated) AR'}</label>
              <input 
                type="text" 
                placeholder="مثال: ٥ غرف، مسبح خاص، كراج فسيح" 
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={specsAr}
                onChange={(e) => setSpecsAr(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'المواصفات (مفصولة بفاصلة) بالإنجليزية' : 'Specs (comma separated) EN'}</label>
              <input 
                type="text" 
                placeholder="Example: 5 Rooms, Pool, Spacious Garage" 
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 font-bold text-xs text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={specsEn}
                onChange={(e) => setSpecsEn(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'الفئة بالعربية' : 'Category (Arabic)'}</label>
              <input 
                type="text" 
                placeholder="مثال: فلل فاخرة" 
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 text-xs font-bold text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={categoryAr}
                onChange={(e) => setCategoryAr(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'الفئة بالإنجليزية' : 'Category (English)'}</label>
              <input 
                type="text" 
                placeholder="Example: Luxury Villas" 
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 text-xs font-bold text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={categoryEn}
                onChange={(e) => setCategoryEn(e.target.value)}
              />
            </div>

            {/* Image link or File Upload */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'ar' ? 'صورة العرض (يمكنك رفع صورتك الأصلية الصافية مباشرة أو وضع رابط)' : 'Sovereign Image (Upload your high-res original photo or paste URL)'}</span>
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'أدخل رابط الصورة أو اختر ملف هكذا https://...' : 'Paste image URL or upload directly...'}
                  className="flex-grow px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 text-xs font-bold text-amber-950 dark:text-amber-100 placeholder-amber-900/30 font-bold"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                
                <div className="relative">
                  <input 
                    type="file"
                    id="form-image-uploader"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            setImageUrl(evt.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('form-image-uploader')?.click()}
                    className="w-full sm:w-auto px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl border border-amber-400/20 shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'اختر ملف الصورة' : 'Select Photo File'}</span>
                  </button>
                </div>
              </div>
              
              {imageUrl && (
                <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-amber-500/20 shadow-sm animate-fade-in flex items-center justify-center bg-zinc-950">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Description Details Box */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'التفاصيل والوصف بالكامل (عربي)' : 'Details Description (Arabic)'}</label>
              <textarea 
                placeholder="اكتب وصفاً جذاباً لعقارك يوضح المميزات والمرافق المتاحة بالكامل..."
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 text-xs font-medium h-20 resize-none text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={detailsAr}
                onChange={(e) => setDetailsAr(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-amber-900/80 dark:text-amber-200/80">{lang === 'ar' ? 'التفاصيل والوصف بالكامل (إنجليزي)' : 'Details Description (English)'}</label>
              <textarea 
                placeholder="Write an outstanding presentation for your luxury asset..."
                className="px-4 py-3 rounded-xl bg-white dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 focus:outline-none focus:border-amber-500 text-xs font-medium h-20 resize-none text-amber-950 dark:text-amber-100 placeholder-amber-900/30"
                value={detailsEn}
                onChange={(e) => setDetailsEn(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs md:text-sm rounded-2xl transition-all hover:from-amber-600 hover:to-yellow-600 shadow-md shadow-amber-550/10 hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{lang === 'ar' ? 'إطلاق العرض وعرضه على لوحة المنصة' : 'Publish & Broadcast to Live Catalogue'}</span>
          </button>

        </form>
      )}

    </div>
  );
}
