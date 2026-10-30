import { GradeLevel, Language } from '../types';
import { GRADE_10_MATH_CHAPTERS, GRADE_10_PHYSICS_CHAPTERS } from './grade10TextbookChapters';

export interface LabExperiment {
  id: string;
  title: Record<Language, string>;
  objective: Record<Language, string>;
  apparatus: string[];
  reagents?: string[];
  procedure: Record<Language, string>[];
  safetyPrecautions: Record<Language, string>;
  observationNotes: Record<Language, string>;
  diagramSvgType: 'pendulum' | 'titration' | 'optics_prism' | 'microscope' | 'circuit' | 'electrolysis' | 'kinematics_trolley';
}

export interface TextbookExample {
  id: string;
  exampleNumber: string;
  problemStatement: Record<Language, string>;
  given: string[];
  formula: string;
  calculationSteps: Record<Language, string>[];
  finalAnswer: Record<Language, string>;
  pedagogicalNote: Record<Language, string>;
}

export interface TextbookActivity {
  id: string;
  activityNumber: string;
  title: Record<Language, string>;
  instruction: Record<Language, string>;
  groupTask: Record<Language, string>;
  criticalThinkingQuestion: Record<Language, string>;
}

export interface TextbookExercise {
  id: string;
  exerciseNumber: string;
  type: 'multiple_choice' | 'workout' | 'conceptual';
  question: Record<Language, string>;
  options?: string[];
  correctAnswer: Record<Language, string>;
  stepByStepSolution: Record<Language, string>[];
}

export interface TextbookChapter {
  unitNumber: number;
  title: Record<Language, string>;
  startPage: number;
  endPage: number;
  theoryContent: Record<Language, string>;
  examples: TextbookExample[];
  activities: TextbookActivity[];
  experiments: LabExperiment[];
  reviewExercises: TextbookExercise[];
  supplementaryNote: Record<Language, string>;
}

export interface TextbookRecord {
  id: string;
  grade: GradeLevel;
  subjectCode: string;
  subjectName: Record<Language, string>;
  title: Record<Language, string>;
  category: 'official_textbook' | 'supplementary_guide' | 'lab_manual' | 'exam_bank';
  coverColor: 'emerald' | 'amber' | 'indigo' | 'purple' | 'cyan' | 'rose' | 'blue';
  totalPages: number;
  pdfUrl: string;
  firebaseStoragePath: string;
  firebaseDownloadUrl: string;
  fileSizeBytes: number;
  md5Checksum: string;
  syncStatus: 'synced' | 'pending' | 'local_cached';
  chaptersCount: number;
  chapters: TextbookChapter[];
  drmProtected: boolean;
}

// -------------------------------------------------------------
// Sample STEM Laboratory Experiments with SVG Visualization
// -------------------------------------------------------------
export const SAMPLE_LAB_EXPERIMENTS: Record<string, LabExperiment> = {
  kinematics: {
    id: 'lab-p-kinematics',
    title: {
      am: 'የላቦራቶሪ ሙከራ 2.1፡ የቲከር ታይመር እና የተዳፋት ገበታ እንቅስቃሴ',
      om: 'Qormaata Laabooratoorii 2.1: Ticker Timer fi Sochii Tolfamaa',
      ti: 'ናይ ላቦራቶሪ ፈተነ 2.1፡ ቲከር ታይመርን ዳገትን',
      ar: 'تجربة مختبرية 2.1: دراسة حركة العربة على مسار مائل بجهاز توقيت النبضات',
      so: 'Tijaabada Shaybaarka 2.1: Dhaqdhaqaaqa gaariga ee sagxada qaloocan',
      en: 'Laboratory Experiment 2.1: Uniform Acceleration on an Inclined Plane Using a Ticker-Timer',
    },
    objective: {
      am: 'አንድ ተሽከርካሪ ጋሪ ከተዳፋት ገበታ ሲወርድ ያለውን ቋሚ ፍጥንጥነት በቲከር ቴፕ ነጥቦች መለካት።',
      om: 'Saffisiisa gaarii tolfamaa irraa bu\'uu safaruu.',
      ti: 'ናይ ዓረብያ ቅልጣፈ ምዕቃን።',
      ar: 'قياس التسارع المنتظم لعربة تنزلق على سطح مائل باستخدام شريط تسجيل النبضات الكهربائي.',
      so: 'Cabirka dardargelinta gaariga ku socda jidka qaloocan.',
      en: 'Determine uniform acceleration of a dynamics trolley on an inclined ramp via periodic spark-dot traces.',
    },
    apparatus: [
      'Ticker timer (50 Hz vibrator with carbon disc)',
      'Ticker tape roll (calibrated in mm)',
      'Dynamics trolley with low-friction wheels',
      'Inclined track (1.5 m linear wooden/aluminum ramp)',
      '12V AC power supply with banana lead connectors',
      'Stopwatch & 1-meter ruler calibrated in millimeters',
    ],
    procedure: [
      {
        am: '1. የቲከር ታይመሩን ከተዳፋቱ የላይኛው ጫፍ ላይ በክላምፕ አጥብቀህ እሰር።',
        om: '1. Ticker timer sana fiixee tolfamaa irratti hidhi.',
        ti: '1. ነቲ ቲከር ታይመር ኣብቲ ናይ ላዕሊ ጫፍ ዳገት ኣሲርካ ኣጽንዓዮ።',
        ar: '1. ثبّت جهاز توقيت النبضات بإحكام عند أعلى طرف السطح المائل.',
        so: '1. Ku dheji ticker timer-ka dusha sare ee sagxada qaloocan.',
        en: '1. Clamp the ticker-timer securely to the elevated end of the linear ramp.',
      },
      {
        am: '2. የቲከር ቴፑን በካርቦን ወረቀቱ ስር አሳልፈህ ከተሽከርካሪው ጋሪ ጀርባ ጋር በፕላስተር ለጥፍ።',
        om: '2. Waraqaa teepii sana gaarii duubatti qabsiisi.',
        ti: '2. ነቲ ቴፕ ብድሕሪት እቲ ዓረብያ ለጥፎ።',
        ar: '2. مرر الشريط الورقي أسفل قرص الكربون والصقه بالطرف الخلفي للعربة.',
        so: '2. Ku dheji cajaladda qoraalka qaybta dambe ee gaariga.',
        en: '2. Thread the paper tape through the guides beneath the carbon disc and attach to trolley.',
      },
      {
        am: '3. የ12 ቮልት ጅረት በመልቀቅ ታይመሩን አስጀምርና ጋሪው በነፃነት እንዲወርድ ልቀቀው።',
        om: '3. Humna ibsaa banteen booda gaarii sana gadhiisi.',
        ti: '3. ሓይሊ መብራህቲ ድሕሪ ምኽፋትካ ነቲ ዓረብያ ልቐቖ።',
        ar: '3. شغّل مزود الطاقة بجهد 12 فولت متناوب واترك العربة تنزلق بحرية.',
        so: '3. Daara korontada 12V oo sii daa gaariga.',
        en: '3. Switch on the AC power supply (50 dots/s) and release the trolley simultaneously.',
      },
    ],
    safetyPrecautions: {
      am: 'የደህንነት ጥንቃቄ፡ የኤሌክትሪክ ሽቦዎች ከእርጥበት የጸዱ መሆናቸውን አረጋግጡ፤ ጋሪው እንዳይወድቅ ከታች ስፖንጅ አስቀምጡ።',
      om: 'Of-eeggannoo: Ibsaa to\'adhaa; gaariin akka hin kufne sponjii kaa\'aa.',
      ti: 'ጥንቃቐ፡ መከላኸሊ ስፖንጅ ግበር።',
      ar: 'احتياطات السلامة: تجنب ملامسة الأسلاك المكشوفة، وضع وسادة ماصة للصدمات عند نهاية المسار.',
      so: 'Digniin: Iska ilaali korontada oo dhig barkin jilicsan meesha gaarigu ku istaago.',
      en: 'Safety: Ensure low-voltage 12V AC operation and place an impact buffer sponge at the ramp base.',
    },
    observationNotes: {
      am: 'ማስታወሻ፡ በቴፑ ላይ በነጥቦቹ መካከል ያለው ርቀት እየጨመረ መሄዱ ጋሪው በፍጥንጥነት እንደሚጓዝ ያረጋግጣል።',
      om: 'Hubachiisa: Fageenyi tuqaalee yoo dabalu saffisiisni akka jiru agarsiisa.',
      ti: 'መዘኻኸሪ፡ ኣብ ሞንጎ እቶም ነጥብታት ዘሎ ርሕቐት እናወሰኸ ምኻዱ ቅልጣፈ የረድእ።',
      ar: 'ملاحظة: تزايد المسافة بين النقاط المتتابعة على الشريط يثبت تسارع العربة بانتظام.',
      so: 'Xusuusin: Kala fogaanshaha dhibcuhu wuxuu caddaynayaa dardargelinta.',
      en: 'Data Analysis: Increasing displacement between consecutive dot pairs confirms uniform acceleration.',
    },
    diagramSvgType: 'kinematics_trolley',
  },

  titration: {
    id: 'lab-c-titration',
    title: {
      am: 'የላቦራቶሪ ሙከራ 3.1፡ የአሲድና ቤዝ ማመጣጠን ሙከራ (HCl and NaOH Titration)',
      om: 'Qormaata Laabooratoorii 3.1: Titration Asidii fi Beezii',
      ti: 'ናይ ላቦራቶሪ ፈተነ 3.1፡ ኣሲድን ቤዝን ምምጥጣን',
      ar: 'تجربة مختبرية 3.1: المعايرة الحجمية بين حمض HCl وهيدروكسيد الصوديوم NaOH',
      so: 'Tijaabada Shaybaarka 3.1: Is-dheellitirka Aashitada iyo Salka (Titration)',
      en: 'Laboratory Experiment 3.1: Quantitative Neutralization Titration of Strong Acid with Strong Base',
    },
    objective: {
      am: 'ያልታወቀ የሃይድሮክሎሪክ አሲድ (HCl) ሙሌትን በስታንዳርድ የሶዲየም ሃይድሮክሳይድ (0.1 M NaOH) እና በፌኖልፍታሊን ጠቋሚ መለካት።',
      om: 'Konsentireeshiinii HCl qormaata Titration tiin beekuu.',
      ti: 'ናይ HCl መጠን ብታይትሬሽን ምፍላጥ።',
      ar: 'تحديد التركيز المجهول لحمض الهيدروكلوريك باستخدام محلول قياسي من NaOH ودليل الفينولفثالين.',
      so: 'Xisaabinta uruursanaanta HCl iyadoo la isticmaalayo xalka NaOH.',
      en: 'Determine the molarity of an unknown HCl solution by volumetric titration against standardized 0.10 M NaOH.',
    },
    apparatus: [
      '50 mL Borosilicate glass burette with PTFE stopcock',
      '25 mL Volumetric pipette and safety rubber suction bulb',
      '250 mL Conical flasks (Erlenmeyer flasks - 3 units)',
      'Retort stand and burette clamp',
      'Wash bottle with distilled deionized water',
      'White ceramic tile for endpoint contrast observation',
    ],
    reagents: [
      'Standardized 0.100 M Sodium Hydroxide (NaOH) solution',
      'Hydrochloric acid (HCl) sample of unknown concentration',
      'Phenolphthalein indicator solution (1% in ethanol)',
    ],
    procedure: [
      {
        am: '1. ቢዩሬቱን በ 0.1 M NaOH አጥበህ እስከ 0.00 mL ድረስ ሙላው፤ የአየር አረፋ አለመኖሩን አረጋግጥ።',
        om: '1. Burette NaOH tiin guuti.',
        ti: '1. ነቲ ቢዩሬት ብ 0.1 M NaOH ምልኣዮ።',
        ar: '1. املأ السحاحة بمحلول 0.1 مولار NaOH وتأكد من خلو طرفها من الفقاعات.',
        so: '1. Ka buuxi burette-ka xalka NaOH.',
        en: '1. Rinse and fill the 50 mL burette with 0.100 M NaOH solution, purging any air bubbles.',
      },
      {
        am: '2. በፒፔት 20.0 mL ያልታወቀውን HCl ለክተህ ወደ ፍላስኩ ጨምር፤ 3 ጠብታ ፌኖልፍታሊን ጠብ አድርግበት።',
        om: '2. 20 mL HCl gara flask tii naqi.',
        ti: '2. 20 mL HCl ናብቲ ፍላስክ ኣእቱ።',
        ar: '2. اسحب 20 مل من حمض HCl وأضف نقطتين من دليل الفينولفثالين.',
        so: '2. Ku shub 20 mL oo HCl ah dhalada koorta ah.',
        en: '2. Pipette 20.00 mL of unknown HCl into the conical flask and add 2–3 drops of phenolphthalein.',
      },
      {
        am: '3. ፍላስኩን እያወዛወዝክ NaOH በጠብታ መልቀቅ ጀምር፤ ፈዛዛ ሮዝ ቀለም ለ 30 ሰከንድ ሲቆይ ወዲያውዝጋ።',
        om: '3. Hangaa bifti diimaa ifaan mul\'atutti daddabalii.',
        ti: '3. ሕብሪ ሮዝ ክሳብ ዝመጽእ ቀስ ኢልካ ምድባል ቀጽል።',
        ar: '3. عاير بإضافة القاعدة قطرة قطرة حتى يظهر لون وردي باهت وثابت.',
        so: '3. Ku dar NaOH tartiib tartiib ilaa midab casaan khafiif ahi ka soo baxo.',
        en: '3. Titrate dropwise with swirling until the first permanent faint pink endpoint persists for 30 seconds.',
      },
    ],
    safetyPrecautions: {
      am: 'የደህንነት ጥንቃቄ፡ የላብ ጋዋንና የዓይን መነፅር መልበስ ግዴታ ነው፤ አሲድ ወይም ቤዝ ቆዳ ላይ ቢፈስ በብዙ ውሃ መታጠብ አለበት።',
      om: 'Of-eeggannoo: Qoricha ijaa fi huccuu laabooratoorii uffadhaa.',
      ti: 'ጥንቃቐ፡ ናይ ላቦራቶሪ ክዳንን መነጸርን ግበር።',
      ar: 'احتياطات السلامة: ارتدِ نظارات الوقاية ومعطف المختبر، واغسل الجلد فوراً بالماء الجاري.',
      so: 'Digniin: Xidho muraayadaha badbaadada iyo jaakada shaybaarka.',
      en: 'Safety: Wear protective splash goggles and lab apron; flush skin contact immediately with cold water.',
    },
    observationNotes: {
      am: 'የመጨረሻ ነጥብ ላይ የተጨመረው NaOH መጠን 24.2 mL ነው። ስሌት፡ M_acid = (0.1 × 24.2) / 20.0 = 0.121 M።',
      om: 'M_acid = 0.121 M.',
      ti: 'M_acid = 0.121 M.',
      ar: 'بيانات الرصد: حجم القاعدة المستهلك 24.2 مل. تركيز الحمض المحسوب = 0.121 مولار.',
      so: 'Xisaab: Uruursanaanta HCl waa 0.121 M.',
      en: 'Data: Titre volume V = 24.2 mL. Calculated HCl concentration = (0.100 M × 24.2 mL) / 20.0 mL = 0.121 mol/L.',
    },
    diagramSvgType: 'titration',
  },

  photosynthesis: {
    id: 'lab-b-photosynthesis',
    title: {
      am: 'የላቦራቶሪ ሙከራ 2.1፡ በኤሎዲያ የውሃ ተክል ላይ የፎቶሲንተሲስ ፍጥነት እና የኦክስጅን አረፋዎች ሙከራ',
      om: 'Qormaata Laabooratoorii 2.1: Saffisa Footoosinteesisii Biqila Bishaan Elodea',
      ti: 'ናይ ላቦራቶሪ ፈተነ 2.1፡ ናይ ፎቶሲንተሲስ ፍጥነት ፈተነ',
      ar: 'تجربة مختبرية 2.1: قياس معدل التمثيل الضوئي لنبات الإلوديا المائي بدلالة انبعاث فقاعات الأكسجين',
      so: 'Tijaabada Shaybaarka 2.1: Cabirka xawaaraha cuntaysiga dhirta biyaha ee Elodea',
      en: 'Laboratory Experiment 2.1: Investigating Photosynthetic Rate and O₂ Evolution in Elodea Under Varying Light',
    },
    objective: {
      am: 'የብርሃን ምንጭ ርቀትን በመቀያየር በደቂቃ የሚወጡትን የኦክስጅን አረፋዎች (O₂ bubbles) በመቁጠር የፎቶሲንተሲስ ፍጥነትን መለካት።',
      om: 'Fageenya ifaa jijjiiruun saffisa footoosinteesisii hoombocoo oksijiinii lakkaa\'uun beekuu.',
      ti: 'ናይ ኦክስጅን ፊኛታት ብምቑጻር ናይ ፎቶሲንተሲስ ፍጥነት ምዕቃን።',
      ar: 'إثبات تأثير شدة الإضاءة على سرعة التمثيل الضوئي من خلال إحصاء عدد فقاعات غاز الأكسجين المنبعثة في الدقيقة.',
      so: 'Tirinta xumbooyinka oksijiinta si loo cabbiro xawaaraha cuntaysiga dhirta.',
      en: 'Quantify photosynthetic rate by counting oxygen gas bubbles evolved per minute as a function of light intensity.',
    },
    apparatus: [
      'Fresh healthy sprigs of Elodea canadensis (Waterweed)',
      '1000 mL Glass beaker with 0.2% sodium bicarbonate solution',
      'Glass funnel and inverted collection test tube',
      'Adjustable LED desk lamp (100W equivalent daylight source)',
      'Meter rule and digital laboratory timer',
    ],
    procedure: [
      {
        am: '1. የኤሎዲያውን ግንድ በሰያፍ ቆርጣችሁ በፈንጠዝያው ስር አስገብታችሁ በቤከሩ ውሃ ውስጥ አስቀምጡት።',
        om: '1. Biqila Elodea bishaan keessa kaa\'aa.',
        ti: '1. ነቲ ተኽሊ ኣብቲ ማይ ውሽጢ ኣእትዉዎ።',
        ar: '1. اقطع ساق نبات الإلوديا بميل وثبته مقلوباً تحت القمع الزجاجي داخل مخبار الماء.',
        so: '1. Geli geedka Elodea dhalada biyaha leh.',
        en: '1. Cut stem diagonally and submerge Elodea inverted under the funnel in 0.2% NaHCO₃ solution.',
      },
      {
        am: '2. መብራቱን በ 10 ሴ.ሜ ርቀት ላይ አድርጋችሁ በ 1 ደቂቃ የሚወጡትን አረፋዎች ቁጠሩ።',
        om: '2. Ifaa dhiyeessuun hoombocoo oksijiinii lakkaa\'aa.',
        ti: '2. መብራህቲ ኣቕሪብኩም ነቶም ፊኛታት ቑጸርዎም።',
        ar: '2. ضع مصدر الضوء على بعد 10 سم وعد الفقاعات المتصاعدة في دقيقة واحدة.',
        so: '2. Dhig iftiinka masaafada 10cm oo tiri xumbooyinka soo baxaya.',
        en: '2. Position lamp at 10 cm and record bubbles evolved per minute.',
      },
    ],
    safetyPrecautions: {
      am: 'የደህንነት ጥንቃቄ፡ የብርሃን አምፑሉ ሙቀት የውሃውን ሙቀት እንዳይቀይረው የውሃ መከላከያ ተጠቀሙ።',
      om: 'Of-eeggannoo: Ho\'i ifaa akka bishaan hin hoo\'isne to\'adhaa.',
      ti: 'ጥንቃቐ፡ ሙቐት ናይቲ ማይ ከይውስኽ ተጠንቀቕ።',
      ar: 'احتياطات السلامة: ضع حاجزاً زجاجياً مائياً بين المصباح والمخبار لامتصاص الحرارة الزائدة.',
      so: 'Digniin: Iska ilaali kuleylka iftiinka inuu kululeeyo biyaha.',
      en: 'Safety: Use a heat-sink glass water shield between lamp and beaker.',
    },
    observationNotes: {
      am: 'መረጃ ትንታኔ፡ መብራቱ ሲቀርብ የአረፋዎች ብዛት ይጨምራል፤ በተወሰነ ርቀት ላይ ግን የፎቶሲንተሲስ ጣሪያ (Light Saturation) ይደርሳል።',
      om: 'Ifni yoo dhiyaatu hoombocoon ni baay\'ata.',
      ti: 'ብርሃን ምስ ዝቐርብ ፊኛታት ይበዝሑ።',
      ar: 'ملاحظة: يتناسب معدل انبعاث الأكسجين طردياً مع شدة الإضاءة حتى الوصول لنقطة تشبع الضوء.',
      so: 'Marka iftiinku soo dhawaado, xumbooyinku way kordhaan.',
      en: 'Results demonstrate direct proportionality with illuminance followed by plateau at RuBisCO CO₂ saturation.',
    },
    diagramSvgType: 'optics_prism',
  },
};

// -------------------------------------------------------------
// HELPER TO CONSTRUCT COMPREHENSIVE CHAPTERS FOR EACH SUBJECT
// -------------------------------------------------------------
function buildChaptersForSubject(
  subjectCode: string,
  grade: GradeLevel
): TextbookChapter[] {
  if (subjectCode === 'MATH' && grade === 10) {
    return GRADE_10_MATH_CHAPTERS;
  }
  if (subjectCode === 'PHYS' && grade === 10) {
    return GRADE_10_PHYSICS_CHAPTERS;
  }

  if (subjectCode === 'PHYS') {
    return [
      {
        unitNumber: 1,
        title: {
          am: 'ምዕራፍ 1፡ ፊዚክስ እና ማህበረሰብ (Physics and Human Society)',
          om: 'Boqonnaa 1: Fiiziksii fi Hawaasa (Physics and Society)',
          ti: 'ምዕራፍ 1፡ ፊዚክስን ማሕበረሰብን',
          ar: 'الوحدة 1: الفيزياء والمجتمع الإنساني',
          so: 'Cutubka 1: Fiisigiska iyo Bulshada',
          en: 'Unit 1: Physics and Human Society',
        },
        startPage: 1,
        endPage: 32,
        theoryContent: {
          am: 'ፊዚክስ የተፈጥሮ ህጎችን፣ የቁስ አካላትን ባህሪ፣ ሃይልንና እንቅስቃሴን የሚያጠና መሰረታዊ ሳይንስ ነው። በኢትዮጵያ ታላቁ የህዳሴ ግድብ የኤሌክትሪክ ሃይል ማመንጨት፣ የንፋስ ሃይል (አዳማ ንፋስ ሃይል) እና የኢትዮጵያ ስፔስ ሳይንስ ቴክኖሎጂ ኢንስቲትዩት የሳተላይት መረጃዎች የፊዚክስ ቀጥተኛ ውጤቶች ናቸው።',
          om: 'Fiiziksiin saayinsii uumamaa waa\'ee wantootaa, anniisaa fi sochii qoratudha. Hidha Haaromsaa Guddicha Itoophiyaa fakkeenya guddaadha.',
          ti: 'ፊዚክስ ናይ ተፈጥሮ ሕግታት ዘጽንዕ መሰረታዊ ሳይንስ እዩ።',
          ar: 'الفيزياء هي العلم الأساسي الذي يبحث في المادة والطاقة وقوانين الطبيعة وتطبيقاتها في السدود وتوليد الطاقة المتجددة في إثيوبيا.',
          so: 'Fiisigisku waa sayniska dabiiciga ah ee daraaseeya maaddada, tamarta, iyo dhaqdhaqaaqa.',
          en: 'Physics is the foundational natural science investigating matter, energy, space, and time, underpinning renewable energy and satellite communications in Ethiopia.',
        },
        examples: [
          {
            id: 'ex-p-1.1',
            exampleNumber: 'ምሳሌ 1.1 (Dimensional Analysis)',
            problemStatement: {
              am: 'የጉልበት (Energy) እና የስራ (Work) የመለኪያ አሃድ ጆውል (J) በመሰረታዊ የ SI አሃዶች (kg, m, s) ሲገለጽ ምን እንደሚመስል አሳይ።',
              om: 'Safartuu anniisaa Joule gara kg, m, fi s tti jijjiiri.',
              ti: 'ናይ ጆውል መለክዒ ብ kg, m, s ግለጽ።',
              ar: 'عبر عن وحدة قياس الشغل والطاقة (الجول J) بدلالة الوحدات الأساسية للنظام الدولي (كجم، متر، ثانية).',
              so: 'U beddel halbeegga Joule unugyada aasaasiga ah ee SI.',
              en: 'Express the derived unit of work and energy (Joule) in terms of base SI units (kg, m, s).',
            },
            given: ['Work W = Force × Distance', 'Force F = mass × acceleration'],
            formula: '1 J = 1 N · m = (1 kg · m/s²) · m = 1 kg·m²/s²',
            calculationSteps: [
              {
                am: 'ደረጃ 1፡ የኃይል አሃድ ኒውተን N = kg · m/s² ነው።',
                om: 'Tarkaanfii 1: N = kg · m/s².',
                ti: 'ደረጃ 1፡ N = kg · m/s²።',
                ar: 'الخطوة 1: القوة = الكتلة × التسارع، إذن نيوتن = كجم · م / ث².',
                so: 'Tallaabada 1: N = kg · m/s².',
                en: 'Step 1: Base SI breakdown for force: 1 N = 1 kg·m·s⁻².',
              },
              {
                am: 'ደረጃ 2፡ ስራ W = F · d ስለሆነ፣ 1 J = (kg · m/s²) · m = kg · m² · s⁻²።',
                om: 'Tarkaanfii 2: 1 J = kg · m² · s⁻².',
                ti: 'ደረጃ 2፡ 1 J = kg · m² · s⁻²።',
                ar: 'الخطوة 2: الشغل = القوة × المسافة، إذن 1 جول = كجم · م² / ث².',
                so: 'Tallaabada 2: 1 J = kg · m² · s⁻².',
                en: 'Step 2: Multiply by linear displacement: 1 J = 1 kg·m²·s⁻².',
              },
            ],
            finalAnswer: {
              am: '1 ጆውል (J) = 1 kg · m² · s⁻²',
              om: '1 J = 1 kg · m² · s⁻²',
              ti: '1 J = 1 kg · m² · s⁻²',
              ar: '1 جول = 1 كجم · م² / ث²',
              so: '1 J = 1 kg · m² · s⁻²',
              en: '1 J = 1 kg·m²·s⁻²',
            },
            pedagogicalNote: {
              am: 'ይህ የመለኪያ አሃዶች ወጥነት ትንታኔ (Dimensional Analysis) በሁሉም የፊዚክስ ስሌቶች ላይ ትክክለኛነትን ለማረጋገጥ ያገለግላል።',
              om: 'Dimensional analysis herrega fiiziksii keessatti baay\'ee fayyada.',
              ti: 'ናይ መለክዒታት ትንታኔ ኣዝዩ ጠቓሚ እዩ።',
              ar: 'يستخدم التحليل البعدي للتحقق من صحة القوانين الفيزيائية وتجانس الأطراف.',
              so: 'Dimensional analysis waxay muhiim u tahay xaqiijinta qaacidooyinka.',
              en: 'Dimensional homogeneity guarantees that physical equations are mathematically valid.',
            },
          },
        ],
        activities: [
          {
            id: 'act-p-1.1',
            activityNumber: 'አክቲቪቲ 1.1 (Metric Investigation)',
            title: {
              am: 'የትምህርት ቤት የሳይንስ ላቦራቶሪ የመለኪያ መሳሪያዎች ዳሰሳ',
              om: 'Meeshaalee Safaraa Laabooratoorii Mana Barumsaa Qorachuu',
              ti: 'ናይ ላቦራቶሪ መለክዒ መሳርሒታት ምምርማር',
              ar: 'استكشاف أدوات القياس الدقيقة في مختبر الفيزياء المدرسي',
              so: 'Dhaqdhaqaaqa Baarista Qalabka Cabbirka ee Shaybaarka',
              en: 'School Laboratory Metrology Survey: Vernier Calipers and Micrometer Gauges',
            },
            instruction: {
              am: 'በቡድን በመሆን የቬርኒየር ካሊፐር (Vernier Caliper) እና ማይክሮሜትር ስክሩ ጌጅን በመጠቀም የሳንቲም ውፍረትና ራዲየስን ለኩ።',
              om: 'Vernier Caliper fayyadamuun furdinna saantimaa safaraa.',
              ti: 'ብ ቬርኒየር ካሊፐር ናይ ሳንቲም ስፍሓት ምዕቃን።',
              ar: 'استخدم الورنية والميكرومتر لقياس سمك عملة نقدية معدنية وقطر سلك نحاسي بدقة ملليمترية.',
              so: 'Isticmaal Vernier Caliper si aad u cabbirto qadaadiicda.',
              en: 'Measure thickness and diameter of metal tokens using vernier caliper and micrometer screw gauge.',
            },
            groupTask: {
              am: 'የስህተት መጠንን (Zero error and Uncertainty) በማስላት የውጤቶቻችሁን አማካይ መዝግቡ።',
              om: 'Zero error herseegaa.',
              ti: 'ናይ ስሕተት መጠን ምሕሳብ።',
              ar: 'حدد الخطأ الصفري (Zero error) ونسبة الارتياب في القياس وسجل المتوسط الحسابي.',
              so: 'Xisaabi khaladka eberka.',
              en: 'Calculate instrument zero-error correction and percentage experimental uncertainty.',
            },
            criticalThinkingQuestion: {
              am: 'በቬርኒየር ካሊፐር እና በማይክሮሜትር ስክሩ ጌጅ መካከል ያለው የመለኪያ ጥራት (Precision) ልዩነት ምንድነው?',
              om: 'Garaagarummaan Vernier fi Micrometer maali?',
              ti: 'ፍልልይ ናይ ቬርኒየርን ማይክሮሜተርን እንታይ እዩ?',
              ar: 'ما الفرق في درجة الدقة (Least count) بين الورنية ذات الورنية والميكرومتر؟',
              so: 'Waa maxay farqiga u dhexeeya Vernier iyo Micrometer?',
              en: 'Compare the least counts: 0.1 mm/0.05 mm (vernier) vs 0.01 mm (micrometer screw gauge).',
            },
          },
        ],
        experiments: [SAMPLE_LAB_EXPERIMENTS.kinematics],
        reviewExercises: [
          {
            id: 'rev-p-1',
            exerciseNumber: 'የምዕራፍ 1 ጥያቄ 1',
            type: 'multiple_choice',
            question: {
              am: 'ከሚከተሉት ውስጥ መሰረታዊ የ SI የመለኪያ አሃድ (Base SI Unit) ያልሆነው የቱ ነው?',
              om: 'Kamtu safartuu bu\'uuraa (Base SI unit) miti?',
              ti: 'ካብዚኦም መሰረታዊ SI ዘይኮነ ኣየናይ እዩ?',
              ar: 'أي من الوحدات التالية لا تعد من الوحدات الأساسية في النظام الدولي (SI)؟',
              so: 'Keebaa aan ka tirsanayn unugyada aasaasiga ah ee SI?',
              en: 'Which of the following is NOT a fundamental base SI unit?',
            },
            options: ['A. ኪሎግራም (Kilogram - kg)', 'B. ሰከንድ (Second - s)', 'C. ኒውተን (Newton - N)', 'D. ኬልቪን (Kelvin - K)'],
            correctAnswer: {
              am: 'C. ኒውተን (Newton - N) — የተቀዳ (Derived) አሃድ ነው',
              om: 'C. Newton - N',
              ti: 'C. Newton - N',
              ar: 'C. نيوتن (Newton - N) وحدة مشتقة وليست أساسية',
              so: 'C. Newton - N',
              en: 'C. Newton (N) is a derived unit (1 N = 1 kg·m·s⁻²)',
            },
            stepByStepSolution: [
              {
                am: 'መሰረታዊ የ SI አሃዶች 7 ናቸው፦ m, kg, s, A, K, mol, cd። ኒውተን (N) ከነዚህ የተቀዳ (Derived) ነው።',
                om: 'Safartuun bu\'uuraa 7 dha. Newton derived dha.',
                ti: 'መሰረታዊ መለክዒታት 7 እዮም። ኒውተን derived እዩ።',
                ar: 'الوحدات الأساسية السبع هي: المتر، الكيلوجرام، الثانية، الأمبير، الكلفن، المول، والكانديلا. النيوتن وحدة مشتقة.',
                so: 'Unugyada aasaasiga ahi waa 7.',
                en: 'The 7 fundamental SI base units are m, kg, s, A, K, mol, cd. Newton is derived.',
              },
            ],
          },
        ],
        supplementaryNote: {
          am: 'ተጨማሪ አጋዥ፡ የኢትዮጵያ ፊዚክስ ፎርሙላ ማኑዋል ገፅ 1-5 ይመልከቱ።',
          om: 'Formula manual fuula 1-5 ilaalaa.',
          ti: 'ገጽ 1-5 ተመልከቱ።',
          ar: 'راجع دليل القوانين الفيزيائية للمرحلة الثانوية الصفحات 1-5.',
          so: 'Tixraac buugga qaacidooyinka bogga 1-5.',
          en: 'Supplementary: Refer to High School STEM Formula Handbook pp. 1-5.',
        },
      },
      {
        unitNumber: 2,
        title: {
          am: 'ምዕራፍ 2፡ ባለ አንድ አቅጣጫ እንቅስቃሴ (Motion in One Dimension)',
          om: 'Boqonnaa 2: Sochii Kallattii Tokkoo',
          ti: 'ምዕራፍ 2፡ ሓደ ኣንፈታዊ ምንቅስቓስ',
          ar: 'الوحدة 2: الحركة في بعد واحد والسرعة المنتظمة',
          so: 'Cutubka 2: Dhaqdhaqaaqa Hal Jiho ah',
          en: 'Unit 2: Motion in One Dimension',
        },
        startPage: 33,
        endPage: 76,
        theoryContent: {
          am: 'እንቅስቃሴ የአንድ አካል የቦታ ለውጥ በጊዜ ሂደት የሚለካበት የፊዚክስ ዘርፍ ነው። በባለ አንድ አቅጣጫ እንቅስቃሴ ውስጥ ፍጥነት (Speed)፣ ቬሎሲቲ (Velocity) እና ፍጥንጥነት (Acceleration) ቁልፍ መጠኖች ናቸው። ቋሚ ፍጥንጥነት ባላቸው አካላት እንቅስቃሴ ላይ 4ቱ የኪነማቲክስ ቀመሮች ወሳኝ ናቸው።',
          om: 'Sochiin jijjiirama bakkaa qaama tokkoo yeroo keessatti safaramudha.',
          ti: 'ምንቅስቓስ ናይ ሓደ ኣካል ናይ ቦታ ለውጢ ምስ ግዜ ዝልካዕ ናይ ፊዚክስ ጨንፈር እዩ።',
          ar: 'الحركة هي تغير موضع الجسم بمرور الزمن بالنسبة لنقطة إسناد محددة.',
          so: 'Dhaqdhaqaaqu waa isbeddelka goobta walaxdu leedahay waqti ka dib.',
          en: 'Motion is change in position over time. Constant acceleration is governed by the four standard kinematic equations.',
        },
        examples: [
          {
            id: 'ex-p-2.1',
            exampleNumber: 'ምሳሌ 2.1 (Kinematics Calculation)',
            problemStatement: {
              am: 'ከአዋሽ ወደ ደብረዘይት የሚጓዝ ባቡር ከእረፍት ተነስቶ በቋሚ ፍጥንጥነት a = 1.5 m/s² ለ 12 ሰከንድ ሲጓዝ የሚኖረውን የመጨረሻ ቬሎሲቲ እና የተጓዘውን ርቀት አስላ።',
              om: 'Baaburri Awashii gara Bishooftuu deemu boqonnaa irraa ka\'ee saffisiisa a = 1.5 m/s² tiin sekondii 12 yoo deeme herseegi.',
              ti: 'ባቡር ካብ ዕረፍቲ ተላዒሉ ብ 1.5 m/s² ን 12 ካልኢት እንተተጓዒዙ ቬሎሲቲኡን ርሕቐቱን ጸብጽብ።',
              ar: 'قطار ينطلق من السكون بتسارع منتظم a = 1.5 م/ث² لمدة 12 ثانية. احسب سرعته النهائية والمسافة المقطوعة.',
              so: 'Tareen ka bilaabmay nasasho oo ku socda dardargelin 1.5 m/s² muddo 12 ilbiriqsi ah.',
              en: 'A train starts from rest with constant acceleration a = 1.5 m/s² for 12.0 s. Compute final velocity and displacement.',
            },
            given: ['v₀ = 0 m/s', 'a = 1.5 m/s²', 't = 12.0 s'],
            formula: 'v = v₀ + at ; s = v₀t + 0.5at²',
            calculationSteps: [
              {
                am: 'ደረጃ 1፡ v = 0 + (1.5)(12) = 18.0 m/s (64.8 km/h)።',
                om: 'v = 18.0 m/s.',
                ti: 'v = 18.0 m/s።',
                ar: 'v = 18.0 م/ث.',
                so: 'v = 18.0 m/s.',
                en: 'Step 1: v = 0 + (1.5)(12) = 18.0 m/s.',
              },
              {
                am: 'ደረጃ 2፡ s = 0 + 0.5(1.5)(12)² = 108.0 ሜትር።',
                om: 's = 108.0 m.',
                ti: 's = 108.0 ሜትሮ።',
                ar: 's = 108.0 متر.',
                so: 's = 108.0 m.',
                en: 'Step 2: s = 0.5(1.5)(144) = 108.0 m.',
              },
            ],
            finalAnswer: {
              am: 'v = 18.0 m/s ፤ s = 108.0 ሜትር',
              om: 'v = 18.0 m/s; s = 108.0 m',
              ti: 'v = 18.0 m/s፤ s = 108.0 ሜትሮ',
              ar: 'السرعة = 18.0 م/ث؛ المسافة = 108.0 متر',
              so: 'v = 18.0 m/s; s = 108.0 m',
              en: 'v = 18.0 m/s; s = 108.0 m',
            },
            pedagogicalNote: {
              am: '12² = 144 ማስላት እንዳይረሳ።',
              om: '12² = 144 dura herseegaa.',
              ti: '12² = 144 ተሓስብ።',
              ar: 'تذكر حساب مربع 12 أولاً.',
              so: 'Xusuuso 12² = 144.',
              en: 'Always evaluate t² first.',
            },
          },
        ],
        activities: [
          {
            id: 'act-p-2.1',
            activityNumber: 'አክቲቪቲ 2.1',
            title: {
              am: 'የሩጫ ሜዳ የፍጥነት-ጊዜ ግራፍ ግንባታ',
              om: 'Giraafii Ariitii-Yeroo',
              ti: 'ግራፍ ፍጥነት-ግዜ',
              ar: 'رسم منحنى السرعة والزمن في سباق 100 متر',
              so: 'Garaafka xawaaraha iyo waqtiga',
              en: 'Plotting 100m Sprint Velocity-Time Graph',
            },
            instruction: {
              am: 'በየ 20 ሜትሩ ሰከንድ መዝግባችሁ የፍጥነት-ጊዜ ግራፍ ስሩ።',
              om: 'Giraafii hojjedhaa.',
              ti: 'ግራፍ ስርሑ።',
              ar: 'قس الأزمنة وارسم المنحنى البياني.',
              so: 'Sawir garaafka.',
              en: 'Record split times and construct velocity-time curve.',
            },
            groupTask: {
              am: 'ከግራፉ ስር ያለው ስፋት የተጓዘውን ርቀት የሚሰጥ መሆኑን አረጋግጡ።',
              om: 'Bal\'ina qoradhaa.',
              ti: 'ስፍሓት መርምሩ።',
              ar: 'تحقق من المساحة تحت المنحنى.',
              so: 'Xaqiiji baaxadda.',
              en: 'Verify that area under curve matches displacement.',
            },
            criticalThinkingQuestion: {
              am: 'የግራፉ ስሎፕ ምን ያመለክታል?',
              om: 'Slope maali?',
              ti: 'ስሎፕ እንታይ የመልክት?',
              ar: 'ماذا يمثل ميل المماس لمنحنى السرعة والزمن؟',
              so: 'Waa maxay slope-ku?',
              en: 'The slope represents instantaneous acceleration.',
            },
          },
        ],
        experiments: [SAMPLE_LAB_EXPERIMENTS.kinematics],
        reviewExercises: [
          {
            id: 'rev-p-2',
            exerciseNumber: 'የምዕራፍ 2 መልመጃ 1',
            type: 'multiple_choice',
            question: {
              am: 'የመቀነስ ፍጥንጥነት (Deceleration) የሚያሳየው የትኛው ነው?',
              om: 'Deceleration kan agarsiisu kami?',
              ti: 'ምቕናስ ቅልጣፈ ዘርኢ ኣየናይ እዩ?',
              ar: 'أي من الحالات التالية تعبر عن تباطؤ الحركة (Deceleration)؟',
              so: 'Keebaa muujinaya hoos u dhaca dardargelinta?',
              en: 'Which scenario describes negative acceleration (deceleration)?',
            },
            options: ['A. ፍጥነት በጊዜ ሂደት ሲቀንስ', 'B. ቋሚ ፍጥነት ሲኖር', 'C. ፍጥነት ሲጨምር', 'D. እረፍት ላይ ሲሆን'],
            correctAnswer: {
              am: 'A. ፍጥነት በጊዜ ሂደት ሲቀንስ (Velocity decreases over time)',
              om: 'A. Saffisni yoo hir\'atu',
              ti: 'A. ፍጥነት እናነሰ ምስ ዝኸይድ',
              ar: 'A. عندما تتناقص السرعة المتجهة بمرور الزمن',
              so: 'A. Marka xawaaruhu hoos u dhaco',
              en: 'A. When velocity decreases with respect to time',
            },
            stepByStepSolution: [
              {
                am: 'የመጨረሻ ፍጥነት v ከመነሻ ፍጥነት v₀ ካነሰ፡ a = (v - v₀)/t አሉታዊ ይሆናል።',
                om: 'v < v₀ yoo ta\'e a negative ta\'a.',
                ti: 'v < v₀ እንተኾይኑ a ኣሉታዊ ይኸውን።',
                ar: 'عندما تكون السرعة النهائية أقل من الابتدائية يكون التسارع سالباً (تباطؤ).',
                so: 'Marka v < v₀, dardargelintu waa xun tahay.',
                en: 'When final velocity is lower than initial velocity, acceleration is negative.',
              },
            ],
          },
        ],
        supplementaryNote: {
          am: 'ተጨማሪ አጋዥ፡ የብሔራዊ ፈተና ባንክ ኪነማቲክስ ጥያቄዎችን ይመልከቱ።',
          om: 'Qormaata EUEE ilaalaa.',
          ti: 'ሕቶታት EUEE ተመልከቱ።',
          ar: 'راجع بنك أسئلة الوزارة حول الحركة في بعد واحد.',
          so: 'Tixraac su\'aalaha imtixaanka EUEE.',
          en: 'Supplementary: Check EUEE kinematics past papers.',
        },
      },
      {
        unitNumber: 3,
        title: {
          am: 'ምዕራፍ 3፡ ኃይል እና የኒውተን የእንቅስቃሴ ህጎች (Forces & Newton’s Laws)',
          om: 'Boqonnaa 3: Humna fi Seerota Niiwtanii',
          ti: 'ምዕራፍ 3፡ ሓይሊን ሕግታት ኒውተንን',
          ar: 'الوحدة 3: القوى وقوانين نيوتن للحركة والتحريك',
          so: 'Cutubka 3: Xoogagga iyo Xeerarka Newton ee Dhaqdhaqaaqa',
          en: 'Unit 3: Forces and Newton’s Laws of Motion',
        },
        startPage: 77,
        endPage: 120,
        theoryContent: {
          am: 'ኒውተን ያረቀቃቸው 3ቱ የእንቅስቃሴ ህጎች የክላሲካል ሜካኒክስ ምሶሶ ናቸው። የመጀመሪያው ህግ (Law of Inertia)፣ ሁለተኛው ህግ (F = ma) እና ሦስተኛው ህግ (Action and Reaction) የተፈጥሮ ኃይሎችን ይገዛሉ።',
          om: 'Seeronni Niiwtanii 3 bu\'uura fiiziksiiti. Seerri lammaffaan F = ma dha.',
          ti: '3 ሕግታት ኒውተን ናይ ፊዚክስ መሰረት እዮም።',
          ar: 'قوانين نيوتن الثلاثة للحركة: القصور الذاتي، العلاقة بين القوة والتسارع F = ma، والفعل ورد الفعل.',
          so: 'Saddexda xeer ee Newton waa aasaaska fiisigiska.',
          en: 'Newton’s three laws of motion govern kinematics and dynamics: inertia, F = ma, and equal/opposite action-reaction.',
        },
        examples: [
          {
            id: 'ex-p-3.1',
            exampleNumber: 'ምሳሌ 3.1 (Newton\'s 2nd Law)',
            problemStatement: {
              am: 'መጠነ-ቁሱ m = 800 kg የሆነ መኪና በ a = 2.5 m/s² እንዲጓዝ የሚፈለገው ጠቅላላ ግፊት ኃይል (Net Force) ስንት ነው?',
              om: 'Konkolaataa 800 kg a = 2.5 m/s² tiin sochoosuuf humna meeqatu barbaachisa?',
              ti: 'መኪና 800 kg ብ 2.5 m/s² ንምጉዓዝ ክንደይ ሓይሊ የድሊ?',
              ar: 'ما مقدار القوة المحصلة اللازمة لإكساب سيارة كتلتها 800 كجم تسارعاً قدره 2.5 م/ث²؟',
              so: 'Waa maxay xoogga loo baahan yahay si loo dardargeliyo gaari 800 kg ah?',
              en: 'What net force is required to accelerate an 800 kg automobile at 2.5 m/s²?',
            },
            given: ['m = 800 kg', 'a = 2.5 m/s²'],
            formula: 'F_net = m · a',
            calculationSteps: [
              {
                am: 'ደረጃ 1፡ F = (800 kg) × (2.5 m/s²) = 2000 N (ወይም 2.0 kN)።',
                om: 'F = 800 × 2.5 = 2000 N.',
                ti: 'F = 2000 N።',
                ar: 'F = 800 × 2.5 = 2000 نيوتن (2 كيلو نيوتن).',
                so: 'F = 2000 N.',
                en: 'Step 1: F = (800 kg)(2.5 m/s²) = 2000 N (2.0 kN).',
              },
            ],
            finalAnswer: {
              am: 'F_net = 2000 N (2 kN)',
              om: 'F = 2000 N',
              ti: 'F = 2000 N',
              ar: 'القوة المحصلة = 2000 نيوتن',
              so: 'F = 2000 N',
              en: 'F_net = 2000 N (2.0 kN)',
            },
            pedagogicalNote: {
              am: 'ኃይል በ SI አሃድ ኒውተን (N) መገለጹን ያረጋግጡ።',
              om: 'Newton fayyadamaa.',
              ti: 'ኒውተን ተጠቐሙ።',
              ar: 'تأكد دائماً من استخدام وحدة النيوتن.',
              so: 'Hubi unugga Newton.',
              en: 'Ensure standard SI unit of Newton (N).',
            },
          },
        ],
        activities: [
          {
            id: 'act-p-3.1',
            activityNumber: 'አክቲቪቲ 3.1',
            title: {
              am: 'የኒውተን ሦስተኛ ህግ በፊኛ ሮኬት ሙከራ',
              om: 'Qormaata Balloon Rocket',
              ti: 'ፈተነ ፊኛ ሮኬት',
              ar: 'نشاط تطبيقي: تجربة صاروخ البالون لإثبات قانون الفعل ورد الفعل',
              so: 'Tijaabada Gantaalka Buufinka',
              en: 'Balloon Rocket Activity: Investigating Action-Reaction Pairs',
            },
            instruction: {
              am: 'በተወጠረ ክር ላይ የተገጠመ ፊኛ አየር በመልቀቅ ወደ ፊት የሚጓዝበትን አቅጣጫ ተመልከቱ።',
              om: 'Balloon sochoosaa.',
              ti: 'ናይ ፊኛ ምንቅስቓስ ተዓዘቡ።',
              ar: 'أطلق الهواء من بالون مثبت على خيط لملاحظة حركة البالون في الاتجاه المعاكس.',
              so: 'Fiiri dhaqdhaqaaqa buufinka.',
              en: 'Release inflated balloon along taut horizontal string to trace thrust propulsion.',
            },
            groupTask: {
              am: 'የወጣውን አየር ግፊት (Action) እና የፊኛውን ወደ ፊት መፈናጠር (Reaction) በስዕል አስረዱ።',
              om: 'Action fi Reaction agarsiisaa.',
              ti: 'Action ን Reaction ን ግለጹ።',
              ar: 'حدد متجهات الفعل (اندفاع الهواء) ورد الفعل (اندفاع البالون).',
              so: 'Cadee Action iyo Reaction.',
              en: 'Diagram vectors representing exhausting air impulse and forward reaction thrust.',
            },
            criticalThinkingQuestion: {
              am: 'በህዋ (Vacuum) ውስጥ አየር በሌለበት ሁኔታ የሮኬት ሞተር እንዴት ይሰራል?',
              om: 'Rocket vacuum keessatti akkamitti hojjeta?',
              ti: 'ሮኬት ኣብ ጸልማት ህዋ ብኸመይ ይሰርሕ?',
              ar: 'كيف تعمل محركات الصواريخ الفضائية في الفراغ التام دون وجود هواء للدفع؟',
              so: 'Sidee gantaalku ugu shaqeeyaa hawada sare?',
              en: 'Explain why rocket propulsion relies on ejecting propellant mass, functioning even in a vacuum.',
            },
          },
        ],
        experiments: [SAMPLE_LAB_EXPERIMENTS.kinematics],
        reviewExercises: [
          {
            id: 'rev-p-3',
            exerciseNumber: 'የምዕራፍ 3 ጥያቄ 1',
            type: 'multiple_choice',
            question: {
              am: 'የአንድ አካል መጠነ-ቁስ (Mass) ሲጨምር የኢነርሺያ (Inertia) ባህሪው ምን ይሆናል?',
              om: 'Mass yoo dabalu inertia maali ta\'a?',
              ti: 'Mass እንተወሲኹ inertia እንታይ ይኸውን?',
              ar: 'ماذا يحدث للقصور الذاتي (Inertia) لجسم ما عندما تزداد كتلته؟',
              so: 'Maxaa ku dhacaya inertia marka mass-ku kordho?',
              en: 'What happens to the inertia of an object when its mass increases?',
            },
            options: ['A. ይጨምራል (Increases)', 'B. ይቀንሳል (Decreases)', 'C. አይለወጥም (Remains constant)', 'D. ዜሮ ይሆናል (Becomes zero)'],
            correctAnswer: {
              am: 'A. ይጨምራል (Increases) — መጠነ-ቁስ የኢነርሺያ ቀጥተኛ መለኪያ ነው',
              om: 'A. Ni dabala',
              ti: 'A. ይውስኽ',
              ar: 'A. يزداد، فالكتلة هي المقياس الكمي المباشر للقصور الذاتي',
              so: 'A. Wuu kordhaa',
              en: 'A. Increases (mass is the direct quantitative measure of inertia)',
            },
            stepByStepSolution: [
              {
                am: 'መጠነ-ቁስ የቁስ አካሉን እንቅስቃሴ የመቃወም አቅም (Inertia) ይወስናል። መጠነ-ቁሱ ከፍ ባለ መጠን ኢነርሺያው ይጨምራል።',
                om: 'Mass fi inertia wal-qabatu.',
                ti: 'Mass ምስ ወሰኸ inertia ይውስኽ።',
                ar: 'الكتلة هي مقياس القصور الذاتي للجسم لمقاومة أي تغير في حالته الحركية.',
                so: 'Mass-ka weyn wuxuu leeyahay inertia weyn.',
                en: 'Inertia is directly proportional to inertial mass.',
              },
            ],
          },
        ],
        supplementaryNote: {
          am: 'ተጨማሪ አጋዥ፡ የኢትዮጵያ ፊዚክስ ፎርሙላ ማኑዋል ገፅ 14 ይመልከቱ።',
          om: 'Formula manual fuula 14 ilaalaa.',
          ti: 'ገጽ 14 ተመልከቱ።',
          ar: 'راجع دليل القوانين صفحة 14.',
          so: 'Tixraac bogga 14aad.',
          en: 'Supplementary: Formula Handbook p. 14.',
        },
      },
      {
        unitNumber: 4,
        title: {
          am: 'ምዕራፍ 4፡ ስራ፣ ጉልበት እና ኃይል (Work, Energy & Power)',
          om: 'Boqonnaa 4: Hojii, Anniisaa fi Humna',
          ti: 'ምዕራፍ 4፡ ስራሕ፣ ጉልበትን ሓይልን',
          ar: 'الوحدة 4: الشغل والطاقة والقدرة الكهربائية والميكانيكية',
          so: 'Cutubka 4: Shaqada, Tamarta iyo Awoodda',
          en: 'Unit 4: Work, Energy and Power',
        },
        startPage: 121,
        endPage: 164,
        theoryContent: {
          am: 'ስራ የሚሰራው ኃይል በአንድ አካል ላይ አርፎ በኃይሉ አቅጣጫ ርቀት ሲጓዝ ነው (W = F · d · cosθ)። የታላቁ የህዳሴ ግድብ (GERD) የውሃ ኃይል ተርባይኖችን በማሽከርከር ሜካኒካል ስራን ወደ ኤሌክትሪክ ጉልበት የሚቀይርበት መንገድ የዚህ ታላቅ የኢትዮጵያ ማሳያ ነው።',
          om: 'Hojiin kan hojjetamu yoo humni fageenya uumedha (W = F · d · cosθ). Hidhi Haaromsaa fakkeenya guddaadha.',
          ti: 'ስራሕ ሓይሊ ርሕቐት ምስ ዘስዕብ ይስራሕ (W = F · d · cosθ)።',
          ar: 'يتحقق الشغل الميكانيكي عندما تؤثر قوة في جسم وتحدث إزاحة باتجاهها: W = F · d · cos(θ). سد النهضة الإثيوبي العظيم يحول الطاقة الكامنة للماء إلى طاقة كهربائية عملاقة.',
          so: 'Shaqadu waxay dhacdaa marka xooggu sababo barokac.',
          en: 'Work is defined as scalar product W = F · d · cos(θ). The Grand Ethiopian Renaissance Dam (GERD) converts hydraulic potential into mechanical work and electrical energy.',
        },
        examples: [
          {
            id: 'ex-p-4.1',
            exampleNumber: 'ምሳሌ 4.1 (Work Calculation)',
            problemStatement: {
              am: 'አንድ ገበሬ 200 N ኃይል በገመድ በመጠቀም 30 ሜትር አግድም ርቀት ቢጎትት (θ = 0° ከሆነ) የሰራው ስራ ስንት ጆውል ነው?',
              om: 'Qonnaan bulaan tokko humna 200 N tiin fageenya meetira 30 yoo harkise hojii meeqatu hojjetame?',
              ti: 'ሓደ ሓረስቶት 200 N ሓይሊ ብምጥቃም 30 ሜትሮ እንተጎቲቱ ዝተሰርሐ ስራሕ ክንደይ እዩ?',
              ar: 'مزارع يسحب حمولة بقوة 200 نيوتن لمسافة 30 متراً أفقياً (θ = 0°). ما هو مقدار الشغل المنجز بالجول؟',
              so: 'Beeralay ayaa ku jiiday culeys 200 N masaafada 30m. Waa maxay shaqada la qabtay?',
              en: 'A worker applies a 200 N horizontal force pulling a crate across 30 m (θ = 0°). Compute work done.',
            },
            given: ['F = 200 N', 'd = 30 m', 'θ = 0° ⇒ cos(0°) = 1'],
            formula: 'W = F · d · cos(θ)',
            calculationSteps: [
              {
                am: 'ደረጃ 1፡ W = (200 N) × (30 m) × 1 = 6000 ጆውል (J) ወይም 6 kJ።',
                om: 'W = 200 × 30 × 1 = 6000 J.',
                ti: 'W = 6000 J።',
                ar: 'W = 200 × 30 × 1 = 6000 جول (6 كيلوجول).',
                so: 'W = 6000 J.',
                en: 'Step 1: W = (200 N)(30 m)(1) = 6000 J (6.0 kJ).',
              },
            ],
            finalAnswer: {
              am: 'W = 6000 J (6.0 kJ)',
              om: 'W = 6000 J',
              ti: 'W = 6000 J',
              ar: 'الشغل المنجز = 6000 جول',
              so: 'W = 6000 J',
              en: 'W = 6000 J (6.0 kJ)',
            },
            pedagogicalNote: {
              am: 'ኃይልና እንቅስቃሴው በተመሳሳይ አቅጣጫ ሲሆኑ cos(0°) = 1 ይሆናል።',
              om: 'cos(0°) = 1 dha.',
              ti: 'cos(0°) = 1 እዩ።',
              ar: 'تذكر أن cos(0°) = 1 عندما تتطابق جهة القوة مع الإزاحة.',
              so: 'cos(0°) = 1.',
              en: 'Note that cos(0°) = 1 when force aligns with displacement vector.',
            },
          },
        ],
        activities: [
          {
            id: 'act-p-4.1',
            activityNumber: 'አክቲቪቲ 4.1',
            title: {
              am: 'በደረጃዎች ላይ በመሮጥ የሰውነት ኃይል (Human Mechanical Power) ማስላት',
              om: 'Humna Qaama Namaa Safaruu',
              ti: 'ናይ ሰብ ሓይሊ ምዕቃን',
              ar: 'قياس القدرة الميكانيكية لجسم الإنسان بالصعود السريع على السلالم',
              so: 'Cabbirka awoodda jirka aadanaha',
              en: 'Experimental Determination of Human Mechanical Power via Stair Climbing',
            },
            instruction: {
              am: 'የደረጃውን አጠቃላይ ቁመት (h) በሜትር ለኩ፤ የሰውነት መጠነ-ቁስን (m) መዝግቡና በደረጃው ለመውጣት የፈጀውን ሰከንድ (t) በስቶፕዎችን ይያዙ።',
              om: 'Dheerina qoradhaa sekondii lakkaa\'aa.',
              ti: 'ቁመት መርምሩ ግዜ ጸብጽቡ።',
              ar: 'قس الارتفاع الرأسي للدرج، وسجل كتلة الطالب والزمن المستغرق بالثواني للصعود.',
              so: 'Cabbir dhererka iyo waqtiga.',
              en: 'Measure vertical rise h of staircase, record subject mass m, and time sprint climb t.',
            },
            groupTask: {
              am: 'ኃይልን በዋት ቀመር P = (m · g · h) / t አስሉ። በዋትና በሆርስ ፓወር (1 hp = 746 W) አነጻጽሩ።',
              om: 'P = (m · g · h) / t herseegaa.',
              ti: 'P = (m · g · h) / t ጸብጽቡ።',
              ar: 'احسب القدرة الميكانيكية بالواط P = mgh/t وحولها إلى القدرة الحصانية.',
              so: 'Xisaabi P = mgh/t.',
              en: 'Compute power in Watts P = mgh/t and convert to brake horsepower (1 hp = 746 W).',
            },
            criticalThinkingQuestion: {
              am: 'አንድ ሰው በዝግታ ቢወጣና በፈጣን ሩጫ ቢወጣ የሚሰራው ስራ (Work) ይለያያል ወይስ ኃይሉ (Power)?',
              om: 'Hojiitu moo humnatu jijjiirama?',
              ti: 'ስራሕ ድዩ ወይስ ሓይሊ ዝልወጥ?',
              ar: 'إذا صعد شخص الدرج مشياً ببطء ثم ركضاً بسرعة، هل يتغير الشغل المنجز أم القدرة؟ ولماذا؟',
              so: 'Shaqada mise awoodda ayaa isbeddela?',
              en: 'Work mgh remains invariant; only mechanical rate of energy expenditure (Power) changes.',
            },
          },
        ],
        experiments: [SAMPLE_LAB_EXPERIMENTS.kinematics],
        reviewExercises: [
          {
            id: 'rev-p-4',
            exerciseNumber: 'የምዕራፍ 4 ጥያቄ 1',
            type: 'multiple_choice',
            question: {
              am: 'የኃይል (Power) የ SI የመለኪያ አሃድ የቱ ነው?',
              om: 'Safartuun humnaa (Power) kami?',
              ti: 'ናይ ሓይሊ (Power) መለክዒ ኣየናይ እዩ?',
              ar: 'ما هي وحدة قياس القدرة (Power) في النظام الدولي للوحدات؟',
              so: 'Waa maxay halbeegga Power ee SI?',
              en: 'What is the SI unit of mechanical and electrical Power?',
            },
            options: ['A. ጆውል (Joule)', 'B. ዋት (Watt - W)', 'C. ኒውተን (Newton)', 'D. ፓስካል (Pascal)'],
            correctAnswer: {
              am: 'B. ዋት (Watt - W) — 1 ዋት = 1 ጆውል በሰከንድ (J/s)',
              om: 'B. Watt - W',
              ti: 'B. Watt - W',
              ar: 'B. واط (Watt) ويكافئ 1 جول في الثانية',
              so: 'B. Watt - W',
              en: 'B. Watt (W) representing 1 Joule per second (J/s)',
            },
            stepByStepSolution: [
              {
                am: 'P = W / t ስለሆነ፡ 1 Watt = 1 J / 1 s = 1 J/s ነው።',
                om: 'P = W / t; 1 Watt = 1 J/s.',
                ti: 'P = W / t; 1 Watt = 1 J/s።',
                ar: 'القدرة هي معدل بذل الشغل بمرور الزمن: P = W / t، ومنه 1 واط = 1 جول/ثانية.',
                so: 'P = W / t; 1 Watt = 1 J/s.',
                en: 'By definition, Power P = dW/dt with unit 1 W = 1 J/s.',
              },
            ],
          },
        ],
        supplementaryNote: {
          am: 'ተጨማሪ አጋዥ፡ የኢትዮጵያ ታዳሽ ሃይል እና የህዳሴው ግድብ የሃይል ማመንጫ መመሪያ ገፅ 22 ይመልከቱ።',
          om: 'Kitaaba dabalataa fuula 22 ilaalaa.',
          ti: 'ገጽ 22 ተመልከቱ።',
          ar: 'راجع دليل محطات التوليد وسد النهضة للمرحلة الثانوية صفحة 22.',
          so: 'Tixraac bogga 22aad.',
          en: 'Supplementary: GERD Hydroelectric Power Engineering Appendix p. 22.',
        },
      },
    ];
  }

  // Fallback default chapters for Math/Chem/Bio/Others
  return [
    {
      unitNumber: 1,
      title: {
        am: 'ምዕራፍ 1፡ መሰረታዊ ፅንሰ-ሀሳቦች (Foundations & Competencies)',
        om: 'Boqonnaa 1: Bu\'uuraalee fi Dandeettiiwwan',
        ti: 'ምዕራፍ 1፡ መሰረታዊ ትሕዝቶታት',
        ar: 'الوحدة 1: الأسس النظرية والمعايير المنهجية',
        so: 'Cutubka 1: Aasaaska iyo Xirfadaha',
        en: 'Unit 1: Core Foundations and Curriculum Competencies',
      },
      startPage: 1,
      endPage: 54,
      theoryContent: {
        am: 'ይህ ምዕራፍ በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መሰረት የተቀረጹትን መሰረታዊ የትምህርት ይዘቶች፣ የትንታኔ ዘዴዎችን እና የሳይንስ አተገባበርን ያብራራል።',
        om: 'Boqonnaan kun barnoota bu\'uuraa sirna haaraa ibsa.',
        ti: 'እዚ ምዕራፍ መሰረታዊ ትምህርቲ ይገልጽ።',
        ar: 'تغطي هذه الوحدة المفاهيم التأسيسية للمنهج الجديد وتطبيقاتها العلمية والعملية.',
        so: 'Cutubkani wuxuu sharxayaa casharrada aasaasiga ah.',
        en: 'This unit covers the foundational competency standards and practical inquiry frameworks outlined in the MoE curriculum.',
      },
      examples: [],
      activities: [],
      experiments: [SAMPLE_LAB_EXPERIMENTS.kinematics],
      reviewExercises: [],
      supplementaryNote: {
        am: 'ተጨማሪ አጋዥ ማኑዋል ገፅ 1-20 ይመልከቱ።',
        om: 'Manual fuula 1-20 ilaalaa.',
        ti: 'ገጽ 1-20 ተመልከቱ።',
        ar: 'راجع الدليل الإثرائي الصفحات 1-20.',
        so: 'Tixraac bogga 1-20.',
        en: 'Supplementary: Refer to Curriculum Handbook pp. 1-20.',
      },
    },
    {
      unitNumber: 2,
      title: {
        am: 'ምዕራፍ 2፡ ተግባራዊ ስሌቶች እና አተገባበር (Applied Problem Solving)',
        om: 'Boqonnaa 2: Shallaggii fi Hojiirra Oolmaa',
        ti: 'ምዕራፍ 2፡ ተግባራዊ ጸብጻብ',
        ar: 'الوحدة 2: التطبيقات الحسابية وحل المسائل المنهجية',
        so: 'Cutubka 2: Xisaabinta La Isticmaalo',
        en: 'Unit 2: Quantitative Modeling and Applied Problem Solving',
      },
      startPage: 55,
      endPage: 112,
      theoryContent: {
        am: 'በዚህ ምዕራፍ ውስጥ ተማሪዎች ደረጃ በደረጃ የሂሳብ እና የሳይንስ ቀመሮችን በመጠቀም ውስብስብ ችግሮችን የመፍታት ብቃትን ያዳብራሉ።',
        om: 'Shallaggii fi foormulaa fayyadamuun rakkoolee furuu.',
        ti: 'ተግባራዊ ስሌት ምፍታሕ።',
        ar: 'يركز هذا الفصل على النمذجة الرياضية وتنمية مهارات التفكير النقدي لدى الطلاب.',
        so: 'Xallinta mashaakilaadka xisaabta.',
        en: 'Focuses on analytical derivation, quantitative metrics, and rigorous problem-solving heuristics.',
      },
      examples: [],
      activities: [],
      experiments: [SAMPLE_LAB_EXPERIMENTS.titration],
      reviewExercises: [],
      supplementaryNote: {
        am: 'ተጨማሪ አጋዥ ማኑዋል ገፅ 21-45 ይመልከቱ።',
        om: 'Manual fuula 21-45 ilaalaa.',
        ti: 'ገጽ 21-45 ተመልከቱ።',
        ar: 'راجع الدليل الإثرائي الصفحات 21-45.',
        so: 'Tixraac bogga 21-45.',
        en: 'Supplementary: Refer to Curriculum Handbook pp. 21-45.',
      },
    },
    {
      unitNumber: 3,
      title: {
        am: 'ምዕራፍ 3፡ የላቦራቶሪ ሙከራዎች እና ምርመራ (Laboratory Investigations)',
        om: 'Boqonnaa 3: Qormaata Laabooratoorii',
        ti: 'ምዕራፍ 3፡ ፈተነታት ላቦራቶሪ',
        ar: 'الوحدة 3: التجارب المعملية والاستقصاء العلمي التجريبي',
        so: 'Cutubka 3: Tijaabooyinka Shaybaarka',
        en: 'Unit 3: Experimental Methods and Laboratory Investigations',
      },
      startPage: 113,
      endPage: 168,
      theoryContent: {
        am: 'ተግባራዊ የላቦራቶሪ ሙከራዎች፣ የኬሚካል እና የፊዚክስ መለኪያዎች፣ እና የሳይንሳዊ ምልከታ ዘዴዎች በዚህ ምዕራፍ ስር በዝርዝር ቀርበዋል።',
        om: 'Qormaata qabatamaa laabooratoorii.',
        ti: 'ተግባራዊ ናይ ላቦራቶሪ ፈተነታት።',
        ar: 'تجارب تطبيقية معملية توضح آليات الرصد وقياس المتغيرات وتحليل النتائج.',
        so: 'Daraasaadka shaybaarka la taaban karo.',
        en: 'Comprehensive experimental methodologies, apparatus hygiene, and empirical data analysis.',
      },
      examples: [],
      activities: [],
      experiments: [SAMPLE_LAB_EXPERIMENTS.photosynthesis],
      reviewExercises: [],
      supplementaryNote: {
        am: 'የላቦራቶሪ ማንዋል ገፅ 46-70 ይመልከቱ።',
        om: 'Lab manual fuula 46-70 ilaalaa.',
        ti: 'ገጽ 46-70 ተመልከቱ።',
        ar: 'راجع دليل المختبر الصفحات 46-70.',
        so: 'Tixraac buugga shaybaarka bogga 46-70.',
        en: 'Supplementary: Laboratory Safety Manual pp. 46-70.',
      },
    },
    {
      unitNumber: 4,
      title: {
        am: 'ምዕራፍ 4፡ የብሔራዊ ፈተና ማጠቃለያ እና ዝግጅት (EUEE Exam Blueprint)',
        om: 'Boqonnaa 4: Qophii Qormaata Biyyoolessaa',
        ti: 'ምዕራፍ 4፡ ምድላው ብሔራዊ ፈተና',
        ar: 'الوحدة 4: مراجعة الامتحانات الوزارية ونماذج التقييم الوطني',
        so: 'Cutubka 4: U diyaar garowga Imtixaanka Qaranka',
        en: 'Unit 4: National Examination Blueprint & Comprehensive Review',
      },
      startPage: 169,
      endPage: 220,
      theoryContent: {
        am: 'የትምህርት ሚኒስቴር የብሔራዊ ፈተናዎች ማዕቀፍ እና የፈተና ጥያቄዎች አወጣጥ ስልቶች የተካተቱበት የማጠቃለያ ምዕራፍ ነው።',
        om: 'Qophii qormaata biyyoolessaa EAES.',
        ti: 'ናይ ብሔራዊ ፈተና ምድላው።',
        ar: 'نماذج امتحانية شاملة مصممة وفق معايير هيئة التقييم والامتحانات الإثيوبية EAES.',
        so: 'Su\'aalaha imtixaanka heer qaran.',
        en: 'Capstone review encompassing EAES national assessment criteria and entrance examination item banks.',
      },
      examples: [],
      activities: [],
      experiments: [SAMPLE_LAB_EXPERIMENTS.kinematics],
      reviewExercises: [],
      supplementaryNote: {
        am: 'የፈተና ባንክ ገፅ 71-110 ይመልከቱ።',
        om: 'Exam bank fuula 71-110 ilaalaa.',
        ti: 'ገጽ 71-110 ተመልከቱ።',
        ar: 'راجع بنك الأسئلة الصفحات 71-110.',
        so: 'Tixraac bankiga imtixaanka bogga 71-110.',
        en: 'Supplementary: National Exam Bank pp. 71-110.',
      },
    },
  ];
}

// -------------------------------------------------------------
// MASTER REPOSITORY OF TEXTBOOKS FOR ALL GRADES 9-12
// -------------------------------------------------------------
export const COMPREHENSIVE_TEXTBOOKS_REGISTRY: TextbookRecord[] = [
  // ===========================================================
  // GRADE 9 TEXTBOOKS
  // ===========================================================
  {
    id: 'tb-g9-math',
    grade: 9,
    subjectCode: 'MATH',
    subjectName: {
      am: 'ሂሳብ',
      om: 'Herrega',
      ti: 'ሒሳብ',
      ar: 'الرياضيات',
      so: 'Xisaabta',
      en: 'Mathematics',
    },
    title: {
      am: 'የክፍል 9 የሂሳብ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም አዲሱ ስርዓተ-ትምህርት)',
      om: 'Kitaaba Barataa Herrega Kutaa 9ffaa (Sirna Barnootaa Haaraa)',
      ti: 'ናይ ክፍሊ 9 ናይ ሒሳብ መጽሓፍ ተምሃራይ',
      ar: 'كتاب الرياضيات للصف التاسع (المنهج الإثيوبي الجديد 2019 ت.إ)',
      so: 'Buugga Xisaabta Fasalka 9aad ee Manhalka Cusub',
      en: 'Grade 9 Student Mathematics Textbook (FDRE MoE New Curriculum)',
    },
    category: 'official_textbook',
    coverColor: 'emerald',
    totalPages: 248,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/mathematics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/mathematics_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fmathematics_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 24582048,
    md5Checksum: 'e89f812a6cb84e7f912b70d58c19a4e1',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('MATH', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-phys',
    grade: 9,
    subjectCode: 'PHYS',
    subjectName: {
      am: 'ፊዚክስ',
      om: 'Fiiziksii',
      ti: 'ፊዚክስ',
      ar: 'الفيزياء',
      so: 'Fiisigiska',
      en: 'Physics',
    },
    title: {
      am: 'የክፍል 9 የፊዚክስ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም)',
      om: 'Kitaaba Barataa Fiiziksii Kutaa 9ffaa (2019 A.L.I)',
      ti: 'ናይ ክፍሊ 9 ናይ ፊዚክስ መጽሓፍ ተምሃራይ',
      ar: 'كتاب الفيزياء للصف التاسع (المنهج الإثيوبي الحديث 2019 ت.إ)',
      so: 'Buugga Fiisigiska Fasalka 9aad',
      en: 'Grade 9 Student Physics Textbook (FDRE MoE New Curriculum)',
    },
    category: 'official_textbook',
    coverColor: 'amber',
    totalPages: 218,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/physics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/physics_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fphysics_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 21495808,
    md5Checksum: 'b71a938c4f92d1a58c03e8f411b9c20a',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('PHYS', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-chem',
    grade: 9,
    subjectCode: 'CHEM',
    subjectName: {
      am: 'ኬሚስትሪ',
      om: 'Keemistirii',
      ti: 'ኬሚስትሪ',
      ar: 'الكيمياء',
      so: 'Kimisteriga',
      en: 'Chemistry',
    },
    title: {
      am: 'የክፍል 9 የኬሚስትሪ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም)',
      om: 'Kitaaba Keemistirii Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 ናይ ኬሚስትሪ መጽሓፍ ተምሃራይ',
      ar: 'كتاب الكيمياء للصف التاسع (المنهج الإثيوبي الجديد)',
      so: 'Buugga Kimisteriga Fasalka 9aad',
      en: 'Grade 9 Student Chemistry Textbook (FDRE MoE)',
    },
    category: 'official_textbook',
    coverColor: 'cyan',
    totalPages: 210,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/chemistry.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/chemistry_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fchemistry_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 19824640,
    md5Checksum: 'f32d881a7b03c2e19d45a90184c7e3f2',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('CHEM', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-bio',
    grade: 9,
    subjectCode: 'BIO',
    subjectName: {
      am: 'ባዮሎጂ',
      om: 'Baayoloojii',
      ti: 'ባዮሎጂ',
      ar: 'الأحياء',
      so: 'Bayoolojiga',
      en: 'Biology',
    },
    title: {
      am: 'የክፍል 9 የባዮሎጂ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም)',
      om: 'Kitaaba Baayoloojii Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 ናይ ባዮሎጂ መጽሓፍ',
      ar: 'كتاب الأحياء للصف التاسع (المنهج الإثيوبي الجديد)',
      so: 'Buugga Bayoolojiga Fasalka 9aad',
      en: 'Grade 9 Student Biology Textbook',
    },
    category: 'official_textbook',
    coverColor: 'emerald',
    totalPages: 232,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/biology.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/biology_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fbiology_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 26411008,
    md5Checksum: 'a12c84918e7d2f094b88a9134c0e5a91',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('BIO', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-eng',
    grade: 9,
    subjectCode: 'ENG',
    subjectName: {
      am: 'እንግሊዝኛ',
      om: 'Afaan Ingilizii',
      ti: 'እንግሊዝኛ',
      ar: 'اللغة الإنجليزية',
      so: 'Ingiriisiga',
      en: 'English',
    },
    title: {
      am: 'የክፍል 9 የእንግሊዝኛ ቋንቋ የመማሪያ መጽሐፍ (English for Ethiopia)',
      om: 'Kitaaba Ingilizii Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 እንግሊዝኛ መጽሓፍ',
      ar: 'كتاب اللغة الإنجليزية للصف التاسع (English for Ethiopia)',
      so: 'Buugga Ingiriisiga Fasalka 9aad',
      en: 'Grade 9 Student English Textbook (English for Ethiopia)',
    },
    category: 'official_textbook',
    coverColor: 'blue',
    totalPages: 220,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/english.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/english_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fenglish_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 20185088,
    md5Checksum: 'c90e118f7a932b14c810a9f5d341b892',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('ENG', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-it',
    grade: 9,
    subjectCode: 'IT',
    subjectName: {
      am: 'የኢንፎርሜሽን ቴክኖሎጂ (ICT)',
      om: 'Teeknooloojii Odeeffannoo (ICT)',
      ti: 'ኢንፎርሜሽን ቴክኖሎጂ (ICT)',
      ar: 'تكنولوجيا المعلومات والاتصالات (ICT)',
      so: 'Teknoolajiyada Macluumaadka (ICT)',
      en: 'Information Technology (IT)',
    },
    title: {
      am: 'የክፍል 9 የኢንፎርሜሽን ቴክኖሎጂ ይፋዊ የመማሪያ መጽሐፍ',
      om: 'Kitaaba IT Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 ናይ IT መጽሓፍ',
      ar: 'كتاب تكنولوجيا المعلومات للصف التاسع',
      so: 'Buugga IT Fasalka 9aad',
      en: 'Grade 9 Student Information Technology Textbook',
    },
    category: 'official_textbook',
    coverColor: 'purple',
    totalPages: 196,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/it.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/it_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fit_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 18452480,
    md5Checksum: 'd88f91048b2a7e139c01f84b729a1e05',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('IT', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-hist',
    grade: 9,
    subjectCode: 'HIST',
    subjectName: {
      am: 'ታሪክ',
      om: 'Seenaa',
      ti: 'ታሪክ',
      ar: 'التاريخ',
      so: 'Taariikhda',
      en: 'History',
    },
    title: {
      am: 'የክፍል 9 የታሪክ ይፋዊ የመማሪያ መጽሐፍ (የኢትዮጵያና የአለም ታሪክ)',
      om: 'Kitaaba Seenaa Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 ናይ ታሪክ መጽሓፍ',
      ar: 'كتاب التاريخ للصف التاسع (تاريخ إثيوبيا والعالم)',
      so: 'Buugga Taariikhda Fasalka 9aad',
      en: 'Grade 9 Student History Textbook (Ethiopian & World History)',
    },
    category: 'official_textbook',
    coverColor: 'amber',
    totalPages: 204,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/history.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/history_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fhistory_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 22105600,
    md5Checksum: 'a718c99b2401f930e12b7a94c1e8203f',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('HIST', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-geog',
    grade: 9,
    subjectCode: 'GEOG',
    subjectName: {
      am: 'ጂኦግራፊ',
      om: 'Ji\'oogiraafii',
      ti: 'ጂኦግራፊ',
      ar: 'الجغرافيا',
      so: 'Juqraafiga',
      en: 'Geography',
    },
    title: {
      am: 'የክፍል 9 የጂኦግራፊ ይፋዊ የመማሪያ መጽሐፍ',
      om: 'Kitaaba Ji\'oogiraafii Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 ናይ ጂኦግራፊ መጽሓፍ',
      ar: 'كتاب الجغرافيا للصف التاسع (جغرافيا إثيوبيا والقرن الأفريقي)',
      so: 'Buugga Juqraafiga Fasalka 9aad',
      en: 'Grade 9 Student Geography Textbook (Ethiopia and the Horn)',
    },
    category: 'official_textbook',
    coverColor: 'emerald',
    totalPages: 212,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/geography.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/geography_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fgeography_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 25165824,
    md5Checksum: 'e01a884f93217b98d120a84e629c118b',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('GEOG', 9),
    drmProtected: true,
  },
  {
    id: 'tb-g9-cit',
    grade: 9,
    subjectCode: 'CIT',
    subjectName: {
      am: 'የዜግነት ትምህርት',
      om: 'Barnoota Lammummaa',
      ti: 'ናይ ዜግነት ትምህርቲ',
      ar: 'التربية الوطنية والمواطنة',
      so: 'Waddaniyadda',
      en: 'Citizenship Education',
    },
    title: {
      am: 'የክፍል 9 የዜግነት ትምህርት ይፋዊ የመማሪያ መጽሐፍ',
      om: 'Kitaaba Lammummaa Kutaa 9ffaa',
      ti: 'ናይ ክፍሊ 9 ዜግነት መጽሓፍ',
      ar: 'كتاب التربية الوطنية للصف التاسع',
      so: 'Buugga Waddaniyadda Fasalka 9aad',
      en: 'Grade 9 Student Citizenship Education Textbook',
    },
    category: 'official_textbook',
    coverColor: 'indigo',
    totalPages: 180,
    pdfUrl: 'https://moe.gov.et/textbooks/grade9/citizenship.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade9/citizenship_g9_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade9%2Fcitizenship_g9_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 16777216,
    md5Checksum: 'b8192a00c71e884f2910d54a6120b9e8',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('CIT', 9),
    drmProtected: true,
  },

  // ===========================================================
  // GRADE 10 TEXTBOOKS
  // ===========================================================
  {
    id: 'tb-g10-math',
    grade: 10,
    subjectCode: 'MATH',
    subjectName: {
      am: 'ሂሳብ',
      om: 'Herrega',
      ti: 'ሒሳብ',
      ar: 'الرياضيات',
      so: 'Xisaabta',
      en: 'Mathematics',
    },
    title: {
      am: 'የክፍል 10 የሂሳብ ይፋዊ የመማሪያ መጽሐፍ',
      om: 'Kitaaba Herrega Kutaa 10ffaa',
      ti: 'ናይ ክፍሊ 10 ሒሳብ መጽሓፍ',
      ar: 'كتاب الرياضيات للصف العاشر (المنهج الإثيوبي الحديث)',
      so: 'Buugga Xisaabta Fasalka 10aad',
      en: 'Grade 10 Student Mathematics Textbook',
    },
    category: 'official_textbook',
    coverColor: 'emerald',
    totalPages: 385,
    pdfUrl: 'https://moe.gov.et/textbooks/grade10/mathematics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade10/mathematics_g10_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade10%2Fmathematics_g10_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 27262976,
    md5Checksum: 'd39a1140e791b8f41029c71e84a20b19',
    syncStatus: 'synced',
    chaptersCount: 7,
    chapters: GRADE_10_MATH_CHAPTERS,
    drmProtected: true,
  },
  {
    id: 'tb-g10-phys',
    grade: 10,
    subjectCode: 'PHYS',
    subjectName: {
      am: 'ፊዚክስ',
      om: 'Fiiziksii',
      ti: 'ፊዚክስ',
      ar: 'الفيزياء',
      so: 'Fiisigiska',
      en: 'Physics',
    },
    title: {
      am: 'የክፍል 10 የፊዚክስ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም)',
      om: 'Kitaaba Fiiziksii Kutaa 10ffaa',
      ti: 'ናይ ክፍሊ 10 ፊዚክስ መጽሓፍ',
      ar: 'كتاب الفيزياء للصف العاشر',
      so: 'Buugga Fiisigiska Fasalka 10aad',
      en: 'Grade 10 Student Physics Textbook',
    },
    category: 'official_textbook',
    coverColor: 'amber',
    totalPages: 220,
    pdfUrl: 'https://moe.gov.et/textbooks/grade10/physics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade10/physics_g10_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade10%2Fphysics_g10_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 24117248,
    md5Checksum: 'f192b800e84a77192b01c94e8210a5e8',
    syncStatus: 'synced',
    chaptersCount: 6,
    chapters: GRADE_10_PHYSICS_CHAPTERS,
    drmProtected: true,
  },
  {
    id: 'tb-g10-chem',
    grade: 10,
    subjectCode: 'CHEM',
    subjectName: {
      am: 'ኬሚስትሪ',
      om: 'Keemistirii',
      ti: 'ኬሚስትሪ',
      ar: 'الكيمياء',
      so: 'Kimisteriga',
      en: 'Chemistry',
    },
    title: {
      am: 'የክፍል 10 የኬሚስትሪ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም)',
      om: 'Kitaaba Keemistirii Kutaa 10ffaa',
      ti: 'ናይ ክፍሊ 10 ኬሚስትሪ መጽሓፍ',
      ar: 'كتاب الكيمياء للصف العاشر (الأحماض والقواعد والمحاليل)',
      so: 'Buugga Kimisteriga Fasalka 10aad',
      en: 'Grade 10 Student Chemistry Textbook',
    },
    category: 'official_textbook',
    coverColor: 'cyan',
    totalPages: 236,
    pdfUrl: 'https://moe.gov.et/textbooks/grade10/chemistry.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade10/chemistry_g10_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade10%2Fchemistry_g10_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 23592960,
    md5Checksum: 'e9021a884f12b7719a00c81e94a50b81',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('CHEM', 10),
    drmProtected: true,
  },
  {
    id: 'tb-g10-bio',
    grade: 10,
    subjectCode: 'BIO',
    subjectName: {
      am: 'ባዮሎጂ',
      om: 'Baayoloojii',
      ti: 'ባዮሎጂ',
      ar: 'الأحياء',
      so: 'Bayoolojiga',
      en: 'Biology',
    },
    title: {
      am: 'የክፍል 10 የባዮሎጂ ይፋዊ የመማሪያ መጽሐፍ',
      om: 'Kitaaba Baayoloojii Kutaa 10ffaa',
      ti: 'ናይ ክፍሊ 10 ባዮሎጂ መጽሓፍ',
      ar: 'كتاب الأحياء للصف العاشر (الوراثة وعلم الأحياء الدقيقة)',
      so: 'Buugga Bayoolojiga Fasalka 10aad',
      en: 'Grade 10 Student Biology Textbook (Genetics & Microbiology)',
    },
    category: 'official_textbook',
    coverColor: 'emerald',
    totalPages: 250,
    pdfUrl: 'https://moe.gov.et/textbooks/grade10/biology.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade10/biology_g10_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade10%2Fbiology_g10_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 25690112,
    md5Checksum: 'a910e8824b01c791f820a4b7190e8812',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('BIO', 10),
    drmProtected: true,
  },

  // ===========================================================
  // GRADE 11 TEXTBOOKS
  // ===========================================================
  {
    id: 'tb-g11-math-nat',
    grade: 11,
    subjectCode: 'MATH_NAT',
    subjectName: {
      am: 'የተፈጥሮ ሳይንስ ሂሳብ',
      om: 'Herrega Saayinsii Uumamaa',
      ti: 'ሒሳብ ተፈጥሮ ሳይንስ',
      ar: 'رياضيات العلوم الطبيعية',
      so: 'Xisaabta Sayniska Dabiiciga ah',
      en: 'Natural Science Mathematics',
    },
    title: {
      am: 'የክፍል 11 የተፈጥሮ ሳይንስ ሂሳብ የመማሪያ መጽሐፍ',
      om: 'Kitaaba Herrega Kutaa 11ffaa (Natural Science)',
      ti: 'ናይ ክፍሊ 11 ናይ ተፈጥሮ ሳይንስ ሒሳብ መጽሓፍ',
      ar: 'كتاب الرياضيات للصف الحادي عشر - فرع العلوم الطبيعية',
      so: 'Buugga Xisaabta Fasalka 11aad ee Sayniska Dabiiciga ah',
      en: 'Grade 11 Natural Science Mathematics (Matrices, Vectors & Sequences)',
    },
    category: 'official_textbook',
    coverColor: 'indigo',
    totalPages: 310,
    pdfUrl: 'https://moe.gov.et/textbooks/grade11/mathematics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade11/mathematics_g11_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade11%2Fmathematics_g11_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 31457280,
    md5Checksum: 'a8192a00c71e884f2910d54a6120b991',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('MATH', 11),
    drmProtected: true,
  },
  {
    id: 'tb-g11-phys',
    grade: 11,
    subjectCode: 'PHYS',
    subjectName: {
      am: 'ፊዚክስ',
      om: 'Fiiziksii',
      ti: 'ፊዚክስ',
      ar: 'الفيزياء',
      so: 'Fiisigiska',
      en: 'Physics',
    },
    title: {
      am: 'የክፍል 11 የፊዚክስ ይፋዊ የመማሪያ መጽሐፍ (2019 ዓ.ም)',
      om: 'Kitaaba Fiiziksii Kutaa 11ffaa',
      ti: 'ናይ ክፍሊ 11 ፊዚክስ መጽሓፍ',
      ar: 'كتاب الفيزياء للصف الحادي عشر (الميكانيكا والموجات)',
      so: 'Buugga Fiisigiska Fasalka 11aad',
      en: 'Grade 11 Student Physics Textbook (Mechanics, Waves & Thermodynamics)',
    },
    category: 'official_textbook',
    coverColor: 'amber',
    totalPages: 290,
    pdfUrl: 'https://moe.gov.et/textbooks/grade11/physics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade11/physics_g11_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade11%2Fphysics_g11_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 29884416,
    md5Checksum: 'f910e8824b01c791f820a4b7190e8819',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('PHYS', 11),
    drmProtected: true,
  },

  // ===========================================================
  // GRADE 12 TEXTBOOKS
  // ===========================================================
  {
    id: 'tb-g12-math',
    grade: 12,
    subjectCode: 'MATH',
    subjectName: {
      am: 'ሂሳብ (ካልክለስ)',
      om: 'Herrega (Calculus)',
      ti: 'ሒሳብ (ካልኩለስ)',
      ar: 'الرياضيات (التفاضل والتكامل)',
      so: 'Xisaabta (Calculus)',
      en: 'Mathematics (Calculus)',
    },
    title: {
      am: 'የክፍል 12 የሂሳብና ካልክለስ የመማሪያ መጽሐፍ (የዩኒቨርስቲ መግቢያ ዝግጅት 2019 ዓ.ም)',
      om: 'Kitaaba Herrega Kutaa 12ffaa (Qophii Qormaata Yuunivarsiitii)',
      ti: 'ናይ ክፍሊ 12 ሒሳብ መጽሓፍ',
      ar: 'كتاب الرياضيات والتفاضل والتكامل للصف الثاني عشر (الإعداد للامتحان الوطني)',
      so: 'Buugga Xisaabta Fasalka 12aad',
      en: 'Grade 12 Advanced Mathematics & Calculus Textbook (EUEE Blueprint)',
    },
    category: 'official_textbook',
    coverColor: 'indigo',
    totalPages: 340,
    pdfUrl: 'https://moe.gov.et/textbooks/grade12/calculus.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade12/mathematics_calculus_g12_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade12%2Fmathematics_calculus_g12_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 34603008,
    md5Checksum: 'e89f812a6cb84e7f912b70d58c19a4e9',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('MATH', 12),
    drmProtected: true,
  },
  {
    id: 'tb-g12-phys',
    grade: 12,
    subjectCode: 'PHYS',
    subjectName: {
      am: 'ፊዚክስ',
      om: 'Fiiziksii',
      ti: 'ፊዚክስ',
      ar: 'الفيزياء',
      so: 'Fiisigiska',
      en: 'Physics',
    },
    title: {
      am: 'የክፍል 12 የላቀ ፊዚክስ የመማሪያ መጽሐፍ (ኤሌክትሮማግኔቲዝም እና ኳንተም)',
      om: 'Kitaaba Fiiziksii Kutaa 12ffaa',
      ti: 'ናይ ክፍሊ 12 ፊዚክስ መጽሓፍ',
      ar: 'كتاب الفيزياء المتقدم للصف الثاني عشر (الكهرومغناطيسية وفيزياء الكم)',
      so: 'Buugga Fiisigiska Fasalka 12aad',
      en: 'Grade 12 Advanced Physics Textbook (Electromagnetism & Quantum)',
    },
    category: 'official_textbook',
    coverColor: 'amber',
    totalPages: 310,
    pdfUrl: 'https://moe.gov.et/textbooks/grade12/physics.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/textbooks/grade12/physics_g12_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/textbooks%2Fgrade12%2Fphysics_g12_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 32505856,
    md5Checksum: 'f8192a00c71e884f2910d54a6120b111',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('PHYS', 12),
    drmProtected: true,
  },

  // ===========================================================
  // SUPPLEMENTARY BOOKS & EXAM BANKS
  // ===========================================================
  {
    id: 'supp-formula-hb',
    grade: 12,
    subjectCode: 'SUPP_STEM',
    subjectName: {
      am: 'የሳይንስ ፎርሙላ ማጠቃለያ',
      om: 'Kuusaa Foormulaawwan',
      ti: 'ናይ ሳይንስ ፎርሙላታት',
      ar: 'دليل القوانين والمعادلات',
      so: 'Qaacidooyinka Sayniska',
      en: 'STEM Formula Handbook',
    },
    title: {
      am: 'የኢትዮጵያ ሁለተኛ ደረጃ የሳይንስና ሂሳብ ፎርሙላ ማጠቃለያ (STEM Formula Handbook)',
      om: 'Kuusaa Foormulaawwan Saayinsii fi Herregaa Kutaa 9-12',
      ti: 'ናይ ኢትዮጵያ ካልኣይ ብርኪ ሳይንስን ሒሳብን ፎርሙላ ማኑዋል',
      ar: 'دليل القوانين الشامل للرياضيات والعلوم للمرحلة الثانوية الإثيوبية',
      so: 'Buug-gacmeedka Qaacidooyinka Sayniska iyo Xisaabta',
      en: 'Ethiopian High School STEM Formula Handbook (Grades 9-12)',
    },
    category: 'supplementary_guide',
    coverColor: 'indigo',
    totalPages: 148,
    pdfUrl: 'https://moe.gov.et/supplementary/stem_formula_handbook.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/supplementary/stem_formula_handbook_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/supplementary%2Fstem_formula_handbook_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 15728640,
    md5Checksum: 'c7192a00c71e884f2910d54a6120b444',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('PHYS', 12),
    drmProtected: true,
  },
  {
    id: 'supp-lab-manual-moe',
    grade: 10,
    subjectCode: 'SUPP_LAB',
    subjectName: {
      am: 'የላቦራቶሪ ማንዋል',
      om: 'Qajeelfama Laabooratoorii',
      ti: 'ናይ ላቦራቶሪ መምርሒ',
      ar: 'دليل التجارب المخبرية',
      so: 'Buugga Shaybaarka',
      en: 'STEM Laboratory Manual',
    },
    title: {
      am: 'የሁለተኛ ደረጃ ትምህርት ቤት የላቦራቶሪ ሙከራዎች እና ደህንነት መመሪያ (MoE STEM Laboratory Manual)',
      om: 'Qajeelfama Qormaata Laabooratoorii fi Nageenyaa (MoE Lab Manual)',
      ti: 'ናይ ላቦራቶሪ ፈተነታትን ድሕንነትን መምርሒ',
      ar: 'الدليل العملي المعتمد للتجارب المخبرية وقواعد السلامة للمرحلة الثانوية',
      so: 'Buug-gacmeedka Tijaabooyinka Shaybaarka iyo Badbaadada',
      en: 'High School STEM Laboratory Experiment & Safety Manual',
    },
    category: 'lab_manual',
    coverColor: 'cyan',
    totalPages: 112,
    pdfUrl: 'https://moe.gov.et/supplementary/stem_lab_manual.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/supplementary/stem_lab_manual_moe_2019ec.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/supplementary%2Fstem_lab_manual_moe_2019ec.pdf?alt=media',
    fileSizeBytes: 12582912,
    md5Checksum: 'b7192a00c71e884f2910d54a6120b555',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('CHEM', 10),
    drmProtected: true,
  },
  {
    id: 'supp-euee-bank',
    grade: 12,
    subjectCode: 'SUPP_EUEE',
    subjectName: {
      am: 'የመግቢያ ፈተና ባንክ',
      om: 'Kuusaa Qormaata EUEE',
      ti: 'ናይ EUEE ፈተና ባንክ',
      ar: 'بنك أسئلة امتحان القبول الوزاري',
      so: 'Bankiga Imtixaanka EUEE',
      en: 'National EUEE Exam Bank',
    },
    title: {
      am: 'የኢትዮጵያ ዩኒቨርስቲ መግቢያ ፈተናዎች የተሟላ የመልስ ማብራሪያ መጽሐፍ (EUEE 2012-2025 Bank)',
      om: 'Kuusaa Deebii Qormaata Yuunivarsiitii Biyyoolessaa (EUEE Solutions 2012-2025)',
      ti: 'ናይ ዩኒቨርስቲ መእተዊ ፈተናታት መጽሓፍ መልሲ',
      ar: 'البنك الوطني الشامل لحلول امتحانات القبول الجامعي الوزارية (EUEE/ESSLCE)',
      so: 'Buugga Xallinta Imtixaanka Qaranka ee Jaamacadda (EUEE)',
      en: 'National University Entrance Examination Comprehensive Solution Manual (EUEE 2012-2025)',
    },
    category: 'exam_bank',
    coverColor: 'purple',
    totalPages: 320,
    pdfUrl: 'https://moe.gov.et/supplementary/euee_solution_bank.pdf',
    firebaseStoragePath: 'gs://nur-ai-moe-curriculum.firebasestorage.app/supplementary/euee_solution_bank_2012_2025.pdf',
    firebaseDownloadUrl: 'https://firebasestorage.googleapis.com/v0/b/nur-ai-moe-curriculum.firebasestorage.app/o/supplementary%2Feuee_solution_bank_2012_2025.pdf?alt=media',
    fileSizeBytes: 33554432,
    md5Checksum: 'a7192a00c71e884f2910d54a6120b666',
    syncStatus: 'synced',
    chaptersCount: 4,
    chapters: buildChaptersForSubject('MATH', 12),
    drmProtected: true,
  },
];

export const TEXTBOOKS_REGISTRY = COMPREHENSIVE_TEXTBOOKS_REGISTRY;

export function getTextbooksByGrade(grade: GradeLevel): TextbookRecord[] {
  return COMPREHENSIVE_TEXTBOOKS_REGISTRY.filter(
    (b) => b.grade === grade && b.category === 'official_textbook'
  );
}

export function getSupplementaryBooks(grade?: GradeLevel): TextbookRecord[] {
  return COMPREHENSIVE_TEXTBOOKS_REGISTRY.filter(
    (b) => b.category !== 'official_textbook'
  );
}

export function getCurriculumMasterIndex(grade: GradeLevel): {
  coreSubjects: TextbookRecord[];
  supplementaryGuides: TextbookRecord[];
} {
  return {
    coreSubjects: getTextbooksByGrade(grade),
    supplementaryGuides: getSupplementaryBooks(grade),
  };
}
