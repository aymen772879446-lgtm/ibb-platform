import React, { useRef } from 'react';
import { MapPin, ArrowUpRight, Eye, Sparkles, Camera } from 'lucide-react';
import { Listing } from '../data';

interface ListingCardProps {
  key?: React.Key;
  listing: Listing;
  lang: 'ar' | 'en';
  onClick: () => void;
  onImageChange?: (id: string, newImageBase64: string) => void;
}

export default function ListingCard({ listing, lang, onClick, onImageChange }: ListingCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const title = lang === 'ar' ? listing.titleAr : listing.titleEn;
  const price = lang === 'ar' ? listing.priceAr : listing.priceEn;
  const location = lang === 'ar' ? listing.locationAr : listing.locationEn;
  const category = lang === 'ar' ? listing.categoryAr : listing.categoryEn;
  const specs = lang === 'ar' ? listing.specsAr : listing.specsEn;

  return (
    <div 
      className="group relative bg-[#FFFDF9]/90 dark:bg-[#0c0d12]/80 backdrop-blur-md rounded-3xl border border-amber-500/10 dark:border-amber-400/10 hover:border-amber-500/40 dark:hover:border-amber-400/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-amber-500/5 dark:hover:shadow-none hover:-translate-y-1.5"
      id={`listing-card-${listing.id}`}
    >
      {/* Featured Ribbon / Badge */}
      {listing.featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] md:text-xs font-black rounded-full shadow-md shadow-amber-550/10">
          <Sparkles className="w-3" />
          <span>{lang === 'ar' ? 'مميز' : 'Featured'}</span>
        </div>
      )}

      {/* Property/Car Identifier Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-black/50 backdrop-blur-md text-amber-300 text-[10px] md:text-xs font-black rounded-full border border-amber-400/20">
        <span>{category}</span>
      </div>

      {/* Hidden File Input for Custom authentic uploading */}
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

      {/* Image Wrapper */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src={listing.image} 
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Upload original photo action */}
        {onImageChange && (
          <button 
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="absolute top-14 right-4 z-10 p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-xs border border-amber-300 flex items-center gap-1.5 cursor-pointer group/cam font-black"
            title={lang === 'ar' ? 'رفع جودة الصورة برفع صورتك الحقيقية' : 'Upload original full-resolution photo'}
          >
            <Camera className="w-4 h-4" />
            <span className="max-w-0 overflow-hidden group-hover/cam:max-w-[200px] transition-all duration-300 ease-out whitespace-nowrap text-[10px] md:text-2xs">
              {lang === 'ar' ? 'رفع صورتك الأصلية (كما هي بدون أي تعديل)' : 'Upload your exact photo (as is)'}
            </span>
          </button>
        )}

        {/* Shadow overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040508]/90 via-[#040508]/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
        
        {/* Bottom Left Price inside image boundary */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-4 py-1.5 rounded-2xl shadow-lg shadow-amber-500/20 text-xs md:text-sm tracking-wide">
            {price}
          </div>
          <div className="bg-black/60 backdrop-blur-md text-[#FFFDF9] text-[10px] md:text-[11.5px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 border border-amber-500/10">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[125px]">{location}</span>
          </div>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-6 flex-grow flex flex-col justify-between gap-5">
        <div>
          <h3 className="text-lg md:text-xl font-black text-[#2C211A] dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-[#2C211A]/70 dark:text-amber-200/50 mt-2 line-clamp-2 leading-relaxed">
            {lang === 'ar' ? listing.detailsAr : listing.detailsEn}
          </p>
        </div>

        {/* Specifications specs wrap */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          {specs.slice(0, 4).map((spec, i) => (
            <div 
              key={i} 
              className="px-2.5 py-1.5 bg-amber-500/5 dark:bg-amber-400/5 rounded-xl text-[#2C211A]/80 dark:text-amber-200/70 text-xs font-bold flex items-center gap-1.5 border border-amber-500/10 dark:border-amber-400/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="truncate">{spec}</span>
            </div>
          ))}
        </div>

        {/* Call to action view details */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full py-3 px-4 bg-amber-500/5 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 text-amber-700 dark:text-amber-300 hover:shadow-md hover:shadow-amber-500/10 text-xs font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 border border-amber-500/20 hover:border-transparent group/btn"
        >
          <Eye className="w-4 h-4 group-hover/btn:rotate-12 transition-transform text-amber-500 group-hover/btn:text-slate-950" />
          <span>{lang === 'ar' ? 'عرض التفاصيل والطلب' : 'View Details & Request'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100" />
        </button>
      </div>
    </div>
  );
}
