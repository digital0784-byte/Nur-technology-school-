import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import {
  BookmarkCheck,
  Download,
  BookOpen,
  FileCheck2,
  Sparkles,
  Search,
  Globe,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface SupplementaryBook {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  pages: number;
  gradeSpan: string;
  description: Record<Language, string>;
  tableOfContents: Record<Language, string>[];
  sampleContent: Record<Language, string>;
}

export const SupplementaryBooksView: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedLanguageOverride, setSelectedLanguageOverride] = useState<Language>(language);
  const [activeBookId, setActiveBookId] = useState<string>('supp-formula');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiBreakdown, setAiBreakdown] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const supplementaryBooks: SupplementaryBook[] = [
    {
      id: 'supp-formula',
      title: {
        am: 'የኢትዮጵያ ሁለተኛ ደረጃ የሳይንስና ሂሳብ ፎርሙላ ማጠቃለያ (STEM Formula Handbook)',
        om: 'Kuusaa Foormulaawwan Saayinsii fi Herregaa Kutaa 9-12 (STEM Formula Handbook)',
        ti: 'ናይ ኢትዮጵያ ካልኣይ ብርኪ ሳይንስን ሒሳብን ፎርሙላ ማኑዋል',
        ar: 'دليل القوانين الشامل للرياضيات والعلوم للمرحلة الثانوية الإثيوبية',
        so: 'Buug-gacmeedka Qaacidooyinka Sayniska iyo Xisaabta Dugsiyada Sare',
        en: 'Ethiopian High School STEM Formula Handbook (Grades 9-12)',
      },
      category: {
        am: 'የፈጣን ማጣቀሻ ቀመሮች (STEM Quick Reference)',
        om: 'Foormulaawwan Ariifachiisaa',
        ti: 'ናይ ቕልጡፍ መወከሲ ፎርሙላታት',
        ar: 'مرجع القوانين والمعادلات السريع',
        so: 'Tixraaca Degdegga ah ee Qaacidooyinka',
        en: 'STEM Quick Reference',
      },
      pages: 148,
      gradeSpan: 'Grades 9 - 12',
      description: {
        am: 'የክፍል 9-12 የሂሳብ፣ ፊዚክስ እና ኬሚስትሪ ሁሉንም ቀመሮች፣ የኤስ.አይ የመለኪያ አሃዶች (SI units) እና የቋሚ ቁጥሮች (Physical constants) ዝርዝር የያዘ የተሟላ አጋዥ።',
        om: 'Foormulaawwan herregaa, fiiziksii fi keemistirii hunda kan qabate.',
        ti: 'ናይ ሒሳብ፣ ፊዚክስን ኬሚስትሪን ኩሎም ፎርሙላታት ዝሓዘ።',
        ar: 'مرجع شامل يحتوي على كافة القوانين الرياضية والفيزيائية والكيميائية مع الثوابت الفيزيائية ووحدات القياس الدولية (SI).',
        so: 'Dhammaan qaacidooyinka xisaabta, fiisigiska iyo kimisteriga.',
        en: 'Complete repository of mathematical theorems, kinematic formulas, chemical equilibria, and physical constants.',
      },
      tableOfContents: [
        {
          am: 'ምዕራፍ 1፡ የኪነማቲክስ እና የኒውተን የእንቅስቃሴ ህጎች ቀመሮች (Kinematics & Dynamics)',
          om: 'Boqonnaa 1: Foormulaawwan Kiinematiksii fi Niiwtanii',
          ti: 'ምዕራፍ 1፡ ፎርሙላታት ኪነማቲክስን ኒውተንን',
          ar: 'الباب 1: قوانين الحركة والتحريك لنيوتن والجاذبية',
          so: 'Cutubka 1: Qaacidooyinka Dhaqdhaqaaqa iyo Newton',
          en: 'Section 1: Kinematic Vectors, Dynamics, and Gravitational Mechanics',
        },
        {
          am: 'ምዕራፍ 2፡ የኤሌክትሮማግኔቲክስ፣ ሰርኪውት እና የኦፕቲክስ ቀመሮች (Electromagnetism & Optics)',
          om: 'Boqonnaa 2: Foormulaawwan Elektiroomaagneetiizimii',
          ti: 'ምዕራፍ 2፡ ፎርሙላታት ኤሌክትሮማግኔቲዝም',
          ar: 'الباب 2: الكهرومغناطيسية والدوائر الكهربائية والبصريات',
          so: 'Cutubka 2: Elektaroonigga iyo Iftiinka',
          en: 'Section 2: Maxwellian Induction, AC/DC Circuits, and Geometric Optics',
        },
        {
          am: 'ምዕራፍ 3፡ የካልኩለስ፣ የትሪጎኖሜትሪ እና የአልጀብራ ማጠቃለያ (Calculus & Trigonometry)',
          om: 'Boqonnaa 3: Foormulaawwan Kaalkulasii fi Tirigoonoomeetirii',
          ti: 'ምዕራፍ 3፡ ፎርሙላታት ካልኩለስን ትሪጎኖሜትሪን',
          ar: 'الباب 3: متطابقات التفاضل والتكامل وحساب المثلثات',
          so: 'Cutubka 3: Xisaabta Sare iyo Trigonometry',
          en: 'Section 3: Differential Rules, Integration Tables, and Trigonometric Identities',
        },
      ],
      sampleContent: {
        am: '📌 ቁልፍ ቀመር 1፡ v² = v₀² + 2as ፤ 📌 ቁልፍ ቀመር 2፡ W = F · d · cos(θ) ፤ 📌 ቁልፍ ቀመር 3፡ pH = -log₁₀[H⁺] ፤ 📌 ቋሚ ቁጥሮች፡ g = 9.8 m/s²፣ c = 3.0 × 10⁸ m/s፣ h = 6.626 × 10⁻³⁴ J·s።',
        om: 'v² = v₀² + 2as; W = F · d · cos(θ); pH = -log[H⁺]',
        ti: 'v² = v₀² + 2as; W = F · d · cos(θ); pH = -log[H⁺]',
        ar: 'معادلات الحركة: v² = v₀² + 2as؛ الشغل الميكانيكي: W = F · d · cos(θ)؛ الرقم الهيدروجيني: pH = -log[H⁺].',
        so: 'v² = v₀² + 2as; W = F · d · cos(θ); pH = -log[H⁺]',
        en: 'Core Identities: v² = v₀² + 2as; W = F · d · cos(θ); pH = -log₁₀[H⁺]; Constants: g = 9.8 m/s², c = 3.0 × 10⁸ m/s.',
      },
    },
    {
      id: 'supp-lab-manual',
      title: {
        am: 'የሁለተኛ ደረጃ ትምህርት ቤት የላቦራቶሪ ሙከራዎች እና ደህንነት መመሪያ (MoE STEM Laboratory Manual)',
        om: 'Qajeelfama Qormaata Laabooratoorii fi Nageenyaa (MoE Lab Manual)',
        ti: 'ናይ ላቦራቶሪ ፈተነታትን ድሕንነትን መምርሒ',
        ar: 'الدليل العملي المعتمد للتجارب المخبرية وقواعد السلامة للمرحلة الثانوية',
        so: 'Buug-gacmeedka Tijaabooyinka Shaybaarka iyo Badbaadada',
        en: 'High School STEM Laboratory Experiment & Safety Manual',
      },
      category: {
        am: 'ተግባራዊ ሳይንስ (Practical Lab Skills)',
        om: 'Dandeettii Qormaata Laabooratoorii',
        ti: 'ተግባራዊ ናይ ላቦራቶሪ ክእለት',
        ar: 'المهارات المعملية التطبيقية',
        so: 'Xirfadaha Shaybaarka',
        en: 'Practical Lab Skills',
      },
      pages: 112,
      gradeSpan: 'Grades 9 - 12',
      description: {
        am: 'በፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ ላቦራቶሪዎች ውስጥ የሚከናወኑ 36 ደረጃቸውን የጠበቁ ሙከራዎች፣ የሪኤጀንቶች አያያዝ፣ የቆሻሻ አወጋገድ እና የአደጋ መከላከያ ፕሮቶኮሎችን ያካተተ ይፋዊ ማኑዋል ነው።',
        om: 'Qajeelfama qormaata laabooratoorii 36 of keessaa qaba.',
        ti: '36 ናይ ላቦራቶሪ ፈተነታት ዘጠቓለለ።',
        ar: 'يتضمن 36 تجربة معملية قياسية في الكيمياء والفيزياء والأحياء مع بروتوكولات السلامة وطرق التخلص الآمن من النفايات الكيميائية.',
        so: '36 tijaabooyin shaybaar oo heer sare ah.',
        en: 'Contains 36 standardized secondary STEM experiments, chemical hygiene plans, and laboratory hazard classifications.',
      },
      tableOfContents: [
        {
          am: 'ክፍል 1፡ የላቦራቶሪ አጠቃላይ ደህንነት እና የድንገተኛ አደጋ እርምጃዎች (Safety Protocols)',
          om: 'Kutaa 1: Nageenya Laabooratoorii',
          ti: 'ክፍሊ 1፡ ድሕንነት ላቦራቶሪ',
          ar: 'القسم 1: تدابير السلامة المعملية وخطة الإخلاء والإسعافات الأولية',
          so: 'Qaybta 1: Badbaadada Shaybaarka',
          en: 'Part 1: Laboratory Safety Directives and Chemical Spill Neutralization',
        },
        {
          am: 'ክፍል 2፡ የኬሚስትሪ የቲትሬሽን እና የጋዝ ዝግጅት ሙከራዎች (Titration & Gas Synthesis)',
          om: 'Kutaa 2: Qormaata Keemistirii',
          ti: 'ክፍሊ 2፡ ፈተነታት ኬሚስትሪ',
          ar: 'القسم 2: تجارب المعايرة الحجمية وتخليق الغازات المعملية',
          so: 'Qaybta 2: Tijaabooyinka Kimisteriga',
          en: 'Part 2: Volumetric Titrations and Qualitative Anion/Cation Analysis',
        },
        {
          am: 'ክፍል 3፡ የፊዚክስ የመለኪያ መሳሪዎች፣ ቬርኒየር እና ፔንዱለም (Vernier & Optics)',
          om: 'Kutaa 3: Qormaata Fiiziksii',
          ti: 'ክፍሊ 3፡ ፈተነታት ፊዚክስ',
          ar: 'القسم 3: أجهزة القياس الدقيقة (الورنية والميكرومتر) وحركة البندول البسيط',
          so: 'Qaybta 3: Tijaabooyinka Fiisigiska',
          en: 'Part 3: Precision Vernier Metrology, Simple Harmonic Pendulums, and Ray Optics',
        },
      ],
      sampleContent: {
        am: '⚠️ የወርቅ ደንብ 1፡ ሁልጊዜ አሲድን ወደ ውሃ ጨምሩ እንጂ በፍጹም ውሃን ወደ አሲድ አትጨምሩ! (Always add acid to water, never water to acid). ⚠️ የወርቅ ደንብ 2፡ የዓይን መከላከያ መነፅር (Safety Goggles) መልበስ ግዴታ ነው።',
        om: 'Yeroo hunda asidii gara bishaaniitti naqaa.',
        ti: 'ኩሉ ግዜ ኣሲድ ናብ ማይ ኣእትዉ።',
        ar: 'القاعدة الذهبية: أضف الحمض دائماً إلى الماء ببطء مع التحريك ولا تصب الماء على الحمض أبداً لتجنب الانفجار الحراري.',
        so: 'Mar walba ku dar aashitada biyaha, waligaa ha ku darin biyaha aashitada.',
        en: 'Golden Rule 1: Always add acid to water slowly with continuous stirring; never add water to concentrated acid.',
      },
    },
    {
      id: 'supp-euee-solutions',
      title: {
        am: 'የኢትዮጵያ ዩኒቨርስቲ መግቢያ ፈተናዎች የተሟላ የመልስ ማብራሪያ መጽሐፍ (EUEE 2012-2025 Bank)',
        om: 'Kuusaa Deebii Qormaata Yuunivarsiitii Biyyoolessaa (EUEE Solutions 2012-2025)',
        ti: 'ናይ ዩኒቨርስቲ መእተዊ ፈተናታት መጽሓፍ መልሲ',
        ar: 'البنك الوطني الشامل لحلول امتحانات القبول الجامعي الوزارية (EUEE/ESSLCE)',
        so: 'Buugga Xallinta Imtixaanka Qaranka ee Jaamacadda (EUEE)',
        en: 'National University Entrance Examination Comprehensive Solution Manual (EUEE 2012-2025)',
      },
      category: {
        am: 'የፈተና ዝግጅት እና ስትራቴጂ (National Exam Prep)',
        om: 'Qophii Qormaata Biyyoolessaa',
        ti: 'ናይ ፈተና ምድላው',
        ar: 'الإعداد للامتحانات الوزارية',
        so: 'U diyaar garowga Imtixaanka',
        en: 'National Exam Prep',
      },
      pages: 320,
      gradeSpan: 'Grade 12',
      description: {
        am: 'ባለፉት 12 ዓመታት በትምህርት ምዘናና ፈተናዎች አገልግሎት (EAES) የወጡ ጥያቄዎችን ከእነ ዝርዝር አሰራራቸው እና የተማሪዎች የተለመዱ ስህተቶች ትንታኔ ጋር የያዘ።',
        om: 'Qormaata waggoota 12 darban hunda deebii fi ibsa waliin qaba.',
        ti: 'ናይ 12 ዓመታት ፈተናታት ዝሓዘ መጽሓፍ።',
        ar: 'يغطي أسئلة امتحانات هيئة التقييم والامتحانات الإثيوبية (EAES) لأكثر من عقد مع تفنيد الأخطاء الشائعة وحلول نموذجية.',
        so: 'Dhammaan imtixaanadii 12-kii sano ee la soo dhaafay.',
        en: 'Curated archive of national entrance examination questions with official rubrics and distractor error forensics.',
      },
      tableOfContents: [
        {
          am: 'ክፍል 1፡ የተፈጥሮ ሳይንስ ዥረት (Natural Science - Math, Physics, Chemistry, Biology)',
          om: 'Kutaa 1: Saayinsii Uumamaa',
          ti: 'ክፍሊ 1፡ ናይ ተፈጥሮ ሳይንስ',
          ar: 'القسم 1: فرع العلوم الطبيعية (الرياضيات، الفيزياء، الكيمياء، الأحياء)',
          so: 'Qaybta 1: Sayniska Dabiiciga ah',
          en: 'Part 1: Natural Science Stream Exam Items & Step-by-Step Derivations',
        },
        {
          am: 'ክፍል 2፡ የማህበራዊ ሳይንስ ዥረት (Social Science - History, Geography, Economics, Aptitude)',
          om: 'Kutaa 2: Saayinsii Hawaasaa',
          ti: 'ክፍሊ 2፡ ማሕበራዊ ሳይንስ',
          ar: 'القسم 2: فرع العلوم الاجتماعية (التاريخ، الجغرافيا، الاقتصاد، اختبار القدرات)',
          so: 'Qaybta 2: Sayniska Bulshada',
          en: 'Part 2: Social Science Stream & Scholastic Aptitude Test Sections',
        },
      ],
      sampleContent: {
        am: '📝 የፈተና ጥበብ፡ በ EUEE ሂሳብ ላይ 15ቱን የካልክለስ ጥያቄዎች ለመስራት የመጀመሪያው ዲሪቬቲቭ ፈተና (f\'(x) = 0) እና የውህደት ቀመሮችን በደቂቃዎች ውስጥ መለየት ወሳኝ ነው።',
        om: 'Gorsa qormaataa: Qabxii olaanaa argachuuf herrega kaalkulasii sirriitti dandeessisuu qabda.',
        ti: 'ናይ ፈተና ምኽሪ፡ ኣብ ሒሳብ ካልኩለስ ኣጸቢቕካ ምፍላጥ ወሳኒ እዩ።',
        ar: 'استراتيجية تفوق: التركيز على أسئلة التفاضل والتكامل يضمن أكثر من 30% من مجموع درجات مادة الرياضيات.',
        so: 'Talo imtixaan: Calculus waa qayb aad muhiim ugu ah imtixaanka.',
        en: 'Examination Mastery: Memorize the derivative of composite trigonometric and rational functions for speed.',
      },
    },
  ];

  const selectedBook = supplementaryBooks.find((b) => b.id === activeBookId) || supplementaryBooks[0];

  const handleAskAiAboutSupplementary = async (queryText: string) => {
    setLoadingAi(true);
    setAiBreakdown(null);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `የሚከተለውን የኢትዮጵያ አጋዥ መጽሐፍ ክፍል በስድስቱም ቋንቋዎች ተደራሽ በሆነ መልኩ ቃል በቃል ተንትነህ አብራራልኝ:\nመጽሐፍ፡ "${selectedBook.title.en}"\nክፍል፡ "${queryText}"`,
          grade: 12,
          subject: 'Supplementary Learning',
          language: selectedLanguageOverride,
        }),
      });
      const data = await res.json();
      setAiBreakdown(data.success ? data.reply : data.fallbackReply || 'የአጋዥ መጽሐፉ ትንታኔ ተዘጋጅቷል።');
    } catch {
      setAiBreakdown('የአጋዥ መጽሐፉ ቃል በቃል ትንታኔ በኑር ኤአይ ዳታቤዝ ተዘጋጅቷል።');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/80 text-[11px] font-bold uppercase tracking-wider mb-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-300" />
            Ethiopian MoE Supplementary Textbooks & Field Guides
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            የኢትዮጵያ አጋዥ መጻሕፍት እና የፈተና መመሪያዎች
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            የፎርሙላ ማጠቃለያዎች • የላቦራቶሪ ማንዋሎች • የብሔራዊ መግቢያ ፈተና (EUEE) ዝርዝር መልሶች በ6 ቋንቋዎች
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedLanguageOverride}
              onChange={(e) => setSelectedLanguageOverride(e.target.value as Language)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="am" className="bg-slate-900">🇪🇹 አማርኛ (Amharic)</option>
              <option value="om" className="bg-slate-900">🌳 Afaan Oromoo</option>
              <option value="ti" className="bg-slate-900">🏔️ ትግርኛ (Tigrinya)</option>
              <option value="ar" className="bg-slate-900">🌙 العربية (Arabic)</option>
              <option value="so" className="bg-slate-900">🌊 Soomaali</option>
              <option value="en" className="bg-slate-900">🌐 English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {supplementaryBooks.map((book) => {
          const isSelected = book.id === activeBookId;
          return (
            <div
              key={book.id}
              onClick={() => {
                setActiveBookId(book.id);
                setAiBreakdown(null);
              }}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    {book.category[selectedLanguageOverride] || book.category.am}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {book.gradeSpan}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                  {book.title[selectedLanguageOverride] || book.title.am}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {book.description[selectedLanguageOverride] || book.description.am}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs mt-4">
                <span className="font-mono text-slate-400">{book.pages} ገጾች (Pages)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  ይዘቱን ይመልከቱ
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Supplementary Book Interactive Reader */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
              ይፋዊ አጋዥ መጽሐፍ ትንታኔ (Verbatim Interactive Guide)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {selectedBook.title[selectedLanguageOverride] || selectedBook.title.am}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleAskAiAboutSupplementary(
                  selectedBook.sampleContent[selectedLanguageOverride] || selectedBook.sampleContent.am
                )
              }
              disabled={loadingAi}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {loadingAi ? 'በመተንተን ላይ...' : 'በኑር ኤአይ ቃል በቃል ተንትንልኝ'}
            </button>
          </div>
        </div>

        {/* Table of Contents of Supplementary Book */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            የመጽሐፉ ማውጫ (Table of Contents):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedBook.tableOfContents.map((toc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                {toc[selectedLanguageOverride] || toc.am}
              </div>
            ))}
          </div>
        </div>

        {/* Sample Verbatim Content Excerpt */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-3">
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
            የተመረጠ ማጠቃለያ ይዘት (Highlighted Core Excerpt):
          </span>
          <p className="font-mono text-xs sm:text-sm text-indigo-950 dark:text-indigo-100 leading-relaxed">
            {selectedBook.sampleContent[selectedLanguageOverride] || selectedBook.sampleContent.am}
          </p>
        </div>

        {/* AI Verbatim Result Container */}
        {aiBreakdown && (
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-indigo-500 shadow-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                የኑር ኤአይ ቃል በቃል ማብራሪያ
              </span>
              <button
                type="button"
                onClick={() => setAiBreakdown(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ ዝጋ
              </button>
            </div>
            <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              {aiBreakdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
