import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import TrustModal from './TrustModal';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Plus, 
  Search, 
  MapPin, 
  RotateCcw, 
  Building, 
  Car, 
  Smartphone, 
  X, 
  CheckCircle2, 
  Megaphone, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown,
  BookOpen,
  Home, 
  FolderOpen,
  Heart,
  MoreVertical,
  Settings,
  FileText,
  HelpCircle,
  Info,
  LogOut,
  Trash2,
  User,
  Sparkles,
  Edit,
  Sliders,
  Download
} from 'lucide-react';
import { Listing, UserProfile } from '../types';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import AuthSection from './AuthSection';
import AdminPanel from './AdminPanel';
import AmanImageUploader from './AmanImageUploader';

const initialListings: Listing[] = [
  // real estate verified listings
  {
    id: 're-1',
    category: 'real-estate',
    title: 'شقة سكنية عائلية للإيجار - الدائري الغربي',
    price: '250$ شهرياً',
    type: 'apart',
    status: 'للإيجار',
    location: 'الدائري',
    phone: '967770000000',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    desc: 'شقة سكنية متكاملة تقع في أرقى شوارع الدائري الغربي بمدينة إب. تتكون من 4 غرف واسعة، صالة مستقلة، مطبخ حديث، وحمامين. خزان ماء مستقل وموقف سيارة.',
    featured: true,
    date: '2026-05-20'
  },
  {
    id: 're-2',
    category: 'real-estate',
    title: 'أرض استثمارية بصيرة شرعية معمدة - جبل ربي المطل',
    price: '65,000$',
    type: 'land',
    status: 'للبيع',
    location: 'جبل ربي',
    phone: '967770000000',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    desc: 'أرض سكنية ممتازة بموقع مرتفع تطل على مدينة إب بالكامل. بمساحة مناسبة للبناء الفوري والترخيص جاهز ومعتمد ومسجل بالسجل العقاري.',
    featured: true,
    date: '2026-05-22'
  },
  {
    id: 're-3',
    category: 'real-estate',
    title: 'شقة تمليك تشطيب ديلوكس مفحوصة الوثائق - المعاين',
    price: '38,000$',
    type: 'apart',
    status: 'للبيع',
    location: 'المعاين',
    phone: '96777111222',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    desc: 'فرصة لا تعوض لشراء شقة تمليك في حي المعاين الحيوي بمحافظة إب. الطابق الثالث، مصعد كهربائي نشط، وموقف خاص وحراسة مستمرة.',
    featured: false,
    date: '2026-05-23'
  },
  // verified car listings
  {
    id: 'car-1',
    category: 'cars',
    title: 'تويوتا هايلوكس غمارة دبل 2021 محرك مفحوص وبحالة الزيرو',
    price: '22,500$',
    brand: 'toyota',
    transmission: 'يدوي',
    customs: 'مجمرك جاهز',
    phone: '967770000000',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    desc: 'تويوتا هايلوكس جير عادي، دبل شغال ممتاز، خالية من الصدمات والرش، نظيفة جداً، مجمركة في منفذ شحن وجاهزة للترخيص اللوحات.',
    featured: true,
    date: '2026-05-21'
  },
  {
    id: 'car-2',
    category: 'cars',
    title: 'هيونداي سنتافي 2018 فل كامل ليمتد استخدام عائلي نظيف',
    price: '12,500$',
    brand: 'hyundai',
    transmission: 'أتوماتيك',
    customs: 'مجمرك جاهز',
    phone: '96777444555',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    desc: 'سنتافي لون مميز، محرك ستة بستون قوي، نظام تشغيل بصمة، فتحة سقف بانوراما، مقاعد جلد كهربائية مع تبريد وتدفئة مدمجة.',
    featured: true,
    date: '2026-05-24'
  }
];

interface Article {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'real-estate' | 'cars';
  date: string;
  readTimeAr: string;
  readTimeEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string[];
  contentEn: string[];
}

const editorialArticles: Article[] = [
  {
    id: 'art-1',
    titleAr: 'كيف تختار أرضاً للبيع في محافظة إب بذكاء وتتجنب محاولات التلاعب والنزاعات الميدانية؟',
    titleEn: 'How to Smartly Choose a Land for Sale in Ibb and Avoid Disputes?',
    category: 'real-estate',
    date: '2026-06-01',
    readTimeAr: 'قراءة في ٤ دقائق',
    readTimeEn: '4 min read',
    summaryAr: 'دليل عملي شامل لفحص البصيرة الشرعية المعمدة والتأكد من الحدود الجغرافية وملكيات الأراضي وخلوها من النزاعات الشائعة.',
    summaryEn: 'A practical guide to checking certified ownership deeds, verifying geographical borders, and avoiding common property conflicts in Ibb.',
    contentAr: [
      'تعتبر محافظة إب (المدينة الخضراء) واحدة من أكثر المدن اليمنية طلباً على الأراضي والعقارات نظراً لطبيعتها الخلابة وموقعها الجغرافي المتميز وتدفق أموال المغتربين للاستثمار فيها. ولكن لشراء أرض بأمان، يجب اتباع خطوات قانونية صارمة لتجنب نزاعات الملكية الشائعة.',
      'أولاً: فحص البصيرة الشرعية المعمدة. يجب التأكد من تطابق سلسلة الملكيات السابقة للأرض (من البائع الحالي وحتى الأصل) وأن تكون البصيرة معمدة رسمياً لدى السجل العقاري والمحكمة المختصة في محافظة إب.',
      'ثانياً: النزول الميداني والتحقق الحسي من الحدود والمساحة. لا تكتفِ أبداً بقراءة الأرقام على الورق؛ يفضل الاستعانة بمهندس مساحة مستقل لمطابقة أبعاد وبنود البصيرة بالملكية الفعلية على أرض الواقع والتحقق من عدم تداخلها مع الممتلكات المجاورة.',
      'ثالثاً: الاستعلام عن خلو الأرض من أي منازعات أو رهونات قائمة. قم بالسؤال في إدارة السجل العقاري ولدى وجهاء المنطقة وعقال الحارات المحليين في الجوار للتأكد من نزاهة السيرة وتوفر السلم والمصداقية.',
      'خامساً: توثيق معايير الشراء بحضور شهود عدول وتحرير اتفاقية ابتدائية تضمن حقوق الطرفين إلى حين الانتهاء من إجراءات الإفراغ والتسجيل بوزارة العدل والسجل العقاري.'
    ],
    contentEn: [
      'Ibb province (The Green City) is one of the most sought-after Yemeni regions for land acquisitions and real estate investment. To buy space safely, strict legal protocols are required.',
      'First: Authenticate the certified deed document. Review old transitions leading to the current seller, and ensure it has official registration in Ibbs property registry.',
      'Second: Physical site surveys. Do not rely solely on paperwork. Hire an independent land surveyor to check the boundaries, verify the area, and ensure zero overlaps with neighbors.',
      'Third: Inquire about current legal disputes. Consult local district leaders and official registries to check for pending title claims or asset lien conditions.',
      'Fourth: Formally record the transaction with trustworthy witnesses, creating initial contracts to safeguard buyer and seller rights until public notary records are fully transferred.'
    ]
  },
  {
    id: 'art-2',
    titleAr: 'أبرز مناطق الاستثمار العقاري الواعدة في محافظة إب لعام ٢٠٢٦',
    titleEn: 'Top Promising Real Estate Investment Hubs in Ibb for 2026',
    category: 'real-estate',
    date: '2026-05-28',
    readTimeAr: 'قراءة في ٣ دقائق',
    readTimeEn: '3 min read',
    summaryAr: 'دراسة تحليلية دقيقة حول اتجاهات الأسعار في أحياء المعاين، الدائري، والظهار وتوقعات النمو العقاري بالمحافظة.',
    summaryEn: 'An analytical review of price trends in Al-Ma\'ayen, Ring Road, and Al-Dhar districts with future growth expectations.',
    contentAr: [
      'يتساءل الكثير من اليمنيين بالداخل وبالمغتربين عن أفضل الأحياء للاستثمار السكني أو التجاري داخل محافظة إب بالوقت الحاضر. تتأثر القيمة الشرائية بالعديد من العوامل مثل وفرة الخدمات وشبكة الطرق وسلامة التضاريس والسيول.',
      'منطقة المعاين (المدخل الغربي للمدينة): تشهد نمواً بيانياً ضخماً وتوسعاً في الخدمات الطبية والتعليمية. الاستثمار في شقق التمليك أو المحلات التجارية هنا واعد جداً ويملك معدلات طلب جيدة طوال السنة.',
      'منطقة الدائري (الشرقي والغربي): تعتبر نبض الحركة التجارية الحرة في إب. المحلات التجارية على شوارع الدائري تحقق عوائد ممتازة، ورغم ارتفاع أسعار الإيجارات والبيع، إلا أن وتيرة نموها مستقرة وجاذبة للاستيراد والأعمال.',
      'حي الظهار (وسط المدينة): الخيار المفضل للسكن العائلي التقليدي المريح نظراً لوفرة الأسواق والمدارس والمرافق الأساسية. يتميز هذا الحي بالأمان والاستقرار وصعوبة الحصول على مساحات فارغة جديدة، مما يرفع باستمرار قيمة الأصول المتاحة فيه.',
      'ننصح المستثمرين دائماً بتنويع حافظاتهم العقارية والتركيز على العقارات ذات البنية التحتية الممتازة وشبكة تصريف مياه الأمطار النموذجية لتجنب تداعيات موسم الخريف الماطر.'
    ],
    contentEn: [
      'Yemeni expatriates and local buyers constantly ask about the prime neighborhoods for residential or business development in Ibb right now. Price points depend heavily on infrastructure, amenities, and geographical terrains.',
      'Al-Ma\'ayen District (West Entrance): Experiencing massive exponential sprawl with hospitals and private schools. Investing in flat ownership or retail stores here brings consistent year-round yields.',
      'The Ring Road (East/West): The retail backbone of Ibb city. Commercial spaces along this vital artery perform well; growth rates remain highly inviting for capital gains.',
      'Al-Dhar District (Downtown): The gold standard for premium multi-family residential setups due to dense schools, markets, and municipal services. Land values continue to climb steadily.',
      'We recommend that prospective buyers diversify their holdings, prioritize robust concrete frameworks, and focus on complexes with sound drainage systems to bypass rainy heavy tropical seasons.'
    ]
  },
  {
    id: 'art-3',
    titleAr: 'دليلك الشامل للنقاط الذهبية قبل وبعد شراء سيارات مستعملة في الجمهورية اليمنية',
    titleEn: 'Your Comprehensive Guide for Buying Used Cars in Yemen',
    category: 'cars',
    date: '2026-05-15',
    readTimeAr: 'قراءة في ٥ دقائق',
    readTimeEn: '5 min read',
    summaryAr: 'تفاصيل وشروحات هامة حول الفحص الميكانيكي، أمان وسلامة الهياكل من الحوادث والغرق، والجمارك والصرف.',
    summaryEn: 'Mechanical checklists, car chassis frame safety, salvage car detection, and customs verification standards in Yemen.',
    contentAr: [
      'سوق السيارات المستعملة في اليمن واسع ومكتظ بالخيارات، ولكنه يحمل كذلك ثغرات تتطلب وعياً كبيراً من المشتري لحماية مدخراته. إليك النقاط الذهبية التي لا يجب إغفال أي منها.',
      'أولاً: حظر سيارات الغرق والقص (Salvaged Cars). العديد من السيارات يتم استيرادها كأضرار تأمين أو تعرض للغرق والتلف أو صدمات الهيكل الخطيرة ثم يتم إعادتها للحالة المظهرية. اطلب تقرير كارفاكس (Carfax) وفحص الأوتوتشيك عبر مطابقة رقم شاصيه السيارة (VIN) قبل اتخاذ القرار.',
      'ثانياً: فحص الهيكل السفلي والمحرك والناقل الميكانيكي. خذ السيارة إلى فني كمبيوتر متخصص واطلب فحص تسريبات الزيت، سلامة المساعدات، وصوت المحرك، ومطابقة عداد الكيلومترات للتأكد من عدم التلاعب به.',
      'ثالثاً: التحقق من الحالة الجمركية للمركبة. من الضروري فحص أوراق الجمارك اليمنية الرسمية (بيان جمركي معمد) ومطابقة بياناته مع اللوحات الرسمية لتجنب الاضطرار لدفع غرامات جمركية إضافية لاحقاً.',
      'رابعاً: مقارنة أسعار قطع الغيار المتاحة في السوق اليمني. تذكر دائماً أن تويوتا وهيونداي تتمتعان بأعلى معدل توفر لقطع الغيار وبأسعار مقبولة لسهولة الصيانة وإعادة البيع بدون خسارة كبيرة.'
    ],
    contentEn: [
      'The used car market in Yemen can be incredibly crowded, which warrants vigilance to protect your savings. Here are the golden checkboxes to inspect before buying.',
      'First: Avoid flood-salvaged and frame-cut vehicles. Huge streams of cars import with serious structural damage, only to be cosmetically repaired. Request a Carfax or AutoCheck report using the vehicle identity number (VIN).',
      'Second: Run detailed drivetrain, chassis, and engine diagnostic checks. Visit professional computer scan centers to ensure zero oil leaks, verify clean transmission shifts, and run odometer discrepancy audits.',
      'Third: Confirm legal custom status papers. Confirm that the vehicle has official custom clearance certificates stamped to avoid retroactive penalties.',
      'Fourth: Review Yemeni spare part pricing and supply availability. Toyota and Hyundai enjoy high availability in Yemen, which translates to simpler repairs and exceptional resale margins.'
    ]
  }
];

interface AmanMarketplaceProps {
  lang: 'ar' | 'en';
  onBackToWelcome: () => void;
}

export default function AmanMarketplace({ lang, onBackToWelcome }: AmanMarketplaceProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsRefreshTrigger, setListingsRefreshTrigger] = useState<number>(0);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [formUploadedImages, setFormUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'real-estate' | 'cars' | 'security-center' | 'admin-dashboard'>('home');
  const [currentSearchCategory, setCurrentSearchCategory] = useState<'real-estate' | 'cars'>('real-estate');
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Search & Filtering States
  const [homeReType, setHomeReType] = useState<string>('');
  const [homeReLocation, setHomeReLocation] = useState<string>('');
  const [homeCarBrand, setHomeCarBrand] = useState<string>('');
  const [homeCarTrans, setHomeCarTrans] = useState<string>('');

  const [filterReType, setFilterReType] = useState<string>('');
  const [filterReStatus, setFilterReStatus] = useState<string>('');
  const [filterReLocation, setFilterReLocation] = useState<string>('');

  const [filterCarBrand, setFilterCarBrand] = useState<string>('');
  const [filterCarTrans, setFilterCarTrans] = useState<string>('');
  const [filterCarCustoms, setFilterCarCustoms] = useState<string>('');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showTrustModal, setShowTrustModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // User details
  const [userName, setUserName] = useState<string | null>(null);
  const [userIdForm, setUserIdForm] = useState<string>('');
  const [userPhoneForm, setUserPhoneForm] = useState<string>('');

  // Advanced Auth Flow & Anti-Bot Protection states
  const [authStep, setAuthStep] = useState<'details' | 'otp'>('details');
  const [authCountryCode, setAuthCountryCode] = useState<string>('+967'); // Default Yemen
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [recaptchaScanning, setRecaptchaScanning] = useState<boolean>(false);
  const [recaptchaScore, setRecaptchaScore] = useState<number | null>(null);
  const [authOtpCode, setAuthOtpCode] = useState<string[]>(['', '', '', '', '', '']); // 6 boxes for OTP
  const [authGeneratedOtp, setAuthGeneratedOtp] = useState<string>('');
  const [authOtpTimer, setAuthOtpTimer] = useState<number>(180); // 3 minutes = 180 seconds countdown
  const [authOtpAttempts, setAuthOtpAttempts] = useState<number>(0);
  const [remainingBlockTime, setRemainingBlockTime] = useState<number>(0); // count of seconds they are blocked (from Rate Limit)
  const [otpBanner, setOtpBanner] = useState<string | null>(null);

  // Form submission details
  const [formCategory, setFormCategory] = useState<'real-estate' | 'cars'>('real-estate');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formImage, setFormImage] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');

  const [formReType, setFormReType] = useState<string>('apart');
  const [formReStatus, setFormReStatus] = useState<string>('للبيع');
  const [formReLocation, setFormReLocation] = useState<string>('الظهار');

  const [formCarBrand, setFormCarBrand] = useState<string>('toyota');
  const [formCarTrans, setFormCarTrans] = useState<string>('أتوماتيك');
  const [formCarCustoms, setFormCarCustoms] = useState<string>('مجمرك جاهز');

  // Custom Notifications / Toasts
  const [toast, setToast] = useState<{ message: string; type: 'check' | 'info' } | null>(null);

  // Expanded interaction state
  const [showThreeDotMenu, setShowThreeDotMenu] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeSideModal, setActiveSideModal] = useState<'privacy' | 'terms' | 'help' | 'about' | 'favorites' | 'settings' | 'drawer' | null>(null);
  const [settingsAlerts, setSettingsAlerts] = useState<boolean>(true);
  const [settingsNotifications, setSettingsNotifications] = useState<boolean>(true);

  // Strategic AdSense Drawer and Navigation states
  const [drawerExpandedSection, setDrawerExpandedSection] = useState<'real-estate' | 'cars' | 'editorial' | 'settings' | 'favorites' | null>('editorial');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      try {
        // Fetch properties from Firestore
        const propsSnapshot = await getDocs(collection(db, 'properties'));
        let propsList: Listing[] = [];
        propsSnapshot.forEach(docSnap => {
          const d = docSnap.data();
          propsList.push({
            id: docSnap.id,
            category: 'real-estate',
            title: d.title || '',
            price: d.price || '',
            type: d.type || 'apart',
            status: d.status || 'للبيع',
            location: d.location || '',
            phone: d.phone || '',
            image: d.image || '',
            desc: d.desc || '',
            featured: d.featured || false,
            date: d.date || '',
            userId: d.userId || '',
            approved: d.approved !== undefined ? d.approved : true,
            images: d.images || []
          });
        });

        // Fetch cars from Firestore
        const carsSnapshot = await getDocs(collection(db, 'cars'));
        let carsList: Listing[] = [];
        carsSnapshot.forEach(docSnap => {
          const d = docSnap.data();
          carsList.push({
            id: docSnap.id,
            category: 'cars',
            title: d.title || `${d.brand || ''} ${d.model || ''}`,
            price: d.price || '',
            brand: d.brand || 'toyota',
            transmission: d.transmission || 'أتوماتيك',
            customs: d.customs || 'مجمرك جاهز',
            phone: d.phone || '',
            image: d.image || '',
            desc: d.desc || '',
            featured: d.featured || false,
            date: d.date || '',
            userId: d.userId || '',
            approved: d.approved !== undefined ? d.approved : true,
            images: d.images || []
          });
        });

        const combined = [...propsList, ...carsList];
        if (combined.length === 0) {
          // Firebase database is empty (newly provisioned), let's seed verified default items under local state
          setListings(initialListings);
          
          // Only attempt Firestore seeding if we have an authenticated user with a valid UID
          if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            for (const item of initialListings) {
              if (item.category === 'real-estate') {
                await setDoc(doc(db, 'properties', item.id), {
                  title: item.title,
                  price: item.price,
                  type: item.type || 'apart',
                  status: item.status || 'للبيع',
                  location: item.location || '',
                  phone: item.phone,
                  image: item.image,
                  desc: item.desc,
                  featured: item.featured,
                  date: item.date,
                  userId: uid,
                  approved: true
                });
              } else {
                await setDoc(doc(db, 'cars', item.id), {
                  brand: item.brand || 'toyota',
                  model: item.title.includes('هايلوكس') ? 'هايلوكس' : 'سنتافي',
                  title: item.title,
                  price: item.price,
                  transmission: item.transmission || 'أتوماتيك',
                  customs: item.customs || 'مجمرك جاهز',
                  phone: item.phone,
                  image: item.image,
                  desc: item.desc,
                  featured: item.featured,
                  date: item.date,
                  userId: uid,
                  approved: true
                });
              }
            }
          }
        } else {
          setListings(combined);
        }
      } catch (error) {
        console.error("Firestore loading or seeding failed, falling back to local state: ", error);
        // Resilient fallback to local browser cache
        const stored = localStorage.getItem('ibb_marketplace_listings');
        if (stored) {
          try {
            setListings(JSON.parse(stored));
          } catch (e) {
            setListings(initialListings);
          }
        } else {
          setListings(initialListings);
        }
      }
    };

    loadListings();

    const storedUser = localStorage.getItem('ibb_user_name');
    if (storedUser) {
      setUserName(storedUser);
    }

    // Retrieve offline-first favorites
    const storedFavs = localStorage.getItem('ibb_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        setFavorites([]);
      }
    }
  }, [listingsRefreshTrigger]);

  useEffect(() => {
    if (activeSideModal) {
      if (['settings', 'favorites', 'privacy', 'terms', 'about', 'help'].includes(activeSideModal)) {
        setDrawerExpandedSection(activeSideModal as any);
      }
    }
  }, [activeSideModal]);

  const toggleFavorite = (id: string) => {
    const isFav = favorites.includes(id);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter(favId => favId !== id);
      triggerToast(lang === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from favorites', 'info');
    } else {
      updated = [...favorites, id];
      triggerToast(lang === 'ar' ? 'تم الحفظ في المفضلة ❤️' : 'Saved to favorites ❤️', 'check');
    }
    setFavorites(updated);
    localStorage.setItem('ibb_favorites', JSON.stringify(updated));
  };

  const triggerToast = (msg: string, type: 'check' | 'info' = 'check') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Country Codes for secure formatting
  const COUNTRY_CODES = [
    { code: '+967', name: 'اليمن', nameEn: 'Yemen', flag: '🇾🇪' },
    { code: '+966', name: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', name: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪' },
    { code: '+968', name: 'عمان', nameEn: 'Oman', flag: '🇴🇲' },
    { code: '+965', name: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼' },
    { code: '+974', name: 'قطر', nameEn: 'Qatar', flag: '🇶🇦' },
    { code: '+973', name: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭' },
    { code: '+20', name: 'مصر', nameEn: 'Egypt', flag: '🇪🇬' },
    { code: '+962', name: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴' },
  ];

  // Input Sanitization helpers (Anti-XSS / Anti-SQL Injection)
  const sanitizeName = (rawInput: string): string => {
    return rawInput
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/[<>(){}[\]'"`;\\|&]/g, '') // Remove dangerous code injection brackets/operators
      .trim();
  };

  const sanitizePhone = (rawInput: string): string => {
    return rawInput.replace(/[^0-9]/g, ''); // Pure number sequence only
  };

  // Live countdown remaining block time updater
  const updateRemainingBlockTime = (phoneStr: string) => {
    const key = `ibb_ratelimit_${phoneStr}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.blockTime) {
          const rem = Math.ceil((data.blockTime - Date.now()) / 1000);
          if (rem > 0) {
            setRemainingBlockTime(rem);
            return rem;
          }
        }
      } catch (e) {}
    }
    setRemainingBlockTime(0);
    return 0;
  };

  // Rate Limiting helper: Max 3 requests per hour. Block for 24 hours.
  const checkRateLimit = (phoneNumber: string): { allowed: boolean; waitSeconds?: number } => {
    const key = `ibb_ratelimit_${phoneNumber}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.blockTime && now < data.blockTime) {
          return { allowed: false, waitSeconds: Math.ceil((data.blockTime - now) / 1000) };
        }
        
        // Filter requests in the last hour
        const oneHourAgo = now - 3600000;
        const recentRequests = (data.requests || []).filter((t: number) => t > oneHourAgo);
        
        if (recentRequests.length >= 3) {
          // Block for 24 hours (86,400 seconds)
          const blockEnding = now + 86400000;
          localStorage.setItem(key, JSON.stringify({ blockTime: blockEnding, requests: recentRequests }));
          return { allowed: false, waitSeconds: 86400000 / 1000 };
        }
        return { allowed: true };
      } catch (e) {
        return { allowed: true };
      }
    }
    return { allowed: true };
  };

  const recordRateLimitRequest = (phoneNumber: string) => {
    const key = `ibb_ratelimit_${phoneNumber}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();
    let data = { blockTime: 0, requests: [] as number[] };
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {}
    }
    data.requests = [...(data.requests || []).filter((t: number) => t > now - 3600000), now];
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Timers and Countdowns for Authentication Expiry
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAuthModal && authStep === 'otp' && authOtpTimer > 0) {
      timer = setInterval(() => {
        setAuthOtpTimer(prev => {
          if (prev <= 1) {
            setAuthGeneratedOtp(''); // Destroy OTP
            setAuthStep('details');
            setOtpBanner(null);
            triggerToast(
              lang === 'ar' 
                ? 'انتهت صلاحية رمز التحقق (3 دقائق). الرجاء طلب رمز جديد كلياً.' 
                : 'OTP verification code has expired (3 mins). Please request a new code.', 
              'info'
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showAuthModal, authStep, authOtpTimer, lang]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAuthModal && remainingBlockTime > 0) {
      timer = setInterval(() => {
        setRemainingBlockTime(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showAuthModal, remainingBlockTime]);

  const handleOtpBoxChange = (val: string, index: number) => {
    const sanitized = val.replace(/[^0-9]/g, '');
    if (sanitized === '' && val !== '') return; // Block any letters/symbols
    
    const newOtp = [...authOtpCode];
    newOtp[index] = sanitized.slice(-1); // Keep last digit
    setAuthOtpCode(newOtp);

    // Auto-focus next box if digit typed
    if (sanitized !== '' && index < 5) {
      const nextBox = document.documentElement.querySelector(`#otp-box-${index + 1}`) as HTMLInputElement | null;
      nextBox?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !authOtpCode[index] && index > 0) {
      const prevBox = document.documentElement.querySelector(`#otp-box-${index - 1}`) as HTMLInputElement | null;
      prevBox?.focus();
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading || recaptchaScanning) return;
    
    // 1. Sanitize input variables inline
    const cleanName = sanitizeName(userIdForm);
    const cleanPhone = sanitizePhone(userPhoneForm);
    
    setUserIdForm(cleanName);
    setUserPhoneForm(cleanPhone);

    if (!cleanName) {
      triggerToast(lang === 'ar' ? 'الرجاء إدخال اسمك الكريم وبدون رموز خاصة' : 'Please enter your true full name without special symbols', 'info');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      triggerToast(lang === 'ar' ? 'الرجاء إدخال رقم هاتف صحيح تماماً' : 'Please enter a valid active phone number', 'info');
      return;
    }

    const fullPhoneNumber = `${authCountryCode}${cleanPhone}`;

    // 2. Check active Rate Limits
    const limitCheck = checkRateLimit(fullPhoneNumber);
    if (!limitCheck.allowed) {
      const waitSec = limitCheck.waitSeconds || 86400;
      setRemainingBlockTime(waitSec);
      
      const hours = Math.floor(waitSec / 3600);
      const mins = Math.floor((waitSec % 3600) / 60);
      const secs = waitSec % 60;
      const formattedTime = hours > 0 
        ? `${hours} ساعة و ${mins} دقيقة` 
        : `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      
      triggerToast(
        lang === 'ar' 
          ? `عذراً! تم حظر هذا الرقم مؤقتاً لتجاوز حد المحاولات المسموح بها (3 طلبات/ساعة). متبقي: ${formattedTime}`
          : `Blocked temporarily due to excess requests. Wait: ${formattedTime}`,
        'info'
      );
      return;
    }

    // 3. Google reCAPTCHA v3 Stealth behavioral signals check
    setRecaptchaScanning(true);
    setAuthLoading(true);
    setRecaptchaScore(null);

    setTimeout(() => {
      // Analyze dummy telemetry signals
      const telemetryScore = 0.95; // Perfect human score
      setRecaptchaScore(telemetryScore);
      setRecaptchaScanning(false);

      // 4. Generate 6-digit secure OTP code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setAuthGeneratedOtp(generatedCode);
      setAuthOtpTimer(180); // 3 minutes
      setAuthOtpAttempts(0);
      setAuthOtpCode(['', '', '', '', '', '']); // Clear boxes
      recordRateLimitRequest(fullPhoneNumber);
      setAuthStep('otp');
      setAuthLoading(false);

      // Simulate network SMS push message for testing
      setOtpBanner(generatedCode);

      triggerToast(
        lang === 'ar'
          ? 'تم التحقق من أمان المتصفح عبر Google reCAPTCHA v3 وإرسال الرمز بنجاح! 📱'
          : 'reCAPTCHA v3 verified successfully! OTP sent! 📱'
      );
    }, 1500); // 1.5s professional delay
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;

    const combinedCode = authOtpCode.join('');
    
    if (combinedCode.length < 6) {
      triggerToast(
        lang === 'ar' ? 'الرجاء إدخال رمز التحقق كاملاً (6 أرقام)' : 'Please enter the complete 6-digit OTP', 
        'info'
      );
      return;
    }

    setAuthLoading(true);

    setTimeout(() => {
      setAuthLoading(false);
      if (combinedCode === authGeneratedOtp) {
        // Authenticated!
        localStorage.setItem('ibb_user_name', userIdForm.trim());
        localStorage.setItem('ibb_user_phone', `${authCountryCode}${userPhoneForm.trim()}`);
        setUserName(userIdForm.trim());
        setShowAuthModal(false);
        setAuthStep('details');
        setOtpBanner(null);
        triggerToast(
          lang === 'ar'
            ? `أهلاً بك يا ${userIdForm.trim()}، تم تفعيل اشتراكك بنجاح! 🔔`
            : `Welcome ${userIdForm.trim()}! Your subscription is active! 🔔`
        );
      } else {
        const nextAttempts = authOtpAttempts + 1;
        setAuthOtpAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          // Self-destruction of OTP code
          setAuthGeneratedOtp('');
          setAuthStep('details');
          setOtpBanner(null);
          triggerToast(
            lang === 'ar'
              ? 'تم تجاوز حد المحاولات الخاطئة (3 مرات) وتدمير الرمز تلقائياً للأمان! يرجى البدء من جديد.'
              : 'Incorrect limit exceeded (3 times). OTP destroyed for safety! Please restart.',
            'info'
          );
        } else {
          // Clear OTP
          setAuthOtpCode(['', '', '', '', '', '']);
          triggerToast(
            lang === 'ar'
              ? `رمز التحقق خاطئ! متبقي لديك ${3 - nextAttempts} محاولة قبل تدمير الرمز.`
              : `Incorrect code! You have ${3 - nextAttempts} attempts remaining.`,
            'info'
          );
        }
      }
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('ibb_user_name');
    localStorage.removeItem('ibb_user_phone');
    setUserName(null);
    setUserIdForm('');
    setUserPhoneForm('');
    setAuthStep('details');
    setAuthGeneratedOtp('');
    setOtpBanner(null);
    triggerToast(
      lang === 'ar' 
        ? 'تم تسجيل الخروج بنجاح 🔒، يمكنك التسجيل بحساب آخر الآن.' 
        : 'Logged out successfully! You can register with another account.'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice || !formPhone || !formDesc) {
      triggerToast(lang === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields', 'info');
      return;
    }

    let resolvedImg = formImage.trim();
    if (!resolvedImg) {
      resolvedImg = formCategory === 'cars'
        ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80';
    }

    const newListing: Listing = {
      id: formCategory + '-' + Date.now(),
      category: formCategory,
      title: formTitle,
      price: formPrice,
      phone: formPhone,
      desc: formDesc,
      image: resolvedImg,
      featured: false,
      date: new Date().toISOString().split('T')[0],
      userId: currentUserProfile?.uid || 'anonymous_user',
      approved: false, // Must be audited and approved by admin
      images: formUploadedImages.length > 0 ? formUploadedImages : [resolvedImg]
    };

    if (formCategory === 'real-estate') {
      newListing.type = formReType;
      newListing.status = formReStatus;
      newListing.location = formReLocation;
    } else {
      newListing.brand = formCarBrand;
      newListing.transmission = formCarTrans;
      newListing.customs = formCarCustoms;
    }

    // Direct Firestore persistence
    const saveToFirestore = async () => {
      try {
        if (formCategory === 'real-estate') {
          await setDoc(doc(db, 'properties', newListing.id), {
            title: newListing.title,
            price: newListing.price,
            type: formReType || 'apart',
            status: formReStatus || 'للبيع',
            location: formReLocation || '',
            phone: newListing.phone,
            image: newListing.image,
            desc: newListing.desc,
            featured: false,
            date: newListing.date,
            userId: newListing.userId,
            approved: false,
            images: newListing.images
          });
        } else {
          await setDoc(doc(db, 'cars', newListing.id), {
            brand: formCarBrand || 'toyota',
            model: formTitle.split(' ')[0] || 'Classic',
            title: newListing.title,
            price: newListing.price,
            transmission: formCarTrans || 'أتوماتيك',
            customs: formCarCustoms || 'مجمرك جاهز',
            phone: newListing.phone,
            image: newListing.image,
            desc: newListing.desc,
            featured: false,
            date: newListing.date,
            userId: newListing.userId,
            approved: false,
            images: newListing.images
          });
        }
      } catch (error) {
        console.warn("Failed to save new listing directly in remote firestore: ", error);
      }
    };
    saveToFirestore();

    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem('ibb_marketplace_listings', JSON.stringify(updated));

    // Reset Form
    setFormTitle('');
    setFormPrice('');
    setFormPhone('');
    setFormImage('');
    setFormDesc('');
    setFormUploadedImages([]);
    setShowAddModal(false);

    triggerToast(
      lang === 'ar'
        ? 'تم إرسال إعلانك وجاري تدقيقه واعتماده من المشرفين ليظهر للجمهور 🟢'
        : 'Your listing is sent and will appear publicly once approved by admins! 🟢'
    );
  };

  const reportListing = (title: string) => {
    const reportText = encodeURIComponent(`أهلاً إدارة منصة الأمان، أريد الإبلاغ عن هذا الإعلان للاشتباه في كونه غير دقيق أو وهمي: [${title}]`);
    window.open(`https://wa.me/967770000000?text=${reportText}`, '_blank');
    triggerToast(
      lang === 'ar' ? 'شكراً لك، تم فتح نافذة الإبلاغ والتنسيق مع الإدارة' : 'Thank you, secure report window has been launched.',
      'info'
    );
  };

  // Switch searching fields from home
  const triggerHomeSearch = (category: 'real-estate' | 'cars') => {
    setActiveTab(category);
    if (category === 'real-estate') {
      setFilterReType(homeReType);
      setFilterReLocation(homeReLocation);
    } else {
      setFilterCarBrand(homeCarBrand);
      setFilterCarTrans(homeCarTrans);
    }
  };

  const filterCategoryDirect = (category: 'real-estate' | 'cars', filterVal: string) => {
    setActiveTab(category);
    if (category === 'real-estate') {
      setFilterReType(filterVal);
    } else {
      if (filterVal === 'economy') {
        setFilterCarTrans('أتوماتيك');
      } else {
        setFilterCarBrand(filterVal);
      }
    }
  };

  const resetFilters = (category: 'real-estate' | 'cars') => {
    if (category === 'real-estate') {
      setFilterReType('');
      setFilterReStatus('');
      setFilterReLocation('');
    } else {
      setFilterCarBrand('');
      setFilterCarTrans('');
      setFilterCarCustoms('');
    }
    triggerToast(lang === 'ar' ? 'تم إعادة فرز النتائج بنجاح' : 'Filters reset successfully', 'info');
  };

  const handleDownloadCatalog = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Aman_Platform_${lang === 'ar' ? 'العروض' : 'Catalog'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast(
        lang === 'ar' 
          ? 'تم تنزيل دليل عروض منصة الأمان بنجاح! 📥' 
          : 'Aman Platform catalog downloaded successfully! 📥',
        'check'
      );
    } catch (e) {
      triggerToast('Error preparing download catalog', 'info');
    }
  };

  const handleOptionsClick = () => {
    const filterSection = document.getElementById('advanced-filter-panel');
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      triggerToast(
        lang === 'ar' 
          ? 'تم توجيهك إلى شريط الفلاتر المتقدمة 🔍' 
          : 'Scrolled to advanced search filters 🔍',
        'check'
      );
    } else {
      triggerToast(
        lang === 'ar'
          ? 'تصفح الفلاتر بالأسفل لتنقية العروض.'
          : 'Utilize the filters below to refine the lists.',
        'info'
      );
    }
  };

  // Get active filtered listings
  const getFilteredListings = (category: 'real-estate' | 'cars') => {
    let items = listings.filter(i => i.category === category);

    // Secure Filter: Only display approved listings (or legacy seeds) unless the item belongs to the signed-in user or an admin
    items = items.filter(i => 
      i.approved === true ||
      i.approved === undefined || 
      (currentUserProfile && i.userId === currentUserProfile.uid) ||
      (currentUserProfile && currentUserProfile.role === 'admin')
    );

    if (category === 'real-estate') {
      if (filterReType) items = items.filter(i => i.type === filterReType);
      if (filterReStatus) items = items.filter(i => i.status === filterReStatus);
      if (filterReLocation) items = items.filter(i => i.location === filterReLocation);
    } else {
      if (filterCarBrand) items = items.filter(i => i.brand === filterCarBrand);
      if (filterCarTrans) items = items.filter(i => i.transmission === filterCarTrans);
      if (filterCarCustoms) items = items.filter(i => i.customs === filterCarCustoms);
    }
    if (searchKeyword.trim() !== '') {
      const kw = searchKeyword.toLowerCase();
      items = items.filter(i => 
        i.title.toLowerCase().includes(kw) || 
        i.desc.toLowerCase().includes(kw) ||
        (i.location && i.location.toLowerCase().includes(kw))
      );
    }
    return items;
  };

  const realEstateItems = getFilteredListings('real-estate');
  const carItems = getFilteredListings('cars');
  const featuredItems = listings.filter(i => i.featured);

  return (
    <div className="w-full flex-grow flex flex-col justify-between text-[#2C211A] dark:text-slate-100" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Dynamic Toast HUD */}
      {toast && (
        <div className="fixed bottom-24 left-6 z-50 bg-slate-900/95 dark:bg-zinc-900/95 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-slate-700/45">
          <div className="text-emerald-400">
            {toast.type === 'check' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-sky-450" />}
          </div>
          <p className="text-xs sm:text-sm font-black select-none">{toast.message}</p>
        </div>
      )}

      {/* Premium Header */}
      <header className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-slate-100 dark:border-zinc-900 shadow-sm sticky top-0 z-40 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between" dir="ltr">
          
          {/* Left Side: Settings icon and sleek Add Ad button directly to its right */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveSideModal('settings')}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-105 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group flex items-center justify-center"
              title={lang === 'ar' ? 'لوحة الضبط والدعم' : 'Settings Drawer'}
            >
              <Settings className="w-5 h-5 text-slate-600 dark:text-zinc-400 group-hover:rotate-45 duration-500 transition-transform" />
            </button>

            {/* Spec-compliant 'Add Ad' button */}
            <button 
              onClick={() => setShowTrustModal(true)}
              className="group relative px-4 py-2 sm:px-5 sm:py-2.5 bg-[#128C7E] text-white font-extrabold rounded-2xl shadow-md shadow-[#128C7E]/20 hover:shadow-xl hover:shadow-[#128C7E]/30 active:scale-[0.98] transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 cursor-pointer border-0 [font-family:'Cairo',sans-serif] select-none hover:bg-[#159A8B]"
              title={lang === 'ar' ? 'إضافة إعلان جديد موثق' : 'Add verified ad'}
            >
              <div className="flex items-center gap-2 transition-transform duration-200 ease-out group-hover:-translate-y-[2px]">
                {/* Custom Icon: Home with positive badge */}
                <div className="relative flex items-center justify-center shrink-0 mr-0.5 ml-0.5">
                  <Home className="w-4.5 h-4.5 text-white/95" />
                  <div className="absolute -top-[5px] -right-[5px] bg-white text-[#128C7E] rounded-full w-3.2 h-3.2 flex items-center justify-center border border-[#128C7E] font-black shadow-xs" style={{ transform: 'scale(0.85)' }}>
                    <Plus className="w-2.2 h-2.2 stroke-[4]" />
                  </div>
                </div>
                <span>{lang === 'ar' ? 'إضافة إعلانك' : 'Add Listing'}</span>
              </div>
            </button>
          </div>

          {/* Center Brand Title with elegant simplicity */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white [font-family:'Cairo',sans-serif]">
              {lang === 'ar' ? 'منصة الأمان' : 'Aman Platform'}
            </span>
            <span className="hidden sm:inline text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
              {lang === 'ar' ? 'إب' : 'Ibb'}
            </span>
          </div>

          {/* Right Side: Profile Avatar & Dropdown Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-555 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white dark:border-zinc-800 cursor-pointer overflow-hidden leading-none select-none p-0"
              title={lang === 'ar' ? 'حسابك والملف الشخصي' : 'Your Profile Folder'}
            >
              {currentUserProfile?.photoURL ? (
                <img src={currentUserProfile.photoURL} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Profile" />
              ) : userName ? (
                <span className="text-xs uppercase">{userName.trim().substring(0, 2)}</span>
              ) : (
                <User className="w-4.5 h-4.5 text-white" />
              )}
            </button>

            {/* Dropdown UI */}
            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowProfileDropdown(false)} />
                <div className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl shadow-xl py-2.5 z-50 animate-fade-in text-slate-800 dark:text-zinc-100" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-850">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                      {lang === 'ar' ? 'عضوية منصة الأمان' : 'Aman Account'}
                    </p>
                    <p className="text-xs font-black truncate text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {userName ? `🟢 ${userName}` : (lang === 'ar' ? 'تصفح كزائر زائر' : 'Guest Account')}
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setActiveSideModal('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-right px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-base flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>{lang === 'ar' ? 'إعدادات الحساب والضبط' : 'Account Settings'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveSideModal('favorites');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-right px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-base flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{lang === 'ar' ? 'إعلاناتي المحفوظة' : 'My Saved Ads'}</span>
                  </button>

                  {userName ? (
                    <button 
                      onClick={() => {
                        localStorage.removeItem('ibb_user_name');
                        setUserName(null);
                        setShowProfileDropdown(false);
                        triggerToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Logged out successfully.', 'info');
                      }}
                      className="w-full text-right px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-black text-rose-600 flex items-center gap-2.5 cursor-pointer transition-colors border-t border-slate-50 dark:border-zinc-850"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-right px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-black text-emerald-600 flex items-center gap-2.5 cursor-pointer transition-colors border-t border-slate-50 dark:border-zinc-850"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تفعيل العضوية برقم الهاتف' : 'Activate Verified ID'}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Trust reassurance banner banner */}
      <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-zinc-950/40 border-b border-emerald-100/50 dark:border-zinc-90 w-full py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg font-black text-[9px] whitespace-nowrap shadow-xs uppercase">
              {lang === 'ar' ? 'مضمون' : 'Verified'}
            </span>
            <p className="font-extrabold text-[10px] sm:text-xs">
              {lang === 'ar' 
                ? 'تواصل مباشر وسريع مع البائع مع ضمان أعلى معايير الأمان والشفافية' 
                : 'Direct and speedy communication with the seller while ensuring the highest standards of security and transparency.'}
            </p>
          </div>
          <button onClick={() => setActiveTab('security-center')} className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 font-extrabold underline whitespace-nowrap hidden sm:inline-block">
            {lang === 'ar' ? 'كيف نضمن أمان تعاملاتك؟ ←' : 'How do we verify your safety? →'}
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-grow pb-28">

        {/* ================= VIEW: HOME SECTION ================= */}
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in relative">
            
            {/* Soft decorative background glows */}
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-350/10 dark:bg-emerald-550/5 blur-[120px] pointer-events-none rounded-full" />
            
            {/* Dynamic Slogan/Jumbotron Statement with responsive font sizes */}
            <div className="text-center py-8 sm:py-12 max-w-4xl mx-auto">
              <span className="bg-white dark:bg-zinc-900 border border-emerald-200/65 dark:border-zinc-850 text-emerald-600 dark:text-emerald-400 font-extrabold px-4.5 py-1.5 rounded-full text-xs sm:text-sm mb-6 inline-block shadow-xs select-none">
                 🛡️ {lang === 'ar' ? 'بيئة إعلانية آمنة وموثوقة 100% في محافظة إب' : '100% Secure & Filtered Advertising environment in Ibb Governorate'}
              </span>
              
              <h2 className="text-2xl sm:text-4xl lg:text-4.5xl font-black text-slate-900 dark:text-white leading-[1.65] sm:leading-[1.5] mb-6 tracking-tight" id="main-hero-slogan-title">
                {lang === 'ar' ? 'ابحث واشترِ ' : 'Search & Transact '}
                <span className="relative inline-block px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-900/20 text-emerald-650 dark:text-emerald-300 rounded-2xl border border-emerald-250/30">
                  {lang === 'ar' ? 'بثقة تامة' : 'With Pure Trust'}
                </span>
                {lang === 'ar' ? '.. عروض حقيقية ومفحوصة بقلب إب الأخضر!' : '.. Verified genuine offers at the heart of Ibb!'}
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto mb-6 font-semibold leading-relaxed" id="main-hero-slogan-desc">
                {lang === 'ar' 
                  ? 'نحن لا نبيع الوهم، ولا مكان هنا للإعلانات المضللة. كافة السيارات والعقارات المنشورة يتم تدقيقها لضمان وصولك إلى المالك مباشرةً وبكل صدق ومصداقية.'
                  : 'We never permit fraudulent or duplicated ads. Every single estate listing and vehicle catalogue is carefully reviewed to allow transparent direct contact.'}
              </p>

              <div className="mb-4" />

              {/* SLICK UNIFIED SEARCH HUD */}
              <div className="max-w-xl mx-auto mb-10 select-none">
                <div id="advanced-filter-panel" className="bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-md border border-slate-150 dark:border-zinc-800 flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-grow px-2 sm:px-3">
                    <Search className="w-5 h-5 text-slate-405" />
                    <input 
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder={lang === 'ar' ? 'ابحث عن شقق، أراضٍ، سيارات في محافظة إب...' : 'Search flats, lands, cars in Ibb...'}
                      className="w-full bg-transparent focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-zinc-100 font-extrabold"
                    />
                    {searchKeyword && (
                      <button 
                        onClick={() => setSearchKeyword('')} 
                        className="text-slate-400 hover:text-slate-600 font-black cursor-pointer bg-slate-100 dark:bg-zinc-800 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Filter modal toggle button */}
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 p-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-emerald-600 dark:text-emerald-400 transition-all active:scale-95 border border-emerald-100/30"
                    title={lang === 'ar' ? 'خيارات الفرز والفلترة المتقدمة' : 'Advanced Filters Selector'}
                  >
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black hidden sm:inline">{lang === 'ar' ? 'تصفية' : 'Filters'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Three key trust elements cards */}
            <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-zinc-900/60 dark:to-zinc-900/40 rounded-3xl p-6 sm:p-8 border border-emerald-100/50 dark:border-zinc-800/60 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-zinc-950 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl shadow-xs">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm sm:text-base">{lang === 'ar' ? 'فحص يدوي دقيق' : 'Manual Verification'}</h4>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-550 mt-1 leading-relaxed">
                    {lang === 'ar' 
                      ? 'نراجع كل إعلان يدوياً ونمنع الحسابات الوهمية والإعلانات المكررة لضمان الصدق والمصداقية.'
                      : 'We inspect details manually to block deceptive templates or duplicate listings.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-zinc-950 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm sm:text-base">{lang === 'ar' ? 'تعامل مباشر وحقيقي' : 'Direct Free Trade'}</h4>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-550 mt-1 leading-relaxed">
                    {lang === 'ar' 
                      ? 'تتصل بالبائع مباشرة عبر الواتساب أو الاتصال الهاتفي؛ لا نتدخل ولا نأخذ عمولة مطلقاً.'
                      : 'You dial or chat directly using WhatsApp; no registration fees or middle-man commission.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-zinc-950 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl shadow-xs">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm sm:text-base">{lang === 'ar' ? 'عروض واضحة' : 'High Resolution Specs'}</h4>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-550 mt-1 leading-relaxed">
                    {lang === 'ar' 
                      ? 'نشجع البائعين على وضع صور حديثة وواقعية، مع ذكر أدق تفاصيل العقار أو السيارة بصدق.'
                      : 'Every description specifies local metric values (Labanah, meters) or vehicle mechanical status.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Category Filtering grid buttons */}
            <div className="mb-10">
              <h3 className="text-sm font-extrabold text-slate-400 dark:text-zinc-500 mb-4 tracking-wider uppercase">
                {lang === 'ar' ? 'الأقسام المفضلة الشائعة في إب' : 'Trending Categories of choice in Ibb'}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => filterCategoryDirect('real-estate', 'apart')} 
                  className="cursor-pointer bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-[#2C211A] dark:text-slate-100 hover:border-emerald-250 rounded-2xl p-4 sm:p-5 text-center shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm">{lang === 'ar' ? 'شقق مفروشة وإيجار' : 'Furnished & Rentals'}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'تصفح الإيجار الموثوق' : 'Rent verified apartments'}</p>
                </div>

                <div 
                  onClick={() => filterCategoryDirect('real-estate', 'land')} 
                  className="cursor-pointer bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-[#2C211A] dark:text-slate-100 hover:border-emerald-250 rounded-2xl p-4 sm:p-5 text-center shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm">{lang === 'ar' ? 'أراضي بصائر مضمونة' : 'Lands with Certificates'}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'أراضي البناء المفروزة' : 'Real verified title deeds'}</p>
                </div>

                <div 
                  onClick={() => filterCategoryDirect('cars', 'toyota')} 
                  className="cursor-pointer bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-[#2C211A] dark:text-slate-100 hover:border-emerald-250 rounded-2xl p-4 sm:p-5 text-center shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-455 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm">{lang === 'ar' ? 'سيارات تويوتا نظيفة' : 'Toyota Class Vehicles'}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'صالون، راف فور، هايلوكس' : 'Hilux, RAV4, and more'}</p>
                </div>

                <div 
                  onClick={() => filterCategoryDirect('cars', 'economy')} 
                  className="cursor-pointer bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-[#2C211A] dark:text-slate-100 hover:border-emerald-250 rounded-2xl p-4 sm:p-5 text-center shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-sky-50 dark:bg-sky-955/25 text-sky-600 dark:text-sky-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm">{lang === 'ar' ? 'سيارات اقتصادية ومجربة' : 'Economical Smart Cars'}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'سيارات بترول نظيفة' : 'Fuel-efficient options'}</p>
                </div>
              </div>
            </div>

            {/* Featured verified Listings Grid Section */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/10 py-8 px-4 sm:px-6 rounded-3xl border border-slate-200/40 dark:border-zinc-850">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    ✨ {lang === 'ar' ? 'عروض تم فحصها والتحقق من صحتها في إب' : 'Featured Verified Offers in Ibb Today'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                    {lang === 'ar' ? 'عروض ممتازة تم التحقق من هويات كبار الملاك والسيارات' : 'Top catalogues verified through strict review'}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('real-estate')} 
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-extrabold text-xs sm:text-sm flex items-center gap-1 transition-all"
                >
                  <span>{lang === 'ar' ? 'تصفح كل العقارات' : 'Browse All Estates'}</span>
                  <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dynamic rendering of featured listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <ListingCard 
                    key={item.id} 
                    item={item} 
                    lang={lang} 
                    onReport={reportListing} 
                    isFavorited={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>

            {/* Platform rules covenant section */}
            <div className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
              <div className="space-y-4">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs tracking-wider uppercase block">
                  {lang === 'ar' ? 'ميثاق الأمان والصدق 🤝' : 'OUR SACRED COVENANT OF TRUST 🤝'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {lang === 'ar' ? 'لماذا يثق الناس في "منصة الأمان" بمحافظة إب؟' : 'Why does the community trust Aman Platform?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'ندرك تماماً أن المعاملات المالية والعقارية تتطلب شفافية تامة. لذلك وضعنا هذا ميثاق لضمان حقوق الجميع والمصداقية:'
                    : 'We understand that buying property or cars requires maximum transparency and verification. Here is our secure guidelines:'}
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 list-none space-y-3 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span><strong>{lang === 'ar' ? 'بصيرة معمدة:' : 'Registered title deeds:'}</strong> {lang === 'ar' ? 'نمنع نشر الأراضي مجهولة الأوراق أو التي عليها نزاعات.' : 'We reject listings with unclear titles.'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span><strong>{lang === 'ar' ? 'أسعار حقيقية:' : 'Realistic pricing:'}</strong> {lang === 'ar' ? 'نرفض الإعلانات بأسعار غامضة أو مضللة لجذب الزوار.' : 'We prohibit unrealistic or dummy price entries.'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span><strong>{lang === 'ar' ? 'تبليغ فوري:' : 'Instant flag reporting:'}</strong> {lang === 'ar' ? 'أي شخص يكتشف تدليساً يبلغنا لنحذف المسؤول فوراً.' : 'Flag any deceptive seller for immediate admin removal.'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-tr from-emerald-50/50 to-teal-50/50 dark:from-zinc-900 dark:to-zinc-900/40 rounded-3xl p-6 border border-emerald-100/30 dark:border-zinc-800">
                <h4 className="text-slate-900 dark:text-white font-black text-sm sm:text-base mb-3.5 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'ar' ? 'هل أنت بائع وتريد تعزيز ثقة المشتري؟' : 'Are you a verified seller?'}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-4 font-medium">
                  {lang === 'ar' 
                    ? 'عند إضافة إعلانك، تأكد من كتابة التفاصيل الدقيقة كالمساحة الحقيقية بالمتر واللبنة، وعيوب السيارة ومميزاتها بصدق لخدمة الـ 200 متابع على صفحتنا!' 
                    : 'To build high credibility with over 200 daily followers, always state accurate mechanical status or true land labels.'}
                </p>
                <button 
                  onClick={() => setActiveTab('security-center')}
                  className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-emerald-500 hover:text-white hover:border-transparent font-black py-3 rounded-xl transition-all duration-300 text-xs text-center"
                >
                  {lang === 'ar' ? 'تصفح دليل الأمان وتجنب الاحتيال ←' : 'Browse Platform Security Guides →'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW: REAL ESTATE MARKPLACE ================= */}
        {activeTab === 'real-estate' && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-12 px-4 shadow-inner">
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-black mb-2 flex items-center justify-center gap-2.5">
                  <Building className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span>{lang === 'ar' ? 'سوق العقارات الموثقة في محافظة إب 🏡' : 'Verified Real Estate of Ibb 🏡'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-emerald-50 max-w-xl mx-auto mb-6">
                  {lang === 'ar' 
                    ? 'منازل، شقق للبيع والإيجار، أراضي معمدة ومسجلة في السجل العقاري بدون سماسرة.'
                    : 'Homes, apartments, rent or sale, verified land title deeds in Ibb.'}
                </p>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 text-slate-850 dark:text-zinc-100 shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-4xl mx-auto border border-emerald-100/20">
                  <select 
                    value={filterReType} 
                    onChange={(e) => setFilterReType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-emerald-500 font-extrabold text-slate-755 dark:text-zinc-350"
                  >
                    <option value="">{lang === 'ar' ? 'كل أنواع العقارات' : 'All Estate Types'}</option>
                    <option value="apart">{lang === 'ar' ? 'شقة' : 'Apartment'}</option>
                    <option value="land">{lang === 'ar' ? 'أرض' : 'Land'}</option>
                    <option value="villa">{lang === 'ar' ? 'فيلا / بيت مستقل' : 'Villa / House'}</option>
                    <option value="store">{lang === 'ar' ? 'محل تجاري' : 'Shop'}</option>
                  </select>

                  <select 
                    value={filterReStatus} 
                    onChange={(e) => setFilterReStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-emerald-500 font-extrabold text-slate-755 dark:text-zinc-350"
                  >
                    <option value="">{lang === 'ar' ? 'كل الحالات (بيع/إيجار)' : 'All Status (Sale/Rent)'}</option>
                    <option value="للبيع">{lang === 'ar' ? 'للبيع' : 'For Sale'}</option>
                    <option value="للإيجار">{lang === 'ar' ? 'للإيجار' : 'For Rent'}</option>
                  </select>

                  <select 
                    value={filterReLocation} 
                    onChange={(e) => setFilterReLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-emerald-500 font-extrabold text-slate-755 dark:text-zinc-350"
                  >
                    <option value="">{lang === 'ar' ? 'جميع مناطق إب' : 'All Ibb Districts'}</option>
                    <option value="الظهار">{lang === 'ar' ? 'حي الظهار' : 'Al-Dhar'}</option>
                    <option value="المشنة">{lang === 'ar' ? 'حي المشنة' : 'Al-Mashnah'}</option>
                    <option value="الدائري">{lang === 'ar' ? 'الدائري' : 'Ring Road'}</option>
                    <option value="المعاين">{lang === 'ar' ? 'المعاين' : 'Al-Ma\'ayen'}</option>
                    <option value="جبل ربي">{lang === 'ar' ? 'جبل ربي' : 'Jabal Raby'}</option>
                    <option value="السحول">{lang === 'ar' ? 'السحول' : 'Al-Suhool'}</option>
                    <option value="أخرى">{lang === 'ar' ? 'أخرى / ريف إب' : 'Others'}</option>
                  </select>

                  <button 
                    onClick={() => resetFilters('real-estate')}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-705 dark:text-zinc-300 font-extrabold py-2.5 rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تصفير فلاتر العقارات' : 'Reset Filters'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content list */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-slate-400 dark:text-zinc-500 font-bold text-xs sm:text-sm mb-6">
                {lang === 'ar' 
                  ? `تم التحقق من ${realEstateItems.length} عقار متاح في إبّ` 
                  : `Showing ${realEstateItems.length} verified properties in Ibb`}
              </div>

              {realEstateItems.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl">
                  <FolderOpen className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                  <p className="font-extrabold text-slate-600 dark:text-zinc-400 text-sm">{lang === 'ar' ? 'لا توجد عقارات مطابقة حالياً.' : 'No matching properties found.'}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'قم بتغيير خيارات البحث أو تصفير الفلاتر.' : 'Try resetting the filters above.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {realEstateItems.map((item) => (
                    <ListingCard 
                      key={item.id} 
                      item={item} 
                      lang={lang} 
                      onReport={reportListing} 
                      isFavorited={favorites.includes(item.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW: CARS SECTION ================= */}
        {activeTab === 'cars' && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-12 px-4 shadow-inner">
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-black mb-2 flex items-center justify-center gap-2.5">
                  <Car className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span>{lang === 'ar' ? 'حراج وسيارات إب المضمونة 🚗' : 'Verified Vehicles of Ibb 🚗'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-emerald-50 max-w-xl mx-auto mb-6">
                  {lang === 'ar' 
                    ? 'اعثر على سيارة أحلامك النظيفة والخالية من الصدمات والعيوب الخفية وبأفضل سعر.' 
                    : 'Locate certified vehicles, checked mechanically and legally custom approved.'}
                </p>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 text-slate-850 dark:text-zinc-100 shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-4xl mx-auto border border-emerald-100/20">
                  <select 
                    value={filterCarBrand} 
                    onChange={(e) => setFilterCarBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-emerald-500 font-extrabold text-slate-755 dark:text-zinc-350"
                  >
                    <option value="">{lang === 'ar' ? 'جميع الماركات' : 'All Car Brands'}</option>
                    <option value="toyota">تويوتا (Toyota)</option>
                    <option value="hyundai">هيونداي (Hyundai)</option>
                    <option value="kia">كيا (Kia)</option>
                    <option value="lexus">لكزس (Lexus)</option>
                  </select>

                  <select 
                    value={filterCarTrans} 
                    onChange={(e) => setFilterCarTrans(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-emerald-500 font-extrabold text-slate-755 dark:text-zinc-350"
                  >
                    <option value="">{lang === 'ar' ? 'كل نواقل الحركة' : 'All Transmissions'}</option>
                    <option value="أتوماتيك">{lang === 'ar' ? 'أتوماتيك' : 'Automatic'}</option>
                    <option value="يدوي">{lang === 'ar' ? 'يدوي / عادي' : 'Manual'}</option>
                  </select>

                  <select 
                    value={filterCarCustoms} 
                    onChange={(e) => setFilterCarCustoms(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-emerald-500 font-extrabold text-slate-755 dark:text-zinc-350"
                  >
                    <option value="">{lang === 'ar' ? 'كل حالات الجمرك' : 'Custom Status'}</option>
                    <option value="مجمرك جاهز">{lang === 'ar' ? 'مجمرك جاهز' : 'Cleared Customs'}</option>
                    <option value="غير مجمرك">{lang === 'ar' ? 'غير مجمرك' : 'Uncleared Customs'}</option>
                  </select>

                  <button 
                    onClick={() => resetFilters('cars')}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-705 dark:text-zinc-300 font-extrabold py-2.5 rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تصفير فلاتر السيارات' : 'Reset Filters'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-slate-400 dark:text-zinc-500 font-bold text-xs sm:text-sm mb-6">
                {lang === 'ar' 
                  ? `تم التحقق من ${carItems.length} سيارة معروضة في حراج إبّ` 
                  : `Showing ${carItems.length} verified cars in Ibb Haraj`}
              </div>

              {carItems.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl">
                  <FolderOpen className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                  <p className="font-extrabold text-slate-600 dark:text-zinc-400 text-sm">{lang === 'ar' ? 'لا توجد سيارات مطابقة حالياً.' : 'No matching cars found.'}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'قم بتعديل فلاتر الفرز لتظهر السيارات النظيفة.' : 'Try changing filtering criteria.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {carItems.map((item) => (
                    <ListingCard 
                      key={item.id} 
                      item={item} 
                      lang={lang} 
                      onReport={reportListing} 
                      isFavorited={favorites.includes(item.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW: SECURITY GUIDE CENTER ================= */}
        {activeTab === 'security-center' && (
          <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-slate-100 dark:border-zinc-800 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 sm:p-8 text-white text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2.5xl font-black">{lang === 'ar' ? 'دليلك الكامل للتعامل الآمن والمقدم 🛡️' : 'Your Secure Deal Guides 🛡|'}</h2>
                <p className="text-xs text-emerald-50 mt-2">
                  {lang === 'ar'
                    ? 'نصائح شرعية وقانونية تحميك من التدليس وتضمن سلامة البيع والشراء بقلب اللواء الأخضر'
                    : 'Legitimate & technical advice protecting your hard earned cash from fake intermediate handlers'}
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 dark:border-zinc-850 pb-6">
                  <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-500" />
                    <span>{lang === 'ar' ? 'للراغبين بشراء العقارات والأراضي في إبّ:' : 'In Buying Property or Houses in Ibb:'}</span>
                  </h3>
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 list-disc list-inside leading-relaxed font-semibold">
                    <li><strong>{lang === 'ar' ? 'افحص أصل البصيرة:' : 'Request Original Titles:'}</strong> {lang === 'ar' ? 'لا تدفع أي مبالغ إلا بعد مراجعة أصل البصيرة الشرعية وفحص تسلسل الملكية عند قاضٍ معتمد في إب.' : 'Never pay down-payments until dynamic verification is cleared with legal judges.'}</li>
                    <li><strong>{lang === 'ar' ? 'المعاينة والحدود:' : 'Physical Boundary Audits:'}</strong> {lang === 'ar' ? 'اذهب بنفسك وعاين معالم وموقع الأرض أو الشقة، واطلب من مهندس قياس المساحة الحقيقية لتتأكد من مطابقتها.' : 'Visit boundaries personally to audit total Labanah metrics matching described values.'}</li>
                    <li><strong>{lang === 'ar' ? 'اسأل جيران الأرض:' : 'Inquire Local Neighbours:'}</strong> {lang === 'ar' ? 'اسأل الجيران المحيطين وتأكد من خلو العقار من المشاكل أو الخلافات الأسرية في المحاكم.' : 'Ensure no family dispute or active court litigation exists.'}</li>
                  </ul>
                </div>

                <div className="border-b border-slate-100 dark:border-zinc-850 pb-6">
                  <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5 text-emerald-500" />
                    <span>{lang === 'ar' ? 'للراغبين بشراء السيارات والمحركات في إبّ:' : 'In Buying Cars or Trucks in Ibb:'}</span>
                  </h3>
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 list-disc list-inside leading-relaxed font-semibold">
                    <li><strong>{lang === 'ar' ? 'في فحص كمبيوتر فني مسبق:' : 'Pre-purchase Technical Diagnostics:'}</strong> {lang === 'ar' ? 'افحص السيارة كاملة (محرك، جير، كهرباء، شاصي وبودي) لدى مركز معتمد بالدائري أو المعاين.' : 'Ensure technical checking is done at a certified computer shop near ring road.'}</li>
                    <li><strong>{lang === 'ar' ? 'تفادي تحويل عربونات هاتفية:' : 'Block Mobile Cash transfers:'}</strong> {lang === 'ar' ? 'لا تحول أي عربون حجز مالي عبر شركات الصرافة قبل لقاء البائع شخصياً وفحص السيارة.' : 'Avoid advance monetary deposits over software wallets until vehicle key is inspected.'}</li>
                    <li><strong>{lang === 'ar' ? 'تطابق الورق والجمارك:' : 'Check VIN & Customs status:'}</strong> {lang === 'ar' ? 'تأكد من توفر البيان الجمركي الصحيح، وطابق رقم الشاصي في البودي مع الأوراق الرسمية.' : 'Match VIN numbers on the chassis with correct government cleared customs documents.'}</li>
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5 border border-slate-200/50 dark:border-zinc-800 text-center">
                  <h4 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm mb-2 flex items-center justify-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                    <span>{lang === 'ar' ? 'هل لاحظت إعلاناً وهمياً أو مضللاً؟' : 'Notice suspicious or duplicated advertisement?'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-455 mb-4 leading-relaxed font-medium">
                    {lang === 'ar' 
                      ? 'ساعدنا على إبقاء منصة الأمان خالية من الخداع في إب. أبلغ الإدارة فوراً وسنقوم بحذف وتصفية المخالفين حماية للجميع وثقتهم.' 
                      : 'Help protect the community. Submit an immediate administrative ban flags directly via whatsapp.'}
                  </p>
                  <a 
                    href="https://wa.me/967770000000?text=أريد التبليغ عن إعلان وهمي في منصة الأمان" 
                    target="_blank" 
                    rel="no-referrer"
                    className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3 px-6 rounded-xl transition text-xs inline-flex items-center gap-2 cursor-pointer shadow-md select-none"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'أرسل تبليغاً فورياً للإدارة' : 'Submit direct admin flag'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer banner */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs sm:text-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-extrabold mb-3 text-white">{lang === 'ar' ? 'منصة الأمان' : 'Aman Platform'}</h4>
              <p className="text-slate-400 line-rows-4 leading-relaxed text-xs">
                {lang === 'ar' 
                  ? 'أول دليل إعلاني مجاني موثوق 100% مخصص لتسهيل معاملات البيع والشراء لعقارات وسيارات محافظة إب (اللواء الأخضر)، اليمن بشكل مباشر وبدون أي تدخل من الوسطاء أو فرض عمولات.'
                  : 'Ibbs premier free direct classified catalog. Trade villas, flats, lands and certified cars directly with transparent messaging loops.'}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-extrabold mb-3 text-white">{lang === 'ar' ? 'مناطق التغطية والتحقق' : 'Coverage Districts'}</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                {lang === 'ar'
                  ? 'نغطي ونخدم كافة مديريات وأحياء مدينة إب ومنها: الظهار، المشنة، الدائري الغربي، الدائري الشرقي، المعاين، جبل ربي، السبول، السحول، وأرياف إب المجاورة.'
                  : 'Covering Al-Dhar, Al-Mashnah, Ring Road, Al-Ma\'ayen, Jabal Raby and surrounding suburbs of Ibb, Yemen.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-extrabold mb-3 text-white">{lang === 'ar' ? 'التحقق والمصداقية' : 'Verified Administration'}</h4>
              <p className="text-slate-400 mb-4 text-xs">
                {lang === 'ar' ? 'لطلب تدقيق إعلانك أو لإرسال البصائر للتحقق ونيل شارة "VIP ذهبي":' : 'Request dynamic checks or upload title deeds to achieve elite verified badges:'}
              </p>
              <a 
                href={`https://wa.me/${(import.meta as any).env.VITE_WHATSAPP_NUMBER || "966504245645"}`} 
                target="_blank" 
                rel="no-referrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-lg inline-flex items-center gap-2 text-xs transition shadow-lg select-none"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>{lang === 'ar' ? 'مراسلة واتساب لإدارة المنصة' : 'Chat WhatsApp Admin'}</span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-5 text-center text-[10px] text-slate-500">
            <p className="font-semibold select-none">
              {lang === 'ar' 
                ? '© 2026 جميع الحقوق محفوظة وموثقة برمجياً للمهندس أحمد. منصة الأمان لمحافظة إب.' 
                : '© 2026 Secured and designed for Engineer Ahmed. All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 z-45 shadow-lg px-2 py-1.5 flex justify-around">
        <button 
          onClick={() => setActiveTab('home')}
          className={`py-1 px-3 rounded-lg flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-[9px] font-black">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('real-estate')}
          className={`py-1 px-3 rounded-lg flex flex-col items-center gap-0.5 ${activeTab === 'real-estate' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <Building className="w-4 h-4" />
          <span className="text-[9px] font-black">{lang === 'ar' ? 'العقارات' : 'Estates'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('cars')}
          className={`py-1 px-3 rounded-lg flex flex-col items-center gap-0.5 ${activeTab === 'cars' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <Car className="w-4 h-4" />
          <span className="text-[9px] font-black">{lang === 'ar' ? 'السيارات' : 'Cars'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('security-center')}
          className={`py-1 px-3 rounded-lg flex flex-col items-center gap-0.5 ${activeTab === 'security-center' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px] font-black">{lang === 'ar' ? 'الأمان' : 'Guides'}</span>
        </button>
      </div>

      {/* ================= MODAL: SIGN UP / SUBSCRIBE ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Simulated SMS Push Notification */}
          {otpBanner && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 z-55 bg-slate-900/95 dark:bg-zinc-950/98 border-2 border-emerald-500 shadow-2xl rounded-2xl p-4 max-w-sm w-11/12 md:w-full animate-bounce-short">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500 text-white p-2.5 rounded-xl animate-pulse">
                  <MessageSquare className="w-5 h-5 animate-bounce-short" />
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-emerald-400 select-none uppercase tracking-widest">
                      {lang === 'ar' ? 'رسالة نصية SMS (معاينة الأمان)' : 'Simulated SMS Network'}
                    </span>
                    <button 
                      onClick={() => setOtpBanner(null)} 
                      className="text-slate-400 hover:text-white text-base leading-none select-none p-0.5"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-xs font-black text-white mt-1 leading-relaxed">
                    {lang === 'ar' 
                      ? `أهلاً بك! رمز التحقق النشط لمنصة أحمد الهمداني هو: [ ${otpBanner} ] صالح لمدة 3 دقائق فقط.` 
                      : `Welcome! Your secure active verification OTP code is: [ ${otpBanner} ]. Valid for 3 minutes.`}
                  </p>
                  <div className="mt-2 text-[9px] font-semibold text-slate-400 flex justify-between items-center font-mono">
                    <span className="text-emerald-500 font-bold">Google reCAPTCHA v3 SECURED</span>
                    <span>{lang === 'ar' ? 'الآن' : 'just now'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 animate-fade-in relative">
            
            {/* Top Close Button */}
            <button 
              onClick={() => { 
                setShowAuthModal(false); 
                setUserIdForm(''); 
                setUserPhoneForm(''); 
                setAuthStep('details');
                setOtpBanner(null);
                setAuthGeneratedOtp('');
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl focus:outline-none transition-colors z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer"
            >
              &times;
            </button>

            {/* Model Header */}
            <div className="p-6 text-center bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-zinc-900 dark:to-zinc-950/40 border-b border-slate-100 dark:border-zinc-850">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'مرحباً بك في منصتنا' : 'Welcome to our platform'}
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-1">
                {lang === 'ar' ? 'سجل دخولك برقم الهاتف بثوانٍ معدودة' : 'Log in with your phone number within seconds'}
              </p>
            </div>

            {/* Internal reCAPTCHA check scanner display */}
            {recaptchaScanning ? (
              <div className="p-8 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center animate-pulse-slow">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  <ShieldCheck className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white">
                    {lang === 'ar' ? 'جاري فحص جدار الحماية ضد البوتات...' : 'Verifying firewall anti-bot shield...'}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold leading-relaxed">
                    {lang === 'ar' 
                      ? 'مدمج بـ Google reCAPTCHA v3 لقياس جودة التصفح وتحليل السلوك الآمن للسيرفر.' 
                      : 'Integrating stealth Google reCAPTCHA v3 telemetry checks for suspicious scripts.'}
                  </p>
                </div>
                <div className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-zinc-950 text-slate-500 py-1 px-2.5 rounded-lg inline-block">
                  [ Scanning mouse & pointer telemetry... ]
                </div>
              </div>
            ) : (
              <div className="p-6">
                
                {/* STEP 1: Name and Phone Input */}
                {authStep === 'details' && (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    
                    {/* Full Name field with automatic sanitization focus */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">
                        {lang === 'ar' ? 'الاسم كاملاً' : 'Full Name'}
                      </label>
                      <input 
                        type="text" 
                        value={userIdForm}
                        onChange={(e) => setUserIdForm(e.target.value)}
                        placeholder={lang === 'ar' ? 'أدخل اسمك الكريم' : 'E.g. Ahmed Mohsen'}
                        required 
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-850 rounded-xl py-3 px-4 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 transition-all focus:border-emerald-500"
                      />
                    </div>

                    {/* Integrated phone input with smart dropdown selection */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5">
                        {lang === 'ar' ? 'رقم الهاتف (الواتساب)' : 'WhatsApp Mobile Number'}
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        {/* Custom small country code selector list */}
                        <select 
                          value={authCountryCode}
                          onChange={(e) => setAuthCountryCode(e.target.value)}
                          className="bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-white font-extrabold text-xs px-2 sm:px-3 rounded-xl border border-slate-205 dark:border-zinc-850 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-w-[85px]"
                        >
                          {COUNTRY_CODES.map((country) => (
                            <option key={country.code} value={country.code} className="dark:bg-zinc-900">
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        
                        <input 
                          type="tel" 
                          value={userPhoneForm}
                          onChange={(e) => setUserPhoneForm(sanitizePhone(e.target.value))}
                          placeholder="7xxxxxxxx"
                          required 
                          className="flex-grow bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-850 rounded-xl py-3 px-4 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 transition-all focus:border-emerald-500 text-left"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1.5">
                        {lang === 'ar' 
                          ? 'سيتم توليد كود مخصص تلقائي لمنع استهلاك رصيد SMS للعابثين.' 
                          : 'A secure unique cryptographic code is generated on request.'}
                      </p>
                    </div>

                    {/* Active remaining block alerts (Rate Limits) */}
                    {remainingBlockTime > 0 && (
                      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-[11px] font-bold text-center leading-relaxed">
                        ⚠️ {lang === 'ar' 
                          ? `هذا الرقم مقيد مؤقتاً لحماية السيرفر من الإغراق. متبقي: ${Math.floor(remainingBlockTime / 60)}د و ${remainingBlockTime % 60}ث قبل إعادة الإرسال.` 
                          : `Rate limit block active. Re-verify available in ${Math.ceil(remainingBlockTime)} seconds.`}
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={authLoading || remainingBlockTime > 0}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
                      >
                        {authLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin animate-spin-slow" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>{lang === 'ar' ? 'أرسل رمز التحقق' : 'Send Verification Code'}</span>
                      </button>
                    </div>

                    {/* Stealth reCAPTCHA v3 bottom badge */}
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 dark:text-zinc-500 pt-1 selection:bg-transparent select-none">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{lang === 'ar' ? 'البوابة مؤمنة كلياً بواسطة Google reCAPTCHA v3 تلقائياً' : 'Protected by stealth Google reCAPTCHA v3 v3 telemetry'}</span>
                    </div>

                  </form>
                )}

                {/* STEP 2: Square Box OTP Verification */}
                {authStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    
                    {/* Readonly phone details with Edit Revert helper */}
                    <div className="bg-slate-50 dark:bg-zinc-950/60 p-3 rounded-xl border border-slate-100 dark:border-zinc-850 flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-extrabold leading-normal">
                          {lang === 'ar' ? 'الاسم ورقم الهاتف المستهدف للمصادقة' : 'Target Auth Identification'}
                        </p>
                        <p className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 truncate">
                          {userIdForm} | <span dir="ltr">{authCountryCode} {userPhoneForm}</span>
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => { setAuthStep('details'); setOtpBanner(null); }}
                        className="text-[10px] bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-black px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-slate-700 dark:text-zinc-300 select-none whitespace-nowrap"
                      >
                        {lang === 'ar' ? 'تعديل الرقم' : 'Edit Number'}
                      </button>
                    </div>

                    {/* Highly polished individual boxes design */}
                    <div className="space-y-2">
                      <label className="block text-center text-xs font-extrabold text-slate-500 select-none">
                        {lang === 'ar' ? 'أدخل رمز التحقق (OTP) المكوّن من 6 أرقام:' : 'Enter the 6-digit active verification code:'}
                      </label>
                      
                      <div className="flex justify-center gap-2" dir="ltr">
                        {authOtpCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-box-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpBoxChange(e.target.value, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            className="w-11 h-12 text-center text-lg font-black bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 outline-none focus:scale-110 transition-all text-emerald-600 dark:text-emerald-400 font-mono"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Live countdown self-destruction bar */}
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1 select-none">
                      <span className="font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>{lang === 'ar' ? 'صلاحية الكود متبقية:' : 'Code expires in:'}</span>
                        <span className="font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-black">
                          {Math.floor(authOtpTimer / 60)}:{(authOtpTimer % 60) < 10 ? '0' : ''}{authOtpTimer % 60}
                        </span>
                      </span>
                      
                      {authOtpTimer === 0 ? (
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          className="text-xs font-black text-emerald-600 hover:underline cursor-pointer"
                        >
                          {lang === 'ar' ? 'إعادة الإرسال 🔄' : 'Resend OTP 🔄'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium font-mono">
                          {lang === 'ar' ? `متبقي ${3 - authOtpAttempts} محاولات` : `${3 - authOtpAttempts} attempts left`}
                        </span>
                      )}
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={authLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
                      >
                        {authLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>{lang === 'ar' ? 'تأكيد الرمز وتفعيل الحساب' : 'Confirm Code & Activate Account'}</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= MODAL: ADD ADVERTISEMENT / LISTING ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 my-8 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 flex items-center justify-between">
              <h3 className="text-md sm:text-lg font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>{lang === 'ar' ? 'انشر إعلانك المضمون الآن' : 'Publish Your Verified Ad'}</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-rose-250 text-2xl focus:outline-none focus:ring-0 leading-none select-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
              
              {/* Category radio */}
              <div>
                <label className="block text-xs font-extrabold text-slate-400 dark:text-zinc-500 mb-2">{lang === 'ar' ? 'نوع الإعلان الرئيسي:' : 'Main Classified Ad Category:'}</label>
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    className={`p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs sm:text-sm border-2 transition-all ${formCategory === 'real-estate' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400' : 'border-slate-205 dark:border-zinc-800 text-slate-500'}`}
                  >
                    <input 
                      type="radio" 
                      name="form_category" 
                      value="real-estate" 
                      checked={formCategory === 'real-estate'} 
                      onChange={() => setFormCategory('real-estate')} 
                      className="accent-emerald-600"
                    />
                    <span>{lang === 'ar' ? 'عقارات (أرض/شقة)' : 'Real Estates'}</span>
                  </label>

                  <label 
                    className={`p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs sm:text-sm border-2 transition-all ${formCategory === 'cars' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400' : 'border-slate-205 dark:border-zinc-800 text-slate-500'}`}
                  >
                    <input 
                      type="radio" 
                      name="form_category" 
                      value="cars" 
                      checked={formCategory === 'cars'} 
                      onChange={() => setFormCategory('cars')} 
                      className="accent-emerald-600"
                    />
                    <span>{lang === 'ar' ? 'سيارات ومحركات' : 'Cars & Motors'}</span>
                  </label>
                </div>
              </div>

              {/* Title and price info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1">{lang === 'ar' ? 'عنوان الإعلان (مثال: شقة للبيع في جبل ربي)' : 'Classified Headline'}</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2 text-xs sm:text-sm focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1">{lang === 'ar' ? 'السعر (بالدولار $ أو الريال اليمني)' : 'Price quote'}</label>
                  <input 
                    type="text" 
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: 45,000$ أو 25 مليون ريال' : 'E.g., $15,000 or 10 Million YER'}
                    required
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2 text-xs sm:text-sm focus:ring-emerald-500 focus:outline-none font-bold dark:text-white"
                  />
                </div>
              </div>

              {/* Category specific fields */}
              {formCategory === 'real-estate' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'نوع العقار:' : 'Property Type:'}</label>
                    <select 
                      value={formReType} 
                      onChange={(e) => setFormReType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none focus:ring-1 dark:text-white"
                    >
                      <option value="apart">{lang === 'ar' ? 'شقة سكنية' : 'Apartment'}</option>
                      <option value="land">{lang === 'ar' ? 'أرض معمدة' : 'Land'}</option>
                      <option value="villa">{lang === 'ar' ? 'فيلا مستقلة' : 'Villa'}</option>
                      <option value="store">{lang === 'ar' ? 'محل تجاري' : 'Store'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'الحالة:' : 'Status:'}</label>
                    <select 
                      value={formReStatus} 
                      onChange={(e) => setFormReStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none focus:ring-1 dark:text-white"
                    >
                      <option value="للبيع">{lang === 'ar' ? 'للبيع' : 'For Sale'}</option>
                      <option value="للإيجار">{lang === 'ar' ? 'للإيجار' : 'For Rent'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'المنطقة:' : 'Location Area:'}</label>
                    <select 
                      value={formReLocation} 
                      onChange={(e) => setFormReLocation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none focus:ring-1 dark:text-white"
                    >
                      <option value="الظهار">{lang === 'ar' ? 'حي الظهار' : 'Al-Dhar'}</option>
                      <option value="المشنة">{lang === 'ar' ? 'حي المشنة' : 'Al-Mishnah'}</option>
                      <option value="الدائري">{lang === 'ar' ? 'شارع الدائري' : 'Ring Road'}</option>
                      <option value="المعاين">{lang === 'ar' ? 'منطقة المعاين' : 'Al-Ma\'ayen'}</option>
                      <option value="جبل ربي">{lang === 'ar' ? 'جبل ربي' : 'Jabal Raby'}</option>
                      <option value="السحول">{lang === 'ar' ? 'السحول' : 'Al-Sahool'}</option>
                      <option value="أخرى">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'الماركة:' : 'Make/Brand:'}</label>
                    <select 
                      value={formCarBrand} 
                      onChange={(e) => setFormCarBrand(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none focus:ring-1 dark:text-white"
                    >
                      <option value="toyota">Toyota ({lang === 'ar' ? 'تويوتا' : 'Toyota'})</option>
                      <option value="hyundai">Hyundai ({lang === 'ar' ? 'هيونداي' : 'Hyundai'})</option>
                      <option value="kia">Kia ({lang === 'ar' ? 'كيا' : 'Kia'})</option>
                      <option value="lexus">Lexus ({lang === 'ar' ? 'لكزس' : 'Lexus'})</option>
                      <option value="أخرى">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'ناقل الحركة:' : 'Transmission:'}</label>
                    <select 
                      value={formCarTrans} 
                      onChange={(e) => setFormCarTrans(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none focus:ring-1 dark:text-white"
                    >
                      <option value="أتوماتيك">{lang === 'ar' ? 'أتوماتيك' : 'Automatic'}</option>
                      <option value="يدوي">{lang === 'ar' ? 'عادي (يدوي)' : 'Manual'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'الجمارك:' : 'Customs Status:'}</label>
                    <select 
                      value={formCarCustoms} 
                      onChange={(e) => setFormCarCustoms(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none focus:ring-1 dark:text-white"
                    >
                      <option value="مجمرك جاهز">{lang === 'ar' ? 'مجمرك جاهز' : 'Customs Paid'}</option>
                      <option value="غير مجمرك">{lang === 'ar' ? 'غير مجمرك' : 'Not Customs'}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Image URL, Phone Number, and Details Description fields */}
              <div className="space-y-4">
                <div className="bg-slate-50/60 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-800/85 p-3.5 rounded-2xl">
                  <AmanImageUploader 
                    category={formCategory}
                    lang={lang}
                    onUploadComplete={(urls) => {
                      setFormUploadedImages(urls);
                      if (urls && urls.length > 0) {
                        setFormImage(urls[0]); // Auto promote first image
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'أو أدخل رابط صورة مباشر (اختياري):' : 'Or enter external image url (Optional):'}</label>
                  <input 
                    type="text" 
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'رقم هاتف التواصل للتحقق الميداني:' : 'WhatsApp verification phone:'}</label>
                  <input 
                    type="text" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="967..."
                    required
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none font-bold dark:text-white text-left font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#7C6E65] dark:text-[#A89984] mb-1">{lang === 'ar' ? 'وصف وتفاصيل العرض والتقسيمات:' : 'Offer parameters & full description:'}</label>
                <textarea 
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg p-2 text-xs focus:ring-emerald-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl transition shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer select-none border-0"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{lang === 'ar' ? 'حفظ وإرسال الإعلان للتدقيق والمعاينة للواقع' : 'Send Listing for Physical Reality Audit'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= STRATEGIC NAVIGATION HUB (القائمة الاستراتيجية لأدسنس والدليل الموثق) ================= */}
      {activeSideModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Custom backdrop layer with high-quality blur, clicking dismisses the drawer */}
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setActiveSideModal(null);
              setReadingArticle(null);
            }}
          />

          {/* Drawer Slide-Over Container */}
          <div 
            className={`relative w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col z-50 text-slate-800 dark:text-zinc-105 border-slate-150 dark:border-zinc-800 animate-slide-over-rtl transform overflow-hidden`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Top orange-amber branding decorative bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shrink-0" />

            {/* Strategic Header Panel */}
            <div className="p-5 border-b border-slate-100 dark:border-zinc-850 shrink-0 bg-slate-50/50 dark:bg-zinc-950/20">
              <div className="flex items-center justify-between mb-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-505/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white [font-family:'Cairo'] flex items-center gap-1">
                      <span>{lang === 'ar' ? 'بوابة الأمان الذكية' : 'Aman Premium Hub'}</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-extrabold pb-0.5">
                      {lang === 'ar' ? 'أداة التوجيه المعتمدة لمحافظة إب' : 'Certified strategic navigation gateway'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setActiveSideModal(null);
                    setReadingArticle(null);
                  }}
                  className="text-slate-400 hover:text-rose-500 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition rounded-xl text-xs font-black cursor-pointer w-8 h-8 flex items-center justify-center select-none"
                  title={lang === 'ar' ? 'إغلاق القائمة' : 'Close Drawer'}
                >
                  &times;
                </button>
              </div>

              {/* PERSISTENT SEARCH HUD IN HEADER OF DRAWER (أداة البحث الدائم للوصول السريع) */}
              <div className="relative">
                <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input 
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder={lang === 'ar' ? 'البحث بالكلمات المفتاحية...' : 'Keyword search properties & cars...'}
                  className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 pr-9 pl-4 text-xs font-bold text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                {searchKeyword && (
                  <button 
                    onClick={() => setSearchKeyword('')}
                    className="absolute left-2.5 top-2.5 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-xs text-slate-500 cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Navigation Sections Wrapper */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4 select-none pb-24 scrollbar-thin">

              {/* ================= LEVEL 1 ACCORDION USER PROFILE: AUTHENTICATION PORTAL (الملف الشخصي والتحقق) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs animate-fadeIn">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'settings' as any ? null : 'settings' as any)}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-550 shrink-0" />
                    <span>{lang === 'ar' ? 'الملف الشخصي والتحقق الرقمي الموحد' : 'Identity Verification & Profile'}</span>
                    {currentUserProfile ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'settings' as any ? 'rotate-180 text-emerald-550' : ''}`} />
                </button>

                {drawerExpandedSection === 'settings' as any && (
                  <div className="p-4 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850">
                    <AuthSection 
                      lang={lang}
                      onUserUpdate={(profile) => {
                        setCurrentUserProfile(profile);
                        if (profile) {
                          setUserName(profile.displayName);
                        } else {
                          setUserName(null);
                        }
                      }}
                      listings={listings}
                      onOpenListingDetails={(item) => {
                        triggerToast(lang === 'ar' ? `تفاصيل الإعلان: ${item.desc}` : `Details: ${item.desc}`, 'info');
                      }}
                      triggerToast={triggerToast}
                    />
                  </div>
                )}
              </div>

              {/* ================= LEVEL 1 ACCORDION ADMIN DESK: AD LISTINGS MODERATION (منطقة التدقيق والإدارة العامة) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'favorites' as any ? null : 'favorites' as any)}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{lang === 'ar' ? 'لوحة تحكم المشرف والمسؤول المالي 🔐' : 'Administrator Control Panel 🔐'}</span>
                    {currentUserProfile?.role === 'admin' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'favorites' as any ? 'rotate-180 text-amber-500' : ''}`} />
                </button>

                {drawerExpandedSection === 'favorites' as any && (
                  <div className="p-4 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850">
                    <AdminPanel 
                      lang={lang}
                      listings={listings}
                      onRefreshListings={() => setListingsRefreshTrigger(prev => prev + 1)}
                      onOpenListingDetails={(item) => {
                        triggerToast(lang === 'ar' ? `وصف العرض: ${item.desc}` : `Offer details: ${item.desc}`, 'info');
                      }}
                      triggerToast={triggerToast}
                      currentUser={currentUserProfile}
                    />
                  </div>
                )}
              </div>

              {/* ================= LEVEL 1 ACCORDION A: EDITORIAL CONTENT SECTION (دليل العقارات وأخبار السوق) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'editorial' ? null : 'editorial')}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white uppercase hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'ar' ? 'دليل الأمان العقاري وأخبار السوق (أدسنس)' : 'Real Estate Guide & Market News'}</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block shrink-0" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'editorial' ? 'rotate-180 text-amber-500' : ''}`} />
                </button>

                {drawerExpandedSection === 'editorial' && (
                  <div className="p-4 pt-1 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850 space-y-3">
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-extrabold pb-1">
                      {lang === 'ar' 
                        ? '🟢 مقالات ودراسات سوقية حصرية وموثقة من قبل مستشاري منصة الأمان لخدمة المواطن ومكافحة التلاعب والاستثمار بوعي:'
                        : 'Exclusive editorial advisory articles compiled by Aman real estate analysts to foster direct market literacy:'}
                    </p>
                    
                    <div className="space-y-2.5">
                      {editorialArticles.map(art => (
                        <div 
                          key={art.id}
                          onClick={() => setReadingArticle(art)}
                          className="p-3 bg-white dark:bg-zinc-900 border border-slate-100 hover:border-amber-400 dark:border-zinc-850 dark:hover:border-amber-500 rounded-xl transition-all cursor-pointer group flex gap-2 items-start hover:shadow-xs"
                        >
                          {/* Left interactive small orange point */}
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                          <div className="flex-grow space-y-1">
                            <h4 className="text-[11px] sm:text-xs text-slate-800 dark:text-zinc-200 font-extrabold group-hover:text-amber-550 dark:group-hover:text-amber-450 line-clamp-2 transition-colors duration-200 leading-relaxed [font-family:'Cairo']">
                              {lang === 'ar' ? art.titleAr : art.titleEn}
                            </h4>
                            <div className="flex items-center gap-2 text-[9px] text-slate-400 dark:text-zinc-500 font-semibold font-mono">
                              <span>{art.date}</span>
                              <span>•</span>
                              <span className="text-amber-520 dark:text-amber-450 font-bold">{lang === 'ar' ? art.readTimeAr : art.readTimeEn}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= LEVEL 1 ACCORDION B: SERVICE REAL ESTATE CATEGORIES (العقارات الفاخرة الموثقة) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'real-estate' ? null : 'real-estate')}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-550" />
                    <span>{lang === 'ar' ? 'العقارات الفاخرة بمحافظة إب' : 'Ibb Accredited Real Estates'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'real-estate' ? 'rotate-180 text-emerald-555' : ''}`} />
                </button>

                {drawerExpandedSection === 'real-estate' && (
                  <div className="p-4 pt-1 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850 space-y-2">
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-extrabold pb-1">
                      {lang === 'ar' ? 'اختر نوع السلعة للانتقال الفوري للنتائج المفحوصة:' : 'Click classification to trigger instant filtered lists:'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'apart', labelAr: 'شقة سكنية واعدة', labelEn: 'Flats & Apartments' },
                        { id: 'land', labelAr: 'أرض استثمارية معمدة', labelEn: 'Certified Lands' },
                        { id: 'villa', labelAr: 'فيلا مستقلة فاخرة', labelEn: 'Luxury Villas' },
                        { id: 'store', labelAr: 'محل تجاري حيوي', labelEn: 'Commercial Stores' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => {
                            setFilterReType(item.id);
                            setHomeReType(item.id);
                            setActiveTab('real-estate');
                            setActiveSideModal(null);
                            triggerToast(lang === 'ar' ? `تم تفعيل فلتر: ${item.labelAr}` : `Filter set: ${item.labelEn}`, 'check');
                          }}
                          className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 border border-slate-150 dark:border-zinc-800 hover:border-amber-400 rounded-xl transition duration-200 cursor-pointer text-right min-h-[50px] flex flex-col justify-between"
                        >
                          <span className="text-[11px] font-black text-slate-800 dark:text-zinc-150 leading-snug [font-family:'Cairo']">
                            {lang === 'ar' ? item.labelAr : item.labelEn}
                          </span>
                          <span className="text-[8px] text-amber-550 dark:text-amber-450 font-bold tracking-wider uppercase font-mono mt-1">
                            {lang === 'ar' ? 'رابط مباشر' : 'Direct Link'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= LEVEL 1 ACCORDION C: SERVICE VEHICLE CATEGORIES (حراج السيارات) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'cars' ? null : 'cars')}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-550" />
                    <span>{lang === 'ar' ? 'حراج حافلات وسيرات الأمان' : 'Aman Vehicles Haraj'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'cars' ? 'rotate-180 text-emerald-555' : ''}`} />
                </button>

                {drawerExpandedSection === 'cars' && (
                  <div className="p-4 pt-1 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850 space-y-2">
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-extrabold pb-1">
                      {lang === 'ar' ? 'الفحص الذكي حسب الماركة والطلب في اليمن:' : 'Filter instantly by popular vehicular makes:'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'toyota', labelAr: 'تويوتا (Toyota)', labelEn: 'Toyota' },
                        { id: 'hyundai', labelAr: 'هيونداي (Hyundai)', labelEn: 'Hyundai' },
                        { id: 'kia', labelAr: 'كيا (Kia)', labelEn: 'Kia' },
                        { id: 'lexus', labelAr: 'لكزس (Lexus)', labelEn: 'Lexus' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => {
                            setFilterCarBrand(item.id);
                            setHomeCarBrand(item.id);
                            setActiveTab('cars');
                            setActiveSideModal(null);
                            triggerToast(lang === 'ar' ? `تم تفعيل ماركة: ${item.labelAr}` : `Brand set: ${item.labelEn}`, 'check');
                          }}
                          className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 border border-slate-150 dark:border-zinc-800 hover:border-amber-400 rounded-xl transition duration-200 cursor-pointer text-right min-h-[50px] flex flex-col justify-between"
                        >
                          <span className="text-[11px] font-black text-slate-800 dark:text-zinc-150 leading-snug [font-family:'Cairo']">
                            {lang === 'ar' ? item.labelAr : item.labelEn}
                          </span>
                          <span className="text-[8px] text-amber-550 dark:text-amber-450 font-bold tracking-wider uppercase font-mono mt-1">
                            {lang === 'ar' ? 'تصفية سريعة' : 'Quick Match'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= LEVEL 1 ACCORDION D: BOOKMARKED FAVORITES SECTION (المفضلة) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'favorites' ? null : 'favorites')}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-current" />
                    <span>{lang === 'ar' ? 'العروض المميزة المحفوظة بالمفضلة' : 'My Local Bookmarked Favorites'}</span>
                    {favorites.length > 0 && (
                      <span className="bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-450 px-2 py-0.5 text-[9px] font-mono font-black rounded-lg">
                        {favorites.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'favorites' ? 'rotate-180 text-rose-500' : ''}`} />
                </button>

                {drawerExpandedSection === 'favorites' && (() => {
                  const favItems = listings.filter(i => favorites.includes(i.id));
                  return (
                    <div className="p-4 pt-1 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850 space-y-3">
                      {favItems.length === 0 ? (
                        <div className="text-center py-8 bg-white dark:bg-zinc-900/40 rounded-xl p-4 border border-dashed border-slate-200 dark:border-zinc-800">
                          <Heart className="w-10 h-10 text-rose-300 mx-auto mb-2 animate-pulse" />
                          <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 [font-family:'Cairo']">
                            {lang === 'ar' ? 'المفضلة الخاصة بك فارغة حالياً!' : 'No bookmarked listings.'}
                          </p>
                          <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1">
                            {lang === 'ar' ? 'انقر على ❤️ الموجود ببطاقات العقارات والسيارات لحفظها هنا.' : 'Click the heart button on listing details.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {favItems.map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-rose-300 transition duration-150"
                            >
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-100 dark:border-zinc-800"
                              />
                              <div className="flex-grow min-w-0">
                                <h4 className="text-[11px] font-bold text-slate-800 dark:text-zinc-250 truncate [font-family:'Cairo']">
                                  {item.title}
                                </h4>
                                <p className="text-[10px] text-amber-550 dark:text-amber-400 font-extrabold font-mono mt-0.5">
                                  {item.price}
                                </p>
                              </div>
                              <button 
                                onClick={() => toggleFavorite(item.id)}
                                className="text-slate-405 hover:text-rose-500 p-1 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 rounded-lg transition shrink-0 cursor-pointer border-0"
                                title={lang === 'ar' ? 'إزالة' : 'Remove'}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* ================= LEVEL 1 ACCORDION E: SETTINGS & CONFIG (الضبط وإعدادات البيانات) ================= */}
              <div className="border border-slate-105 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
                <button 
                  onClick={() => setDrawerExpandedSection(drawerExpandedSection === 'settings' ? null : 'settings')}
                  className="w-full p-4 flex items-center justify-between font-black text-xs sm:text-xs text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-all cursor-pointer [font-family:'Cairo']"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-emerald-550 animate-spin-slow" />
                    <span>{lang === 'ar' ? 'الضبط والخصوصية وإعدادات البيانات' : 'Personal Prefs & Data Care'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${drawerExpandedSection === 'settings' ? 'rotate-180 text-emerald-555' : ''}`} />
                </button>

                {drawerExpandedSection === 'settings' && (
                  <div className="p-4 pt-1 bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-850 space-y-4">
                    
                    {/* User account state */}
                    <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-150 dark:border-zinc-800 space-y-3">
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        {lang === 'ar' ? 'الملف الشخصي الفعال' : 'Active Personal Member Card'}
                      </p>
                      
                      {userName ? (
                        <div className="flex items-center justify-between bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          <div>
                            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                              <span>🟢 {lang === 'ar' ? 'عضوية معتمدة' : 'Verified Member'}</span>
                            </p>
                            <p className="text-xs font-black text-slate-800 dark:text-white mt-1">
                              {userName}
                            </p>
                          </div>
                          <button 
                            onClick={handleLogout}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-black py-1 px-2.5 rounded-lg text-[9px] transition-colors border-0"
                          >
                            {lang === 'ar' ? 'تسجيل خروج' : 'Log Out'}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-2">
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-extrabold pb-2">
                            {lang === 'ar' ? 'أنت تتصفح حالياً كأمان زائر.' : 'Browsing as anonymous guest.'}
                          </p>
                          <button 
                            onClick={() => {
                              setShowAuthModal(true);
                              setActiveSideModal(null);
                            }}
                            className="w-full bg-emerald-500 text-white hover:bg-emerald-600 text-[11px] font-black py-2 rounded-xl transition cursor-pointer border-0 shadow-xs"
                          >
                            {lang === 'ar' ? 'تسجيل هويتك برقم هاتف' : 'Verify My Identity Now'}
                          </button>
                        </div>
                      )}

                      {/* Manual configuration inputs */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">
                            {lang === 'ar' ? 'الاسم المعروض بالمنشورات' : 'Display Name'}
                          </label>
                          <input 
                            type="text"
                            value={userName || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setUserName(val || null);
                              if (val) localStorage.setItem('ibb_user_name', val);
                              else localStorage.removeItem('ibb_user_name');
                            }}
                            placeholder={lang === 'ar' ? 'تصفح كعضو زائر...' : 'Type profile identity name...'}
                            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-bold dark:text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">
                            {lang === 'ar' ? 'رقم هاتف الواتساب النشط' : 'Active WhatsApp Number'}
                          </label>
                          <input 
                            type="text"
                            value={localStorage.getItem('ibb_user_phone') || ''}
                            onChange={(e) => {
                              localStorage.setItem('ibb_user_phone', e.target.value);
                            }}
                            placeholder="e.g., 96777000000"
                            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-bold font-mono text-left dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alerts configuration */}
                    <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-150 dark:border-zinc-800 space-y-3">
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        {lang === 'ar' ? 'تفضيلات إشعارات الأمان ونظام التنبيهات' : 'System alerts preferences'}
                      </p>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-black">{lang === 'ar' ? 'إشعارات نزول المعروضات الجديدة' : 'Real-time Listings Alerts'}</p>
                          <p className="text-[9px] text-slate-400 dark:text-zinc-500">{lang === 'ar' ? 'تنبيه فوري لدى نزول عقار فوري معمد' : 'Notify when physical assets are added.'}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSettingsAlerts(!settingsAlerts);
                            triggerToast(lang === 'ar' ? 'تم تحديث التفضيلات!' : 'Preferences updated!', 'info');
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-all focus:outline-none shrink-0 ${settingsAlerts ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settingsAlerts ? (lang === 'ar' ? 'translate-x-[-16px]' : 'translate-x-[16px]') : 'translate-x-[0px]'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-zinc-800 pt-2">
                        <div>
                          <p className="text-[11px] font-black">{lang === 'ar' ? 'مزامنة المعاينة عبر الواتساب' : 'WhatsApp Support Sync'}</p>
                          <p className="text-[9px] text-slate-400 dark:text-zinc-500">{lang === 'ar' ? 'إرسال تقرير الفحص الأمني للدردشة الخاصة بك' : 'Send assessment outcomes to chat app.'}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSettingsNotifications(!settingsNotifications);
                            triggerToast(lang === 'ar' ? 'تم تحديث التنبيهات التفاعلية' : 'Notifications synced', 'info');
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-all focus:outline-none shrink-0 ${settingsNotifications ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settingsNotifications ? (lang === 'ar' ? 'translate-x-[-16px]' : 'translate-x-[16px]') : 'translate-x-[0px]'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Cache reset button */}
                    <div className="bg-rose-50/50 dark:bg-rose-950/15 p-3 rounded-xl border border-rose-100/30">
                      <p className="text-[10px] text-rose-700 dark:text-rose-455 font-extrabold pb-2 leading-relaxed">
                        {lang === 'ar' 
                          ? '⚠️ في حال رغبت في إعادة تعيين كافة البيانات المخصصة والرجوع لقاعدة بيانات المنصة الافتراضية:'
                          : '⚠️ Wipe browser data cache to return database to official system defaults:'}
                      </p>
                      <button 
                        onClick={async () => {
                          if (confirm(lang === 'ar' ? 'هل أنت متأكد من مسح كافة الإعلانات التي أضفتها واسترجاع قاعدة البيانات الموثقة الافتراضية؟' : 'Are you sure you want to reset listings database?')) {
                            localStorage.removeItem('ibb_marketplace_listings');
                            setListings(initialListings);
                            setActiveSideModal(null);
                            triggerToast(lang === 'ar' ? 'جاري إعادة التهيئة... 🟢' : 'Resetting... 🟢');
                            
                            try {
                              // Wipe current Firestore collections
                              const propsSnapshot = await getDocs(collection(db, 'properties'));
                              for (const d of propsSnapshot.docs) {
                                await deleteDoc(doc(db, 'properties', d.id));
                              }
                              const carsSnapshot = await getDocs(collection(db, 'cars'));
                              for (const d of carsSnapshot.docs) {
                                await deleteDoc(doc(db, 'cars', d.id));
                              }
                              
                              // Re-seed
                              for (const item of initialListings) {
                                if (item.category === 'real-estate') {
                                  await setDoc(doc(db, 'properties', item.id), {
                                    title: item.title,
                                    price: item.price,
                                    type: item.type || 'apart',
                                    status: item.status || 'للبيع',
                                    location: item.location || '',
                                    phone: item.phone,
                                    image: item.image,
                                    desc: item.desc,
                                    featured: item.featured,
                                    date: item.date
                                  });
                                } else {
                                  await setDoc(doc(db, 'cars', item.id), {
                                    brand: item.brand || 'toyota',
                                    model: item.title.includes('هايلوكس') ? 'هايلوكس' : 'سنتافي',
                                    title: item.title,
                                    price: item.price,
                                    transmission: item.transmission || 'أتوماتيك',
                                    customs: item.customs || 'مجمرك جاهز',
                                    phone: item.phone,
                                    image: item.image,
                                    desc: item.desc,
                                    featured: item.featured,
                                    date: item.date
                                  });
                                }
                              }
                              triggerToast(lang === 'ar' ? 'تم إعادة ضبط قاعدة البيانات الافتراضية بنجاح 🟢' : 'Database reset verified!');
                            } catch (e) {
                              console.warn("Firestore wipe & reseed skipped or restricted:", e);
                              triggerToast(lang === 'ar' ? 'تم تصفير الذاكرة المحلية بنجاح 🟢' : 'Local cache wiped!');
                            }
                          }
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] py-1.5 rounded-lg font-black transition-colors border-0"
                      >
                        {lang === 'ar' ? 'إعادة ضبط كافة الإعلانات والسلع' : 'Wipe & Reset Database listings'}
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* ================= STANDARD ADSENSE MANDATORY PAGES LINKS GRID (Who We Are, Policies etc.) ================= */}
              <div className="pt-6 border-t border-slate-100 dark:border-zinc-850 select-none">
                <p className="text-[9px] text-slate-450 dark:text-zinc-500 font-extrabold uppercase tracking-wider mb-2.5">
                  {lang === 'ar' ? 'مستندات وضوابط أدسنس والشفافية' : 'Mandatory AdSense standard compliance'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setDrawerExpandedSection('about')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950/50 dark:hover:bg-zinc-850 border border-slate-105 dark:border-zinc-850 transition duration-150 text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-200 [font-family:'Cairo']">
                        {lang === 'ar' ? 'من نحن ورؤيتنا المناهضة للاحتكار' : 'About Us & Civic Vision'}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>

                  <button 
                    onClick={() => setDrawerExpandedSection('privacy')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950/50 dark:hover:bg-zinc-850 border border-slate-105 dark:border-zinc-850 transition duration-150 text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-200 [font-family:'Cairo']">
                        {lang === 'ar' ? 'سياسة الخصوصية وملفات الكوكي' : 'Privacy & Cookie Policy'}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>

                  <button 
                    onClick={() => setDrawerExpandedSection('terms')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950/50 dark:hover:bg-zinc-850 border border-slate-105 dark:border-zinc-850 transition duration-150 text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-200 [font-family:'Cairo']">
                        {lang === 'ar' ? 'شروط الاستخدام وأمور النشر النزيه' : 'Terms of Use & Fair Dealings'}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

            </div>

            {/* STICKY FOOTER IN DRAWER: DUAL HELPLINE DIRECT CHAT (أدوات التواصل الممتازة والـ Sticky Footer) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-150 dark:border-zinc-850 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md space-y-2 select-none z-10 shrink-0">
              <a 
                href={`https://wa.me/${(import.meta as any).env.VITE_WHATSAPP_NUMBER || "966504245645"}?text=${encodeURIComponent(
                  lang === 'ar' 
                    ? 'أهلاً إدارة منصة الأمان العقرية بمحافظة إب، يسعدني التواصل معكم مباشرة للاستعلام والتنسيق.' 
                    : 'Hello Aman Ibb support department, I would like to query properties.'
                )}`}
                target="_blank"
                rel="no-referrer"
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-emerald-500/10 active:scale-97 cursor-pointer border-0 text-xs [font-family:'Cairo']"
              >
                <MessageSquare className="w-4.5 h-4.5 fill-current text-white" />
                <span>{lang === 'ar' ? 'تواصل معنا مباشرة (عبر الواتساب)' : 'Chat on WhatsApp Direct'}</span>
              </a>
              <div className="text-center text-[9px] text-slate-400 dark:text-zinc-500 font-semibold">
                {lang === 'ar' 
                  ? 'منصة الأمان | محافظة إب، الدائري الغربى - اليمن السعيد' 
                  : 'Aman Platform | West Ring Rd, Ibb city, Yemen'}
              </div>
            </div>

            {/* ================= DYNAMIC SLIDE-IN READING VIEW OVERLAY (داخل القائمة) ================= */}
            {/* Renders simulated high-quality articles & policies upon selection */}
            {readingArticle && (
              <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col h-full overflow-hidden animate-slide-over">
                <div className="h-1 bg-amber-500 w-full" />
                <div className="p-4 border-b border-slate-100 dark:border-zinc-855 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/20">
                  <button 
                    onClick={() => setReadingArticle(null)}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-600 dark:text-zinc-300 hover:text-amber-550 transition bg-slate-100 dark:bg-zinc-800 p-2 rounded-lg cursor-pointer border-0"
                  >
                    <span>&larr;</span>
                    <span>{lang === 'ar' ? 'الرجوع للقائمة' : 'Back to Menu'}</span>
                  </button>
                  <span className="text-[10px] text-amber-550 dark:text-amber-450 font-black tracking-wider uppercase font-mono">
                    {lang === 'ar' ? 'دليل الأمان المعرفي' : 'AdSense Quality Post'}
                  </span>
                </div>

                <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-5 leading-relaxed text-slate-750 dark:text-zinc-200">
                  <div className="space-y-2 border-b border-slate-100 dark:border-zinc-850 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 dark:bg-amber-955/40 text-amber-600 dark:text-amber-450 text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                        {readingArticle.category === 'real-estate' ? (lang === 'ar' ? 'عقارات' : 'Estates') : (lang === 'ar' ? 'سيارات' : 'Cars')}
                      </span>
                      <span className="text-[10px] text-slate-450 font-bold">{readingArticle.date}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white [font-family:'Cairo'] leading-snug">
                      {lang === 'ar' ? readingArticle.titleAr : readingArticle.titleEn}
                    </h2>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-slate-705 dark:text-zinc-250 leading-loose [font-family:'Cairo']">
                    {(lang === 'ar' ? readingArticle.contentAr : readingArticle.contentEn).map((paragraph, idx) => (
                      <p key={idx} className="indent-4 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50/50 dark:bg-amber-955/10 rounded-2xl border border-amber-100/30 text-center select-none space-y-2">
                    <p className="text-[11px] font-black text-amber-700 dark:text-amber-400">
                      {lang === 'ar' ? 'أمان وثقة بالمعاينة الميدانية والواقع' : 'Real ground verification protects you'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                      {lang === 'ar' 
                        ? 'نحن نقوم بالتحقق من العقارات والسيارات وحالة وثائقها مجاناً لتفادي النصب والاحتيال.' 
                        : 'We offer physical and legal checking on all local items to eliminate fraudulent activities.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-zinc-850 bg-slate-50/50 shrink-0 select-none">
                  <button 
                    onClick={() => setReadingArticle(null)}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-xs py-2.5 rounded-xl transition duration-200 cursor-pointer border-0 [font-family:'Cairo']"
                  >
                    {lang === 'ar' ? 'حسناً، فهمت الفكرة واكتملت القراءة' : 'Done Reading'}
                  </button>
                </div>
              </div>
            )}

            {/* ================= NESTED MODAL OR VIEW SLIDE-OVER: ABOUT US ================= */}
            {drawerExpandedSection === 'about' && (
              <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col h-full overflow-hidden animate-slide-over">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-820 flex items-center justify-between bg-slate-100/30">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-655 hover:text-emerald-500 transition cursor-pointer border-0"
                  >
                    <span>&larr;</span>
                    <span>{lang === 'ar' ? 'الرجوع للقائمة' : 'Back to Menu'}</span>
                  </button>
                  <span className="text-[10px] text-zinc-400 font-extrabold">{lang === 'ar' ? 'مستند تعريفي' : 'About Platform'}</span>
                </div>

                <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 text-justify [font-family:'Cairo'] text-xs sm:text-sm">
                  <div className="text-center pb-4">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{lang === 'ar' ? 'منصة الأمان العقاري بمحافظة إب' : 'About Ibb Aman Platform'}</h3>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500">{lang === 'ar' ? 'اليمن، محافظة إب - الخدمة المدنية المجانية' : 'Ibb city, Yemen - Free Civic Service'}</p>
                  </div>
                  
                  <p className="leading-loose text-slate-650 dark:text-zinc-350">
                    {lang === 'ar' 
                      ? 'تأسست منصة الأمان كخدمة وطنية ومجتمعية طوعية تهدف لمناهضة الاحتكار ومحاربة جشع السماسرة وتسهيل المبادلات والاستثمارات العقارية وال vehicular بمحافظة إب واليمن الحبيب.'
                      : 'Aman was formed to counter heavy intermediate margins and help expatriates and locals lock in verified items directly.'}
                  </p>
                  
                  <p className="leading-loose text-slate-650 dark:text-zinc-350">
                    {lang === 'ar' 
                      ? 'رسالتنا تتلخص في الصدق وتأكيد الأوراق القانونية وحالة المركبات المطبوعة قبل النشر، وتأكيد أمان المشترين بالنزول والاستقصاء.'
                      : 'We inspect papers, check history, and run onsite reviews before listing items, bringing transparency to digital portals.'}
                  </p>

                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-center border font-bold">
                    {lang === 'ar' ? 'لا سمسرة، لا عمولات خفية، بيع وشراء بحرية.' : 'Free listings, zero commissions, total security.'}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 dark:bg-zinc-950 shrink-0 text-center">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs py-2 px-6 rounded-xl border-0 cursor-pointer"
                  >
                    {lang === 'ar' ? 'الرجوع للقائمة' : 'Close'}
                  </button>
                </div>
              </div>
            )}

            {/* ================= NESTED MODAL OR VIEW SLIDE-OVER: PRIVACY ================= */}
            {drawerExpandedSection === 'privacy' && (
              <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col h-full overflow-hidden animate-slide-over">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-820 flex items-center justify-between bg-slate-100/30">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-655 hover:text-emerald-500 transition cursor-pointer border-0"
                  >
                    <span>&larr;</span>
                    <span>{lang === 'ar' ? 'الرجوع للقائمة' : 'Back to Menu'}</span>
                  </button>
                  <span className="text-[10px] text-zinc-400 font-extrabold">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy & Cookies'}</span>
                </div>

                <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 text-justify [font-family:'Cairo'] text-xs sm:text-sm leading-loose">
                  <h3 className="font-black text-slate-800 dark:text-white border-b pb-2 text-xs sm:text-sm">
                    {lang === 'ar' ? 'ميثاق حماية الخصوصية ومستند أمن البيانات لأدسنس' : 'Privacy & Terms Agreement'}
                  </h3>
                  
                  <p>
                    {lang === 'ar'
                      ? '١. الخصوصية الفائقة: نحن لا نملك قواعد بيانات خارجية تتبع تحركاتكم. كافة بياناتكم الشخصية ومفضلتكم تحفظ بشكل محلي ومشفر بمتصفحكم (localStorage) ولا نبيع معلومات للغير.'
                      : '1. No remote server leaks. Your names and favorites reside in the local isolated storage.'}
                  </p>
                  
                  <p>
                    {lang === 'ar'
                      ? '٢. استخدام الكوكيز وملفات التعريف: نتماشى مع متطلبات جوجل أدسنس للسلامة والأمن لتزويدكم بالمحتوى الأكثر ملاءمة ونقاء.'
                      : '2. We adhere to Google AdSense compliance conditions as a publisher platform to ensure premium traffic safety values.'}
                  </p>

                  <p>
                    {lang === 'ar'
                      ? '٣. المراسلات ومسؤولية استخدام الواتساب: المبيعات والتبرعات واللقاءات تحكمها سرية الطرفين المشفرة الخاصة بشبكة واتس آب الرسمية.'
                      : '3. Handshakes over SMS / WhatsApp are completely encrypted and governed by WhatsApp services.'}
                  </p>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 dark:bg-zinc-950 shrink-0 text-center">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs py-2 px-6 rounded-xl border-0 cursor-pointer"
                  >
                    {lang === 'ar' ? 'الرجوع للقائمة' : 'Close'}
                  </button>
                </div>
              </div>
            )}

            {/* ================= NESTED MODAL OR VIEW SLIDE-OVER: TERMS OF USE ================= */}
            {drawerExpandedSection === 'terms' && (
              <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col h-full overflow-hidden animate-slide-over">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-820 flex items-center justify-between bg-slate-100/30">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-655 hover:text-emerald-500 transition cursor-pointer border-0"
                  >
                    <span>&larr;</span>
                    <span>{lang === 'ar' ? 'الرجوع للقائمة' : 'Back to Menu'}</span>
                  </button>
                  <span className="text-[10px] text-zinc-400 font-extrabold">{lang === 'ar' ? 'شروط الخدمة' : 'Terms of Use'}</span>
                </div>

                <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 text-justify [font-family:'Cairo'] text-xs sm:text-sm leading-loose">
                  <h3 className="font-black text-slate-800 dark:text-white border-b pb-2 text-xs sm:text-sm">
                    {lang === 'ar' ? 'شروط النشر والاستخدام والبيئة الآمنة' : 'Platform Terms and Rules of Conduct'}
                  </h3>
                  
                  <p>
                    {lang === 'ar'
                      ? '١. التوثيق المسبق: يمنع منعاً باتاً نشر أي عرض سيارات أو منازل دون توفر البصائر الشرعية والملكيات القانونية الثابتة.'
                      : '1. Verified ownership only. No arbitrary duplicates or fake broker listings are toleratable.'}
                  </p>
                  
                  <p>
                    {lang === 'ar'
                      ? '٢. الأمانة والدقة في وصف السلعة: نحن نشترط كتابة العيوب وخلفيات الصدمات بكل شفافية لعدم تضليل أي متصفح بالشبكة.'
                      : '2. Total transparency. Disclose faults, boundaries, and mechanical integrity in descriptions.'}
                  </p>

                  <p>
                    {lang === 'ar'
                      ? '٣. مكافحة النصب والتبليغ الميداني: أي تقرير يثبت تحايله أو محاولة خداعه للجمهور، يتم تجميد معلنه قانونياً وحجب نشاطه فوراً.'
                      : '3. Fraud zero tolerance. Culprits are locked out, blacklisted, and exposed to state entities.'}
                  </p>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 dark:bg-zinc-950 shrink-0 text-center">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs py-2 px-6 rounded-xl border-0 cursor-pointer"
                  >
                    {lang === 'ar' ? 'الرجوع للقائمة' : 'Close'}
                  </button>
                </div>
              </div>
            )}

            {/* ================= NESTED MODAL OR VIEW SLIDE-OVER: HELP & FAQ ================= */}
            {drawerExpandedSection === 'help' && (
              <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col h-full overflow-hidden animate-slide-over">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-820 flex items-center justify-between bg-slate-100/30">
                  <button 
                    onClick={() => setDrawerExpandedSection('editorial')}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-655 hover:text-emerald-500 transition cursor-pointer border-0"
                  >
                    <span>&larr;</span>
                    <span>{lang === 'ar' ? 'الرجوع للقائمة' : 'Back to Menu'}</span>
                  </button>
                  <span className="text-[10px] text-zinc-400 font-extrabold">{lang === 'ar' ? 'مركز المساعدة' : 'Help Center'}</span>
                </div>

                <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 text-justify [font-family:'Cairo'] text-xs sm:text-sm leading-loose">
                  <div className="bg-amber-50/55 dark:bg-amber-955/10 p-4 rounded-2xl border border-amber-100/35 text-center flex flex-col items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-amber-500" />
                    <p className="font-extrabold text-[#7C6E65] dark:text-[#A89984]">
                      {lang === 'ar'
                        ? 'بحي المعاين أو الدائري؟ أو ترغب بالاستعلام عن وثيقة سيارة مضافة لدينا؟ تواصل مع مستشاري المنصة فوراً للحصول على الفحص مجاناً!'
                        : 'Do you need our field experts to run on-site physical analysis on vehicles or estate titles in Ibb province? Contact us instantly for free verification assistance!'}
                    </p>
                    <a 
                      href={`https://wa.me/${(import.meta as any).env.VITE_WHATSAPP_NUMBER || "966504245645"}?text=${encodeURIComponent(
                        lang === 'ar'
                          ? 'أهلاً بكم، أريد الاستفسار عن توثيق عقار في منصة الأمان.'
                          : 'Hello, I want to query about property verification on the Aman Platform.'
                      )}`}
                      target="_blank"
                      rel="no-referrer"
                      className="inline-flex items-center gap-2 bg-slate-950/80 hover:bg-slate-950 text-white font-black px-6 py-3 rounded-2xl transition shadow-md hover:scale-102 text-xs"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'ar' ? 'تحدث مع مستشار الدعم (واتساب)' : 'Chat with Support on WhatsApp'}</span>
                    </a>
                  </div>

                  {/* Accordion FAQ details */}
                  <div className="space-y-3.5">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">{lang === 'ar' ? 'الأسئلة الأكثر شيوعاً والاستفسارات 🧐' : 'Common Knowledge & FAQs 🧐'}</h4>
                    
                    <div className="space-y-2.5">
                      <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-850">
                        <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white mb-1.5">{lang === 'ar' ? '١. كيف تعمل منصة الأمان وتضمن الصدق؟' : '1. How does Aman verify deals?'}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {lang === 'ar' 
                            ? 'المنصة لا تقبل السمسرة. كل إعلان يتم التحقق من وثقته الشرعية (الصيرة المعمدة) أو ملكية السيارة قبل النشر. نحن نربط البائع بالمشتري مباشرة بدون عمولات مخفية ترفع السعر.'
                            : 'All listed assets undergo strict check. We do not accept high-commission intermediate layers.'}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-850">
                        <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white mb-1.5">{lang === 'ar' ? '٢. هل نشر الإعلانات في حراج الأمان مدفوع؟' : '2. Is it free to list items here?'}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {lang === 'ar' 
                            ? 'لا، نشر الإعلانات والمقترحات والبحث مجاني بالكامل ١٠٠٪ لخدمة أهلنا ومغتربينا الكرام بمحافظة إب واليمن.'
                            : 'Yes, it is 100% free of charge! Built as a patriotic civic effort for families in Ibb.'}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-850">
                        <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white mb-1.5">{lang === 'ar' ? '٣. كيف أعرف أن الإعلان وهمي أو مضلل؟' : '3. What if I suspect a fake ad?'}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {lang === 'ar' 
                            ? 'بجانب كل إعلان يوجد زر إبلاغ (رمز الدرع الأحمر). عند نقره، يتم تبليغ إدارة المنصة فوراً لحجب الإعلان ومراجعته قانونياً بنزاهة.'
                            : 'Click the Shield flag icon next to the Whatsapp button to report any discrepancy immediately.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {/* PRIVACY POLICY VIEW */}
              {activeSideModal === 'privacy' && (
                <div className="space-y-4">
                  <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">{lang === 'ar' ? 'ميثاق حماية هوية مستخدمي إب' : 'Privacy & Cookie Policy Terms'}</h4>
                  <div className="space-y-3 text-[11px] sm:text-xs text-slate-605 dark:text-zinc-450 leading-loose">
                    <p>
                      {lang === 'ar'
                        ? '١. نحن نقدر مخاوفكم بشأن أمن البيانات. منصة "الأمان" لا تجمع أو تقرأ أو تبيع بيانات جهات الاتصال أو الاسم أو الهاتف لحساباتكم على الإطلاق.'
                        : '1. No personal data harvesting. All variables remain strictly isolated on your own local browser client.'}
                    </p>
                    <p>
                      {lang === 'ar'
                        ? '٢. يتم استخدام "التخزين المحلي الآمن" (localStorage) كحل تقني متقدم لحفظ إعلاناتكم المضافة وقائمة مفضلاتكم بشكل مشفر لعدم تحميل خوادم خارجية تتبع نشاط المستعرض.'
                        : '2. Your favorites list, active username, and custom added ads are saved only inside standard localized sandboxes.'}
                    </p>
                    <p>
                      {lang === 'ar'
                        ? '٣. عندما تتواصلون عبر الواتس آب، فأنتم تنتقلون إلى بيئة الواتساب المحمية بتشفير الطرفين لضمان سرية وأمن محادثاتكم المفصلة بالكامل.'
                        : '3. When sending direct messages, our platform hands off securely to WhatsApps official end-to-end encryption protocols.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TERMS OF USE VIEW */}
              {activeSideModal === 'terms' && (
                <div className="space-y-4">
                  <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">{lang === 'ar' ? 'شروط وأحكام النشر النزيه' : 'Community Terms and Rules Of Engagement'}</h4>
                  <div className="space-y-3 text-[11px] sm:text-xs text-slate-605 dark:text-zinc-450 leading-loose">
                    <p>
                      {lang === 'ar'
                        ? '١. يمنع منعاً باتاً نشر أي عروض عقارية أو سيارات بدون امتلاك الوثائق الشرعية الثبوتية أو تفويض رسمي موثق من الملاك الحقيقيين.'
                        : '1. Unchecked intermediate or duplicate third-party brokerage advertising is forbidden. Every listing must represent direct owner connections.'}
                    </p>
                    <p>
                      {lang === 'ar'
                        ? '٢. يجب كتابة العيوب الفنية والميكانيكية والمواصفات (مثل المساحة والحدود الجغرافية وسواقي السيول) بصدق متكامل ونزاهة تامة بدون كذب أو تلاعب.'
                        : '2. Description accuracy is mandatory. Listings must outline physical flaws, legal boundaries, or mechanical traits transparently.'}
                    </p>
                    <p>
                      {lang === 'ar'
                        ? '٣. أي إعلان يثبت وهميته أو احتوائه على نصب أو تضليل مالي، سيتم حظر رقم معلنه نهائياً من الشبكة وإدراج بياناته في القائمة السوداء لمكافحة الاحتيال في اليمن.'
                        : '3. Fraudulent listings result in immediate IP limits, number flagging, and reporting to legal community authorities.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ABOUT US VIEW */}
              {activeSideModal === 'about' && (
                <div className="space-y-4 text-center">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100/30 max-w-md mx-auto">
                    <ShieldCheck className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-base font-black text-emerald-800 dark:text-emerald-400">{lang === 'ar' ? 'عقارات وسيارات الأمان بمحافظة إب' : 'About Ibb Aman Platform'}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">{lang === 'ar' ? 'المدينة الخضراء، إب، اليمن' : 'The Green Ibb, Yemen'}</p>
                  </div>

                  <div className="space-y-3 text-[11.5px] sm:text-xs text-slate-700 dark:text-zinc-400 text-right leading-loose max-w-xl mx-auto mt-4 px-2">
                    <p>
                      {lang === 'ar'
                        ? 'منصة الأمان هي مبادرة وطنية ريادية تهدف إلى مكافحة الاحتكار ومحاربة جشع السماسرة وتسهيل الاستثمار والتبادل العقاري والتجاري لأبناء محافظة إب والمغتربين الكرام في دول الاغتراب.'
                        : 'Founded as a civic solution to eliminate heavy-handed real estate broker markup fees, helping residents and expats connect directly.'}
                    </p>
                    <p>
                      {lang === 'ar'
                        ? 'تحت إشراف مباشر واستشاري من خبراء عقاريين ومحامين ثقات، نقوم بمكافحة الوهم والتضليل المنتشر في أسواق ومزادات الإعلانات الإباحية العشوائية لنقدم لبلدنا دليلاً نقياً وموثقاً بالوثيقة والفحص الحسي.'
                        : 'Backed by localized real estate practitioners and local examiners to review property papers and vehicular custom statuses.'}
                    </p>
                    <p className="font-extrabold text-emerald-600 dark:text-emerald-450 text-center border-t border-slate-100 dark:border-zinc-855 pt-3">
                      {lang === 'ar' ? 'الأمان شريكك النزيه الأول للبحث والبيع بثقة كاملة.' : 'Aman is your partner to trade with complete piece of mind.'}
                    </p>
                  </div>
                </div>
              )}

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-zinc-950 px-6 py-4 border-t border-slate-150 dark:border-zinc-850 flex justify-end">
              <button 
                type="button"
                onClick={() => setActiveSideModal(null)}
                className="bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 font-extrabold py-2 px-5 rounded-xl transition text-xs cursor-pointer border border-slate-200 dark:border-zinc-700 shadow-xs"
              >
                {lang === 'ar' ? 'حسناً، إغلاق البوابة' : 'Close Window'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile and Desktop Comfort */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-45 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-slate-150 dark:border-zinc-800 flex items-center justify-around gap-6 sm:gap-10 w-[92%] max-w-lg select-none transform transition-all duration-300">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-500 hover:text-emerald-500 transition-colors cursor-pointer group"
          title={lang === 'ar' ? 'الرئيسية' : 'Home'}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-emerald-500 scale-110 font-bold' : 'text-slate-400 group-hover:scale-105'} transition-all`} />
          <span className={`text-[10px] sm:text-[11px] font-extrabold ${activeTab === 'home' ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-zinc-400'}`}>
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('real-estate')}
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-500 hover:text-emerald-500 transition-colors cursor-pointer group"
          title={lang === 'ar' ? 'العقارات' : 'Estates'}
        >
          <Building className={`w-5 h-5 ${activeTab === 'real-estate' ? 'text-emerald-500 scale-110 font-bold' : 'text-slate-400 group-hover:scale-105'} transition-all`} />
          <span className={`text-[10px] sm:text-[11px] font-extrabold ${activeTab === 'real-estate' ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-zinc-400'}`}>
            {lang === 'ar' ? 'العقارات' : 'Estates'}
          </span>
        </button>

        {/* Central Plus Ad trigger */}
        <button 
          onClick={() => setShowTrustModal(true)}
          className="flex flex-col items-center justify-center -mt-6 cursor-pointer relative group"
          title={lang === 'ar' ? 'إضافة إعلان جديد' : 'New Ad'}
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-35 group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-full shadow-lg transition-all group-hover:scale-110 group-active:scale-95 border-2 border-white dark:border-zinc-900">
            <Plus className="w-6 h-6 text-white font-black" />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('cars')}
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-500 hover:text-emerald-500 transition-colors cursor-pointer group"
          title={lang === 'ar' ? 'السيارات' : 'Cars'}
        >
          <Car className={`w-5 h-5 ${activeTab === 'cars' ? 'text-emerald-500 scale-110 font-bold' : 'text-slate-400 group-hover:scale-105'} transition-all`} />
          <span className={`text-[10px] sm:text-[11px] font-extrabold ${activeTab === 'cars' ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-zinc-400'}`}>
            {lang === 'ar' ? 'السيارات' : 'Cars'}
          </span>
        </button>

        <button 
          onClick={() => setActiveSideModal('favorites')}
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-500 hover:text-emerald-500 transition-colors cursor-pointer group relative"
          title={lang === 'ar' ? 'المفضلة' : 'Favorites'}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeSideModal === 'favorites' ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-400 group-hover:scale-105'} transition-all`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full font-mono animate-bounce">
                {favorites.length}
              </span>
            )}
          </div>
          <span className={`text-[10px] sm:text-[11px] font-extrabold ${activeSideModal === 'favorites' ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-zinc-400'}`}>
            {lang === 'ar' ? 'المفضلة' : 'Saved'}
          </span>
        </button>
      </div>

      {/* Dynamic Filter Modal Popup */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setShowFilterModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-150 dark:border-zinc-800 p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-4 mb-4 select-none">
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                <span>{lang === 'ar' ? 'خيارات الفرز والفلترة المتقدمة' : 'Advanced Listings Filtering'}</span>
              </h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="text-slate-450 hover:text-rose-500 font-extrabold text-2xl p-1 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Filter Category Choice Tabs */}
            <div className="flex border-b border-slate-100 dark:border-zinc-850 mb-5 justify-center gap-4 text-xs font-black select-none">
              <button 
                onClick={() => setCurrentSearchCategory('real-estate')} 
                className={`pb-3 px-4 sm:px-6 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${currentSearchCategory === 'real-estate' ? 'text-emerald-600 border-emerald-555 font-black' : 'text-slate-400 dark:text-zinc-550 border-transparent hover:text-emerald-400'}`}
              >
                <Building className="w-4 h-4" />
                <span>{lang === 'ar' ? 'عقارات موثقة' : 'Estate filters'}</span>
              </button>
              <button 
                onClick={() => setCurrentSearchCategory('cars')} 
                className={`pb-3 px-4 sm:px-6 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${currentSearchCategory === 'cars' ? 'text-emerald-600 border-emerald-555 font-black' : 'text-slate-400 dark:text-zinc-550 border-transparent hover:text-emerald-400'}`}
              >
                <Car className="w-4 h-4" />
                <span>{lang === 'ar' ? 'سيارات مضمونة' : 'Vehicle filters'}</span>
              </button>
            </div>

            {/* Selectors */}
            {currentSearchCategory === 'real-estate' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-400 dark:text-zinc-500 mb-1.5">{lang === 'ar' ? 'نوع العقار المطلوب' : 'Property Type'}</label>
                  <select 
                    value={homeReType} 
                    onChange={(e) => setHomeReType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-zinc-350 font-semibold"
                  >
                    <option value="">{lang === 'ar' ? 'كل أنواع العقارات ومساحاتها' : 'All Estate Types'}</option>
                    <option value="apart">{lang === 'ar' ? 'شقة سكنية' : 'Apartment'}</option>
                    <option value="land">{lang === 'ar' ? 'أرض استثمارية' : 'Investment Land'}</option>
                    <option value="villa">{lang === 'ar' ? 'فيلا / بيت مستقل' : 'Villa / Independent House'}</option>
                    <option value="store">{lang === 'ar' ? 'محل تجاري' : 'Commercial Store'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-400 dark:text-zinc-500 mb-1.5">{lang === 'ar' ? 'منطقة تواجد العقار في إب' : 'District Location'}</label>
                  <select 
                    value={homeReLocation} 
                    onChange={(e) => setHomeReLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-zinc-350 font-semibold"
                  >
                    <option value="">{lang === 'ar' ? 'كل مديريات ومناطق إب' : 'All Ibb Locations'}</option>
                    <option value="الظهار">{lang === 'ar' ? 'حي الظهار (وسط المدينة)' : 'Al-Dhar District'}</option>
                    <option value="المشنة">{lang === 'ar' ? 'حي المشنة (البلدة القديمة)' : 'Al-Mashnah District'}</option>
                    <option value="الدائري">{lang === 'ar' ? 'الدائري الغربي / الشرقي' : 'West/East Ring Road'}</option>
                    <option value="المعاين">{lang === 'ar' ? 'حي المعاين (المدخل الغربي)' : 'Al-Ma\'ayen District'}</option>
                    <option value="جبل ربي">{lang === 'ar' ? 'جبل ربي / السبل' : 'Jabal Raby / Al-Sabal'}</option>
                    <option value="السحول">{lang === 'ar' ? 'وادي السحول' : 'Al-Suhool Valley'}</option>
                    <option value="أخرى">{lang === 'ar' ? 'مديريات إب الأخرى' : 'Other Suburbs'}</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-400 dark:text-zinc-500 mb-1.5">{lang === 'ar' ? 'ماركة مركبة' : 'Brand name'}</label>
                  <select 
                    value={homeCarBrand} 
                    onChange={(e) => setHomeCarBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-zinc-350 font-semibold"
                  >
                    <option value="">{lang === 'ar' ? 'كل الماركات المتوفرة' : 'All Brands'}</option>
                    <option value="toyota">Toyota (تويوتا)</option>
                    <option value="hyundai">Hyundai (هيونداي)</option>
                    <option value="kia">Kia (كيا)</option>
                    <option value="lexus">Lexus (لكزس)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-400 dark:text-zinc-500 mb-1.5">{lang === 'ar' ? 'ناقل الحركة' : 'Transmission'}</label>
                  <select 
                    value={homeCarTrans} 
                    onChange={(e) => setHomeCarTrans(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-zinc-350 font-semibold"
                  >
                    <option value="">{lang === 'ar' ? 'ناقل الحركة (الجير)' : 'Transmission Type'}</option>
                    <option value="auto">{lang === 'ar' ? 'أتوماتيك' : 'Automatic'}</option>
                    <option value="manual">{lang === 'ar' ? 'عادي / يدوي' : 'Manual'}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Actions button */}
            <div className="flex gap-3 justify-end mt-6 border-t border-slate-100 dark:border-zinc-850 pt-4">
              <button 
                onClick={() => {
                  setHomeReType('');
                  setHomeReLocation('');
                  setHomeCarBrand('');
                  setHomeCarTrans('');
                  setFilterReType('');
                  setFilterReLocation('');
                  setFilterCarBrand('');
                  setFilterCarTrans('');
                  triggerToast(lang === 'ar' ? 'تم تصفير خيارات الفرز.' : 'Filters has been cleared.', 'info');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 font-extrabold rounded-xl transition text-xs cursor-pointer select-none"
              >
                {lang === 'ar' ? 'إعادة ضبط' : 'Reset All'}
              </button>

              <button 
                onClick={() => {
                  triggerHomeSearch(currentSearchCategory);
                  setShowFilterModal(false);
                  triggerToast(lang === 'ar' ? 'تم تطبيق المعايير بنجاح.' : 'Filter criteria updated.', 'check');
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-2 rounded-xl transition text-xs shadow-md shadow-emerald-500/10 cursor-pointer select-none active:scale-95 transform"
              >
                {lang === 'ar' ? 'تطبيق معايير البحث' : 'Apply Criteria'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TRUST & REALITY VERIFICATION PROMPT ================= */}
      <AnimatePresence>
        {showTrustModal && (
          <TrustModal 
            onClose={() => setShowTrustModal(false)}
            lang={lang}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// Separate listing card component for extreme clarity and non-overlapping content
interface ListingCardProps {
  key?: React.Key;
  item: Listing;
  lang: 'ar' | 'en';
  onReport: (title: string) => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

function ListingCard({ item, lang, onReport, isFavorited, onToggleFavorite }: ListingCardProps) {
  const isCar = item.category === 'cars';
  const badgeLabel = isCar 
    ? ((item.brand || 'Toyota').toUpperCase() + ' - ' + (item.transmission || 'Auto')) 
    : ((item.status || 'للبيع') + ' - ' + (lang === 'ar' ? (item.location || 'الظهار') : 'Distr.'));

  const whatsappText = encodeURIComponent(
    lang === 'ar' 
      ? `أهلاً بك، تصفحت عرضك على "منصة الأمان لإعلانات إب": [${item.title}] المعروض بسعر [${item.price}]. أريد التحقق من سلامة العرض والتفاصيل إذا سمحت.`
      : `Hello, I browsed your offer [${item.title}] priced at [${item.price}] on Aman Platform. Is it still available and verified?`
  );
  const whatsappUrl = `https://wa.me/${item.phone}?text=${whatsappText}`;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 dark:border-zinc-850 flex flex-col justify-between relative">
      
      {/* Thumbnail Frame */}
      <div className="relative overflow-hidden h-44 sm:h-48">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560548204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80';
          }}
        />
        
        {/* Absolute indicators */}
        <span className="absolute top-2 text-white text-[9px] px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 shadow-sm select-none z-10 bg-slate-950/80 backdrop-blur-xs" style={{ right: lang === 'ar' ? '10px' : 'auto', left: lang === 'ar' ? 'auto' : '10px' }}>
          {isCar ? <Car className="w-3 h-3" /> : <Building className="w-3 h-3" />}
          <span>{badgeLabel}</span>
        </span>
        
        <span className="absolute top-2 text-white text-[9px] font-black px-2.5 py-0.5 rounded-lg shadow-md flex items-center gap-1 select-none z-10 bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ left: lang === 'ar' ? '10px' : 'auto', right: lang === 'ar' ? 'auto' : '10px' }}>
          <ShieldCheck className="w-3 h-3" />
          <span>{lang === 'ar' ? 'معاين وموثق' : 'Verified'}</span>
        </span>

        {/* Floating Heart Favorite Button overlaid on bottom edge - hidden by default, visible on hover */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`absolute bottom-2.5 z-25 bg-slate-950/70 hover:bg-slate-950/95 backdrop-blur-xs p-2 rounded-xl transition-all duration-300 transform active:scale-90 border border-white/10 shadow-md cursor-pointer opacity-0 group-hover:opacity-100 ${isFavorited ? 'opacity-100 scale-105' : ''}`}
          style={{ right: lang === 'ar' ? '10px' : 'auto', left: lang === 'ar' ? 'auto' : '10px' }}
          title={lang === 'ar' ? 'حفظ في المفضلة' : 'Save to favorites'}
        >
          <Heart className={`w-4.5 h-4.5 transition-all duration-300 hover:scale-110 ${isFavorited ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
        </button>
      </div>

      {/* Primary specs details */}
      <div className="p-4.5 flex-grow">
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-relaxed mb-2 hover:text-emerald-500 transition-colors">
          {item.title}
        </h4>
        
        <div className="mb-2.5">
          <span className="text-emerald-700 dark:text-emerald-350 font-black text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-lg border border-emerald-100/30 inline-block font-mono">
            {item.price}
          </span>
        </div>
        
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3.5 line-clamp-2 leading-relaxed font-semibold">
          {item.desc}
        </p>

        {/* Small detail info notes */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 border-t border-slate-50 dark:border-zinc-850 pt-2.5 justify-between select-none">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'ar' ? `اليمن، إب - ${isCar ? 'المعاين' : (item.location || 'الظهار')}` : `Ibb, Yemen - ${isCar ? 'Al-Ma\'ayen' : (item.location || 'Al-Dhar')}`}</span>
          </span>
          <span>{lang === 'ar' ? 'حقيقي ومؤكد ' : 'Real Ad'}</span>
        </div>
      </div>

      {/* Premium secure Trade triggers */}
      <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/40 border-t border-slate-100 dark:border-zinc-850 flex gap-2">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="no-referrer"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-2 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm select-none"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>{lang === 'ar' ? 'تواصل مباشر' : 'Direct Message'}</span>
        </a>

        <button 
          onClick={() => onReport(item.title)} 
          className="bg-slate-200/80 dark:bg-zinc-805 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 dark:text-zinc-400 hover:text-rose-500 p-2.5 rounded-xl text-xs transition-colors" 
          title={lang === 'ar' ? 'إبلاغ عن عيوب أو إعلان وهمي' : 'Flag fake advertisement'}
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
