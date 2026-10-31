import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  FileText,
  FlaskConical,
  Zap,
  Dna,
  Gauge,
  Compass,
  ShieldCheck,
  Award,
  HelpCircle,
  Edit3,
  Save,
  Check,
  ChevronRight,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export interface VideoBookmark {
  timeSeconds: number;
  timeLabel: string;
  title: Record<Language, string>;
  notesSummary: Record<Language, string>;
  keyFormulas?: string[];
}

export interface LabQuizQuestion {
  id: string;
  question: Record<Language, string>;
  options: string[];
  correctIndex: number;
  explanation: Record<Language, string>;
}

export interface VideoLabRecord {
  id: string;
  title: Record<Language, string>;
  category: 'Chemistry' | 'Physics' | 'Biology' | 'General STEM';
  grade: number;
  duration: string;
  durationSeconds: number;
  instructor: string;
  institution: string;
  thumbnailBadge: string;
  videoSvgAnimation: 'titration' | 'induction' | 'dissection' | 'kinematics' | 'spectro';
  description: Record<Language, string>;
  safetyDirectives: Record<Language, string>[];
  bookmarks: VideoBookmark[];
  quiz: LabQuizQuestion[];
}

export const VIDEO_LAB_EXPERIMENTS: VideoLabRecord[] = [
  // 1. Acid-Base Titration Lab
  {
    id: 'vid-chem-titration',
    title: {
      am: 'የአሲድና ቤዝ ቲትሬሽን ተግባራዊ ላቦራቶሪ (Acid-Base Volumetric Titration)',
      om: 'Qormaata Laabooratoorii Titireeshinii Asidii fi Beezii',
      ti: 'ተግባራዊ ፈተነ ቲትሬሽን ኣሲድን ቤዝን',
      ar: 'المعايرة الحجمية للأحماض والقواعد عملياً وتحديد نقطة التكافؤ',
      so: 'Tijaabada Shaybaarka ee Aashitada iyo Saldhigga (Titration)',
      en: 'Acid-Base Volumetric Titration & Stoichiometric End-Point Determination',
    },
    category: 'Chemistry',
    grade: 10,
    duration: '14:20 min',
    durationSeconds: 860,
    instructor: 'Teacher Senait K. (MoE Senior Science Fellow)',
    institution: 'Addis Ababa Secondary STEM Demonstration Center',
    thumbnailBadge: 'Lab Exp 2.1',
    videoSvgAnimation: 'titration',
    description: {
      am: 'የሃይድሮክሎሪክ አሲድ (0.10 M HCl) እና የሶዲየም ሃይድሮክሳይድ (0.10 M NaOH) ቲትሬሽን በፌኖልፍታሊን (Phenolphthalein) አመልካች በመጠቀም የገለልተኛነት ነጥብ (Equivalence Point) የመለየት ተግባራዊ ሙከራ።',
      om: 'Titireeshinii HCl fi NaOH beekuuf qormaata laabooratoorii gaggeeffamu.',
      ti: 'ናይ ኬሚስትሪ ፈተነ ቲትሬሽን HCl ምስ NaOH።',
      ar: 'معايرة حمض الهيدروكلوريك 0.10M ضد هيدروكسيد الصوديوم باستخدام دليل الفينولفثالين لتحديد نقطة نهاية المعايرة الدقيقة وحساب التركيز المولي.',
      so: 'Tijaabada titration-ka ee lagu ogaanayo xaddiga aashitada iyo saldhigga.',
      en: 'High-precision titration of 0.10 M HCl with standard 0.10 M NaOH using phenolphthalein indicator to observe the exact faint-pink equivalence end-point.',
    },
    safetyDirectives: [
      {
        am: 'የዓይን መከላከያ መነፅር እና የላብ ኮት መልበስ ግዴታ ነው።',
        om: 'Uffata laabooratoorii fi eegumsa ijaa uffachuun dirqama.',
        ti: 'መነፅር ድሕንነትን ጋዋንን ምኽዳን ግዴታ እዩ።',
        ar: 'ارتداء نظارات الأمان المخبرية والمعطف الواقي إلزامي قبل التعامل مع الأحماض.',
        so: 'Xidho muraayadaha badbaadada iyo jaakada shaybaarka.',
        en: 'Chemical splash goggles and impervious lab aprons required at all times.',
      },
      {
        am: 'አሲድ ቆዳ ላይ ቢፈስ ወዲያውኑ በብዙ ውሃ ለ15 ደቂቃ መታጠብ አለበት።',
        om: 'Asidiin yoo dhangala\'e bishaan baay\'een dhiqaa.',
        ti: 'ኣሲድ እንተፈሲሱ ብብዙሕ ማይ ተሓጸቡ።',
        ar: 'في حال انسكاب الحمض، اغسل المنطقة المصابة بكميات وفيرة من الماء الجاري فوراً.',
        so: 'Haddii aashitada ay kugu daadato, ku mayr biyo badan.',
        en: 'In case of dermal acid contact, flush continuously under the safety shower for 15 minutes.',
      },
    ],
    bookmarks: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: {
          am: 'የመሳሪያዎች አቀማመጥ እና ደህንነት (Apparatus & Safety)',
          om: 'Meeshaalee fi Nageenya',
          ti: 'መሳርሒታትን ድሕንነትን',
          ar: 'تجهيز الأدوات وقواعد السلامة المخبرية',
          so: 'Qalabka iyo Badbaadada',
          en: 'Burette Stand Assembly & Eye Protection Protocols',
        },
        notesSummary: {
          am: 'ቢዩሬት (Burette 50 mL)፣ ፒፔት (25 mL Pipette) እና የኮኒካል ፍላስክ (Conical flask) ዝግጅት።',
          om: 'Qophii Biyeureetii fi koonikaal fulaaskii.',
          ti: 'ምድላው ቢዩሬትን ኮኒካል ፍላስክን።',
          ar: 'تثبيت السحاحة سعة 50 مل بدقة رأسية والتأكد من عدم وجود فقاعات هواء في فوهتها.',
          so: 'Diyaarinta qalabka titration-ka.',
          en: 'Vertical clamping of 50 mL class-A burette and bubble purging in the stopcock tip.',
        },
        keyFormulas: ['Meniscus Alignment at Eye Level', 'Burette Zero-Mark Calibration'],
      },
      {
        timeSeconds: 150,
        timeLabel: '02:30',
        title: {
          am: 'የመፍትሄዎች ዝግጅት እና ፒፔቲንግ (Pipetting 25 mL HCl)',
          om: 'Qophii Bulbulaa',
          ti: 'ምድላው መፍትሒታት',
          ar: 'سحب 25 مل من حمض HCl وإضافة قطرات الدليل',
          so: 'Qiyaasta 25 mL ee HCl',
          en: 'Volumetric Transfer of 25.0 mL HCl & 2 Drops Indicator',
        },
        notesSummary: {
          am: '25.0 mL ያልታወቀ HCl በፒፔት ወደ ኮኒካል ፍላስክ መውሰድ እና 2-3 ጠብታ ፌኖልፍታሊን መጨመር።',
          om: 'HCl 25 mL fuutee fulaaskii keessa naquu.',
          ti: '25 mL HCl ብፒፔት ናብ ፍላስክ ምእታው።',
          ar: 'استخدام الماصة الحجمية لنقل 25.0 مل من الحمض مع إضافة قطرتين من الفينولفثالين (عديم اللون في الوسط الحمضي).',
          so: 'Ku darista 2 dhibcood oo indicator ah.',
          en: 'Transfer exactly 25.0 mL acid with safety bulb; add 2 drops phenolphthalein (remains clear in acid pH < 8.2).',
        },
        keyFormulas: ['pH < 8.2: Colorless', 'pH > 8.2: Pale Faint Pink'],
      },
      {
        timeSeconds: 360,
        timeLabel: '06:00',
        title: {
          am: 'የቲትሬሽን ሂደት እና የጠብታ ቁጥጥር (Titration Titrant Delivery)',
          om: 'Adeemsa Titireeshinii',
          ti: 'መስርሕ ቲትሬሽን',
          ar: 'إجراء المعايرة والتحريك المستمر حتى نقطة النهاية',
          so: 'Habka Titration-ka',
          en: 'Controlled Swirling and Drop-Wise Titration Near End-Point',
        },
        notesSummary: {
          am: 'NaOH በቢዩሬት በኩል ቀስ እያሉ እያማሰሉ መጨመር፤ ቀለም መቀየር ሲጀምር በአንድ ጠብታ ፍጥነት ማፍሰስ።',
          om: 'NaOH suuta suutaan dabaluun sochoosuu.',
          ti: 'NaOH ብጥንቃቐ እናተሓወሰ ምውሳኽ።',
          ar: 'إنزال محلول هيدروكسيد الصوديوم مع التحريك الدائري المستمر للوصول إلى لون وردي باهت يستمر لـ 30 ثانية.',
          so: 'Ku shubida NaOH si tartiib ah.',
          en: 'Swirl conical flask continuously; slow to half-drop delivery as local pink color persists longer.',
        },
        keyFormulas: ['M_A \\cdot V_A = M_B \\cdot V_B', 'n_{H^+} = n_{OH^-}'],
      },
      {
        timeSeconds: 620,
        timeLabel: '10:20',
        title: {
          am: 'የመጨረሻ ነጥብ እና ስሌት (End-Point & Molarity Calculation)',
          om: 'Shallaggii Xumuraa',
          ti: 'ናይ መወዳእታ ስሌት',
          ar: 'قراءة السحاحة وحساب التركيز المولي للحمض',
          so: 'Xisaabinta Molarity-ga',
          en: 'Burette Reading & Stoichiometric Concentration Calculation',
        },
        notesSummary: {
          am: 'የወጣው የNaOH መጠን 24.8 mL ሆኖ ተመዝግቧል። በዚህም $M_{HCl} = \\frac{0.10 \\times 24.8}{25.0} = 0.0992\\text{ M}$ ይሰላል።',
          om: 'Shallaggii moolaaritii xumuruu: M = 0.0992 M.',
          ti: 'ስሌት ሞላሪቲ: M = 0.0992 M.',
          ar: 'حجم القاعدة المستهلك 24.8 مل: $M_A = \\frac{0.10 \\times 24.8}{25.0} = 0.0992\\text{ M}$.',
          so: 'Xisaabinta ugu dambaysa: M = 0.0992 M.',
          en: 'Observed NaOH volume = 24.8 mL. Calculated molarity: $M_A = \\frac{M_B \\times V_B}{V_A} = 0.0992\\text{ M}$.',
        },
        keyFormulas: ['M_A = \\frac{M_B \\cdot V_B}{V_A}', 'Percent Error = \\frac{|Exp - True|}{True} \\times 100\\%'],
      },
    ],
    quiz: [
      {
        id: 'tit-q1',
        question: {
          am: 'በአሲድ-ቤዝ ቲትሬሽን ወቅት የቢዩሬት ንባብ (Meniscus) እንዴት መነበብ አለበት?',
          om: 'Biyeureetii irratti qabxiin akkamiin dubbifama?',
          ti: 'ናይ ቢዩሬት ንባብ ብኸመይ ይንበብ?',
          ar: 'كيف يجب قراءة مستوى السائل (Meniscus) في السحاحة المخبرية؟',
          so: 'Sidee loo akhriyaa heerka dareeraha ee burette-ka?',
          en: 'How should the liquid level (meniscus) in a glass burette be accurately read?',
        },
        options: [
          'A. Bottom of the concave curve at eye level (የታችኛው የቀስት ኩርባ ከዓይን ትይዩ)',
          'B. Top edge of the liquid surface',
          'C. Estimated from above looking downward',
          'D. Any random level along the graduation',
        ],
        correctIndex: 0,
        explanation: {
          am: 'ሁልጊዜ በውሃ ላይ ለተመሰረቱ መፍትሄዎች የኮንኬቭ ኩርባው ታችኛው ክፍል ከዓይን ትይዩ ሆኖ መነበብ አለበት፤ ይሄም የParallax ስህተትን ያስቀራል።',
          om: 'Gara jalaa sarara ijaa wajjin qixxeessanii dubbisu.',
          ti: 'ናይቲ ኩርባ ታሕተዋይ ክፋል ምስ ዓይኒ ማዕረ ኮይኑ ይንበብ።',
          ar: 'تقرأ دائماً النقطة السفلى للتقعر السطحي (Concave Meniscus) في مستوى خط النظر مباشرة لتفادي خطأ زاوية الرؤية (Parallax error).',
          so: 'Qaybta hoose ee qalooca heerka isha.',
          en: 'Always read at the bottom of the concave meniscus with the eye level directly horizontal to eliminate parallax error.',
        },
      },
      {
        id: 'tit-q2',
        question: {
          am: '25.0 mL የ 0.10 M HCl አሲድን ሙሉ በሙሉ ለማጥፋት (Neutralize) ስንት mL የ 0.05 M NaOH ያስፈልጋል?',
          om: 'HCl 25.0 mL (0.10 M) balleessuuf NaOH (0.05 M) meeqa barbaachisa?',
          ti: 'ክንደይ mL ናይ 0.05 M NaOH የድሊ?',
          ar: 'كم مل من 0.05M NaOH يلزم لمعادلة 25.0 مل من 0.10M HCl تماماً؟',
          so: 'Meeqa mL oo 0.05 M NaOH ah ayaa loo baahan yahay?',
          en: 'What volume of 0.050 M NaOH is required to completely neutralize 25.0 mL of 0.10 M HCl?',
        },
        options: [
          'A. 50.0 mL',
          'B. 25.0 mL',
          'C. 12.5 mL',
          'D. 100.0 mL',
        ],
        correctIndex: 0,
        explanation: {
          am: 'ቀመሩ፡ $M_A \\cdot V_A = M_B \\cdot V_B \\Rightarrow 0.10 \\times 25.0 = 0.05 \\times V_B \\Rightarrow V_B = \\frac{2.5}{0.05} = 50.0\\text{ mL}$።',
          om: 'V_B = (0.10 * 25.0) / 0.05 = 50.0 mL.',
          ti: 'V_B = 50.0 mL ይኸውን።',
          ar: 'بتطبيق قانون المعايرة: $M_A V_A = M_B V_B \\Rightarrow (0.10)(25.0) = (0.05)(V_B) \\Rightarrow V_B = 50.0\\text{ mL}$.',
          so: 'V_B = (0.10 * 25.0) / 0.05 = 50.0 mL.',
          en: 'Using stoichiometric molarity equation: $M_A V_A = M_B V_B \\Rightarrow V_B = \\frac{0.10 \\times 25.0}{0.05} = 50.0\\text{ mL}$.',
        },
      },
      {
        id: 'tit-q3',
        question: {
          am: 'በጠንካራ አሲድ እና ጠንካራ ቤዝ ቲትሬሽን ላይ የፌኖልፍታሊን አመልካች ወደ ፈዛዛ ሮዝ የሚቀየረው በምን የ pH ክልል ላይ ነው?',
          om: 'Fenoolfitaaliiniin pH meeqa irratti gara bildimaatti jijjiirama?',
          ti: 'ፌኖልፍታሊን ናብ ሮዝ ዝቕየር ኣብ ክንደይ pH እዩ?',
          ar: 'عند أي مدى للرقم الهيدروجيني (pH) يتحول دليل الفينولفثالين إلى اللون الوردي الباهت؟',
          so: 'Waa maxay cabbirka pH ee phenolphthalein uu ku noqdo casaan khafiif ah?',
          en: 'In strong acid - strong base titration, at what transition pH range does phenolphthalein turn faint pink?',
        },
        options: [
          'A. pH 8.2 - 10.0',
          'B. pH 1.0 - 3.0',
          'C. pH 4.0 - 6.0',
          'D. Exactly pH 7.00 only',
        ],
        correctIndex: 0,
        explanation: {
          am: 'የፌኖልፍታሊን የቀለም መቀየሪያ ክልል ከ pH 8.2 እስከ 10.0 ነው። አንድ ጠብታ የቤዝ ትርፍ የፍላስኩን pH ከ 7 ወደ 8.3 በማሳደግ ፈዛዛ ሮዝ ቀለም ያመጣል።',
          om: 'pH 8.2 - 10.0 gidduutti halluu jijjiira.',
          ti: 'ኣብ መንጎ pH 8.2 - 10.0 ሕብሪ ይቕይር።',
          ar: 'نطاق تغير لون الفينولفثالين هو pH 8.2 - 10.0؛ نقطة تكافؤ الحمض والقوي والقاعدة القوية تقع في القفزة الرأسية للمنحنى.',
          so: 'pH 8.2 - 10.0 ayaa ah xadka uu midabka ku beddelo.',
          en: 'Phenolphthalein transition range is pH 8.2 - 10.0. The steep inflection curve of strong acid-base crosses this range with a single drop.',
        },
      },
    ],
  },

  // 2. Faraday's Electromagnetic Induction
  {
    id: 'vid-phys-induction',
    title: {
      am: 'የፋራዳይ ኤሌክትሮማግኔቲክ ኢንዳክሽን ላቦራቶሪ (Faraday Induction & Lenz\'s Law)',
      om: 'Qormaata Elektiroomaagneetiizimii Faaraadaay',
      ti: 'ፈተነ ኤሌክትሮማግኔቲክ ኢንዳክሽን ፋራዳይ',
      ar: 'الحث الكهرومغناطيسي لفرداي وقاعدة لينز وتطبيقات توربينات سد النهضة',
      so: 'Tijaabada Indhisheenta Korontada ee Faraday',
      en: "Faraday's Law of Electromagnetic Induction & Lenz's Law Mechanics",
    },
    category: 'Physics',
    grade: 12,
    duration: '16:05 min',
    durationSeconds: 965,
    instructor: 'Eng. Solomon T. (Hydro-Engineering Specialist)',
    institution: 'Ethiopian Institute of Technology & GERD Modeling Center',
    thumbnailBadge: 'Lab Exp 4.2',
    videoSvgAnimation: 'induction',
    description: {
      am: 'ባለ 500 እና 1000 ዙር መጠምጠሚያ ሽቦዎችን (Coils) በመጠቀም ኃይለኛ የኒዮዲሚየም ማግኔት ወደ መጠምጠሚያው ሲገባና ሲወጣ በጋልቫኖሜትር ላይ የሚፈጠረውን የቮልቴጅ እና የኤሌክትሪክ ፍሰት አቅጣጫ የሚያሳይ ሙከራ።',
      om: 'Maagneetii fi kooyilii fayyadamuun elektirikii uumuu.',
      ti: 'ብማግኔትን ሽቦን ኤሌክትሪክ ናይ ምፍጣር ፈተነ።',
      ar: 'دراسة حركية إدخال وإخراج مغناطيس النيوديميوم داخل ملف لولبي وملاحظة انحراف مؤشر الجلفانومتر وتحقيق قانون فرداي وقاعدة لينز.',
      so: 'Tijaabada dhalinta korontada iyadoo la adeegsanayo magnet iyo coil.',
      en: 'Rigorous demonstration using 500-turn and 1000-turn solenoids with neodymium magnets, center-zero galvanometer, demonstrating induced EMF (EMF = -N ΔΦ/Δt) and GERD turbine physics.',
    },
    safetyDirectives: [
      {
        am: 'ኃይለኛ ኒዮዲሚየም ማግኔቶች እጅን ሊቆነጥጡ ስለሚችሉ በጥንቃቄ ይያዙ።',
        om: 'Maagneetii jabaa waan ta\'eef harka keessan eegaa.',
        ti: 'ሓያል ማግኔት ስለዝኾነ ኢድኩም ተጠንቀቑ።',
        ar: 'مغناطيس النيوديميوم قوي جداً، يجب الحذر من انحصار الأصابع بين المغناطيس وأي سطح معدني.',
        so: 'Ka taxaddar magnet-ka xoogga badan.',
        en: 'High-grade neodymium magnets pose pinch hazards; keep clear of metallic tools and electronics.',
      },
    ],
    bookmarks: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: {
          am: 'የማግኔቲክ ፍሰት እና የጋልቫኖሜትር ዝግጅት',
          om: 'Qophii Gaalvaanoomeetirii',
          ti: 'ምድላው ጋልቫኖሜትር',
          ar: 'توصيل الملف اللولبي بالجلفانومتر الحساس ذي الصفر الأوسط',
          so: 'Diyaarinta Galvanometer-ka',
          en: 'Apparatus Wiring: Solenoid, Core & Center-Zero Galvanometer',
        },
        notesSummary: {
          am: 'የመጠምጠሚያ ሽቦውን ጫፎች ከዜሮ-መሃል ጋልቫኖሜትር ጋር ያለ ባትሪ ማገናኘት።',
          om: 'Kooyilii gaalvaanoomeetirii wajjin walqabsiisuu.',
          ti: 'ሽቦ ምስ ጋልቫኖሜትር ምትእስሳር።',
          ar: 'توصيل طرفي الملف اللولبي مباشرة بالجلفانومتر دون وجود أي مصدر خارجي للجهد.',
          so: 'Xiritaanka coil-ka iyo galvanometer-ka.',
          en: 'Connect solenoid leads directly to micro-galvanometer; zero baseline confirmed.',
        },
        keyFormulas: ['Induced Current Requires Changing Flux', '\\Phi_B = B \\cdot A \\cdot \\cos\\theta'],
      },
      {
        timeSeconds: 180,
        timeLabel: '03:00',
        title: {
          am: 'የሰሜን ዋልታ መግባትና የሌንዝ ህግ (North Pole Inward & Lenz\'s Rule)',
          om: 'Seera Leenzii Qorachuu',
          ti: 'ሕጊ ሌንዝ ምምርማር',
          ar: 'تقريب القطب الشمالي وقاعدة لينز لمعاكسة التغير في التدفق',
          so: 'Xeerka Lenz iyo Qudbada Waqooyi',
          en: 'North Pole Plunge: Lenz Opposition Current & Left Deflection',
        },
        notesSummary: {
          am: 'የማግኔቱ የሰሜን ዋልታ ወደ መጠምጠሚያው ሲገባ፣ መጠምጠሚያው የራሱን ሰሜን ዋልታ ፈጥሮ ማግኔቱን ይገፈትራል (Lenz\'s Law)።',
          om: 'Maagneetiin seenu dhiibbaa uuma.',
          ti: 'ማግኔት ክኣቱ ከሎ ተጻራሪ ኃይሊ ይፍጠር።',
          ar: 'عند تقريب القطب الشمالي، يولد الملف تياراً حثياً ينشئ قطباً شمالياً مشابهاً لمقاومة الاقتراب.',
          so: 'Xeerka Lenz wuxuu sheegayaa in tayaarku ka soo horjeedo isbeddelka.',
          en: 'Induced current generates repulsive North pole to oppose incoming flux (conservation of energy).',
        },
        keyFormulas: ['\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}', 'Lenz\'s Negative Sign Denotes Opposition'],
      },
      {
        timeSeconds: 420,
        timeLabel: '07:00',
        title: {
          am: 'የፍጥነት እና የዙር ብዛት ተጽእኖ (Speed & Number of Turns N)',
          om: 'Dhiibbaa Saffisaa fi Lakkoofsa Kooyilii',
          ti: 'ተፅዕኖ ቅልጣፈን ዙርያን',
          ar: 'أثر سرعة التحريك وزيادة عدد لفات الملف على القوة الدافعة',
          so: 'Saameynta Xawaaraha iyo Tirada Wareegyada',
          en: 'Impact of Plunge Speed (Δt) and Doubling Coil Turns (N = 1000)',
        },
        notesSummary: {
          am: 'ማግኔቱ በፍጥነት ሲንቀሳቀስ ወይም የመጠምጠሚያው ዙር ሲያድግ የቮልቴጅ መርፌው በእጥፍ ይዘላል።',
          om: 'Saffisni yoo dabalu elektirikii caalaatu uumama.',
          ti: 'ቅልጣፈ ክውስኽ ከሎ ቮልቴጅ ይውስኽ።',
          ar: 'زيادة سرعة حركة المغناطيس تضاعف معدل تغير التدفق الزمني، ومضاعفة عدد اللفات N تضاعف الجهد الناتج.',
          so: 'Xawaaraha kordhay wuxuu keenaa koronto badan.',
          en: 'Induced EMF scales linearly with N and inversely with passage time Δt.',
        },
        keyFormulas: ['\\mathcal{E} \\propto N', '\\mathcal{E} \\propto \\frac{1}{\\Delta t}'],
      },
    ],
    quiz: [
      {
        id: 'ind-q1',
        question: {
          am: 'በፋራዳይ ህግ መሰረት፣ በመጠምጠሚያ ሽቦ ውስጥ የተፈጠረው የኤሌክትሮሞቲቭ ኃይል (Induced EMF) ቀመር የትኛው ነው?',
          om: 'Akka seera Faaraadaayitti EMFn akkamiin shallagama?',
          ti: 'ብመሰረት ሕጊ ፋራዳይ ቀመር EMF ኣየናይ እዩ?',
          ar: 'وفق قانون فرداي للحث، ما هي الصيغة الرياضية لحساب القوة الدافعة الكهربائية الحثية (EMF)؟',
          so: 'Waa maxay qaaciddada Faraday ee xisaabinta EMF?',
          en: "According to Faraday's Law, what is the formula for the magnitude of induced EMF in a coil?",
        },
        options: [
          'A. \\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}',
          'B. \\mathcal{E} = I \\cdot R',
          'C. \\mathcal{E} = \\frac{1}{2} C V^2',
          'D. \\mathcal{E} = B \\cdot I \\cdot L',
        ],
        correctIndex: 0,
        explanation: {
          am: 'የፋራዳይ ህግ፡ $\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$፤ ኔጌቲቭ ምልክቱ የሌንዝን ህግ (ተቃራኒ አቅጣጫ) ያመለክታል።',
          om: 'EMF = -N * (delta Phi / delta t).',
          ti: 'EMF = -N * (delta Phi / delta t).',
          ar: 'الصيغة الصحيحة هي $\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$، وإشارة السالب تعبر عن قاعدة لينز لمعاكسة التغير في التدفق.',
          so: 'EMF = -N * (delta Phi / delta t).',
          en: "Faraday's law states $\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$, where the negative sign represents Lenz's opposition principle.",
        },
      },
      {
        id: 'ind-q2',
        question: {
          am: 'አንድ ማግኔት በመጠምጠሚያ ሽቦ ውስጥ ሳይንቀሳቀስ ዝም ብሎ ቢቀመጥ (Stationary Magnet)، በጋልቫኖሜትር ላይ ምን ይታያል?',
          om: 'Maagneetiin osoo hin socho\'in kooyilii keessa yoo taa\'e maaltu ta\'a?',
          ti: 'ማግኔት ከይተንቀሳቐሰ እንተተቐሚጡ እንታይ ይኸውን?',
          ar: 'إذا ثُبت المغناطيس ساكناً داخل الملف اللولبي دون أي حركة، ماذا يشير مؤشر الجلفانومتر؟',
          so: 'Haddii magnet-ku uu deggan yahay gudaha coil-ka, maxaa dhacaya?',
          en: 'If a strong magnet is held completely stationary inside a solenoid, what is the galvanometer reading?',
        },
        options: [
          'A. Exactly zero deflection (ምንም የኤሌክትሪክ ፍሰት አይኖርም)',
          'B. Maximum positive deflection',
          'C. Constant alternating vibration',
          'D. Full scale negative deflection',
        ],
        correctIndex: 0,
        explanation: {
          am: 'የኤሌክትሪክ ፍሰት የሚፈጠረው የማግኔቲክ ፍሰቱ በጊዜ ሂደት ሲቀየር ($\\Delta \\Phi / \\Delta t \\neq 0$) ብቻ ነው። ማግኔቱ ካልተንቀሳቀሰ $\\Delta \\Phi = 0$ ስለሆነ ቮልቴጁ ዜሮ ነው።',
          om: 'Sochiin yoo hin jiraanne elektirikii hin uumamu (zeeroo dha).',
          ti: 'ምንቅስቓስ ስለዘየለ ቮልቴጅ ዜሮ እዩ።',
          ar: 'شرط تولد تيار حثي هو التغير الزمني في التدفق المغناطيسي ($\\Delta \\Phi / \\Delta t$). وبما أن المغناطيس ساكن، فإن معدل التغير صفر والقراءة صفر.',
          so: 'Maadaama aysan jirin wax dhaqdhaqaaq ah, korontadu waa eber.',
          en: 'Induced EMF strictly requires a non-zero time rate of change of magnetic flux (ΔΦ/Δt ≠ 0). Stationary magnet = zero induced EMF.',
        },
      },
      {
        id: 'ind-q3',
        question: {
          am: 'በታላቁ የኢትዮጵያ ህዳሴ ግድብ (GERD) ተርባይኖች ውስጥ ኤሌክትሪክ የሚመነጨው በየትኛው የፊዚክስ መርህ መሰረት ነው?',
          om: 'Hidha Haaromsa Guddicha Itoophiyaa keessatti elektirikii akkamiin omishama?',
          ti: 'ኣብ ግድብ ህዳሴ ኤሌክትሪክ ዝምንጭሉ መትከል ኣየናይ እዩ?',
          ar: 'في توربينات سد النهضة الإثيوبي الكبير (GERD)، ما المبدأ الفيزيائي المطبق لتوليد الكهرباء؟',
          so: 'Mabaadii\'da fiisigiska ee loo isticmaalo dhalinta korontada GERD waa maxay?',
          en: 'In the hydroelectric power generators of the Grand Ethiopian Renaissance Dam (GERD), electricity is produced via:',
        },
        options: [
          'A. Electromagnetic induction by rotating giant electromagnets within stator coils',
          'B. Direct chemical oxidation of river minerals',
          'C. Nuclear fission of heavy water',
          'D. Static piezoelectric friction',
        ],
        correctIndex: 0,
        explanation: {
          am: 'የውሃ ግፊት ተርባይኑን ሲያሽከረክረው፣ ሮተር ውስጥ ያሉት ኤሌክትሮማግኔቶች በስታተር መጠምጠሚያዎች ውስጥ ይሽከረከራሉ፤ ይህም በፋራዳይ ህግ መሰረት 5,150 MW ኤሌክትሪክ ያመነጫል።',
          om: 'Elektiroomaagneetizimii fayyadamuun omishama.',
          ti: 'ብኤሌክትሮማግኔቲክ ኢንዳክሽን ኤሌክትሪክ ይምንጭ።',
          ar: 'تحول التوربينات طاقة حركة مياه النيل إلى طاقة ميكانيكية لتدوير مغانم ضخمة داخل ملفات المولد لإنتاج الكهرباء بالحث الكهرومغناطيسي.',
          so: 'Indhisheenta korontada iyadoo la wareejinayo magnet-yada.',
          en: 'Hydrostatic water head rotates hydraulic Francis turbines, turning rotor electromagnets past stator windings to induce high-voltage AC via Faraday induction.',
        },
      },
    ],
  },

  // 3. Frog Dissection & Vertebrate Anatomy
  {
    id: 'vid-bio-frog',
    title: {
      am: 'የእንቁራሪት የሰውነት አካል ቅንብር እና ስርዓተ-ልብ ላቦራቶሪ (Vertebrate Frog Dissection)',
      om: 'Qormaata Baayoloojii Qorannoo Qaama Qamalee/Raachaa',
      ti: 'ናይ ባዮሎጂ ፈተነ እንቁራሪት (Frog Dissection)',
      ar: 'تشريح الضفدع ودراسة الجهاز الدوري ثلاثي الحجرات والتشريح المقارن',
      so: 'Qaliinka Rah-ka iyo Qaabdhismeedka Wadnaha',
      en: 'Amphibian Biology: Frog Dissection & Three-Chambered Cardiovascular Circulation',
    },
    category: 'Biology',
    grade: 11,
    duration: '18:15 min',
    durationSeconds: 1095,
    instructor: 'Dr. Bekele M. (Comparative Anatomy Curator)',
    institution: 'National Natural History & Life Sciences Museum',
    thumbnailBadge: 'Lab Exp 3.1',
    videoSvgAnimation: 'dissection',
    description: {
      am: 'የእንቁራሪት የሰውነት ክፍሎችን (Ventral Dissection)፣ ባለ ሶስት ክፍል ልብ (2 Atria, 1 Ventricle)፣ የሳንባና የቆዳ አተነፋፈስ (Pulmocutaneous respiration) እንዲሁም የሆድ ዕቃ አካላትን በደረጃ የሚያስረዳ ተግባራዊ ቪዲዮ።',
      om: 'Qaama raachaa tarsaasuun qaama garaa keessaa qorachuu.',
      ti: 'ምምርማር ኣካላት እንቁራሪትን ልብን።',
      ar: 'تشريح جدار البطن للضفدع وتثبيت الأطراف بدبابيس التشريح، والتعرف على القلب ثلاثي الحجرات، الكبد، الرئتين، والقناة الهضمية.',
      so: 'Barashada xubnaha gudaha ee rah-ka.',
      en: 'Systematic ventral incision of preserved Rana temporaria specimen, isolating the 3-chambered heart (conus arteriosus), pulmocutaneous circulation, and liver lobes.',
    },
    safetyDirectives: [
      {
        am: 'የቀዶ ጥገና ምላጭ (Scalpel) እና መቀስ ሲያዙ እጅን እንዳይቆርጥ ሁልጊዜ ከሰውነት በተቃራኒ አቅጣጫ መቁረጥ ያስፈልጋል።',
        om: 'Meeshaa qara qabu of eeggannoon qabadhaa.',
        ti: 'መላጭን መቐስን ብጥንቃቐ ምሓዝ የድሊ።',
        ar: 'استخدام المشرط ومقص التشريح بحذر دائماً بالقطع بعيداً عن اتجاه الجسم والأصابع.',
        so: 'U isticmaal mindida qalliinka si taxaddar leh.',
        en: 'Direct cutting edges of scalpel and dissecting scissors away from hands and body.',
      },
    ],
    bookmarks: [
      {
        timeSeconds: 0,
        timeLabel: '00:00',
        title: {
          am: 'የመበለቻ ሰሌዳ ዝግጅት እና ፒን ማድረግ (Dissection Pan Pinning)',
          om: 'Qophii Meeshaa Qorannoo',
          ti: 'ምድላው ሰሌዳ ፈተነ',
          ar: 'تثبيت الضفدع في حوض التشريح على السطح البطني',
          so: 'Diyaarinta Saambalka',
          en: 'Ventral Positioning in Wax Pan & 45-Degree Limb Pinning',
        },
        notesSummary: {
          am: 'እንቁራሪቱን በሆዱ በኩል (Ventral side) ወደ ላይ አድርጎ በመበለቻ ሰሌዳ ላይ በአራቱም እግሮች ፒን ማድረግ።',
          om: 'Raacha garaa oliin laafisuun qabsiisuu.',
          ti: 'ኣብ ሰሌዳ ምጥባቕ።',
          ar: 'وضع الضفدع على ظهره وتثبيت الأطراف الأربعة بدبابيس مائلة بزاوية 45 درجة في طبقة الشمع.',
          so: 'Ku dhejinta rah-ka saxanka qalliinka.',
          en: 'Secure specimen with ventral side facing upwards; insert pins at 45° angles through feet.',
        },
        keyFormulas: ['Dorsal = Back / Ventral = Belly', 'Anterior = Head / Posterior = Tail'],
      },
      {
        timeSeconds: 240,
        timeLabel: '04:00',
        title: {
          am: 'የቆዳ እና የጡንቻ መክፈቻ (Skin & Muscle Incision)',
          om: 'Gogaa fi Maashaa Baqaqsuu',
          ti: 'ቆርበት ምኽፋት',
          ar: 'إجراء الشق الطولي في الجلد والعضلات ورفع عظمة القص',
          so: 'Jeexitaanka Maqaarka iyo Muruqa',
          en: 'Midventral Skin Incision, Pectoral Girdle Cut & Flap Pinning',
        },
        notesSummary: {
          am: 'ከዳሌው ጀምሮ እስከ አገጭ ድረስ ቆዳውን በመቀስ ቀስ ብሎ መቁረጥ፤ ውስጠኛውን አካል ላለመንካት ቆዳውን ወደ ላይ አንስቶ መቁረጥ።',
          om: 'Gogaa ol kaasuun suuta tarsaasu.',
          ti: 'ቆርበት ብመቐስ ምቑራፅ።',
          ar: 'رفع الجلد بالملاقط والقص بحذر بمقص غير حاد الطرف لتجنب إتلاف الأعضاء الحشوية الداخلية.',
          so: 'Jaridda maqaarka iyadoo la ilaalinayo xubnaha gudaha.',
          en: 'Lift abdominal skin with forceps; make midline scissors incision without puncturing internal organs.',
        },
        keyFormulas: ['Pectoral Girdle Bisection', 'Peritoneal Cavity Exposure'],
      },
      {
        timeSeconds: 510,
        timeLabel: '08:30',
        title: {
          am: 'ባለ ሶስት ክፍል ልብ እና የደም ዝውውር (Three-Chambered Heart)',
          om: 'Onnee Raachaa Qorachuu',
          ti: 'ናይ እንቁራሪት ልቢ ምምርማር',
          ar: 'فحص القلب ثلاثي الحجرات: أذينان وبطين واحد ومخروط شرياني',
          so: 'Baaritaanka Wadnaha Rah-ka',
          en: 'Cardiovascular Morphology: Right & Left Atria, Single Ventricle',
        },
        notesSummary: {
          am: 'የእንቁራሪት ልብ 2 Atrium እና 1 Ventricle አለው። ኦክስጅን ያለውና የሌለው ደም በከፊል በቬንትሪክል ውስጥ ይቀላቀላል።',
          om: 'Onneen raachaa kutaa sadii qaba.',
          ti: 'ልቢ እንቁራሪት 3 ክፋል ኣለዎ።',
          ar: 'يمتلك الضفدع قلباً مكوناً من 3 حجرات (أذين أيمن، أذين أيسر، وبطين مفرد يضخ الدم للجسم والرئتين والجلد).',
          so: 'Wadnaha rah-ka wuxuu ka kooban yahay 3 qol.',
          en: 'Amphibians feature two atria and one common ventricle; oxygenated and deoxygenated blood mix partially.',
        },
        keyFormulas: ['Amphibian Heart: 3 Chambers', 'Double Circulation (Pulmocutaneous + Systemic)'],
      },
    ],
    quiz: [
      {
        id: 'bio-q1',
        question: {
          am: 'የአዋቂ እንቁራሪት ልብ ስንት ክፍሎች (Chambers) አሉት?',
          om: 'Onneen raacha ga\'eessaa kutaa meeqa qaba?',
          ti: 'ልቢ እንቁራሪት ክንደይ ክፍሊ ኣለዎ?',
          ar: 'كم عدد حجرات قلب الضفدع البالغ؟',
          so: 'Meeqa qol ayuu leeyahay wadnaha rah-ka weyn?',
          en: 'How many anatomical chambers does an adult amphibian (frog) heart contain?',
        },
        options: [
          'A. 3 chambers (2 atria, 1 ventricle)',
          'B. 4 chambers (2 atria, 2 ventricles like mammals)',
          'C. 2 chambers (1 atrium, 1 ventricle like fish)',
          'D. 1 chamber only',
        ],
        correctIndex: 0,
        explanation: {
          am: 'የእንቁራሪት ልብ 3 ክፍሎች አሉት፦ ቀኝ አትሪየም፣ ግራ አትሪየም እና አንድ የጋራ ቬንትሪክል (Ventricle)።',
          om: 'Onneen raachaa kutaa 3 qaba: Atriyaa 2 fi Veentirikaala 1.',
          ti: 'ልቢ እንቁራሪት 3 ክፍሊ ኣለዎ።',
          ar: 'قلب البرمائيات (كالضفدع) يتكون من ثلاث حجرات: أذينان وبطين واحد مشترك.',
          so: 'Wadnaha rah-ku wuxuu leeyahay 3 qol.',
          en: 'Adult amphibians possess a three-chambered heart consisting of two atria and a single common muscular ventricle.',
        },
      },
    ],
  },
];

export const VideoLearningView: React.FC = () => {
  const { activeGrade, updateUserXP } = useAuth();
  const { language, isRtl } = useLanguage();

  // State
  const [activeVideoId, setActiveVideoId] = useState<string>(VIDEO_LAB_EXPERIMENTS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Interactive Student Notebook
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  // Lab Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const activeVideo = VIDEO_LAB_EXPERIMENTS.find((v) => v.id === activeVideoId) || VIDEO_LAB_EXPERIMENTS[0];

  // Restore student notes from localStorage on video change
  useEffect(() => {
    const saved = localStorage.getItem(`nur_lab_notes_${activeVideo.id}`);
    setStudentNotes(saved || '');
    setCurrentTimeSec(0);
    setIsPlaying(false);
    setIsQuizModalOpen(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [activeVideo.id]);

  // Handle Save Note
  const handleSaveNotes = () => {
    localStorage.setItem(`nur_lab_notes_${activeVideo.id}`, studentNotes);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2500);
  };

  // Seek video by clicking bookmark
  const handleJumpToBookmark = (seconds: number) => {
    setCurrentTimeSec(seconds);
    setIsPlaying(true);
  };

  // Find currently active bookmark
  const activeBookmark = activeVideo.bookmarks.reduce((prev, curr) => {
    return currentTimeSec >= curr.timeSeconds ? curr : prev;
  }, activeVideo.bookmarks[0]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulation timer when playing
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= activeVideo.durationSeconds) {
            setIsPlaying(false);
            return activeVideo.durationSeconds;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeVideo.durationSeconds]);

  // Quiz submission
  const handleSubmitQuiz = () => {
    let score = 0;
    activeVideo.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= Math.ceil(activeVideo.quiz.length * 0.7)) {
      updateUserXP(20);
    }
  };

  const filteredVideos = VIDEO_LAB_EXPERIMENTS.filter(
    (v) => activeCategory === 'ALL' || v.category === activeCategory
  );

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-amber-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-800/70 border border-rose-600/40 text-xs font-bold tracking-wide uppercase text-rose-200">
              <FlaskConical className="w-4 h-4 text-amber-300" />
              <span>Ethiopian MoE Standardized STEM Video Laboratory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Video className="w-7 h-7 text-rose-400" />
              {language === 'am'
                ? 'የተግባር ላቦራቶሪ እና ቪዲዮ ትምህርቶች ማዕከል'
                : language === 'om'
                ? 'Kuusaa Viidiyoo fi Qormaata Laabooratoorii'
                : language === 'ti'
                ? 'ማእኸል ቪዲዮን ተግባራዊ ላቦራቶሪን'
                : language === 'ar'
                ? 'مختبر الفيديو التفاعلي وتجارب العلوم التطبيقية'
                : language === 'so'
                ? 'Muuqaalada Shaybaarka Sayniska iyo Fiisigiska'
                : 'STEM Visual Video Lab & Experiment Demonstrations'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              {language === 'am'
                ? 'ደረጃቸውን የጠበቁ የኬሚስትሪ፣ ፊዚክስ እና ባዮሎጂ ላቦራቶሪ ሙከራዎች ከእነ የደህንነት መመሪያዎች፣ የታይምስታምፕ ማስታወሻዎች እና የላብ ፈተናዎች ጋር።'
                : 'Interactive STEM laboratory demonstrations featuring Acid-Base Titration, Faraday Induction, and Vertebrate Anatomy with synchronized companion notes and comprehension quizzes.'}
            </p>
          </div>

          {/* Quick Lab Quiz Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsQuizModalOpen(true);
              setQuizSubmitted(false);
              setQuizAnswers({});
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Award className="w-4 h-4" />
            <span>
              {language === 'am' ? 'የላቦራቶሪ ፈተና ውሰድ (+20 XP)' : 'Take Lab Quiz (+20 XP)'}
            </span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-6 pt-4 border-t border-rose-800/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {['ALL', 'Chemistry', 'Physics', 'Biology'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-sm font-black'
                  : 'bg-rose-950/60 text-rose-200 border-rose-800/60 hover:bg-rose-800/80 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Laboratories' : `${cat} Labs`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Player + Companion Notes (8 Cols) & Bookmarks/Playlist (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Active Segment Notes (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* HD Video Player Simulation Stage */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl relative">
            {/* Visual Screen Canvas */}
            <div className="relative aspect-video flex flex-col items-center justify-center p-6 text-white overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
              {/* Graphic Lab Visual Simulation */}
              <div className="relative z-10 text-center space-y-4 max-w-lg">
                <div className="w-20 h-20 rounded-2xl bg-rose-900/60 border border-rose-500/40 flex items-center justify-center mx-auto shadow-inner">
                  {activeVideo.category === 'Chemistry' ? (
                    <FlaskConical className="w-10 h-10 text-rose-400 animate-pulse" />
                  ) : activeVideo.category === 'Physics' ? (
                    <Zap className="w-10 h-10 text-amber-400 animate-bounce" />
                  ) : (
                    <Dna className="w-10 h-10 text-emerald-400 animate-pulse" />
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800/80 inline-block mb-1">
                    HD 1080p • {activeVideo.thumbnailBadge} • Grade {activeVideo.grade}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {activeBookmark.title[language] || activeBookmark.title.en}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {activeBookmark.notesSummary[language] || activeBookmark.notesSummary.en}
                  </p>
                </div>

                {/* Big Center Play/Pause button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 mx-auto"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Translucent Floating Watermark */}
              <div className="absolute top-4 right-4 pointer-events-none opacity-40 text-[10px] font-mono text-slate-400">
                MoE Curriculum Lab Stream • Session {activeVideo.id}
              </div>
            </div>

            {/* Video Control Bar */}
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-2">
              {/* Scrubber Progress Bar */}
              <div
                className="w-full bg-slate-800 h-2 rounded-full cursor-pointer relative overflow-hidden group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setCurrentTimeSec(Math.round(ratio * activeVideo.durationSeconds));
                }}
              >
                <div
                  className="bg-rose-500 h-full transition-all duration-150"
                  style={{
                    width: `${(currentTimeSec / activeVideo.durationSeconds) * 100}%`,
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTimeSec(0)}
                    className="hover:text-white transition-colors"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-[11px]">
                    {formatTime(currentTimeSec)} / {formatTime(activeVideo.durationSeconds)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed Selector */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-0.5 border border-slate-700 focus:outline-none"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>

                  <Volume2 className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Segment Companion Notes & Formulas */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">
                  Live Synchronized Companion Note ({activeBookmark.timeLabel})
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {activeBookmark.title[language] || activeBookmark.title.en}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsQuizModalOpen(true);
                  setQuizSubmitted(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'የዚህ ሙከራ ፈተና' : 'Take Lab Quiz'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeBookmark.notesSummary[language] || activeBookmark.notesSummary.en}
            </p>

            {/* Formulas for this segment */}
            {activeBookmark.keyFormulas && activeBookmark.keyFormulas.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Key Experimental Equations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeBookmark.keyFormulas.map((f, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-rose-950 dark:text-rose-200 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Protocol Strip */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-[11px] uppercase tracking-wider">
                  Laboratory Safety Directive:
                </span>
                <span>
                  {activeVideo.safetyDirectives[0][language] || activeVideo.safetyDirectives[0].en}
                </span>
              </div>
            </div>

            {/* Student Personal Lab Observation Notebook (Saved to localStorage) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    {language === 'am' ? 'የተማሪ የግል ላብ ማስታወሻ (Saved)' : 'Personal Lab Observations'}
                  </span>
                </label>
                {noteSavedToast && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>

              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                rows={3}
                placeholder={
                  language === 'am'
                    ? 'በዚህ ሙከራ ላይ ያስተዋሏቸውን መረጃዎች እና ስሌቶች እዚህ ይመዝግቡ...'
                    : 'Record your experimental observations, meniscus readings, and notes here...'
                }
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'ማስታወሻውን አስቀምጥ' : 'Save Observations'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timestamped Bookmarks & Playlist (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Timestamped Chapter Bookmarks */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {language === 'am' ? 'የሙከራው ምዕራፎች (Bookmarks)' : 'Timestamped Chapters'}
              </span>
            </h3>

            <div className="space-y-2">
              {activeVideo.bookmarks.map((b, idx) => {
                const isCurrent = activeBookmark.timeSeconds === b.timeSeconds;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleJumpToBookmark(b.timeSeconds)}
                    className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between text-xs ${
                      isCurrent
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-100 font-bold shadow-xs'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-rose-600">
                        {b.timeLabel}
                      </span>
                      <span className="line-clamp-1">{b.title[language] || b.title.en}</span>
                    </div>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other STEM Demonstrations in Library */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FlaskConical className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {language === 'am' ? 'ሌሎች የላቦራቶሪ ሙከራዎች' : 'STEM Lab Playlist'}
              </span>
            </h3>

            <div className="space-y-2">
              {filteredVideos.map((vid) => {
                const isSelected = vid.id === activeVideo.id;

                return (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => setActiveVideoId(vid.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all border flex items-start gap-3 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:border-rose-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center shrink-0 text-rose-700 dark:text-rose-300 font-bold text-xs mt-0.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {vid.title[language] || vid.title.en}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{vid.category} • Gr. {vid.grade}</span>
                        <span className="font-mono">{vid.duration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lab Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    {language === 'am' ? 'የላቦራቶሪ ግንዛቤ ፈተና' : 'Post-Demonstration Lab Quiz'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeVideo.title[language] || activeVideo.title.en}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQuizModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {activeVideo.quiz.map((q, qIdx) => {
                const userAns = quizAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs"
                  >
                    <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {qIdx + 1}. {q.question[language] || q.question.en}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === optIdx;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              setQuizAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx,
                              }))
                            }
                            className={`w-full p-3 rounded-lg text-left transition-all border flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-950 dark:text-emerald-100 shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {quizSubmitted && (
                      <div
                        className={`p-3 rounded-lg border text-[11px] ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        <span className="font-bold block">
                          {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
                        </span>
                        <p className="mt-1">{q.explanation[language] || q.explanation.en}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Score & Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              {quizSubmitted ? (
                <div className="text-xs font-bold text-emerald-600">
                  Your Score: {quizScore} / {activeVideo.quiz.length} Correct (+20 XP Earned!)
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  {Object.keys(quizAnswers).length} of {activeVideo.quiz.length} answered
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {language === 'am' ? 'ዝጋ' : 'Close'}
                </button>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length === 0}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-sm"
                  >
                    {language === 'am' ? 'መልሶችን አስረክብ' : 'Grade Quiz'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  >
                    {language === 'am' ? 'እንደገና ሞክር' : 'Retake Quiz'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
