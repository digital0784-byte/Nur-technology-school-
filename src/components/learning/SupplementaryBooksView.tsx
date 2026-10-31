import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import {
  BookOpen,
  BookmarkCheck,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Layers,
  Award,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink,
  BookMarked,
  GraduationCap,
  Calculator,
  Compass,
  Atom,
  Dna,
} from 'lucide-react';

export interface PracticeExercise {
  questionNumber: number;
  question: Record<Language, string>;
  options?: string[];
  correctAnswer: string;
  stepByStepSolution: Record<Language, string>[];
}

export interface SupplementaryBookRecord {
  id: string;
  series: 'Extreme' | 'Alpha' | 'Galaxy' | 'MoE_STEM';
  title: Record<Language, string>;
  author: string;
  edition: string;
  publicationYear: string;
  subjectCode: 'MATH' | 'PHYS' | 'CHEM' | 'BIO' | 'ALL';
  gradeSpan: string;
  totalPages: number;
  coverColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  badgeLabel: Record<Language, string>;
  description: Record<Language, string>;
  chapters: {
    chapterNumber: number;
    title: Record<Language, string>;
    summary: Record<Language, string>;
    keyFormulas: string[];
  }[];
  sampleExercises: PracticeExercise[];
}

export const SUPPLEMENTARY_BOOKS_CATALOG: SupplementaryBookRecord[] = [
  // 1. Extreme Mathematics
  {
    id: 'supp-extreme-math',
    series: 'Extreme',
    title: {
      am: 'ኤክስትሪም የሂሳብ ማጠቃለያ እና የፈተና ጥያቄዎች (Extreme Mathematics Grade 11 & 12)',
      om: 'Extreme Herrega Kutaa 11 fi 12',
      ti: 'ኤክስትሪም ናይ ሒሳብ መጽሓፍ (ክፍሊ 11ን 12ን)',
      ar: 'سلسلة إكستريم: كتاب الرياضيات الشامل للصفين 11 و 12',
      so: 'Extreme Xisaabta Fasallada 11 & 12',
      en: 'Extreme Mathematics: National Exam Guide (Grades 11 & 12)',
    },
    author: 'Extreme Academic Editorial Board (Addis Ababa)',
    edition: '2024/2025 Revised 9th Edition - MoE Syllabus Aligned',
    publicationYear: '2025 G.C. / 2017 E.C.',
    subjectCode: 'MATH',
    gradeSpan: 'Grades 11 - 12',
    totalPages: 412,
    coverColor: 'indigo',
    badgeLabel: {
      am: 'ብሔራዊ ምርጥ ሽያጭ (Best Seller)',
      om: 'Baay\'ee Filatamaa',
      ti: 'ዝበለጸ ምርጫ',
      ar: 'الأكثر مبيعاً وطنياً',
      so: 'Ugu Iibsiga Badan',
      en: 'National Best Seller',
    },
    description: {
      am: 'በኢትዮጵያ ሁለተኛ ደረጃ ትምህርት ቤቶች ውስጥ በስፋት ጥቅም ላይ የሚውለው ታዋቂው የኤክስትሪም ሂሳብ መጽሐፍ። የካልኩለስ፣ የቬክተር፣ የትሪጎኖሜትሪ እና የስቶካስቲክስ ቀመሮችን ከ1,200 በላይ ከተሰሩ ጥያቄዎች ጋር ያካተተ።',
      om: 'Kitaaba herregaa beekamaa Extreme jedhamu. Kaalkulasii, veektara fi shallaggii qormaata biyyoolessaa of keessaa qaba.',
      ti: 'ኣብ ኢትዮጵያ ብብዝሒ ዝፍለጥ ኤክስትሪም ሒሳብ መጽሓፍ። ንፈተና ዩኒቨርስቲ መእተዊ ዘዳሉ ልዕሊ 1200 ዝተሰርሑ ሕቶታት ዘጠቓለለ።',
      ar: 'المرجع الأشهر في المدارس الإثيوبية لاجتياز امتحان الثانوية العامة، يشمل التفاضل والتكامل والمتجهات وحساب المثلثات مع أكثر من 1200 مسألة محلولة بالخطوات.',
      so: 'Buugga xisaabta ee aadka looga yaqaano Itoobiya oo ka kooban calculus iyo leyliyo imtixaan.',
      en: 'The definitive Ethiopian university entrance examination prep text, featuring comprehensive calculus, vectors, analytical geometry, and over 1,200 worked past exam problems.',
    },
    chapters: [
      {
        chapterNumber: 1,
        title: {
          am: 'ምዕራፍ 1፡ ቅደም ተከተሎች እና ዝርዝሮች (Sequences and Series)',
          om: 'Boqonnaa 1: Seequweensii fi Siiriisii',
          ti: 'ምዕራፍ 1፡ ሲክዌንስን ሲሪስን',
          ar: 'الوحدة 1: المتتابعات والمتسلسلات الحسابية والهندسية',
          so: 'Cutubka 1: Isku-xigxiga iyo Taxanaha',
          en: 'Unit 1: Arithmetic and Geometric Progressions',
        },
        summary: {
          am: 'የአርቲሜቲክ እና የጂኦሜትሪክ ቅደም ተከተሎች አጠቃላይ ፎርሙላዎች፣ የወሰን አልባ ዝርዝሮች ድምር ($S_\\infty = \\frac{a}{1-r}$) እና የፋይናንስ ሂሳብ ተዛማጅ ስሌቶች።',
          om: 'Foormulaawwan seequweensii herregaa fi ji\'oomeetirii.',
          ti: 'ፎርሙላታት ኣርቲሜቲክን ጂኦሜትሪክን ቅደም ተኸተልቲ።',
          ar: 'الحد العام للمتتاليات الحسابية والهندسية، ومجموع المتسلسلات اللانهائية التقاربية.',
          so: 'Qaacidooyinka xisaabinta taxanaha xisaabeed iyo joomatari.',
          en: 'nth term formulas, arithmetic and geometric sums, infinite geometric convergence (|r| < 1), and sigma summation notation.',
        },
        keyFormulas: [
          'a_n = a_1 + (n - 1)d',
          'S_n = \\frac{n}{2}[2a_1 + (n - 1)d]',
          'G_n = a_1 \\cdot r^{n-1}',
          'S_\\infty = \\frac{a_1}{1 - r} \\text{ for } |r| < 1',
        ],
      },
      {
        chapterNumber: 2,
        title: {
          am: 'ምዕራፍ 2፡ የፈንክሽኖች ወሰን እና ቀጣይነት (Limits & Continuity)',
          om: 'Boqonnaa 2: Liimiitii fi Qophaayina',
          ti: 'ምዕራፍ 2፡ ወሰናት (Limits) ፈንክሽን',
          ar: 'الوحدة 2: النهايات والاتصال وتطبيقات لوبيتال',
          so: 'Cutubka 2: Xuduudaha iyo Joogteynta',
          en: 'Unit 2: Limits, One-Sided Bounds, and Continuity',
        },
        summary: {
          am: 'የፈንክሽን ገደብ በነጥብ ላይ፣ ወደ ወሰን አልባነት የሚያመሩ ገደቦች፣ የ 0/0 እርግጠኛ ያልሆኑ ቅርፆች እና የሎፒታል (L\'Hôpital\'s) ደንብ አሰራር።',
          om: 'Liimiitota herregaa fi seera L\'Hopital fayyadamuu.',
          ti: 'ስሌት ወሰናት ፈንክሽንን ሕጊ ሎፒታልን።',
          ar: 'حساب النهايات عند نقطة وعند اللانهاية، إزالة حالات عدم التعيين 0/0 وتطبيق قاعدة لوبيتال.',
          so: 'Xisaabinta xuduudaha shaqooyinka iyo xeerka L\'Hopital.',
          en: 'Evaluating limits analytically, algebraic rationalization, squeeze theorem, and L\'Hôpital\'s rule for indeterminate forms.',
        },
        keyFormulas: [
          '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
          '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e',
          '\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f\'(x)}{g\'(x)}',
        ],
      },
      {
        chapterNumber: 3,
        title: {
          am: 'ምዕራፍ 3፡ ዲፈረንሻል ካልኩለስ (Differential Calculus)',
          om: 'Boqonnaa 3: Kaalkulasii Difeerenshiyaalii',
          ti: 'ምዕራፍ 3፡ ዲፈረንሻል ካልኩለስ (Derivatives)',
          ar: 'الوحدة 3: التفاضل والمشتقات وتطبيقات القيم القصوى',
          so: 'Cutubka 3: Xisaabta Kala-baxa (Calculus)',
          en: 'Unit 3: Derivatives and Applications of Extrema',
        },
        summary: {
          am: 'የመጀመሪያ እና ሁለተኛ ዲሪቬቲቭ፣ የሰንሰለት ህግ (Chain Rule)፣ የፕሮዳክት እና የኮሸንት ህጎች፣ እንዲሁም ከፍተኛ እና ዝቅተኛ ነጥቦች (Maxima/Minima)።',
          om: 'Deriveetivii herregaa fi kalleettiiwwan isaa.',
          ti: 'ቀዳማይን ካልኣይን ዲሪቬቲቭን ተግባራዊ ስሌትን።',
          ar: 'قواعد الاشتقاق: السلسلة، حاصل الضرب والقسمة، وإيجاد النقط الحرجة وتطبيقات القيم العظمى والصغرى.',
          so: 'Qawaaniinta kala-baxa xisaabta iyo qiimaha ugu sarreeya.',
          en: 'Product, quotient, chain rules, implicit differentiation, optimization modeling, and concavity tests.',
        },
        keyFormulas: [
          '\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'',
          '\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
          '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
        ],
      },
    ],
    sampleExercises: [
      {
        questionNumber: 1,
        question: {
          am: 'የወሰን እሴቱ ስንት ይሆናል፡ $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$ ?',
          om: 'Gatiin liimiitii $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$ meeqa ta\'a?',
          ti: 'ዋጋ ናይቲ ወሰን $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$ ክንደይ እዩ?',
          ar: 'أوجد قيمة النهاية: $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$',
          so: 'Waa maxay qiimaha xadka $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$ ?',
          en: 'Evaluate the limit: $\\lim_{x \\to 2} \\frac{x^3 - 8}{x^2 - 4}$',
        },
        options: ['A. 3', 'B. 2', 'C. 0', 'D. 6'],
        correctAnswer: 'A. 3',
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ በቀጥታ x = 2 ሲገባ $\\frac{2^3 - 8}{2^2 - 4} = \\frac{0}{0}$ እርግጠኛ ያልሆነ (indeterminate) ይሆናል።',
            om: 'Sadarkaa 1: x = 2 yoo galu 0/0 ta\'a.',
            ti: 'ደረጃ 1፡ ቀጥታ እንተኣተወ 0/0 ይኸውን።',
            ar: 'الخطوة 1: بالتعويض المباشر عن x = 2 نحصل على 0/0 (صيغة غير معينة).',
            so: 'Tallaabada 1: Toos u gelin x = 2 waxay bixinaysaa 0/0.',
            en: 'Step 1: Direct substitution yields the indeterminate form 0/0.',
          },
          {
            am: 'ደረጃ 2፡ ላዩንና ታቹን በፋክተር እንበትናለን፡ $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$ እና $x^2 - 4 = (x - 2)(x + 2)$።',
            om: 'Sadarkaa 2: Faakterii goona: (x - 2)(x^2 + 2x + 4) / [(x - 2)(x + 2)].',
            ti: 'ደረጃ 2፡ ብፋክተር ምፍላይ: $(x - 2)(x^2 + 2x + 4) / [(x - 2)(x + 2)]$.',
            ar: 'الخطوة 2: تحليل البسط كفرق بين مكعبين والمقام كفرق بين مربعين: $(x - 2)(x^2 + 2x + 4) / [(x - 2)(x + 2)]$.',
            so: 'Tallaabada 2: Kala saar jajabyada labada dhinac.',
            en: 'Step 2: Factor numerator as difference of cubes and denominator as difference of squares.',
          },
          {
            am: 'ደረጃ 3፡ የጋራ የሆነውን $(x - 2)$ እናጣፋለን፡ $\\lim_{x \\to 2} \\frac{x^2 + 2x + 4}{x + 2} = \\frac{4 + 4 + 4}{2 + 2} = \\frac{12}{4} = 3$።',
            om: 'Sadarkaa 3: (x - 2) walii wajjin balleessuun: 12 / 4 = 3 arganna.',
            ti: 'ደረጃ 3፡ (x - 2) ብምጥፋእ: 12 / 4 = 3 ንረክብ።',
            ar: 'الخطوة 3: اختصار العامل المشترك (x - 2) ثم التعويض: $\\frac{4 + 4 + 4}{2 + 2} = \\frac{12}{4} = 3$.',
            so: 'Tallaabada 3: Baabi\'i qaybta wadaagga ah: 12 / 4 = 3.',
            en: 'Step 3: Cancel (x - 2) and evaluate: (4 + 4 + 4) / (2 + 2) = 12 / 4 = 3.',
          },
        ],
      },
    ],
  },

  // 2. Extreme Physics
  {
    id: 'supp-extreme-phys',
    series: 'Extreme',
    title: {
      am: 'ኤክስትሪም ፊዚክስ ማጠቃለያ (Extreme Physics Grade 11 & 12)',
      om: 'Extreme Fiiziksii Kutaa 11 fi 12',
      ti: 'ኤክስትሪም ፊዚክስ መጽሓፍ',
      ar: 'سلسلة إكستريم: المرجع المتكامل في الفيزياء للصفين 11 و 12',
      so: 'Extreme Fiisigiska Fasallada 11 & 12',
      en: 'Extreme Physics: National Examination Guide (Grades 11 & 12)',
    },
    author: 'Extreme Academic Editorial Board (Addis Ababa)',
    edition: '2024/2025 Revised 8th Edition',
    publicationYear: '2025 G.C.',
    subjectCode: 'PHYS',
    gradeSpan: 'Grades 11 - 12',
    totalPages: 388,
    coverColor: 'amber',
    badgeLabel: {
      am: 'የኢትዮጵያ ፊዚክስ መሪ መጽሐፍ',
      om: 'Kitaaba Fiiziksii Filatamaa',
      ti: 'መሪሕ መጽሓፍ ፊዚክስ',
      ar: 'المرجع الأول في الفيزياء',
      so: 'Buugga Kowaad ee Fiisigiska',
      en: 'Flagship Physics Compendium',
    },
    description: {
      am: 'በኢትዮጵያ ዩኒቨርስቲ መግቢያ ፈተና (EUEE) ላይ የሚመጡትን የተወሳሰቡ የፊዚክስ ጥያቄዎችን በደረጃ በደረጃ ስሌት እና በስዕላዊ መግለጫዎች የሚያስረዳ ሁነኛ አጋዥ።',
      om: 'Qormaata fiiziksii EUEE shallagguuf kan tajaajilu.',
      ti: 'ንፈተና ዩኒቨርስቲ መእተዊ ዘዳሉ መጽሓፍ ፊዚክስ።',
      ar: 'يغطي مواضيع الميكانيكا الكلاسيكية والديناميكا الحرارية والكهرومغناطيسية والفيزياء الحديثة مع نماذج اختبارات الوزارة.',
      so: 'Sharaxaadda xisaabinta fiisigiska ee imtixaanka EUEE.',
      en: 'Comprehensive treatment of rotational dynamics, electromagnetic induction, wave optics, and modern quantum theory tailored for the EUEE matric exam.',
    },
    chapters: [
      {
        chapterNumber: 1,
        title: {
          am: 'ምዕራፍ 1፡ ቬክተሮች እና ባለ ሁለት አቅጣጫ እንቅስቃሴ (2D Vectors & Projectiles)',
          om: 'Boqonnaa 1: Veektaroota fi Sochii 2D',
          ti: 'ምዕራፍ 1፡ ቬክተራትን ፕሮጀክትይልን',
          ar: 'الوحدة 1: المتجهات وتحليل الحركة في بعدين والمقذوفات',
          so: 'Cutubka 1: Vectors iyo Dhaqdhaqaaqa 2D',
          en: 'Unit 1: Two-Dimensional Vectors and Projectile Motion',
        },
        summary: {
          am: 'የቬክተር ዶት እና ክሮስ ፕሮዳክት፣ የተወንጫፊ አካላት (Projectile) ከፍተኛ ከፍታ፣ የበረራ ጊዜ ($T = \\frac{2v_0\\sin\\theta}{g}$) እና አግድም ርቀት።',
          om: 'Shallaggii sochii piroojeektaayilii fi veektarootaa.',
          ti: 'ስሌት ርሕቐትን ግዘ በረራን ናይ ፕሮጀክትይል እንቅስቃሴ።',
          ar: 'المركبات المتجهة، معادلات حركة المقذوفات، أقصى ارتفاع، زمن التحليق والمدى الأفقي الأقصى.',
          so: 'Xisaabinta masaafada iyo wakhtiga duulimaadka.',
          en: 'Resolution of vector components, cross products, flight time, maximum projectile altitude, and parabolic range formulas.',
        },
        keyFormulas: [
          'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
          'H_{max} = \\frac{v_0^2 \\sin^2\\theta}{2g}',
          'T = \\frac{2v_0 \\sin\\theta}{g}',
        ],
      },
      {
        chapterNumber: 2,
        title: {
          am: 'ምዕራፍ 2፡ ኤሌክትሮማግኔቲክ ኢንዳክሽን እና የኤሲ ጅረት (Electromagnetic Induction & AC)',
          om: 'Boqonnaa 2: Elektiroomaagneetizimii fi AC',
          ti: 'ምዕራፍ 2፡ ኤሌክትሮማግኔቲክ ኢንዳክሽን',
          ar: 'الوحدة 2: الحث الكهرومغناطيسي وتيارات المتردد (AC)',
          so: 'Cutubka 2: Indhisheenta Korontada iyo Magnetka',
          en: 'Unit 2: Faraday Induction, Transformers, and AC Circuits',
        },
        summary: {
          am: 'የፋራዳይ ህግ፣ የሌንዝ ህግ፣ የትራንስፎርመር ቀመሮች ($\\frac{V_s}{V_p} = \\frac{N_s}{N_p}$) እና የታላቁ የህዳሴ ግድብ (GERD) የሃይድሮ-ኤሌክትሪክ ተርባይኖች አሰራር።',
          om: 'Seera Faaraadaay fi tiraansifoormerii qorachuu.',
          ti: 'ሕጊ ፋራዳይን ትራንስፎርመርን።',
          ar: 'قانون فاراداي، قاعدة لينز، المحولات الكهربائية، ومحاكاة توربينات سد النهضة الإثيوبي الكبير.',
          so: 'Sharciga Faraday iyo beddelayaasha korontada.',
          en: 'Faraday flux linkages, Lenz counter-torque, transformer step-up equations, and hydroelectric generation physics.',
        },
        keyFormulas: [
          '\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}',
          '\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}',
          'X_L = 2\\pi f L, \\quad X_C = \\frac{1}{2\\pi f C}',
        ],
      },
    ],
    sampleExercises: [
      {
        questionNumber: 1,
        question: {
          am: 'አንድ ተወንጫፊ በ $v_0 = 40\\text{ m/s}$ ፍጥነት በ $\\theta = 30^\\circ$ ማዕዘን ቢወነጨፍ፣ ከፍተኛ ከፍታው (Maximum Height) ስንት ይሆናል? ($g = 10\\text{ m/s}^2$)',
          om: 'Piroojeektaayiliin tokko $v_0 = 40\\text{ m/s}$ fi $\\theta = 30^\\circ$ ta\'ee yoo darbatame, olka\'iinsi isaa meeqa? ($g = 10\\text{ m/s}^2$)',
          ti: 'ናይ ሓደ ፕሮጀክትይል ዝለዓለ ቁመት ክንደይ ይኸውን? ($v_0 = 40\\text{ m/s}, \\theta = 30^\\circ, g = 10\\text{ m/s}^2$)',
          ar: 'أُطلق مقذوف بسرعة ابتدائية $v_0 = 40\\text{ m/s}$ وبزاوية $30^\\circ$ مع الأفق. ما هو أقصى ارتفاع يصله المقذوف؟ ($g = 10\\text{ m/s}^2$)',
          so: 'Waa maxay dhererka ugu sarreeya ee uu gaari karo? ($v_0 = 40\\text{ m/s}, \\theta = 30^\\circ$)',
          en: 'A projectile is launched with an initial velocity of $40\\text{ m/s}$ at an angle of $30^\\circ$ above the horizontal. Find its maximum height ($g = 10\\text{ m/s}^2$).',
        },
        options: ['A. 20 m', 'B. 40 m', 'C. 80 m', 'D. 10 m'],
        correctAnswer: 'A. 20 m',
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ የቋሚ ቬሎሲቲውን ክፍል እናገኛለን፡ $v_{0y} = v_0 \\sin(\\theta) = 40 \\times \\sin(30^\\circ) = 40 \\times 0.5 = 20\\text{ m/s}$።',
            om: 'v_0y = 40 * sin(30) = 20 m/s.',
            ti: 'v_0y = 40 * sin(30) = 20 m/s.',
            ar: 'المركبة الرأسية للسرعة الابتدائية: $v_{0y} = v_0 \\sin(30^\\circ) = 40 \\times 0.5 = 20\\text{ m/s}$.',
            so: 'v_0y = 40 * sin(30) = 20 m/s.',
            en: 'Calculate vertical component: $v_{0y} = v_0 \\sin(30^\\circ) = 40 \\times 0.5 = 20\\text{ m/s}$.',
          },
          {
            am: 'ደረጃ 2፡ ከፍተኛ ከፍታ ላይ $v_y = 0$ ይሆናል። ቀመሩ፡ $H_{max} = \\frac{v_{0y}^2}{2g} = \\frac{20^2}{2 \\times 10} = \\frac{400}{20} = 20\\text{ m}$።',
            om: 'H_max = (20)^2 / (2 * 10) = 400 / 20 = 20 m.',
            ti: 'H_max = (20)^2 / 20 = 20 m.',
            ar: 'عند أقصى ارتفاع تصبح السرعة الرأسية صفراً: $H_{max} = \\frac{v_{0y}^2}{2g} = \\frac{20^2}{20} = 20\\text{ m}$.',
            so: 'H_max = 400 / 20 = 20 m.',
            en: 'Using kinematic relation: $H_{max} = \\frac{v_{0y}^2}{2g} = \\frac{400}{20} = 20\\text{ m}$.',
          },
        ],
      },
    ],
  },

  // 3. Extreme Chemistry
  {
    id: 'supp-extreme-chem',
    series: 'Extreme',
    title: {
      am: 'ኤክስትሪም ኬሚስትሪ ማጠቃለያ (Extreme Chemistry Grade 11 & 12)',
      om: 'Extreme Keemistirii Kutaa 11 fi 12',
      ti: 'ኤክስትሪም ኬሚስትሪ መጽሓፍ',
      ar: 'سلسلة إكستريم: المرجع المتكامل في الكيمياء للصفين 11 و 12',
      so: 'Extreme Kimisteriga Fasallada 11 & 12',
      en: 'Extreme Chemistry: National Examination Guide (Grades 11 & 12)',
    },
    author: 'Extreme Academic Editorial Board (Addis Ababa)',
    edition: '2024/2025 Revised 7th Edition',
    publicationYear: '2024 G.C.',
    subjectCode: 'CHEM',
    gradeSpan: 'Grades 11 - 12',
    totalPages: 364,
    coverColor: 'emerald',
    badgeLabel: {
      am: 'የላቀ የኬሚስትሪ አጋዥ',
      om: 'Kitaaba Keemistirii Filatamaa',
      ti: 'ብሉጽ መጽሓፍ ኬሚስትሪ',
      ar: 'المرجع الشامل في الكيمياء',
      so: 'Buugga Sare ee Kimisteriga',
      en: 'Advanced Chemistry Guide',
    },
    description: {
      am: 'የኬሚካል ሚዛን፣ ቴርሞዳይናሚክስ፣ የአሲድ-ቤዝ ባፈር ስሌት፣ ኤሌክትሮኬሚስትሪ እና ኦርጋኒክ ኬሚስትሪን በስፋት የሚያስረዳ ሁነኛ ማጣቀሻ።',
      om: 'Ikoonoomiksii keemikaalaa fi orgaanik keemistirii of keessaa qaba.',
      ti: 'ናይ ኬሚስትሪ ባፈር፣ ሚዛንን ኦርጋኒክን ዝሓዘ መጽሓፍ።',
      ar: 'شرح معمق للاتزان الكيميائي ومحاليل الحماية المنظمة (Buffer Solutions) والكيمياء العضوية والكهروكيميائية.',
      so: 'Sharaxaada dhamaystiran ee kimisteriga sare.',
      en: 'In-depth coverage of chemical equilibria, Le Chatelier principles, Henderson-Hasselbalch buffer calculations, and galvanic cell energetics.',
    },
    chapters: [
      {
        chapterNumber: 1,
        title: {
          am: 'ምዕራፍ 1፡ የአሲድ-ቤዝ ሚዛን እና ባፈሮች (Acid-Base Equilibria & Buffers)',
          om: 'Boqonnaa 1: Madaallii Asidii fi Beezii',
          ti: 'ምዕራፍ 1፡ ሚዛን ኣሲድን ቤዝን',
          ar: 'الوحدة 1: اتزان الأحماض والقواعد ومحاليل البفر المنظمة',
          so: 'Cutubka 1: Dheellitirka Aashitada iyo Saldhigga',
          en: 'Unit 1: Acid-Base Equilibria and Buffer Systems',
        },
        summary: {
          am: 'የደካማ አሲዶች መፍረስ ቋሚ ቁጥር ($K_a$)፣ የሄንደርሰን-ሃሰልባልች ፎርሙላ ($\\text{pH} = \\text{pK}_a + \\log\\frac{[\\text{A}^-]}{[\\text{HA}]}$) እና የባፈር አቅም (Buffer capacity)።',
          om: 'Shallaggii pH fi foormulaa Henderson-Hasselbalch.',
          ti: 'ስሌት pH ናይ ባፈር ውህደት።',
          ar: 'ثابت تأين الأحماض الضعيفة، معادلة هندرسون-هاسلبالخ، وحساب التغير في الرقم الهيدروجيني عند إضافة أحماض أو قواعد.',
          so: 'Xisaabinta pH iyo habka Henderson-Hasselbalch.',
          en: 'Acid ionization constants, conjugate acid-base pairs, Henderson-Hasselbalch buffer derivation, and pH titration curves.',
        },
        keyFormulas: [
          '\\text{pH} = \\text{pK}_a + \\log\\left(\\frac{[\\text{Conjugate Base}]}{[\\text{Weak Acid}]}\\right)',
          '\\text{pH} + \\text{pOH} = 14.00 \\text{ at } 25^\\circ\\text{C}',
          'K_w = [\\text{H}^+][\\text{OH}^-] = 1.0 \\times 10^{-14}',
        ],
      },
    ],
    sampleExercises: [
      {
        questionNumber: 1,
        question: {
          am: 'አንድ የባፈር መፍትሄ $0.20\\text{ M CH}_3\\text{COOH}$ እና $0.20\\text{ M CH}_3\\text{COONa}$ ይዟል። የዚህ መፍትሄ pH ስንት ይሆናል? ($K_a = 1.8 \\times 10^{-5}$)',
          om: 'Bulbula baafarii $0.20\\text{ M CH}_3\\text{COOH}$ fi $0.20\\text{ M CH}_3\\text{COONa}$ qabuuf pH meeqa ta\'a? ($K_a = 1.8 \\times 10^{-5}$)',
          ti: 'ናይዚ ባፈር pH ክንደይ እዩ? ($K_a = 1.8 \\times 10^{-5}$)',
          ar: 'محلول منظم يتكون من حمض الأسيتيك 0.20M وأسيتات الصوديوم 0.20M. ما هو الرقم الهيدروجيني pH للمحلول؟ علماً بأن $K_a = 1.8 \\times 10^{-5}$',
          so: 'Waa maxay pH-ka xalka baafarka? ($K_a = 1.8 \\times 10^{-5}$)',
          en: 'A buffer solution contains $0.20\\text{ M CH}_3\\text{COOH}$ and $0.20\\text{ M CH}_3\\text{COONa}$. Calculate the pH of this solution ($K_a = 1.8 \\times 10^{-5}$).',
        },
        options: ['A. 4.74', 'B. 7.00', 'C. 5.20', 'D. 3.80'],
        correctAnswer: 'A. 4.74',
        stepByStepSolution: [
          {
            am: 'ደረጃ 1፡ $\\text{pK}_a = -\\log(1.8 \\times 10^{-5}) = 4.74$ ይሰላል።',
            om: 'pK_a = -log(1.8 * 10^-5) = 4.74.',
            ti: 'pK_a = 4.74 ይኸውን።',
            ar: 'حساب $\\text{pK}_a = -\\log(K_a) = -\\log(1.8 \\times 10^{-5}) = 4.74$.',
            so: 'pK_a = 4.74.',
            en: 'Compute $\\text{pK}_a = -\\log(1.8 \\times 10^{-5}) = 4.74$.',
          },
          {
            am: 'ደረጃ 2፡ በሄንደርሰን-ሃሰልባልች ቀመር፡ $\\text{pH} = \\text{pK}_a + \\log(\\frac{0.20}{0.20}) = 4.74 + \\log(1) = 4.74 + 0 = 4.74$።',
            om: 'pH = 4.74 + log(1) = 4.74.',
            ti: 'pH = 4.74 + 0 = 4.74.',
            ar: 'بتطبيق معادلة هندرسون: $\\text{pH} = 4.74 + \\log(\\frac{0.20}{0.20}) = 4.74 + 0 = 4.74$.',
            so: 'pH = 4.74.',
            en: 'Apply Henderson-Hasselbalch: $\\text{pH} = 4.74 + \\log(1) = 4.74$.',
          },
        ],
      },
    ],
  },

  // 4. Alpha Series National Examination Workbook
  {
    id: 'supp-alpha-workbook',
    series: 'Alpha',
    title: {
      am: 'አልፋ ሴሪስ የዩኒቨርሲቲ መግቢያ ፈተናዎች ማሰልጠኛ (Alpha Series EUEE Model Workbook)',
      om: 'Alpha Series Qophii Qormaata Yuunivarsiitii',
      ti: 'ኣልፋ ሴሪስ ናይ ፈተና መጽሓፍ',
      ar: 'سلسلة ألفا: بنك النماذج التدريبية للامتحانات الوطنية الوزارية',
      so: 'Alpha Series Buugga Tababarka Imtixaanka Qaranka',
      en: 'Alpha Series: National University Entrance Model Workbook',
    },
    author: 'Alpha Academic Editorial Consortium',
    edition: '2024/2026 Edition - Comprehensive 10 Model Papers',
    publicationYear: '2025 G.C.',
    subjectCode: 'ALL',
    gradeSpan: 'Grade 12',
    totalPages: 480,
    coverColor: 'purple',
    badgeLabel: {
      am: 'የሞዴል ፈተናዎች ስብስብ',
      om: 'Qormaata Moodeelaa',
      ti: 'ናይ ሞዴል ፈተናታት',
      ar: 'نماذج امتحانات وزارية',
      so: 'Tusmooyinka Imtixaanka',
      en: 'Full Model Exams',
    },
    description: {
      am: '10 ሙሉ የብሔራዊ ፈተና የሞዴል ጥያቄዎችን በጊዜ ገደብ መለማመጃ ሰዓት እና ዝርዝር የማስተካከያ ሩብሪክ ያካተተ የተሟላ የፈተና አጋዥ።',
      om: 'Qormaata moodeelaa 10 deebii guutuu waliin qaba.',
      ti: '10 ምሉእ ናይ ፈተና ሞዴላት ዝሓዘ።',
      ar: 'يحتوي على 10 نماذج امتحانية كاملة تحاكي امتحان الوزارة الرسمي مع مقاييس التصحيح وتوزيع الدرجات.',
      so: '10 imtixaan oo tusaale ah oo leh jawaabo faahfaahsan.',
      en: 'Ten authentic full-length timed model examination papers for Natural and Social Science matric candidates with distractor traps unpacked.',
    },
    chapters: [
      {
        chapterNumber: 1,
        title: {
          am: 'ክፍል 1፡ የተፈጥሮ ሳይንስ ሞዴል ፈተናዎች 1 - 5 (Natural Science Models)',
          om: 'Kutaa 1: Qormaata Moodeelaa 1-5',
          ti: 'ክፍሊ 1፡ ሞዴል ፈተናታት 1-5',
          ar: 'القسم 1: النماذج الامتحانية للفرع العلمي (1-5)',
          so: 'Qaybta 1: Imtixaanada Sayniska Dabiiciga ah',
          en: 'Section 1: Natural Science Full Simulation Tests (Math, Phys, Chem, Bio)',
        },
        summary: {
          am: 'እያንዳንዳቸው 60 ጥያቄዎችን የያዙ 5 የተሟሉ የተፈጥሮ ሳይንስ የሞዴል ፈተናዎች ከመልስ ማብራሪያቸው ጋር።',
          om: 'Qormaata 5 qabiyyee guutuu waliin.',
          ti: '5 ምሉኣት ሞዴላት ምስ መብርሂኦም።',
          ar: 'خمسة امتحانات تجريبية كاملة تشمل 60 سؤالاً لكل مادة مع توضيح خطوات الحل الصحيحة.',
          so: 'Shan imtixaan oo buuxa oo leh xalal.',
          en: 'Five timed simulation exams reflecting the exact MoE cognitive domain weights (30% recall, 45% application, 25% synthesis).',
        },
        keyFormulas: [
          'EUEE Exam Time: 120 Minutes per Section',
          'Cut-off Threshold Reference: 350+ for University Placement',
        ],
      },
    ],
    sampleExercises: [
      {
        questionNumber: 1,
        question: {
          am: 'በኢትዮጵያ ስርዓተ-ትምህርት መሰረት፣ የሰው ልጅ 2n የክሮሞሶም ቁጥር ስንት ነው?',
          om: 'Lakkoofsi kiroomoosomii namaa (2n) meeqa?',
          ti: 'ቁፅሪ ክሮሞሶም ናይ ሰብ (2n) ክንደይ እዩ?',
          ar: 'في الخلية الجسدية للإنسان، كم يبلغ العدد الثنائي للكروموسومات (2n)؟',
          so: 'Meeqa koromosoom ayaa ku jira unugga aadanaha (2n)?',
          en: 'In human somatic cells, what is the diploid number of chromosomes (2n)?',
        },
        options: ['A. 46 (23 pairs)', 'B. 23 single', 'C. 48', 'D. 92'],
        correctAnswer: 'A. 46 (23 pairs)',
        stepByStepSolution: [
          {
            am: 'የሰው ልጅ በሶማቲክ ህዋስ ውስጥ 23 ጥንድ ወይም በድምሩ 46 ክሮሞሶሞች (22 ጥንድ autosomes እና 1 ጥንድ sex chromosomes) አሉት።',
            om: 'Namni kiroomoosomii 46 qaba.',
            ti: 'ሰብ 46 ክሮሞሶም ኣለዎ።',
            ar: 'تحتوي الخلايا الجسدية للإنسان على 46 كروموسوماً موزعة في 23 زوجاً (22 زوجاً جسمياً وزوج واحد جنسي).',
            so: 'Bani\'aadamku wuxuu leeyahay 46 koromosoom.',
            en: 'Humans carry 23 pairs of chromosomes totaling 46 (22 autosomal pairs + 1 sex chromosome pair).',
          },
        ],
      },
    ],
  },

  // 5. Galaxy Series EUEE Past 10-Year Exam Bank
  {
    id: 'supp-galaxy-bank',
    series: 'Galaxy',
    title: {
      am: 'ጋላክሲ ሴሪስ የ10 ዓመታት የብሔራዊ ፈተናዎች ጥራዝ (Galaxy Series EUEE 10-Year Bank)',
      om: 'Galaxy Series Qormaata Waggaa 10',
      ti: 'ጋላክሲ ሴሪስ ናይ 10 ዓመታት ፈተናታት',
      ar: 'سلسلة جلاكسي: البنك الذهبي لأسئلة امتحانات القبول الجامعي لعشر سنوات',
      so: 'Galaxy Series Baanka Imtixaanaadka 10-ka Sano',
      en: 'Galaxy Series: Past 10-Year EUEE Question Bank (2014-2024)',
    },
    author: 'Galaxy Academic Publishing Bureau',
    edition: '2024 Collector\'s Archive Edition',
    publicationYear: '2024 G.C.',
    subjectCode: 'ALL',
    gradeSpan: 'Grade 12',
    totalPages: 520,
    coverColor: 'cyan',
    badgeLabel: {
      am: 'የ10 ዓመት ጥራዝ (10-Yr Archive)',
      om: 'Kuusaa Waggaa 10',
      ti: 'ናይ 10 ዓመት ጥራዝ',
      ar: 'أرشيف 10 سنوات',
      so: 'Kaydka 10-ka Sano',
      en: '10-Year Golden Archive',
    },
    description: {
      am: 'ከ 2014 እስከ 2024 ዓ.ም የወጡትን ይፋዊ የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተናዎች (EUEE) በምዕራፍ በምዕራፍ ከፋፍሎ ከእነ ዝርዝር ማብራሪያቸው የሚያቀርብ ታላቅ ጥራዝ።',
      om: 'Qormaata EUEE waggoota 10 darban hunda boqonnaan adda baasee kan dhiyeesse.',
      ti: 'ናይ ዝሓለፉ 10 ዓመታት ፈተናታት ብምዕራፍ ተኸፋፊሉ ዝተዳለወ።',
      ar: 'أضخم تجميع لأسئلة امتحانات القبول الجامعي الوزارية مصنفة حسب الوحدات والدروس لتمكين الطالب من مراجعة كل فصل على حدة.',
      so: 'Baanka imtixaanada 10-kii sano ee la soo dhaafay oo loo qaybiyay cutubyo.',
      en: 'Topically classified compendium of all official Ethiopian Ministry of Education entrance exam questions across a decade with error forensics.',
    },
    chapters: [
      {
        chapterNumber: 1,
        title: {
          am: 'ክፍል 1፡ የሂሳብ ባለፉት 10 ዓመታት የተደጋገሙ ቁልፍ ጥያቄዎች (Top Recurring Math Questions)',
          om: 'Kutaa 1: Herrega Waggoota 10',
          ti: 'ክፍሊ 1፡ ናይ 10 ዓመታት ዝተደጋገሙ ሕቶታት ሒሳብ',
          ar: 'القسم 1: الأسئلة الأكثر تكراراً في الرياضيات عبر 10 سنوات',
          so: 'Qaybta 1: Su\'aalaha Xisaabta ee ugu soo noqnoqoshada badan',
          en: 'Section 1: High-Frequency Recurring Mathematics Examination Trends',
        },
        summary: {
          am: 'ባለፉት 10 ዓመታት ውስጥ በብዛት የተደጋገሙ የካልኩለስ፣ የኮምፕሌክስ ቁጥሮች እና የስቶካስቲክስ ጥያቄዎች ትንታኔ።',
          om: 'Qormaata herregaa yeroo baay\'ee deddeebi\'e.',
          ti: 'ዝተደጋገሙ ሕቶታት ካልኩለስን ኮምፕሌክስ ቁፅርን።',
          ar: 'تحليل دقيق لأكثر من 300 سؤال متكرر في النهايات والاشتقاق والتكامل والأعداد المركبة.',
          so: 'Falanqaynta su\'aalaha xisaabta ee ugu muhiimsan.',
          en: 'Empirical analysis of 300+ recurring matric test items with distractor traps and common misconceptions dissected.',
        },
        keyFormulas: [
          'Calculus Weight in EUEE: ~32% of total exam marks',
          'Vectors and 3D Geometry: ~18% of exam marks',
        ],
      },
    ],
    sampleExercises: [
      {
        questionNumber: 1,
        question: {
          am: 'የኮምፕሌክስ ቁጥር $z = 3 + 4i$ ሞጁለስ (Modulus |z|) ስንት ነው?',
          om: 'Modulus lakkoofsa kompileeksii $z = 3 + 4i$ meeqa?',
          ti: 'ሞጁለስ ናይቲ ኮምፕሌክስ ቁፅሪ $z = 3 + 4i$ ክንደይ እዩ?',
          ar: 'ما هي القيمة المطلقة (المقياس Modulus) للعدد المركب $z = 3 + 4i$؟',
          so: 'Waa maxay modulus-ka tirada adag $z = 3 + 4i$?',
          en: 'What is the modulus (|z|) of the complex number $z = 3 + 4i$?',
        },
        options: ['A. 5', 'B. 7', 'C. 25', 'D. 1'],
        correctAnswer: 'A. 5',
        stepByStepSolution: [
          {
            am: 'ቀመሩ፡ $|z| = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$።',
            om: '|z| = sqrt(3^2 + 4^2) = sqrt(25) = 5.',
            ti: '|z| = sqrt(9 + 16) = 5.',
            ar: 'القانون: $|z| = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.',
            so: '|z| = sqrt(25) = 5.',
            en: 'Formula: $|z| = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.',
          },
        ],
      },
    ],
  },
];

export const SupplementaryBooksView: React.FC = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { isUnlocked } = useSubscription();
  const { language, isRtl } = useLanguage();

  // Premium Access determination: Super Admin has lifetime root bypass
  const hasPremiumAccess = isSuperAdmin || isUnlocked || currentUser.isPremium;

  // State
  const [selectedSeries, setSelectedSeries] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBookId, setActiveBookId] = useState<string>(SUPPLEMENTARY_BOOKS_CATALOG[0].id);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  // Filtered books catalog
  const filteredBooks = useMemo(() => {
    return SUPPLEMENTARY_BOOKS_CATALOG.filter((book) => {
      const matchSeries = selectedSeries === 'ALL' || book.series === selectedSeries;
      const matchSubject = selectedSubject === 'ALL' || book.subjectCode === selectedSubject || book.subjectCode === 'ALL';
      const titleStr = (book.title[language] || book.title.en).toLowerCase();
      const authorStr = book.author.toLowerCase();
      const queryStr = searchQuery.toLowerCase().trim();
      const matchSearch = !queryStr || titleStr.includes(queryStr) || authorStr.includes(queryStr);
      return matchSeries && matchSubject && matchSearch;
    });
  }, [selectedSeries, selectedSubject, searchQuery, language]);

  const activeBook = useMemo(() => {
    return (
      SUPPLEMENTARY_BOOKS_CATALOG.find((b) => b.id === activeBookId) ||
      SUPPLEMENTARY_BOOKS_CATALOG[0]
    );
  }, [activeBookId]);

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Hero Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-800/70 border border-indigo-600/40 text-xs font-bold tracking-wide uppercase text-indigo-200">
              <BookmarkCheck className="w-4 h-4 text-amber-300" />
              <span>National Examination Prep & Supplementary Guides</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <BookMarked className="w-7 h-7 text-indigo-400" />
              {language === 'am'
                ? 'የኢትዮጵያ ታዋቂ አጋዥ መጻሕፍት ማዕከል'
                : language === 'om'
                ? 'Kuusaa Kitaabota Gargaartuu Biyyoolessaa'
                : language === 'ti'
                ? 'ናይ ኢትዮጵያ ኣገደስቲ ሓገዝቲ መጻሕፍቲ'
                : language === 'ar'
                ? 'مركز مراجع وسلاسل التفوق لامتحانات الثانوية الإثيوبية'
                : language === 'so'
                ? 'Buugaagta Kaalmada ee Imtixaanaadka Qaranka'
                : 'Renowned Ethiopian Exam Prep Series'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
              {language === 'am'
                ? 'ታዋቂዎቹ የኤክስትሪም ሴሪስ (Extreme Series)፣ አልፋ ሴሪስ (Alpha Series) እና ጋላክሲ ሴሪስ (Galaxy Series) መጻሕፍት ከዝርዝር የመፍትሔ ማብራሪያዎች እና የቀመር ማጠቃለያዎች ጋር።'
                : language === 'om'
                ? 'Extreme Series, Alpha Series fi Galaxy Series shallaggiiwwan qormaata EUEE wajjin.'
                : language === 'ti'
                ? 'ኤክስትሪም ሴሪስ፣ ኣልፋ ሴሪስን ጋላክሲ ሴሪስን ምስ ዝርዝር መፍትሒታት።'
                : language === 'ar'
                ? 'سلاسل إكستريم (Extreme) وألفا (Alpha) وجلاكسي (Galaxy) المعتمدة لإعداد طلاب الثانوية والشهادة الجامعية مع حلول تفصيلية.'
                : language === 'so'
                ? 'Buugaagta Extreme, Alpha iyo Galaxy ee u diyaar garowga imtixaanka EUEE.'
                : 'Curated national exam workbooks: Extreme Series (Math, Physics, Chemistry, Biology), Alpha Model Workbooks, and Galaxy 10-Year Question Banks.'}
            </p>
          </div>

          {/* Access Status Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 self-start md:self-auto">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-inner"
              style={{
                backgroundColor: hasPremiumAccess ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                color: hasPremiumAccess ? '#34d399' : '#f87171',
              }}
            >
              {hasPremiumAccess ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold">
                {language === 'am' ? 'የፍቃድ ሁኔታ' : 'Access Level'}
              </div>
              <div className="text-base font-black text-white">
                {isSuperAdmin
                  ? 'Super Admin (Root Lifetime)'
                  : hasPremiumAccess
                  ? 'Premium Unlocked (ሙሉ ፍቃድ)'
                  : 'Locked for Premium (54 ETB)'}
              </div>
              <div className="text-[11px] text-indigo-200">
                {hasPremiumAccess ? 'All Series & Solutions Active' : 'Upgrade to view step-by-step workouts'}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 pt-4 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-3">
          {/* Series Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'ALL', label: 'All Series' },
              { id: 'Extreme', label: 'Extreme Series' },
              { id: 'Alpha', label: 'Alpha Series' },
              { id: 'Galaxy', label: 'Galaxy Series' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSeries(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedSeries === tab.id
                    ? 'bg-indigo-500 text-slate-950 border-indigo-400 shadow-sm font-black'
                    : 'bg-indigo-950/60 text-indigo-200 border-indigo-800/60 hover:bg-indigo-800/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'am' ? 'መጽሐፍ ወይም ርዕስ ፈልግ...' : 'Search series or topic...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-indigo-700/60 text-xs text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Non-Premium Notice Banner */}
      {!hasPremiumAccess && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">
                {language === 'am'
                  ? 'የአጋዥ መጻሕፍት ማዕከል ለፕሪሚየም አባላት ብቻ ክፍት ነው'
                  : 'Supplementary Exam Guides are reserved for Premium Subscribers.'}
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                {language === 'am'
                  ? 'በ 54 የኢትዮጵያ ብር (ወይም የ 160-200 ብር ወርሃዊ ፓኬጅ) የሙሉ ኤክስትሪም ሴሪስ የተሰሩ መልሶች እና ቀመሮችን ያግኙ።'
                  : 'Unlock complete worked solutions for Extreme, Alpha, and Galaxy series for 54 ETB or with your active monthly subscription.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm text-xs cursor-pointer">
              {language === 'am' ? 'ፕሪሚየም ይክፈቱ (Upgrade)' : 'Upgrade to Premium'}
            </span>
          </div>
        </div>
      )}

      {/* 2-Column Layout: Catalog List & Interactive Book View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Book Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>
              {language === 'am' ? 'የመጻሕፍት ዝርዝር' : 'Available Textbooks'} ({filteredBooks.length})
            </span>
            <span>Grade 11 - 12 Focused</span>
          </div>

          <div className="space-y-3">
            {filteredBooks.map((book) => {
              const isSelected = book.id === activeBookId;

              return (
                <div
                  key={book.id}
                  onClick={() => {
                    setActiveBookId(book.id);
                    setExpandedChapter(1);
                    setExpandedExercise(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {book.series} Series
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        {book.gradeSpan}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {book.title[language] || book.title.en}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {book.description[language] || book.description.en}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{book.totalPages} Pages</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 text-[11px]">
                      {language === 'am' ? 'ማጠቃለያውን ክፈት' : 'Inspect Chapters'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Book Interactive Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header Metadata */}
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
                  {activeBook.badgeLabel[language] || activeBook.badgeLabel.en}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Edition: {activeBook.edition}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {activeBook.title[language] || activeBook.title.en}
              </h2>
              <p className="text-xs text-slate-500">
                Author / Editorial: {activeBook.author} • Published: {activeBook.publicationYear}
              </p>
            </div>

            {/* Chapter Summaries Accordion */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>
                  {language === 'am' ? 'የምዕራፍ ማጠቃለያዎች እና ቁልፍ ቀመሮች' : 'Chapter Summaries & Key Formulas'}
                </span>
              </h3>

              <div className="space-y-2.5">
                {activeBook.chapters.map((chap) => {
                  const isOpen = expandedChapter === chap.chapterNumber;

                  return (
                    <div
                      key={chap.chapterNumber}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/60"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedChapter(isOpen ? null : chap.chapterNumber)}
                        className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {chap.title[language] || chap.title.en}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-1 space-y-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {chap.summary[language] || chap.summary.en}
                          </p>

                          {/* Key Formulas Strip */}
                          <div className="space-y-1.5 pt-2">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] uppercase tracking-wider block">
                              Essential Formulas for National Exam:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {chap.keyFormulas.map((f, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-indigo-950 dark:text-indigo-200"
                                >
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Practice Exercises Section (Protected for Premium / Root Admin) */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'am' ? 'የተሰሩ የፈተና ጥያቄዎች (Sample Practice Exercises)' : 'Worked Exam Exercises'}
                  </span>
                </h3>
                {!hasPremiumAccess && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <Lock className="w-3.5 h-3.5" /> Premium Only
                  </span>
                )}
              </div>

              {hasPremiumAccess ? (
                <div className="space-y-3">
                  {activeBook.sampleExercises.map((ex, exIdx) => {
                    const isExOpen = expandedExercise === exIdx;

                    return (
                      <div
                        key={exIdx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            Exercise #{ex.questionNumber}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 font-mono">
                            {ex.correctAnswer}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed">
                          {ex.question[language] || ex.question.en}
                        </h4>

                        {ex.options && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {ex.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`p-2 rounded-lg border text-[11px] font-medium ${
                                  opt === ex.correctAnswer
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step-by-Step Toggle */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setExpandedExercise(isExOpen ? null : exIdx)}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>{isExOpen ? 'ደረጃ በደረጃ አሰራሩን ደብቅ' : 'ደረጃ በደረጃ አሰራሩን ተመልከት (Step-by-Step Solution)'}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${isExOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {isExOpen && (
                            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in">
                              <span className="font-bold text-slate-500 uppercase text-[10px] block">
                                Mathematical Derivation & Proof:
                              </span>
                              {ex.stepByStepSolution.map((step, sIdx) => (
                                <p
                                  key={sIdx}
                                  className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed"
                                >
                                  {step[language] || step.en}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Paywall locked preview */
                <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'am' ? 'የተሰሩ የፈተና ጥያቄዎች ተቆልፈዋል' : 'Worked Past Exam Solutions are Locked'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === 'am'
                      ? 'የኤክስትሪም ሴሪስ ደረጃ በደረጃ የተሰሩ ስሌቶችን እና የፈተና ዘዴዎችን ለመመልከት ፕሪሚየም ፍቃድ ያስፈልጋል።'
                      : 'Subscribe to access full step-by-step mathematical proofs and distractor analyses.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
