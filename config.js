(function () {
  if (typeof window === 'undefined') return;
  window.NVC = window.NVC || {};
  NVC.Config = NVC.Config || {};

  // Google Sheets configuration (moved from script.js)
  NVC.Config.GOOGLE_SHEETS_CONFIG = NVC.Config.GOOGLE_SHEETS_CONFIG || {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbyQPr-7kJsrPqKEJRrMx-CIyjOhSWkqTiYTpSbXBjlkDotbUXTyxntPdFxbkhY0xWbsew/exec', 
    API_KEY: 'nvc2026secretkey',
    ENABLED: true,
    USE_CORS_PROXY: false,
    MAX_RETRIES: 2,
    RETRY_DELAY: 1000,
    TIMEOUT: 15000
  };

  // AI Gateway: set this to your secure server-side gateway that calls Gemini.
  // Example: '/.netlify/functions/gemini' or 'https://api.myserver.example/ai/gemini'
  NVC.Config.AI_GATEWAY_URL = NVC.Config.AI_GATEWAY_URL || '';

  // UI theme default
  NVC.Config.currentTheme = NVC.Config.currentTheme || 'light';

  // Ministries & Provinces list (moved from script.js)
  NVC.Config.MINISTRIES = NVC.Config.MINISTRIES || [
    "प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय", "अर्थ मन्त्रालय", "उद्योग, वाणिज्य तथा आपूर्ति मन्त्रालय",
            "ऊर्जा, जलस्रोत तथा सिंचाइ मन्त्रालय", "कानून, न्याय तथा संसदीय मामिला मन्त्रालय", "कृषि, वन तथा पर्यावरण मन्त्रालय",
            "खानेपानी मन्त्रालय", "गृह मन्त्रालय", "परराष्ट्र मन्त्रालय", "पूर्वाधार विकास मन्त्रालय", 
            "भूमि व्यवस्था, सहकारी, सङ्घीय मामिला तथा सामान्य प्रशासन मन्त्रालय",
            "महिला, बालबालिका, लैङ्गिक तथा यौनिक अल्पसङ्ख्यक र सामाजिक सुरक्षा मन्त्रालय", "युवा, श्रम तथा रोजगार मन्त्रालय",
            "रक्षा मन्त्रालय", "विज्ञान प्रविधि तथा नवप्रवर्तन मन्त्रालय", "शिक्षा तथा खेलकुद मन्त्रालय", "सूचना तथा सञ्चार मन्त्रालय",
            "संस्कृति, पर्यटन तथा नागरिक उड्डयन मन्त्रालय", "स्वास्थ्य तथा खाद्य स्वच्छता मन्त्रालय", "संवैधानिक अङ्ग", 
            "कोशी प्रदेश", "मधेस प्रदेश", "बागमती प्रदेश", "गण्डकी प्रदेश", "लुम्बिनी प्रदेश", "कर्णाली प्रदेश", "सुदूर पश्चिम प्रदेश"
  ];

})();
