import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon, BookOpen, Shield, KeyRound, CheckCircle, Clock } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth, googleProvider } from '../lib/firebase';
import { Listing, UserProfile } from '../types';

interface AuthSectionProps {
  lang: 'ar' | 'en';
  onUserUpdate: (profile: UserProfile | null) => void;
  listings: Listing[];
  onOpenListingDetails: (listing: Listing) => void;
  triggerToast: (msg: string, type?: 'check' | 'info') => void;
}

export default function AuthSection({ lang, onUserUpdate, listings, onOpenListingDetails, triggerToast }: AuthSectionProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [showSimulatedAuth, setShowSimulatedAuth] = useState(false);

  // Auto admin bootstrap verification
  const ADMIN_EMAIL = "773569038ahmed@gmail.com";
  const SECONDARY_ADMIN_EMAIL = "ahmed@gmail.com";

  const isAdminEmail = (email: string | null | undefined) => {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return lower === ADMIN_EMAIL.toLowerCase() || lower === SECONDARY_ADMIN_EMAIL.toLowerCase();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Check if user has a document in /users
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let profileData: UserProfile;

          if (!userSnap.exists()) {
            // New user, register in firestore
            const isBootstrappedAdmin = isAdminEmail(firebaseUser.email);
            profileData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'مستخدم الأمان',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              createdAt: new Date().toISOString(),
              role: isBootstrappedAdmin ? 'admin' : 'user'
            };

            await setDoc(userRef, profileData);
            triggerToast(
              lang === 'ar' 
                ? `مرحباً بك للتسجيل الأول! 🟢` 
                : `Welcome to your first sign-up! 🟢`
            );
          } else {
            // Load existing user record with roles
            const data = userSnap.data();
            profileData = {
              uid: data.uid,
              displayName: data.displayName || 'مستخدم الأمان',
              email: data.email || '',
              photoURL: data.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              createdAt: data.createdAt || new Date().toISOString(),
              role: data.role || (isAdminEmail(data.email) ? 'admin' : 'user')
            };

            // Double check admin bootstrap
            if (isAdminEmail(profileData.email) && profileData.role !== 'admin') {
              profileData.role = 'admin';
              await setDoc(userRef, { role: 'admin' }, { merge: true });
            }
          }

          setCurrentUser(profileData);
          onUserUpdate(profileData);
        } catch (error) {
          console.warn('Firestore load failed (offline support active):', error);
          
          // Fallback load details in offline mode
          const offlineProfile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'مستخدم محلي',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date().toISOString(),
            role: isAdminEmail(firebaseUser.email) ? 'admin' : 'user'
          };
          setCurrentUser(offlineProfile);
          onUserUpdate(offlineProfile);
        }
      } else {
        // Look for locally simulated login session for sandbox support
        const storedSim = localStorage.getItem('ibb_simulated_user');
        if (storedSim) {
          try {
            const parsed = JSON.parse(storedSim) as UserProfile;
            setCurrentUser(parsed);
            onUserUpdate(parsed);
          } catch (e) {
            setCurrentUser(null);
            onUserUpdate(null);
          }
        } else {
          setCurrentUser(null);
          onUserUpdate(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lang]);

  // Synchronously fetch user's own listings
  useEffect(() => {
    if (currentUser) {
      const filtered = listings.filter(item => item.userId === currentUser.uid);
      setMyListings(filtered);
    } else {
      setMyListings([]);
    }
  }, [listings, currentUser]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      triggerToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح! 🟢' : 'Successfully signed in! 🟢');
    } catch (popupError: any) {
      console.warn('Google Popup auth was blocked or rejected:', popupError);
      setErrorState(popupError?.message || '');
      setShowSimulatedAuth(true);
    }
  };

  const [errorState, setErrorState] = useState<string | null>(null);

  // Safe Simulated Developer/Owner Auth Option to guarantee preview usability in the iframe sandbox
  const handleSimulatedSignIn = async (role: 'user' | 'admin') => {
    const mockUid = role === 'admin' ? "admin_test_uid" : "guest_test_uid";
    const mockProfile: UserProfile = {
      uid: mockUid,
      displayName: role === 'admin' ? "بشمهندس أحمد (المدير)" : "بائع عقارات إب",
      email: role === 'admin' ? ADMIN_EMAIL : "test_seller@ibb-aman.com",
      photoURL: role === 'admin' 
        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date().toISOString(),
      role: role
    };

    // Save in firestore optionally to persist the state
    try {
      await setDoc(doc(db, 'users', mockUid), mockProfile);
    } catch (e) {
      console.warn("Saving test mock profile locally inside current browser context.", e);
    }

    localStorage.setItem('ibb_simulated_user', JSON.stringify(mockProfile));
    setCurrentUser(mockProfile);
    onUserUpdate(mockProfile);
    triggerToast(
      lang === 'ar' 
        ? `دخلت كـ ${role === 'admin' ? 'مدير منصة الأمان' : 'مستخدم تجريبي'} 🟢` 
        : `Signed in as ${role === 'admin' ? 'Aman Administrator' : 'Demo Seller'} 🟢`
    );
    setShowSimulatedAuth(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Signout error:", e);
    }
    localStorage.removeItem('ibb_simulated_user');
    setCurrentUser(null);
    onUserUpdate(null);
    triggerToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح 🔴' : 'Signed out successfully 🔴');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-zinc-900 rounded-3xl min-h-[140px]">
        <div className="w-6 h-6 rounded-full border-2 border-slate-800 dark:border-white border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!currentUser ? (
        // Login CTA Frame
        <div className="bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 text-white rounded-3xl p-6 shadow-2xl space-y-5 border border-zinc-800/60 transition-all select-none">
          <div className="space-y-2 text-center">
            <h3 className="text-sm font-black text-amber-400 tracking-wider">
              {lang === 'ar' ? 'منصة الأمان الموثقة (Aman)' : 'Verified Aman Estate & Cars'}
            </h3>
            <p className="text-[10px] text-zinc-300 leading-relaxed max-w-md mx-auto">
              {lang === 'ar' 
                ? 'سجل دخولك مجاناً لتتمكن من إضافة إعلانات العقارات والسيارات وحفظ المفضلة ومتابعة حالة إعلاناتك مباشرة!' 
                : 'Sign in for free to build genuine verified listings, save your properties, view review status, and more!'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Standard Google login representation */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-11 bg-white hover:bg-zinc-100 text-slate-900 text-xs font-black rounded-xl flex items-center justify-center gap-2.5 transition active:scale-98 shadow-md cursor-pointer border-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.111 4.114-3.447 0-6.236-2.79-6.236-6.237s2.79-6.237 6.236-6.237c1.558 0 2.973.57 4.072 1.503l3.078-3.078C19.103 2.148 15.866 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.786 0 10.536-4.323 10.973-10H12.24z"
                />
              </svg>
              <span>{lang === 'ar' ? 'تسجيل الدخول بواسطة Google' : 'Sign In With Google'}</span>
            </button>

            {/* Sandbox Fallback Activator */}
            <button
              onClick={() => setShowSimulatedAuth(!showSimulatedAuth)}
              className="w-full text-[10px] text-zinc-400 hover:text-white transition py-1 text-center font-bold bg-zinc-805 rounded-lg border-0 cursor-pointer"
            >
              {lang === 'ar' ? '🔒 تعذر الدخول؟ جرب تسجيل الدخول السريع للمعاينة' : '🔒 Can\'t sign in? Use simulated quick preview login'}
            </button>
          </div>

          {showSimulatedAuth && (
            <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/30 space-y-3.5 text-center animate-fadeIn">
              <p className="text-[10px] text-zinc-300">
                {lang === 'ar' 
                  ? 'بسبب جدران حماية المتصفح للمشغل الداخلي (Iframe Sandbox)، تم تفعيل هذا المدخل السريع لتمكينك من تجربة خصائص "المستخدم العادي" و"مدير منصة الأمان":' 
                  : 'Due to secure browser sandbox constraints within the development preview frame, select a mock identity below to test all user and control dashboard routines:'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSimulatedSignIn('user')}
                  className="bg-zinc-700 hover:bg-zinc-650 text-white text-[10px] py-1.5 px-3 rounded-lg font-black transition border-0 cursor-pointer"
                >
                  {lang === 'ar' ? 'دخول مستخدم تجريبي' : 'Simulated User'}
                </button>
                <button
                  onClick={() => handleSimulatedSignIn('admin')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] py-1.5 px-3 rounded-lg font-black transition border-0 cursor-pointer"
                >
                  {lang === 'ar' ? 'دخول المسؤول (أحمد)' : 'Simulated Admin'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Authentic User profile area - "تظهر اسم المستخدم، صورته، والإعلانات التي قام بنشرها فقط."
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-zinc-850 rounded-3xl p-5 border border-slate-150 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
            <img 
              src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser.displayName}
              className="w-16 h-16 rounded-full border-2 border-emerald-500 shadow-md object-cover select-none"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-right flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-zinc-50 text-sm">{currentUser.displayName}</h3>
                {currentUser.role === 'admin' && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    {lang === 'ar' ? 'إداري المسؤول' : 'Site Admin'}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 select-all font-semibold">{currentUser.email}</p>
              
              <div className="text-[9px] text-slate-400 dark:text-zinc-500 flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar' ? 'انضم في: ' : 'Joined: '} 
                  {new Date(currentUser.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-YE' : 'en-US')}
                </span>
              </div>
            </div>

            {/* Logout Trigger button */}
            <button
              onClick={handleSignOut}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 text-[10px] font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer border-0 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>

          {/* User Published listings view */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 select-none">
              <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
              <h4 className="text-xs font-black text-slate-950 dark:text-white">
                {lang === 'ar' 
                  ? `إعلاناتي المعروضة والموثقة (${myListings.length})` 
                  : `My Registered Listings (${myListings.length})`}
              </h4>
            </div>

            {myListings.length === 0 ? (
              <div className="bg-slate-50/50 dark:bg-zinc-900/40 rounded-3xl p-8 border border-dashed border-slate-200 dark:border-zinc-800 text-center select-none">
                <p className="text-xs text-slate-400 dark:text-zinc-400">
                  {lang === 'ar' 
                    ? 'لم تقم بنشر أي إعلانات حتى الآن. أضف عقارك أو سيارتك لتظهر هنا!' 
                    : 'You haven\'t published any listings yet. Create a brand new offer and track it here!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myListings.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onOpenListingDetails(item)}
                    className="flex bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-2.5 hover:shadow-md cursor-pointer transition select-none items-center gap-3 relative"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{item.title}</h5>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 block">{item.price}</span>
                      
                      {/* State approval badge */}
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.approved 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {item.approved 
                          ? (lang === 'ar' ? '🟢 معتمد وموثق' : '🟢 Verified & Approved') 
                          : (lang === 'ar' ? '⏳ قيد المراجعة' : '⏳ Pending review')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
