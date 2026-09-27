import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export const LANGUAGE_OPTIONS = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'हिन्दी' },
  { code: 'MR', label: 'मराठी' },
  { code: 'TA', label: 'தமிழ்' },
  { code: 'TE', label: 'తెలుగు' },
  { code: 'BN', label: 'বাংলা' },
];

const translations = {
  HI: {
    Overview: 'अवलोकन', Watchlist: 'निगरानी सूची', Projects: 'परियोजनाएँ',
    'Early Warnings': 'प्रारंभिक चेतावनी', Analytics: 'विश्लेषण',
    Intelligence: 'बुद्धिमत्ता', 'Data Update': 'डेटा अपडेट',
    Home: 'होम', 'Portfolio Analytics': 'पोर्टफोलियो विश्लेषण',
    'Good morning, Aarav': 'सुप्रभात, आरव',
    "Here's what's happening across India's infrastructure portfolio.": 'भारत की अवसंरचना परियोजनाओं की ताज़ा स्थिति यहाँ देखें।',
    'Informed infrastructure. A more resilient India.': 'सूचित अवसंरचना। एक सशक्त भारत।',
    'Deeper insights for stronger decisions.': 'बेहतर निर्णयों के लिए गहन अंतर्दृष्टि।',
    'Priority Watchlist': 'प्राथमिकता निगरानी सूची',
    'Which projects need attention now?': 'किन परियोजनाओं पर अभी ध्यान देना चाहिए?',
    "Real-time signals from across India's infrastructure portfolio.": 'भारत की अवसंरचना परियोजनाओं के रीयल-टाइम संकेत।',
    'Intelligence Console': 'इंटेलिजेंस कंसोल', 'Ask. Analyze. Act.': 'पूछें। विश्लेषण करें। कार्य करें।',
    "Keep India's infrastructure intelligence current.": 'भारत की अवसंरचना जानकारी को अद्यतन रखें।',
    'Upload, validate and process the latest ministry reports, state data and project updates.': 'नवीनतम मंत्रालय रिपोर्ट, राज्य डेटा और परियोजना अपडेट अपलोड करें, सत्यापित करें और संसाधित करें।',
    "Get evidence-grounded insights from India's infrastructure data to understand what's happening and what to do next.": 'भारत के अवसंरचना डेटा से प्रमाण-आधारित जानकारी प्राप्त करें और जानें कि क्या हो रहा है तथा आगे क्या करना है।',
    'Reporting Cycle': 'रिपोर्टिंग चक्र',
    'From data to foresight, for a more resilient India.': 'डेटा से दूरदृष्टि तक, एक सशक्त भारत के लिए।',
    'Early signals. Timely action. A more resilient India.': 'समय पर संकेत। समय पर कार्रवाई। एक सशक्त भारत।',
    'Better data. Stronger decisions. A more resilient India.': 'बेहतर डेटा। सशक्त निर्णय। एक सशक्त भारत।',
    'Early signals.': 'समय पर संकेत।', 'Timely action.': 'समय पर कार्रवाई।',
    'Better questions.': 'बेहतर प्रश्न।', 'Stronger decisions.': 'सशक्त निर्णय।',
    'Better data.': 'बेहतर डेटा।', 'A more resilient': 'अधिक सशक्त', 'India.': 'भारत।',
    'A more resilient India.': 'एक सशक्त भारत।',
  },
  MR: {
    Overview: 'आढावा', Watchlist: 'प्राधान्य यादी', Projects: 'प्रकल्प',
    'Early Warnings': 'पूर्वसूचना', Analytics: 'विश्लेषण', Intelligence: 'माहिती',
    'Data Update': 'डेटा अद्यतन', Home: 'मुख्यपृष्ठ',
    'Portfolio Analytics': 'पोर्टफोलिओ विश्लेषण',
    'Good morning, Aarav': 'शुभ सकाळ, आरव',
    "Here's what's happening across India's infrastructure portfolio.": 'भारताच्या पायाभूत सुविधा प्रकल्पांची ताजी स्थिती येथे पहा.',
    'Informed infrastructure. A more resilient India.': 'माहितीपूर्ण पायाभूत सुविधा. सक्षम भारत.',
    'Deeper insights for stronger decisions.': 'अधिक सक्षम निर्णयांसाठी सखोल माहिती.',
    'Priority Watchlist': 'प्राधान्य प्रकल्प यादी',
    'Which projects need attention now?': 'कोणत्या प्रकल्पांकडे त्वरित लक्ष देणे आवश्यक आहे?',
    "Real-time signals from across India's infrastructure portfolio.": 'भारताच्या पायाभूत सुविधा प्रकल्पांमधील रिअल-टाइम संकेत.',
    'Intelligence Console': 'माहिती कक्ष', 'Ask. Analyze. Act.': 'विचारा. विश्लेषण करा. कृती करा.',
    "Keep India's infrastructure intelligence current.": 'भारताच्या पायाभूत सुविधांची माहिती अद्ययावत ठेवा.',
    'Upload, validate and process the latest ministry reports, state data and project updates.': 'नवीनतम मंत्रालय अहवाल, राज्य डेटा आणि प्रकल्प अद्यतने अपलोड करा, तपासा आणि प्रक्रिया करा.',
    "Get evidence-grounded insights from India's infrastructure data to understand what's happening and what to do next.": 'भारताच्या पायाभूत सुविधा डेटावर आधारित माहिती मिळवा आणि पुढील कृती समजून घ्या.',
    'Reporting Cycle': 'अहवाल चक्र',
    'From data to foresight, for a more resilient India.': 'डेटापासून दूरदृष्टीपर्यंत, सक्षम भारतासाठी.',
    'Early signals. Timely action. A more resilient India.': 'वेळीच संकेत. वेळेवर कृती. सक्षम भारत.',
    'Better data. Stronger decisions. A more resilient India.': 'उत्तम डेटा. सक्षम निर्णय. सक्षम भारत.',
    'Early signals.': 'वेळीच संकेत.', 'Timely action.': 'वेळेवर कृती.',
    'Better questions.': 'अधिक चांगले प्रश्न.', 'Stronger decisions.': 'अधिक सक्षम निर्णय.',
    'Better data.': 'उत्तम डेटा.', 'A more resilient': 'अधिक सक्षम', 'India.': 'भारत.',
    'A more resilient India.': 'सक्षम भारत.',
  },
  TA: {
    Overview: 'கண்ணோட்டம்', Watchlist: 'கண்காணிப்பு பட்டியல்', Projects: 'திட்டங்கள்',
    'Early Warnings': 'முன்னெச்சரிக்கைகள்', Analytics: 'பகுப்பாய்வு',
    Intelligence: 'நுண்ணறிவு', 'Data Update': 'தரவு புதுப்பிப்பு', Home: 'முகப்பு',
    'Portfolio Analytics': 'திட்டத் தொகுப்பு பகுப்பாய்வு',
    'Good morning, Aarav': 'காலை வணக்கம், ஆரவ்',
    "Here's what's happening across India's infrastructure portfolio.": 'இந்தியாவின் உள்கட்டமைப்புத் திட்டங்களின் தற்போதைய நிலையைப் பாருங்கள்.',
    'Informed infrastructure. A more resilient India.': 'தகவலறிந்த உள்கட்டமைப்பு. வலிமையான இந்தியா.',
    'Deeper insights for stronger decisions.': 'சிறந்த முடிவுகளுக்கான ஆழமான நுண்ணறிவு.',
    'Priority Watchlist': 'முன்னுரிமை கண்காணிப்பு பட்டியல்',
    'Which projects need attention now?': 'எந்தத் திட்டங்களுக்கு இப்போது கவனம் தேவை?',
    "Real-time signals from across India's infrastructure portfolio.": 'இந்தியாவின் உள்கட்டமைப்புத் திட்டங்களின் நிகழ்நேர அறிகுறிகள்.',
    'Intelligence Console': 'நுண்ணறிவு மையம்', 'Ask. Analyze. Act.': 'கேளுங்கள். பகுப்பாய்வு செய்யுங்கள். செயல்படுங்கள்.',
    "Keep India's infrastructure intelligence current.": 'இந்திய உள்கட்டமைப்புத் தகவலைப் புதுப்பித்த நிலையில் வைத்திருங்கள்.',
    'Upload, validate and process the latest ministry reports, state data and project updates.': 'சமீபத்திய அமைச்சக அறிக்கைகள், மாநிலத் தரவு மற்றும் திட்டப் புதுப்பிப்புகளைப் பதிவேற்றி சரிபார்த்து செயலாக்குங்கள்.',
    "Get evidence-grounded insights from India's infrastructure data to understand what's happening and what to do next.": 'இந்திய உள்கட்டமைப்புத் தரவிலிருந்து ஆதார அடிப்படையிலான நுண்ணறிவைப் பெற்று அடுத்த நடவடிக்கையை அறியுங்கள்.',
    'Reporting Cycle': 'அறிக்கை காலம்',
    'From data to foresight, for a more resilient India.': 'தரவிலிருந்து தொலைநோக்குப் பார்வைக்கு, வலிமையான இந்தியாவுக்காக.',
    'Early signals. Timely action. A more resilient India.': 'முன்னறிகுறிகள். சரியான நேரச் செயல்பாடு. வலிமையான இந்தியா.',
    'Better data. Stronger decisions. A more resilient India.': 'சிறந்த தரவு. வலுவான முடிவுகள். வலிமையான இந்தியா.',
    'Early signals.': 'முன்னறிகுறிகள்.', 'Timely action.': 'சரியான நேரச் செயல்பாடு.',
    'Better questions.': 'சிறந்த கேள்விகள்.', 'Stronger decisions.': 'வலுவான முடிவுகள்.',
    'Better data.': 'சிறந்த தரவு.', 'A more resilient': 'மேலும் வலிமையான', 'India.': 'இந்தியா.',
    'A more resilient India.': 'வலிமையான இந்தியா.',
  },
  TE: {
    Overview: 'అవలోకనం', Watchlist: 'పర్యవేక్షణ జాబితా', Projects: 'ప్రాజెక్టులు',
    'Early Warnings': 'ముందస్తు హెచ్చరికలు', Analytics: 'విశ్లేషణలు',
    Intelligence: 'ఇంటెలిజెన్స్', 'Data Update': 'డేటా నవీకరణ', Home: 'హోమ్',
    'Portfolio Analytics': 'పోర్ట్‌ఫోలియో విశ్లేషణ',
    'Good morning, Aarav': 'శుభోదయం, ఆరవ్',
    "Here's what's happening across India's infrastructure portfolio.": 'భారత మౌలిక సదుపాయాల ప్రాజెక్టుల తాజా స్థితిని చూడండి.',
    'Informed infrastructure. A more resilient India.': 'సమాచారంతో కూడిన మౌలిక సదుపాయాలు. బలమైన భారతదేశం.',
    'Deeper insights for stronger decisions.': 'మెరుగైన నిర్ణయాల కోసం లోతైన అవగాహన.',
    'Priority Watchlist': 'ప్రాధాన్యత పర్యవేక్షణ జాబితా',
    'Which projects need attention now?': 'ఏ ప్రాజెక్టులకు ఇప్పుడు శ్రద్ధ అవసరం?',
    "Real-time signals from across India's infrastructure portfolio.": 'భారత మౌలిక సదుపాయాల ప్రాజెక్టుల రియల్-టైమ్ సంకేతాలు.',
    'Intelligence Console': 'ఇంటెలిజెన్స్ కన్సోల్', 'Ask. Analyze. Act.': 'అడగండి. విశ్లేషించండి. చర్య తీసుకోండి.',
    "Keep India's infrastructure intelligence current.": 'భారత మౌలిక సదుపాయాల సమాచారాన్ని తాజాగా ఉంచండి.',
    'Upload, validate and process the latest ministry reports, state data and project updates.': 'తాజా మంత్రిత్వ శాఖ నివేదికలు, రాష్ట్ర డేటా, ప్రాజెక్ట్ నవీకరణలను అప్‌లోడ్ చేసి ధృవీకరించి ప్రాసెస్ చేయండి.',
    "Get evidence-grounded insights from India's infrastructure data to understand what's happening and what to do next.": 'భారత మౌలిక సదుపాయాల డేటా ఆధారంగా విశ్లేషణ పొంది తదుపరి చర్యను తెలుసుకోండి.',
    'Reporting Cycle': 'నివేదిక చక్రం',
    'From data to foresight, for a more resilient India.': 'డేటా నుంచి దూరదృష్టికి, బలమైన భారతదేశం కోసం.',
    'Early signals. Timely action. A more resilient India.': 'ముందస్తు సంకేతాలు. సకాలంలో చర్య. బలమైన భారతదేశం.',
    'Better data. Stronger decisions. A more resilient India.': 'మెరుగైన డేటా. బలమైన నిర్ణయాలు. బలమైన భారతదేశం.',
    'Early signals.': 'ముందస్తు సంకేతాలు.', 'Timely action.': 'సకాలంలో చర్య.',
    'Better questions.': 'మెరుగైన ప్రశ్నలు.', 'Stronger decisions.': 'బలమైన నిర్ణయాలు.',
    'Better data.': 'మెరుగైన డేటా.', 'A more resilient': 'మరింత బలమైన', 'India.': 'భారతదేశం.',
    'A more resilient India.': 'బలమైన భారతదేశం.',
  },
  BN: {
    Overview: 'সংক্ষিপ্ত বিবরণ', Watchlist: 'নজরদারি তালিকা', Projects: 'প্রকল্প',
    'Early Warnings': 'আগাম সতর্কতা', Analytics: 'বিশ্লেষণ', Intelligence: 'বুদ্ধিমত্তা',
    'Data Update': 'ডেটা আপডেট', Home: 'হোম',
    'Portfolio Analytics': 'পোর্টফোলিও বিশ্লেষণ',
    'Good morning, Aarav': 'সুপ্রভাত, আরব',
    "Here's what's happening across India's infrastructure portfolio.": 'ভারতের পরিকাঠামো প্রকল্পগুলির বর্তমান অবস্থা দেখুন।',
    'Informed infrastructure. A more resilient India.': 'তথ্যসমৃদ্ধ পরিকাঠামো। আরও স্থিতিশীল ভারত।',
    'Deeper insights for stronger decisions.': 'আরও দৃঢ় সিদ্ধান্তের জন্য গভীর অন্তর্দৃষ্টি।',
    'Priority Watchlist': 'অগ্রাধিকার নজরদারি তালিকা',
    'Which projects need attention now?': 'কোন প্রকল্পগুলিতে এখন নজর দেওয়া প্রয়োজন?',
    "Real-time signals from across India's infrastructure portfolio.": 'ভারতের পরিকাঠামো প্রকল্পগুলির রিয়েল-টাইম সংকেত।',
    'Intelligence Console': 'ইন্টেলিজেন্স কনসোল', 'Ask. Analyze. Act.': 'জিজ্ঞাসা করুন। বিশ্লেষণ করুন। পদক্ষেপ নিন।',
    "Keep India's infrastructure intelligence current.": 'ভারতের পরিকাঠামো সংক্রান্ত তথ্য হালনাগাদ রাখুন।',
    'Upload, validate and process the latest ministry reports, state data and project updates.': 'সাম্প্রতিক মন্ত্রক প্রতিবেদন, রাজ্য তথ্য ও প্রকল্পের আপডেট আপলোড, যাচাই ও প্রক্রিয়া করুন।',
    "Get evidence-grounded insights from India's infrastructure data to understand what's happening and what to do next.": 'ভারতের পরিকাঠামো তথ্য থেকে প্রমাণভিত্তিক অন্তর্দৃষ্টি নিয়ে পরিস্থিতি ও পরবর্তী পদক্ষেপ বুঝুন।',
    'Reporting Cycle': 'রিপোর্টিং চক্র',
    'From data to foresight, for a more resilient India.': 'তথ্য থেকে দূরদৃষ্টি, আরও স্থিতিশীল ভারতের জন্য।',
    'Early signals. Timely action. A more resilient India.': 'আগাম সংকেত। সময়মতো পদক্ষেপ। আরও স্থিতিশীল ভারত।',
    'Better data. Stronger decisions. A more resilient India.': 'উন্নত তথ্য। দৃঢ় সিদ্ধান্ত। আরও স্থিতিশীল ভারত।',
    'Early signals.': 'আগাম সংকেত।', 'Timely action.': 'সময়মতো পদক্ষেপ।',
    'Better questions.': 'আরও ভালো প্রশ্ন।', 'Stronger decisions.': 'দৃঢ় সিদ্ধান্ত।',
    'Better data.': 'উন্নত তথ্য।', 'A more resilient': 'আরও স্থিতিশীল', 'India.': 'ভারত।',
    'A more resilient India.': 'আরও স্থিতিশীল ভারত।',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = window.localStorage.getItem('pragati-language');
      return LANGUAGE_OPTIONS.some(({ code }) => code === saved) ? saved : 'EN';
    } catch {
      return 'EN';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    try {
      window.localStorage.setItem('pragati-language', language);
    } catch {
      // Language still works for this session when storage is unavailable.
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (text) => translations[language]?.[text] || text,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}