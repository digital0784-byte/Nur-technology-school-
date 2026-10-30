import {
  VideoMasterclassItem,
  InteractiveSimulationItem,
  NationalExamPaper,
  VirtualExperimentItem,
  HighYieldAudioItem,
  AdaptiveStudyPlan
} from '../types/premium';

// ============================================================================
// HUB 1: HD VIDEO MASTERCLASSES (የቪዲዮ ማስተርክላስ ቤተ-መጽሐፍት)
// ============================================================================
export const PREMIUM_VIDEO_MASTERCLASSES: VideoMasterclassItem[] = [
  {
    id: 'vmc-math-poly-g10',
    grade: 10,
    subject: 'mathematics',
    title: {
      am: 'ፖሊኖሚያል ፈንክሽኖች እና የዜሮዎች ንድፈ-ሐሳብ ማስተርክላስ',
      om: 'Faankshinii Pooleenoomiyaalii fi Tiyeeramiiz Zeroo',
      ti: 'ፖሊኖሚያል ፈንክሽናትን ቲዮረም ዜሮታትን ማስተርክላስ',
      ar: 'دوال كثيرات الحدود ونظريات الأصفار المتقدمة',
      so: 'Masterclass-ka Xisaabta: Shaqooyinka Polynomial-ka',
      en: 'Polynomial Functions & Zero Theorems Comprehensive Masterclass'
    },
    subtitle: {
      am: 'የረዥም ክፍፍል፣ ሰው ሠራሽ ክፍፍል (Synthetic Division) እና የግራፍ ባህሪያት በዝርዝር',
      om: 'Qoodinsa dheeraa, Synthetic Division fi amala giraafii',
      ti: 'ነዊሕ ምክፍፋል፣ ሲንቴቲክ ዲቪዥንን ናይ ግራፍ ፀባያትን',
      ar: 'القسمة المطولة، القسمة التركيبية وسلوك المنحنيات البيانية',
      so: 'Qaybinta dheer, Qaybinta synthetic iyo dabeecadaha garaafka',
      en: 'Long division, synthetic division, Rational Root Theorem, and polynomial graph end behavior'
    },
    instructor: {
      name: 'መምህር አማረ ተፈራ (Dr. Amare Tefera)',
      role: 'Senior National Mathematics Curriculum Specialist',
      credentials: 'Addis Ababa University & MoE Exam Board Consultant'
    },
    durationFormatted: '48:30',
    durationSeconds: 2910,
    badge: 'EUEE High Yield ★★★★★',
    thumbnailGradient: 'from-amber-600 via-purple-900 to-indigo-950',
    singlePriceETB: 54,
    formulaCheatsheet: [
      'f(x) = a_n x^n + a_{n-1} x^{n-1} + ... + a_1 x + a_0',
      'Remainder Theorem: If f(x) is divided by (x - c), remainder = f(c)',
      'Factor Theorem: (x - c) is factor of f(x) iff f(c) = 0',
      'Rational Root Theorem: Possible roots are p/q where p | a_0 and q | a_n'
    ],
    chapters: [
      {
        id: 'c1',
        timeSeconds: 0,
        timeFormatted: '00:00',
        title: {
          am: 'መግቢያ እና የፖሊኖሚያል ፈንክሽን ፍቺ',
          om: 'Seensa fi Hiika Faankshinii Pooleenoomiyaalii',
          ti: 'መእተዊን ትርጉም ፖሊኖሚያል ፈንክሽንን',
          ar: 'مقدمة وتعريف دالة كثيرات الحدود',
          so: 'Hordhac iyo Qeexidda Shaqada Polynomial',
          en: 'Introduction & Formal Definition of Polynomial Functions'
        },
        keyTakeaway: {
          am: 'ፈንክሽኑ ፖሊኖሚያል ለመሆን ኤክስፖነንቶቹ ሙሉ ቁጥር (non-negative integer) መሆን አለባቸው።',
          om: 'Eksponentiin lakkoofsa guutuu ta\'uu qaba.',
          ti: 'ኤክስፖነንቱ ሙሉእ ቁፅሪ ክኸውን ኣለዎ።',
          ar: 'يجب أن تكون الأسس أعداداً صحيحة غير سالبة.',
          so: 'Awoodaha waa inay noqdaan tirooyin togan oo buuxa.',
          en: 'Degrees must be non-negative integers; negative or fractional powers disqualify polynomials.'
        }
      },
      {
        id: 'c2',
        timeSeconds: 780,
        timeFormatted: '13:00',
        title: {
          am: 'ሰው ሠራሽ ክፍፍል (Synthetic Division Technique)',
          om: 'Tarsiimoo Synthetic Division',
          ti: 'ሲንቴቲክ ዲቪዥን አሰራርሓ',
          ar: 'تقنية القسمة التركيبية السريعة',
          so: 'Farsamada Qaybinta Synthetic',
          en: 'Synthetic Division Fast-Track Method'
        },
        keyTakeaway: {
          am: 'ከረዥም ክፍፍል በ 5 እጥፍ ፈጣን ሲሆን መስመራዊ አካፋይ (x - c) ብቻ ሲኖር ይጠቅማል።',
          om: 'Yeroo qooduuf gargaara, qoodaa x - c qofaaf.',
          ti: 'ኣካፋሊኡ x - c ኣብ ዝኾነሉ እዋን ኣዝዩ ቅልጡፍ አሰራርሓ እዩ።',
          ar: 'أسرع بـ 5 أضعاف عندما يكون المقسوم عليه من الدرجة الأولى (x - c).',
          so: 'Aad u dhakhso badan marka wax lagu qaybinayo x - c.',
          en: '5x faster than algebraic long division when dividing by linear binomial (x - c).'
        }
      },
      {
        id: 'c3',
        timeSeconds: 1650,
        timeFormatted: '27:30',
        title: {
          am: 'የግራፍ ባህሪ እና የመጨረሻ ጫፎች አቅጣጫ (End Behavior)',
          om: 'Giraafii fi Kallattii Xumuraa (End Behavior)',
          ti: 'ባህሪ ግራፍን ናይ ጫፍ አቅጣጫን',
          ar: 'السلوك الطرفي للمنحنى البياني',
          so: 'Habka Dhamaadka Garaafka (End Behavior)',
          en: 'Polynomial Graph Analysis & End Behavior'
        },
        keyTakeaway: {
          am: 'የመሪው ቁጥር (Leading coefficient) ምልክት እና ዲግሪው እኩል (even) ወይም ጎዶሎ (odd) መሆን የመጨረሻውን ጫፍ ይወስናል።',
          om: 'Mallattoo qindeesituu duraa fi digirii irratti hundaa\'a.',
          ti: 'ምልክት ሊዲንግ ኮፊሸንትን ዲግሪን ናይ ጫፍ አቅጣጫ ይውስኑ።',
          ar: 'يحدد المعامل الرئيسي والدرجة (زوجية أم فردية) اتجاه نهايتي المنحنى.',
          so: 'Calaamadda coefficient-ka hore iyo awoodda ayaa go\'aamiya jihada.',
          en: 'The leading term a_n x^n completely dominates end behavior as x -> ±∞.'
        }
      }
    ],
    checkpoints: [
      {
        id: 'q1',
        timeSeconds: 840,
        question: {
          am: 'ፈንክሽን f(x) = 2x^3 - 3x^2 + 4x - 5 በ (x - 2) ሲካፈል ቀሪው ስንት ነው?',
          om: 'Yoo f(x) = 2x^3 - 3x^2 + 4x - 5 tiin (x - 2)f qoodame, hafiin meeqa?',
          ti: 'f(x) = 2x^3 - 3x^2 + 4x - 5 ብ (x - 2) እንትክፈል ዝተርፍ ክንደይ እዩ?',
          ar: 'ما هو باقي قسمة f(x) = 2x^3 - 3x^2 + 4x - 5 على (x - 2)؟',
          so: 'Waa maxay haraaga marka f(x) lagu qaybiyo (x - 2)?',
          en: 'What is the remainder when f(x) = 2x^3 - 3x^2 + 4x - 5 is divided by (x - 2)?'
        },
        options: {
          am: ['3', '7', '11', '15'],
          om: ['3', '7', '11', '15'],
          ti: ['3', '7', '11', '15'],
          ar: ['3', '7', '11', '15'],
          so: ['3', '7', '11', '15'],
          en: ['3', '7', '11', '15']
        },
        correctIndex: 1, // f(2) = 2(8) - 3(4) + 4(2) - 5 = 16 - 12 + 8 - 5 = 7
        explanation: {
          am: 'በቀሪ ንድፈ-ሐሳብ (Remainder Theorem) መሠረት ቀሪው = f(2) = 2(2)^3 - 3(2)^2 + 4(2) - 5 = 16 - 12 + 8 - 5 = 7 ነው።',
          om: 'Haalli qajeelaa Remainder Theorem: f(2) = 16 - 12 + 8 - 5 = 7.',
          ti: 'ብ Remainder Theorem መሰረት f(2) = 7 ይኸውን።',
          ar: 'وفق نظرية الباقي، الباقي = f(2) = 2(8) - 3(4) + 8 - 5 = 7.',
          so: 'Sida waafaqsan Remainder Theorem: f(2) = 7.',
          en: 'By the Remainder Theorem, R = f(2) = 2(8) - 3(4) + 4(2) - 5 = 16 - 12 + 8 - 5 = 7.'
        }
      }
    ],
    summaryPoints: {
      am: [
        'ፖሊኖሚያል ፈንክሽኖች ሁልጊዜ ቀጣይነት (continuous) እና ለስላሳ (smooth) ግራፍ አላቸው።',
        'ዲግሪ n ያለው ፖሊኖሚያል ቢበዛ n እውነተኛ ዜሮዎች (real zeros) እና (n - 1) የመታጠፊያ ነጥቦች (turning points) ይኖሩታል።',
        'የምክንያታዊ ሥር ንድፈ-ሐሳብ (Rational Root Theorem) ሊሆኑ የሚችሉ ዜሮዎችን ለመገመት ይረዳል።'
      ],
      om: [
        'Faankshiniin pooleenoomiyaalii yeroo hunda itti fufaa fi giraafii lallaafaa qaba.',
        'Faankshiniin digirii n qabu ziiroo dhugaa n qabaachuu danda\'a.',
        'Tiyeeramiin Rational Root ziiroo tilmaamuuf gargaara.'
      ],
      ti: [
        'ፖሊኖሚያል ፈንክሽናት ኩሉ ጊዜ ቀፃልነት (continuous) ዘለዎም እዮም።',
        'ዲግሪ n ዘለዎ ፈንክሽን ክሳብ n ናይ ሓቂ ዜሮታት ይህልውዎ።',
        'ናይ Rational Root ቲዮረም ዜሮታት ንምርካብ የገልግል።'
      ],
      ar: [
        'دوال كثيرات الحدود متصلة دوماً ورسومها البيانية ناعمة خالية من الزوايا الحادة.',
        'كثير حدود من الدرجة n يمتلك على الأكثر n من الجذور الحقيقية و (n - 1) من نقاط الانعطاف.',
        'نظرية الجذور النسبية تحدد قائمة بالقيم المحتملة للجذور النسبية.'
      ],
      so: [
        'Shaqooyinka polynomial had iyo jeer waa kuwo joogto ah.',
        'Polynomial-ka heerka n wuxuu leeyahay ugu badnaan n eber dhab ah.',
        'Aragtida Xididka Rational waxay caawisaa helitaanka eberada suuragalka ah.'
      ],
      en: [
        'Polynomial functions are everywhere smooth and continuous with no sharp corners or asymptotes.',
        'A polynomial of degree n has at most n real zeros and at most (n - 1) turning points.',
        'The Rational Root Theorem provides candidates p/q to test efficiently using synthetic division.'
      ]
    }
  },
  {
    id: 'vmc-phys-em-g10',
    grade: 10,
    subject: 'physics',
    title: {
      am: 'ኤሌክትሮማግኔቲዝም እና የፋራዴይ ኢንዳክሽን ሕግ ማስተርክላስ',
      om: 'Elektiroomeegneetizimii fi Seera Faaraadeey',
      ti: 'ኤሌክትሮማግኔቲዝምን ሕጊ ፈራዴይን ማስተርክላስ',
      ar: 'الكهرومغناطيسية وقانون فاراداي في الحث الكهرومغناطيسي',
      so: 'Elektromagnetismka iyo Sharciga Induction-ka Faraday',
      en: 'Electromagnetism & Faraday’s Law of Induction Masterclass'
    },
    subtitle: {
      am: 'የማግኔቲክ ፍላክስ ለውጥ፣ ሌንዝ ሕግ እና የጄኔሬተር አሰራር መርሆች',
      om: 'Jijjiirama Maagneetiik Filaaksii, Seera Leenz fi Jiineereetara',
      ti: 'ለውጢ ማግኔቲክ ፍላክስ፣ ሕጊ ሌንዝን ስራሕ ጀነሬተርን',
      ar: 'التدفق المغناطيسي، قانون لينز ومبادئ عمل المولدات والمحولات الكهربائية',
      so: 'Beddelka Magnetic Flux, Sharciga Lenz iyo Mabda\'a Koronto-dhaliyaha',
      en: 'Magnetic flux dynamics, Lenz’s Law opposing EMF, and transformer/generator principles'
    },
    instructor: {
      name: 'ኢንጂነር ብሩክ አሰፋ (Eng. Biruk Assefa)',
      role: 'Head of Applied Physics, Ethiopian STEM Education Center',
      credentials: 'MSc Applied Physics, National EUEE Physics Item Writer'
    },
    durationFormatted: '52:15',
    durationSeconds: 3135,
    badge: 'Crucial for EUEE Physics ★★★★★',
    thumbnailGradient: 'from-blue-700 via-cyan-900 to-slate-950',
    singlePriceETB: 54,
    formulaCheatsheet: [
      'Magnetic Flux: Φ = B * A * cos(θ) [Weber, Wb]',
      'Faraday’s Law: ε = -N * (ΔΦ / Δt) [Volts]',
      'Transformer Equation: V_p / V_s = N_p / N_s = I_s / I_p',
      'Magnetic Force: F = q * v * B * sin(θ) = I * L * B * sin(θ)'
    ],
    chapters: [
      {
        id: 'p1',
        timeSeconds: 0,
        timeFormatted: '00:00',
        title: {
          am: 'ማግኔቲክ ፍላክስ እና የመስመሮች ስርጭት',
          om: 'Maagneetiik Filaaksii fi Sarara Isaa',
          ti: 'ማግኔቲክ ፍላክስን መስመራትን',
          ar: 'مفهوم التدفق المغناطيسي وخطوط المجال',
          so: 'Magnetic Flux iyo Xariiqyada Goobta',
          en: 'Magnetic Flux Fundamentals & Field Vector Alignment'
        },
        keyTakeaway: {
          am: 'ፍላክስ ከፍተኛ የሚሆነው የመስኩ አቅጣጫ ከገጹ ቋሚ (normal) ጋር ትይዩ ሲሆን ነው (θ = 0°).',
          om: 'Filaaksiin olaanaa ta\'a yoo θ = 0° ta\'e.',
          ti: 'ፍላክስ ልዑል ዝኸውን θ = 0° እንትኸውን እዩ።',
          ar: 'يكون التدفق المغناطيسي أعظمياً عندما تكون خطوط المجال عمودية على السطح (θ = 0° مع العمودي).',
          so: 'Flux-ku wuxuu noqdaa kan ugu sarreeya marka xariiqyadu toos u galaan dusha.',
          en: 'Magnetic flux is maximized when field vectors are parallel to the surface normal (θ = 0°).'
        }
      },
      {
        id: 'p2',
        timeSeconds: 960,
        timeFormatted: '16:00',
        title: {
          am: 'የፋራዴይ እና ሌንዝ ሕግጋት (Lenz’s Law Negative Sign)',
          om: 'Seera Faaraadeey fi Seera Leenz',
          ti: 'ሕግታት ፈራዴይን ሌንዝን',
          ar: 'قانون فاراداي وقانون لينز للإشارة السالبة',
          so: 'Sharciga Faraday iyo Sharciga Lenz',
          en: 'Faraday’s Induction Law & Physical Meaning of Lenz’s Law'
        },
        keyTakeaway: {
          am: 'የተፈጠረው ኢ.ኤም.ኤፍ (Induced EMF) የለውጡን መንስኤ የሚቃወም ማግኔቲክ መስክ ይፈጥራል (የኢነርጂ ጥበቃ ሕግ)።',
          om: 'EMF uumame jijjiirama mormuuf yaala.',
          ti: 'ዝተፈጠረ ኢ.ኤም.ኤፍ ነቲ ለውጢ ዝቃወም ማግኔቲክ ዓውዲ ይፈጥር።',
          ar: 'التيار الحثي يولد مجالاً مغناطيسياً يعاكس التغير في التدفق المسبب له (حفظ الطاقة).',
          so: 'EMF-ka la kiciyay wuxuu abuuraa goob ka soo horjeeda isbeddelka.',
          en: 'The negative sign reflects conservation of energy: the induced current opposes the flux change.'
        }
      }
    ],
    checkpoints: [
      {
        id: 'qp1',
        timeSeconds: 1200,
        question: {
          am: 'አንድ ማግኔት በኮይል ውስጥ በፍጥነት ሲገባ በኮይሉ ላይ የሚፈጠረው የቮልቴጅ መጠን ምን ይሆናል?',
          om: 'Maagneetiin yoo saffisaan gara koylitti seene, voolteejjiin uumamu maal ta\'a?',
          ti: 'ማግኔት ብቕልጡፍ ናብ ውሽጢ ኮይል እንትኣቱ ዝፍጠር ቮልቴጅ እንታይ ይኸውን?',
          ar: 'ماذا يحدث لقيمة الجهد الكهربائي المستحث عندما يتحرك المغناطيس بسرعة أكبر داخل الملف؟',
          so: 'Maxaa ku dhacaya korontada la dhiirrigeliyay marka magnet-ku si degdeg ah u galo gariiradda?',
          en: 'What happens to the induced electromotive force (EMF) when a magnet enters a coil at a higher velocity?'
        },
        options: {
          am: ['ይቀንሳል', 'ይጨምራል', 'አይቀየርም', 'ወደ ዜሮ ይወርዳል'],
          om: ['Ni hir\'ata', 'Ni dabala', 'Hin jijjiiramu', 'Zeeroo ta\'a'],
          ti: ['ይቅንስ', 'ይውስኽ', 'ኣይቅየርን', 'ዜሮ ይኸውን'],
          ar: ['ينخفض', 'يزداد بشكل ملحوظ', 'يبقى ثابتاً', 'يصبح صفراً'],
          so: ['Wuu yaraadaa', 'Wuu kordhaa', 'Ma isbeddelo', 'Wuxuu noqdaa eber'],
          en: ['Decreases', 'Increases significantly', 'Remains strictly unchanged', 'Drops to zero']
        },
        correctIndex: 1,
        explanation: {
          am: 'በፋራዴይ ሕግ መሠረት ፍጥነቱ ሲጨምር የጊዜ ለውጡ (Δt) ስለሚቀንስ የፍላክስ ለውጥ ምጣኔው (ΔΦ/Δt) ይጨምራል፤ ስለሆነም Induced EMF ይጨምራል።',
          om: 'Δt waan hir\'atuuf, ΔΦ/Δt dabala, kanaaf EMF dabala.',
          ti: 'ፍጥነት እንትውስኽ ΔΦ/Δt ይውስኽ፣ ስለዚ ቮልቴጁ ይውስኽ።',
          ar: 'بزيادة السرعة يقل الزمن المستغرق مما يرفع معدل تغير التدفق المغناطيسي (ΔΦ/Δt)، وبالتالي يزداد الجهد الحثي.',
          so: 'Kordhinta xawaaruhu waxay kordhisaa heerka isbeddelka flux-ka, markaa EMF wuu kordhaa.',
          en: 'By Faraday’s law, ε = -N(ΔΦ/Δt). Faster motion decreases Δt, thereby increasing the rate of change of flux and voltage.'
        }
      }
    ],
    summaryPoints: {
      am: [
        'የኤሌክትሮማግኔቲክ ኢንዳክሽን የዘመናዊ የኃይል ማመንጫዎች (Hydroelectric turbines) መሠረት ነው።',
        'ትራንስፎርመሮች የሚሰሩት በተለዋዋጭ ጅረት (AC) ብቻ ነው፤ ቀጥተኛ ጅረት (DC) ፍላክስ ስለማይቀይር አይሰራም።',
        'የሌንዝ ሕግ በቀጥታ ከኢነርጂ ጥበቃ ሕግ (Conservation of Energy) ጋር የተያያዘ ነው።'
      ],
      om: [
        'Indakshiniin bu\'uura maddisiisa anniisaati.',
        'Tiraansifoormariin AC qofaan hojjeta.',
        'Seerri Leenz eegumsa anniisaa wajjin walqabata.'
      ],
      ti: [
        'ኤሌክትሮማግኔቲክ ኢንዳክሽን መሰረት ኃይሊ መመንጨዊ እዩ።',
        'ትራንስፎርመር ብ AC ጥራሕ ይሰርሕ።',
        'ሕጊ ሌንዝ ምስ ፅንዓት ኃይሊ ዝተኣሳሰረ እዩ።'
      ],
      ar: [
        'الحث الكهرومغناطيسي هو الأساس الفيزيائي لكافة محطات توليد الطاقة الكهربائية والتوربينات المائية.',
        'المحولات الكهربائية تعمل حصرياً مع التيار المتردد (AC) لأن التيار المستمر (DC) لا يحدث تغيراً في التدفق.',
        'قانون لينز هو التعبير الفيزيائي لمبدأ حفظ الطاقة في الظواهر الكهرومغناطيسية.'
      ],
      so: [
        'Induction-ka elektromagnetik waa aasaaska tamarta korontada.',
        'Transformers-ku waxay ku shaqeeyaan kaliya AC.',
        'Sharciga Lenz wuxuu xiriir la leeyahay ilaalinta tamarta.'
      ],
      en: [
        'Electromagnetic induction is the cornerstone of hydroelectric power generation across Ethiopia (GERD turbines).',
        'Transformers require alternating current (AC) because a changing magnetic flux is required for mutual inductance.',
        'Lenz’s law is a physical demonstration of the universal Law of Conservation of Energy.'
      ]
    }
  },
  {
    id: 'vmc-chem-equil-g11',
    grade: 11,
    subject: 'chemistry',
    title: {
      am: 'ኬሚካላዊ ሚዛን እና የለ-ሻትሊየር መርህ ማስተርክላስ',
      om: 'Madaallii Keemikaalaa fi Qajeelfama Le Chatelier',
      ti: 'ኬሚካላዊ ሚዛንን መትከል ለ-ሻትሊየርን',
      ar: 'الاتزان الكيميائي ومبدأ لوشاتيليه المتقدم',
      so: 'Isku dheelitirnaanta Kiimikada & Mabda\'a Le Chatelier',
      en: 'Chemical Equilibrium & Le Chatelier’s Dynamic Principle'
    },
    subtitle: {
      am: 'የ Equilibrium Constant (Kc, Kp) ስሌቶች፣ የግፊት፣ የሙቀት እና የኮንሰንትሬሽን ተጽዕኖዎች',
      om: 'Herrega Kc, Kp fi dhiibbaa dhiibbaa, ho\'aa fi konseentireeshinii',
      ti: 'ስሌት Kc, Kp ከምኡውን ፅልዋ ሙቐት፣ ፅቅጥን ኮንሰንትሬሽንን',
      ar: 'حسابات ثوابت الاتزان وتأثيرات الضغط والحرارة والتركيز في الصناعة',
      so: 'Xisaabinta Kc, Kp iyo saamaynta cadaadiska, heerkulka iyo xoogga',
      en: 'Dynamic equilibrium constants Kc & Kp, Haber process optimization, and equilibrium shifts'
    },
    instructor: {
      name: 'ዶ/ር ሰላማዊት ታደሰ (Dr. Selamawit Tadesse)',
      role: 'Associate Professor of Inorganic Chemistry',
      credentials: 'PhD Physical Chemistry, MoE Textbook Reviewer'
    },
    durationFormatted: '45:10',
    durationSeconds: 2710,
    badge: 'Grade 11 & 12 Core ★★★★★',
    thumbnailGradient: 'from-emerald-700 via-teal-900 to-slate-950',
    singlePriceETB: 54,
    formulaCheatsheet: [
      'aA + bB ⇌ cC + dD',
      'Kc = ([C]^c * [D]^d) / ([A]^a * [B]^b)',
      'Kp = Kc * (R * T)^Δn, where Δn = (c+d) - (a+b)',
      'Reaction Quotient Q: If Q < K forward favored, Q > K reverse favored'
    ],
    chapters: [],
    checkpoints: [],
    summaryPoints: {
      am: [
        'በሚዛን (equilibrium) ወቅት የፊት እና የኋላ ሪአክሽን ፍጥነቶች እኩል ናቸው፤ ነገር ግን ሪአክሽኑ አይቆምም (dynamic)።',
        'የሙቀት ለውጥ ብቻ ነው የ Kc ቁጥር ዋጋን የሚቀይረው፤ ግፊት እና ኮንሰንትሬሽን ሚዛኑን ቢያንሸራሽቱም Kcን አይቀይሩም።'
      ],
      om: [
        'Madaallii keessatti saffisni fuulduraa fi duubaa walqixa.',
        'Ho\'a qofatu gatii Kc jijjiira.'
      ],
      ti: [
        'ኣብ ሚዛን እዋን ናይ ቅድሚትን ድሕሪትን ፍጥነት ማዕረ እዩ።',
        'ለውጢ ሙቐት ጥራሕ እዩ ን Kc ዝቕይሮ።'
      ],
      ar: [
        'عند الاتزان تتساوى سرعة التفاعل الأمامي مع التفاعل العكسي وتثبت التراكيز، والتفاعل ديناميكي مستمر.',
        'درجة الحرارة هي العامل الوحيد القادر على تغيير القيمة العددية لثابت الاتزان Kc.'
      ],
      so: [
        'Marka la joogo dheelitirnaanta, xawaaraha hore iyo kan dambe waa siman yihiin.',
        'Kaliya heerkulka ayaa beddela qiimaha Kc.'
      ],
      en: [
        'At equilibrium, the rates of the forward and reverse reactions are equal; concentrations remain constant but reactions continue dynamically.',
        'Temperature is the ONLY disturbance variable that alters the numerical value of the equilibrium constant K.'
      ]
    }
  }
];

// ============================================================================
// HUB 2: 2D & 3D INTERACTIVE EDUCATIONAL ANIMATIONS
// ============================================================================
export const PREMIUM_SIMULATIONS: InteractiveSimulationItem[] = [
  {
    id: 'sim-projectile-physics',
    type: 'projectile_motion',
    title: {
      am: 'ባለ 2D/3D የፕሮጀክትል እንቅስቃሴ አስመሳይ (Projectile Motion Lab)',
      om: 'Simuleeshinii Sochii Pirojektaayilii 2D/3D',
      ti: 'ሲሙሌሽን ምንቅስቓስ ፕሮጀክታይል 2D/3D',
      ar: 'محاكي حركة المقذوفات ثنائي وثلاثي الأبعاد مع متجهات السرعة',
      so: 'Simulation-ka Dhaqdhaqaaqa Projectile 2D/3D',
      en: 'Interactive 2D/3D Projectile Motion Vector Simulator'
    },
    subtitle: {
      am: 'የመወርወሪያ ማዕዘን፣ የመጀመሪያ ፍጥነት፣ የስበት ኃይል (g) እና የአየር መቋቋም መቆጣጠሪያዎች',
      om: 'Goolii dhukaasaa, saffisa jalqabaa, harkisa (g) fi qilleensa to\'achuu',
      ti: 'መውረወሪ ማዕዘን፣ ናይ መጀመርታ ፍጥነትን ስሕበትን መቆፃፀሪ',
      ar: 'تحكم فوري بزاوية الإطلاق، السرعة الابتدائية، تسارع الجاذبية ومقاومة الهواء',
      so: 'Xakamaynta xagasha, xawaaraha bilowga, cufisjiidka iyo iska caabinta hawada',
      en: 'Real-time launch angle, initial velocity, planet gravity (Earth/Moon/Mars), and aerodynamic drag controls'
    },
    subject: 'physics',
    grade: 10,
    dimension: '2D',
    difficulty: 'Intermediate',
    keyFormulas: [
      'Range: R = (v_0^2 * sin(2θ)) / g',
      'Max Height: H_max = (v_0 * sin(θ))^2 / (2g)',
      'Time of Flight: T = (2 * v_0 * sin(θ)) / g',
      'Trajectory Equation: y = x*tan(θ) - (g * x^2) / (2 * v_0^2 * cos^2(θ))'
    ],
    description: {
      am: 'የተወረወረ አካል በአግድም (horizontal) ቋሚ ፍጥነት ሲኖረው፣ በአቀባዊ (vertical) ደግሞ በስበት ምክንያት ወጥ የተፋጠነ እንቅስቃሴ ያደርጋል። በካንቫሱ ላይ የትራጀክተሪውን ኩርባ፣ ፍጥነት እና ከፍተኛ ከፍታ በተግባር ይፈትሹ።',
      om: 'Sochiin pirojektaayilii sochii kallattii lamaatiin raawwatamudha. Giraafii fi herrega isaa qoradhaa.',
      ti: 'ፕሮጀክታይል ኣብ ክልተ አቅጣጫ ዝካየድ ምንቅስቓስ እዩ። ኩርባ ትራጀክተሪን ከፍተኛ ብራኸን ይመርምሩ።',
      ar: 'تتحلل حركة المقذوف إلى حركتين مستقلتين: أفقية بسرعة منتظمة ورأسية بتسارع الجاذبية الأرضية.',
      so: 'Dhaqdhaqaaqa projectile wuxuu ka kooban yahay laba qaybood: mid siman iyo mid toosan.',
      en: 'Analyze independent 2D kinematics. The horizontal motion maintains constant velocity while the vertical motion experiences constant gravitational acceleration.'
    },
    badge: 'Physics MoE Unit 3'
  },
  {
    id: 'sim-vsepr-chem',
    type: 'vsepr_molecules',
    title: {
      am: 'የሞለኪውሎች 3D የቦታ ቅርጽ እና የ VSEPR ንድፈ-ሐሳብ ሞዴል',
      om: 'Boca 3D Molakiyuulotaa fi Tiyeerii VSEPR',
      ti: '3D ቅርፂ ሞለኪውላትን ሞዴል VSEPRን',
      ar: 'النموذج التفاعلي ثلاثي الأبعاد للأشكال الهندسية للجزيئات (VSEPR)',
      so: 'Qaabka 3D ee Molecules-ka iyo Aragtida VSEPR',
      en: '3D VSEPR Molecular Geometry & Electron Domain Inspector'
    },
    subtitle: {
      am: 'Methane (CH4), Ammonia (NH3), Water (H2O), SF6 እና PCl5 ሞለኪውሎችን በ3D አሽከርክረው ይመልከቱ',
      om: 'Molakiyuulota CH4, NH3, H2O, SF6 3D\'n naanneessaa ilaalaa',
      ti: 'ሞለኪውላት CH4, NH3, H2O, SF6 ብ 3D እናዞርኩም ተመልከቱ',
      ar: 'استكشف جزيئات الميثان والماء والأمونيا وسداسي فلوريد الكبريت بزوايا دوران حرة',
      so: 'U fiirso molecules-ka CH4, NH3, H2O qaab 3D wareegaya',
      en: 'Interactive 3D rotation of tetrahedral, trigonal pyramidal, bent, and octahedral geometries with lone pair repulsion'
    },
    subject: 'chemistry',
    grade: 11,
    dimension: '3D',
    difficulty: 'Advanced (EUEE)',
    keyFormulas: [
      'Valence Shell Electron Pair Repulsion (VSEPR)',
      'Steric Number = (Bonding Pairs) + (Lone Pairs)',
      'Bond Angle Repulsion Hierarchy: Lone-Lone > Lone-Bond > Bond-Bond',
      'Tetrahedral (109.5°) → Trigonal Pyramidal (107°) → Bent (104.5°)'
    ],
    description: {
      am: 'የኤሌክትሮን ጥንዶች እርስ በርስ ስለሚገፋፉ በቦታ ውስጥ የሚወስዱት ዝቅተኛ ጉልበት ያለው ቅርጽ የሞለኪውሉን ጂኦሜትሪ ይወስናል።',
      om: 'Dhiibbaa elektiroonota gidduu jiru boca molakiyuulii murteessa.',
      ti: 'ምግፋፍ ኤሌክትሮናት ናይቲ ሞለኪውል ጂኦሜትሪ ይውስን።',
      ar: 'تتنافر أزواج الإلكترونات السطحية هندسياً لتتخذ الترتيب الأقل طاقة والأقصى تباعداً في الفضاء.',
      so: 'Isku celinta electron-nada ayaa go\'aamisa qaabka joomatari ee molecule-ka.',
      en: 'Electron domains in the valence shell repel each other, dictating 3D molecular symmetry and polarity.'
    },
    badge: 'Chemistry MoE Unit 2'
  },
  {
    id: 'sim-riemann-math',
    type: 'riemann_integrals',
    title: {
      am: 'የሪማን ድምር (Riemann Sum) እና የኢንቴግራል ስሌት አስመሳይ',
      om: 'Simuleeshinii Ida\'ama Riimaan fi Integiraalii',
      ti: 'ሲሙሌሽን ድምር ሪማንን ኢንቴግራላዊ ስሌትን',
      ar: 'محاكي مجموع ريمان والتكامل المحدد والمساحات تحت المنحنيات',
      so: 'Simulation-ka Riemann Sums iyo Xisaabinta Isku-dhafka',
      en: 'Interactive Riemann Sum & Definite Integral Area Visualizer'
    },
    subtitle: {
      am: 'የክፍፍል ብዛት (n)፣ የግራ/የቀኝ/የመካከለኛ ድምር (Left, Right, Midpoint) እና የስህተት ልዩነት',
      om: 'Baay\'ina kutaalee (n), ida\'ama bitaa, mirgaa fi gidduu',
      ti: 'ብዝሒ ክፍልፋያት (n) ከምኡውን ናይ ፀጋም/የማን ድምር',
      ar: 'التحكم بعدد المستطيلات التقريبية (n) ودراسة تقارب النهاية نحو المساحة الدقيقة',
      so: 'Tirada qaybaha (n) iyo isku darka bidix, midig iyo dhexda',
      en: 'Explore rectangle partition limit n → ∞, Left/Right/Midpoint sums, and convergence to exact analytical area'
    },
    subject: 'mathematics',
    grade: 12,
    dimension: 'Interactive Math',
    difficulty: 'Advanced (EUEE)',
    keyFormulas: [
      'Definite Integral: ∫_a^b f(x) dx = lim_{n→∞} ∑_{i=1}^n f(x_i*) Δx',
      'Δx = (b - a) / n',
      'Left Riemann Sum: L_n = Δx * ∑_{i=0}^{n-1} f(a + i*Δx)',
      'Right Riemann Sum: R_n = Δx * ∑_{i=1}^n f(a + i*Δx)'
    ],
    description: {
      am: 'በግራፉ ሥር ያለውን ስፋት በትንንሽ ሬክታንግሎች በመሸፈን፣ የክፍፍሉ ቁጥር ሲጨምር ድምሩ ወደ ትክክለኛው የኢንቴግራል ውጤት እንዴት እንደሚጠጋ ይመልከቱ።',
      om: 'Bal\'ina sarara jala jiru herreguuf gargaara.',
      ti: 'ስፍሓት ትሕቲ መስመር ንምስላሕ ሬክታንግላት ብምድማር ዝስላሕ እዩ።',
      ar: 'يعرض كيف يتحول مجموع مساحات المستطيلات المنفصلة إلى قيمة التكامل المحدد المستمر الدقيق مع زيادة n.',
      so: 'Arag sida bedka hoose ee garaafka loogu xisaabiyo leydi yaryar.',
      en: 'Visually understand the foundational theorem of calculus by partitioning continuous functions into Riemann rectangles.'
    },
    badge: 'Grade 12 Calculus Master'
  }
];

// ============================================================================
// HUB 3: ADVANCED NATIONAL EXAM SIMULATOR (EUEE & ESSLCE MODEL ENGINES)
// ============================================================================
export const PREMIUM_EXAM_PAPERS: NationalExamPaper[] = [
  {
    id: 'euee-stem-model-01',
    title: {
      am: 'የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተና (EUEE) የተፈጥሮ ሳይንስ ሞዴል - ሴሽን 1',
      om: 'Qormaata Seensa Yuunivarsiitii Itiyoophiyaa (EUEE) - Saayinsii Uumamaa',
      ti: 'ናይ ኢትዮጵያ ዩኒቨርሲቲ መእተዊ ፈተና (EUEE) ሞዴል - ሴሽን 1',
      ar: 'نموذج امتحان القبول الجامعي الوطني الإثيوبي (EUEE) - العلوم الطبيعية والهندسة',
      so: 'Imtixaanka Gelitaanka Jaamacadda Itoobiya (EUEE) - Sayniska Dabiiciga',
      en: 'Ethiopian University Entrance Examination (EUEE) National Standard Model - STEM'
    },
    examType: 'EUEE_NATIONAL',
    targetGrade: 12,
    yearSession: '2024/2025 MoE Standard Blueprint',
    durationMinutes: 75,
    totalMarks: 60,
    passingScorePercent: 70,
    subjectsCovered: ['mathematics', 'physics', 'chemistry'],
    questions: [],
    questionItems: [
      {
        id: 'q-euee-01',
        questionNumber: 1,
        unit: 'Polynomial Functions & Graph Analysis',
        cognitiveLevel: 'Application',
        text: {
          am: 'ፈንክሽን P(x) = 2x^4 - 3x^3 + ax^2 + 5x - 6 በ (x - 2) ያለምንም ቀሪ (remainder = 0) ከተካፈለ፣ የቋሚ ቁጥር a ዋጋ ስንት ነው?',
          om: 'Yoo P(x) = 2x^4 - 3x^3 + ax^2 + 5x - 6 hafaa malee (x - 2)n qoodame, gatiin a meeqa?',
          ti: 'P(x) = 2x^4 - 3x^3 + ax^2 + 5x - 6 ብዘይተረፈ ብ (x - 2) እንተተመቒሉ፣ ዋጋ a ክንደይ እዩ?',
          ar: 'إذا كان كثير الحدود P(x) = 2x^4 - 3x^3 + ax^2 + 5x - 6 يقبل القسمة على (x - 2) بدون باقٍ، فما قيمة الثابت a؟',
          so: 'Haddii P(x) lagu qaybiyo (x - 2) oo aan haraa lahayn, waa maxay qiimaha a?',
          en: 'If P(x) = 2x^4 - 3x^3 + ax^2 + 5x - 6 is completely divisible by (x - 2) without a remainder, what is the value of constant a?'
        },
        equationLatex: 'P(2) = 0 \\implies 2(2)^4 - 3(2)^3 + a(2)^2 + 5(2) - 6 = 0',
        options: [
          {
            optionText: 'a = -5',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'የተለመደ የስሌት ምልክት ስህተት (+10 - 6 ሳይሆን -10 ተደርጎ ሲሰላ የሚመጣ)።',
              om: 'Dogoggora mallattoo herregaa.',
              ti: 'ናይ ምልክት ስሌት ጌጋ።',
              ar: 'خطأ إشارة في تجميع الحدود الثابتة.',
              so: 'Khalad calaamadaha xisaabta ah.',
              en: 'Sign arithmetic error during transposition of constant terms.'
            }
          },
          {
            optionText: 'a = -7',
            isCorrect: true,
            distractorTrapExplanation: {
              am: 'ትክክለኛ መልስ! P(2) = 32 - 24 + 4a + 10 - 6 = 12 + 4a = 0 ==> 4a = -28 ==> a = -7።',
              om: 'Deebii sirrii! P(2) = 0.',
              ti: 'ትክክለኛ መልሲ! P(2) = 0.',
              ar: 'إجابة نموذجية صحيحة بالتعويض المباشر.',
              so: 'Jawaab sax ah!',
              en: 'Correct answer via Factor Theorem: P(2) = 32 - 24 + 4a + 10 - 6 = 28 + 4a = 0 ==> 4a = -28 ==> a = -7.'
            }
          },
          {
            optionText: 'a = 7',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'ተማሪው 4a = -28 መሆኑን ዘንግቶ አዎንታዊ 28 አድርጎ በመውሰድ የተሳሳተበት ወጥመድ።',
              om: 'Mallattoo qoodaa dogoggoruu.',
              ti: 'ምልክት ምቕያር ምዝንጋዕ።',
              ar: 'نسيان تغيير إشارة الطرف الآخر عند النقل.',
              so: 'Ilbaxnimada calaamadda oo la ilaaway.',
              en: 'Failed to flip sign when transposing positive 28 to the right side of the equation.'
            }
          },
          {
            optionText: 'a = -3',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'x = -2 ተክተው በማስላት የሚመጣ የተለመደ የተማሪ ስህተት።',
              om: 'Dogoggora x = -2 bakka buusuu.',
              ti: 'x = -2 ተኪእካ ምስላሕ ዝመጽእ ጌጋ።',
              ar: 'خطأ شائع ناتج عن التعويض بالقيمة x = -2 بدلاً من جذر المعادلة x = 2.',
              so: 'Khalad ka dhashay beddelka x = -2.',
              en: 'Substituted x = -2 instead of the actual root x = +2.'
            }
          }
        ],
        detailedPedagogicalSolution: {
          am: 'በፋክተር ንድፈ-ሐሳብ (Factor Theorem) መሠረት፣ (x - 2) አካፋይ ከሆነ P(2) = 0 መሆን አለበት።\nP(2) = 2(2)^4 - 3(2)^3 + a(2)^2 + 5(2) - 6\n= 2(16) - 3(8) + 4a + 10 - 6\n= 32 - 24 + 4a + 4\n= 12 + 4a = 0 ==> 4a = -28 ==> a = -7።',
          om: 'Akka Factor Theorem\'tti P(2) = 0 ta\'uu qaba. 32 - 24 + 4a + 4 = 12 + 4a = 0 ==> a = -7.',
          ti: 'ብ Factor Theorem መሰረት P(2) = 0 ክኸውን ኣለዎ። ስለዚ a = -7 ይኸውን።',
          ar: 'بناءً على نظرية العامل: بما أن (x - 2) قاسم للمقدار، فإن P(2) = 0. بالتعويض: 2(16) - 3(8) + 4a + 10 - 6 = 12 + 4a = 0 ومنه 4a = -28 أي أن a = -7.',
          so: 'Sida waafaqsan Factor Theorem, P(2) = 0. Markaa a = -7.',
          en: 'By the Factor Theorem, (x - 2) is a factor if and only if P(2) = 0. Substituting x = 2: 2(16) - 24 + 4a + 10 - 6 = 28 + 4a = 0 ==> 4a = -28 ==> a = -7.'
        },
        referenceBookSection: 'Grade 10 Mathematics, Unit 2 (Polynomials), Section 2.3'
      },
      {
        id: 'q-euee-02',
        questionNumber: 2,
        unit: '2D Kinematics & Projectile Physics',
        cognitiveLevel: 'Reasoning_Analysis',
        text: {
          am: 'አንድ የፕሮጀክትል አካል ከመሬት በ 30° ማዕዘን እና በ 40 m/s የመጀመሪያ ፍጥነት ቢወረወር፣ አካሉ የሚደርስበት ከፍተኛ ከፍታ (H_max) ስንት ነው? (g = 10 m/s^2)',
          om: 'Pirojektaayiliin goolii 30° fi saffisa 40 m/s tiin yoo dhukaafame, olka\'iinsi guddaan meeqa? (g = 10 m/s^2)',
          ti: 'ፕሮጀክታይል ብማዕዘን 30° ከምኡውን ፍጥነት 40 m/s እንተተወርዊሩ ከፍተኛ ብራኸኡ ክንደይ እዩ? (g = 10 m/s^2)',
          ar: 'قُذف جسم بزاوية 30° فوق الأفق وبسرعة ابتدائية 40 م/ث. ما هو أقصى ارتفاع رأسي يصل إليه المقذوف؟ (اعتبر g = 10 م/ث²)',
          so: 'Haddii projectile lagu tuuro xagal 30° iyo xawaare 40 m/s, waa maxay dhererka ugu sarreeya? (g = 10 m/s^2)',
          en: 'A projectile is launched from ground level at an elevation angle of 30° with an initial velocity of 40 m/s. What is its maximum vertical height? (Take g = 10 m/s²)'
        },
        equationLatex: 'H_{max} = \\frac{(v_0 \\sin\\theta)^2}{2g} = \\frac{(40 \\cdot \\sin 30^\\circ)^2}{2 \\cdot 10}',
        options: [
          {
            optionText: 'H = 80 m',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'ማዕዘኑን ሳያካትቱ 40^2 / 20 በማድረግ የመጣ ስህተት።',
              om: 'Goolii osoo hin herregin hafuu.',
              ti: 'ማዕዘን ዘይምሕሳብ ዝመጽእ ጌጋ።',
              ar: 'تجاهل زاوية الإطلاق واستخدام السرعة الكلية بدلاً من المركبة الرأسية.',
              so: 'Aan lagu darin xagasha.',
              en: 'Used total velocity v_0 instead of vertical component v_{0y} = v_0 sin(θ).'
            }
          },
          {
            optionText: 'H = 20 m',
            isCorrect: true,
            distractorTrapExplanation: {
              am: 'ትክክለኛ መልስ! v_{0y} = 40 * sin(30°) = 40 * 0.5 = 20 m/s. H = (20)^2 / (2 * 10) = 400 / 20 = 20 ሜትር።',
              om: 'Deebii sirrii! H = 20m.',
              ti: 'ትክክለኛ መልሲ! H = 20 ሜትር።',
              ar: 'إجابة صحيحة دقيقة باستخدام المركبة الرأسية للسرعة.',
              so: 'Jawaab sax ah! H = 20m.',
              en: 'Correct! Vertical velocity v_{0y} = 40 * 0.5 = 20 m/s. Then H = 20² / (2 * 10) = 400 / 20 = 20 m.'
            }
          },
          {
            optionText: 'H = 40 m',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'በቀመሩ ላይ 2g ሳይሆን g ብቻ በመጠቀም የመጣ ስህተት።',
              om: '2g bakka g qofa fayyadamuu.',
              ti: '2g ኣብ ክንዲ ምጥቃም g ጥራሕ ምጥቃም።',
              ar: 'نسيان معامل القسمة (2) في المقام (القسمة على g بدلاً من 2g).',
              so: 'Loo qaybiyay g halkii laga qaybin lahaa 2g.',
              en: 'Omitted the factor of 2 in the denominator formula (divided by g instead of 2g).'
            }
          },
          {
            optionText: 'H = 10 m',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'የ sin(30°) ዋጋን በስህተት 0.25 አድርጎ በመውሰድ የተፈጠረ።',
              om: 'Gatii sin(30°) dogoggoruu.',
              ti: 'ዋጋ sin(30°) ብጌጋ ምውሳድ።',
              ar: 'خطأ في القيمة المثلثية لـ sin(30°).',
              so: 'Khalad qiimaha sin(30°).',
              en: 'Trigonometric evaluation blunder for sin(30°).'
            }
          }
        ],
        detailedPedagogicalSolution: {
          am: 'የመጀመሪያው አቀባዊ ፍጥነት (Vertical initial velocity):\nv_{0y} = v_0 * sin(θ) = 40 * sin(30°) = 40 * 0.5 = 20 m/s።\nበከፍተኛው ከፍታ ላይ አቀባዊ ፍጥነቱ ዜሮ (v_y = 0) ይሆናል።\nከኪነማቲክስ ቀመር: v_y^2 = v_{0y}^2 - 2gH\n0 = (20)^2 - 2(10)H\n20H = 400 ==> H = 20 ሜትር።',
          om: 'Saffisa olka\'aa: v_{0y} = 40 * 0.5 = 20 m/s. H = 20^2 / 20 = 20m.',
          ti: 'v_{0y} = 40 * 0.5 = 20 m/s. H = 400 / 20 = 20 ሜትር ይኸውን።',
          ar: 'مركبة السرعة الرأسية الابتدائية: v_{0y} = 40 * sin(30°) = 20 م/ث. بتطبيق معادلة الحركة: v_y² = v_{0y}² - 2gH حيث v_y = 0 عند القمة: 0 = 400 - 20H ومنه H = 20 متراً.',
          so: 'Xawaaraha toosan: v_{0y} = 20 m/s. H = 400 / 20 = 20m.',
          en: 'Vertical initial velocity component: v_{0y} = v_0 sin(30°) = 40 * 0.5 = 20 m/s. At peak, v_y = 0. Using kinematic equation v_y² = v_{0y}² - 2gH: 0 = 400 - 20H ==> H = 20 m.'
        },
        referenceBookSection: 'Grade 10 Physics, Unit 3 (Motion in 2D), Section 3.2'
      },
      {
        id: 'q-euee-03',
        questionNumber: 3,
        unit: 'Chemical Equilibrium & Le Chatelier',
        cognitiveLevel: 'Knowledge',
        text: {
          am: 'ለሚከተለው ጋዛዊ ሚዛን: N2(g) + 3H2(g) ⇌ 2NH3(g) + 92 kJ፣ በሚዛኑ ስርዓት ላይ ግፊት (Pressure) ቢጨመር የሪአክሽኑ አቅጣጫ ወዴት ያዘነብላል?',
          om: 'Walnyaatinsa madaallii kanaaf, yoo dhiibbaan dabale walnyaatinsi gara kamitti deema?',
          ti: 'ነዚ ናይ ጋዝ ሚዛን፣ ፅቕጢ እንተወሲኹ እቲ ሪአክሽን ናበይ የዘንብል?',
          ar: 'في التفاعل المتزن الغازي لإنتاج الأمونيا (طارد للحرارة): N2(g) + 3H2(g) ⇌ 2NH3(g) + 92 kJ، إذا زاد الضغط الكلي على النظام، فإلى أي اتجاه ينزاح موضع الاتزان؟',
          so: 'Haddii cadaadisku kordho, xaggee ayuu u leexanayaa dheelitirka?',
          en: 'For the exothermic gaseous equilibrium N2(g) + 3H2(g) ⇌ 2NH3(g) + 92 kJ, if the total pressure on the container is increased, which direction does the equilibrium shift?'
        },
        equationLatex: 'N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g) + \\Delta H (-92 \\text{ kJ})',
        options: [
          {
            optionText: 'ወደ ፊት (Forward / Right toward NH3)',
            isCorrect: true,
            distractorTrapExplanation: {
              am: 'ትክክለኛ መልስ! በግራ በኩል 4 ሞል ጋዝ ሲኖር በቀኝ በኩል 2 ሞል ብቻ ስላለ፣ ግፊት ሲጨምር ስርዓቱ አነስተኛ የሞል ብዛት ወዳለው ወደ ቀኝ ይሸጋገራል።',
              om: 'Deebii sirrii! Gara lakkoofsa moolii xiqqootti deema.',
              ti: 'ትክክለኛ መልሲ! ናብ ውሑድ ሞል ዘለዎ ናብ የማን ይኸይድ።',
              ar: 'إجابة نموذجية! ينزاح نحو الطرف ذي عدد المولات الغازية الأقل (2 مول مقابل 4 مولات).',
              so: 'Jawaab sax ah! Wuxuu u leexanayaa dhinaca leh tiro yar oo mole ah.',
              en: 'Correct! Reactants have 1+3=4 moles of gas; products have 2 moles. Increasing pressure shifts toward fewer gas moles (to the right).'
            }
          },
          {
            optionText: 'ወደ ኋላ (Reverse / Left toward N2 and H2)',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'ግፊት ሲቀንስ (መጠኑ ሲሰፋ) የሚሆነውን የተሳሳተ አቅጣጫ የመረጠበት ወጥመድ።',
              om: 'Yoo dhiibbaan hir\'ate qofa uumama.',
              ti: 'ፅቕጢ እንትቕንስ ዝፍጠር እዩ።',
              ar: 'هذا يحدث فقط عند خفض الضغط أو زيادة حجم وعاء التفاعل.',
              so: 'Tani waxay dhacdaa kaliya marka cadaadisku yaraado.',
              en: 'This shift occurs when pressure is decreased, not increased.'
            }
          },
          {
            optionText: 'ምንም አይነት ሽግግር አይኖርም (No shift)',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'ሁለቱም በኩል እኩል ሞል ሲኖር ብቻ ነው ግፊት ተጽዕኖ የማያደርገው። እዚህ ግን 4 ሞል vs 2 ሞል ነው።',
              om: 'Mooliin walqixa miti.',
              ti: 'ሞላት ማዕረ ኣይኮኑን።',
              ar: 'يحدث فقط إذا تساوى عدد مولات الغاز في طرفي المعادلة (Δn = 0).',
              so: 'Moolalka ma sinna.',
              en: 'Pressure has no effect only if Δn = 0. Here Δn = 2 - 4 = -2.'
            }
          },
          {
            optionText: 'የ Kc ዋጋ ይቀንሳል',
            isCorrect: false,
            distractorTrapExplanation: {
              am: 'ግፊት የ Kc ዋጋን በጭራሽ አይቀይረውም፤ የ Kc ዋጋ የሚቀየረው በሙቀት ብቻ ነው።',
              om: 'Dhiibbaan Kc hin jijjiiru.',
              ti: 'ፅቕጢ ን Kc ኣይቕይሮን።',
              ar: 'الضغط يزيح موضع الاتزان ولا يغير القيمة العددية لثابت الاتزان Kc مطلقاً.',
              so: 'Cadaadisku ma beddelo Kc.',
              en: 'Pressure alters equilibrium position but NEVER alters the equilibrium constant Kc.'
            }
          }
        ],
        detailedPedagogicalSolution: {
          am: 'የለ-ሻትሊየር መርህ (Le Chatelier’s Principle) እንደሚደነግገው፣ በተዘጋ ስርዓት ላይ ግፊት ሲጨመር ስርዓቱ የተፈጠረውን ጭንቀት ለመቀነስ አነስተኛ የጋዝ ሞል ቁጥር ወዳለበት አቅጣጫ ያዘነብላል።\nበግራ በኩል (Reactants): 1 N2 + 3 H2 = 4 moles of gas.\nበቀኝ በኩል (Products): 2 NH3 = 2 moles of gas.\nስለሆነም ሪአክሽኑ ወደ ፊት (Forward direction) በማዘንበል የአሞኒያ ምርት ይጨምራል።',
          om: 'Akka qajeelfama Le Chatelier\'tti, dhiibbaan yoo dabale moolii xiqqaa (NH3) tii deema.',
          ti: 'ብመትከል ለ-ሻትሊየር መሰረት ፅቕጢ እንትውስኽ ናብ ውሑድ ሞል ጋዝ ዘለዎ የማናይ ሸነኽ ይኸይድ።',
          ar: 'ينص مبدأ لوشاتيليه على أنه عند زيادة الضغط، يميل النظام للتخفيف من هذا الإجهاد بالانزياح نحو الاتجاه الذي يشغل حجماً أصغر (أي الطرف ذي عدد المولات الأقل من الغازات). الطرف الأيسر يحوي 4 مولات غازية بينما الطرف الأيمن يحوي 2 مول، لذا ينزاح التفاعل نحو اليمين لإنتاج المزيد من NH3.',
          so: 'Sida uu qabo mabda\'a Le Chatelier, cadaadiska kordhay wuxuu u leexinayaa dhinaca NH3.',
          en: 'Le Chatelier’s Principle states that an increase in pressure shifts the equilibrium towards the side with fewer moles of gas. Reactants = 4 moles, Products = 2 moles. Thus, equilibrium shifts forward (right).'
        },
        referenceBookSection: 'Grade 11 Chemistry, Unit 4 (Equilibrium), Section 4.3'
      }
    ]
  }
];

// ============================================================================
// HUB 4: VIRTUAL INTERACTIVE STEM SCIENCE LAB (ምናባዊ ሳይንስ ላብራቶሪ)
// ============================================================================
export const PREMIUM_VIRTUAL_EXPERIMENTS: VirtualExperimentItem[] = [
  {
    id: 'lab-acid-base-titration',
    type: 'titration',
    title: {
      am: 'የአሲድ እና ቤዝ ኳንቲቴቲቭ ቲትሬሽን ምናባዊ ላብ (Titration Lab)',
      om: 'Laabii Tiitireeshinii Asiidii fi Beezii',
      ti: 'ላቦራቶሪ ቲትሬሽን ኣሲድን ቤዝን',
      ar: 'المختبر التفاعلي للمعايرة الحمضية القاعدية ودلائل الأس الهيدروجيني (pH)',
      so: 'Shaybaarka Titration-ka Aashitada iyo Saldhigga',
      en: 'Standard Acid-Base Quantitative Titration & Equivalence pH Curve Lab'
    },
    grade: 10,
    subject: 'chemistry',
    curriculumCode: 'FDRE-MoE-G10-CHEM-PRACTICAL-04',
    safetyCaution: {
      am: 'ማስጠንቀቂያ: ሃይድሮክሎሪክ አሲድ (HCl) የሚበላ አሲድ ስለሆነ የእጅ ጓንት እና የመከላከያ መነጽር መጠቀም ግዴታ ነው።',
      om: 'Oof-eeggannoo: HCl qaama waan gubuuf gilaavsii fayyadamaa.',
      ti: 'ጥንቃቐ: HCl ዘቃፅል ብምዃኑ መነፅርን ጓንትን ተጠቐሙ።',
      ar: 'تحذير سلامة مخبري: حمض الهيدروكلوريك مادة كاوية حارقة، يجب ارتداء النظارات الواقية والقفازات.',
      so: 'Digniin: HCl waa mid gubanaya, isticmaal galoofisyo.',
      en: 'Safety Alert: Hydrochloric acid (0.1M HCl) is corrosive. Virtual gloves and goggles mandatory.'
    },
    objective: {
      am: 'የ 0.1 M NaOH መፍትሄን በቢውሬት (burette) በመጠቀም ያልታወቀውን የ HCl ኮንሰንትሬሽን በ phenolphthalein ኢንዲኬተር አማካኝነት ማስላት።',
      om: 'Konseentireeshinii HCl herreguuf NaOH fayyadamuu.',
      ti: 'ዘይተፈልጠ ኮንሰንትሬሽን HCl ምፍላጥ።',
      ar: 'تحديد التركيز المجهولي لحمض الهيدروكلوريك باستخدام محلول هيدروكسيد الصوديوم القياسي مع رصد نقطة التكافؤ.',
      so: 'Xisaabinta xoogga HCl iyadoo la isticmaalayo NaOH.',
      en: 'Determine the exact molarity of unknown HCl by titrating with standard 0.1 M NaOH using phenolphthalein indicator.'
    },
    materials: {
      am: ['50 mL Burette with stopcock', '250 mL Erlenmeyer flask', '0.10 M NaOH titrant', 'Unknown HCl analyte', 'Phenolphthalein indicator', 'Digital pH meter'],
      om: ['Bureette 50 mL', 'Flaskii Erlenmeyer', 'NaOH 0.1M', 'HCl', 'Indikeetara'],
      ti: ['50 mL ቢውሬት', 'ኤርለንማየር ፍላስክ', '0.10 M NaOH', 'HCl', 'ኢንዲኬተር'],
      ar: ['سحاحة زجاجية 50 مل', 'دورق مخروطي 250 مل', 'محلول هيدروكسيد صوديوم قياسي 0.10M', 'مجهول حمض الهيدروكلوريك', 'كاشف الفينولفثالين', 'مقياس pH رقمي'],
      so: ['Burette 50 mL', 'Flask', 'NaOH', 'HCl', 'Qalabka cabbiraadda pH'],
      en: ['50 mL Precision Glass Burette', '250 mL Conical Erlenmeyer Flask', 'Standard 0.10 M NaOH Titrant', 'Hydrochloric Acid Sample', 'Phenolphthalein Color Indicator', 'Digital pH Electrode']
    },
    standardTheoreticalOutcome: 'Equivalence reached at pH 7.00 with sharp faint-pink endpoint coloration lasting 30+ seconds.'
  },
  {
    id: 'lab-optics-lens-bench',
    type: 'optics_bench',
    title: {
      am: 'የብርሃን ስብራት እና የሌንስ ኦፕቲክስ ቤንች ላብ (Optics Ray-Tracing Bench)',
      om: 'Laabii Ifaa fi Qajeelcha Leensii',
      ti: 'ላቦራቶሪ ስብራት ብርሃንን ሌንስን',
      ar: 'مقعد البصريات التفاعلي وتتبع مسارات الأشعة الضوئية في العدسات',
      so: 'Shaybaarka Optics-ka iyo Raadraaca Ileyska Lenses-ka',
      en: 'Optics Ray-Tracing Bench: Convex/Concave Lenses & Real/Virtual Image Synthesis'
    },
    grade: 10,
    subject: 'physics',
    curriculumCode: 'FDRE-MoE-G10-PHYS-PRACTICAL-02',
    safetyCaution: {
      am: 'ሌዘር እና ኃይለኛ የብርሃን ምንጭ በቀጥታ ወደ ዓይን እንዳይገባ ተጠንቀቁ።',
      om: 'Itti fayyadama ifaa irratti ija eeggadhaa.',
      ti: 'ብርሃን ብቐጥታ ናብ ዓይኒ ከይአቱ ተጠንቀቑ።',
      ar: 'تحذير: تجنب توجيه الحزمة الضوئية أو الليزر إلى العين مباشرة.',
      so: 'Ka digtoonow in iftiinku toos ugu dhaco indhaha.',
      en: 'Laser safety protocol: Never look directly into collimated light sources.'
    },
    objective: {
      am: 'የቀጭን ሌንስ ቀመር (1/f = 1/do + 1/di) በመጠቀም የኮንቬክስ እና ኮንኬቭ ሌንሶችን ፎካል ርዝመት (focal length) ማረጋገጥ።',
      om: 'Herrega qajeelaa leensii mirkaneessuu.',
      ti: 'ቀመር ቀጢን ሌንስ ምፍታሽ።',
      ar: 'التحقق تجريبياً من قانون العدسات الرقيقة وحساب البعد البؤري وتكبير الصورة الحقيقية والتقديرية.',
      so: 'Hubinta sharciga lenses-ka iyo dhererka focal-ka.',
      en: 'Verify the thin lens equation (1/f = 1/d_o + 1/d_i) and compute real inverted vs upright virtual magnifications.'
    },
    materials: {
      am: ['Optical bench (100 cm rail)', 'Illuminated arrow object', 'Convex lens (f = +15 cm)', 'Concave lens (f = -15 cm)', 'Movable projection screen', 'Vernier caliper scale'],
      om: ['Optical bench 100cm', 'Leensii convex', 'Leensii concave', 'Iskiriinii'],
      ti: ['ናይ ብርሃን ቤንች (100 ሳ.ሜ)', 'ኮንቬክስ ሌንስ', 'ኮንኬቭ ሌንስ', 'መመርመሪ ስክሪን'],
      ar: ['مسار بصري مدرج بطول 100 سم', 'جسم مضيء (سهم)', 'عدسة محدبة مجمعة (f = +15 سم)', 'عدسة مقعرة مفرقة (f = -15 سم)', 'شاشة استقبال بيضاء متحركة'],
      so: ['Tareenka optics 100cm', 'Lens convex', 'Lens concave', 'Shaashad'],
      en: ['100 cm Graduated Optical Rail', 'Illuminated Object Pattern', 'Biconvex Lens (f = +15 cm)', 'Biconcave Lens (f = -15 cm)', 'Diffuse Projection Screen']
    },
    standardTheoreticalOutcome: 'When object distance d_o > 2f, image is real, inverted, and diminished (di between f and 2f).'
  },
  {
    id: 'lab-dc-circuit-sandbox',
    type: 'dc_circuits',
    title: {
      am: 'የኤሌክትሪክ ሰርኪውት እና የኦህም ሕግ ሳንድቦክስ (DC Circuit Sandbox)',
      om: 'Simuleeshinii Sarara Elektiriikii fi Seera Ohm',
      ti: 'ሳንድቦክስ ኤሌክትሪክ ሰርኪውትን ሕጊ ኦህምን',
      ar: 'مختبر الدوائر الكهربائية المستمرة وقانون أوم والتوصيل على التوالي والتوازي',
      so: 'Shaybaarka Wareegga Korontada iyo Sharciga Ohm',
      en: 'DC Electric Circuit Sandbox: Series, Parallel & Multimeter Measurements'
    },
    grade: 10,
    subject: 'physics',
    curriculumCode: 'FDRE-MoE-G10-PHYS-PRACTICAL-05',
    safetyCaution: {
      am: 'አጭር መቆራረጥ (Short circuit) እንዳይፈጠር የአሚተር ፕሮቦችን በትይዩ (parallel) ከባትሪ ጋር አያገናኙ።',
      om: 'Short circuit akka hin uumamne ammeter of eeggadhaa.',
      ti: 'ሾርት ሰርኪውት ከይፍጠር ተጠንቀቑ።',
      ar: 'تحذير: لا تقم بربط مقياس التيار (الأميتر) مباشرة على التوازي مع البطارية لتجنب دارة القصر.',
      so: 'Ka digtoonow short circuit.',
      en: 'Short-circuit caution: Never bridge an ideal zero-resistance ammeter directly across power terminals.'
    },
    objective: {
      am: 'በተከታታይ (series) እና በትይዩ (parallel) በተገናኙ ሬዚስተሮች ላይ የቮልቴጅ እና የጅረት (current) ስርጭትን በኦህም ሕግ (V = IR) ማረጋገጥ።',
      om: 'Seera Ohm fayyadamuun voolteejjii fi karentii herreguu.',
      ti: 'ብሕጊ ኦህም መሰረት ቮልቴጅን ካረንትን ምፍታሽ።',
      ar: 'إثبات قانون أوم عملياً وقياس تفرع التيار وتجزئة الجهد في دوائر التوالي والتوازي.',
      so: 'Xaqiijinta Sharciga Ohm ee wareegyada kala duwan.',
      en: 'Verify Ohm’s law V = IR, equivalent resistances R_eq, and Kirchhoff’s voltage/current division.'
    },
    materials: {
      am: ['Variable DC power supply (0-24 V)', 'Resistors (10 Ω, 20 Ω, 50 Ω)', 'Digital Multimeter (Ammeter & Voltmeter)', 'Miniature light bulb', 'Connecting alligator wires', 'Toggle knife switch'],
      om: ['Baatrii 0-24V', 'Reezistaroota', 'Multimeter', 'Ibsituu', 'Wayaa'],
      ti: ['ዲሲ ባትሪ (0-24 V)', 'ሬዚስተራት', 'ዲጂታል መልቲሜትር', 'መብራህቲ', 'ናይ ምትእስሳር ሽቦታት'],
      ar: ['مصدر جهد مستمر قابل للضبط 0-24 فولت', 'مقاومات كربونية متعددة القيم', 'جهاز قياس رقمي متعدد (ملتيميتر)', 'مصباح كهربائي صغير', 'أسلاك توصيل بملاقط تمساحية'],
      so: ['Isha tamarta DC', 'Resistors', 'Multimeter', 'Nal', 'Fiilooyinka'],
      en: ['Adjustable DC Regulated Power Supply', 'Standard Precision Resistors', 'Dual Probe Digital Multimeter', 'Filament Test Lamp', 'Low-Resistance Jumper Leads']
    },
    standardTheoreticalOutcome: 'Series: R_eq = R1 + R2 (current constant). Parallel: 1/R_eq = 1/R1 + 1/R2 (voltage constant across branches).'
  }
];

// ============================================================================
// HUB 5: HIGH-YIELD AUDIO REVISION HUB (የድምፅ ትምህርት እና ማጠቃለያ)
// ============================================================================
export const PREMIUM_AUDIO_REVISIONS: HighYieldAudioItem[] = [
  {
    id: 'audio-rev-poly-calc',
    title: {
      am: 'የካልኩለስ እና የፈንክሽኖች የ 12 ደቂቃ የማስታወሻ ባንክ',
      om: 'Baankii Yaadannoo Kaalkulasii Daqiiqaa 12',
      ti: 'ናይ ካልኩለስን ፈንክሽናትን ናይ 12 ደቒቕ ናይ መዘከርታ ባንኪ',
      ar: 'المراجعة الصوتية السريعة للتفاضل والتكامل ودوال الثانوية العامة',
      so: 'Dib u eegista Maqalka ee Calculus 12 Daqiiqo ah',
      en: '12-Minute High-Yield Calculus & Function Mastery Audio Pod'
    },
    topic: {
      am: 'ሊሚት፣ ዴሪቫቲቭ እና የፖሊኖሚያል ባህሪያት ፈጣን ክለሳ',
      om: 'Liimiitii, Deriiveetivii fi Pooleenoomiyaalii',
      ti: 'ሊሚት፣ ዴሪቫቲቭን ፖሊኖሚያልን ቅልጡፍ ክለሳ',
      ar: 'النهايات والاشتقاق ونظرية القيمة المتوسطة وأصفار كثيرات الحدود',
      so: 'Limits, derivatives iyo astaamaha polynomial',
      en: 'Limits at infinity, product/chain rules, critical points, and polynomial zero theorems'
    },
    subject: 'mathematics',
    grade: 12,
    durationMinutes: 12,
    audioDurationSeconds: 720,
    highYieldFormulas: [
      'd/dx [x^n] = n * x^(n-1)',
      'Product Rule: (uv)\' = u\'v + uv\'',
      'Quotient Rule: (u/v)\' = (u\'v - uv\') / v^2',
      'Chain Rule: d/dx [f(g(x))] = f\'(g(x)) * g\'(x)'
    ],
    keyMnemonics: {
      am: '💡 "Low D-High minus High D-Low over Low-Low" — ለ Quotient Rule የማስታወሻ ቀመር!',
      om: '💡 "Low D-High minus High D-Low" — yaadannoof!',
      ti: '💡 "Low D-High minus High D-Low over Low-Low" — ን Quotient Rule!',
      ar: '💡 "مشتق البسط في المقام ناقص مشتق المقام في البسط على مربع المقام" — قاعدة القسمة الذهبية!',
      so: '💡 Xusuusinta Sharciga Quotient!',
      en: '💡 "Low D-High minus High D-Low over the square of what\'s below" — the classic quotient rule rhyme!'
    },
    transcripts: {
      am: 'ሰላም የተከበራችሁ የኢትዮጵያ ተማሪዎች! ዛሬ በብሔራዊ ፈተና ላይ በብዛት የሚመጡትን የካልኩለስ እና የፖሊኖሚያል ፎርሙላዎች በአጭር ደቂቃ እንከልሳለን። በመጀመሪያ ደረጃ፣ ፈንክሽን ፖሊኖሚያል ነው ስንል የሁሉም ተለዋዋጮች ኤክስፖነንት ሙሉ አዎንታዊ ቁጥር (non-negative integer) መሆን አለበት። ሁለተኛ፣ ለዴሪቫቲቭ የ Power Rule ሲሰራ n x^(n-1) ነው። ለምሳሌ የ x^5 ዴሪቫቲቭ 5x^4 ነው። ለ Quotient Rule ደግሞ መቼም እንዳይረሳ: Low D-High minus High D-Low over Low-Low...',
      om: 'Akkam jirtu barattoota Itoophiyaa! Har\'a qormaata bioolessaa irratti dhimmoota baay\'ee dhufan Kaalkulasii fi Pooleenoomiyaalii daqiiqaa muraasa keessatti irra deebina...',
      ti: 'ሰላም ክቡራት ተማሮ ኢትዮጵያ! ሎሚ ኣብ ብሔራዊ ፈተና ብብዝሒ ዝመጹ ናይ ካልኩለስን ፖሊኖሚያልን ሕግታት ብሓጺሩ ክንምልከት ኢና...',
      ar: 'أهلاً بكم أعزاءنا الطلبة والطالبات في إثيوبيا! في هذه الجلسة الصوتية المركزة سنستعرض معاً أهم مفاتيح التفاضل والتكامل لكثيرات الحدود. تذكروا دوماً أن كثير الحدود يشترط أن تكون أُسسه أعداداً صحيحة غير سالبة، وأن مشتق القوة ينزل الأس ويطرح منه واحد...',
      so: 'Ku soo dhawoow dib u eegista degdegga ah ee Calculus! Maanta waxaan eegi doonaa xeerarka aasaasiga ah...',
      en: 'Welcome Ethiopian national scholars! In this high-yield audio revision, we break down the definitive calculus essentials tested on the EUEE. First, verify polynomial validity: all exponents must be non-negative integers. Next, recall the power rule: d/dx [x^n] = n x^{n-1}. For rational quotients: remember Low D-High minus High D-Low over Low-squared...'
    }
  },
  {
    id: 'audio-rev-phys-newton',
    title: {
      am: 'የኒውተን ሕጎች እና የሞመንተም ጥበቃ የ 10 ደቂቃ የድምፅ ማጠቃለያ',
      om: 'Seerota Niiwutan fi Eegumsa Momeentamii',
      ti: 'ሕግታት ኒውተንን ፅንዓት ሞመንተምን ናይ 10 ደቒቕ ድምፂ',
      ar: 'قوانين نيوتن وحفظ كمية الحركة (الزخم) في 10 دقائق صوتية',
      so: 'Xeerarka Newton iyo Ilaalinta Momentum-ka 10 Daqiiqo',
      en: 'Newton’s Laws of Motion & Momentum Conservation 10-Minute Cram'
    },
    topic: {
      am: 'የእንቅስቃሴ ሕግጋት፣ ግጭቶች (Elastic vs Inelastic) እና ኢምፐልስ',
      om: 'Seerota Sochii fi Momeentamii',
      ti: 'ሕጊ ምንቅስቓስን ምግጫውን',
      ar: 'التصادم المرن وغير المرن وقوة الدفع والدفع الحركي',
      so: 'Dhaqdhaqaaqa iyo isku dhaca',
      en: 'Inertia, F=ma, action-reaction pairs, impulse-momentum theorem, and collision conservation'
    },
    subject: 'physics',
    grade: 10,
    durationMinutes: 10,
    audioDurationSeconds: 600,
    highYieldFormulas: [
      'Newton’s 2nd Law: ΣF = m * a = dp/dt',
      'Momentum: p = m * v [kg·m/s]',
      'Impulse: J = F_avg * Δt = Δp = m(v_f - v_i)',
      'Conservation of Linear Momentum: m1*u1 + m2*u2 = m1*v1 + m2*v2'
    ],
    keyMnemonics: {
      am: '💡 "ኢላስቲክ ግጭት (Elastic) = ሞመንተምም የኪነቲክ ኢነርጂም ይጠበቃል! ኢንኢላስቲክ (Inelastic) = ሞመንተም ብቻ ይጠበቃል!"',
      om: '💡 "Elastic: Momentum + Kinetic Energy lamaanuu eegamu!"',
      ti: '💡 "Elastic: ሞመንተምን ኪነቲክ ኢነርጂን ክልቲኦም ይዕቀቡ!"',
      ar: '💡 "التصادم المرن يحفظ الزخم والطاقة الحركية معاً، بينما التصادم غير المرن يحفظ الزخم فقط وتتحول الطاقة!"',
      so: '💡 "Elastic: Momentum iyo Tamarta Labadaba waa la ilaaliyaa!"',
      en: '💡 "Elastic = Momentum AND Kinetic energy conserved! Inelastic = Momentum conserved, but Kinetic energy dissipates into heat/sound!"'
    },
    transcripts: {
      am: 'እንኳን ደህና መጣችሁ ወደ ፊዚክስ ፈጣን የክለሳ ክፍል! የኒውተን ሦስቱ ሕጎች የሜካኒክስ ቁልፎች ናቸው። የመጀመሪያው ሕግ የዝግመት ሕግ (Inertia) ሲሆን፣ ውጫዊ ያልተመጣጠነ ኃይል እስካልመጣ ድረስ የነገሮች ፍጥነት አይቀየርም። ሁለተኛው ሕግ F = ma ወይም የሞመንተም ለውጥ ምጣኔን ይነግረናል። ሦስተኛው ደግሞ ለእያንዳንዱ ተግባር እኩል እና ተቃራኒ ምላሽ አለ (Action-Reaction)...',
      om: 'Baga nagaan dhuftan gara kutaalee herrega Fiiziksii! Seerri Niiwutan bu\'uura mekaaniksiti...',
      ti: 'እንቋዕ ብደሓን መፃእኹም ናብ ክፍለ ፊዚክስ! ሰለስቲኦም ሕግታት ኒውተን መሰረት ሜካኒክስ እዮም...',
      ar: 'مرحباً بكم في ملخص الفيزياء الصوتي المكثف. تمثل قوانين نيوتن الثلاثة حجر الزاوية للميكانيكا الكلاسيكية. القانون الأول هو القصور الذاتي، والقانون الثاني يربط محصلة القوى بالتسارع ومعدل تغير كمية الحركة، بينما القانون الثالث ينص على أن لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه...',
      so: 'Ku soo dhawoow dib u eegista fiisigiska degdegga ah...',
      en: 'Welcome to this 10-minute physics breakthrough! Newton’s three laws govern all classical dynamics. First Law: inertia maintains state unless an external net force acts. Second Law: net force equals the time rate of change of linear momentum (F = dp/dt = ma). Third Law: action and reaction forces are strictly equal in magnitude, opposite in direction, and act on DIFFERENT bodies...'
    }
  }
];

// ============================================================================
// HUB 6: AI PERSONALIZED STUDY TIMETABLE & DIAGNOSTIC PLANNER
// ============================================================================
export const INITIAL_STUDY_PLAN_DATA: AdaptiveStudyPlan = {
  id: 'plan-g10-euee-prep',
  studentGrade: 10,
  targetExamYear: '2025/2026 Academic MoE Session',
  targetScore: 540,
  dailyGoalHours: 3.5,
  totalDays: 30,
  completedDays: 7,
  currentStreak: 5,
  focusSubjects: ['mathematics', 'physics', 'chemistry', 'biology'],
  tasks: [
    {
      id: 'task-1',
      dayNumber: 1,
      unit: 'Math Unit 1: Relations and Functions',
      title: {
        am: 'የግንኙነቶች እና ፈንክሽኖች ዶሜይን እና ሬንጅ መለማመጃ',
        om: 'Domain fi Range shaakaluu',
        ti: 'ዶሜይንን ሬንጅን ፈንክሽን ምልምማድ',
        ar: 'تدريبات إيجاد المجال والمدى للعلاقات والدوال',
        so: 'Domain iyo Range tababar',
        en: 'Domain & range determination for rational & radical relations'
      },
      subject: 'mathematics',
      durationMinutes: 45,
      xpReward: 120,
      isCompleted: true,
      priority: 'High'
    },
    {
      id: 'task-2',
      dayNumber: 2,
      unit: 'Physics Unit 2: Vector Quantities in 2D',
      title: {
        am: 'የቬክተር ክፍፍል እና የኮምፖነንቶች ድምር ስሌት',
        om: 'Ida\'ama kutaalee veektarii',
        ti: 'ድምር ኮምፖነንታት ቬክተር',
        ar: 'تحليل المتجهات وجمع المركبات الأفقية والعمودية',
        so: 'Isku darka qaybaha vector-ka',
        en: 'Vector resolution and analytical resultant calculations'
      },
      subject: 'physics',
      durationMinutes: 40,
      xpReward: 100,
      isCompleted: true,
      priority: 'High'
    },
    {
      id: 'task-3',
      dayNumber: 3,
      unit: 'Chemistry Unit 1: Chemical Reactions & Stoichiometry',
      title: {
        am: 'የኬሚካላዊ እኩልታዎች ማመጣጠን እና የሞል ስሌት',
        om: 'Madaallii ekweeshinii fi moolii herreguu',
        ti: 'እኩልነት ኬሚስትሪ ማዕረ ምግባር',
        ar: 'موازنة المعادلات الكيميائية وحسابات المردود النظري والفعلي',
        so: 'Isku dheelitirka isla\'egyada kiimikada',
        en: 'Balancing redox equations & stoichiometric mole-ratio calculations'
      },
      subject: 'chemistry',
      durationMinutes: 50,
      xpReward: 130,
      isCompleted: true,
      priority: 'Critical'
    },
    {
      id: 'task-4',
      dayNumber: 4,
      unit: 'Math Unit 2: Polynomial Functions',
      title: {
        am: 'ሰው ሠራሽ ክፍፍል እና የፋክተር ንድፈ-ሐሳብ ልምምድ',
        om: 'Shaakala Synthetic Division',
        ti: 'ምልምማድ ሲንቴቲክ ዲቪዥን',
        ar: 'حل 15 مسألة في القسمة التركيبية ونظرية العامل',
        so: 'Tababarka Synthetic Division',
        en: '15 Synthetic division drill questions & factor verification'
      },
      subject: 'mathematics',
      durationMinutes: 45,
      xpReward: 110,
      isCompleted: true,
      priority: 'Critical'
    },
    {
      id: 'task-5',
      dayNumber: 5,
      unit: 'Biology Unit 2: Cell Biology & Transport',
      title: {
        am: 'የሴል ሜምብሬን ኦስሞሲስ እና አክቲቭ ትራንስፖርት ንፅፅር',
        om: 'Dhaabbata seelii fi daddabarsa qorachuu',
        ti: 'ምምርማር ትራንስፖርት ዋህዮ',
        ar: 'مقارنة النقل النشط بالانتشار الميسر والخاصية الأسموزية',
        so: 'Isbarbardhiga hababka gaadiidka unugyada',
        en: 'Active transport vs facilitated diffusion comparative essay'
      },
      subject: 'biology',
      durationMinutes: 35,
      xpReward: 90,
      isCompleted: true,
      priority: 'Medium'
    },
    {
      id: 'task-6',
      dayNumber: 6,
      unit: 'Physics Unit 3: 2D Motion & Projectiles',
      title: {
        am: 'የፕሮጀክትል ከፍተኛ ከፍታ እና ሬንጅ የፈተና ጥያቄዎች',
        om: 'Gaaffilee qormaataa Pirojektaayilii',
        ti: 'ሕቶታት ፈተና ፕሮጀክታይል',
        ar: 'حل مسائل قذائف المقذوفات في امتحانات الوزارة السابقة',
        so: 'Su\'aalaha imtixaanka ee Projectile',
        en: 'Past national exam trajectory calculations under timed conditions'
      },
      subject: 'physics',
      durationMinutes: 55,
      xpReward: 150,
      isCompleted: false,
      priority: 'Critical'
    },
    {
      id: 'task-7',
      dayNumber: 7,
      unit: 'Chemistry Unit 2: Atomic Structure & Periodicity',
      title: {
        am: 'የኤሌክትሮኔጋቲቪቲ እና የአዮናይዜሽን ኢነርጂ አዝማሚያዎች',
        om: 'Amala Piriyeodikii',
        ti: 'አዝማሚያታት ፒሪዮዲክ ሰሌዳ',
        ar: 'مراجعة اتجاهات الكهروسالبية وطاقة التأين في الجدول الدوري',
        so: 'Dib u eegista miiska xilliyada',
        en: 'Periodic trends: Electronegativity, atomic radius, and ionization energy'
      },
      subject: 'chemistry',
      durationMinutes: 40,
      xpReward: 105,
      isCompleted: false,
      priority: 'High'
    },
    {
      id: 'task-8',
      dayNumber: 8,
      unit: 'Comprehensive Diagnostic Milestone Exam',
      title: {
        am: 'የ 30 ጥያቄዎች የመጀመሪያ ምዕራፍ የክለሳ ፈተና (Diagnostic Check)',
        om: 'Qormaata Madaallii Marsaa 1ffaa',
        ti: 'ናይ ምዕራፍ ሓደ ናይ ምፍታሽ ፈተና',
        ar: 'الاختبار التشخيصي الشامل الأول في المواد العلمية الأربع',
        so: 'Imtixaanka ogaanshaha bilowga',
        en: 'First comprehensive diagnostic benchmark across all STEM units'
      },
      subject: 'mathematics',
      durationMinutes: 60,
      xpReward: 250,
      isCompleted: false,
      priority: 'Critical'
    }
  ]
};
