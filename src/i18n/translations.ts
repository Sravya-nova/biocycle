export type Language = 'en' | 'hi' | 'te' | 'es';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  navDashboard: string;
  navAddBatch: string;
  navRecommendation: string;
  navMonitor: string;
  navCalculator: string;
  navHistory: string;
  languageSelectLabel: string;

  // Measurement Plain Terms
  wetnessLabel: string;
  wetnessSimple: string;
  sournessLabel: string;
  sournessSimple: string;
  heatLabel: string;
  smellLabel: string;
  weightLabel: string;

  // Overview Plain Words
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

  // Recommendation Page
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

  // Telemetry Monitor Page
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

  // Impact Calculator Page
  impactTitle: string;
  impactSubtitle: string;
  assumptionsTitle: string;
  assumptionsSubtitle: string;
  disclaimerTitle: string;
  disclaimerBody: string;

  // Biological Methods Plain Descriptions
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
    appTagline: 'Turn Organic Waste into Fertilizer & Biogas',
    navDashboard: 'Home',
    navAddBatch: 'Log Waste',
    navRecommendation: 'Get Guidance',
    navMonitor: 'Daily Check',
    navCalculator: 'Savings & Output',
    navHistory: 'History',
    languageSelectLabel: 'Language / भाषा / తెలుగు',

    wetnessLabel: 'Wateriness / Wetness (%)',
    wetnessSimple: 'Is it dry, damp, or very wet?',
    sournessLabel: 'Sourness Level (pH)',
    sournessSimple: 'Is it very sour like lemon or normal?',
    heatLabel: 'Heat / Temperature (°C)',
    smellLabel: 'Smell / Odor',
    weightLabel: 'Weight (in Kilograms / kg)',

    dashboardTitle: 'Organic Waste Hub',
    dashboardSubtitle: 'Track your waste conversion into natural compost, biofertilizer, and clean biogas.',
    totalWasteLabel: 'Total Waste Handled',
    totalWasteDesc: 'Total organic waste collected',
    activeBatchesLabel: 'Active Fertilizer Piles',
    activeBatchesDesc: 'Currently breaking down',
    outputYieldLabel: 'Fertilizer & Gas Output',
    outputYieldDesc: 'Useful compost and liquid fertilizer',
    wasteDivertedLabel: 'Diverted from Landfill',
    wasteDivertedDesc: 'Prevented from rotting in dumps',
    carbonBenefitLabel: 'Clean Air Benefit',
    carbonBenefitDesc: 'Avoided greenhouse gas emissions',
    statusChartTitle: 'Current Status of All Piles',
    recentBatchesTitle: 'Recent Waste Entries',
    noBatchesMessage: 'No waste entries recorded yet! Click below to log your first waste pile.',
    addBatchBtn: 'Log Waste',
    getRecBtn: 'Get Guidance',

    addBatchTitle: 'Log Waste Entry',
    addBatchSubtitle: 'Enter details about your waste pile for instant biological recommendations.',
    chooseWasteType: 'What type of waste do you have? *',
    enterWeight: 'How heavy is it? (in Kilograms - kg) *',
    howWetQuestion: 'How wet is this waste? (%) *',
    isSourQuestion: 'How sour is this waste? (pH scale: 3 = sour like lemon, 7 = neutral water) *',
    whereFromQuestion: 'Where did this waste come from? *',
    dateLabel: 'Collection Date *',
    notesLabel: 'Any extra details or notes',
    submitBatchBtn: 'Save Entry & View Guidance',
    batchSuccessTitle: 'Waste Entry Saved Successfully!',

    recTitle: 'Biological Guidance',
    recSubtitle: 'Clear step-by-step guidance without complex scientific jargon',
    aiAssistantTitle: 'Simple Voice/Text Waste Assistant',
    aiAssistantSubtitle: 'Describe your waste in simple words, e.g. "Wet banana peels with kitchen scraps"',
    aiInputPlaceholder: 'Type in simple words... e.g. wet banana skins and vegetable leaves',
    aiAnalyzeBtn: 'Check Waste',
    aiTrySamples: 'Click to try quick examples:',
    aiCategoryLabel: '1. Waste Category',
    aiMoistureLabel: '2. Wetness / Moisture Level',
    aiProcessesLabel: '3. Best Natural Method',
    aiNeededInfoLabel: '4. Next Simple Actions',
    aiWarningsLabel: '5. Safety Precautions',
    aiManualVerification: 'Manual inspection needed. Please inspect waste pile in person.',
    aiTransferBtn: 'Use This In Recommendation Guide',
    simpleRuleTitle: 'Why Did We Recommend This Method?',
    simpleRuleSubtitle: 'Explained in clear simple rules',

    monitorTitle: 'Daily Heap Warmth & Wetness Check',
    monitorSubtitle: 'Check if your compost heap is heating up and decomposing properly',
    selectBatchPrompt: 'Select a pile to inspect:',
    currentStageLabel: 'Current Process Stage:',
    updateStageLabel: 'Update Stage:',
    logReadingBtn: "Log Today's Check",
    latestReadingTitle: 'Latest Inspection Results',
    tempChartTitle: 'Heat / Warmth Chart (°C)',
    phChartTitle: 'Sourness Chart (pH)',
    moistureChartTitle: 'Wateriness / Wetness Chart (%)',
    safetyNoticeTitle: 'Important Safety Reminder',
    safetyNoticeBody: 'When your compost is mature, test on a small potted plant first. Always test compost before widespread farm use.',

    impactTitle: 'Simple Fertilizer & Savings Calculator',
    impactSubtitle: 'See how much natural fertilizer and cooking gas your waste will produce',
    assumptionsTitle: 'Simple Calculation Factors',
    assumptionsSubtitle: 'Adjust multipliers to see estimated output yields',
    disclaimerTitle: 'Notice About Estimates',
    disclaimerBody: 'These numbers are educational estimates. Actual yields vary depending on weather and waste composition.',

    compostingName: 'Natural Rotting in Air (Composting)',
    compostingSimple: 'Mix wet food scraps with dry leaves in an open heap. Turn once a week for fresh air.',
    vermicompostingName: 'Earthworm Farming (Worm Compost)',
    vermicompostingSimple: 'Feed organic scraps to earthworms in a shaded bin to produce rich dark castings.',
    anaerobicName: 'Biogas Tank (Cooking Gas & Liquid Manure)',
    anaerobicSimple: 'Place manure or wet food scraps in a sealed tank to capture free cooking gas.',
    biofertilizerName: 'Liquid Bio-Tonic Fermentation',
    biofertilizerSimple: 'Soak organic waste in water to make a liquid plant growth booster.'
  },

  hi: {
    appName: 'बायो-साइकिल (BioCycle)',
    appTagline: 'कचरे से बनाएं मुफ्त जैविक खाद और बायोगैस',
    navDashboard: 'मुख्य पृष्ठ',
    navAddBatch: 'कचरा दर्ज करें',
    navRecommendation: 'सही सलाह',
    navMonitor: 'रोजाना जांच',
    navCalculator: 'बचत और खाद',
    navHistory: 'इतिहास',
    languageSelectLabel: 'भाषा चुनिए',

    wetnessLabel: 'नमी / गीलापन (%)',
    wetnessSimple: 'कचरा सूखा है, थोड़ा गीला है या बहुत गीला है?',
    sournessLabel: 'खट्टापन का स्तर (pH)',
    sournessSimple: 'क्या यह नींबू की तरह खट्टा है या सामान्य है?',
    heatLabel: 'गर्मी / तापमान (°C)',
    smellLabel: 'गंध / बदबू',
    weightLabel: 'वजन (किलोग्राम / kg में)',

    dashboardTitle: 'जैविक कचरा केंद्र',
    dashboardSubtitle: 'देखें आपने कितना कचरा प्राकृतिक खाद और रसोई गैस में बदला है।',
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
    addBatchBtn: 'कचरा दर्ज करें',
    getRecBtn: 'सही सलाह लें',

    addBatchTitle: 'कचरा दर्ज करें',
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
    navDashboard: 'ప్రధాన పేజీ',
    navAddBatch: 'చెత్త నమోదు',
    navRecommendation: 'ఉచిత మార్గదర్శి',
    navMonitor: 'రోజువారీ పరిశీలన',
    navCalculator: 'ఆదా & ఎరువులు',
    navHistory: 'చరిత్ర',
    languageSelectLabel: 'భాష ఎంచుకోండి',

    wetnessLabel: 'తేమ / నీటి శాతం (%)',
    wetnessSimple: 'చెత్త ఎండిపోయి ఉందా, కొద్దిగా తడిగా ఉందా లేక చాలా తడిగా ఉందా?',
    sournessLabel: 'పులుపు స్థాయి (pH)',
    sournessSimple: 'ఇది నిమ్మకాయలా పుల్లగా ఉందా లేక మామూలుగా ఉందా?',
    heatLabel: 'వేడి / ఉష్ణోగ్రత (°C)',
    smellLabel: 'వాసన / కంపు',
    weightLabel: 'బరువు (కిలోగ్రాములు / kg లో)',

    dashboardTitle: 'సేంద్రీయ వ్యర్థాల కేంద్రం',
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
    addBatchBtn: 'చెత్త నమోదు చేయండి',
    getRecBtn: 'సలహా పొందండి',

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
    navDashboard: 'Inicio',
    navAddBatch: 'Registrar Residuos',
    navRecommendation: 'Obtener Guía',
    navMonitor: 'Control Diario',
    navCalculator: 'Savings & Output',
    navHistory: 'Historial',
    languageSelectLabel: 'Idioma / Language',

    wetnessLabel: 'Nivel de Humedad (%)',
    wetnessSimple: '¿Está seco, húmedo o muy mojado?',
    sournessLabel: 'Nivel de Acidez (pH)',
    sournessSimple: '¿Es muy ácido como un limón o normal?',
    heatLabel: 'Calor / Temperatura (°C)',
    smellLabel: 'Olor / Aroma',
    weightLabel: 'Peso (en Kilogramos / kg)',

    dashboardTitle: 'Centro de Residuos Orgánicos',
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
    addBatchBtn: 'Registrar Residuos',
    getRecBtn: 'Obtener Guía',

    addBatchTitle: 'Registrar Residuos',
    addBatchSubtitle: 'Díganos qué residuo tiene y lo guiaremos paso a paso',
    chooseWasteType: '¿Qué tipo de residuo tiene? *',
    enterWeight: '¿Cuánto pesa? (en Kilogramos - kg) *',
    howWetQuestion: '¿Qué tan húmedo está este residuo? (%) *',
    isSourQuestion: '¿Qué tan ácido está este residuo? (Escala pH: 3 = ácido como limón, 7 = agua neutra) *',
    whereFromQuestion: '¿De dónde proviene este residuo? *',
    dateLabel: 'Fecha de Recolección *',
    notesLabel: 'Detalles adicionales o notas',
    submitBatchBtn: 'Guardar Entrada y Ver Guía',
    batchSuccessTitle: '¡Entrada de Residuos Guardada con Éxito!',

    recTitle: 'El Mejor Método para sus Residuos',
    recSubtitle: 'Guía clara paso a paso sin jerga científica compleja',
    aiAssistantTitle: 'Asistente de Residuos por Voz/Texto',
    aiAssistantSubtitle: 'Describa sus residuos en palabras simples, p. ej. "Cáscaras de plátano húmedas con restos de verdura"',
    aiInputPlaceholder: 'Escriba en palabras simples... p. ej. cáscaras de plátano húmedas',
    aiAnalyzeBtn: 'Analizar Residuos',
    aiTrySamples: 'Haga clic para probar ejemplos rápidos:',
    aiCategoryLabel: '1. Categoría de Residuos',
    aiMoistureLabel: '2. Nivel de Humedad',
    aiProcessesLabel: '3. Mejor Método Natural',
    aiNeededInfoLabel: '4. Próximas Acciones Simples',
    aiWarningsLabel: '5. Precauciones de Seguridad',
    aiManualVerification: 'Se requiere inspección manual. Por favor inspeccione la pila en persona.',
    aiTransferBtn: 'Usar esto en la Guía de Recomendaciones',
    simpleRuleTitle: '¿Por qué recomendamos este método?',
    simpleRuleSubtitle: 'Explicado con reglas claras y simples',

    monitorTitle: 'Control Diario de Calor y Humedad de la Pila',
    monitorSubtitle: 'Compruebe si su pila de compost se está calentando y descomponiendo correctamente',
    selectBatchPrompt: 'Seleccione una pila para inspeccionar:',
    currentStageLabel: 'Etapa Actual del Proceso:',
    updateStageLabel: 'Actualizar Etapa:',
    logReadingBtn: 'Registrar Inspección de Hoy',
    latestReadingTitle: 'Últimos Resultados de Inspección',
    tempChartTitle: 'Gráfico de Calor / Temperatura (°C)',
    phChartTitle: 'Gráfico de Acidez (pH)',
    moistureChartTitle: 'Gráfico de Humedad (%)',
    safetyNoticeTitle: 'Recordatorio Importante de Seguridad',
    safetyNoticeBody: 'Cuando su compost esté maduro, pruébelo primero en una planta pequeña en maceta. Pruebe siempre el compost antes de usarlo en el campo.',

    impactTitle: 'Calculadora de Fertilizante y Ahorro',
    impactSubtitle: 'Vea cuánto fertilizante natural y gas para cocinar producirán sus residuos',
    assumptionsTitle: 'Factores de Cálculo Simples',
    assumptionsSubtitle: 'Ajuste los multiplicadores para ver los rendimientos estimados',
    disclaimerTitle: 'Aviso Sobre las Estimaciones',
    disclaimerBody: 'Estos números son estimaciones educativas. Los rendimientos reales varían según el clima y la composición de los residuos.',

    compostingName: 'Descomposición Natural al Aire (Compostaje)',
    compostingSimple: 'Mezcle restos de comida húmedos con hojas secas en una pila abierta. Voltee una vez por semana.',
    vermicompostingName: 'Lombricultura (Compost de Lombriz)',
    vermicompostingSimple: 'Alimente a las lombrices con restos orgánicos en un contenedor a la sombra para obtener abono oscuro.',
    anaerobicName: 'Tanque de Biogás (Gas para Cocinar y Estiércol Líquido)',
    anaerobicSimple: 'Coloque estiércol o restos de comida en un tanque sellado para obtener gas gratis para cocinar.',
    biofertilizerName: 'Fermentación de Biofertilizante Líquido',
    biofertilizerSimple: 'Remoje residuos orgánicos en agua para hacer un tónico estimulante para las plantas.'
  }
};
