export type Language = 'en' | 'hi' | 'te' | 'es';

export interface TranslationDictionary {
  // Navigation & General
  appName: string;
  appTagline: string;
  navDashboard: string;
  navAddBatch: string;
  navRecommendation: string;
  navMonitor: string;
  navCalculator: string;
  navHistory: string;
  languageSelectLabel: string;
  
  // Simple Plain Language Terms
  wetnessLabel: string; // Moisture
  wetnessSimple: string; // How wet or dry is it?
  sournessLabel: string; // pH
  sournessSimple: string; // Is it sour or normal?
  heatLabel: string; // Temperature
  smellLabel: string; // Odor
  weightLabel: string; // Quantity in kg
  
  // Dashboard Plain Words
  dashboardTitle: string;
  dashboardSubtitle: string;
  totalWasteLabel: string;
  totalWasteDesc: string;
  activeBatchesLabel: string;
  activeBatchesDesc: string;
  outputYieldLabel: string;
  outputYieldDesc: string;
  wasteDivertedLabel: string;
  wasteDivertedDesc: string;
  carbonBenefitLabel: string;
  carbonBenefitDesc: string;
  statusChartTitle: string;
  recentBatchesTitle: string;
  noBatchesMessage: string;
  addBatchBtn: string;
  getRecBtn: string;

  // Add Batch Page
  addBatchTitle: string;
  addBatchSubtitle: string;
  chooseWasteType: string;
  enterWeight: string;
  howWetQuestion: string;
  isSourQuestion: string;
  whereFromQuestion: string;
  dateLabel: string;
  notesLabel: string;
  submitBatchBtn: string;
  batchSuccessTitle: string;

  // Recommendation Page & AI Assistant
  recTitle: string;
  recSubtitle: string;
  aiAssistantTitle: string;
  aiAssistantSubtitle: string;
  aiInputPlaceholder: string;
  aiAnalyzeBtn: string;
  aiTrySamples: string;
  aiCategoryLabel: string;
  aiMoistureLabel: string;
  aiProcessesLabel: string;
  aiNeededInfoLabel: string;
  aiWarningsLabel: string;
  aiManualVerification: string;
  aiTransferBtn: string;
  simpleRuleTitle: string;
  simpleRuleSubtitle: string;

  // Process Monitor
  monitorTitle: string;
  monitorSubtitle: string;
  selectBatchPrompt: string;
  currentStageLabel: string;
  updateStageLabel: string;
  logReadingBtn: string;
  latestReadingTitle: string;
  tempChartTitle: string;
  phChartTitle: string;
  moistureChartTitle: string;
  safetyNoticeTitle: string;
  safetyNoticeBody: string;

  // Impact Calculator
  impactTitle: string;
  impactSubtitle: string;
  assumptionsTitle: string;
  assumptionsSubtitle: string;
  disclaimerTitle: string;
  disclaimerBody: string;

  // Methods Plain Translation
  compostingName: string;
  compostingSimple: string;
  vermicompostingName: string;
  vermicompostingSimple: string;
  anaerobicName: string;
  anaerobicSimple: string;
  biofertilizerName: string;
  biofertilizerSimple: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'BioCycle',
    appTagline: 'Easy Organic Waste to Useful Fertilizer & Biogas',
    navDashboard: 'Home Dashboard',
    navAddBatch: 'Add Waste Food/Dung',
    navRecommendation: 'Smart Recommendation',
    navMonitor: 'Daily Heat & Wetness Check',
    navCalculator: 'Savings & Output Calculator',
    navHistory: 'Saved History',
    languageSelectLabel: 'Language / भाषा / తెలుగు',

    wetnessLabel: 'Wateriness / Wetness (%)',
    wetnessSimple: 'Is it dry, damp, or very wet?',
    sournessLabel: 'Sourness Level (pH)',
    sournessSimple: 'Is it very sour like lemon or normal?',
    heatLabel: 'Heat / Temperature (°C)',
    smellLabel: 'Smell / Odor',
    weightLabel: 'Weight (in Kilograms / kg)',

    dashboardTitle: 'Organic Waste Helper Dashboard',
    dashboardSubtitle: 'See how much waste you have converted into natural fertilizer and cooking gas',
    totalWasteLabel: 'Total Waste Handled',
    totalWasteDesc: 'Total organic waste collected',
    activeBatchesLabel: 'Active Fertilizer Piles',
    activeBatchesDesc: 'Currently rotting or breaking down',
    outputYieldLabel: 'Fertilizer & Gas Output',
    outputYieldDesc: 'Useful compost and liquid fertilizer',
    wasteDivertedLabel: 'Saved From Trash Dump',
    wasteDivertedDesc: 'Kept out of stinking landfills',
    carbonBenefitLabel: 'Clean Air Benefit',
    carbonBenefitDesc: 'Prevented dirty smoke and gases',
    statusChartTitle: 'Current Stage of All Batches',
    recentBatchesTitle: 'Your Recent Waste Entries',
    noBatchesMessage: 'No waste recorded yet! Click below to start converting your food scraps or cow dung.',
    addBatchBtn: 'Add Waste Entry Now',
    getRecBtn: 'Find Best Method',

    addBatchTitle: 'Log New Waste Entry',
    addBatchSubtitle: 'Tell us what waste you have, and we will guide you on how to make natural fertilizer',
    chooseWasteType: 'What kind of waste do you have? *',
    enterWeight: 'How heavy is it? (in Kilograms - kg) *',
    howWetQuestion: 'How wet is this waste? (%) *',
    isSourQuestion: 'How sour is this waste? (pH scale: 3 = acidic lemon, 7 = normal water) *',
    whereFromQuestion: 'Where did this waste come from? *',
    dateLabel: 'Collection Date *',
    notesLabel: 'Any extra notes or observations',
    submitBatchBtn: 'Save Entry & Show Recommendation',
    batchSuccessTitle: 'Waste Saved Successfully!',

    recTitle: 'Best Method for Your Waste',
    recSubtitle: 'Simple step-by-step guidance explained without complicated scientific terms',
    aiAssistantTitle: 'Easy Voice/Text Waste Assistant',
    aiAssistantSubtitle: 'Type in plain words like "wet banana peels and vegetable kitchen waste"',
    aiInputPlaceholder: 'Type what you have in simple words... e.g. wet banana peels and leaves',
    aiAnalyzeBtn: 'Check My Waste',
    aiTrySamples: 'Click to test sample examples:',
    aiCategoryLabel: '1. Waste Category',
    aiMoistureLabel: '2. How Wet / Dry It Is',
    aiProcessesLabel: '3. Best Ways to Treat It',
    aiNeededInfoLabel: '4. Simple Steps Needed Next',
    aiWarningsLabel: '5. Things to Watch Out For',
    aiManualVerification: 'Needs manual verification. Please check the waste with your eyes.',
    aiTransferBtn: 'Use This In Recommendation Guide',
    simpleRuleTitle: 'Why We Suggested This Method',
    simpleRuleSubtitle: 'Clear rules explained in simple words',

    monitorTitle: 'Daily Heap Warmth & Wetness Check',
    monitorSubtitle: 'Check if your waste heap is heating up correctly and breaking down well',
    selectBatchPrompt: 'Choose Waste Batch to Check:',
    currentStageLabel: 'Current Stage:',
    updateStageLabel: 'Change Stage:',
    logReadingBtn: 'Add Today\'s Check',
    latestReadingTitle: 'Latest Daily Check Result',
    tempChartTitle: 'Heat / Warmth Chart (°C)',
    phChartTitle: 'Sourness Chart (pH)',
    moistureChartTitle: 'Wetness Chart (%)',
    safetyNoticeTitle: 'Important Safety Notice',
    safetyNoticeBody: 'When your heap is ready, test a small amount on garden plants first. Do not sell or use large amounts on crops without testing.',

    impactTitle: 'Simple Savings & Output Estimator',
    impactSubtitle: 'See how much natural manure and cooking gas your waste will produce',
    assumptionsTitle: 'Simple Calculation Factors',
    assumptionsSubtitle: 'Adjust slider numbers to see changes in your estimated yield',
    disclaimerTitle: 'Notice About Estimates',
    disclaimerBody: 'These numbers are friendly estimates to help you understand your savings. Actual results may vary depending on local weather and waste mix.',

    compostingName: 'Natural Rotting in Air (Composting)',
    compostingSimple: 'Mix wet green food scraps with dry brown leaves in an open pile. Turn once a week.',
    vermicompostingName: 'Earthworm Farming (Worm Compost)',
    vermicompostingSimple: 'Feed waste to earthworms in a shaded box to make rich black worm manure.',
    anaerobicName: 'Biogas Tank (Cooking Gas & Liquid Manure)',
    anaerobicSimple: 'Seal wet food scraps or dung in an airtight tank to produce free gas for cooking.',
    biofertilizerName: 'Liquid Bio-Tonic Fermentation',
    biofertilizerSimple: 'Soak organic waste in water to make a liquid plant growth booster.'
  },

  hi: {
    appName: 'बायो-साइकिल (BioCycle)',
    appTagline: 'कचरे से बनाएं मुफ्त जैविक खाद और बायोगैस',
    navDashboard: 'मुख्य डैशबोर्ड',
    navAddBatch: 'कचरा/गोबर दर्ज करें',
    navRecommendation: 'सही तरीका जानें',
    navMonitor: 'रोजाना गर्मी और नमी जांच',
    navCalculator: 'बचत और खाद का हिसाब',
    navHistory: 'पुराना रिकॉर्ड',
    languageSelectLabel: 'भाषा चुनिए',

    wetnessLabel: 'नमी / गीलापन (%)',
    wetnessSimple: 'कचरा सूखा है, थोड़ा गीला है या बहुत गीला है?',
    sournessLabel: 'खट्टापन का स्तर (pH)',
    sournessSimple: 'क्या यह नींबू की तरह खट्टा है या सामान्य है?',
    heatLabel: 'गर्मी / तापमान (°C)',
    smellLabel: 'गंध / बदबू',
    weightLabel: 'वजन (किलोग्राम / kg में)',

    dashboardTitle: 'जैविक कचरा सहायता केंद्र',
    dashboardSubtitle: 'देखें आपने कितना कचरा प्राकृतिक खाद और रसोई गैस में बदला है',
    totalWasteLabel: 'कुल जमा कचरा',
    totalWasteDesc: 'अब तक इकट्ठा किया गया कचरा',
    activeBatchesLabel: 'चल रही खाद के ढेर',
    activeBatchesDesc: 'जो अभी गल और सड़ रहे हैं',
    outputYieldLabel: 'मिली खाद और गैस',
    outputYieldDesc: 'बनी हुई सूखी और तरल खाद',
    wasteDivertedLabel: 'कचरा ढेर से बचाए किलो',
    wasteDivertedDesc: 'बदबूदार लैंडफिल में जाने से बचाया',
    carbonBenefitLabel: 'साफ हवा का लाभ',
    carbonBenefitDesc: 'धुएं और जहरीली गैसों से बचाई हवा',
    statusChartTitle: 'सभी ढेरों की वर्तमान स्थिति',
    recentBatchesTitle: 'हाल ही में दर्ज किया गया कचरा',
    noBatchesMessage: 'अभी कोई कचरा दर्ज नहीं है! नीचे बटन दबाकर अपनी रसोई का कचरा या गोबर दर्ज करें।',
    addBatchBtn: 'नया कचरा दर्ज करें',
    getRecBtn: 'सबसे अच्छा तरीका जानें',

    addBatchTitle: 'नया कचरा दर्ज करें',
    addBatchSubtitle: 'हमें बताएं आपके पास क्या कचरा है, हम आपको आसान भाषा में खाद बनाना सिखाएंगे',
    chooseWasteType: 'आपके पास किस प्रकार का कचरा है? *',
    enterWeight: 'यह कितना भारी है? (किलोग्राम - kg में) *',
    howWetQuestion: 'यह कचरा कितना गीला है? (%) *',
    isSourQuestion: 'यह कचरा कितना खट्टा है? (pH पैमाना: 3 = नींबू जैसा खट्टा, 7 = सामान्य पानी) *',
    whereFromQuestion: 'यह कचरा कहाँ से मिला है? *',
    dateLabel: 'कचरा इकट्ठा करने की तारीख *',
    notesLabel: 'कोई अन्य बात या जानकारी',
    submitBatchBtn: 'सहेजें और सही तरीका देखें',
    batchSuccessTitle: 'कचरा सफलता से दर्ज हो गया!',

    recTitle: 'आपके कचरे के लिए सबसे बढ़िया तरीका',
    recSubtitle: 'बिना किसी कठिन वैज्ञानिक शब्दों के आसान भाषा में समझें',
    aiAssistantTitle: 'आसान आवाज/लिखकर कचरा सहायक',
    aiAssistantSubtitle: 'साधारण हिंदी में लिखें जैसे "केले के छिलके और गीली सब्जियां"',
    aiInputPlaceholder: 'आसान शब्दों में लिखें... जैसे गीले केले के छिलके और पत्ते',
    aiAnalyzeBtn: 'कचरा जांचें',
    aiTrySamples: 'नमूना उदाहरण देखने के लिए क्लिक करें:',
    aiCategoryLabel: '1. कचरे की श्रेणी',
    aiMoistureLabel: '2. गीलापन या सूखापन',
    aiProcessesLabel: '3. खाद बनाने का सबसे अच्छा तरीका',
    aiNeededInfoLabel: '4. आगे क्या करना जरूरी है',
    aiWarningsLabel: '5. ध्यान रखने योग्य सावधानियां',
    aiManualVerification: 'खुद आंखों से देखने की जरूरत है। कृपया कचरे को ध्यान से देखें।',
    aiTransferBtn: 'इसे खाद बनाने के तरीके में उपयोग करें',
    simpleRuleTitle: 'हमने यह तरीका क्यों सुझाया?',
    simpleRuleSubtitle: 'आसान नियमों से समझें',

    monitorTitle: 'रोजाना ढेर की गर्मी और नमी जांचें',
    monitorSubtitle: 'जांचें कि आपका खाद का ढेर सही से गर्म हो रहा है या नहीं',
    selectBatchPrompt: 'जांचने के लिए कचरा चुनें:',
    currentStageLabel: 'अभी की स्थिति:',
    updateStageLabel: 'स्थिति बदलें:',
    logReadingBtn: 'आज की जांच दर्ज करें',
    latestReadingTitle: 'अंतिम जांच का परिणाम',
    tempChartTitle: 'गर्मी का चार्ट (°C)',
    phChartTitle: 'खट्टापन चार्ट (pH)',
    moistureChartTitle: 'गीलापन चार्ट (%)',
    safetyNoticeTitle: 'महत्वपूर्ण सुरक्षा सलाह',
    safetyNoticeBody: 'जब आपकी खाद तैयार हो जाए, तो पहले थोड़े पौधे पर डालकर जांचें। खेतों में डालने से पहले जांच कर लें।',

    impactTitle: 'खाद और बचत का आसान हिसाब',
    impactSubtitle: 'जानें आपके कचरे से कितनी खाद और रसोई गैस बनेगी',
    assumptionsTitle: 'हिसाब के आसान नियम',
    assumptionsSubtitle: 'संख्या बदलकर अपनी खाद का अनुमान देखें',
    disclaimerTitle: 'अनुमान के बारे में जानकारी',
    disclaimerBody: 'ये संख्याएं आपकी मदद के लिए अनुमानित हैं। मौसम और कचरे के हिसाब से थोड़ा फर्क हो सकता है।',

    compostingName: 'हवा में सड़कर खाद बनना (कंपोस्टिंग)',
    compostingSimple: 'गीले भोजन को सूखे पत्तों के साथ खुले ढेर में मिलाएं। हफ्ते में एक बार पलटें।',
    vermicompostingName: 'केंचुआ खाद (वर्मीकंपोस्ट)',
    vermicompostingSimple: 'छायादार बक्से में केंचुओं को कचरा खिलाकर काली बढ़िया खाद बनाएं।',
    anaerobicName: 'बायोगैस टैंक (मुफ्त रसोई गैस और तरल खाद)',
    anaerobicSimple: 'गोबर या गीले कचरे को बंद टैंक में रखकर खाना पकाने की गैस बनाएं।',
    biofertilizerName: 'तरल जैविक खाद टॉनिक',
    biofertilizerSimple: 'कचरे को पानी में गलाकर पौधों के लिए ताकतवर घोल बनाएं।'
  },

  te: {
    appName: 'బయో-సైకిల్ (BioCycle)',
    appTagline: 'చెత్త నుండి ఉచితంగా ఎరువు మరియు బయోగాస్ తయారు చేసుకోండి',
    navDashboard: 'ముఖ్య డాష్‌బోర్డ్',
    navAddBatch: 'చెత్త/పేడ నమోదు చేయండి',
    navRecommendation: 'మంచి పద్ధతి తెలుసుకోండి',
    navMonitor: 'రోజువారీ వేడి & తేమ పరిశీలన',
    navCalculator: 'ఆదా & ఎరువుల లెక్కింపు',
    navHistory: 'పాత రికార్డులు',
    languageSelectLabel: 'భాష ఎంచుకోండి',

    wetnessLabel: 'తేమ / నీటి శాతం (%)',
    wetnessSimple: 'చెత్త ఎండిపోయి ఉందా, కొద్దిగా తడిగా ఉందా లేక చాలా తడిగా ఉందా?',
    sournessLabel: 'పులుపు స్థాయి (pH)',
    sournessSimple: 'ఇది నిమ్మకాయలా పుల్లగా ఉందా లేక మామూలుగా ఉందా?',
    heatLabel: 'వేడి / ఉష్ణోగ్రత (°C)',
    smellLabel: 'వాసన / కంపు',
    weightLabel: 'బరువు (కిలోగ్రాములు / kg లో)',

    dashboardTitle: 'సేంద్రీయ వ్యర్థాల సహాయ కేంద్రం',
    dashboardSubtitle: 'మీరు ఎంత చెత్తను ఎరువుగా మరియు వంట గ్యాస్‌గా మార్చారో చూడండి',
    totalWasteLabel: 'మొత్తం సేకరించిన వ్యర్థాలు',
    totalWasteDesc: 'ఇప్పటి వరకు జమ చేసిన చెత్త',
    activeBatchesLabel: 'తయారవుతున్న ఎరువు కుప్పలు',
    activeBatchesDesc: 'ప్రస్తుతం కుళ్ళుతున్న వ్యర్థాలు',
    outputYieldLabel: 'వచ్చిన ఎరువు & గ్యాస్',
    outputYieldDesc: 'తయారైన పొడి మరియు ద్రవ ఎరువు',
    wasteDivertedLabel: 'చెత్త కుప్పల నుండి కాపాడిన కిలోలు',
    wasteDivertedDesc: 'దుర్వాసన చల్లే ప్రాంతాలకు పోకుండా కాపాడినది',
    carbonBenefitLabel: 'పరిశుభ్రమైన గాలి ప్రయోజనం',
    carbonBenefitDesc: 'విషవాయువులు రాకుండా కాపాడిన గాలి',
    statusChartTitle: 'అన్ని కుప్పల ప్రస్తుత స్థితి',
    recentBatchesTitle: 'ఇటీవల నమోదు చేసిన వ్యర్థాలు',
    noBatchesMessage: 'ఇంకా ఎలాంటి వ్యర్థాలు నమోదు చేయలేదు! మీ కూరగాయల తొక్కులు లేదా పేడను నమోదు చేయడానికి కింద క్లిక్ చేయండి.',
    addBatchBtn: 'కొత్త వ్యర్థాన్ని నమోదు చేయండి',
    getRecBtn: 'మంచి పద్ధతి తెలుసుకోండి',

    addBatchTitle: 'కొత్త వ్యర్థాలను నమోదు చేయండి',
    addBatchSubtitle: 'మీ వద్ద ఎలాంటి చెత్త ఉందో చెప్పండి, ఎరువు ఎలా తయారు చేయాలో సులభంగా వివరిస్తాం',
    chooseWasteType: 'మీ వద్ద ఎలాంటి చెత్త ఉంది? *',
    enterWeight: 'ఇది ఎంత బరువు ఉంది? (కిలోలలో - kg) *',
    howWetQuestion: 'ఈ చెత్త ఎంత తడిగా ఉంది? (%) *',
    isSourQuestion: 'ఈ చెత్త ఎంత పుల్లగా ఉంది? (pH కొలత: 3 = నిమ్మకాయ పులుపు, 7 = మంచి నీరు) *',
    whereFromQuestion: 'ఈ చెత్త ఎక్కడి నుండి వచ్చింది? *',
    dateLabel: 'సేకరించిన తేదీ *',
    notesLabel: 'ఏదైనా ఇతర సమాచారం',
    submitBatchBtn: 'భద్రపరచు మరియు సలహా చూడు',
    batchSuccessTitle: 'వ్యర్థాలు విజయవంతంగా నమోదయ్యాయి!',

    recTitle: 'మీ చెత్తకు అత్యుత్తమ పద్ధతి',
    recSubtitle: 'కష్టమైన సైన్స్ పదాలు లేకుండా తేలికైన భాషలో అర్థం చేసుకోండి',
    aiAssistantTitle: 'సులభమైన వాయిస్/టెక్స్ట్ చెత్త సహాయకుడు',
    aiAssistantSubtitle: 'సాధారణ మాటల్లో రాయండి... ఉదాహరణకి "అరటి తొక్కులు మరియు కూరగాయ వ్యర్థాలు"',
    aiInputPlaceholder: 'సులభమైన మాటల్లో రాయండి... ఉదా: తడి అరటి తొక్కులు మరియు ఆకులు',
    aiAnalyzeBtn: 'చెత్తను పరిశీలించు',
    aiTrySamples: 'ఉదాహరణలు చూడటానికి క్లిక్ చేయండి:',
    aiCategoryLabel: '1. వ్యర్థాల రకం',
    aiMoistureLabel: '2. ఎంత తడిగా ఉంది',
    aiProcessesLabel: '3. ఎరువు తయారు చేయడానికి మంచి దారి',
    aiNeededInfoLabel: '4. తర్వాత చేయాల్సిన సులభమైన పనులు',
    aiWarningsLabel: '5. తీసుకోవాల్సిన జాగ్రత్తలు',
    aiManualVerification: 'సొంతంగా కళ్ళతో చూడటం అవసరం. దయచేసి చెత్తను పరిశీలించండి.',
    aiTransferBtn: 'దీనిని ఎరువుల మార్గదర్శిలో ఉపయోగించు',
    simpleRuleTitle: 'మేము ఈ పద్ధతిని ఎందుకు సూచించాము?',
    simpleRuleSubtitle: 'సులభమైన నియమాలతో తెలుసుకోండి',

    monitorTitle: 'రోజువారీ వేడి & తేమ పరిశీలన',
    monitorSubtitle: 'మీ ఎరువు కుప్ప సరిగ్గా వేడెక్కి కుళ్ళుతోందో లేదో చూడండి',
    selectBatchPrompt: 'పరిశీలించడానికి కుప్పను ఎంచుకోండి:',
    currentStageLabel: 'ప్రస్తుత దశ:',
    updateStageLabel: 'దశను మార్చండి:',
    logReadingBtn: 'నేటి పరిశీలనను నమోదు చేయి',
    latestReadingTitle: 'చివరి పరిశీలన ఫలితం',
    tempChartTitle: 'వేడి / ఉష్ణోగ్రత చార్ట్ (°C)',
    phChartTitle: 'పులుపు చార్ట్ (pH)',
    moistureChartTitle: 'తేమ / నీటి చార్ట్ (%)',
    safetyNoticeTitle: 'ముఖ్యమైన భద్రతా సూచన',
    safetyNoticeBody: 'మీ ఎరువు సిద్ధమైనప్పుడు, ముందుగా కొద్దిపాటి మొక్కలపై వేసి చూడండి. పొలాల్లో వేసే ముందు పరీక్షించండి.',

    impactTitle: 'ఎరువు & పొదుపు లెక్కింపు',
    impactSubtitle: 'మీ చెత్త నుండి ఎంత ఎరువు మరియు వంట గ్యాస్ వస్తుందో తెలుసుకోండి',
    assumptionsTitle: 'లెక్కింపు నియమాలు',
    assumptionsSubtitle: 'సంఖ్యలను మార్చి మీ ఎరువు అంచనాను చూడండి',
    disclaimerTitle: 'అంచనాల గురించి సమాచారం',
    disclaimerBody: 'ఈ సంఖ్యలు మీ అవగాహన కోసం ఇచ్చిన అంచనాలు మాత్రమే. వాతావరణాన్ని బట్టి కొద్దిగా మారవచ్చు.',

    compostingName: 'గాలిలో సహజంగా కుళ్ళడం (కాంపౌండింగ్)',
    compostingSimple: 'తడి ఆహారాన్ని ఎండుటాకులతో కలిపి బయట కుప్పగా వేయండి. వారానికి ఒకసారి కలపండి.',
    vermicompostingName: 'వానపాముల ఎరువు (వర్మీకాంపౌండ్)',
    vermicompostingSimple: 'నీడ ఉన్న పెట్టెలో వానపాములకు చెత్తను మేతగా వేసి నల్లటి నల్లమందు లాంటి ఎరువు పొందండి.',
    anaerobicName: 'బయోగాస్ ట్యాంక్ (వంట గ్యాస్ & ద్రవ ఎరువు)',
    anaerobicSimple: 'పేడ లేదా తడి చెత్తను గాలి చొరబడని ట్యాంక్‌లో ఉంచి ఉచిత వంట గ్యాస్ పొందండి.',
    biofertilizerName: 'ద్రవ జీవన ఎరువు (లిక్విడ్ టానిక్)',
    biofertilizerSimple: 'చెత్తను నీటిలో నానబెట్టి మొక్కలకు బలమైన ద్రవ ఎరువును తయారు చేయండి.'
  },

  es: {
    appName: 'BioCycle',
    appTagline: 'Convierte residuos orgánicos en abono y biogás fácil',
    navDashboard: 'Panel Principal',
    navAddBatch: 'Agregar Residuos',
    navRecommendation: 'Recomendación Inteligente',
    navMonitor: 'Control Diario de Humedad y Calor',
    navCalculator: 'Calculadora de Ahorro',
    navHistory: 'Historial Guardado',
    languageSelectLabel: 'Idioma / Language',

    wetnessLabel: 'Nivel de Humedad (%)',
    wetnessSimple: '¿Está seco, húmedo o muy mojado?',
    sournessLabel: 'Nivel de Acidez (pH)',
    sournessSimple: '¿Es muy ácido como un limón o normal?',
    heatLabel: 'Calor / Temperatura (°C)',
    smellLabel: 'Olor / Aroma',
    weightLabel: 'Peso (en Kilogramos / kg)',

    dashboardTitle: 'Panel de Ayuda para Residuos Orgánicos',
    dashboardSubtitle: 'Vea cuánto residuo ha convertido en fertilizante natural y gas para cocinar',
    totalWasteLabel: 'Total de Residuos',
    totalWasteDesc: 'Total de residuos orgánicos recolectados',
    activeBatchesLabel: 'Pilas de Fertilizante Activas',
    activeBatchesDesc: 'En proceso de descomposición',
    outputYieldLabel: 'Producción de Fertilizante y Gas',
    outputYieldDesc: 'Compost útil y fertilizante líquido',
    wasteDivertedLabel: 'Salvado del Basurero',
    wasteDivertedDesc: 'Evitado que vaya al vertedero',
    carbonBenefitLabel: 'Beneficio de Aire Limpio',
    carbonBenefitDesc: 'Previene humos y gases nocivos',
    statusChartTitle: 'Estado Actual de los Lotes',
    recentBatchesTitle: 'Sus Entradas Recientes',
    noBatchesMessage: '¡No hay residuos registrados aún! Haga clic abajo para comenzar.',
    addBatchBtn: 'Agregar Nuevo Registro',
    getRecBtn: 'Buscar Mejor Método',

    addBatchTitle: 'Registrar Nuevo Residuo',
    addBatchSubtitle: 'Díganos qué residuos tiene y le guiaremos para hacer fertilizante natural',
    chooseWasteType: '¿Qué tipo de residuo tiene? *',
    enterWeight: '¿Cuánto pesa? (en Kilogramos - kg) *',
    howWetQuestion: '¿Qué tan húmedo está este residuo? (%) *',
    isSourQuestion: '¿Qué tan ácido es? (pH: 3 = limón ácido, 7 = agua normal) *',
    whereFromQuestion: '¿De dónde proviene este residuo? *',
    dateLabel: 'Fecha de Recolección *',
    notesLabel: 'Notas o observaciones adicionales',
    submitBatchBtn: 'Guardar y Ver Recomendación',
    batchSuccessTitle: '¡Residuo Guardado Exitosamente!',

    recTitle: 'El Mejor Método para sus Residuos',
    recSubtitle: 'Guía paso a paso explicada sin términos científicos complicados',
    aiAssistantTitle: 'Asistente de Residuos Fácil',
    aiAssistantSubtitle: 'Escriba con palabras sencillas como "cáscaras de plátano húmedas"',
    aiInputPlaceholder: 'Escriba lo que tiene en palabras sencillas...',
    aiAnalyzeBtn: 'Analizar Residuo',
    aiTrySamples: 'Haga clic para probar ejemplos:',
    aiCategoryLabel: '1. Categoría de Residuo',
    aiMoistureLabel: '2. Nivel de Humedad',
    aiProcessesLabel: '3. Mejores Formas de Tratarse',
    aiNeededInfoLabel: '4. Pasos Siguientes Necesarios',
    aiWarningsLabel: '5. Precauciones a Tener en Cuenta',
    aiManualVerification: 'Requiere verificación manual. Por favor revise el residuo visualmente.',
    aiTransferBtn: 'Usar Esto en la Guía de Recomendaciones',
    simpleRuleTitle: '¿Por qué sugerimos este método?',
    simpleRuleSubtitle: 'Reglas claras explicadas en palabras sencillas',

    monitorTitle: 'Control Diario de Calor y Humedad',
    monitorSubtitle: 'Verifique si su pila de residuos se calienta correctamente',
    selectBatchPrompt: 'Elija la Pila a Verificar:',
    currentStageLabel: 'Etapa Actual:',
    updateStageLabel: 'Cambiar Etapa:',
    logReadingBtn: 'Agregar Control de Hoy',
    latestReadingTitle: 'Resultado del Último Control',
    tempChartTitle: 'Gráfico de Calor (°C)',
    phChartTitle: 'Gráfico de Acidez (pH)',
    moistureChartTitle: 'Gráfico de Humedad (%)',
    safetyNoticeTitle: 'Aviso Importante de Seguridad',
    safetyNoticeBody: 'Cuando su abono esté listo, pruébelo primero en unas pocas plantas antes de usarlo en cultivos grandes.',

    impactTitle: 'Estimador de Ahorro y Producción',
    impactSubtitle: 'Conozca cuánto abono natural y gas producirán sus residuos',
    assumptionsTitle: 'Factores de Cálculo Simples',
    assumptionsSubtitle: 'Ajuste los números para ver cambios en la producción estimada',
    disclaimerTitle: 'Nota Sobre las Estimaciones',
    disclaimerBody: 'Estos números son estimaciones educativas para ayudarle a entender sus ahorros.',

    compostingName: 'Descomposición Natural al Aire (Compostaje)',
    compostingSimple: 'Mezcle restos de comida con hojas secas en una pila abierta. Voltee una vez por semana.',
    vermicompostingName: 'Lombricultura (Compost de Lombriz)',
    vermicompostingSimple: 'Alimente a las lombrices en una caja a la sombra para hacer abono negro y rico.',
    anaerobicName: 'Tanque de Biogás (Gas para Cocinar y Abono Líquido)',
    anaerobicSimple: 'Selle restos de comida o estiércol en un tanque hermético para producir gas gratis.',
    biofertilizerName: 'Bio-Tónico Líquido',
    biofertilizerSimple: 'Remoje residuos orgánicos en agua para hacer un estimulante líquido para plantas.'
  }
};
