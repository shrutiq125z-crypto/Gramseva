import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Dashboard
    welcome: "Welcome back",
    dashboard: "Dashboard",
    hereIsHappening: "Here's what's happening in your panchayat today",
    totalCitizens: "Total Citizens",
    activeServices: "Active Services",
    documentRequests: "Document Requests",
    revenueGenerated: "Revenue Generated",
    businessProcess: "Business Process",
    businessOwner: "Business Owner",
    createBusiness: "Create Business",
    createBusinessDesc: "Register your business and funding goal.",
    addPerformance: "Add Performance",
    addPerformanceDesc: "Submit quarterly performance reports.",
    trackInvestments: "Track Investments",
    trackInvestmentsDesc: "Monitor investments and funding progress.",
    distributeProfits: "Distribute Profits",
    distributeProfitsDesc: "Share profits with investors.",
    myBusinesses: "My Businesses",
    quickAccess: "Quick Access",
    systemStatus: "System Status",
    allSystemsOperational: "All systems operational",
    lastUpdated: "Last updated",
    uptime: "Uptime",
    operational: "operational",
    readyToGetStarted: "Ready to get started?",
    accessAllServices: "Access all your services and manage your account from one place",
    goToDashboard: "Go to Dashboard",
    manageProfile: "Manage Profile",
    joinGramsevaToday: "Join Gramseva Today!",
    experienceSeamless: "Experience seamless government services and community management at your fingertips",
    signUpNow: "Sign Up Now",
    signIn: "Sign In",
    availableServices: "Available Services",
    documentServices: "Document Services",
    documentServicesDesc: "Apply for Aadhar, PAN, Driving License, and more",
    businessManagement: "Business Management",
    businessManagementDesc: "Create and manage your business ventures",
    investmentTracking: "Investment Tracking",
    investmentTrackingDesc: "Monitor your investments and returns",
    newsUpdates: "News & Updates",
    newsUpdatesDesc: "Stay updated with latest news and announcements",
    weatherForecast: "Weather Forecast",
    weatherForecastDesc: "Check weather conditions for your area",
    supportChat: "Support Chat",
    supportChatDesc: "Get instant help from our support team",
    signInRequired: "Sign In Required",
    signInToAccess: "Sign in to access",
    accessService: "Access Service"
  },
  hi: {
    // Dashboard
    welcome: "वापस स्वागत है",
    dashboard: "डैशबोर्ड",
    hereIsHappening: "आज आपके पंचायत में क्या हो रहा है",
    totalCitizens: "कुल नागरिक",
    activeServices: "सक्रिय सेवाएं",
    documentRequests: "दस्तावेज़ अनुरोध",
    revenueGenerated: "उत्पन्न राजस्व",
    businessProcess: "व्यापार प्रक्रिया",
    businessOwner: "व्यापार मालिक",
    createBusiness: "व्यापार बनाएं",
    createBusinessDesc: "अपना व्यापार और फंडिंग लक्ष्य पंजीकृत करें।",
    addPerformance: "प्रदर्शन जोड़ें",
    addPerformanceDesc: "त्रैमासिक प्रदर्शन रिपोर्ट जमा करें।",
    trackInvestments: "निवेश ट्रैक करें",
    trackInvestmentsDesc: "निवेश और फंडिंग प्रगति की निगरानी करें।",
    distributeProfits: "लाभ वितरित करें",
    distributeProfitsDesc: "निवेशकों के साथ लाभ साझा करें।",
    myBusinesses: "मेरे व्यापार",
    quickAccess: "त्वरित पहुंच",
    systemStatus: "सिस्टम स्थिति",
    allSystemsOperational: "सभी सिस्टम कार्यशील",
    lastUpdated: "अंतिम अपडेट",
    uptime: "अपटाइम",
    operational: "कार्यशील",
    readyToGetStarted: "शुरू करने के लिए तैयार?",
    accessAllServices: "एक स्थान से अपनी सभी सेवाओं तक पहुंचें और अपने खाते का प्रबंधन करें",
    goToDashboard: "डैशबोर्ड पर जाएं",
    manageProfile: "प्रोफ़ाइल प्रबंधित करें",
    joinGramsevaToday: "आज ग्रामसेवा में शामिल हों!",
    experienceSeamless: "सरकारी सेवाओं और सामुदायिक प्रबंधन का निर्बाध अनुभव करें",
    signUpNow: "अभी साइन अप करें",
    signIn: "साइन इन करें",
    availableServices: "उपलब्ध सेवाएं",
    documentServices: "दस्तावेज़ सेवाएं",
    documentServicesDesc: "आधार, पैन, ड्राइविंग लाइसेंस और अधिक के लिए आवेदन करें",
    businessManagement: "व्यापार प्रबंधन",
    businessManagementDesc: "अपने व्यापारिक उद्यम बनाएं और प्रबंधित करें",
    investmentTracking: "निवेश ट्रैकिंग",
    investmentTrackingDesc: "अपने निवेश और रिटर्न की निगरानी करें",
    newsUpdates: "समाचार और अपडेट",
    newsUpdatesDesc: "नवीनतम समाचार और घोषणाओं के साथ अपडेट रहें",
    weatherForecast: "मौसम पूर्वानुमान",
    weatherForecastDesc: "अपने क्षेत्र के लिए मौसम की स्थिति जांचें",
    supportChat: "सहायता चैट",
    supportChatDesc: "हमारी सहायता टीम से तत्काल सहायता प्राप्त करें",
    signInRequired: "साइन इन आवश्यक",
    signInToAccess: "पहुंचने के लिए साइन इन करें",
    accessService: "सेवा तक पहुंचें"
  },
  gu: {
    // Dashboard
    welcome: "પાછા આવકાર",
    dashboard: "ડેશબોર્ડ",
    hereIsHappening: "આજે તમારા પંચાયતમાં શું થઈ રહ્યું છે",
    totalCitizens: "કુલ નાગરિકો",
    activeServices: "સક્રિય સેવાઓ",
    documentRequests: "દસ્તાવેજ વિનંતીઓ",
    revenueGenerated: "ઉત્પન્ન આવક",
    businessProcess: "વ્યવસાયિક પ્રક્રિયા",
    businessOwner: "વ્યવસાયિક માલિક",
    createBusiness: "વ્યવસાય બનાવો",
    createBusinessDesc: "તમારો વ્યવસાય અને ફંડિંગ લક્ષ્ય નોંધાવો.",
    addPerformance: "પ્રદર્શન ઉમેરો",
    addPerformanceDesc: "ત્રૈમાસિક પ્રદર્શન અહેવાલો સબમિટ કરો.",
    trackInvestments: "નિવેશ ટ્રેક કરો",
    trackInvestmentsDesc: "નિવેશ અને ફંડિંગ પ્રગતિની નિરીક્ષણ કરો.",
    distributeProfits: "લાભ વિતરણ કરો",
    distributeProfitsDesc: "નિવેશકો સાથે લાભ શેર કરો.",
    myBusinesses: "મારા વ્યવસાયો",
    quickAccess: "ઝડપી પહોંચ",
    systemStatus: "સિસ્ટમ સ્થિતિ",
    allSystemsOperational: "બધા સિસ્ટમ કાર્યરત",
    lastUpdated: "છેલ્લું અપડેટ",
    uptime: "અપટાઇમ",
    operational: "કાર્યરત",
    readyToGetStarted: "શરૂ કરવા માટે તૈયાર?",
    accessAllServices: "એક જગ્યાએથી તમારી બધી સેવાઓને ઍક્સેસ કરો અને તમારા એકાઉન્ટનું સંચાલન કરો",
    goToDashboard: "ડેશબોર્ડ પર જાઓ",
    manageProfile: "પ્રોફાઇલ મેનેજ કરો",
    joinGramsevaToday: "આજે ગ્રામસેવામાં જોડાઓ!",
    experienceSeamless: "સરકારી સેવાઓ અને સમુદાયિક સંચાલનનો નિર્બાધ અનુભવ કરો",
    signUpNow: "હવે સાઇન અપ કરો",
    signIn: "સાઇન ઇન કરો",
    availableServices: "ઉપલબ્ધ સેવાઓ",
    documentServices: "દસ્તાવેજ સેવાઓ",
    documentServicesDesc: "આધાર, PAN, ડ્રાઇવિંગ લાઇસન્સ અને વધુ માટે અરજી કરો",
    businessManagement: "વ્યવસાયિક સંચાલન",
    businessManagementDesc: "તમારા વ્યવસાયિક ઉદ્યમો બનાવો અને સંચાલિત કરો",
    investmentTracking: "નિવેશ ટ્રેકિંગ",
    investmentTrackingDesc: "તમારા નિવેશો અને વળતરની નિરીક્ષણ કરો",
    newsUpdates: "સમાચાર અને અપડેટ્સ",
    newsUpdatesDesc: "નવીનતમ સમાચારો અને જાહેરાતો સાથે અપડેટ રહો",
    weatherForecast: "હવામાન પૂર્વાનુમાન",
    weatherForecastDesc: "તમારા વિસ્તાર માટે હવામાનની સ્થિતિ તપાસો",
    supportChat: "સહાયતા ચેટ",
    supportChatDesc: "અમારી સહાયતા ટીમ પાસેથી તાત્કાલિક સહાયતા મેળવો",
    signInRequired: "સાઇન ઇન જરૂરી",
    signInToAccess: "પહોંચવા માટે સાઇન ઇન કરો",
    accessService: "સેવા પહોંચો"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
