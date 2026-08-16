import React, { createContext, useContext, useState } from 'react'

export type Language = 'en' | 'ta' | 'hi'

export interface Translations {
  [key: string]: {
    en: string
    ta: string
    hi: string
  }
}

export const TRANSLATIONS: Translations = {
  // Navigation
  appName: { en: 'Fish Mart', ta: 'ஃபிஷ் மார்ட்', hi: 'फिश मार्ट' },
  deliveringTo: { en: 'Delivering to', ta: 'டெலிவரி செய்யும் இடம்', hi: 'डिलीवरी स्थान' },
  change: { en: 'Change', ta: 'மாற்று', hi: 'बदलें' },
  catalog: { en: 'Catalog', ta: 'பட்டியல்', hi: 'कैटलॉग' },
  menuCard: { en: 'Menu Card', ta: 'மெனு கார்டு', hi: 'मेनू कार्ड' },
  orders: { en: 'My Orders', ta: 'என் ஆர்டர்கள்', hi: 'मेरे ऑर्डर्स' },
  profile: { en: 'Profile', ta: 'சுயவிவரம்', hi: 'प्रोफ़ाइल' },
  cart: { en: 'Cart', ta: 'கூடை', hi: 'कार्ट' },
  signIn: { en: 'Sign In', ta: 'உள்நுழைக', hi: 'साइन इन' },
  createAccount: { en: 'Create Account', ta: 'கணக்கை உருவாக்கு', hi: 'खाता बनाएं' },
  logout: { en: 'Logout', ta: 'வெளியேறு', hi: 'लॉग आउट' },

  // Hero & Banners
  banner1Tag: { en: 'FRESH CATCH OF THE DAY', ta: 'இன்றைய புதிய மீன்கள்', hi: 'आज का ताज़ा कैच' },
  banner1Title: { en: 'Seer Fish & White Pomfret', ta: 'வஞ்சிரம் & வெள்ளை வவ்வால்', hi: 'सुरमई और सफेद पॉम्फ्रेट' },
  banner1Subtitle: { en: 'Sourced daily from coastal boats. 100% Chemical-Free, descaled & temperature controlled.', ta: 'கடற்கரை படகுகளிலிருந்து தினமும் பெறப்படுகிறது. 100% ரசாயனமற்றது, சுத்தம் செய்யப்பட்டது.', hi: 'तटीय नावों से ताज़ा प्राप्त। 100% रसायन मुक्त और तापमान नियंत्रित।' },
  banner1Cta: { en: 'Shop Fresh Fish', ta: 'மீன்களை வாங்குங்கள்', hi: 'ताज़ा मछली खरीदें' },

  banner2Tag: { en: 'NEW ARRIVAL UPDATE', ta: 'புதிய வரவு', hi: 'नया आगमन' },
  banner2Title: { en: 'Jumbo Tiger Prawns & Mud Crabs', ta: 'ஜம்போ டைகர் இறால் & நண்டு', hi: 'जंबो टाइगर झींगा और केकड़े' },
  banner2Subtitle: { en: 'Cleaned, deshelled & deveined. Ready to cook immediately for spicy roasts & curries.', ta: 'சுத்தம் செய்து நரம்பு நீக்கப்பட்டது. சமையலுக்கு உடனடியாக தயார்.', hi: 'साफ़ और छिला हुआ। स्वादिष्ट करी और रोस्ट के लिए तुरंत तैयार।' },
  banner2Cta: { en: 'Explore Shellfish', ta: 'இறால் & நண்டுகள்', hi: 'झींगा और केकड़ा देखें' },

  banner3Tag: { en: 'WEEKEND SPECIAL OFFER', ta: 'வார இறுதி சிறப்பு சலுகை', hi: 'सप्ताहांत विशेष ऑफर' },
  banner3Title: { en: 'Flat ₹100 OFF on Orders Above ₹499', ta: '₹499க்கு மேல் ₹100 தள்ளுபடி', hi: '₹499 से ऊपर ₹100 की छूट' },
  banner3Subtitle: { en: 'Use coupon code OCEAN100 at checkout. Fast 90-Minute delivery guaranteed.', ta: 'OCEAN100 கூப்பனைப் பயன்படுத்துங்கள். 90 நிமிட விரைவு டெலிவரி.', hi: 'चेकआउट पर OCEAN100 कूपन कोड का उपयोग करें। 90 मिनट में डिलीवरी।' },
  banner3Cta: { en: 'Claim Discount', ta: 'சலுகையைப் பெறுங்கள்', hi: 'छूट प्राप्त करें' },

  // Catalog Section
  searchPlaceholder: { en: 'Search fresh fish, prawns, crab, pomfret...', ta: 'மீன், இறால், நண்டு தேடுங்கள்...', hi: 'ताज़ी मछली, झींगा, केकड़ा खोजें...' },
  sortBy: { en: 'Sort By', ta: 'வரிசைப்படுத்து', hi: 'क्रमबद्ध करें' },
  featured: { en: 'Featured Items', ta: 'சிறப்பு மீன்கள்', hi: 'विशेष उत्पाद' },
  lowHigh: { en: 'Price: Low to High', ta: 'விலை: குறைவிலிருந்து அதிகம்', hi: 'मूल्य: कम से अधिक' },
  highLow: { en: 'Price: High to Low', ta: 'விலை: அதிகத்திலிருந்து குறைவு', hi: 'मूल्य: अधिक से कम' },
  rating: { en: 'Top Customer Rating', ta: 'உயர் மதிப்பீடு', hi: 'सर्वोच्च रेटिंग' },
  all: { en: 'All', ta: 'அனைத்தும்', hi: 'सभी' },
  seaFish: { en: 'Sea Fish', ta: 'கடல் மீன்கள்', hi: 'समुद्री मछली' },
  freshwaterFish: { en: 'Freshwater Fish', ta: 'நன்னீர் மீன்கள்', hi: 'मीठे पानी की मछली' },
  prawnsShrimps: { en: 'Prawns & Shrimps', ta: 'இறால் வகைகள்', hi: 'झींगा और प्रॉन्स' },
  crabsShellfish: { en: 'Crabs & Shellfish', ta: 'நண்டு & சிப்பி', hi: 'केकड़े और शेलफिश' },
  readyToCook: { en: 'Ready to Cook', ta: 'சமைக்க தயார்', hi: 'पकाने के लिए तैयार' },
  comboPacks: { en: 'Combo Packs', ta: 'காம்போ பேக்', hi: 'कॉम्बो पैक' },
  itemsAvailable: { en: 'Items Available', ta: 'பொருட்கள் உள்ளன', hi: 'उपलब्ध वस्तुएं' },
  netWt: { en: 'Net Wt', ta: 'நிகர எடை', hi: 'शुद्ध वजन' },
  grossWt: { en: 'Gross Wt', ta: 'மொத்த எடை', hi: 'सकल वजन' },
  packSize: { en: 'Pack Size', ta: 'அளவு', hi: 'पैक आकार' },
  cutPreference: { en: 'Cut Preference', ta: 'வெட்டும் முறை', hi: 'कटाई का प्रकार' },
  price: { en: 'Price', ta: 'விலை', hi: 'मूल्य' },
  addToCart: { en: 'ADD TO CART', ta: 'கூடையில் சேர்', hi: 'कार्ट में जोड़ें' },
  added: { en: 'Added', ta: 'சேர்க்கப்பட்டது', hi: 'जोड़ा गया' },
  todayIn90Mins: { en: 'Today in 90 mins', ta: 'இன்று 90 நிமிடங்களில்', hi: 'आज 90 मिनट में' },
  viewModeMenu: { en: 'Menu Card View', ta: 'மெனு கார்டு பார்வை', hi: 'मेनू कार्ड दृश्य' },
  viewModeGrid: { en: 'Grid View', ta: 'கிரிட் பார்வை', hi: 'ग्रिड दृश्य' },
  outOfStock: { en: 'Out of Stock', ta: 'இருப்பு இல்லை', hi: 'स्टॉक में नहीं है' },
  onlyAvailable: { en: 'Only', ta: 'மட்டுமே', hi: 'केवल' },
  availableUnits: { en: 'available', ta: 'உள்ளது', hi: 'उपलब्ध है' },
  limitedStocksOnly: { en: 'Limited stocks only', ta: 'குறைந்த இருப்பு மட்டுமே', hi: 'सीमित स्टॉक उपलब्ध' },
  inStock: { en: 'In Stock', ta: 'இருப்பில் உள்ளது', hi: 'स्टॉक में उपलब्ध' },

  // Orders
  orderHistory: { en: 'Order History & Tracking', ta: 'ஆர்டர் வரலாறு & கண்காணிப்பு', hi: 'ऑर्डर इतिहास और ट्रैकिंग' },
  orderHistoryDesc: { en: 'Track live orders and view previous seafood orders', ta: 'நடப்பு ஆர்டர்களைக் கண்காணித்து முந்தைய ஆர்டர்களைப் பார்க்கவும்', hi: 'लाइव ऑर्डर ट्रैक करें और पिछले ऑर्डर देखें' },
  activeOrders: { en: 'Active Orders', ta: 'செயலில் உள்ள ஆர்டர்கள்', hi: 'सक्रिय ऑर्डर्स' },
  pastOrders: { en: 'Past Orders', ta: 'கடந்த ஆர்டர்கள்', hi: 'पिछले ऑर्डर्स' },
  noOrders: { en: 'No Orders Yet', ta: 'ஆர்டர்கள் எதுவும் இல்லை', hi: 'अभी तक कोई ऑर्डर नहीं' },
  noOrdersDesc: { en: 'You have not placed any seafood orders yet. Browse our ocean catalog for fresh catch!', ta: 'நீங்கள் இன்னும் ஆர்டர் செய்யவில்லை. புதிய மீன்களைப் பார்க்க பட்டியலை உலாவவும்!', hi: 'आपने अभी तक कोई ऑर्डर नहीं दिया है। ताज़ा मछली के लिए हमारा कैटलॉग देखें!' },
  browseCatalog: { en: 'Browse Fresh Catalog', ta: 'பட்டியலைப் பார்க்கவும்', hi: 'कैटलॉग देखें' },
  orderNumber: { en: 'Order #', ta: 'ஆர்டர் எண் #', hi: 'ऑर्डर सं.' },
  orderPlacedOn: { en: 'Placed on', ta: 'ஆர்டர் செய்த நாள்', hi: 'ऑर्डर तिथि' },
  totalPaid: { en: 'Total Paid', ta: 'மொத்த தொகை', hi: 'कुल भुगतान' },
  statusPlaced: { en: 'Order Placed', ta: 'ஆர்டர் பெறப்பட்டது', hi: 'ऑर्डर दर्ज हुआ' },
  statusConfirmed: { en: 'Confirmed', ta: 'உறுதி செய்யப்பட்டது', hi: 'पुष्टि की गई' },
  statusPreparing: { en: 'Cleaning & Preparing', ta: 'சுத்தம் செய்யப்படுகிறது', hi: 'सफ़ाई और तैयारी' },
  statusPacked: { en: 'Packed & Chilled', ta: 'பேக் செய்யப்பட்டது', hi: 'पैक किया गया' },
  statusOutForDelivery: { en: 'Out for Delivery', ta: 'டெலிவரிக்கு புறப்பட்டது', hi: 'डिलीवरी के लिए निकला' },
  statusDelivered: { en: 'Delivered', ta: 'டெலிவரி செய்யப்பட்டது', hi: 'डिलीवर किया गया' },
  statusCancelled: { en: 'Cancelled', ta: 'ரத்து செய்யப்பட்டது', hi: 'रद्द किया गया' },
  deliverySlot: { en: 'Delivery Slot', ta: 'டெலிவரி நேரம்', hi: 'डिलीवरी स्लॉट' },
  paymentMode: { en: 'Payment Mode', ta: 'பணம் செலுத்தும் முறை', hi: 'भुगतान का तरीका' },
  deliveryAddress: { en: 'Delivery Address', ta: 'டெலிவரி முகவரி', hi: 'डिलीवरी पता' },
  itemsSummary: { en: 'Ordered Items', ta: 'ஆர்டர் செய்த பொருட்கள்', hi: 'ऑर्डर किए गए सामान' },

  // Profile
  myProfile: { en: 'My Account & Profile', ta: 'என் கணக்கு & சுயவிவரம்', hi: 'मेरा खाता और प्रोफ़ाइल' },
  profileDesc: { en: 'Manage your personal details, photo, and saved delivery addresses', ta: 'உங்கள் விவரங்கள், புகைப்படம் மற்றும் முகவரிகளை நிர்வகிக்கவும்', hi: 'अपने व्यक्तिगत विवरण, फ़ोटो और सहेजे गए पते प्रबंधित करें' },
  personalDetails: { en: 'Personal Details', ta: 'தனிப்பட்ட விவரங்கள்', hi: 'व्यक्तिगत विवरण' },
  savedAddresses: { en: 'Saved Delivery Addresses', ta: 'சேமிக்கப்பட்ட முகவரிகள்', hi: 'सहेजे गए डिलीवरी पते' },
  fullName: { en: 'Full Name', ta: 'முழு பெயர்', hi: 'पूरा नाम' },
  emailAddress: { en: 'Email Address', ta: 'மின்னஞ்சல் முகவரி', hi: 'ईमेल पता' },
  phoneNumber: { en: 'Phone Number', ta: 'தொலைபேசி எண்', hi: 'फ़ोन नंबर' },
  avatarPhoto: { en: 'Profile Photo URL', ta: 'சுயவிவர புகைப்பட இணைப்பு', hi: 'फ़ोटो यूआरएल' },
  saveProfileChanges: { en: 'Save Profile Changes', ta: 'சுயவிவரத்தை சேமி', hi: 'प्रोफ़ाइल सहेजें' },
  addNewAddress: { en: 'Add New Address', ta: 'புதிய முகவரியைச் சேர்', hi: 'नया पता जोड़ें' },
  addressLabel: { en: 'Address Label (e.g. Home, Office)', ta: 'முகவரி பெயர் (எ.கா. வீடு, அலுவலகம்)', hi: 'पते का नाम (उदा. घर, कार्यालय)' },
  streetAddress: { en: 'House / Flat / Street Name', ta: 'வீட்டு எண் / தெரு பெயர்', hi: 'मकान / फ़्लैट / गली का नाम' },
  areaLocality: { en: 'Area / Locality', ta: 'பகுதி / ஊர்', hi: 'क्षेत्र / इलाका' },
  city: { en: 'City', ta: 'நகரம்', hi: 'शहर' },
  pincode: { en: 'Pincode', ta: 'அஞ்சல் குறியீடு', hi: 'पिनकोड' },
  defaultBadge: { en: 'Default Address', ta: 'இயல்புநிலை முகவரி', hi: 'डिफ़ॉल्ट पता' },
  setAsDefault: { en: 'Set as Default', ta: 'இயல்புநிலையாக அமைக்கவும்', hi: 'डिफ़ॉल्ट के रूप में सेट करें' },
  deleteAddress: { en: 'Delete', ta: 'நீக்கு', hi: 'हटाएं' },
  saveAddress: { en: 'Save Address', ta: 'முகவரியைச் சேமி', hi: 'पता सहेजें' },
  cancel: { en: 'Cancel', ta: 'ரத்து செய்', hi: 'रद्द करें' },
  profileUpdatedSuccess: { en: 'Profile updated successfully!', ta: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!', hi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' },
  addressAddedSuccess: { en: 'New address added successfully!', ta: 'புதிய முகவரி வெற்றிகரமாக சேர்க்கப்பட்டது!', hi: 'नया पता सफलतापूर्वक जोड़ा गया!' },

  // Cart & Checkout
  yourCart: { en: 'Your Ocean Cart', ta: 'உங்கள் கூடை', hi: 'आपकी कार्ट' },
  emptyCartTitle: { en: 'Your Cart is Empty', ta: 'உங்கள் கூடை காலியாக உள்ளது', hi: 'आपकी कार्ट खाली है' },
  emptyCartDesc: { en: 'Add fresh fish, prawns, or ready-to-cook delicacies from our ocean catalog.', ta: 'எங்கள் பட்டியலிலிருந்து புதிய கடல் உணவுகளைச் சேர்க்கவும்.', hi: 'हमारे कैटलॉग से ताज़ी मछली या झींगे जोड़ें।' },
  startShopping: { en: 'Start Shopping', ta: 'ஷாப்பிங் தொடங்குங்கள்', hi: 'खरीदारी शुरू करें' },
  proceedToCheckout: { en: 'Proceed to Checkout', ta: 'பணம் செலுத்த தொடரவும்', hi: 'चेकआउट के लिए आगे बढ़ें' },
  checkoutTitle: { en: 'Checkout & Payment', ta: 'செக்அவுட் & கட்டணம்', hi: 'चेकआउट और भुगतान' },
  itemSubtotal: { en: 'Item Subtotal', ta: 'பொருட்களின் துணைத்தொகை', hi: 'उप-योग' },
  deliveryCharge: { en: 'Delivery Charge', ta: 'டெலிவரி கட்டணம்', hi: 'डिलीवरी शुल्क' },
  taxesGst: { en: 'Taxes (5% GST)', ta: 'வரி (5% ஜிஎஸ்டி)', hi: 'कर (5% जीएसटी)' },
  discount: { en: 'Discount', ta: 'தள்ளுபடி', hi: 'छूट' },
  totalAmount: { en: 'Total Amount', ta: 'மொத்த தொகை', hi: 'कुल राशि' },
  free: { en: 'FREE', ta: 'இலவசம்', hi: 'मुफ़्त' },
  applyCoupon: { en: 'Apply', ta: 'பயன்படுத்து', hi: 'लागू करें' },
  couponPlaceholder: { en: 'Coupon Code (e.g. OCEAN100)', ta: 'கூப்பன் குறியீடு (OCEAN100)', hi: 'कूपन कोड (OCEAN100)' },

  // Footer
  footerTagline: { en: 'Fresh Catch. Fast Delivery. Cleaned, Gutted & Descaled | 100% Chemical-Free & Temperature Controlled 0-4°C', ta: 'புதிய மீன்கள். 90 நிமிட விரைவு டெலிவரி. 100% ரசாயனமற்றது.', hi: 'ताज़ी मछली। 90 मिनट में तेज़ डिलीवरी। 100% रसायन मुक्त।' },
  copyright: { en: '© 2026 Fish Mart Inc. All rights reserved. Express 90-Min Delivery across major cities.', ta: '© 2026 ஃபிஷ் மார்ட். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.', hi: '© 2026 फिश मार्ट। सभी अधिकार सुरक्षित।' }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('fm_lang') as Language
    return saved && ['en', 'ta', 'hi'].includes(saved) ? saved : 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('fm_lang', lang)
  }

  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language]
    }
    if (TRANSLATIONS[key] && TRANSLATIONS[key].en) {
      return TRANSLATIONS[key].en
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

export default LanguageProvider
