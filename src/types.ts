export interface Particle {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

export interface Listing {
  id: string;
  category: 'real-estate' | 'cars';
  title: string;
  price: string;
  type?: string;        // 'apart' | 'land' | 'villa' | 'store'
  status?: string;      // 'للبيع' | 'للإيجار'
  location?: string;    // 'الظهار' | 'المشنة' | 'الدائري' | 'المعاين' | 'جبل ربي' | 'السحول' | 'أخرى'
  brand?: string;       // 'toyota' | 'hyundai' | 'kia' | 'lexus'
  transmission?: string; // 'أتوماتيك' | 'يدوي'
  customs?: string;     // 'مجمرك جاهز' | 'غير مجمرك'
  phone: string;
  image: string;
  images?: string[];    // Array of multiple high-res pictures
  desc: string;
  featured: boolean;
  date: string;
  userId?: string;      // Owner user profile relation ID
  approved?: boolean;   // Control permission visibility check state
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  role?: 'user' | 'admin';
}
