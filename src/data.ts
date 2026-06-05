export interface Listing {
  id: string;
  type: 'property' | 'car';
  titleAr: string;
  titleEn: string;
  priceAr: string;
  priceEn: string;
  locationAr: string;
  locationEn: string;
  specsAr: string[];
  specsEn: string[];
  image: string;
  categoryAr: string;
  categoryEn: string;
  featured: boolean;
  detailsAr: string;
  detailsEn: string;
}

export const listingsData: Listing[] = [
  // PROPERTIES (العقارات)
  {
    id: 'prop-1',
    type: 'property',
    titleAr: 'برج ستار تاور السكني المهيب',
    titleEn: 'Star Tower Premium Residence',
    priceAr: '4,500,000 ريال',
    priceEn: '4,500,000 SAR',
    locationAr: 'الرياض، حي حطين',
    locationEn: 'Riyadh, Hettin',
    categoryAr: 'فلل وأبراج فاخرة',
    categoryEn: 'Villas & Palaces',
    specsAr: ['شقة بنتهاوس فاخرة', 'إطلالة بانورامية كاملة', 'تصاميم زجاجية علوية', 'موقف لسيارات حديثة'],
    specsEn: ['Luxury Penthouse Unit', 'Full Panoramic View', 'Top Glass Dome Cupola', 'Futuristic Garage Space'],
    image: '/src/assets/images/star_tower_1779833605862.png',
    featured: true,
    detailsAr: 'تحفة معمارية رائعة تتمثل في مبنى برج ستار تاور (STAR TOWER) السكني الراقي المتميز بالهيكل الأبيض البصري والواجهة الزجاجية الكلية باللونين الأزرق والذهبي، مع تفاصيل معمارية رائعة وقبة بانورامية دائرية علوية فاخرة.',
    detailsEn: 'A magnificent towering residential structure named Star Tower. Showcasing pristine white and premium blue steel cladding, gorgeous balconies, and a panoramic circular glass dome crowning the penthouse level.'
  },
  {
    id: 'prop-2',
    type: 'property',
    titleAr: 'شقة بنتهاوس إطلالة بحرية كاملة',
    titleEn: 'Oceanfront Luxury Penthouse',
    priceAr: '3,200,000 ريال',
    priceEn: '3,200,000 SAR',
    locationAr: 'جدة، الكورنيش الشمالي',
    locationEn: 'Jeddah, Northern Corniche',
    categoryAr: 'بنتهاوس',
    categoryEn: 'Penthouse',
    specsAr: ['٤ غرف نوم', 'مطل على البحر', 'شرفة واسعة', 'حراسة ٢٤/٧'],
    specsEn: ['4 Bedrooms', 'Full Sea View', 'Grand Terrace', '24/7 Security'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    detailsAr: 'بنتهاوس راقي يتربع فوق أعلى الأبراج السكنية على كورنيش جدة. توفر الشقة إطلالة بانورامية ساحرة ومفتوحة تماماً على مياه البحر الأحمر الفيروزية.',
    detailsEn: 'Sophisticated penthouse spanning the top level of Jeddah Corniche premier tower. It offers seamless panoramic glass-walls overlooking the pristine turquoise water of the Red Sea.'
  },
  {
    id: 'prop-3',
    type: 'property',
    titleAr: 'عمارة سكنية اقتصادية جاهزة للتشطيب',
    titleEn: 'Raw Concrete Frame Blockwork Villa',
    priceAr: '1,200,000 ريال',
    priceEn: '1,200,000 SAR',
    locationAr: 'حي البناء الشعبي الصاعد',
    locationEn: 'Developing Blockwork District',
    categoryAr: 'مباني وعمارات',
    categoryEn: 'Buildings',
    specsAr: ['بلك رمادي متين مسلح', 'نوافذ زجاجية مقوسة', 'مدخل سيارة خاص أمامي', 'هيكل جاهز للتشطيب'],
    specsEn: ['Solid Grey Cinder Blocks', 'Classic Arched Blue Windows', 'Front Gated Vehicle Alley', 'Shell Frame Ready to Finish'],
    image: '/src/assets/images/grey_villa_1779833624104.png',
    featured: false,
    detailsAr: 'بناء سكني مستقل ومنظم بالكامل مبني بالخرسانة والبلوك رمادي اللون المتين، تمتاز بنوافذ مقوسة رائعة ذات إطار عازل أبيض مموج وزجاج حماية أزرق، توفر فرصة استثمارية رائعة للتخصيص والتشطيب النهائي.',
    detailsEn: 'A private multi-story structure built from sturdy grey unpainted hollow block and robust columns, featuring distinctive structural arched windows with serene blue windowpanes and white vinyl accents.'
  },

  // CARS (السيارات)
  {
    id: 'car-1',
    type: 'car',
    titleAr: 'رولز رويس كولينان مانسوري',
    titleEn: 'Rolls Royce Cullinan Mansory',
    priceAr: '2,400,000 ريال',
    priceEn: '2,400,000 SAR',
    locationAr: 'الرياض، معرض الملوك',
    locationEn: 'Riyadh, Kings Showroom',
    categoryAr: 'سيارات فاخرة',
    categoryEn: 'Luxury Cars',
    specsAr: ['محرك V12 ٦.٧٥ لتر', '٦٠٠ حصان', 'عداد صفر', 'لون أبيض لؤلؤي'],
    specsEn: ['V12 6.75L Twin-Turbo', '600 HP', 'Odometer 0 km', 'Pearl White Color'],
    image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    detailsAr: 'الكروس أوفر الفاخرة الأرقى عالمياً بتعديل مانسوري الحصري. مجهزة بداخلية مكسوة بالكامل بالجلد الطبيعي الفاخر باللون الزعفراني، وسقف مرصع بالنجوم المضيئة.',
    detailsEn: 'The absolute pinnacle of luxury off-roaders customized under the elite Mansory program. Saturated with full premium saffron leather interior, and the iconic star-light headliner setup.'
  },
  {
    id: 'car-2',
    type: 'car',
    titleAr: 'مرسيدس جي كلاس G63 AMG',
    titleEn: 'Mercedes G-Class G63 AMG',
    priceAr: '950,000 ريال',
    priceEn: '950,000 SAR',
    locationAr: 'جدة، شارع التحلية',
    locationEn: 'Jeddah, Tahlia Street',
    categoryAr: 'مركبات دفع رباعي ومعدلة',
    categoryEn: 'SUVs & Customs',
    specsAr: ['بي-توربو V8 ٤.٠ لتر', '٥٨٥ حصان', 'موديل ٢٠٢٥', 'ألياف الكربون'],
    specsEn: ['Bi-Turbo V8 4.0L', '585 HP', '2025 Model', 'Carbon Fiber Trim'],
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    detailsAr: 'مرسيدس جي كلاس رائدة الدفع الرباعي الرياضي. يجمع الموديل الجديد لعام ٢٠٢٥ بين شراسة الأداء والتصميم الكلاسيكي الخالد مع مقصورة رقمية بالكامل.',
    detailsEn: 'The masterclass of off-road sportiness. The premium 2025 G63 SUV models deliver aggressive power on the highway and rough paths with a totally digitized high-tech luxury cockpit.'
  },
  {
    id: 'car-3',
    type: 'car',
    titleAr: 'بورش ٩١١ توربو إس',
    titleEn: 'Porsche 911 Turbo S',
    priceAr: '1,150,050 ريال',
    priceEn: '1,150,050 SAR',
    locationAr: 'الرياض، حي السليمانية',
    locationEn: 'Riyadh, Al-Sulaimaniyah',
    categoryAr: 'سيارات رياضية',
    categoryEn: 'Sports Cars',
    specsAr: ['محرك بوكسر ٣.٨ لتر', '٦٥٠ حصان', '٠-١٠٠ كم/س في ٢.٧ ثانية', 'رمادي كرايون'],
    specsEn: ['3.8L Twin-Turbo Boxer', '650 HP', '0-100 in 2.7 Sec', 'Crayon Grey Body'],
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    detailsAr: 'صاروخ بورش الأرضي فئة التوربو إس مع تسارع خارق ونظام توجيه خلفي ذكي للأداء الديناميكي العالي، مجهز بمكابح السيراميك والمقصورة الرياضية المتكاملة.',
    detailsEn: 'The absolute asphalt rocket of Porsche. Featuring incredible twin-turbocharged boxer response, active rear-axle steering, carbon-ceramic brakes, and full track-focused ergonomic design.'
  }
];

export const platformStats = {
  propertiesCountAr: 'أكثر من ١٥٠ عقار فاخر',
  propertiesCountEn: 'Over 150+ Luxury Estates',
  carsCountAr: 'أكثر من ٨٠ سيارة خارقة',
  carsCountEn: 'Over 80+ Hyper Cars',
  happyClientsAr: '٩٩٪ رضا عملاءنا الكرام',
  happyClientsEn: '99% Satified VIP Clients',
  totalAr: 'أكثر من ٢٥٠ مليون ريال أصول مدارة',
  totalEn: 'Over 250M+ SAR Assets Under Management'
};
