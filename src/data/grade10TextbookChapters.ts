import { TextbookChapter, LabExperiment } from './textbooksRegistry';

const DEFAULT_LAB_EXPERIMENT: LabExperiment = {
  id: 'lab-p-kinematics',
  title: {
    am: 'የላቦራቶሪ ሙከራ፡ የቲከር ታይመር እና የተዳፋት ገበታ እንቅስቃሴ',
    om: 'Qormaata Laabooratoorii: Ticker Timer fi Sochii Tolfamaa',
    ti: 'ናይ ላቦራቶሪ ፈተነ፡ ቲከር ታይመርን ዳገትን',
    ar: 'تجربة مختبرية: دراسة حركة العربة على مسار مائل بجهاز توقيت النبضات',
    so: 'Tijaabada Shaybaarka: Dhaqdhaqaaqa gaariga ee sagxada qaloocan',
    en: 'Laboratory Experiment: Uniform Acceleration on an Inclined Plane Using a Ticker-Timer',
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
    'Ticker tape roll',
    'Dynamics trolley',
    'Inclined track (1.5 m ramp)',
    '12V AC power supply',
    'Stopwatch & 1-meter ruler',
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
  ],
  safetyPrecautions: {
    am: 'ጥንቃቄ፡ ተሽከርካሪው ጋሪ ወለል ላይ እንዳይወድቅ ከታችኛው ጫፍ ማቆሚያ አስቀምጡ።',
    om: 'Of-eeggannoo: Gaariin akka hin kufne gadi qabaa.',
    ti: 'ጥንቃቐ፡ ዓረብያ ከይወድቕ ተኸላኸሉ።',
    ar: 'احتياط أمان: ثبت مصداً عند أسفل المسار لمنع سقوط العربة على الأرض.',
    so: 'Digniin: Ka ilaali inuu gaarigu dhaco.',
    en: 'Safety: Place a cushioned bumper at the ramp bottom to catch the trolley safely.',
  },
  observationNotes: {
    am: 'በቲከር ቴፑ ላይ ያሉት ነጥቦች እያደጉ የሚሄዱበት ርቀት ፍጥንጥነቱን ያረጋግጣል።',
    om: 'Fageenyi qabxiiwwan teepii saffisiisa agarsiisa.',
    ti: 'ርሕቐት ነጥብታት ቅልጣፈ የርኢ።',
    ar: 'تباعد النقاط على الشريط يوضح زيادة السرعة مع الزمن (تسارع ثابت).',
    so: 'Kala fogaanshaha dhibcuhu wuxuu muujinayaa dardargelinta.',
    en: 'Increasing spark-dot spacing directly verifies constant linear acceleration.',
  },
  diagramSvgType: 'kinematics_trolley',
};

// =============================================================
// GRADE 10 MATHEMATICS - ALL 7 OFFICIAL UNITS (pp. 1 - 385)
// =============================================================
export const GRADE_10_MATH_CHAPTERS: TextbookChapter[] = [
  // -----------------------------------------------------------
  // UNIT 1: RELATIONS AND FUNCTIONS (pp. 1-66)
  // -----------------------------------------------------------
  {
    unitNumber: 1,
    title: {
      am: 'ምዕራፍ 1፡ ዝምድና እና ፈንክሽን (Relations and Functions)',
      om: 'Boqonnaa 1: Walitti dhufeenya fi Faankishinii (Relations and Functions)',
      ti: 'ምዕራፍ 1፡ ርክብን ፋንክሽንን',
      ar: 'الوحدة 1: العلاقات والدوال الحقيقية (Relations and Functions)',
      so: 'Cutubka 1: Xiriirka iyo Shaqooyinka',
      en: 'Unit 1: Relations and Functions',
    },
    startPage: 1,
    endPage: 66,
    theoryContent: {
      am: `ምዕራፍ 1 የሂሳብ መሰረታዊ ፅንሰ-ሀሳብ የሆነውን የዝምድና (Relations) እና የፈንክሽን (Functions) ባህሪያትን በጥልቀት ይተነትናል።
1.1 ዝምድና (Relations): የተጣመሩ ቁጥሮች (Ordered Pairs) (a, b) ሲሆኑ፣ የሁለት ስብስቦች ካርቴዥያን ብዜት A × B = {(a, b) : a ∈ A እና b ∈ B} ነው። ዝምድና R ከ A ወደ B የ A × B ንዑስ ስብስብ ነው። 
- መነሻ ክልል (Domain) = {x : (x, y) ∈ R}
- መዳረሻ ክልል (Range) = {y : (x, y) ∈ R}
- የተገላቢጦሽ ዝምድና (Inverse Relation) R⁻¹ = {(y, x) : (x, y) ∈ R} ሲሆን በ y = x መስመር ላይ የተገላቢጦሽ ነፀብራቅ (Reflection) ያሳያል።

1.2 ፈንክሽን (Functions): ፈንክሽን f ከ A ወደ B የሚደረግ ልዩ ዝምድና ሲሆን ለእያንዳንዱ x ∈ A አንድ እና አንድ ብቻ y ∈ B ይመድባል።
- የቁልቁል መስመር ፈተና (Vertical Line Test)፡ ማንኛውም ቀጥ ያለ መስመር የፈንክሽኑን ግራፍ ቢበዛ በአንድ ነጥብ ብቻ ይቆርጣል።
- አንድ ለአንድ ፈንክሽን (One-to-One / Injective): f(a) = f(b) ከሆነ a = b መሆን አለበት (የአግድም መስመር ፈተና - Horizontal Line Test)።
- ሙሉ ፈንክሽን (Onto / Surjective): የመዳረሻ ክልሉ ከኮዶሜኑ ጋር እኩል ሲሆን ነው።
- ድርብ ፈንክሽን (Composition): (f ∘ g)(x) = f(g(x))። የተገላቢጦሽ ፈንክሽን f⁻¹(x) የሚኖረው ፈንክሽኑ አንድ ለአንድና ሙሉ (Bijective) ሲሆን ብቻ ነው።

1.3 የተግባር አተገባበር፡ በኢኮኖሚክስ፣ በግብርና ምርታማነት፣ እና በፊዚክስ ትንበያዎች ላይ ፈንክሽኖች የወጪ፣ የገቢና የትርፍ ቀመር P(x) = R(x) - C(x) ሆነው ያገለግላሉ።`,
      om: `Boqonnaa 1: Walitti dhufeenya fi faankishinii sirritti ibsa.
A × B keessatti ordered pairs (x, y) qabata. Domain qabxii jalqabaa, Range qabxii lammaffaa dha.
Faankishiniin x tokkoof y tokko qofa kan kennu dha. (f ∘ g)(x) = f(g(x)).`,
      ti: `ምዕራፍ 1፡ ርክብን ፋንክሽንን ዝምልከት መተንተኒ። ካርቴዥያን ብዜት A × B ን ዝምድናን f(x) ፈንክሽንን የመልክት።`,
      ar: `الوحدة 1: العلاقات والدوال. يحدد النطاق والمدى، وتركيب الدوال (f ∘ g)(x) والدوال العكسية، وتطبيقات النمذجة الاقتصادية.`,
      so: `Cutubka 1: Xiriirka iyo Shaqooyinka xisaabta iyo hababka xallinta.`,
      en: `Unit 1 covers Cartesian products, relations, domain/range, inverse relations, one-to-one/onto functions, composite functions (f ∘ g)(x), and mathematical modeling.`,
    },
    examples: [
      {
        id: 'ex-m-1.1',
        exampleNumber: 'ምሳሌ 1.1 (Domain & Inverse Function)',
        problemStatement: {
          am: 'ፈንክሽን f(x) = (2x + 5) / (x - 3) ተሰጥቷል። (a) የ f(x) ዶሜይን ፈልግ፤ (b) የተገላቢጦሽ ፈንክሽኑን f⁻¹(x) ቀመር እና ዶሜይኑን አስላ።',
          om: 'Faankishinii f(x) = (2x + 5) / (x - 3) kennameef domain fi inverse f⁻¹(x) barbaadi.',
          ti: 'f(x) = (2x + 5) / (x - 3) ዶመይንን f⁻¹(x)ን ድለ።',
          ar: 'لتكن الدالة f(x) = (2x + 5) / (x - 3). أوجد: (أ) مجال الدالة، (ب) قاعدة الدالة العكسية f⁻¹(x) ومجالها.',
          so: 'Soo hel domain-ka iyo f⁻¹(x) ee f(x) = (2x + 5) / (x - 3).',
          en: 'Given f(x) = (2x + 5) / (x - 3), determine: (a) the domain of f(x), (b) the formula for f⁻¹(x) and its domain.',
        },
        given: ['f(x) = (2x + 5) / (x - 3)', 'ተከፋዩ (Denominator) x - 3 ≠ 0 መሆን አለበት'],
        formula: 'y = f(x) ⇒ x = f⁻¹(y)፤ x እና y ቦታ በመቀያየር x ን ማውጣት',
        calculationSteps: [
          {
            am: 'ደረጃ 1 (Domain)፡ ተከፋዩ ዜሮ መሆን ስለሌለበት፡ x - 3 ≠ 0 ⇒ x ≠ 3። ስለዚህ Domain = ℝ \\ {3} ወይም (-∞, 3) ∪ (3, ∞)።',
            om: 'Tarkaanfii 1: x - 3 ≠ 0 ⇒ x ≠ 3. Domain = ℝ \\ {3}.',
            ti: 'ደረጃ 1፡ x - 3 ≠ 0 ⇒ x ≠ 3። Domain = ℝ \\ {3}።',
            ar: 'الخطوة 1: المقام لا يساوي صفراً: x - 3 ≠ 0 ومنه x ≠ 3. إذن المجال هو ℝ \\ {3}.',
            so: 'Tallaabada 1: x ≠ 3, Domain = ℝ \\ {3}.',
            en: 'Step 1: Denominator must not vanish: x - 3 ≠ 0 ⇒ x ≠ 3. Domain(f) = ℝ \\ {3}.',
          },
          {
            am: 'ደረጃ 2 (Inverse)፡ y = (2x + 5) / (x - 3) እንበል። በሁለቱም በኩል በ (x - 3) አባዛ፡ y(x - 3) = 2x + 5 ⇒ yx - 3y = 2x + 5።',
            om: 'Tarkaanfii 2: y(x - 3) = 2x + 5 ⇒ yx - 2x = 3y + 5.',
            ti: 'ደረጃ 2፡ y(x - 3) = 2x + 5 ⇒ yx - 2x = 3y + 5።',
            ar: 'الخطوة 2: اضرب الطرفين: y(x - 3) = 2x + 5 ومنه yx - 2x = 3y + 5.',
            so: 'Tallaabada 2: yx - 2x = 3y + 5.',
            en: 'Step 2: Cross-multiply: y(x - 3) = 2x + 5 ⇒ xy - 3y = 2x + 5.',
          },
          {
            am: 'ደረጃ 3 (Solve for x)፡ x(y - 2) = 3y + 5 ⇒ x = (3y + 5) / (y - 2)። x እና y ቦታ ስንቀይር፡ f⁻¹(x) = (3x + 5) / (x - 2)፤ Domain(f⁻¹) = ℝ \\ {2}።',
            om: 'Tarkaanfii 3: f⁻¹(x) = (3x + 5) / (x - 2), Domain = ℝ \\ {2}.',
            ti: 'ደረጃ 3፡ f⁻¹(x) = (3x + 5) / (x - 2)፤ Domain = ℝ \\ {2}።',
            ar: 'الخطوة 3: أخرج x كعامل مشترك: x = (3y + 5)/(y - 2). إذن f⁻¹(x) = (3x + 5)/(x - 2) ومجالها ℝ \\ {2}.',
            so: 'Tallaabada 3: f⁻¹(x) = (3x + 5) / (x - 2).',
            en: 'Step 3: Factor x(y - 2) = 3y + 5 ⇒ x = (3y + 5)/(y - 2). Swap variables: f⁻¹(x) = (3x + 5)/(x - 2) with Domain = ℝ \\ {2}.',
          },
        ],
        finalAnswer: {
          am: 'Domain(f) = ℝ \\ {3} ፤ f⁻¹(x) = (3x + 5) / (x - 2) ፤ Domain(f⁻¹) = ℝ \\ {2}',
          om: 'Domain(f) = ℝ \\ {3}; f⁻¹(x) = (3x + 5) / (x - 2); Domain(f⁻¹) = ℝ \\ {2}',
          ti: 'Domain(f) = ℝ \\ {3}፤ f⁻¹(x) = (3x + 5)/(x - 2)፤ Domain(f⁻¹) = ℝ \\ {2}',
          ar: 'مجال الدالة: ℝ \\ {3}؛ الدالة العكسية f⁻¹(x) = (3x + 5)/(x - 2) ومجالها ℝ \\ {2}',
          so: 'Domain(f) = ℝ \\ {3}, f⁻¹(x) = (3x + 5) / (x - 2)',
          en: 'Domain(f) = ℝ \\ {3}; f⁻¹(x) = (3x + 5) / (x - 2); Domain(f⁻¹) = ℝ \\ {2}',
        },
        pedagogicalNote: {
          am: 'ልብ ይበሉ፡ የዋናው ፈንክሽን ሬንጅ (Range) ከተገላቢጦሹ ዶሜይን (Domain) ጋር ሁልጊዜ እኩል ነው።',
          om: 'Range faankishinii jalqabaa = Domain faankishinii inverse.',
          ti: 'Range ናይቲ ቀዳማይ = Domain ናይቲ inverse።',
          ar: 'لاحظ أن مدى الدالة الأصلية هو تماماً مجال الدالة العكسية.',
          so: 'Xusuusnoow: Range(f) = Domain(f⁻¹).',
          en: 'Note that Range(f) equals Domain(f⁻¹), establishing reciprocal duality.',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-1',
        activityNumber: 'አክቲቪቲ 1.1',
        title: {
          am: 'የተገላቢጦሽ ግራፍ በ y = x መስመር ላይ መሳል',
          om: 'Giraafii Inverse y = x irratti hojjedhaa',
          ti: 'ግራፍ inverse ኣብ y = x ምስኣል',
          ar: 'رسم بياني للدالة العكسية وانعكاسها على المستقيم y = x',
          so: 'Sawir garaafka f⁻¹(x) ee xariiqda y = x',
          en: 'Graphing Inverse Functions and Reflection Across y = x',
        },
        instruction: {
          am: 'የ f(x) = 2x - 4 እና የ f⁻¹(x) = (x + 4)/2 ግራፍ በአንድ የካርቴዥያን ወረቀት ላይ ሰርታችሁ በ y = x መስመር ላይ እጠፉት።',
          om: 'Giraafii f(x) fi f⁻¹(x) waraqaa tokkorratti sararaa.',
          ti: 'ናይ f(x)ን f⁻¹(x)ን ግራፍ ኣብ ሓደ ወረቐት ስርሑ።',
          ar: 'ارسم منحنى الدالتين وتحقق من تطابقهما عند طي ورقة الرسم على المستقيم y = x.',
          so: 'Ku sawir f(x) iyo f⁻¹(x) hal waraaq.',
          en: 'Plot f(x) and f⁻¹(x) on standard graph paper and verify symmetry across y = x.',
        },
        groupTask: {
          am: 'የማንኛውም ነጥብ (a, b) በ y = x መስመር ሲንፀባረቅ (b, a) መሆኑን በቡድን አረጋግጡ።',
          om: 'Qabxiin (a, b) gara (b, a) tti jijjiiramuu mirkaneessaa.',
          ti: 'ነጥቢ (a, b) ናብ (b, a) ምቕያሩ ኣረጋግጹ።',
          ar: 'أثبت أن انعكاس أي نقطة (a, b) حول المحور y = x يعطي النقطة (b, a).',
          so: 'Xaqiiji in (a, b) u wareegayso (b, a).',
          en: 'Demonstrate algebraically that reflection of (a, b) across y = x yields (b, a).',
        },
        criticalThinkingQuestion: {
          am: 'የ f(x) = x² ፈንክሽን ለምን በሙሉ የሪል ቁጥሮች ላይ ተገላቢጦሽ አይኖረውም? ዶሜይኑን እንዴት መገደብ አለብን?',
          om: 'f(x) = x² maaliif inverse hin qabne? Domain akkamitti daangessina?',
          ti: 'f(x) = x² ስለምንታይ inverse የብሉን?',
          ar: 'لماذا لا تمتلك الدالة f(x) = x² دالة عكسية على كامل مجموعة الأعداد الحقيقية؟ وكيف نقيد مجالها؟',
          so: 'Maxay f(x) = x² u yeelan weyday f⁻¹(x)?',
          en: 'Why does f(x) = x² fail the Horizontal Line Test on ℝ, and how do we restrict its domain?',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-1.1',
        exerciseNumber: 'የምዕራፍ 1 ፈተና ጥያቄ 1',
        type: 'multiple_choice',
        question: {
          am: 'f(x) = 3x - 1 እና g(x) = x² + 2 ቢሆኑ፡ (f ∘ g)(2) ስንት ነው?',
          om: 'f(x) = 3x - 1 fi g(x) = x² + 2 yoo ta\'an, (f ∘ g)(2) meeqa?',
          ti: 'f(x) = 3x - 1 ን g(x) = x² + 2 እንተኾይኖም፡ (f ∘ g)(2) ክንደይ እዩ?',
          ar: 'إذا كانت f(x) = 3x - 1 و g(x) = x² + 2، فما قيمة (f ∘ g)(2)؟',
          so: 'Haddii f(x) = 3x - 1 iyo g(x) = x² + 2, waa maxay (f ∘ g)(2)?',
          en: 'If f(x) = 3x - 1 and g(x) = x² + 2, evaluate (f ∘ g)(2).',
        },
        options: ['A. 15', 'B. 17', 'C. 27', 'D. 19'],
        correctAnswer: {
          am: 'B. 17 — ምክንያቱም g(2) = 2² + 2 = 6 ሲሆን፣ f(6) = 3(6) - 1 = 17 ነው',
          om: 'B. 17',
          ti: 'B. 17',
          ar: 'B. 17 (حيث g(2) = 6 ثم f(6) = 17)',
          so: 'B. 17',
          en: 'B. 17 — Since g(2) = 2² + 2 = 6, and f(6) = 3(6) - 1 = 17',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ ውስጣዊውን ፈንክሽን አስላ፡ g(2) = (2)² + 2 = 4 + 2 = 6።',
            om: 'Tarkaanfii 1: g(2) = 6.',
            ti: 'ደረጃ 1፡ g(2) = 6።',
            ar: 'الخطوة 1: احسب الدالة الداخلية g(2) = 2² + 2 = 6.',
            so: 'Tallaabada 1: g(2) = 6.',
            en: 'Step 1: Evaluate the inner function: g(2) = 2² + 2 = 6.',
          },
          {
            am: 'ደረጃ 2፡ የውጭውን ፈንክሽን አስላ፡ f(g(2)) = f(6) = 3(6) - 1 = 18 - 1 = 17።',
            om: 'Tarkaanfii 2: f(6) = 3(6) - 1 = 17.',
            ti: 'ደረጃ 2፡ f(6) = 17።',
            ar: 'الخطوة 2: عوض الناتج في f(x): f(6) = 3(6) - 1 = 17.',
            so: 'Tallaabada 2: f(6) = 17.',
            en: 'Step 2: Substitute into outer function: f(6) = 3(6) - 1 = 17.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ ማብራሪያ፡ የፈንክሽን ውህደት (f ∘ g) ተለዋዋጭ (Commutative) አይደለም፤ በአጠቃላይ (f ∘ g)(x) ≠ (g ∘ f)(x)። ለበለጠ የብሔራዊ ፈተና ጥያቄዎች የአጋዥ መጽሐፍ ገፅ 64 ይመልከቱ።',
      om: 'Hubachiisa: (f ∘ g)(x) ≠ (g ∘ f)(x).',
      ti: 'ተወሳኺ ሓበሬታ፡ (f ∘ g)(x) ≠ (g ∘ f)(x)።',
      ar: 'إضاءة منهجية: تركيب الدوال عملية غير تبادلية؛ أي أن (f ∘ g) ≠ (g ∘ f) في الحالة العامة.',
      so: 'Xusuusin: (f ∘ g) maaha mid la isku beddeli karo.',
      en: 'Pedagogical insight: Function composition is non-commutative: (f ∘ g)(x) ≠ (g ∘ f)(x) in general.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 2: POLYNOMIAL FUNCTIONS (pp. 67-120)
  // -----------------------------------------------------------
  {
    unitNumber: 2,
    title: {
      am: 'ምዕራፍ 2፡ ፖሊኖሚያል ፈንክሽን (Polynomial Functions)',
      om: 'Boqonnaa 2: Faankishinii Poolinoomiyaalii (Polynomial Functions)',
      ti: 'ምዕራፍ 2፡ ፖሊኖሚያል ፈንክሽን',
      ar: 'الوحدة 2: كثيرات الحدود ودوالها (Polynomial Functions)',
      so: 'Cutubka 2: Shaqooyinka Polynomial',
      en: 'Unit 2: Polynomial Functions',
    },
    startPage: 67,
    endPage: 120,
    theoryContent: {
      am: `ምዕራፍ 2 የፖሊኖሚያል ፈንክሽን ቀመሮችን፣ ስሌቶችን፣ ቴዎረሞችንና ግራፎችን ይዘረዝራል፦
2.1 የፖሊኖሚያል ትርጉም፡ P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀ (aₙ ≠ 0) ሲሆን n ሙሉ አዎንታዊ ቁጥር (Non-negative integer) ነው።
2.2 የፖሊኖሚያል ስሌት፡ መደመር፣ መቀነስ፣ ማባዛት እና ረጅም ማካፈል (Long Division)። በ x - c ለማካፈል አቋራጩ ዘዴ ሲንቴቲክ ማካፈል (Synthetic Division) ይባላል።
2.3 ወሳኝ ቴዎረሞች፡
- የቀሪ ቴዎረም (Remainder Theorem): P(x) በ (x - c) ሲካፈል የሚገኘው ቀሪ R = P(c) ነው።
- የፋክተር ቴዎረም (Factor Theorem): (x - c) የ P(x) ፋክተር የሚሆነው P(c) = 0 ከሆነና ከሆነ ብቻ ነው።
2.4 የፖሊኖሚያል ዜሮዎች (Zeros): የፖሊኖሚያል ዜሮዎች ማለት P(x) = 0 የሚያደርጉ የ x ዋጋዎች ናቸው። 
- የራሽናል ስርወ-ቁጥር ቴዎረም (Rational Root Theorem)፡ ማንኛውም ራሽናል ዜሮ p/q ሲሆን p የቋሚ ቁጥሩ a₀ አካፋይ፣ q ደግሞ የፊት መሪው aₙ አካፋይ ነው።
2.5 የፖሊኖሚያል ግራፎች፡ ግራፉ ለስላሳና ቀጣይ (Smooth & Continuous) ኩርባ ነው። የጫፎቹ አቅጣጫ በመሪው ቃል aₙxⁿ (Leading Coefficient Test) ይወሰናል።
2.6 ተግባራዊ አተገባበር፡ የእቃ መያዣ ሳጥን ስፋትንና ይዘትን ማሳደግ (Volume Optimization) እና የፍጥነት ኩርባዎችን መቅረጽ።`,
      om: `Boqonnaa 2: Polynomial functions, synthetic division, Remainder Theorem, Factor Theorem fi graphs ibsa.`,
      ti: `ምዕራፍ 2፡ ፖሊኖሚያል ፈንክሽንን ናይ ቀሪ ቴዎረምን ፋክተር ቴዎረምን ግራፍን።`,
      ar: `الوحدة 2: كثيرات الحدود، نظريتا الباقي والعوامل، جذور كثيرات الحدود، ورسم المنحنيات البيانية وتطبيقاتها الهندسية.`,
      so: `Cutubka 2: Xisaabinta polynomials iyo xallinta isleegyada heerka sare.`,
      en: `Unit 2 covers polynomial definitions, long & synthetic division, Remainder & Factor Theorems, Rational Root Theorem, and graphing.`,
    },
    examples: [
      {
        id: 'ex-m-2.1',
        exampleNumber: 'ምሳሌ 2.1 (Factor Theorem & Synthetic Division)',
        problemStatement: {
          am: 'P(x) = 2x³ - 3x² - 11x + 6 ሙሉ በሙሉ በፋክተር ተንትነው ዜሮዎቹን ፈልጉ።',
          om: 'P(x) = 2x³ - 3x² - 11x + 6 guutummaatti factor godhaa.',
          ti: 'P(x) = 2x³ - 3x² - 11x + 6 ፋክተር ብምግባር ዜሮታቱ ድለዩ።',
          ar: 'حلل كثير الحدود P(x) = 2x³ - 3x² - 11x + 6 إلى عوامله الأولية وأوجد جميع أصفاره الحقيقية.',
          so: 'Factor garee P(x) = 2x³ - 3x² - 11x + 6.',
          en: 'Factor P(x) = 2x³ - 3x² - 11x + 6 completely and find all of its zeros.',
        },
        given: ['P(x) = 2x³ - 3x² - 11x + 6', 'a₀ = 6, a₃ = 2'],
        formula: 'Rational Root Candidates: p/q ∈ {±1, ±2, ±3, ±6} / {1, 2}',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ ሊሆኑ የሚችሉ ራሽናል ስሮች፡ ±1, ±1/2, ±2, ±3, ±3/2, ±6። x = 3 ን እንሞክር፡ P(3) = 2(27) - 3(9) - 11(3) + 6 = 54 - 27 - 33 + 6 = 0። ስለዚህ (x - 3) ፋክተር ነው!',
            om: 'Tarkaanfii 1: P(3) = 0 waan ta\'eef (x - 3) faaktarii dha.',
            ti: 'ደረጃ 1፡ P(3) = 0 ስለዝኾነ (x - 3) ፋክተር እዩ።',
            ar: 'الخطوة 1: اختبر x = 3: P(3) = 54 - 27 - 33 + 6 = 0، إذن (x - 3) عامل من عوامل P(x).',
            so: 'Tallaabada 1: P(3) = 0, markaa (x - 3) waa factor.',
            en: 'Step 1: Test x = 3: P(3) = 2(27) - 3(9) - 11(3) + 6 = 0. Hence (x - 3) is a factor.',
          },
          {
            am: 'ደረጃ 2፡ በሲንቴቲክ ማካፈል ወደ ኳድራቲክ ዝቅ አድርግ፡ [3 | 2  -3  -11   6] ⇒ ውጤት፡ 2x² + 3x - 2 = 0።',
            om: 'Tarkaanfii 2: Synthetic division gargaaramuun: 2x² + 3x - 2 arganna.',
            ti: 'ደረጃ 2፡ ብሲንቴቲክ ማካፈል፡ 2x² + 3x - 2 ይርከብ።',
            ar: 'الخطوة 2: بالقسمة التركيبية على 3، ينتج خارج القسمة: 2x² + 3x - 2.',
            so: 'Tallaabada 2: 2x² + 3x - 2.',
            en: 'Step 2: Synthetic division by 3 yields depressed quadratic quotient: 2x² + 3x - 2.',
          },
          {
            am: 'ደረጃ 3፡ ኳድራቲኩን ፋክተር አድርግ፡ 2x² + 3x - 2 = (2x - 1)(x + 2)። ስለዚህ P(x) = (x - 3)(2x - 1)(x + 2)። ዜሮዎቹ፡ x = 3, x = 1/2, x = -2 ናቸው።',
            om: 'Tarkaanfii 3: (x - 3)(2x - 1)(x + 2) = 0. Zeros: 3, 1/2, -2.',
            ti: 'ደረጃ 3፡ (x - 3)(2x - 1)(x + 2) = 0። ዜሮታት፡ 3, 1/2, -2።',
            ar: 'الخطوة 3: حلل المقدار التربيعي: (2x - 1)(x + 2). فتكون الأصفار هي: 3، 1/2، -2.',
            so: 'Tallaabada 3: x = 3, 1/2, -2.',
            en: 'Step 3: Factor quadratic: 2x² + 3x - 2 = (2x - 1)(x + 2). Complete zeros: x = 3, 1/2, -2.',
          },
        ],
        finalAnswer: {
          am: 'P(x) = (x - 3)(2x - 1)(x + 2) ፤ ዜሮዎቹ፡ {-2, 1/2, 3}',
          om: 'P(x) = (x - 3)(2x - 1)(x + 2); Zeros = {-2, 1/2, 3}',
          ti: 'P(x) = (x - 3)(2x - 1)(x + 2)፤ ዜሮታት = {-2, 1/2, 3}',
          ar: 'P(x) = (x - 3)(2x - 1)(x + 2)؛ ومجموعة الأصفار هي {-2, 1/2, 3}',
          so: 'Zeros = {-2, 1/2, 3}',
          en: 'P(x) = (x - 3)(2x - 1)(x + 2); Zeros: {-2, 1/2, 3}',
        },
        pedagogicalNote: {
          am: 'የዲግሪ 3 ፖሊኖሚያል ቢበዛ 3 እውነተኛ ስሮች አሉት (Fundamental Theorem of Algebra)።',
          om: 'Polynomial degree 3 zeros 3 qaba.',
          ti: 'ዲግሪ 3 ዘለዎ ፖሊኖሚያል 3 ዜሮታት ኣለዉዎ።',
          ar: 'تنص المبرهنة الأساسية في الجبر على أن لكثير الحدود من الدرجة n ما يصل إلى n من الأصفار.',
          so: 'Polynomial degree 3 wuxuu leeyahay ugu badnaan 3 zeros.',
          en: 'By the Fundamental Theorem of Algebra, a degree-3 polynomial has up to 3 roots.',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-2',
        activityNumber: 'አክቲቪቲ 2.1',
        title: {
          am: 'የመሪ ቃል ፈተና (Leading Coefficient Test) ትንተና',
          om: 'Qormaata Leading Coefficient Test',
          ti: 'መሪ ቃል ፈተና',
          ar: 'تحليل سلوك طرفي المنحنى لاختبار المعامل الرئيسي',
          so: 'Baaritaanka Leading Coefficient Test',
          en: 'Investigating End Behavior via the Leading Coefficient Test',
        },
        instruction: {
          am: 'የ P(x) = x⁴ - 4x² እና Q(x) = -x³ + 3x ግራፎችን በ x → ∞ እና x → -∞ አቅጣጫ ተመልከቱ።',
          om: 'Soddoma x → ±∞ irratti gama lameen ilaalaa.',
          ti: 'x → ±∞ ኣብ ዝኸደሉ ግራፍ ተዓዘቡ።',
          ar: 'ادرس سلوك المنحنى عندما تؤول x إلى مالانهاية وسالب مالانهاية.',
          so: 'Daraasee xaga x → ±∞.',
          en: 'Observe the end behaviors of even-degree and odd-degree polynomials as x → ±∞.',
        },
        groupTask: {
          am: 'ጥንድ (Even) ዲግሪ ያላቸው ፖሊኖሚያሎች ሁለቱም ጫፎች ወደ አንድ አቅጣጫ፣ ጎዶሎ (Odd) ዲግሪ ያላቸው ደግሞ ወደ ተቃራኒ አቅጣጫ እንደሚሄዱ አረጋግጡ።',
          om: 'Even fi Odd degree garaagarummaa isaanii mirkaneessaa.',
          ti: 'Even ን Odd ን ዘለዎም ፍልልይ ኣረጋግጹ።',
          ar: 'استنتج أن الدوال ذات الدرجات الزوجية تسلك النهايتان نفس الاتجاه، بينما الفردية في اتجاهين متعاكسين.',
          so: 'Cadee farqiga u dhexeeya even iyo odd degrees.',
          en: 'Formulate the general rule that even-degree ends share the same direction, while odd-degree ends oppose.',
        },
        criticalThinkingQuestion: {
          am: 'አንድ የ 4ኛ ዲግሪ ፖሊኖሚያል ቢበዛ ስንት የመታጠፊያ ነጥቦች (Turning points) ሊኖሩት ይችላል?',
          om: 'Polynomial degree 4 turning points meeqa qabaachuu danda\'a?',
          ti: 'ዲግሪ 4 ዘለዎ ፖሊኖሚያል ክንደይ ናይ መጥወዪ ነጥብታት ይህልውዎ?',
          ar: 'ما هو الحد الأقصى لعدد نقاط التحول (Turning Points) لمنحنى دالة من الدرجة الرابعة؟',
          so: 'Immisa turning points ayaa suurtagal ah degree 4?',
          en: 'What is the maximum number of turning points for a degree-4 polynomial curve? (Answer: n - 1 = 3).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-2.1',
        exerciseNumber: 'የምዕራፍ 2 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'P(x) = x³ - 2x² + kx - 6 በ (x - 2) ያለ ቀሪ ቢካፈል፣ የ k ዋጋ ስንት ነው?',
          om: 'P(x) = x³ - 2x² + kx - 6 yoo (x - 2) tiin qoodamee hafteen 0 ta\'e, k meeqa?',
          ti: 'P(x) = x³ - 2x² + kx - 6 ብ (x - 2) እንተተመቒሉ፣ ዋጋ k ክንደይ እዩ?',
          ar: 'إذا كان كثير الحدود P(x) = x³ - 2x² + kx - 6 يقبل القسمة على (x - 2) بدون باقٍ، فما قيمة k؟',
          so: 'Haddii P(x) = x³ - 2x² + kx - 6 loo qaybiyo (x - 2) oo haraagu yahay 0, waa maxay k?',
          en: 'If P(x) = x³ - 2x² + kx - 6 is divisible by (x - 2) with zero remainder, find k.',
        },
        options: ['A. 1', 'B. 2', 'C. 3', 'D. 6'],
        correctAnswer: {
          am: 'C. 3 — በቀሪ ቴዎረም መሰረት P(2) = 0 መሆን አለበት፡ 2³ - 2(2²) + 2k - 6 = 0 ⇒ 8 - 8 + 2k - 6 = 0 ⇒ 2k = 6 ⇒ k = 3',
          om: 'C. 3',
          ti: 'C. 3',
          ar: 'C. 3 (وفق نظرية العوامل: P(2) = 8 - 8 + 2k - 6 = 0 ومنه k = 3)',
          so: 'C. 3',
          en: 'C. 3 — By Factor Theorem, P(2) = 0 ⇒ 8 - 8 + 2k - 6 = 0 ⇒ 2k = 6 ⇒ k = 3.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ በፋክተር ቴዎረም መሰረት (x - 2) ፋክተር ከሆነ፡ P(2) = 0 ነው።',
            om: 'P(2) = 0.',
            ti: 'P(2) = 0።',
            ar: 'الخطوة 1: بالتعويض عن x = 2 ينتج P(2) = 0.',
            so: 'P(2) = 0.',
            en: 'Step 1: Apply Factor Theorem: P(2) = 0.',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ (2)³ - 2(2)² + k(2) - 6 = 8 - 8 + 2k - 6 = 2k - 6 = 0 ⇒ k = 3።',
            om: '2k - 6 = 0 ⇒ k = 3.',
            ti: '2k - 6 = 0 ⇒ k = 3።',
            ar: 'الخطوة 2: 2k - 6 = 0 وبالتالي k = 3.',
            so: '2k = 6 ⇒ k = 3.',
            en: 'Step 2: Solve 2k - 6 = 0 ⇒ k = 3.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ ማብራሪያ፡ ፖሊኖሚያልን በሲንቴቲክ ዲቪዥን ስናካፍል የጠፋ የዲግሪ ተርም ካለ በ 0 ቦታውን መተካት እንዳይረሳ (ለምሳሌ፡ x³ - 4x + 1 ሲሆን በ 1, 0, -4, 1 ይጻፋል)።',
      om: 'Synthetic division keessatti zero iddoo qabsiisuu hin dagatinaa.',
      ti: 'ኣብ ሲንቴቲክ ማካፈል ዜሮ ምእታው ኣይትረስዑ።',
      ar: 'تنبيه مهم: عند استخدام القسمة التركيبية، احرص على وضع صفر مكان الحدود المفقودة لترتيب الدرجات.',
      so: 'Ha iloobin inaad eber dhigto heerarka maqan.',
      en: 'Always insert 0 placeholders for absent degree coefficients during synthetic division.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 3: EXPONENTIAL AND LOGARITHMIC FUNCTIONS (pp. 121-198)
  // -----------------------------------------------------------
  {
    unitNumber: 3,
    title: {
      am: 'ምዕራፍ 3፡ ኤክስፖኔንሻል እና ሎጋሪዝሚክ ፈንክሽን (Exponential & Logarithmic Functions)',
      om: 'Boqonnaa 3: Faankishinii Eksipoonenshiyaalii fi Loogaariizimii',
      ti: 'ምዕራፍ 3፡ ኤክስፖነንሻልን ሎጋሪዝምን',
      ar: 'الوحدة 3: الدوال الأسية واللوغاريتمية (Exponential and Logarithmic Functions)',
      so: 'Cutubka 3: Shaqooyinka Exponential iyo Logarithmic',
      en: 'Unit 3: Exponential and Logarithmic Functions',
    },
    startPage: 121,
    endPage: 198,
    theoryContent: {
      am: `ምዕራፍ 3 የከፍተኛ ሂሳብ መሰረት የሆኑትን ኤክስፖኔንት እና ሎጋሪዝም ይተነትናል፦
3.1 ኤክስፖኔንትና ሎጋሪዝም፡ 
- የኤክስፖኔንት ህጎች፡ bᵐ · bⁿ = bᵐ⁺ⁿ ፤ (bᵐ)ⁿ = bᵐⁿ ፤ b⁻ⁿ = 1/bⁿ ፤ b⁰ = 1።
- የሎጋሪዝም ትርጉም፡ y = log_b(x) ማለት bʸ = x ማለት ነው (b > 0, b ≠ 1, x > 0)።
- የሎጋሪዝም ህጎች፡ log_b(xy) = log_b(x) + log_b(y) ፤ log_b(x/y) = log_b(x) - log_b(y) ፤ log_b(xᵏ) = k · log_b(x)።
- የቤዝ መቀየሪያ ቀመር (Change of Base): log_b(x) = (ln x) / (ln b) = (log x) / (log b)።
3.2 ኤክስፖኔንሻል ፈንክሽን f(x) = bˣ: 
- b > 1 ሲሆን Exponential Growth (ፈጣን እድገት)፤ 0 < b < 1 ሲሆን Exponential Decay (መቀነስ) ነው።
- አግድም አስምፕቶት (Horizontal Asymptote) መስመሩ y = 0 ነው።
3.3 ሎጋሪዝሚክ ፈንክሽን f(x) = log_b(x):
- ዶሜይኑ (0, ∞) ሲሆን ሬንጁ (-∞, ∞) ነው። ቀጥ ያለ አስምፕቶት x = 0 አለው።
3.4 እኩልታዎችን መፍታት፡ ቤዞችን ማመሳሰል bᵘ = bᵛ ⇒ u = v፤ ወይም በሁለቱም በኩል ሎጋሪዝም (ln) መውሰድ።
3.5 የሁለቱ ዝምድና፡ f(x) = bˣ እና g(x) = log_b(x) አንዱ የሌላው የተገላቢጦሽ (Inverse) ናቸው።
3.6 ተግባራዊ አተገባበር፡ የህዝብ ቁጥር እድገት P(t) = P₀ eʳᵗ ፤ የባንክ ወለድ A = P(1 + r/n)ⁿᵗ ፤ የካርቦን-14 እድሜ መወሰኛ (Radiocarbon Dating)።`,
      om: `Boqonnaa 3: Exponential fi Logarithm functions, qajeelfamoota isaanii fi fayyadama isaanii ibsa.`,
      ti: `ምዕራፍ 3፡ ናይ ኤክስፖነንትን ሎጋሪዝምን ሕግታት፣ ግራፍን እኩልታታትን።`,
      ar: `الوحدة 3: الدوال الأسية وقوانين اللوغاريتمات، حل المعادلات الأسية واللوغاريتمية، وتطبيقات النمو والاضمحلال الإشعاعي.`,
      so: `Cutubka 3: Xeerarka exponent iyo logarithm iyo isticmaalkooda.`,
      en: `Unit 3 covers laws of exponents/logarithms, exponential/logarithmic graphs, equation solving, and modeling growth/decay.`,
    },
    examples: [
      {
        id: 'ex-m-3.1',
        exampleNumber: 'ምሳሌ 3.1 (Solving Logarithmic Equation)',
        problemStatement: {
          am: 'እኩልታውን ፍቱ፡ log₂(x + 2) + log₂(x - 2) = 5።',
          om: 'Waliigaltee log₂(x + 2) + log₂(x - 2) = 5 furaa.',
          ti: 'log₂(x + 2) + log₂(x - 2) = 5 ፍትሑ።',
          ar: 'حل المعادلة اللوغاريتمية: log₂(x + 2) + log₂(x - 2) = 5.',
          so: 'Xalli: log₂(x + 2) + log₂(x - 2) = 5.',
          en: 'Solve the logarithmic equation: log₂(x + 2) + log₂(x - 2) = 5.',
        },
        given: ['log₂(x + 2) + log₂(x - 2) = 5', 'የሎጋሪዝም ህግ፡ log_b(A) + log_b(B) = log_b(AB)'],
        formula: 'log_b(M) = k ⇔ M = bᵏ',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ በሎጋሪዝም የማባዛት ህግ አዋህድ፡ log₂[(x + 2)(x - 2)] = 5 ⇒ log₂(x² - 4) = 5።',
            om: 'Tarkaanfii 1: log₂(x² - 4) = 5.',
            ti: 'ደረጃ 1፡ log₂(x² - 4) = 5።',
            ar: 'الخطوة 1: طبق خاصية الجمع: log₂[(x + 2)(x - 2)] = 5 ومنه log₂(x² - 4) = 5.',
            so: 'Tallaabada 1: log₂(x² - 4) = 5.',
            en: 'Step 1: Combine using product rule: log₂[(x + 2)(x - 2)] = 5 ⇒ log₂(x² - 4) = 5.',
          },
          {
            am: 'ደረጃ 2፡ ወደ ኤክስፖኔንሻል ቀይር፡ x² - 4 = 2⁵ = 32።',
            om: 'Tarkaanfii 2: x² - 4 = 32 ⇒ x² = 36.',
            ti: 'ደረጃ 2፡ x² - 4 = 32 ⇒ x² = 36።',
            ar: 'الخطوة 2: حول إلى الصورة الأسية: x² - 4 = 2⁵ = 32 ومنه x² = 36.',
            so: 'Tallaabada 2: x² = 36.',
            en: 'Step 2: Convert to exponential form: x² - 4 = 2⁵ = 32 ⇒ x² = 36.',
          },
          {
            am: 'ደረጃ 3፡ ስኩዌር ሩት ውሰድ፡ x = ±6። ዶሜይን ፍተሻ፡ x = -6 ሲሆን log₂(-6 + 2) = log₂(-4) ስለሚሆን ተቀባይነት የለውም (Extraneous root)። ስለዚህ ትክክለኛ መፍትሄው x = 6 ብቻ ነው!',
            om: 'Tarkaanfii 3: x = -6 fudhatama hin qabu. Deebiin x = 6 qofa.',
            ti: 'ደረጃ 3፡ x = -6 ኣይሰርሕን። መልሲ x = 6 ጥራይ።',
            ar: 'الخطوة 3: x = ±6. نرفض x = -6 لأنه يعطي قيمة سالبة داخل اللوغاريتم، إذن الحل المقبول هو x = 6 فقط.',
            so: 'Tallaabada 3: x = 6 qura.',
            en: 'Step 3: x = ±6. Check domain: x = -6 gives undefined log₂(-4), so x = -6 is extraneous. The unique solution is x = 6.',
          },
        ],
        finalAnswer: {
          am: 'x = 6 (x = -6 ውድቅ ተደርጓል)',
          om: 'x = 6',
          ti: 'x = 6',
          ar: 'x = 6 (تم استبعاد x = -6 كحل دخيل)',
          so: 'x = 6',
          en: 'x = 6 (x = -6 rejected as extraneous)',
        },
        pedagogicalNote: {
          am: 'በሎጋሪዝም እኩልታዎች ሁልጊዜ የተገኙትን መልሶች በመነሻው ቀመር ውስጥ በማስገባት ውስጡ አዎንታዊ መሆኑን ማረጋገጥ ወሳኝ ነው!',
          om: 'Yeroo hunda deebii keessan mirkaneessaa.',
          ti: 'ኩሉ ግዜ መልስኹም ኣረጋግጹ።',
          ar: 'تذكر دائماً التحقق من الحلول في المعادلة الأصلية لاستبعاد الحلول الدخيلة (Extraneous Roots).',
          so: 'Had iyo jeer xaqiiji jawaabtaada.',
          en: 'Always check solutions in original equations to discard extraneous negative log arguments.',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-3',
        activityNumber: 'አክቲቪቲ 3.1',
        title: {
          am: 'የካርቦን-14 እድሜ ስሌት ሲሙሌሽን',
          om: 'Simuleeshii Umurii Kaarboonii-14',
          ti: 'ናይ ካርቦን-14 ዕድመ ስሌት',
          ar: 'محاكاة حساب نصف العمر باستخدام الكربون-14 في علم الآثار الإثيوبي',
          so: 'Daraasadda Carbon-14',
          en: 'Simulating Radiocarbon-14 Decay in Ethiopian Archeology',
        },
        instruction: {
          am: 'የካርቦን-14 የግማሽ እድሜ (Half-life) T = 5,730 አመታት ነው። N(t) = N₀(1/2)^(t / 5730) በመጠቀም የቅሪተ-አካል እድሜ አስሉ።',
          om: 'Half-life waggaa 5,730 fayyadamuun umurii qoradhaa.',
          ti: 'ናይ ካርቦን-14 ግማሽ ዕድመ 5,730 ዓመት ብምጥቃም ስርሑ።',
          ar: 'احسب عمر حفرية أثرية عثر عليها في وادي الآواش إذا بقي منها 25% من الكربون المشع.',
          so: 'Xisaabi cimriga lafaha qadiimiga ah.',
          en: 'Calculate the archeological age of artifacts with 25% remaining C-14 using N(t) = N₀(1/2)^(t/5730).',
        },
        groupTask: {
          am: 'በአዋሽ ሸለቆ የተገኘው ቅሪት 25% ካርቦን-14 ቢኖረው፡ t = 2 × 5730 = 11,460 አመታት መሆኑን አረጋግጡ።',
          om: 'Waggaa 11,460 ta\'uu mirkaneessaa.',
          ti: '11,460 ዓመት ምዃኑ ኣረጋግጹ።',
          ar: 'تحقق أن 25% تعني مرور فترتي نصف عمر: t = 2 × 5730 = 11,460 سنة.',
          so: 'Xaqiiji 11,460 sano.',
          en: 'Verify that 25% = (1/2)² indicates exactly two half-lives: t = 2 × 5,730 = 11,460 years.',
        },
        criticalThinkingQuestion: {
          am: 'የባንክ ተቀማጭ ገንዘብ በየአመቱ በ 8% ቢያድግ በስንት አመት ውስጥ እጥፍ ይሆናል? (የ 72 ህግን ወይም ሎጋሪዝምን ተጠቀሙ)',
          om: 'Waggaa meeqatti dachaa ta\'a?',
          ti: 'ብኽንደይ ዓመት ዕጽፊ ይኸውን?',
          ar: 'كم سنة يستغرق تضاعف مبلغ مودع بفائدة مركبة سنوية 8%؟',
          so: 'Immisa sano ayay ku labanlaabmaysaa lacagtu?',
          en: 'Using Rule of 72 or ln(2)/ln(1.08), in how many years will an investment double at 8% annual compound interest? (≈ 9 years).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-3.1',
        exerciseNumber: 'የምዕራፍ 3 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'log₃(81) + log₅(1/25) ዋጋው ስንት ነው?',
          om: 'log₃(81) + log₅(1/25) meeqa?',
          ti: 'log₃(81) + log₅(1/25) ዋጋኡ ክንደይ እዩ?',
          ar: 'ما القيمة العددية للمقدار: log₃(81) + log₅(1/25)؟',
          so: 'Waa maxay log₃(81) + log₅(1/25)?',
          en: 'Evaluate: log₃(81) + log₅(1/25).',
        },
        options: ['A. 1', 'B. 2', 'C. 6', 'D. -2'],
        correctAnswer: {
          am: 'B. 2 — ምክንያቱም 81 = 3⁴ ስለሆነ log₃(81) = 4 ፤ 1/25 = 5⁻² ስለሆነ log₅(1/25) = -2 ፤ ድምራቸው፡ 4 + (-2) = 2',
          om: 'B. 2',
          ti: 'B. 2',
          ar: 'B. 2 (حيث log₃(3⁴) = 4 و log₅(5⁻²) = -2؛ إذن 4 - 2 = 2)',
          so: 'B. 2',
          en: 'B. 2 — Since 81 = 3⁴ ⇒ log₃(81) = 4, and 1/25 = 5⁻² ⇒ log₅(1/25) = -2; 4 + (-2) = 2.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ 81 ን በ 3 ሃይል ጻፍ፡ 81 = 3⁴ ⇒ log₃(3⁴) = 4።',
            om: 'log₃(81) = 4.',
            ti: 'log₃(81) = 4።',
            ar: 'الخطوة 1: اكتب 81 بالأساس 3: log₃(3⁴) = 4.',
            so: 'log₃(81) = 4.',
            en: 'Step 1: Express 81 as 3⁴: log₃(3⁴) = 4.',
          },
          {
            am: 'ደረጃ 2፡ 1/25 ን በ 5 ሃይል ጻፍ፡ 1/25 = 5⁻² ⇒ log₅(5⁻²) = -2።',
            om: 'log₅(1/25) = -2.',
            ti: 'log₅(1/25) = -2።',
            ar: 'الخطوة 2: اكتب 1/25 بالأساس 5: log₅(5⁻²) = -2.',
            so: 'log₅(1/25) = -2.',
            en: 'Step 2: Express 1/25 as 5⁻²: log₅(5⁻²) = -2.',
          },
          {
            am: 'ደረጃ 3፡ ደምር፡ 4 + (-2) = 2።',
            om: '4 + (-2) = 2.',
            ti: '4 + (-2) = 2።',
            ar: 'الخطوة 3: اجمع القيمتين: 4 - 2 = 2.',
            so: '4 - 2 = 2.',
            en: 'Step 3: Sum the terms: 4 + (-2) = 2.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የሎጋሪዝም ተፈጥሯዊ ቤዝ e ≈ 2.71828 (Euler\'s number) ሲሆን፣ በሳይንስና ኢንጂነሪንግ ውስጥ ln(x) ተብሎ ይጻፋል።',
      om: 'e ≈ 2.71828 loogaariizimii uumamaati (ln).',
      ti: 'e ≈ 2.71828 ናይ ተፈጥሮ ሎጋሪዝም እዩ።',
      ar: 'فائدة إثرائية: العدد النيبيري e ≈ 2.71828 هو أساس اللوغاريتم الطبيعي ln المستخدم في الفيزياء والهندسة.',
      so: 'e ≈ 2.71828 waa saldhigga dabiiciga ah.',
      en: 'Supplementary: Natural base e ≈ 2.71828 underpins continuous growth models and calculus.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 4: TRIGONOMETRIC FUNCTIONS (pp. 199-250)
  // -----------------------------------------------------------
  {
    unitNumber: 4,
    title: {
      am: 'ምዕራፍ 4፡ ትሪጎኖሜትሪክ ፈንክሽን (Trigonometric Functions)',
      om: 'Boqonnaa 4: Faankishinii Tiriigonoomeetirii',
      ti: 'ምዕራፍ 4፡ ትሪጎኖሜትሪክ ፈንክሽን',
      ar: 'الوحدة 4: الدوال المثلثية والمتطابقات (Trigonometric Functions)',
      so: 'Cutubka 4: Shaqooyinka Trigonometric',
      en: 'Unit 4: Trigonometric Functions',
    },
    startPage: 199,
    endPage: 250,
    theoryContent: {
      am: `ምዕራፍ 4 የማዕዘን መለኪያዎችን፣ ዩኒት ሰርክልንና የትሪጎኖሜትሪ ህጎችን ያጠቃልላል፦
4.1 የሬዲያን መለኪያ (Radian Measure): 180° = π ሬዲያን። 
- የቅስት ርዝመት፡ s = r · θ (θ በሬዲያን ሲሆን)
- የሴክተር ስፋት፡ A = (1/2) · r² · θ
4.2 መሰረታዊ ትሪጎኖሜትሪክ ፈንክሽኖች፡ በዩኒት ሰርክል x² + y² = 1 ላይ cos θ = x ፤ sin θ = y ፤ tan θ = y/x።
- የልዩ ማዕዘናት ዋጋዎች (30°, 45°, 60°, 90°)፡ sin(30°) = 1/2 ፤ cos(30°) = √3/2 ፤ sin(45°) = √2/2 ፤ tan(45°) = 1።
- የአራቱ ኳድራንት ምልክት ህግ (ASTC - All Students Take Calculus)፡ 1ኛ ሁሉም አዎንታዊ፣ 2ኛ ሳይን ብቻ፣ 3ኛ ታንጀንት ብቻ፣ 4ኛ ኮሳይን ብቻ።
4.3 ትሪጎኖሜትሪክ አይደንቲቲዎች፡
- የፓይታጎረስ ህግ፡ sin²θ + cos²θ = 1 ፤ 1 + tan²θ = sec²θ ፤ 1 + cot²θ = csc²θ።
4.4 ተግባራዊ አተገባበር፡ የሳይን ህግ (Law of Sines: a/sin A = b/sin B = c/sin C) እና የኮሳይን ህግ (Law of Cosines: c² = a² + b² - 2ab cos C) በመሬት ልኬትና በህንፃ ኢንጂነሪንግ።`,
      om: `Boqonnaa 4: Radian, Unit Circle, sin, cos, tan fi Law of Sines/Cosines ibsa.`,
      ti: `ምዕራፍ 4፡ ሬዲያን፣ ዩኒት ሰርክል፣ ሳይን፣ ኮሳይን፣ ታንጀንት።`,
      ar: `الوحدة 4: القياس الدائري بالراديان، دائرة الوحدة، المتطابقات المثلثية، وقانونا الجيوب وجيوب التمام وتطبيقات المساحة.`,
      so: `Cutubka 4: Cabbirka xagasha, sin, cos, tan iyo xeerarka saddexagalka.`,
      en: `Unit 4 covers radian measure, unit circle definitions, graphs, Pythagorean identities, and Laws of Sines and Cosines.`,
    },
    examples: [
      {
        id: 'ex-m-4.1',
        exampleNumber: 'ምሳሌ 4.1 (Law of Cosines in Surveying)',
        problemStatement: {
          am: 'በኢትዮጵያ ንግድ ባንክ ዋና ህንፃ ፊት ለፊት ባለ የሶስት ማዕዘን ይዞታ ላይ ሁለት ጎኖች a = 40 m እና b = 60 m ሲሆኑ በመካከላቸው ያለው ማዕዘን C = 60° ነው። የሶስተኛውን ጎን c ርዝመት አስሉ።',
          om: 'Saddex-kofa keessatti a = 40m, b = 60m fi C = 60° yoo ta\'e, c barbaadi.',
          ti: 'a = 40m, b = 60m, C = 60° እንተኾይኑ c ድለዩ።',
          ar: 'في قطعة أرض مثلثة الشكل، إذا كان طولا ضلعين a = 40 م، b = 60 م والزاوية المحصورة بينهما C = 60°، فما طول الضلع الثالث c؟',
          so: 'Soo hel dhinaca c haddii a = 40m, b = 60m, C = 60°.',
          en: 'In a triangular plot with a = 40m, b = 60m and included angle C = 60°, determine the third side c.',
        },
        given: ['a = 40 m', 'b = 60 m', 'C = 60°', 'cos(60°) = 0.5'],
        formula: 'c² = a² + b² - 2ab cos C',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ ቀመሩን ጻፍ፡ c² = (40)² + (60)² - 2(40)(60) cos(60°)።',
            om: 'Tarkaanfii 1: c² = 1600 + 3600 - 4800(0.5).',
            ti: 'ደረጃ 1፡ c² = 1600 + 3600 - 4800(0.5)።',
            ar: 'الخطوة 1: طبق قانون جيوب التمام: c² = 40² + 60² - 2(40)(60) cos(60°).',
            so: 'Tallaabada 1: c² = 1600 + 3600 - 2400.',
            en: 'Step 1: Apply Law of Cosines: c² = 40² + 60² - 2(40)(60) cos(60°).',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ c² = 1600 + 3600 - 4800(0.5) = 5200 - 2400 = 2800።',
            om: 'Tarkaanfii 2: c² = 2800.',
            ti: 'ደረጃ 2፡ c² = 2800።',
            ar: 'الخطوة 2: c² = 5200 - 2400 = 2800.',
            so: 'Tallaabada 2: c² = 2800.',
            en: 'Step 2: Evaluate: c² = 5200 - 2400 = 2800.',
          },
          {
            am: 'ደረጃ 3፡ ስኩዌር ሩት ውሰድ፡ c = √2800 = √(100 × 4 × 7) = 20√7 m ≈ 52.92 ሜትር።',
            om: 'Tarkaanfii 3: c = 20√7 ≈ 52.92 m.',
            ti: 'ደረጃ 3፡ c = 20√7 ≈ 52.92 ሜትሮ።',
            ar: 'الخطوة 3: خذ الجذر التربيعي: c = √2800 = 20√7 ≈ 52.92 متراً.',
            so: 'Tallaabada 3: c ≈ 52.92 m.',
            en: 'Step 3: Extract root: c = √2800 = 20√7 m ≈ 52.92 meters.',
          },
        ],
        finalAnswer: {
          am: 'c = 20√7 m ≈ 52.92 ሜትር',
          om: 'c = 20√7 m ≈ 52.92 m',
          ti: 'c = 20√7 m ≈ 52.92 ሜትሮ',
          ar: 'طول الضلع الثالث c = 20√7 م ≈ 52.92 متراً',
          so: 'c ≈ 52.92 m',
          en: 'c = 20√7 m ≈ 52.92 meters',
        },
        pedagogicalNote: {
          am: 'ሁለት ጎኖችና በመካከላቸው ያለ ማዕዘን ሲሰጥ (SAS case) ሁልጊዜ የኮሳይን ህግ ይቀድማል።',
          om: 'SAS yoo kenname Law of Cosines fayyadamaa.',
          ti: 'SAS እንተተዋሂቡ Law of Cosines ተጠቐሙ።',
          ar: 'عند معرفة ضلعين والزاوية المحصورة بينهما (SAS)، يجب البدء بقانون جيوب التمام.',
          so: 'Xaaladda SAS, isticmaal Law of Cosines.',
          en: 'For Side-Angle-Side (SAS) configurations, the Law of Cosines must be deployed first.',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-4',
        activityNumber: 'አክቲቪቲ 4.1',
        title: {
          am: 'የክሊኖሜትር (Clinometer) እና የህንፃ ከፍታ ልኬት',
          om: 'Dheerina gamoo Clinometer fayyadamuun shallaguu',
          ti: 'ቁመት ህንጻ ብክሊኖሜትር ምዕቃን',
          ar: 'صنع مقياس ميلان بسيط (Clinometer) وقياس ارتفاع سارية العلم المدرسية',
          so: 'Cabirka dhererka dhismaha',
          en: 'Constructing a Clinometer to Measure Building Heights via Tangents',
        },
        instruction: {
          am: 'የመጠጥ ማጠጫ ቧንቧና ፕሮትራክተር በመጠቀም ክሊኖሜትር ስሩ፤ ከህንፃው 30 ሜትር ርቀት ላይ ቆማችሁ የማዕዘን ከፍታውን (Angle of Elevation θ) ለኩ።',
          om: 'Clinometer tolfachuun dheerina shallagaa.',
          ti: 'ክሊኖሜትር ብምስራሕ ቁመት ህንጻ ለክዑ።',
          ar: 'قس زاوية الارتفاع θ باستخدام المنقلة من مسافة 30 متراً واحسب الارتفاع h = d · tan θ + عين الراصد.',
          so: 'Isticmaal protractor si aad u cabbirtid xagasha.',
          en: 'Stand 30m away and measure angle of elevation θ. Height = 30 tan θ + eye height.',
        },
        groupTask: {
          am: 'የተገኘውን ማዕዘን tan θ በመጠቀም የትምህርት ቤቱን ሰንደቅ አላማ ወይም ህንፃ ትክክለኛ ከፍታ አስሉ።',
          om: 'Dheerina gamoo argadhaa.',
          ti: 'ቁመት ህንጻ ኣስሉዕ።',
          ar: 'احسب الارتفاع الفعلي لسارية العلم باستخدام ظل الزاوية.',
          so: 'Xisaabi dhererka saxda ah.',
          en: 'Compute actual elevation of school building or flagpole using trigonometry.',
        },
        criticalThinkingQuestion: {
          am: 'ማዕዘኑ 45° ሲሆን ከህንፃው ያለህ ርቀት እና የህንፃው ከፍታ ምን ግንኙነት አላቸው? (tan 45° = 1 ስለሆነ እኩል ናቸው)',
          om: 'θ = 45° yoo ta\'e fageenyi fi dheerinni wal qixa ta\'uu?',
          ti: 'θ = 45° እንተኾይኑ ርሕቐትን ቁመትን ማዕረ ድዮም?',
          ar: 'ما العلاقة بين بعد الراصد وارتفاع المبنى عندما تكون زاوية الارتفاع 45°؟',
          so: 'Maxay noqonaysaa haddii θ = 45°?',
          en: 'Why does distance equal height when angle of elevation is exactly 45°? (Because tan 45° = 1).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-4.1',
        exerciseNumber: 'የምዕራፍ 4 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'cos²(30°) + sin²(30°) ድምሩ ስንት ነው?',
          om: 'cos²(30°) + sin²(30°) meeqa?',
          ti: 'cos²(30°) + sin²(30°) ክንደይ እዩ?',
          ar: 'ما القيمة العددية للمتطابقة cos²(30°) + sin²(30°)؟',
          so: 'Waa maxay cos²(30°) + sin²(30°)?',
          en: 'Evaluate: cos²(30°) + sin²(30°).',
        },
        options: ['A. 0', 'B. 1/2', 'C. 1', 'D. √3/2'],
        correctAnswer: {
          am: 'C. 1 — በማንኛውም ማዕዘን θ ላይ በፓይታጎሪያን አይደንቲቲ መሰረት sin²θ + cos²θ = 1 ነው',
          om: 'C. 1',
          ti: 'C. 1',
          ar: 'C. 1 (حسب المتطابقة الفيثاغورسية الشهيرة sin²θ + cos²θ = 1 دائماً)',
          so: 'C. 1',
          en: 'C. 1 — By the fundamental Pythagorean identity, sin²θ + cos²θ = 1 for all θ.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ በፓይታጎሪያን አይደንቲቲ መሰረት፡ sin²θ + cos²θ = 1 ለሁሉም θ እውነት ነው።',
            om: 'sin²θ + cos²θ = 1.',
            ti: 'sin²θ + cos²θ = 1።',
            ar: 'الخطوة 1: المتطابقة الفيثاغورسية: sin²θ + cos²θ = 1 صحيحة لأي زاوية θ.',
            so: 'sin²θ + cos²θ = 1.',
            en: 'Step 1: Apply Pythagorean identity: sin²θ + cos²θ = 1.',
          },
          {
            am: 'ደረጃ 2፡ በቁጥር ስናረጋግጥ፡ (√3/2)² + (1/2)² = 3/4 + 1/4 = 4/4 = 1።',
            om: '3/4 + 1/4 = 1.',
            ti: '3/4 + 1/4 = 1።',
            ar: 'الخطوة 2: بالتعويض المباشر: (√3/2)² + (1/2)² = 3/4 + 1/4 = 1.',
            so: '3/4 + 1/4 = 1.',
            en: 'Step 2: Arithmetic verification: 3/4 + 1/4 = 1.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ ማዕዘናትን ከዲግሪ ወደ ሬዲያን ለመቀየር በ π/180° ማባዛት፣ ከሬዲያን ወደ ዲግሪ ደግሞ በ 180°/π ማባዛት ወሳኝ ነው።',
      om: 'Radian gara Degree jijjiiruuf 180°/π tiin baay\'isaa.',
      ti: 'ካብ ሬዲያን ናብ ዲግሪ ንምቕያር ብ 180°/π ኣባዝሑ።',
      ar: 'معادلة التحويل: للتحويل من درجات إلى راديان اضرب في π/180°، وللعكس اضرب في 180°/π.',
      so: 'Isku dhufo 180°/π.',
      en: 'To convert degrees to radians multiply by π/180°; radians to degrees multiply by 180°/π.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 5: CIRCLES (pp. 251-286)
  // -----------------------------------------------------------
  {
    unitNumber: 5,
    title: {
      am: 'ምዕራፍ 5፡ ክብ (Circles)',
      om: 'Boqonnaa 5: Geengoo (Circles)',
      ti: 'ምዕራፍ 5፡ ክቢ',
      ar: 'الوحدة 5: الدوائر وخصائصها الهندسية (Circles)',
      so: 'Cutubka 5: Goobada',
      en: 'Unit 5: Circles',
    },
    startPage: 251,
    endPage: 286,
    theoryContent: {
      am: `ምዕራፍ 5 የክብ ሲሜትሪና የጂኦሜትሪ ቴዎረሞችን በዝርዝር ያብራራል፦
5.1 የክብ ሲሜትሪያዊ ባህሪያት፡ ክብ በማንኛውም ዲያሜትር መስመር ላይ ሲሜትሪክ ነው። ከመሀል የሚወርድ ፐርፔንዲኩላር መስመር ኮርዱን (Chord) እኩል ለሁለት ይከፍለዋል።
5.2 የክብ ማዕዘን ቴዎረሞች፡
- ማዕከላዊ ማዕዘን ቴዎረም (Central Angle Theorem)፡ በማዕከሉ የሚሰራው ማዕዘን በክቡ ዙሪያ ከተሰራው ማዕዘን እጥፍ ነው (∠AOB = 2∠APB)።
- በአንድ ሴግመንት ውስጥ ያሉ ማዕዘናት እኩል ናቸው።
- በግማሽ ክብ (Semicircle) ላይ የሚሰራ ማዕዘን 90° (ቀኝ ማዕዘን) ነው።
- ሳይክሊክ ኳድሪላተራል (Cyclic Quadrilateral)፡ አራቱ ማዕዘኖቹ ክቡ ላይ ያረፉ ኳድሪላተራል ተቃራኒ ማዕዘኖቹ ድምር 180° (Supplementary) ነው።
5.3 የቅስት ርዝመትና የሴግመንት ስፋት፡ s = (θ/360) · 2πr ፤ የሴክተር ስፋት = (θ/360) · πr² ፤ የሴግመንት ስፋት = የሴክተር ስፋት - የሶስት ማዕዘኑ ስፋት።
5.4 የተቆራራጭ መስመሮች ቴዎረም (Intersecting Chords & Secants):
- በክቡ ውስጥ ለሚቆራረጡ ኮርዶች፡ PA · PB = PC · PD።
- ከክቡ ውጭ ለሚቆራረጡ ታንጀንትና ሴካንት፡ PT² = PA · PB።`,
      om: `Boqonnaa 5: Geengoo, theorems of central angle, cyclic quadrilateral fi intersecting chords ibsa.`,
      ti: `ምዕራፍ 5፡ ክቢ፣ ናይ ማእከል ኩርናዕ ቴዎረም፣ ሳይክሊክ ኳድሪላተራልን ስፍሓትን።`,
      ar: `الوحدة 5: الهندسة المستوية للدوائر، الزوايا المركزية والمحيطية، الرباعي الدائري، ونظرية قواطع الدائرة والأوتار المتقاطعة.`,
      so: `Cutubka 5: Xeerarka goobada iyo xisaabinta xaglaha.`,
      en: `Unit 5 covers circle symmetry, central/inscribed angle theorems, cyclic quadrilaterals, tangents, and power of a point theorems.`,
    },
    examples: [
      {
        id: 'ex-m-5.1',
        exampleNumber: 'ምሳሌ 5.1 (Central & Inscribed Angles)',
        problemStatement: {
          am: 'በአንድ ክብ ላይ ቅስት AB በማዕከሉ O ላይ የሰራው ማዕዘን ∠AOB = 110° ቢሆን፡ በክቡ ዙሪያ ነጥብ C ላይ የሚሰራው ማዕዘን ∠ACB ስንት ነው?',
          om: '∠AOB = 110° yoo ta\'e, ∠ACB meeqa?',
          ti: '∠AOB = 110° እንተኾይኑ፡ ∠ACB ክንደይ እዩ?',
          ar: 'في دائرة مركزها O، إذا كانت الزاوية المركزية ∠AOB = 110°، فما قياس الزاوية المحيطية ∠ACB المشتركة معها في نفس القوس؟',
          so: 'Haddii ∠AOB = 110°, waa maxay ∠ACB?',
          en: 'If central angle ∠AOB = 110°, find the inscribed angle ∠ACB subtended by the same arc.',
        },
        given: ['Central angle ∠AOB = 110°', 'Inscribed angle theorem: ∠AOB = 2 · ∠ACB'],
        formula: '∠ACB = (1/2) · ∠AOB',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ ቴዎረሙን ጥቀስ፡ በአንድ ቅስት ላይ የሚያርፍ የማዕከል ማዕዘን በዙሪያው ካለው ማዕዘን እጥፍ ነው።',
            om: 'Tarkaanfii 1: Inscribed angle = Central angle / 2.',
            ti: 'ደረጃ 1፡ ዝተሰረተ ማእከላይ ኩርናዕ ዕጽፊ እዩ።',
            ar: 'الخطوة 1: قياس الزاوية المحيطية يساوي نصف قياس الزاوية المركزية المشتركة معها في القوس.',
            so: 'Tallaabada 1: ∠ACB = ∠AOB / 2.',
            en: 'Step 1: State inscribed angle theorem: angle at center is twice angle at circumference.',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ ∠ACB = 110° / 2 = 55°።',
            om: 'Tarkaanfii 2: ∠ACB = 110° / 2 = 55°.',
            ti: 'ደረጃ 2፡ ∠ACB = 55°።',
            ar: 'الخطوة 2: ∠ACB = 110° / 2 = 55°.',
            so: 'Tallaabada 2: ∠ACB = 55°.',
            en: 'Step 2: Calculate: ∠ACB = 110° / 2 = 55°.',
          },
        ],
        finalAnswer: {
          am: '∠ACB = 55°',
          om: '∠ACB = 55°',
          ti: '∠ACB = 55°',
          ar: 'قياس الزاوية المحيطية ∠ACB = 55°',
          so: '∠ACB = 55°',
          en: '∠ACB = 55°',
        },
        pedagogicalNote: {
          am: 'ማዕከላዊ ማዕዘኑ ሁልጊዜ ከማንኛውም በተመሳሳይ ቅስት ላይ ካረፈው የዙሪያ ማዕዘን እጥፍ ነው!',
          om: 'Central angle yeroo hunda dachaa dha.',
          ti: 'ማእከላይ ኩርናዕ ኩሉ ግዜ ዕጽፊ እዩ።',
          ar: 'الزاوية المركزية دائماً ضعف المحيطية التي تحصر نفس القوس.',
          so: 'Xagasha dhexe mar walba waa labanlaab.',
          en: 'The central angle is always double any inscribed angle on the identical subtended arc.',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-5',
        activityNumber: 'አክቲቪቲ 5.1',
        title: {
          am: 'ሳይክሊክ ኳድሪላተራል ማረጋገጫ',
          om: 'Mirkaneessa Cyclic Quadrilateral',
          ti: 'ሳይክሊክ ኳድሪላተራል ምርግጋጽ',
          ar: 'إثبات هندسي لخاصية تكامل الزوايا المتقابلة في الشكل الرباعي الدائري',
          so: 'Daraasadda Cyclic Quadrilateral',
          en: 'Geometric Verification of Opposite Supplementary Angles in Cyclic Quadrilaterals',
        },
        instruction: {
          am: 'በኮምፓስ ክብ ስሩና አራት ነጥቦችን A, B, C, D በክቡ ዙሪያ ምልክት በማድረግ ሳይክሊክ ኳድሪላተራል ገንቡ። ፕሮትራክተር ተጠቅማችሁ ተቃራኒ ማዕዘናትን ለኩ።',
          om: 'Geengoo irratti qabxii 4 sararaa.',
          ti: 'ኣብ ክቢ 4 ነጥብታት ብምግባር ለክዑ።',
          ar: 'ارسم دائرة بأي نصف قطر وحدد عليها 4 نقاط، وقس الزوايا المتقابلة بالمنقلة لتثبت أن مجموعهما 180°.',
          so: 'Ku sawir goobada 4 dhibcood.',
          en: 'Inscribe an arbitrary quadrilateral ABCD in a circle and measure opposite angle sums with a protractor.',
        },
        groupTask: {
          am: '∠A + ∠C = 180° እና ∠B + ∠D = 180° መሆኑን በቡድን አስልታችሁ አረጋግጡ።',
          om: 'Ida\'amni isaanii 180° ta\'uu mirkaneessaa.',
          ti: 'ድምሮም 180° ምዃኑ ኣረጋግጹ።',
          ar: 'أثبت أن مجموع قياسي الزاويتين المتقابلتين يساوي 180° دائماً.',
          so: 'Xaqiiji in wadartu tahay 180°.',
          en: 'Empirically and deductively confirm that opposite angles sum to 180°.',
        },
        criticalThinkingQuestion: {
          am: 'አንድ ፓራሌሎግራም በክብ ውስጥ ከተሳለ (Cyclic ከሆነ) ግዴታ ሬክታንግል (Rectangle) መሆን አለበት? ለምን?',
          om: 'Parallelogram geengoo keessatti yoo ta\'e rectangle ta\'uu qabaa?',
          ti: 'ፓራሌሎግራም ኣብ ክቢ እንተተሳኢሉ ሬክታንግል ክኸውን ኣለዎ ድዩ?',
          ar: 'إذا كان متوازي الأضلاع رباعياً دائرياً، فلماذا يجب بالضرورة أن يكون مستطيلاً؟',
          so: 'Muxuu parallelogram-ku u noqonayaa leydi?',
          en: 'Why must any cyclic parallelogram necessarily be a rectangle? (Opposite angles equal & sum to 180° ⇒ each is 90°).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-5.1',
        exerciseNumber: 'የምዕራፍ 5 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'ሁለት ኮርዶች AB እና CD በክቡ ውስጥ በነጥብ P ተቆራርጠዋል። AP = 4 cm, PB = 6 cm እና CP = 3 cm ቢሆኑ፡ PD ስንት ሴንቲሜትር ነው?',
          om: 'AP = 4, PB = 6, CP = 3 yoo ta\'e, PD meeqa?',
          ti: 'AP = 4, PB = 6, CP = 3 እንተኾይኑ፡ PD ክንደይ እዩ?',
          ar: 'وتران متقاطعان داخل دائرة في نقطة P. إذا كان AP = 4 سم، PB = 6 سم، CP = 3 سم، فما طول PD؟',
          so: 'Waa maxay PD haddii AP = 4, PB = 6, CP = 3?',
          en: 'Two chords AB and CD intersect inside a circle at P. If AP = 4 cm, PB = 6 cm, and CP = 3 cm, find PD.',
        },
        options: ['A. 5 cm', 'B. 7 cm', 'C. 8 cm', 'D. 12 cm'],
        correctAnswer: {
          am: 'C. 8 cm — በ Intersecting Chords Theorem መሰረት AP · PB = CP · PD ⇒ 4 · 6 = 3 · PD ⇒ 24 = 3 · PD ⇒ PD = 8 cm',
          om: 'C. 8 cm',
          ti: 'C. 8 cm',
          ar: 'C. 8 سم (وفق نظرية الأوتار المتقاطعة: AP × PB = CP × PD ومنه 24 = 3 × PD إذن PD = 8 سم)',
          so: 'C. 8 cm',
          en: 'C. 8 cm — Intersecting Chords Theorem: AP · PB = CP · PD ⇒ 4 × 6 = 3 × PD ⇒ PD = 8 cm.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የተቆራራጭ ኮርዶች ቴዎረም ቀመር፡ AP · PB = CP · PD።',
            om: 'AP · PB = CP · PD.',
            ti: 'AP · PB = CP · PD።',
            ar: 'الخطوة 1: نظرية الأوتار المتقاطعة: AP · PB = CP · PD.',
            so: 'AP · PB = CP · PD.',
            en: 'Step 1: State chord product equation: AP · PB = CP · PD.',
          },
          {
            am: 'ደረጃ 2፡ ቁጥሮቹን አስገባ፡ 4 · 6 = 3 · PD ⇒ 24 = 3 · PD ⇒ PD = 24 / 3 = 8 cm።',
            om: '24 = 3 · PD ⇒ PD = 8 cm.',
            ti: '24 = 3 · PD ⇒ PD = 8 cm።',
            ar: 'الخطوة 2: عوض القيم: 4 × 6 = 3 × PD ومنه PD = 8 سم.',
            so: 'PD = 24 / 3 = 8 cm.',
            en: 'Step 2: Solve: 24 = 3 · PD ⇒ PD = 8 cm.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ ከክብ ውጭ ባለ ነጥብ T የተሰመረ ታንጀንት PT እና ሴካንት PAB ሲኖሩ፡ PT² = PA · PB (Tangent-Secant Theorem) የሚለውን ቀመር ማስታወስ ለፈተና ወሳኝ ነው።',
      om: 'Tangent-Secant Theorem: PT² = PA · PB.',
      ti: 'PT² = PA · PB ምዃኑ ዘክሩ።',
      ar: 'قاعدة ذهبية: عند رسم مماس PT وقاطع PAB من نقطة خارجية P، فإن مربع المماس يساوي حاصل ضرب جزأي القاطع: PT² = PA · PB.',
      so: 'Xusuuso: PT² = PA · PB.',
      en: 'Remember Tangent-Secant power theorem: PT² = PA · PB for external tangent segments.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 6: SOLID FIGURES (pp. 287-344)
  // -----------------------------------------------------------
  {
    unitNumber: 6,
    title: {
      am: 'ምዕራፍ 6፡ ባለ 3-ዲ ቅርጾች (Solid Figures)',
      om: 'Boqonnaa 6: Bocaalee Jajjaboo (Solid Figures)',
      ti: 'ምዕራፍ 6፡ 3-ዲ ቅርጽታት',
      ar: 'الوحدة 6: المجسمات الهندسية الفضائية (Solid Figures)',
      so: 'Cutubka 6: Qaababka Adag',
      en: 'Unit 6: Solid Figures',
    },
    startPage: 287,
    endPage: 344,
    theoryContent: {
      am: `ምዕራፍ 6 የቦታ ጂኦሜትሪን (3D Solid Geometry) ቀመሮችና ተግባራዊ ስሌቶችን ያትታል፦
6.1 ሲሊንደርና ፕሪዝም፡ 
- ፕሪዝም (Prism)፡ ይዘት (Volume) = Base Area × h ፤ Lateral Area = Base Perimeter × h።
- ሲሊንደር (Cylinder)፡ V = πr²h ፤ Lateral Area = 2πrh ፤ Total Surface Area = 2πr(h + r)።
6.2 ፒራሚድ፣ ኮን እና ስፌር፡
- ፒራሚድ (Pyramid)፡ V = (1/3) · Base Area · h።
- ኮን (Cone)፡ V = (1/3)πr²h ፤ የጎን ስፋት (Lateral Area) = πrl (የትከሻ ቁመት l = √(r² + h²))።
- ስፌር (Sphere)፡ ይዘት V = (4/3)πr³ ፤ የገፅታ ስፋት (Surface Area) = 4πr²።
6.3 ፍረስተም (Frustum of Pyramids and Cones):
- የፒራሚድ ፍረስተም፡ V = (1/3)h [A₁ + A₂ + √(A₁A₂)] (A₁ እና A₂ የላይኛውና የታችኛው መሰረት ስፋቶች ናቸው)።
- የኮን ፍረስተም፡ V = (1/3)πh [R² + r² + Rr] ፤ Lateral Area = πl(R + r) (l = √(h² + (R - r)²))።
6.4 የተቀናጁ ቅርጾች (Composed Solids): በርካታ ቅርጾችን በማጣመር የተሰሩ የውሃ ማጠራቀሚያዎች፣ የሰብል ጎተራዎች እና የግድብ መዋቅሮች።
6.5 ተግባራዊ አተገባበር፡ የግድብ ኮንክሪት መጠን፣ የብረት ማጠራቀሚያ በርሜሎች እና የጭነት መኪናዎች ይዘት ስሌት።`,
      om: `Boqonnaa 6: Volume fi Surface Area cylinders, cones, pyramids, spheres fi frustum ibsa.`,
      ti: `ምዕራፍ 6፡ ይዘትን ስፍሓትን ናይ ሲሊንደር፣ ኮን፣ ፒራሚድ፣ ስፌርን ፍረስተምን።`,
      ar: `الوحدة 6: حجوم ومساحات المجسمات الهندسية: الأسطوانات، المخاريط، الأهرامات، الكرات، وجذوع المخروط والهرم وتطبيقات السدود.`,
      so: `Cutubka 6: Xisaabinta mugga iyo bedka مجسماتka.`,
      en: `Unit 6 covers surface areas and volumes of prisms, cylinders, pyramids, cones, spheres, frustums, and composed engineering solids.`,
    },
    examples: [
      {
        id: 'ex-m-6.1',
        exampleNumber: 'ምሳሌ 6.1 (Volume of a Conical Frustum)',
        problemStatement: {
          am: 'የኮን ፍረስተም የሆነ ባህላዊ የውሃ ማጠራቀሚያ የላይኛው አግድም ራዲየስ r = 3 m፣ የታችኛው ራዲየስ R = 6 m እና ቁመቱ h = 4 m ነው። የዚህን ማጠራቀሚያ ይዘት (Volume) አስሉ።',
          om: 'Frustum cone r = 3m, R = 6m, h = 4m volume isaa shallagaa.',
          ti: 'r = 3m, R = 6m, h = 4m ዘለዎ ፍረስተም ይዘት ድለዩ።',
          ar: 'خزان مياه خرساني على شكل جذع مخروط دائري، نصف قطر قاعدته الصغرى r = 3 م، ونصف قطر قاعدته الكبرى R = 6 م، وارتفاعه h = 4 م. احسب حجم الخزان.',
          so: 'Soo hel mugga frustum r = 3m, R = 6m, h = 4m.',
          en: 'A water reservoir in the shape of a conical frustum has top radius r = 3m, bottom radius R = 6m, and height h = 4m. Calculate its volume.',
        },
        given: ['r = 3 m', 'R = 6 m', 'h = 4 m'],
        formula: 'V = (1/3) · π · h · (R² + r² + Rr)',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ የራዲየሶቹን ስሌት አዘጋጅ፡ R² = 6² = 36 ፤ r² = 3² = 9 ፤ Rr = 6 × 3 = 18። ድምራቸው፡ 36 + 9 + 18 = 63 m²።',
            om: 'Tarkaanfii 1: R² + r² + Rr = 36 + 9 + 18 = 63.',
            ti: 'ደረጃ 1፡ R² + r² + Rr = 63።',
            ar: 'الخطوة 1: احسب المقدار (R² + r² + Rr) = 36 + 9 + 18 = 63 م².',
            so: 'Tallaabada 1: 36 + 9 + 18 = 63.',
            en: 'Step 1: Evaluate radii term: R² + r² + Rr = 36 + 9 + 18 = 63 m².',
          },
          {
            am: 'ደረጃ 2፡ በቀመሩ አስገባ፡ V = (1/3) · π · (4) · (63) = 4 × 21 · π = 84π m³።',
            om: 'Tarkaanfii 2: V = 84π m³.',
            ti: 'ደረጃ 2፡ V = 84π m³።',
            ar: 'الخطوة 2: طبق القانون: V = (1/3) × π × 4 × 63 = 84π م³.',
            so: 'Tallaabada 2: V = 84π m³.',
            en: 'Step 2: Multiply by (1/3)πh: V = (1/3) × π × 4 × 63 = 84π m³.',
          },
          {
            am: 'ደረጃ 3፡ በዴሲማል አስላ (π ≈ 3.1416)፡ V = 84 × 3.1416 ≈ 263.89 m³ (ወይም 263,890 ሊትር ውሃ)።',
            om: 'Tarkaanfii 3: V ≈ 263.89 m³.',
            ti: 'ደረጃ 3፡ V ≈ 263.89 m³።',
            ar: 'الخطوة 3: بالتعويض عن π: الحجم = 84 × 3.1416 ≈ 263.89 م³.',
            so: 'Tallaabada 3: V ≈ 263.89 m³.',
            en: 'Step 3: Approximate with π ≈ 3.1416: V ≈ 263.89 m³ (263,890 liters).',
          },
        ],
        finalAnswer: {
          am: 'V = 84π m³ ≈ 263.89 m³ (263,890 ሊትር)',
          om: 'V = 84π m³ ≈ 263.89 m³',
          ti: 'V = 84π m³ ≈ 263.89 m³',
          ar: 'حجم الخزان V = 84π م³ ≈ 263.89 م³ (263,890 لتراً)',
          so: 'V ≈ 263.89 m³',
          en: 'V = 84π m³ ≈ 263.89 m³ (263,890 Liters)',
        },
        pedagogicalNote: {
          am: '1 ኪዩቢክ ሜትር (1 m³) ከ 1,000 ሊትር ውሃ ጋር እኩል መሆኑን ማስታወስ ተግባራዊ የኢንጂነሪንግ ስሌቶችን ያቀላል።',
          om: '1 m³ = 1000 Liters.',
          ti: '1 m³ = 1000 ሊትሮ።',
          ar: 'تذكر دائماً أن 1 متر مكعب يتسع تماماً لـ 1000 لتر من الماء.',
          so: '1 m³ = 1000 litir.',
          en: 'Always recall that 1 m³ = 1,000 liters for capacity calculations.',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-6',
        activityNumber: 'አክቲቪቲ 6.1',
        title: {
          am: 'የጎተራ (Traditional Granary) ባለ 3-ዲ ሞዴል መስራት',
          om: 'Moodeela Gotera ijaaruu',
          ti: 'ናይ ጎተራ ሞዴል ምስራሕ',
          ar: 'بناء مجسم مركب من أسطوانة ومخروط لصوامع الحبوب التقليدية',
          so: 'Dhisidda qaabka Gotera',
          en: 'Modeling Composed Cylinder-Cone Solids for Traditional Ethiopian Gotera Grain Silos',
        },
        instruction: {
          am: 'ከካርቶን ወረቀት ሲሊንደርና ኮን ሰርታችሁ በማጣመር የባህላዊ የሰብል ጎተራ ሞዴል ገንቡ። አጠቃላይ ይዘቱን አስሉ።',
          om: 'Kaartoonii irraa cylinder fi cone walitti qabsiisaa.',
          ti: 'ብካርቶን ሲሊንደርን ኮንን ብምስራሕ ይዘት ጸብጽቡ።',
          ar: 'اصنع أسطوانة يعلوها مخروط من الورق المقوى، واحسب الحجم الكلي بجمع حجمي الأسطوانة والمخروط.',
          so: 'Isku dar mugga cylinder iyo cone.',
          en: 'Construct cardboard models combining a cylinder base and conical roof, evaluating total composite volume.',
        },
        groupTask: {
          am: 'የተቀናጀውን ቅርጽ አጠቃላይ ስፋት ስታሰሉ ሁለቱ ቅርጾች የሚገናኙበት ክብ (Interface base) ከውጪ ስፋት እንደማይካተት አረጋግጡ።',
          om: 'Interface base akka hin dabalatamne mirkaneessaa.',
          ti: 'እቲ ዝራኸበሉ ገጽ ከምዘይድመር ኣረጋግጹ።',
          ar: 'تأكد من استبعاد مساحة قاعدة التلامس المشتركة عند حساب المساحة السطحية الكلية للمجسم المركب.',
          so: 'Ka saar meesha ay ku kulmaan.',
          en: 'Verify that internal contact circular interface is omitted from exterior surface area.',
        },
        criticalThinkingQuestion: {
          am: 'የአንድ ስፌር ራዲየስ እጥፍ ቢደረግ፣ የገፅታ ስፋቱና ይዘቱ በስንት እጥፍ ያድጋሉ? (ስፋቱ በ 4 እጥፍ፣ ይዘቱ ደግሞ በ 8 እጥፍ)',
          om: 'Radius dachaa yoo ta\'e, Volume fi Area akkam ta\'u?',
          ti: 'ራዲየስ ዕጽፊ እንተኾይኑ ስፍሓትን ይዘትን ብኽንደይ ይውስኹ?',
          ar: 'إذا تضاعف نصف قطر كرة ما مرتين، فبأي معامل تتضاعف مساحتها السطحية وحجمها؟',
          so: 'Immisa ayay kordhayaan bedka iyo muggu?',
          en: 'If a sphere radius doubles, by what factors do surface area and volume increase? (Area ×4, Volume ×8).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-6.1',
        exerciseNumber: 'የምዕራፍ 6 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'ራዲየሱ r = 3 cm የሆነ ስፌር (Sphere) የገፅታ ስፋቱ (Surface Area) ስንት ነው?',
          om: 'Sphere r = 3 cm surface area meeqa?',
          ti: 'r = 3 cm ዘለዎ ስፌር ስፍሓት ገጽ ክንደይ እዩ?',
          ar: 'ما هي المساحة السطحية لكرة نصف قطرها r = 3 سم؟',
          so: 'Waa maxay bedka kubadda r = 3 cm?',
          en: 'What is the total surface area of a sphere with radius r = 3 cm?',
        },
        options: ['A. 12π cm²', 'B. 36π cm²', 'C. 108π cm²', 'D. 27π cm²'],
        correctAnswer: {
          am: 'B. 36π cm² — የስፌር የገፅታ ስፋት ቀመር A = 4πr² ስለሆነ፡ A = 4π(3)² = 4π(9) = 36π cm²',
          om: 'B. 36π cm²',
          ti: 'B. 36π cm²',
          ar: 'B. 36π سم² (المساحة السطحية للكرة A = 4πr² = 4π(3)² = 36π سم²)',
          so: 'B. 36π cm²',
          en: 'B. 36π cm² — Sphere surface area formula A = 4πr² = 4π(3)² = 36π cm².',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የስፌር የገፅታ ስፋት ቀመር፡ A = 4πr²።',
            om: 'A = 4πr².',
            ti: 'A = 4πr²።',
            ar: 'الخطوة 1: قانون المساحة السطحية للكرة: A = 4πr².',
            so: 'A = 4πr².',
            en: 'Step 1: State sphere surface area formula: A = 4πr².',
          },
          {
            am: 'ደረጃ 2፡ r = 3 cm አስገባ፡ A = 4 × π × (3)² = 4 × π × 9 = 36π cm²።',
            om: 'A = 4 × 9 × π = 36π cm².',
            ti: 'A = 36π cm²።',
            ar: 'الخطوة 2: عوض بقيمة نصف القطر: A = 4 × π × 9 = 36π سم².',
            so: 'A = 36π cm².',
            en: 'Step 2: Substitute r = 3: A = 4π(9) = 36π cm².',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የኮን የትከሻ ቁመት (Slant height) l ሁልጊዜ በፓይታጎረስ l = √(r² + h²) እንደሚሰላ አስታውሱ።',
      om: 'Slant height l = √(r² + h²).',
      ti: 'l = √(r² + h²) ምዃኑ ዘክሩ።',
      ar: 'تذكر أن الارتفاع الجانبي للمخروط l يحسب دائماً بفيثاغورس: l = √(r² + h²).',
      so: 'l = √(r² + h²).',
      en: 'Slant height of a cone is derived via Pythagoras: l = √(r² + h²).',
    },
  },

  // -----------------------------------------------------------
  // UNIT 7: COORDINATE GEOMETRY (pp. 345-385)
  // -----------------------------------------------------------
  {
    unitNumber: 7,
    title: {
      am: 'ምዕራፍ 7፡ ኮኦርዲኔት ጂኦሜትሪ (Coordinate Geometry)',
      om: 'Boqonnaa 7: Ko\'oordineet Ji\'oomeetirii',
      ti: 'ምዕራፍ 7፡ ኮኦርዲኔት ጂኦሜትሪ',
      ar: 'الوحدة 7: الهندسة التحليلية والإحداثية (Coordinate Geometry)',
      so: 'Cutubka 7: Coordinate Geometry',
      en: 'Unit 7: Coordinate Geometry',
    },
    startPage: 345,
    endPage: 385,
    theoryContent: {
      am: `ምዕራፍ 7 አልጀብራንና ጂኦሜትሪን በካርቴዥያን ፕሌን ላይ በማስተሳሰር ይተነትናል፦
7.1 የሁለት ነጥቦች ርቀት (Distance Formula): d = √((x₂ - x₁)² + (y₂ - y₁)²)。
7.2 የመስመር ክፍፍል (Division of a Line Segment):
- የመሀል ነጥብ (Midpoint): M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
- ሴክሽን ፎርሙላ (Section Formula)፡ ነጥብ P መስመር AB ን በ m:n ሬሾ ሲከፍል፡ P = ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))።
7.3 የቀጥተኛ መስመር እኩልታ (Equation of a Line):
- ስሎፕ (Slope): m = (y₂ - y₁) / (x₂ - x₁) = tan θ
- Slope-Intercept Form: y = mx + b
- Point-Slope Form: y - y₁ = m(x - x₁)
- አጠቃላይ ቀመር (General Form): Ax + By + C = 0።
7.4 ትይዩና ፐርፔንዲኩላር መስመሮች፡
- ትይዩ መስመሮች (Parallel Lines)፡ ስሎፓቸው እኩል ነው (m₁ = m₂)።
- ፐርፔንዲኩላር መስመሮች (Perpendicular Lines)፡ የቁልቁለት ብዜታቸው -1 ነው (m₁ · m₂ = -1 ወይም m₂ = -1/m₁)።
- ከነጥብ (x₀, y₀) ወደ መስመር Ax + By + C = 0 ያለው ርቀት፡ d = |Ax₀ + By₀ + C| / √(A² + B²)።
7.5 የክብ እኩልታ (Equation of a Circle):
- ማዕከሉ (h, k) እና ራዲየሱ r የሆነ ክብ ቀመር፡ (x - h)² + (y - k)² = r²።
- አጠቃላይ ቀመር፡ x² + y² + Dx + Ey + F = 0 ሲሆን በ Completing the Square ማዕከሉ (-D/2, -E/2) እና ራዲየሱ ይገኛል።
7.6 ተግባራዊ አተገባበር፡ የከተማ መሬት ካዳስተር ልኬት፣ የመንገድ ኢንጂነሪንግ ስሎፕ እና የሳተላይት መገኛ (GPS)።`,
      om: `Boqonnaa 7: Distance formula, Section formula, Equation of lines, slopes fi Circle equation ibsa.`,
      ti: `ምዕራፍ 7፡ ናይ ክልተ ነጥብታት ርሕቐት፣ ስሎፕ፣ ናይ መስመር እኩልታን ክብ እኩልታን።`,
      ar: `الوحدة 7: الهندسة التحليلية: قانون المسافة ونقطة التقسيم، ميل الخط المستقيم ومعادلاته، تعامد وتوازي المستقيمات، ومعادلة الدائرة.`,
      so: `Cutubka 7: Xisaabinta masaafada iyo isleegyada xariiqda.`,
      en: `Unit 7 covers distance & section formulas, straight line equations, parallel/perpendicular slopes, and circle equations.`,
    },
    examples: [
      {
        id: 'ex-m-7.1',
        exampleNumber: 'ምሳሌ 7.1 (Perpendicular Line Equation)',
        problemStatement: {
          am: 'ከነጥብ P(2, -1) የሚያልፍ እና ለመስመሩ 2x - 3y + 6 = 0 ፐርፔንዲኩላር (Perpendicular) የሆነውን የቀጥተኛ መስመር እኩልታ ፈልጉ።',
          om: 'Sarara 2x - 3y + 6 = 0 tiif perpendicular kan ta\'ee fi qabxii (2, -1) keessa darbu barbaadi.',
          ti: 'ብ (2, -1) ዝሓልፍን ን 2x - 3y + 6 = 0 perpendicular ዝኾነን መስመር እኩልታ ድለዩ።',
          ar: 'أوجد معادلة الخط المستقيم المار بالنقطة P(2, -1) والعمودي على المستقيم الذي معادلته 2x - 3y + 6 = 0.',
          so: 'Soo hel xariiqda perpendicular-ka ku ah 2x - 3y + 6 = 0 ee marta (2, -1).',
          en: 'Find the equation of the line passing through P(2, -1) that is perpendicular to the line 2x - 3y + 6 = 0.',
        },
        given: ['የተሰጠው መስመር፡ 2x - 3y + 6 = 0', 'ነጥብ P(2, -1)'],
        formula: 'y = mx + b ፤ ፐርፔንዲኩላር ስሎፕ፡ m₂ = -1/m₁ ፤ Point-Slope: y - y₁ = m₂(x - x₁)',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ የመነሻውን መስመር ስሎፕ ፈልግ፡ 3y = 2x + 6 ⇒ y = (2/3)x + 2። ስለዚህ m₁ = 2/3 ነው።',
            om: 'Tarkaanfii 1: m₁ = 2/3.',
            ti: 'ደረጃ 1፡ m₁ = 2/3።',
            ar: 'الخطوة 1: اكتب المعادلة بصيغة الميل والمقطع: 3y = 2x + 6 إذن y = (2/3)x + 2، ومنه الميل m₁ = 2/3.',
            so: 'Tallaabada 1: m₁ = 2/3.',
            en: 'Step 1: Put in slope-intercept form: 3y = 2x + 6 ⇒ y = (2/3)x + 2. Slope m₁ = 2/3.',
          },
          {
            am: 'ደረጃ 2፡ የፐርፔንዲኩላር መስመሩን ስሎፕ አስላ፡ m₂ = -1 / (2/3) = -3/2።',
            om: 'Tarkaanfii 2: m₂ = -3/2.',
            ti: 'ደረጃ 2፡ m₂ = -3/2።',
            ar: 'الخطوة 2: ميل العمودي هو مقلوب الإشارة المعكوس: m₂ = -1 / (2/3) = -3/2.',
            so: 'Tallaabada 2: m₂ = -3/2.',
            en: 'Step 2: Negative reciprocal perpendicular slope: m₂ = -3/2.',
          },
          {
            am: 'ደረጃ 3፡ በ Point-Slope ቀመር ተጠቀም፡ y - (-1) = (-3/2)(x - 2) ⇒ y + 1 = (-3/2)x + 3 ⇒ y = (-3/2)x + 2 ወይም 3x + 2y - 4 = 0።',
            om: 'Tarkaanfii 3: y = (-3/2)x + 2 yookiin 3x + 2y - 4 = 0.',
            ti: 'ደረጃ 3፡ 3x + 2y - 4 = 0።',
            ar: 'الخطوة 3: طبق معادلة النقطة والميل: y - (-1) = (-3/2)(x - 2) ومنه y + 1 = (-3/2)x + 3 إذن 3x + 2y - 4 = 0.',
            so: 'Tallaabada 3: 3x + 2y - 4 = 0.',
            en: 'Step 3: Point-slope formula: y - (-1) = (-3/2)(x - 2) ⇒ y + 1 = -3/2 x + 3 ⇒ 3x + 2y - 4 = 0.',
          },
        ],
        finalAnswer: {
          am: '3x + 2y - 4 = 0 (ወይም y = -1.5x + 2)',
          om: '3x + 2y - 4 = 0',
          ti: '3x + 2y - 4 = 0',
          ar: 'معادلة الخط المستقيم هي: 3x + 2y - 4 = 0',
          so: '3x + 2y - 4 = 0',
          en: '3x + 2y - 4 = 0 (or y = -1.5x + 2)',
        },
        pedagogicalNote: {
          am: 'ሁለት መስመሮች ፐርፔንዲኩላር ሲሆኑ ስሎፓቸው ሁልጊዜ አሉታዊ ገለባባጭ (Negative Reciprocals) ናቸው።',
          om: 'm₁ · m₂ = -1 yeroo hunda.',
          ti: 'm₁ · m₂ = -1 ኩሉ ግዜ።',
          ar: 'حاصل ضرب ميلي أي مستقيمين متعامدين يساوي دائماً -1 (m₁ · m₂ = -1).',
          so: 'm₁ · m₂ = -1 mar walba.',
          en: 'Perpendicular lines always possess negative reciprocal slopes (m₁ · m₂ = -1).',
        },
      },
    ],
    activities: [
      {
        id: 'act-m-7',
        activityNumber: 'አክቲቪቲ 7.1',
        title: {
          am: 'የመሬት ይዞታ ስፋት በ Shoelace Formula ማስላት',
          om: 'Bal\'ina lafaa Shoelace Formula fayyadamuun shallaguu',
          ti: 'ስፍሓት መሬት ብ Shoelace Formula ምዕቃን',
          ar: 'حساب مساحة قطعة أرض مضلعة باستخدام إحداثيات الرؤوس (صيغة رباط الحذاء)',
          so: 'Xisaabinta bedka dhulka',
          en: 'Calculating Polygonal Land Parcels via the Coordinate Shoelace Formula',
        },
        instruction: {
          am: 'የአራት ማዕዘን መሬት አራቱ ማዕዘናት A(1, 1), B(7, 2), C(8, 6), D(2, 5) ተሰጥተዋል። በ Shoelace ቀመር ስፋቱን አስሉ።',
          om: 'Shoelace formula fayyadamuun bal\'ina shallagaa.',
          ti: 'ብ Shoelace formula ስፍሓት ኣስሉዕ።',
          ar: 'طبق مصفوفة الإحداثيات لحساب مساحة المضلع A=(1,1), B=(7,2), C=(8,6), D=(2,5).',
          so: 'Xisaabi bedka adigoo isticmaalaya iskudhafka.',
          en: 'Apply coordinate matrix cross-multiplication to calculate polygon area.',
        },
        groupTask: {
          am: 'ቀመሩን 1/2 |(x₁y₂ + x₂y₃ + ...) - (y₁x₂ + y₂x₃ + ...)| በመጠቀም ትክክለኛ ስፋቱን በካሬ ዩኒት አስሉ።',
          om: 'Bal\'ina argadhaa.',
          ti: 'ስፍሓት ድለዩ።',
          ar: 'احسب نصف القيمة المطلقة للفروق القطرية لتجد المساحة بوحدات مربعة.',
          so: 'Hel bedka saxda ah.',
          en: 'Compute half the absolute value of determinant cross products.',
        },
        criticalThinkingQuestion: {
          am: 'ሦስት ነጥቦች በአንድ ቀጥተኛ መስመር ላይ ካረፉ (Collinear ከሆኑ) በ Shoelace ቀመር የሚገኘው ስፋት ምን ይሆናል? (ዜሮ ይሆናል)',
          om: 'Qabxiilee 3 collinear yoo ta\'an bal\'inni maali ta\'a?',
          ti: '3 ነጥብታት Collinear እንተኾይኖም ስፍሓት እንታይ ይኸውን?',
          ar: 'إذا وقعت ثلاث نقاط على استقامة واحدة (Collinear)، فماذا تكون قيمة المساحة الناتجة؟',
          so: 'Maxay noqonaysaa haddii 3 dhibcood ay xariiq wadaagaan?',
          en: 'Why does the Shoelace formula yield exactly zero area for three collinear points? (Because no enclosed triangle exists).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-m-7.1',
        exerciseNumber: 'የምዕራፍ 7 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'በነጥብ A(1, 3) እና B(5, 7) መካከል ያለው ርቀት ስንት ነው?',
          om: 'Fageenyi A(1, 3) fi B(5, 7) gidduu jiru meeqa?',
          ti: 'ኣብ መንጎ A(1, 3)ን B(5, 7)ን ዘሎ ርሕቐት ክንደይ እዩ?',
          ar: 'ما المسافة المستقيمة بين النقطتين A(1, 3) و B(5, 7)؟',
          so: 'Waa maxay masaafada u dhaxaysa A(1, 3) iyo B(5, 7)?',
          en: 'What is the distance between points A(1, 3) and B(5, 7)?',
        },
        options: ['A. 4', 'B. 4√2', 'C. 8', 'D. 16'],
        correctAnswer: {
          am: 'B. 4√2 — በርቀት ቀመር መሰረት d = √((5-1)² + (7-3)²) = √(4² + 4²) = √(16 + 16) = √32 = 4√2',
          om: 'B. 4√2',
          ti: 'B. 4√2',
          ar: 'B. 4√2 (حيث d = √(4² + 4²) = √32 = 4√2)',
          so: 'B. 4√2',
          en: 'B. 4√2 — Distance d = √((5-1)² + (7-3)²) = √(16 + 16) = √32 = 4√2.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የርቀት ቀመር፡ d = √((x₂ - x₁)² + (y₂ - y₁)²)。',
            om: 'd = √((Δx)² + (Δy)²).',
            ti: 'd = √((Δx)² + (Δy)²)。',
            ar: 'الخطوة 1: قانون المسافة: d = √((x₂ - x₁)² + (y₂ - y₁)²).',
            so: 'd = √((x₂ - x₁)² + (y₂ - y₁)²).',
            en: 'Step 1: Distance formula: d = √((x₂ - x₁)² + (y₂ - y₁)²).',
          },
          {
            am: 'ደረጃ 2፡ ቁጥሮቹን አስገባ፡ d = √((5 - 1)² + (7 - 3)²) = √(4² + 4²) = √(16 + 16) = √32 = 4√2።',
            om: 'd = √32 = 4√2.',
            ti: 'd = √32 = 4√2።',
            ar: 'الخطوة 2: d = √(16 + 16) = √32 = 4√2.',
            so: 'd = 4√2.',
            en: 'Step 2: Calculate: d = √(16 + 16) = √32 = 4√2.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የክብ አጠቃላይ ቀመር x² + y² + Dx + Ey + F = 0 ሲሰጥ፣ ማዕከሉ h = -D/2 እና k = -E/2 ሲሆን ራዲየሱ r = √(h² + k² - F) ነው።',
      om: 'Circle center = (-D/2, -E/2), r = √(h² + k² - F).',
      ti: 'ማእከል ክቢ = (-D/2, -E/2) እዩ።',
      ar: 'قاعدة سريعة: مركز الدائرة المعطاة بالصورة العامة هو (-D/2, -E/2) ونصف قطرها r = √(h² + k² - F).',
      so: 'Xuddunta goobada = (-D/2, -E/2).',
      en: 'Quick exam tip: General circle x² + y² + Dx + Ey + F = 0 has center (-D/2, -E/2) and r = √(h² + k² - F).',
    },
  },
];

// =============================================================
// GRADE 10 PHYSICS - ALL 6 OFFICIAL UNITS (pp. 1 - 220)
// =============================================================
export const GRADE_10_PHYSICS_CHAPTERS: TextbookChapter[] = [
  // -----------------------------------------------------------
  // UNIT 1: VECTOR QUANTITIES (pp. 1-20)
  // -----------------------------------------------------------
  {
    unitNumber: 1,
    title: {
      am: 'ምዕራፍ 1፡ ቬክተር ኳንቲቲዎች (Vector Quantities)',
      om: 'Boqonnaa 1: Hammaalee Veektarii (Vector Quantities)',
      ti: 'ምዕራፍ 1፡ ቬክተር ኳንቲቲታት',
      ar: 'الوحدة 1: الكميات المتجهة والتحليل الشعاعي (Vector Quantities)',
      so: 'Cutubka 1: Tirada Vector-ka',
      en: 'Unit 1: Vector Quantities',
    },
    startPage: 1,
    endPage: 20,
    theoryContent: {
      am: `ምዕራፍ 1 በፊዚክስ ውስጥ ወሳኝ የሆኑትን ስኬላርና ቬክተር መለኪያዎች በጥልቀት ይተነትናል፦
1.1 ስኬላር እና ቬክተር፡ ስኬላር (Scalar) መጠን (Magnitude) እና አሃድ (Unit) ብቻ ሲኖረው፤ ቬክተር (Vector) መጠን፣ አሃድ እና አቅጣጫ (Direction) ይፈልጋል።
1.2 የቬክተር ውክልና፡ ቬክተር በግራፍ ላይ በቀስት (Arrow) ይወከላል። ርዝመቱ መጠኑን ሲያሳይ የቀስቱ ጫፍ አቅጣጫውን ያመለክታል።
1.3 የቬክተር መደመርና መቀነስ፡ በአንድ አቅጣጫ ያሉ በቀጥታ ይደመራሉ፤ በተቃራኒ አቅጣጫ ያሉ ይቀነሳሉ። መቀነስ A⃗ - B⃗ ማለት A⃗ + (-B⃗) መደመር ማለት ነው።
1.4 የግራፍ ዘዴ (Graphical Addition): 
- የሶስት ማዕዘን ህግ (Triangle Law - Head-to-tail): የአንደኛውን ጅራት ከሁለተኛው ጫፍ ጋር በማገናኘት ውጤቱን ማግኘት።
- የፓራሌሎግራም ህግ (Parallelogram Law): R = √(A² + B² + 2AB cos θ) ፤ tan α = (B sin θ)/(A + B cos θ)።
1.5 የቬክተር መተንተን (Vector Resolution): ቬክተር A ን ወደ ሁለት ፐርፔንዲኩላር ኮምፖነንቶች መከፋፈል፡ A_x = A cos θ እና A_y = A sin θ። አጠቃላይ ውጤት R = √(R_x² + R_y²) እና θ = arctan(R_y / R_x)።`,
      om: `Boqonnaa 1: Scalars fi Vectors, graphical fi analytical vector addition fi resolution ibsa.`,
      ti: `ምዕራፍ 1፡ ስኬላርን ቬክተርን፣ ናይ ቬክተር ምድማርን ምቕናስን ምትንታንን።`,
      ar: `الوحدة 1: الكميات القياسية والمتجهة، جمع وطرح المتجهات بيانياً، وقانون متوازي الأضلاع، وتحليل المتجهات إلى مركباتها الأفقية والرأسية.`,
      so: `Cutubka 1: Kala saarista scalars iyo vectors iyo xisaabinta natiijada.`,
      en: `Unit 1 covers scalar vs vector quantities, graphical addition (triangle and parallelogram laws), and analytical vector resolution into rectangular components.`,
    },
    examples: [
      {
        id: 'ex-p-1.1',
        exampleNumber: 'ምሳሌ 1.1 (Analytical Vector Resolution)',
        problemStatement: {
          am: 'መጠኑ F = 100 N የሆነ ሃይል ከአግድም መስመር ጋር በ 30° ማዕዘን እየሳበ ነው። አግድም (F_x) እና ቀጥ ያለ (F_y) ኮምፖነንቶቹን አስሉ።',
          om: 'Humna F = 100 N kofa 30° qabuuf F_x fi F_y shallagaa.',
          ti: 'F = 100 N ብ 30° ዝስሕብ ሓይሊ F_x ን F_y ን ድለዩ።',
          ar: 'تؤثر قوة مقدارها F = 100 نيوتن بزاوية 30° مع الأفق. احسب المركبتين الأفقية F_x والرأسية F_y.',
          so: 'Soo hel F_x iyo F_y ee F = 100 N xagasha 30°.',
          en: 'A force of F = 100 N acts at an angle of 30° above the horizontal. Calculate the horizontal (F_x) and vertical (F_y) components.',
        },
        given: ['F = 100 N', 'θ = 30°', 'cos 30° = √3/2 ≈ 0.866', 'sin 30° = 0.5'],
        formula: 'F_x = F cos θ ፤ F_y = F sin θ',
        calculationSteps: [
          {
            am: 'ደረጃ 1 (Horizontal)፡ F_x = 100 × cos(30°) = 100 × 0.866 = 86.6 N ወደ ቀኝ።',
            om: 'Tarkaanfii 1: F_x = 100 × 0.866 = 86.6 N.',
            ti: 'ደረጃ 1፡ F_x = 86.6 N።',
            ar: 'الخطوة 1: المركبة الأفقية: F_x = 100 × cos(30°) = 86.6 نيوتن.',
            so: 'Tallaabada 1: F_x = 86.6 N.',
            en: 'Step 1: Horizontal component: F_x = 100 cos(30°) = 86.6 N.',
          },
          {
            am: 'ደረጃ 2 (Vertical)፡ F_y = 100 × sin(30°) = 100 × 0.5 = 50.0 N ወደ ላይ።',
            om: 'Tarkaanfii 2: F_y = 100 × 0.5 = 50 N.',
            ti: 'ደረጃ 2፡ F_y = 50 N።',
            ar: 'الخطوة 2: المركبة الرأسية: F_y = 100 × sin(30°) = 50 نيوتن.',
            so: 'Tallaabada 2: F_y = 50 N.',
            en: 'Step 2: Vertical component: F_y = 100 sin(30°) = 50.0 N.',
          },
        ],
        finalAnswer: {
          am: 'F_x = 86.6 N (አግድም) ፤ F_y = 50.0 N (ቀጥ ያለ)',
          om: 'F_x = 86.6 N; F_y = 50.0 N',
          ti: 'F_x = 86.6 N፤ F_y = 50.0 N',
          ar: 'المركبة الأفقية F_x = 86.6 نيوتن؛ المركبة الرأسية F_y = 50.0 نيوتن',
          so: 'F_x = 86.6 N, F_y = 50.0 N',
          en: 'F_x = 86.6 N; F_y = 50.0 N',
        },
        pedagogicalNote: {
          am: 'የኮምፖነንቶች ድምር በፓይታጎረስ ሲሰላ ዋናውን ሃይል ይሰጣል፡ √(86.6² + 50²) = √(7500 + 2500) = √10000 = 100 N።',
          om: '√(F_x² + F_y²) = 100 N ta\'uu mirkaneessaa.',
          ti: '√(F_x² + F_y²) = 100 N ምዃኑ ኣረጋግጹ።',
          ar: 'تحقق من صحة الحل بفيثاغورس: √(86.6² + 50²) = 100 نيوتن.',
          so: 'Xaqiiji: √(F_x² + F_y²) = 100 N.',
          en: 'Verify via Pythagoras: √(86.6² + 50²) = 100 N.',
        },
      },
    ],
    activities: [
      {
        id: 'act-p-1',
        activityNumber: 'አክቲቪቲ 1.1',
        title: {
          am: 'የሃይሎች ሚዛን በፎርስ ቴብል (Force Table) መለካት',
          om: 'Force Table fayyadamuun wal-simsiisa humnarratti hojjedhaa',
          ti: 'ሚዛን ሓይሊ ብ ፎርስ ቴብል ምዕቃን',
          ar: 'تحقيق اتزان القوى المتلاقية بيانياً وعملياً على طاولة القوى',
          so: 'Cabirka xoogagga Force Table',
          en: 'Verifying Vector Equilibrium of Forces Using a Laboratory Force Table',
        },
        instruction: {
          am: 'በፎርስ ቴብል ላይ ሶስት ክሮችና ክብደቶች በማንጠልጠል ማእከላዊው ቀለበት በትክክል መሃል ላይ እንዲረጋ በማድረግ የተገኘውን የቬክተር ሚዛን አስሉ።',
          om: 'Force table irratti humnawwan sadi wal-qixxeessaa.',
          ti: 'ኣብ ፎርስ ቴብል ሰለስተ ሓይልታት ኣመጣጥኑ።',
          ar: 'علق أثقالاً في ثلاثة حبال عبر بكرات طاولة القوى حتى يستقر الخاتم المركزي في المنتصف تماماً.',
          so: 'Isku dheelli saddexda xadhig.',
          en: 'Suspend weights along three pulleys until the central ring remains centered in static equilibrium.',
        },
        groupTask: {
          am: 'የሁለቱ ሃይሎች ድምር Resultant R ከሶስተኛው ሃይል Equilibrant E ጋር እኩል መጠንና ተቃራኒ አቅጣጫ (180°) መሆኑን አረጋግጡ።',
          om: 'R fi E wal-qixa fi faallaa ta\'uu mirkaneessaa.',
          ti: 'R ን E ን ማዕረን ተጻራርን ምዃኖም ኣረጋግጹ።',
          ar: 'أثبت أن محصلة القوتين R تساوي قوة الاتزان E في المقدار وتعاكسها في الاتجاه.',
          so: 'Xaqiiji in R = E oo ay iska soo horjeedaan.',
          en: 'Demonstrate that the resultant vector equals the equilibrant in magnitude but opposes it by 180°.',
        },
        criticalThinkingQuestion: {
          am: 'ሁለት እኩል ሃይሎች F እና F ሲደመሩ ውጤታቸውም F የሚሆነው በመካከላቸው ያለው ማዕዘን ስንት ዲግሪ ሲሆን ነው? (120° ሲሆን)',
          om: 'R = F ta\'uuf kofni meeqa ta\'uu qaba?',
          ti: 'R = F ክኸውን ኩርናዕ ክንደይ ክኸውን ኣለዎ?',
          ar: 'ما هي الزاوية المحصورة بين قوتين متساويتين F و F لكي تكون محصلتهما مساوية أيضاً لـ F؟',
          so: 'Waa maxay xagashu haddii R = F?',
          en: 'At what angle θ between two equal forces F do they produce a resultant equal to F? (θ = 120°).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-p-1.1',
        exerciseNumber: 'የምዕራፍ 1 ፈተና ጥያቄ 1',
        type: 'multiple_choice',
        question: {
          am: 'ሁለት ፐርፔንዲኩላር ሃይሎች F₁ = 6 N እና F₂ = 8 N ቢደመሩ የውጤታቸው (Resultant) መጠን ስንት ነው?',
          om: 'Humni F₁ = 6 N fi F₂ = 8 N yoo perpendicular ta\'an R meeqa?',
          ti: 'F₁ = 6 N ን F₂ = 8 N ን perpendicular እንተኾይኖም ውጽኢቶም ክንደይ እዩ?',
          ar: 'أثرت قوتان متعامدتان مقدارهما 6 نيوتن و 8 نيوتن على جسم. ما مقدار القوة المحصلة؟',
          so: 'Waa maxay natiijada F₁ = 6 N iyo F₂ = 8 N haddii ay perpendicular yihiin?',
          en: 'Two perpendicular forces F₁ = 6 N and F₂ = 8 N act on a body. What is the magnitude of the resultant force?',
        },
        options: ['A. 2 N', 'B. 10 N', 'C. 14 N', 'D. 48 N'],
        correctAnswer: {
          am: 'B. 10 N — በፓይታጎረስ ህግ መሰረት R = √(6² + 8²) = √(36 + 64) = √100 = 10 N',
          om: 'B. 10 N',
          ti: 'B. 10 N',
          ar: 'B. 10 نيوتن (بفيثاغورس: R = √(6² + 8²) = √100 = 10 نيوتن)',
          so: 'B. 10 N',
          en: 'B. 10 N — By Pythagoras: R = √(6² + 8²) = √(36 + 64) = √100 = 10 N.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ ፐርፔንዲኩላር (θ = 90°) ሲሆኑ፡ R = √(F₁² + F₂²)።',
            om: 'R = √(F₁² + F₂²).',
            ti: 'R = √(F₁² + F₂²)።',
            ar: 'الخطوة 1: للقوى المتعامدة: R = √(F₁² + F₂²).',
            so: 'R = √(F₁² + F₂²).',
            en: 'Step 1: Perpendicular resultant formula: R = √(F₁² + F₂²).',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ R = √(6² + 8²) = √(36 + 64) = √100 = 10 N።',
            om: 'R = √100 = 10 N.',
            ti: 'R = 10 N።',
            ar: 'الخطوة 2: R = √(36 + 64) = 10 نيوتن.',
            so: 'R = 10 N.',
            en: 'Step 2: Evaluate: R = √(36 + 64) = √100 = 10 N.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ ቬክተርን በስኬላር ስናባዛ (ለምሳሌ፡ c · A⃗) መጠኑ በ c እጥፍ ይለወጣል፤ c አዎንታዊ ከሆነ አቅጣጫው አይለወጥም፣ አሉታዊ ከሆነ አቅጣጫው 180° ይገለበጣል።',
      om: 'Scalar dabalataan baay\'isuun kallattii jijjiiruu danda\'a.',
      ti: 'ብኣሉታዊ ስኬላር ምብዛሕ ኣንፈት ይገልብጦ።',
      ar: 'إضاءة: ضرب المتجه في عدد سالب يعكس اتجاهه بمقدار 180° مع تغيير مقداره.',
      so: 'Isku dhufashada scalar taban waxay beddeshaa jihada.',
      en: 'Multiplying a vector by a negative scalar reverses its spatial direction by 180°.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 2: UNIFORMLY ACCELERATED MOTION (pp. 21-58)
  // -----------------------------------------------------------
  {
    unitNumber: 2,
    title: {
      am: 'ምዕራፍ 2፡ ቋሚ ፍጥንጥነት ያለው እንቅስቃሴ (Uniformly Accelerated Motion)',
      om: 'Boqonnaa 2: Sochii Saffisiisa Dhaabbataa (Uniformly Accelerated Motion)',
      ti: 'ምዕራፍ 2፡ ቀጻሊ ቅልጣፈ ዘለዎ ምንቅስቓስ',
      ar: 'الوحدة 2: الحركة بتسارع منتظم في خط مستقيم (Uniformly Accelerated Motion)',
      so: 'Cutubka 2: Dhaqdhaqaaqa Xawaaraha Joogtada ah',
      en: 'Unit 2: Uniformly Accelerated Motion',
    },
    startPage: 21,
    endPage: 58,
    theoryContent: {
      am: `ምዕራፍ 2 ቀጥተኛ እንቅስቃሴንና ኪነማቲክስን ይዳስሳል፦
2.1 መገኛና ፍልሰት፡ ርቀት (Distance) አጠቃላይ የተጓዘውን መንገድ ሲለካ፤ ፍልሰት (Displacement Δx) ከመነሻ እስከ መድረሻ ያለውን አጭር ቀጥተኛ ቬክተር ይለካል።
2.2 አማካይና ቅጽበታዊ ፍጥነት፡ አማካይ ፍጥነት v_avg = Δx / Δt ፤ ቅጽበታዊ ፍጥነት በዚያች ቅጽበት ያለውን ፍጥነት ያሳያል።
2.3 ፍጥንጥነት (Acceleration): a = (v - u) / t (SI unit: m/s²)። ፍጥንጥነት ፍጥነት ሲጨምር አዎንታዊ፣ ሲቀንስ አሉታዊ (Deceleration) ይሆናል።
2.4 አራቱ የኪነማቲክስ ቀመሮች (Kinematic Equations):
1) v = u + at
2) s = ut + (1/2)at²
3) v² = u² + 2as
4) s = ((u + v)/2)t
በነፃ ውድቀት (Free Fall) ወቅት a = -g = -9.8 m/s² ይሆናል።
2.5 የግራፍ ትንተና፡
- Displacement-Time (s-t) ግራፍ ስሎፕ = ፍጥነት (Velocity)
- Velocity-Time (v-t) ግራፍ ስሎፕ = ፍጥንጥነት (Acceleration) ፤ ከግራፉ ስር ያለው ስፋት (Area under curve) = የተጓዘው ርቀት (Displacement)።
2.6 አንፃራዊ ፍጥነት (Relative Velocity): v_AB = v_A - v_B። ወደ ተቃራኒ አቅጣጫ ሲጓዙ ፍጥነቶቻቸው ይደመራሉ።`,
      om: `Boqonnaa 2: Kinematic equations 4, free fall g = 9.8 m/s², graphs fi relative velocity ibsa.`,
      ti: `ምዕራፍ 2፡ 4 ናይ ኪነማቲክስ ቀመራት፣ ነፃ ውድቐት፣ ግራፋትን ኣንጻራዊ ፍጥነትን።`,
      ar: `الوحدة 2: معادلات الحركة الأربع بتسارع ثابت، السقوط الحر تحت الجاذبية، المنحنيات البيانية للحركة، والسرعة النسبية.`,
      so: `Cutubka 2: 4-ta isleeg ee kinematics iyo xawaaraha dabiiciga ah.`,
      en: `Unit 2 covers the 4 kinematic equations, free fall under gravity, displacement-time and velocity-time graphs, and relative velocity.`,
    },
    examples: [
      {
        id: 'ex-p-2.1',
        exampleNumber: 'ምሳሌ 2.1 (Braking Distance & Deceleration)',
        problemStatement: {
          am: 'መኪና በ u = 25 m/s (90 km/h) ፍጥነት እየተጓዘ አደጋ አይቶ ፍሬን በመያዝ በ a = -5 m/s² ፍጥንጥነት ቆመ። (a) ለመቆም የፈጀበት ጊዜ ስንት ነው? (b) ለመቆም የተጓዘው ርቀት ስንት ሜትር ነው?',
          om: 'Konkolaataan u = 25 m/s fi a = -5 m/s² tiin dhaabbate. Yeroo t fi fageenya s barbaadi.',
          ti: 'u = 25 m/s ዝነበረ መኪና ብ a = -5 m/s² ደው በለ። ግዜ t ን ርሕቐት s ን ድለዩ።',
          ar: 'تتحرك سيارة بسرعة ابتدائية 25 م/ث، وضغط السائق على المكابح لتتوقف بتسارع تباطؤ قدره -5 م/ث². احسب: (أ) زمن التوقف، (ب) مسافة التوقف.',
          so: 'u = 25 m/s, a = -5 m/s², soo hel t iyo s.',
          en: 'A car moving at u = 25 m/s brakes to rest with uniform deceleration a = -5 m/s². Determine: (a) stopping time, (b) stopping distance.',
        },
        given: ['u = 25 m/s', 'v = 0 (ሲቆም)', 'a = -5 m/s²'],
        formula: 'v = u + at ፤ v² = u² + 2as',
        calculationSteps: [
          {
            am: 'ደረጃ 1 (Time)፡ v = u + at ⇒ 0 = 25 + (-5)t ⇒ 5t = 25 ⇒ t = 5 ሰከንድ።',
            om: 'Tarkaanfii 1: t = 25 / 5 = 5 seconds.',
            ti: 'ደረጃ 1፡ t = 5 ሰከንድ።',
            ar: 'الخطوة 1: v = u + at ومنه 0 = 25 - 5t إذن t = 5 ثوانٍ.',
            so: 'Tallaabada 1: t = 5 ilbiriqsi.',
            en: 'Step 1: Stopping time: 0 = 25 - 5t ⇒ t = 5.0 s.',
          },
          {
            am: 'ደረጃ 2 (Distance)፡ v² = u² + 2as ⇒ 0 = (25)² + 2(-5)s ⇒ 0 = 625 - 10s ⇒ 10s = 625 ⇒ s = 62.5 ሜትር።',
            om: 'Tarkaanfii 2: s = 625 / 10 = 62.5 meters.',
            ti: 'ደረጃ 2፡ s = 62.5 ሜትሮ።',
            ar: 'الخطوة 2: v² = u² + 2as ومنه 0 = 625 - 10s إذن مسافة التوقف s = 62.5 متراً.',
            so: 'Tallaabada 2: s = 62.5 m.',
            en: 'Step 2: Stopping distance: 0 = 625 - 10s ⇒ s = 62.5 m.',
          },
        ],
        finalAnswer: {
          am: 'የመቆሚያ ጊዜ t = 5 ሰከንድ ፤ የመቆሚያ ርቀት s = 62.5 ሜትር',
          om: 't = 5 s; s = 62.5 m',
          ti: 't = 5 s፤ s = 62.5 ሜትሮ',
          ar: 'زمن التوقف t = 5 ثوانٍ؛ مسافة التوقف s = 62.5 متراً',
          so: 't = 5 s, s = 62.5 m',
          en: 'Stopping time t = 5.0 s; Stopping distance s = 62.5 m',
        },
        pedagogicalNote: {
          am: 'ፍጥነት በእጥፍ ሲጨምር የመቆሚያ ርቀት በ 4 እጥፍ (በስኩዌር) ይጨምራል (s ∝ u²)፤ ለዚህ ነው የፍጥነት ወሰን ማክበር ህይወትን የሚያድነው።',
          om: 'Saffisni yoo dachaa ta\'u fageenyi dachaa 4 ta\'a.',
          ti: 'ፍጥነት እንተወሰኸ ርሕቐት መዕረፊ ብ 4 እጥፊ ይውስኽ።',
          ar: 'تنبيه سلامة مرورية: مسافة التوقف تتناسب طردياً مع مربع السرعة (s ∝ u²).',
          so: 'Masaafada joogsigu waxay ku kordheysaa u².',
          en: 'Stopping distance scales with the square of initial speed: s ∝ u².',
        },
      },
    ],
    activities: [
      {
        id: 'act-p-2',
        activityNumber: 'አክቲቪቲ 2.1',
        title: {
          am: 'የሰው ምላሽ ጊዜ (Human Reaction Time) በመሪ ዱላ መለካት',
          om: 'Yeroo reaction time ruler fayyadamuun shallaguu',
          ti: 'ናይ ምላሽ ግዜ ብመስመርዕ ምዕቃን',
          ar: 'قياس زمن رد الفعل البشري باستخدام تجربة سقوط المسطرة الرأسية',
          so: 'Cabirka Reaction Time',
          en: 'Measuring Human Reaction Time via Free-Falling Meter Rule Drop',
        },
        instruction: {
          am: 'ጓደኛችሁ 1 ሜትር ዱላውን ሳይነግራችሁ በድንገት ይልቀቀው፤ ልክ ስትይዙት የወደቀበትን ርቀት d በሴንቲሜትር አንብቡ። Reaction time t = √(2d / g) አስሉ።',
          om: 'Ruler gadi dhiisuun d shallagaa, t = √(2d/g).',
          ti: 'መስመርዕ ብምልቃቕ ግዜ t = √(2d/g) ጸብጽቡ።',
          ar: 'امسك المسطرة الساقطة فجأة، واحسب زمن رد الفعل من مسافة السقوط: t = √(2d / g).',
          so: 'Qabo mastarada oo xisaabi t = √(2d/g).',
          en: 'Catch dropped ruler and calculate reaction time t = √(2d/g).',
        },
        groupTask: {
          am: 'አማካይ የሰው ልጅ ምላሽ ጊዜ ከ 0.15 እስከ 0.25 ሰከንድ መካከል መሆኑን በክፍል ውስጥ በተደጋጋሚ ሞክራችሁ አረጋግጡ።',
          om: 'Yeroon giddu-galeessaa 0.2s ta\'uu mirkaneessaa.',
          ti: 'አማካይ ግዜ 0.2 ሰከንድ ምዃኑ ኣረጋግጹ።',
          ar: 'كرر التجربة 5 مرات واحسب المتوسط، وتحقق أنه يقع بين 0.15 و 0.25 ثانية.',
          so: 'Xaqiiji celceliska 0.2 ilbiriqsi.',
          en: 'Verify human neurological response average falls within 0.15s - 0.25s.',
        },
        criticalThinkingQuestion: {
          am: 'መኪና በ 100 km/h (27.8 m/s) እየነዳህ የ 0.2 ሰከንድ ምላሽ ጊዜ ብትወስድ፣ እግርህ ፍሬን እስኪነካ ድረስ ብቻ መኪናው ስንት ሜትር ይጓዛል? (d = 27.8 × 0.2 ≈ 5.6 ሜትር)',
          om: 'Konkolaataan fageenya meeqa deema?',
          ti: 'መኪና ክንደይ ሜትሮ ትጓዓዝ?',
          ar: 'كم متراً تقطعها السيارة أثناء زمن رد الفعل فقط قبل بدء عمل المكابح؟',
          so: 'Meeqa mitir ayuu gaarigu soconayaa?',
          en: 'At 100 km/h (27.8 m/s), how far does a vehicle travel during reaction time alone? (≈ 5.6m).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-p-2.1',
        exerciseNumber: 'የምዕራፍ 2 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'አንድ ድንጋይ ከ 20 ሜትር ፎቅ ጫፍ ላይ በነፃ ውድቀት (u = 0, g = 10 m/s²) ቢወድቅ፣ መሬት ለመድረስ ስንት ሰከንድ ይፈጅበታል?',
          om: 'Dhagaan h = 20m irraa yoo kufe t meeqa?',
          ti: 'እምኒ ካብ 20 ሜትሮ ቁመት እንተወዲቑ ክንደይ ግዜ ይወስድ?',
          ar: 'سقط حجر سقوطاً حراً من سكون من قمة مبنى ارتفاعه 20 متراً. كم ثانية يستغرق ليصل إلى الأرض؟ (g = 10 م/ث²)',
          so: 'Immisa ilbiriqsi ayay ku qaadanaysaa dhagax ka soo dhacay 20m?',
          en: 'A stone drops freely from rest from a 20m high ledge (g = 10 m/s²). How many seconds does it take to strike the ground?',
        },
        options: ['A. 1 s', 'B. 2 s', 'C. 4 s', 'D. 10 s'],
        correctAnswer: {
          am: 'B. 2 s — በቀመሩ h = (1/2)gt² መሰረት፡ 20 = (1/2)(10)t² ⇒ 20 = 5t² ⇒ t² = 4 ⇒ t = 2 ሰከንድ',
          om: 'B. 2 s',
          ti: 'B. 2 s',
          ar: 'B. ثانيتان (h = 1/2 gt² ومنه 20 = 5t² إذن t² = 4 وبالتالي t = 2 ثانية)',
          so: 'B. 2 s',
          en: 'B. 2 s — h = (1/2)gt² ⇒ 20 = 5t² ⇒ t² = 4 ⇒ t = 2 seconds.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የነፃ ውድቀት ርቀት ቀመር፡ h = ut + (1/2)gt²፤ መነሻ u = 0 ስለሆነ h = (1/2)gt²።',
            om: 'h = 1/2 gt².',
            ti: 'h = 1/2 gt²።',
            ar: 'الخطوة 1: معادلة السقوط الحر من السكون: h = 1/2 gt².',
            so: 'h = 1/2 gt².',
            en: 'Step 1: Free fall from rest formula: h = (1/2)gt².',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ 20 = (1/2)(10)t² ⇒ 20 = 5t² ⇒ t² = 4 ⇒ t = 2 s።',
            om: '5t² = 20 ⇒ t = 2 s.',
            ti: '5t² = 20 ⇒ t = 2 s።',
            ar: 'الخطوة 2: 20 = 5t² إذن t = 2 ثانية.',
            so: 't = 2 s.',
            en: 'Step 2: Solve 20 = 5t² ⇒ t = 2.0 seconds.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የፍጥነት-ጊዜ (v-t) ግራፍ ስር ያለው ስፋት ሁልጊዜ የተጓዘውን ርቀት ይወክላል፤ ትሪያንግል ወይም ትራፔዞይድ ስፋት በማስላት በቀላሉ ርቀት ማግኘት ይቻላል።',
      om: 'Area under v-t graph = Displacement.',
      ti: 'ስፍሓት v-t ግራፍ = ርሕቐት።',
      ar: 'قاعدة ذهبية: المساحة المحصورة تحت منحنى السرعة والزمن تمثل دائماً الإزاحة الكلية المقطوعة.',
      so: 'Bedka hoos yimaada garaafka v-t waa masaafada.',
      en: 'The geometric area under a velocity-time curve identically equals linear displacement.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 3: ELASTICITY AND STATIC EQUILIBRIUM (pp. 59-90)
  // -----------------------------------------------------------
  {
    unitNumber: 3,
    title: {
      am: 'ምዕራፍ 3፡ ኤላስቲክነት እና የማይተጣጠፍ አካል ሚዛን (Elasticity & Static Equilibrium)',
      om: 'Boqonnaa 3: Qabannaa fi Madaallii Dhaabbataa (Elasticity & Equilibrium)',
      ti: 'ምዕራፍ 3፡ ኤላስቲክነትን ሚዛንን',
      ar: 'الوحدة 3: المرونة والاتزان الاستاتيكي للأجسام الجاسئة (Elasticity & Equilibrium)',
      so: 'Cutubka 3: Dabacsanaanta iyo Isku dheellitirka',
      en: 'Unit 3: Elasticity and Static Equilibrium of Rigid Body',
    },
    startPage: 59,
    endPage: 90,
    theoryContent: {
      am: `ምዕራፍ 3 የቁስ አካላትን የመለጠጥ ባህሪ እና የሃይሎችን ቋሚ ሚዛን ያብራራል፦
3.1 ኤላስቲክነትና ፕላስቲክነት፡ ኤላስቲክነት አካሉ ሃይል ሲነሳበት ወደ ቀድሞ ቅርጹ የመመለስ ባህሪው ሲሆን፤ ፕላስቲክነት ቋሚ ቅርጽ መበላሸት (Permanent deformation) ነው። የሁክ ህግ (Hooke’s Law): F = k · e (የመለጠጥ ሃይል ከመጠኑ ጋር ቀጥተኛ ተመጣጣኝ ነው)።
3.2 ዴንሲቲና ስፔሲፊክ ግራቪቲ፡ ዴንሲቲ ρ = m / V (kg/m³) ፤ Specific Gravity = የቁሱ ዴንሲቲ / የውሃ ዴንሲቲ (ውሃ = 1000 kg/m³)።
3.3 ስትሬስ እና ስትሬይን፡
- ስትሬስ (Tensile Stress): σ = F / A (Pascal = N/m²)
- ስትሬይን (Tensile Strain): ε = ΔL / L₀ (መለኪያ የሌለው ሬሾ)
3.4 የያንግ ሞጁለስ (Young\'s Modulus): Y = Stress / Strain = (F · L₀) / (A · ΔL)። ቁሱ ምን ያህል ጠጣርና የማይለጠጥ መሆኑን ያሳያል (የብረት Y ≈ 200 GPa)።
3.5 የማይተጣጠፍ አካል ቋሚ ሚዛን (Static Equilibrium):
- ቶርክ (Torque / Moment): τ = F · d · sin θ (የማሽከርከር ሃይል)
3.5.1 የመጀመሪያው የሚዛን ህግ (Translational Equilibrium): የሁሉም ውጫዊ ሃይሎች ድምር ዜሮ መሆን አለበት፡ ΣF_x = 0 እና ΣF_y = 0።
3.5.2 ሁለተኛው የሚዛን ህግ (Rotational Equilibrium): በማንኛውም ነጥብ ዙሪያ ያሉ የማሽከርከር ሃይሎች ድምር ዜሮ መሆን አለበት፡ Στ = 0 (Clockwise Moments = Counter-clockwise Moments)።`,
      om: `Boqonnaa 3: Hooke\'s law, Young\'s modulus Y = (FL)/(AΔL), Torque fi First/Second conditions of equilibrium ibsa.`,
      ti: `ምዕራፍ 3፡ ናይ ሁክ ሕጊ፣ ያንግ ሞጁለስ፣ ቶርክን ክልተ ሕግታት ሚዛንን።`,
      ar: `الوحدة 3: قانون هوك، إجهاد وانفعال الشد، معامل ينج للمرونة، العزم وشرطا الاتزان الاستاتيكي للأجسام الصلبة.`,
      so: `Cutubka 3: Xeerka Hooke, Young's modulus iyo labada xaaladood ee isku dheellitirka.`,
      en: `Unit 3 covers Hooke’s law, stress, strain, Young’s modulus Y = (F·L)/(A·ΔL), torque, and 1st and 2nd conditions of static equilibrium.`,
    },
    examples: [
      {
        id: 'ex-p-3.1',
        exampleNumber: 'ምሳሌ 3.1 (Young\'s Modulus Wire Elongation)',
        problemStatement: {
          am: 'ርዝመቱ L₀ = 2.0 m እና የጎን ስፋቱ A = 1.0 × 10⁻⁶ m² (1.0 mm²) የሆነ የብረት ሽቦ በ F = 400 N ሃይል ሲወጠር፣ ምን ያህል ርዝመት ΔL ይጨምራል? (የብረት Y = 2.0 × 10¹¹ Pa)።',
          om: 'Shiboo sibiilaa L₀ = 2.0m, A = 1.0×10⁻⁶ m², F = 400N yoo ta\'e ΔL shallagaa.',
          ti: 'L₀ = 2.0m, A = 1.0×10⁻⁶ m², F = 400N እንተኾይኑ ΔL ድለዩ።',
          ar: 'سلك فولاذي طوله الأصلي 2.0 م ومساحة مقطعه 1.0 × 10⁻⁶ م² تعرض لقوة شد مقدارها 400 نيوتن. احسب الاستطالة الحادثة ΔL علماً بأن معامل ينج للفولاذ Y = 2.0 × 10¹¹ باسكال.',
          so: 'Soo hel ΔL haddii L₀ = 2.0m, A = 1.0×10⁻⁶ m², F = 400N, Y = 2×10¹¹ Pa.',
          en: 'A steel wire of length 2.0m and cross-sectional area 1.0 × 10⁻⁶ m² experiences a tensile force of 400 N. Calculate the elongation ΔL (Y_steel = 2.0 × 10¹¹ Pa).',
        },
        given: ['L₀ = 2.0 m', 'A = 1.0 × 10⁻⁶ m²', 'F = 400 N', 'Y = 2.0 × 10¹¹ Pa'],
        formula: 'Y = (F · L₀) / (A · ΔL) ⇒ ΔL = (F · L₀) / (A · Y)',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ ቀመሩን ለ ΔL አዘጋጅ፡ ΔL = (400 N × 2.0 m) / (1.0 × 10⁻⁶ m² × 2.0 × 10¹¹ N/m²)።',
            om: 'Tarkaanfii 1: ΔL = 800 / (2.0 × 10⁵).',
            ti: 'ደረጃ 1፡ ΔL = 800 / 200,000።',
            ar: 'الخطوة 1: ΔL = (400 × 2.0) / (1.0 × 10⁻⁶ × 2.0 × 10¹¹).',
            so: 'Tallaabada 1: ΔL = 800 / 200,000.',
            en: 'Step 1: Setup formula: ΔL = (400 × 2.0) / (1.0 × 10⁻⁶ × 2.0 × 10¹¹).',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ ΔL = 800 / (2.0 × 10⁵) = 400 × 10⁻⁵ = 4.0 × 10⁻³ m = 4.0 mm።',
            om: 'Tarkaanfii 2: ΔL = 4.0 mm.',
            ti: 'ደረጃ 2፡ ΔL = 4.0 ሚሊሜትሮ።',
            ar: 'الخطوة 2: ΔL = 800 / 200000 = 4.0 × 10⁻³ م = 4.0 ملم.',
            so: 'Tallaabada 2: ΔL = 4.0 mm.',
            en: 'Step 2: Compute: ΔL = 800 / 200,000 = 4.0 × 10⁻³ m = 4.0 mm.',
          },
        ],
        finalAnswer: {
          am: 'የተዘረጋው ርዝመት ΔL = 4.0 mm (0.004 ሜትር)',
          om: 'ΔL = 4.0 mm',
          ti: 'ΔL = 4.0 ሚሊሜትሮ',
          ar: 'الاستطالة ΔL = 4.0 ملم',
          so: 'ΔL = 4.0 mm',
          en: 'Elongation ΔL = 4.0 mm (0.004 m)',
        },
        pedagogicalNote: {
          am: 'ምንም እንኳን 400 ኒውተን ትልቅ ሃይል ቢሆንም፣ የብረት ያንግ ሞጁለስ በጣም ግዙፍ ስለሆነ የመለጠጡ መጠን 4 ሚሊሜትር ብቻ ነው።',
          om: 'Sibiilli jabaa waan ta\'eef xiqqoo qofa diriira.',
          ti: 'ብረት ድልዱል ስለዝኾነ ብውሑድ ይስሓብ።',
          ar: 'نظراً لكبر معامل ينج للفولاذ، فإن استطالته طفيفة جداً مما يجعله مثالياً للبناء.',
          so: 'Birta waxay leedahay Young modulus sare.',
          en: 'Due to huge Young\'s modulus, steel deforms only 4mm under substantial tension.',
        },
      },
    ],
    activities: [
      {
        id: 'act-p-3',
        activityNumber: 'አክቲቪቲ 3.1',
        title: {
          am: 'የሁክ ህግን (Hooke\'s Law) በስፕሪንግ መሞከር',
          om: 'Seera Hooke\'s Law ispiiriingii fayyadamuun qoradhaa',
          ti: 'ናይ ሁክ ሕጊ ብስፕሪንግ ምፍታን',
          ar: 'تحقيق قانون هوك عملياً وإيجاد ثابت صلابة النابض k',
          so: 'Tijaabinta xeerka Hooke',
          en: 'Empirical Verification of Hooke’s Law and Spring Constant Determination',
        },
        instruction: {
          am: 'ስፕሪንግ አንጠልጥላችሁ በየተራ 50g, 100g, 150g, 200g ክብደቶችን በማንጠልጠል የርዝመት ጭማሪውን e በሜትር ለኩ። F vs e ግራፍ ስሩ።',
          om: 'Ulfaatina dabalanii diriiruu isaa safaraa.',
          ti: 'ክብደት እናወሰኽኩም ምዕቃን ቀጽሉ።',
          ar: 'علق أثقالاً متدرجة وقس الاستطالة، ثم ارسم العلاقة البيانية بين القوة والاستطالة.',
          so: 'Cabbir dhererka kordhaaya.',
          en: 'Suspend graduated masses and record extension e, plotting Force vs Extension curve.',
        },
        groupTask: {
          am: 'የ F vs e ግራፉ ስሎፕ የስፕሪንጉን ጥንካሬ (Spring Constant k = ΔF / Δe) እንደሚሰጥ አረጋግጡ።',
          om: 'Slope = k ta\'uu mirkaneessaa.',
          ti: 'ስሎፕ = k ምዃኑ ኣረጋግጹ።',
          ar: 'أثبت أن ميل الخط المستقيم يمثل ثابت صلابة النابض k بوحدة نيوتن/متر.',
          so: 'Slope-ku waa k.',
          en: 'Confirm the slope of F-e graph yields the spring stiffness constant k in N/m.',
        },
        criticalThinkingQuestion: {
          am: 'ስፕሪንጉ ላይ ከመጠን በላይ በጣም ትልቅ ክብደት ብታንጠለጥሉበትና ወደ ቀድሞ ቦታው መመለስ ባይችል፣ ምን ተፈጠረ ይባላል? (Elastic limit አልፏል)',
          om: 'Ulfaatina guddaan yoo qabate maali ta\'a?',
          ti: 'ዓብዪ ክብደት እንተተንጠልጢሉ እንታይ ይኸውን?',
          ar: 'ماذا يحدث إذا تجاوز الثقل المعلق حد المرونة للنابض (Elastic Limit)؟',
          so: 'Maxaa dhacaya haddii culays weyn la saaro?',
          en: 'What mechanical threshold is exceeded when a spring permanently yields? (The Elastic Limit).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-p-3.1',
        exerciseNumber: 'የምዕራፍ 3 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'አንድ ሜትር ርዝመት ያለው ዱላ በመሀል ነጥቡ (50 cm) ላይ ተንጠልጥሏል። በግራ ጫፉ (0 cm ላይ) 20 N ክብደት ቢሰቀል፣ ዱላው ሚዛኑን እንዲጠብቅ በቀኝ በኩል በ 75 cm ምልክት ላይ ስንት ኒውተን መሰቀል አለበት?',
          om: 'Madaallii eeguuf humni meeqa barbaachisa?',
          ti: 'ሚዛኑ ንኽሕሉ ክንደይ ሓይሊ የድሊ?',
          ar: 'مسطرة متجانسة طولها 1 متر مرتكزة عند منتصفها (50 سم). عُلق ثقل مقداره 20 نيوتن عند الطرف الأيسر (علامة 0 سم). كم نيوتن يجب تعليقه عند علامة 75 سم لتحقيق الاتزان؟',
          so: 'Immisa Newton ayaa loo baahan yahay?',
          en: 'A 1m rule pivots at 50 cm. If 20 N hangs at 0 cm (distance 50 cm from pivot), what force at 75 cm (distance 25 cm from pivot) balances it?',
        },
        options: ['A. 10 N', 'B. 20 N', 'C. 40 N', 'D. 50 N'],
        correctAnswer: {
          am: 'C. 40 N — በሁለተኛው የሚዛን ህግ መሰረት፡ የግራ ቶርክ = የቀኝ ቶርክ ⇒ 20 N × 50 cm = F × 25 cm ⇒ 1000 = 25F ⇒ F = 40 N',
          om: 'C. 40 N',
          ti: 'C. 40 N',
          ar: 'C. 40 نيوتن (عزم الدوران الأيسر = الأيمن: 20 × 50 = F × 25 ومنه F = 40 نيوتن)',
          so: 'C. 40 N',
          en: 'C. 40 N — Equating moments: 20 N × 50 cm = F × 25 cm ⇒ F = 40 N.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የቶርክ ሚዛን ቀመር፡ Clockwise Torque = Counter-Clockwise Torque።',
            om: 'Στ = 0.',
            ti: 'Στ = 0።',
            ar: 'الخطوة 1: شرط الاتزان الدوراني: العزم مع عقارب الساعة = العزم ضد عقارب الساعة.',
            so: 'Στ = 0.',
            en: 'Step 1: Rotational equilibrium condition: Στ = 0.',
          },
          {
            am: 'ደረጃ 2፡ ርቀቶችን ከመሀል አስላ፡ የግራ ርቀት d₁ = 50 - 0 = 50 cm ፤ የቀኝ ርቀት d₂ = 75 - 50 = 25 cm።',
            om: 'd₁ = 50 cm, d₂ = 25 cm.',
            ti: 'd₁ = 50 cm, d₂ = 25 cm።',
            ar: 'الخطوة 2: احسب ذراع القوة عن نقطة الارتكاز: d₁ = 50 سم، d₂ = 25 سم.',
            so: 'd₁ = 50 cm, d₂ = 25 cm.',
            en: 'Step 2: Moment arms: d₁ = 50 cm, d₂ = 25 cm.',
          },
          {
            am: 'ደረጃ 3፡ አስላ፡ 20 N × 50 cm = F × 25 cm ⇒ 1000 = 25F ⇒ F = 40 N።',
            om: 'F = 1000 / 25 = 40 N.',
            ti: 'F = 40 N።',
            ar: 'الخطوة 3: 20 × 50 = 25F إذن F = 40 نيوتن.',
            so: 'F = 40 N.',
            en: 'Step 3: Solve: 1000 = 25F ⇒ F = 40 N.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ ቶርክን ስታሰሉ ሁልጊዜ ርቀቱን ከማዞሪያው ነጥብ (Pivot/Fulcrum) አንፃር በፐርፔንዲኩላር መስመር መለካት እንዳይረሳ።',
      om: 'Torque = F × d (d pivot irraa).',
      ti: 'ርሕቐት ካብቲ መዘወሪ ነጥቢ ምዕቃን ኣይትረስዑ።',
      ar: 'فائدة هندسية: ذراع القوة هو المسافة العمودية دائماً من نقطة الارتكاز إلى خط عمل القوة.',
      so: 'Masaafada perpendicular-ka ah ka cabbir fulcrum-ka.',
      en: 'Moment arm distance d must always be measured perpendicularly from the axis of rotation.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 4: STATIC AND CURRENT ELECTRICITY (pp. 91-150)
  // -----------------------------------------------------------
  {
    unitNumber: 4,
    title: {
      am: 'ምዕራፍ 4፡ እስቲቲክ እና ተንቀሳቃሽ ኤሌክትሪክ (Static & Current Electricity)',
      om: 'Boqonnaa 4: Saayinsii Elektiriikii (Electricity)',
      ti: 'ምዕራፍ 4፡ ኤሌክትሪክ',
      ar: 'الوحدة 4: الكهرباء الساكنة والتيار الكهربائي والدوائر (Electricity)',
      so: 'Cutubka 4: Korontada',
      en: 'Unit 4: Static and Current Electricity',
    },
    startPage: 91,
    endPage: 150,
    theoryContent: {
      am: `ምዕራፍ 4 የኤሌክትሪክ ክፍያዎችን፣ ሰርኪውቶችንና የደህንነት መርሆችን ያብራራል፦
4.1-4.4 ስታቲክ ኤሌክትሪክ፡ ሁለት ዓይነት ቻርጆች አሉ (ፖዘቲቭና ኔጌቲቭ)፤ ተመሳሳይ ቻርጆች ይገፋፋሉ፣ ተቃራኒዎች ይሳሳባሉ። የኤሌክትሮስኮፕ መሳሪያ ቻርጅን ለመመርመር ያገለግላል። የመብረቅ ፈሳሽ (Lightning Discharge) በደመናና በመሬት መካከል የሚፈጠር ግዙፍ የስፓርክ ፍሰት ነው።
4.5 የኩሎምብ ህግ (Coulomb\'s Law): F = k (|q₁ · q₂|) / r² (k = 9.0 × 10⁹ N·m²/C²)።
4.6 የኤሌክትሪክ መስክ (Electric Field): E = F / q = k · Q / r² (N/C ወይም V/m)።
4.7-4.8 ተንቀሳቃሽ ኤሌክትሪክና የኦህም ህግ፡ 
- ፍሰት (Current): I = Q / t (Amperes, 1 A = 1 C/s)
- ቮልቴጅ (Voltage): V = W / Q (Volts, 1 V = 1 J/C)
- የኦህም ህግ (Ohm\'s Law): V = I · R ፤ ሬዚስታንስ R = ρ · L / A
- የኤሌክትሪክ ጉልበትና ሃይል፡ P = V · I = I²R = V² / R (Watts) ፤ ፍጆታ E = P · t (kWh)።
4.9 የሬዚስተሮች ጥምረት፡
- በቅደም ተከተል (Series): R_eq = R₁ + R₂ + R₃ ፤ ፍሰቱ I በሁሉም ላይ እኩል ነው።
- በትይዩ (Parallel): 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ ፤ ቮልቴጁ V በሁሉም ላይ እኩል ነው።
4.10 ሜትሮች፡ አሚተር በሰሪስ (Series)፣ ቮልትሜትር በትይዩ (Parallel) ይሰካሉ።
4.11-4.12 የኤሌክትሪክ ደህንነት፡ ፊውዝ (Fuse)፣ ሰርኪውት ብሬከር (MCB) እና የከርድር ሽቦ (Earthing/Grounding) እሳትንና የኤሌክትሪክ ንዝረትን ይከላከላሉ።`,
      om: `Boqonnaa 4: Coulomb\'s law, Ohm\'s law V = IR, Series fi Parallel resistors, Power P = VI fi electrical safety ibsa.`,
      ti: `ምዕራፍ 4፡ ናይ ኩሎምብ ሕጊ፣ ናይ ኦህም ሕጊ፣ ሰሪስን ፓራላልን ሬዚስተራት፣ ሃይሊ P = VI።`,
      ar: `الوحدة 4: قانون كولوم، المجال الكهربائي، قانون أوم، توصيل المقاومات على التوالي والتوازي، القدرة الكهربائية وإجراءات السلامة.`,
      so: `Cutubka 4: Xeerka Coulomb, xeerka Ohm iyo isku xirka resistors.`,
      en: `Unit 4 covers Coulomb’s law, electric fields, Ohm’s law V = IR, series/parallel combinations, electrical power P = VI, and circuit safety.`,
    },
    examples: [
      {
        id: 'ex-p-4.1',
        exampleNumber: 'ምሳሌ 4.1 (Parallel Circuit & Power Consumption)',
        problemStatement: {
          am: 'ሁለት ሬዚስተሮች R₁ = 30 Ω እና R₂ = 60 Ω በትይዩ (Parallel) ተገናኝተው ከ V = 120 V የሃይል ምንጭ ጋር ተሰክተዋል። (a) አጠቃላይ ሬዚስታንስ R_eq ስንት ነው? (b) ከባትሪው የሚወጣው ጠቅላላ ፍሰት I_total ስንት ነው? (c) ጠቅላላ የሚባክነው ሃይል P በዋት ስንት ነው?',
          om: 'R₁ = 30Ω fi R₂ = 60Ω parallel ta\'anii V = 120V qabu. R_eq, I_total fi P shallagaa.',
          ti: 'R₁ = 30Ω ን R₂ = 60Ω ን parallel ተተሓሒዞም V = 120V እንተሃልዩዎም R_eq, I_total, P ድለዩ።',
          ar: 'مقاومتان R₁ = 30 أوم و R₂ = 60 أوم موصلتان على التوازي مع مصدر جهد V = 120 فولت. احسب: (أ) المقاومة المكافئة، (ب) التيار الكلي، (ج) القدرة الكهربائية الكلية المستهلكة.',
          so: 'R₁ = 30Ω, R₂ = 60Ω parallel, V = 120V. Soo hel R_eq, I, P.',
          en: 'Resistors R₁ = 30 Ω and R₂ = 60 Ω are connected in parallel across 120 V. Calculate: (a) equivalent resistance R_eq, (b) total current I, (c) total electrical power P.',
        },
        given: ['R₁ = 30 Ω', 'R₂ = 60 Ω', 'V = 120 V'],
        formula: '1/R_eq = 1/R₁ + 1/R₂ ፤ I = V / R_eq ፤ P = V · I',
        calculationSteps: [
          {
            am: 'ደረጃ 1 (R_eq)፡ 1/R_eq = 1/30 + 1/60 = (2 + 1)/60 = 3/60 = 1/20 ⇒ R_eq = 20 Ω።',
            om: 'Tarkaanfii 1: R_eq = 20 Ω.',
            ti: 'ደረጃ 1፡ R_eq = 20 Ω።',
            ar: 'الخطوة 1: 1/R_eq = 1/30 + 1/60 = 3/60 ومنه المقاومة المكافئة R_eq = 20 أوم.',
            so: 'Tallaabada 1: R_eq = 20 Ω.',
            en: 'Step 1: Equivalent resistance: 1/R_eq = 1/30 + 1/60 = 3/60 ⇒ R_eq = 20 Ω.',
          },
          {
            am: 'ደረጃ 2 (Current)፡ በኦህም ህግ መሰረት I = V / R_eq = 120 V / 20 Ω = 6.0 A።',
            om: 'Tarkaanfii 2: I = 120 / 20 = 6 A.',
            ti: 'ደረጃ 2፡ I = 6 A።',
            ar: 'الخطوة 2: شدة التيار الكلي I = V / R_eq = 120 / 20 = 6.0 أمبير.',
            so: 'Tallaabada 2: I = 6.0 A.',
            en: 'Step 2: Total current: I = V / R_eq = 120 / 20 = 6.0 A.',
          },
          {
            am: 'ደረጃ 3 (Power)፡ P = V · I = 120 V × 6.0 A = 720 W (ወይም P = V²/R = 14400 / 20 = 720 W)።',
            om: 'Tarkaanfii 3: P = 120 × 6 = 720 Watt.',
            ti: 'ደረጃ 3፡ P = 720 ዋት።',
            ar: 'الخطوة 3: القدرة الكلية P = V × I = 120 × 6 = 720 واط.',
            so: 'Tallaabada 3: P = 720 W.',
            en: 'Step 3: Total power: P = V · I = 120 × 6.0 = 720 W.',
          },
        ],
        finalAnswer: {
          am: 'R_eq = 20 Ω ፤ I_total = 6.0 A ፤ P_total = 720 W',
          om: 'R_eq = 20 Ω; I = 6.0 A; P = 720 W',
          ti: 'R_eq = 20 Ω፤ I = 6.0 A፤ P = 720 W',
          ar: 'المقاومة المكافئة R_eq = 20 أوم؛ التيار الكلي = 6.0 أمبير؛ القدرة الكلية = 720 واط',
          so: 'R_eq = 20 Ω, I = 6.0 A, P = 720 W',
          en: 'R_eq = 20 Ω; I_total = 6.0 A; P_total = 720 W',
        },
        pedagogicalNote: {
          am: 'በትይዩ ጥምረት አጠቃላይ ሬዚስታንሱ (20 Ω) ከየትኛውም ነጠላ ሬዚስተር (30 Ω እና 60 Ω) ያንሳል!',
          om: 'Parallel keessatti R_eq yeroo hunda xiqqaa ta\'a.',
          ti: 'ኣብ ፓራላል R_eq ኩሉ ግዜ ካብቶም ነጠላ ይንእስ።',
          ar: 'قاعدة في التوازي: المقاومة المكافئة تكون دائماً أصغر من أصغر مقاومة في الدائرة.',
          so: 'R_eq parallel had iyo jeer waa ka yar yahay kan ugu yar.',
          en: 'In parallel circuits, equivalent resistance is strictly less than the smallest branch resistance.',
        },
      },
    ],
    activities: [
      {
        id: 'act-p-4',
        activityNumber: 'አክቲቪቲ 4.1',
        title: {
          am: 'የኦህም ህግን በላቦራቶሪ ሰርኪውት ማረጋገጥ',
          om: 'Seera Ohm\'s Law laabooratoorii keessatti mirkaneessaa',
          ti: 'ናይ ኦህም ሕጊ ኣብ ላቦራቶሪ ምርግጋጽ',
          ar: 'التحقيق المعملي لقانون أوم ورسم العلاقة بين فرق الجهد وشدة التيار (V-I)',
          so: 'Xaqiijinta xeerka Ohm ee shaybaarka',
          en: 'Laboratory Verification of Ohm’s Law and Plotting the I-V Characteristic Curve',
        },
        instruction: {
          am: 'ባትሪ፣ ሬኦስታት (ተለዋዋጭ ሬዚስተር)፣ አሚተርና ቮልትሜትር በማገናኘት ቮልቴጁን በየደረጃው እየቀያየራችሁ ፍሰቱን መዝግቡ።',
          om: 'Voltmeter fi Ammeter fayyadamuun V fi I galmeessaa.',
          ti: 'ብ ቮልትሜተርን ኣሚተርን ጌርኩም V ን I ን መዝግቡ።',
          ar: 'صل الدائرة وسجل قراءات فرق الجهد والتيار عند تغيير موضع المقاومة المتغيرة، وارسم منحنى V مقابل I.',
          so: 'Diiwaangeli akhriska V iyo I.',
          en: 'Vary voltage using rheostat, recording corresponding ammeter and voltmeter readings.',
        },
        groupTask: {
          am: 'የ V vs I ግራፍ ቀጥተኛ መስመር መሆኑን እና የስሎፑ ዋጋ የመቋቋሚያውን ሬዚስታንስ (R = ΔV / ΔI) እንደሚሰጥ አረጋግጡ።',
          om: 'Slope = R ta\'uu mirkaneessaa.',
          ti: 'ስሎፕ = R ምዃኑ ኣረጋግጹ።',
          ar: 'أثبت أن المنحنى خط مستقيم يمر بالأصل، وأن ميله يمثل قيمة المقاومة R.',
          so: 'Xaqiiji in slope = R.',
          en: 'Confirm linearity of I-V plot and that slope ΔV/ΔI yields resistance R in Ohms.',
        },
        criticalThinkingQuestion: {
          am: 'የኤሌክትሪክ አምፑል (Bulb) ቴምፕሬቸሩ ሲጨምር የ V vs I ግራፉ ቀጥተኛ መስመር ሆኖ ይቀጥላል ወይስ ይጣመማል? (ቴምፕሬቸር ሲጨምር ሬዚስታንስ ስለሚጨምር ይጣመማል፤ Non-ohmic ነው)',
          om: 'Bulb non-ohmic maaliif ta\'e?',
          ti: 'አምፑል non-ohmic ስለምንታይ ይኸውን?',
          ar: 'لماذا ينحني منحنى V-I لمصباح الفتيل عند زيادة شدة الإضاءة؟ (لأنه غير أومي وتزداد مقاومته بارتفاع الحرارة).',
          so: 'Maxay noqonaysaa marka heerkulku kordho?',
          en: 'Why does a tungsten filament lamp display a non-linear I-V curve? (Resistance rises with temperature; non-ohmic).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-p-4.1',
        exerciseNumber: 'የምዕራፍ 4 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'በ 220 V መስመር ላይ የሚሰራ 1000 W የኤሌክትሪክ ምድጃ በ 2 ሰአት ውስጥ ስንት ኪሎዋት ሰአት (kWh) ሃይል ይጠቀማል?',
          om: 'P = 1000W sa\'aatii 2f yoo hojjete kWh meeqa?',
          ti: '1000 W ን 2 ሰዓት እንተሰሪሑ ክንደይ kWh ይወስድ?',
          ar: 'فرن كهربائي قدرته 1000 واط يعمل على جهد 220 فولت لمدة ساعتين. ما هي الطاقة المستهلكة بوحدة كيلوواط-ساعة (kWh)؟',
          so: '1000 W muddo 2 saacadood ah, waa maxay kWh?',
          en: 'A 1000 W electric heater operates for 2 hours on a 220 V supply. How much energy does it consume in kilowatt-hours (kWh)?',
        },
        options: ['A. 1 kWh', 'B. 2 kWh', 'C. 2000 kWh', 'D. 0.5 kWh'],
        correctAnswer: {
          am: 'B. 2 kWh — ጉልበት E = P × t = (1000 W / 1000) kW × 2 h = 1 kW × 2 h = 2 kWh',
          om: 'B. 2 kWh',
          ti: 'B. 2 kWh',
          ar: 'B. 2 كيلوواط-ساعة (E = 1 كيلوواط × 2 ساعة = 2 kWh)',
          so: 'B. 2 kWh',
          en: 'B. 2 kWh — Energy E = P × t = 1 kW × 2 h = 2 kWh.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ ዋትን ወደ ኪሎዋት ቀይር፡ P = 1000 W = 1.0 kW።',
            om: 'P = 1 kW.',
            ti: 'P = 1 kW።',
            ar: 'الخطوة 1: حول الواط إلى كيلوواط: P = 1000 / 1000 = 1 كيلوواط.',
            so: 'P = 1 kW.',
            en: 'Step 1: Convert watts to kilowatts: P = 1000 W = 1.0 kW.',
          },
          {
            am: 'ደረጃ 2፡ በሰአታት አባዛ፡ E = P × t = 1.0 kW × 2.0 h = 2.0 kWh።',
            om: 'E = 1 kW × 2 h = 2 kWh.',
            ti: 'E = 2 kWh።',
            ar: 'الخطوة 2: اضرب في الزمن بالساعات: E = 1 × 2 = 2 kWh.',
            so: 'E = 2 kWh.',
            en: 'Step 2: Multiply by hours: E = 1.0 kW × 2.0 h = 2.0 kWh.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU) የቤት ውስጥ ታሪፍ በኪሎዋት ሰአት (kWh) የሚለካ ሲሆን፣ 1 kWh = 1,000 W × 3,600 s = 3,600,000 ጆውል (3.6 MJ) ነው።',
      om: '1 kWh = 3.6 × 10⁶ Joules.',
      ti: '1 kWh = 3.6 × 10⁶ ጆውል እዩ።',
      ar: 'معلومة هامة: 1 كيلوواط-ساعة يعادل تماماً 3,600,000 جول (3.6 ميغاجول) من الطاقة الكهربائية.',
      so: '1 kWh = 3.6 MJ.',
      en: 'Commercial energy metric: 1 kWh = 1000W × 3600s = 3.6 × 10⁶ Joules (3.6 MJ).',
    },
  },

  // -----------------------------------------------------------
  // UNIT 5: MAGNETISM (pp. 151-180)
  // -----------------------------------------------------------
  {
    unitNumber: 5,
    title: {
      am: 'ምዕራፍ 5፡ ማግኔቲዝም (Magnetism)',
      om: 'Boqonnaa 5: Maagneetizimii (Magnetism)',
      ti: 'ምዕራፍ 5፡ ማግኔቲዝም',
      ar: 'الوحدة 5: المغناطيسية والمجالات الكهرومغناطيسية (Magnetism)',
      so: 'Cutubka 5: Maagnetism',
      en: 'Unit 5: Magnetism',
    },
    startPage: 151,
    endPage: 180,
    theoryContent: {
      am: `ምዕራፍ 5 የተፈጥሮ ማግኔቶችን፣ የኤሌክትሮማግኔት ህጎችንና የሎረንትዝ ሃይልን ይተነትናል፦
5.1 ማግኔት፡ ሰሜንና ደቡብ ፖሎች አሉት፤ ነጠላ ፖል (Monopole) በተፈጥሮ አይገኝም። የዶሜይን ቲዎሪ (Domain Theory) የፌሮማግኔቲክ ቁሳቁሶችን ባህሪ ያብራራል።
5.2 ማግኔቲክ ፊልድ (Magnetic Field B⃗): ከሰሜን ፖል ወጥተው ወደ ደቡብ ፖል የሚገቡ ዝግ መስመሮች ናቸው። መስመሮቹ ፈጽሞ አይቆራረጡም።
5.3 የመሬት ማግኔቲክ ፊልድ፡ መሬት እንደ ግዙፍ ማግኔት ታገለግላለች፤ ኮምፓስ በጂኦማግኔቲክ መስመሮች አማካኝነት አቅጣጫን ያሳያል።
5.4 የኤሌክትሪክ ፍሰት ማግኔቲክ ፊልድ (Oersted\'s Discovery):
- ቀጥተኛ ሽቦ፡ B = (μ₀ · I) / (2π · r) (በቀኝ እጅ ህግ - Right Hand Grip Rule ይወሰናል)
- ሶሌኖይድ (Solenoid): B = μ₀ · n · I (የኤሌክትሮማግኔት ጥንካሬ በኮር፣ ፍሰትና ጥቅል ብዛት ይጨምራል)።
5.5 በንቅናቄ ላይ ባለ ቻርጅ ላይ የሚያርፍ ሃይል (Lorentz Force): F = q · v · B · sin θ (ፍሌሚንግ ግራ እጅ ህግ - Fleming\'s Left Hand Rule)።
5.6 በሽቦ ላይ የሚያርፍ ማግኔቲክ ሃይል፡ F = B · I · L · sin θ (የኤሌክትሪክ ሞተር መሰረት)።
5.7 በሁለት ትይዩ ሽቦዎች መካከል ያለ ሃይል፡ F / L = (μ₀ · I₁ · I₂) / (2π · d)። በተመሳሳይ አቅጣጫ የሚፈሱ ይሳሳባሉ፤ በተቃራኒ የሚፈሱ ይገፋፋሉ።
5.8 ተግባራዊ አተገባበር፡ የዲሲ ሞተር፣ ድምጽ ማጉያ (Loudspeaker)፣ የኤሌክትሪክ ደወል እና የባቡር ማግሌቭ (Maglev)።`,
      om: `Boqonnaa 5: Magnetic field lines, Lorentz force F = qvB sin θ, Motor effect F = BIL sin θ fi DC motors ibsa.`,
      ti: `ምዕራፍ 5፡ ማግኔቲክ ፊልድ፣ ናይ ሎረንትዝ ሓይሊ F = qvB sin θ፣ ሞተር ኤፌክት F = BIL sin θ።`,
      ar: `الوحدة 5: الأقطاب المغناطيسية، تجربة أورستد، قوة لورنتز F = qvB sin θ، القوة المغناطيسية على سلك F = BIL sin θ وتطبيقات المحرك الكهربائي.`,
      so: `Cutubka 5: Xeerarka magnetic field iyo xoogga Lorentz.`,
      en: `Unit 5 covers magnetic fields, Oersted’s discovery, Lorentz force F = qvB sin θ, magnetic force on wires F = BIL sin θ, and DC motor applications.`,
    },
    examples: [
      {
        id: 'ex-p-5.1',
        exampleNumber: 'ምሳሌ 5.1 (Magnetic Force on a Current-Carrying Wire)',
        problemStatement: {
          am: 'ርዝመቱ L = 0.5 m የሆነ ሽቦ I = 4.0 A ፍሰት ተሸክሞ በ B = 0.2 T ዩኒፎርም ማግኔቲክ ፊልድ ውስጥ በ 90° ማዕዘን ተቀምጧል። በሽቦው ላይ የሚያርፈውን ማግኔቲክ ሃይል F አስሉ።',
          om: 'L = 0.5m, I = 4.0A, B = 0.2T fi θ = 90° yoo ta\'e, humna F shallagaa.',
          ti: 'L = 0.5m, I = 4.0A, B = 0.2T ብ 90° እንተሃልዩ ሓይሊ F ድለዩ።',
          ar: 'سلك مستقيم طوله L = 0.5 م يحمل تياراً كهربائياً I = 4.0 أمبير وموضوع عمودياً (θ = 90°) داخل مجال مغناطيسي منتظم B = 0.2 تسلا. احسب القوة المغناطيسية المؤثرة عليه.',
          so: 'Soo hel F haddii L = 0.5m, I = 4A, B = 0.2T.',
          en: 'A straight wire of length 0.5m carries a 4.0 A current perpendicular (θ = 90°) to a uniform 0.2 T magnetic field. Calculate the magnetic force F.',
        },
        given: ['L = 0.5 m', 'I = 4.0 A', 'B = 0.2 T', 'θ = 90° (sin 90° = 1)'],
        formula: 'F = B · I · L · sin θ',
        calculationSteps: [
          {
            am: 'ደረጃ 1፡ ቀመሩን ጻፍ፡ F = B · I · L · sin(90°) = B · I · L × 1።',
            om: 'Tarkaanfii 1: F = B · I · L.',
            ti: 'ደረጃ 1፡ F = B · I · L።',
            ar: 'الخطوة 1: بما أن السلك عمودي، فإن sin(90°) = 1: F = B · I · L.',
            so: 'Tallaabada 1: F = B · I · L.',
            en: 'Step 1: Formula for perpendicular field: F = B · I · L.',
          },
          {
            am: 'ደረጃ 2፡ ቁጥሮቹን አስገባ፡ F = 0.2 T × 4.0 A × 0.5 m = 0.8 × 0.5 = 0.4 N።',
            om: 'Tarkaanfii 2: F = 0.2 × 4.0 × 0.5 = 0.4 N.',
            ti: 'ደረጃ 2፡ F = 0.4 N።',
            ar: 'الخطوة 2: F = 0.2 × 4.0 × 0.5 = 0.4 نيوتن.',
            so: 'Tallaabada 2: F = 0.4 N.',
            en: 'Step 2: Multiply: F = 0.2 × 4.0 × 0.5 = 0.4 N.',
          },
        ],
        finalAnswer: {
          am: 'ማግኔቲክ ሃይል F = 0.4 N (በፍሌሚንግ ግራ እጅ ህግ የሚመራ)',
          om: 'F = 0.4 N',
          ti: 'F = 0.4 N',
          ar: 'القوة المغناطيسية المؤثرة F = 0.4 نيوتن',
          so: 'F = 0.4 N',
          en: 'Magnetic force F = 0.4 N (directed via Fleming’s Left-Hand Rule)',
        },
        pedagogicalNote: {
          am: 'ሽቦው ከማግኔቲክ ፊልዱ ጋር ትይዩ (θ = 0°) ቢሆን ኖሮ ሃይሉ ዜሮ (sin 0° = 0) ይሆን ነበር!',
          om: 'Parallel yoo ta\'e F = 0.',
          ti: 'ትይዩ እንተኾይኑ F = 0 ይኸውን።',
          ar: 'إذا كان السلك موازياً للمجال المغناطيسي فإن القوة تكون صفراً تماماً لأن sin(0°) = 0.',
          so: 'Haddii ay parallel yihiin F = 0.',
          en: 'If the wire runs parallel to field lines (θ = 0°), magnetic force vanishes identically.',
        },
      },
    ],
    activities: [
      {
        id: 'act-p-5',
        activityNumber: 'አክቲቪቲ 5.1',
        title: {
          am: 'የቀላል ዲሲ ሞተር (Simple DC Motor) መስራት',
          om: 'DC Motor salphaa hojjedhaa',
          ti: 'ቀሊል ዲሲ ሞተር ምስራሕ',
          ar: 'صنع نموذج مصغر لمحرك كهربائي بسيط يعمل بالتيار المستمر (Simple DC Motor)',
          so: 'Samaynta DC motor fudud',
          en: 'Constructing a Functional Homopolar / DC Electric Motor from Copper Wire and Neodymium Magnets',
        },
        instruction: {
          am: 'የመዳብ ሽቦን በመጠቅለል ጥቅል (Coil) ስሩ፤ ጫፎቹን ገርፋችሁ ከ 1.5V ባትሪና ከኒዮዲሚየም ማግኔት ጋር በማገናኘት ማሽከርከር ጀምሩ።',
          om: 'Shiboo kobreer fi maagneetii fayyadamuun motor hojjedhaa.',
          ti: 'ብናይ ነሓሲ ሽቦን ማግኔትን ጌርኩም ሞተር ስርሑ።',
          ar: 'لف سلكاً نحاسياً معزولاً لتكوين ملف، وثبته فوق بطارية 1.5 فولت مع مغناطيس نيوديميوم قوي ولاحظ دورانه.',
          so: 'Isku xir naxaas iyo magnet si aad u samayso motor.',
          en: 'Wind enameled copper coil and balance over 1.5V cell with neodymium magnet to observe continuous rotation.',
        },
        groupTask: {
          am: 'የሞተሩ የማሽከርከር አቅጣጫ በፍሌሚንግ ግራ እጅ ህግ መሰረት የፍሰት ወይም የማግኔት ፖል ሲቀየር እንደሚገለበጥ አረጋግጡ።',
          om: 'Kallattii naanna\'uu qoradhaa.',
          ti: 'ኣንፈት ምዝዋር መርምሩ።',
          ar: 'أثبت أن عكس قطبية البطارية أو المغناطيس يعكس اتجاه دوران المحرك.',
          so: 'Xaqiiji wareega.',
          en: 'Demonstrate that reversing current or magnetic polarity reverses the shaft spin direction.',
        },
        criticalThinkingQuestion: {
          am: 'በዲሲ ሞተር ውስጥ ኮምዩቴተር (Split-ring Commutator) ባይኖር ኖሮ ሞተሩ ያለማቋረጥ ሊሽከረከር ይችል ነበር? ለምን? (በየግማሽ ዙሩ ይቆም ነበር)',
          om: 'Commutator yoo hin jiraanne maali ta\'a?',
          ti: 'ኮምዩቴተር እንተዘይህሉ እንታይ ምኾነ?',
          ar: 'ما وظيفة عاكس التيار (Commutator)؟ ولماذا لا يستمر المحرك في الدوران بدونه؟',
          so: 'Waa maxay shaqada commutator-ku?',
          en: 'Why is a split-ring commutator essential to reverse current every half-turn for continuous unidirectional torque?',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-p-5.1',
        exerciseNumber: 'የምዕራፍ 5 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'ቻርጁ q = 2.0 × 10⁻⁶ C የሆነ ቅንጣት በ v = 5.0 × 10⁵ m/s ፍጥነት በ B = 0.4 T ማግኔቲክ ፊልድ ውስጥ በ 90° ቢጓዝ፣ የሚያርፍበት የሎረንትዝ ሃይል ስንት ኒውተን ነው?',
          om: 'q = 2μC, v = 5×10⁵ m/s, B = 0.4T yoo ta\'e F meeqa?',
          ti: 'q = 2μC, v = 5×10⁵ m/s, B = 0.4T እንተኾይኑ F ክንደይ እዩ?',
          ar: 'شحنة نقطية مقدارها 2.0 ميكروكولوم تتحرك بسرعة 5.0 × 10⁵ م/ث عمودياً داخل مجال مغناطيسي قدره 0.4 تسلا. احسب القوة المغناطيسية المؤثرة عليها.',
          so: 'Waa maxay F haddii q = 2μC, v = 5×10⁵ m/s, B = 0.4T?',
          en: 'A charge of q = 2.0 μC moves at v = 5.0 × 10⁵ m/s perpendicular to B = 0.4 T. What is the magnetic force F?',
        },
        options: ['A. 0.2 N', 'B. 0.4 N', 'C. 4.0 N', 'D. 0.04 N'],
        correctAnswer: {
          am: 'B. 0.4 N — በሎረንትዝ ሃይል ቀመር መሰረት F = qvB = (2.0 × 10⁻⁶ C) × (5.0 × 10⁵ m/s) × 0.4 T = 1.0 × 0.4 = 0.4 N',
          om: 'B. 0.4 N',
          ti: 'B. 0.4 N',
          ar: 'B. 0.4 نيوتن (F = qvB = 2.0×10⁻⁶ × 5.0×10⁵ × 0.4 = 0.4 نيوتن)',
          so: 'B. 0.4 N',
          en: 'B. 0.4 N — Lorentz force: F = qvB = (2.0 × 10⁻⁶) × (5.0 × 10⁵) × 0.4 = 0.4 N.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የሎረንትዝ ሃይል ቀመር፡ F = q · v · B · sin(90°) = qvB።',
            om: 'F = qvB.',
            ti: 'F = qvB።',
            ar: 'الخطوة 1: قانون قوة لورنتز: F = qvB.',
            so: 'F = qvB.',
            en: 'Step 1: Lorentz equation: F = q · v · B.',
          },
          {
            am: 'ደረጃ 2፡ አስላ፡ F = (2.0 × 10⁻⁶ C) × (5.0 × 10⁵ m/s) × (0.4 T) = 1.0 × 0.4 = 0.4 N።',
            om: 'F = 0.4 N.',
            ti: 'F = 0.4 N።',
            ar: 'الخطوة 2: F = 1.0 × 0.4 = 0.4 نيوتن.',
            so: 'F = 0.4 N.',
            en: 'Step 2: Multiply: F = 1.0 × 0.4 = 0.4 N.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የሎረንትዝ ማግኔቲክ ሃይል ሁልጊዜ ከፍጥነቱ v ጋር ፐርፔንዲኩላር ስለሆነ በቅንጣቱ ላይ ምንም ስራ (Work done = 0) አይሰራም፤ የፍጥነቱን አቅጣጫ ብቻ በመቀየር ክብ እንቅስቃሴ (Circular motion) ያደርገዋል።',
      om: 'Magnetic force work hin hojjetu (W = 0).',
      ti: 'ማግኔቲክ ሓይሊ ስራሕ ኣይሰርሕን (W = 0)።',
      ar: 'معلومة فيزيائية أساسية: القوة المغناطيسية لا تبذل شغلاً على الشحنة (W = 0) لأنها عمودية دائماً على اتجاه الإزاحة، فتغير اتجاه الحركة دون تغيير مقدار السرعة.',
      so: 'Xoogga magnetic shaqo ma qabto.',
      en: 'Because magnetic force is always perpendicular to velocity, it performs zero mechanical work (W = 0), altering trajectory without altering kinetic energy.',
    },
  },

  // -----------------------------------------------------------
  // UNIT 6: ELECTROMAGNETIC WAVES & GEOMETRICAL OPTICS (pp. 181-220)
  // -----------------------------------------------------------
  {
    unitNumber: 6,
    title: {
      am: 'ምዕራፍ 6፡ ኤሌክትሮማግኔቲክ ሞገዶች እና ኦፕቲክስ (Electromagnetic Waves & Optics)',
      om: 'Boqonnaa 6: Dambalii Elektiroomaagneetikii fi Optiksii',
      ti: 'ምዕራፍ 6፡ ኤሌክትሮማግኔቲክ ሞገዳትን ኦፕቲክስን',
      ar: 'الوحدة 6: الموجات الكهرومغناطيسية والبصريات الهندسية (EM Waves & Optics)',
      so: 'Cutubka 6: Mawjadaha EM iyo Optics',
      en: 'Unit 6: Electromagnetic Waves and Geometrical Optics',
    },
    startPage: 181,
    endPage: 220,
    theoryContent: {
      am: `ምዕራፍ 6 የብርሃንና የሞገድ ባህሪያትን፣ መስተዋቶችንና ሌንሶችን ይተነትናል፦
6.1 የኤሌክትሮማግኔቲክ ስፔክትረም፡ ኤሌክትሮማግኔቲክ ሞገዶች በቫኪዩም ውስጥ በ c = 3.0 × 10⁸ m/s ፍጥነት ይጓዛሉ። የሞገድ ፍጥነት c = f · λ። ከረጅም ሞገድ ወደ አጭር፡ ሬዲዮ → ማይክሮዌቭ → ኢንፍራሬድ → የሚታይ ብርሃን → አልትራቫዮሌት → ኤክስ-ሬይ → ጋማ ሬይ።
6.2 የብርሃን ነፀብራቅና ሜዳ መስተዋት፡ 
- የነፀብራቅ ህግ (Law of Reflection)፡ የወደቀው ማዕዘን ከነፀበረቀው ማዕዘን ጋር እኩል ነው (θ_i = θ_r)።
- ሜዳ መስተዋት (Plane Mirror)፡ ምናባዊ (Virtual)፣ ቀጥ ያለ (Upright)፣ እኩል መጠን ያለውና ግራና ቀኝ የተገለበጠ (Laterally inverted) ምስል ይሰጣል።
6.3 ስፌሪካል መስተዋቶች (Spherical Mirrors):
- ኮንኬቭ (Concave - Converging) እና ኮንቬክስ (Convex - Diverging)።
- የመስተዋት ቀመር (Mirror Equation): 1/f = 1/d_o + 1/d_i ፤ ማጉላት (Magnification): m = -d_i / d_o = h_i / h_o (ፎካል ርዝመት f = R/2)።
6.4 የብርሃን ስብራት (Refraction) እና የሲኔል ህግ (Snell\'s Law):
- የብርሃን ስብራት ኢንዴክስ፡ n = c / v
- የሲኔል ህግ፡ n₁ · sin θ₁ = n₂ · sin θ₂
- ወሳኝ ማዕዘንና ሙሉ ውስጣዊ ነፀብራቅ (Total Internal Reflection - TIR)፡ sin θ_c = n₂ / n₁ (የፋይበር ኦፕቲክስ መሰረት)።
6.5 ቀጫጭን ሌንሶች (Thin Lenses) እና የኦፕቲክስ መሳሪያዎች፡
- የሌንስ ቀመር፡ 1/f = 1/d_o + 1/d_i
- ኮንቬክስ ሌንስ (Converging) ምስልን ያጎላል፤ ኮንኬቭ ሌንስ (Diverging) ምንጊዜም ምናባዊና አነስተኛ ምስል ይሰጣል።
- የኦፕቲክስ መሳሪያዎች፡ ማይክሮስኮፕ፣ ቴሌስኮፕ እና የሰው ልጅ ዓይን (የማየት እክሎች፡ Myopia በኮንኬቭ ሌንስ፣ Hyperopia በኮንቬክስ ሌንስ ይታረማሉ)።`,
      om: `Boqonnaa 6: EM spectrum c = fλ, Reflection, Mirrors 1/f = 1/d_o + 1/d_i, Snell\'s law n₁ sin θ₁ = n₂ sin θ₂, Lenses fi Optical instruments ibsa.`,
      ti: `ምዕራፍ 6፡ ናይ ብርሃን ነጸብራቕ፣ ሲኔል ሕጊ፣ መስትያት፣ ሌንስን ማይክሮስኮፕን።`,
      ar: `الوحدة 6: الطيف الكهرومغناطيسي c = fλ، قوانين الانعكاس، المرايا الكروية، الانكسار وقانون سنل، الانعكاس الكلي الداخلي في الألياف الضوئية، والعدسات والأجهزة البصرية.`,
      so: `Cutubka 6: Xeerarka iftiinka, muraayadaha iyo lenses.`,
      en: `Unit 6 covers EM spectrum c = fλ, reflection, spherical mirror equation, refraction & Snell’s law, total internal reflection, thin lenses, and optical instruments.`,
    },
    examples: [
      {
        id: 'ex-p-6.1',
        exampleNumber: 'ምሳሌ 6.1 (Snell\'s Law & Critical Angle)',
        problemStatement: {
          am: 'ብርሃን ከውሃ (n₁ = 1.33) ወደ አየር (n₂ = 1.00) ሲወጣ ወሳኝ ማዕዘኑ (Critical Angle θ_c) ስንት ነው? የብርሃን መግቢያ ማዕዘን θ₁ = 30° ቢሆን፣ የስብራት ማዕዘኑ θ₂ ስንት ይሆናል?',
          om: 'n₁ = 1.33 fi n₂ = 1.00 yoo ta\'an, Critical Angle θ_c fi θ₂ shallagaa.',
          ti: 'n₁ = 1.33 ናብ n₂ = 1.00 ክወጽእ ከሎ θ_c ን θ₂ ን ድለዩ።',
          ar: 'ينتقل شعاع ضوئي من الماء (n₁ = 1.33) إلى الهواء (n₂ = 1.00). احسب: (أ) الزاوية الحرجة θ_c، (ب) زاوية الانكسار θ₂ إذا كانت زاوية السقوط θ₁ = 30°.',
          so: 'Soo hel θ_c iyo θ₂ haddii n₁ = 1.33, n₂ = 1.00.',
          en: 'Light passes from water (n₁ = 1.33) into air (n₂ = 1.00). Determine: (a) critical angle θ_c, (b) angle of refraction θ₂ for incidence angle θ₁ = 30°.',
        },
        given: ['n₁ = 1.33 (ውሃ)', 'n₂ = 1.00 (አየር)', 'θ₁ = 30° (sin 30° = 0.5)'],
        formula: 'sin θ_c = n₂ / n₁ ፤ n₁ · sin θ₁ = n₂ · sin θ₂',
        calculationSteps: [
          {
            am: 'ደረጃ 1 (Critical Angle)፡ sin θ_c = 1.00 / 1.33 = 0.7519 ⇒ θ_c = arcsin(0.7519) ≈ 48.75°።',
            om: 'Tarkaanfii 1: sin θ_c = 1.00 / 1.33 = 0.7519 ⇒ θ_c ≈ 48.8°.',
            ti: 'ደረጃ 1፡ θ_c ≈ 48.8°።',
            ar: 'الخطوة 1: الزاوية الحرجة: sin θ_c = 1.00 / 1.33 = 0.7519 ومنه θ_c ≈ 48.75°.',
            so: 'Tallaabada 1: θ_c ≈ 48.8°.',
            en: 'Step 1: Critical angle: sin θ_c = 1.00 / 1.33 = 0.7519 ⇒ θ_c = arcsin(0.7519) ≈ 48.75°.',
          },
          {
            am: 'ደረጃ 2 (Refraction Angle)፡ በሲኔል ህግ መሰረት፡ n₁ sin θ₁ = n₂ sin θ₂ ⇒ 1.33 × sin(30°) = 1.00 × sin θ₂ ⇒ 1.33 × 0.5 = sin θ₂ ⇒ sin θ₂ = 0.665።',
            om: 'Tarkaanfii 2: sin θ₂ = 1.33 × 0.5 = 0.665.',
            ti: 'ደረጃ 2፡ sin θ₂ = 0.665።',
            ar: 'الخطوة 2: طبق قانون سنل: 1.33 × sin(30°) = 1.00 × sin θ₂ ومنه sin θ₂ = 0.665.',
            so: 'Tallaabada 2: sin θ₂ = 0.665.',
            en: 'Step 2: Apply Snell\'s Law: 1.33 sin(30°) = 1.00 sin θ₂ ⇒ sin θ₂ = 0.665.',
          },
          {
            am: 'ደረጃ 3፡ ስሌት፡ θ₂ = arcsin(0.665) ≈ 41.68° ወደ አየር ሲገባ ከመደበኛ መስመሩ ይርቃል (Bends away from normal)።',
            om: 'Tarkaanfii 3: θ₂ ≈ 41.7°.',
            ti: 'ደረጃ 3፡ θ₂ ≈ 41.7°።',
            ar: 'الخطوة 3: زاوية الانكسار θ₂ = arcsin(0.665) ≈ 41.7° (ينكسر مبتعداً عن العمود المقام).',
            so: 'Tallaabada 3: θ₂ ≈ 41.7°.',
            en: 'Step 3: Solve for angle: θ₂ = arcsin(0.665) ≈ 41.68° (bends away from normal).',
          },
        ],
        finalAnswer: {
          am: 'ወሳኝ ማዕዘን θ_c ≈ 48.75° ፤ የስብራት ማዕዘን θ₂ ≈ 41.68°',
          om: 'θ_c ≈ 48.8°; θ₂ ≈ 41.7°',
          ti: 'θ_c ≈ 48.8°፤ θ₂ ≈ 41.7°',
          ar: 'الزاوية الحرجة θ_c ≈ 48.75°؛ زاوية الانكسار θ₂ ≈ 41.68°',
          so: 'θ_c ≈ 48.8°, θ₂ ≈ 41.7°',
          en: 'Critical angle θ_c ≈ 48.75°; Refraction angle θ₂ ≈ 41.68°',
        },
        pedagogicalNote: {
          am: 'የመግቢያው ማዕዘን ከ 48.75° በላይ ቢሆን ኖሮ ምንም ብርሃን ወደ አየር አይወጣም ነበር፤ ሙሉ በሙሉ ወደ ውሃው ይመለስ ነበር (Total Internal Reflection)።',
          om: 'θ > 48.8° yoo ta\'e Total Internal Reflection ta\'a.',
          ti: 'θ > 48.8° እንተኾይኑ ምሉእ ነጸብራቕ ይኸውን።',
          ar: 'إذا زادت زاوية السقوط عن 48.75°، يحدث انعكاس كلي داخلي وتعمل كالألياف البصرية تماماً.',
          so: 'Haddii θ > 48.8°, waxay noqonaysaa TIR.',
          en: 'If incidence angle exceeds 48.75°, light undergoes 100% Total Internal Reflection.',
        },
      },
    ],
    activities: [
      {
        id: 'act-p-6',
        activityNumber: 'አክቲቪቲ 6.1',
        title: {
          am: 'የኮንቬክስ ሌንስ ፎካል ርዝመት (Focal Length) በፀሐይ ብርሃን መለካት',
          om: 'Focal length convex lens ifa aduutiin safaraa',
          ti: 'ፎካል ርዝመት ኮንቬክስ ሌንስ ብብርሃን ጸሓይ ምዕቃን',
          ar: 'تعيين البعد البؤري لعدسة محدبة مجمعة باستخدام أشعة الشمس المتوازية',
          so: 'Cabirka focal length ee convex lens',
          en: 'Determining Focal Length of a Convex Lens Using Solar Parallel Rays and Screen Focusing',
        },
        instruction: {
          am: 'ኮንቬክስ ሌንስን ወደ ፀሐይ በማዞር ከጀርባው ወረቀት ያዙ፤ ጥርት ያለ ደማቅ ነጥብ በወረቀቱ ላይ እስኪፈጠር ድረስ ርቀቱን አስተካክሉ።',
          om: 'Ifa aduu gara qabxii tokkotti fidi.',
          ti: 'ናይ ጸሓይ ብርሃን ናብ ሓንቲ ነጥቢ ኣተኩሩ።',
          ar: 'وجه العدسة المحدبة نحو الشمس، وحرك ورقة بيضاء خلفها حتى تحصل على أصغر وأوضح نقطة مضيئة، وقس المسافة بينهما.',
          so: 'Ku hagaaji iftiinka qorraxda hal dhibic.',
          en: 'Focus sunlight onto paper until the smallest sharp dot forms; measure lens-to-screen distance.',
        },
        groupTask: {
          am: 'የተለካው ርቀት የሌንሱ ፎካል ርዝመት f መሆኑን አረጋግጡ፤ የሌንሱን ፓወር P = 1/f (በዳዮፕተር Diopters) አስሉ።',
          om: 'Focal length f fi Power P = 1/f shallagaa.',
          ti: 'f ን ፓወር P = 1/f ን ኣስሉዕ።',
          ar: 'أثبت أن هذه المسافة هي البعد البؤري f، واحسب قوة العدسة بوحدة الديوبتر P = 1/f (بالمتر).',
          so: 'Xisaabi f iyo P = 1/f.',
          en: 'Confirm distance represents focal length f; compute optical power P = 1/f (in Diopters).',
        },
        criticalThinkingQuestion: {
          am: 'አንድ ሰው ሩቅ ማየት ተስኖት የቅርብ ብቻ የሚያይ ከሆነ (Myopia) በየትኛው ሌንስ ይታረማል? (ኮንኬቭ ሌንስ)',
          om: 'Myopia lens kamtu fayyisa?',
          ti: 'Myopia ብኣየናይ ሌንስ ይሕከም?',
          ar: 'أي نوع من العدسات يستخدم لتصحيح عيب قصر النظر (Myopia)؟ (العدسة المقعرة المفرقة).',
          so: 'Muraayadee ayaa lagu daweeyaa myopia?',
          en: 'Which lens geometry rectifies short-sightedness (myopia)? (Diverging concave lens).',
        },
      },
    ],
    experiments: [DEFAULT_LAB_EXPERIMENT],
    reviewExercises: [
      {
        id: 'rev-p-6.1',
        exerciseNumber: 'የምዕራፍ 6 መልመጃ 1',
        type: 'multiple_choice',
        question: {
          am: 'ፎካል ርዝመቱ f = 10 cm የሆነ ኮንቬክስ ሌንስ ፊት ለፊት በ d_o = 15 cm ርቀት ላይ እቃ ቢቀመጥ፣ ምስሉ በስንት ሴንቲሜትር ርቀት (d_i) ላይ ይፈጠራል?',
          om: 'f = 10 cm, d_o = 15 cm yoo ta\'e d_i meeqa?',
          ti: 'f = 10 cm, d_o = 15 cm እንተኾይኑ d_i ክንደይ እዩ?',
          ar: 'وضع جسم على بعد 15 سم أمام عدسة محدبة بعدها البؤري 10 سم. أين تتكون الصورة (d_i)؟',
          so: 'Waa maxay d_i haddii f = 10 cm, d_o = 15 cm?',
          en: 'An object is placed at d_o = 15 cm in front of a convex lens of focal length f = 10 cm. Find the image distance d_i.',
        },
        options: ['A. 6 cm', 'B. 25 cm', 'C. 30 cm', 'D. 15 cm'],
        correctAnswer: {
          am: 'C. 30 cm — በሌንስ ቀመር መሰረት 1/f = 1/d_o + 1/d_i ⇒ 1/10 = 1/15 + 1/d_i ⇒ 1/d_i = 1/10 - 1/15 = 1/30 ⇒ d_i = 30 cm',
          om: 'C. 30 cm',
          ti: 'C. 30 cm',
          ar: 'C. 30 سم (1/d_i = 1/10 - 1/15 = 1/30 إذن d_i = 30 سم)',
          so: 'C. 30 cm',
          en: 'C. 30 cm — Lens equation: 1/d_i = 1/f - 1/d_o = 1/10 - 1/15 = 1/30 ⇒ d_i = 30 cm.',
        },
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የሌንስ ቀመር፡ 1/f = 1/d_o + 1/d_i ⇒ 1/d_i = 1/f - 1/d_o።',
            om: '1/d_i = 1/f - 1/d_o.',
            ti: '1/d_i = 1/f - 1/d_o።',
            ar: 'الخطوة 1: قانون العدسات الرقيقة: 1/d_i = 1/f - 1/d_o.',
            so: '1/d_i = 1/f - 1/d_o.',
            en: 'Step 1: Thin lens formula: 1/d_i = 1/f - 1/d_o.',
          },
          {
            am: 'ደረጃ 2፡ ቁጥሮቹን አስገባ፡ 1/d_i = 1/10 - 1/15 = (3 - 2)/30 = 1/30 ⇒ d_i = 30 cm።',
            om: '1/d_i = 1/30 ⇒ d_i = 30 cm.',
            ti: '1/d_i = 1/30 ⇒ d_i = 30 cm።',
            ar: 'الخطوة 2: 1/d_i = 3/30 - 2/30 = 1/30 ومنه بعد الصورة d_i = 30 سم.',
            so: 'd_i = 30 cm.',
            en: 'Step 2: Solve: 1/d_i = 3/30 - 2/30 = 1/30 ⇒ d_i = 30 cm.',
          },
        ],
      },
    ],
    supplementaryNote: {
      am: 'ተጨማሪ አጋዥ፡ የሌንስ ማጉላት m = -d_i / d_o ሲሆን፤ m አሉታዊ ከሆነ ምስሉ የተገለበጠ (Inverted Real Image) ነው፣ አዎንታዊ ከሆነ ቀጥ ያለ ምናባዊ (Upright Virtual Image) ነው።',
      om: 'm = -d_i / d_o.',
      ti: 'm = -d_i / d_o ምዃኑ ዘክሩ።',
      ar: 'قاعدة الإشارة: التكبير m = -d_i / d_o، فالإشارة السالبة تعني صورة حقيقية مقلوبة، والموجبة تعني صورة تقديرية معتدلة.',
      so: 'm = -d_i / d_o.',
      en: 'Magnification convention: m = -d_i / d_o; negative sign denotes an inverted real image.',
    },
  },
];
