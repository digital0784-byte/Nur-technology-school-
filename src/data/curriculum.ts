import { CurriculumSubject, GradeLevel, Language } from '../types';
import { GRADE_10_MATH_SUBJECT, GRADE_10_PHYSICS_SUBJECT } from './grade10Curriculum';

export const CURRICULUM_DATA: CurriculumSubject[] = [
  // ================= GRADE 9 =================
  {
    id: 'g9-math',
    code: 'MATH-9',
    grade: 9,
    icon: 'Calculator',
    color: 'emerald',
    name: {
      am: 'ሂሳብ',
      om: 'Herrega',
      ti: 'ማቴማቲክስ',
      ar: 'الرياضيات',
      so: 'Xisaab',
      en: 'Mathematics',
    },
    units: [
      {
        id: 'g9-math-u1',
        unitNumber: 1,
        title: 'Further on Sets',
        description: 'Set operations, Venn diagrams, Cartesian products, and applications in Ethiopian demographic surveys.',
        topics: [
          {
            id: 'g9-m-t1',
            title: 'Operations on Sets & Subsets',
            competencyObjectives: [
              'Perform union, intersection, difference, and complement of sets',
              'Draw and analyze 3-set Venn diagrams',
              'Apply set theory to analyze regional agriculture census data',
            ],
            summary: 'Understanding set algebra, subsets, power sets, and problem solving using Cardinality formulas: n(A ∪ B) = n(A) + n(B) - n(A ∩ B).',
            content: 'In this unit, Ethiopian students examine how sets categorize natural resources, agricultural zones (Dega, Weyna Dega, Kolla), and demographic subsets.',
            ethiopianExample: 'Categorizing cereal production (Teff, Wheat, Barley) across Oromia, Amhara, and Tigray agricultural cooperatives.',
            estimatedStudyMinutes: 35,
            pageReference: 'MoE Grade 9 Math, pp. 1-28',
          },
          {
            id: 'g9-m-t2',
            title: 'Cartesian Product and Binary Relations',
            competencyObjectives: [
              'Define ordered pairs and Cartesian products A × B',
              'Determine domain and range of binary relations',
              'Identify reflexive, symmetric, and transitive relations',
            ],
            summary: 'Formal treatment of ordered pairs and graph representations of relations in coordinate geometry.',
            content: 'A binary relation R from set A to set B is a subset of the Cartesian product A × B. We explore coordinate mappings and real-world pairings.',
            ethiopianExample: 'Mapping Ethiopian cities to their average elevations above sea level (Addis Ababa: 2,355m, Hawassa: 1,708m, Mekelle: 2,084m).',
            estimatedStudyMinutes: 40,
            pageReference: 'MoE Grade 9 Math, pp. 29-54',
          },
        ],
      },
      {
        id: 'g9-math-u2',
        unitNumber: 2,
        title: 'The Number System',
        description: 'Rational numbers, irrational numbers, real numbers, and radical expressions.',
        topics: [
          {
            id: 'g9-m-t3',
            title: 'Irrational Numbers and Radicals',
            competencyObjectives: [
              'Distinguish between rational and irrational numbers',
              'Simplify radicals using conjugate rationalization',
              'Apply real numbers in geometric measurements',
            ],
            summary: 'Properties of real numbers, proofs that √2 and √3 are irrational, and rationalizing denominators.',
            content: 'Real numbers form the bedrock of physics and engineering calculations in Ethiopian infrastructure development.',
            ethiopianExample: 'Calculating cable tensions for the Abay Bridge construction using radical expressions.',
            estimatedStudyMinutes: 30,
            pageReference: 'MoE Grade 9 Math, pp. 55-88',
          },
        ],
      },
      {
        id: 'g9-math-u3',
        unitNumber: 3,
        title: 'Solving Linear Equations and Inequalities',
        description: 'Linear equations in one and two variables, systems of linear equations, and linear inequalities.',
        topics: [
          {
            id: 'g9-m-t4',
            title: 'Systems of Two Linear Equations',
            competencyObjectives: [
              'Solve systems using substitution and elimination methods',
              'Interpret intersection points graphically',
              'Formulate linear models for local market trading',
            ],
            summary: 'Simultaneous equations with unique, infinite, or no solutions, and economic break-even points.',
            content: 'Finding simultaneous equilibrium where supply equals demand in local Ethiopian grain markets.',
            ethiopianExample: 'Pricing combinations of Coffee beans and Chat at Merkato wholesale markets.',
            estimatedStudyMinutes: 45,
            pageReference: 'MoE Grade 9 Math, pp. 89-130',
          },
        ],
      },
    ],
  },
  {
    id: 'g9-phys',
    code: 'PHYS-9',
    grade: 9,
    icon: 'Zap',
    color: 'amber',
    name: {
      am: 'ፊዚክስ',
      om: 'Fiiziksii',
      ti: 'ፊዚክስ',
      ar: 'الفيزياء',
      so: 'Fisikis',
      en: 'Physics',
    },
    units: [
      {
        id: 'g9-phys-u1',
        unitNumber: 1,
        title: 'Physics and Human Society',
        description: 'The nature of physics, SI units, scientific measurement, and historical contributions.',
        topics: [
          {
            id: 'g9-p-t1',
            title: 'Scientific Measurement & Uncertainties',
            competencyObjectives: [
              'Use vernier calipers and micrometer screw gauges accurately',
              'Calculate absolute and percentage uncertainties',
              'Convert standard SI derived units',
            ],
            summary: 'Precision vs accuracy, significant figures, and measurement techniques in laboratory setups.',
            content: 'Measurement is the core of experimental sciences, essential in Ethiopian engineering projects.',
            ethiopianExample: 'Measuring hydrological flow meters in the Blue Nile / Abbay River basin.',
            estimatedStudyMinutes: 30,
            pageReference: 'MoE Grade 9 Physics, pp. 1-32',
          },
        ],
      },
      {
        id: 'g9-phys-u2',
        unitNumber: 2,
        title: 'Motion in One Dimension',
        description: 'Kinematics, uniform motion, accelerated motion, and graphical analysis of velocity-time graphs.',
        topics: [
          {
            id: 'g9-p-t2',
            title: 'Uniformly Accelerated Motion & Equations',
            competencyObjectives: [
              'Derive the four kinematic equations: v = u + at, s = ut + 0.5at², etc.',
              'Interpret distance-time and velocity-time graphs',
              'Solve vertical free-fall under gravity (g = 9.8 m/s²)',
            ],
            summary: 'Quantitative modeling of constant acceleration and free fall dynamics.',
            content: 'Kinematics allows us to predict the trajectory and timing of vehicles and falling objects.',
            ethiopianExample: 'Analyzing braking distances on the Addis-Adama Expressway.',
            estimatedStudyMinutes: 45,
            pageReference: 'MoE Grade 9 Physics, pp. 33-76',
          },
        ],
      },
      {
        id: 'g9-phys-u3',
        unitNumber: 3,
        title: 'Forces and Newton’s Laws of Motion',
        description: 'Inertia, momentum, Newton’s 1st, 2nd, and 3rd laws, friction, and equilibrium.',
        topics: [
          {
            id: 'g9-p-t3',
            title: 'Newton’s Second Law and Friction',
            competencyObjectives: [
              'State and apply F_net = m · a',
              'Distinguish between static and kinetic friction',
              'Draw free-body diagrams for inclined planes',
            ],
            summary: 'Force interactions, coefficient of friction μ, and dynamic equilibrium.',
            content: 'Understanding how force creates acceleration and how friction provides necessary grip.',
            ethiopianExample: 'Heavy freight trucks climbing the Entoto Mountain incline pass.',
            estimatedStudyMinutes: 50,
            pageReference: 'MoE Grade 9 Physics, pp. 77-120',
          },
        ],
      },
    ],
  },
  {
    id: 'g9-chem',
    code: 'CHEM-9',
    grade: 9,
    icon: 'FlaskConical',
    color: 'indigo',
    name: {
      am: 'ኬሚስትሪ',
      om: 'Keemistirii',
      ti: 'ኬሚስትሪ',
      ar: 'الكيمياء',
      so: 'Kiimistariga',
      en: 'Chemistry',
    },
    units: [
      {
        id: 'g9-chem-u1',
        unitNumber: 1,
        title: 'Structure of the Atom',
        description: 'Subatomic particles, atomic models, electron configuration, and the periodic table.',
        topics: [
          {
            id: 'g9-c-t1',
            title: 'Bohr’s Model & Electron Configuration',
            competencyObjectives: [
              'Identify protons, neutrons, and electrons',
              'Write electronic configurations up to element 20 using 2n² rule',
              'Relate valence electrons to group number in the periodic table',
            ],
            summary: 'Atomic theory development from Dalton to Bohr, isotopes, and atomic masses.',
            content: 'The atomic structure determines chemical reactivity and bonding characteristics.',
            ethiopianExample: 'Tantalum and Gold mineral extraction in the Kenticha deposits of southern Ethiopia.',
            estimatedStudyMinutes: 35,
            pageReference: 'MoE Grade 9 Chemistry, pp. 1-45',
          },
        ],
      },
    ],
  },
  {
    id: 'g9-bio',
    code: 'BIO-9',
    grade: 9,
    icon: 'Dna',
    color: 'emerald',
    name: {
      am: 'ባዮሎጂ',
      om: 'Baayoloojii',
      ti: 'ባዮሎጂ',
      ar: 'علم الأحياء',
      so: 'Bayoolaji',
      en: 'Biology',
    },
    units: [
      {
        id: 'g9-bio-u1',
        unitNumber: 1,
        title: 'Introduction to Biology & Cell Biology',
        description: 'Microscopy, cell theory, prokaryotic vs eukaryotic cells, and cell organelles.',
        topics: [
          {
            id: 'g9-b-t1',
            title: 'Cell Organelles and Their Functions',
            competencyObjectives: [
              'Compare plant and animal cells under light microscopy',
              'Explain functions of mitochondria, chloroplast, and cell wall',
              'Describe passive and active transport across cell membranes',
            ],
            summary: 'The cell as the basic structural and functional unit of life.',
            content: 'Understanding cellular metabolism and specialized tissues.',
            ethiopianExample: 'Endemic plant flora adaptations in the Simien and Bale Mountains National Parks.',
            estimatedStudyMinutes: 40,
            pageReference: 'MoE Grade 9 Biology, pp. 1-38',
          },
        ],
      },
    ],
  },

  // ================= GRADE 10 =================
  GRADE_10_MATH_SUBJECT,
  GRADE_10_PHYSICS_SUBJECT,

  // ================= GRADE 11 =================
  {
    id: 'g11-math',
    code: 'MATH-11',
    grade: 11,
    icon: 'Sigma',
    color: 'indigo',
    name: {
      am: 'ሂሳብ (ከፍተኛ ደረጃ)',
      om: 'Herrega Olaanaa',
      ti: 'ማቴማቲክስ (ላዕለዋይ)',
      ar: 'الرياضيات المتقدمة',
      so: 'Xisaabta Sare',
      en: 'Advanced Mathematics',
    },
    units: [
      {
        id: 'g11-math-u1',
        unitNumber: 1,
        title: 'Further on Relations and Functions',
        description: 'Polynomial functions, rational functions, synthetic division, and asymptotes.',
        topics: [
          {
            id: 'g11-m-t1',
            title: 'Rational Functions and Asymptotes',
            competencyObjectives: [
              'Determine horizontal, vertical, and oblique asymptotes',
              'Perform partial fraction decomposition',
              'Sketch rational curves and locate holes/discontinuities',
            ],
            summary: 'Advanced rational function analysis f(x) = P(x)/Q(x) and limiting behavior.',
            content: 'Crucial for rate of change, chemical equilibrium reactions, and population limiting models.',
            ethiopianExample: 'Modeling the carrying capacity and population saturation of endemic Walia Ibex.',
            estimatedStudyMinutes: 50,
            pageReference: 'MoE Grade 11 Math, pp. 1-60',
          },
        ],
      },
      {
        id: 'g11-math-u2',
        unitNumber: 2,
        title: 'Sequences and Series',
        description: 'Arithmetic progressions (AP), Geometric progressions (GP), and financial mathematics.',
        topics: [
          {
            id: 'g11-m-t2',
            title: 'Geometric Series & Annuities',
            competencyObjectives: [
              'Derive sum of infinite geometric series S = a / (1 - r)',
              'Calculate compound interest and loan amortizations',
              'Model radioactive decay and biological reproduction',
            ],
            summary: 'Exponential growth, convergence criteria |r| < 1, and banking interest calculations.',
            content: 'Ethiopian microfinance institutions and bank deposit compound savings growth.',
            ethiopianExample: 'Equb (እቁብ) savings rotation models and modern Ethiopian digital micro-loans.',
            estimatedStudyMinutes: 45,
            pageReference: 'MoE Grade 11 Math, pp. 61-112',
          },
        ],
      },
    ],
  },
  {
    id: 'g11-chem',
    code: 'CHEM-11',
    grade: 11,
    icon: 'Atom',
    color: 'emerald',
    name: {
      am: 'ኬሚስትሪ',
      om: 'Keemistirii',
      ti: 'ኬሚስትሪ',
      ar: 'الكيمياء',
      so: 'Kiimistariga',
      en: 'Chemistry',
    },
    units: [
      {
        id: 'g11-chem-u1',
        unitNumber: 1,
        title: 'Chemical Energetics & Thermodynamics',
        description: 'Enthalpy changes, Hess’s Law, entropy, and Gibbs free energy of spontaneous reactions.',
        topics: [
          {
            id: 'g11-c-t1',
            title: 'Hess’s Law & Standard Enthalpy of Formation',
            competencyObjectives: [
              'Calculate ΔH°_rxn using standard enthalpies of formation',
              'Construct Born-Haber thermochemical cycles',
              'Predict spontaneity using ΔG = ΔH - TΔS',
            ],
            summary: 'Energy conservation in chemical reactions and heat exchange mechanisms.',
            content: 'Thermochemistry allows Ethiopian industrial chemical plants to optimize fuel efficiency.',
            ethiopianExample: 'Muger and Dangote Cement kiln thermal reactions in Oromia region.',
            estimatedStudyMinutes: 50,
            pageReference: 'MoE Grade 11 Chemistry, pp. 1-46',
          },
        ],
      },
    ],
  },

  // ================= GRADE 12 (ENTRANCE PREP & EXIT EXAM) =================
  {
    id: 'g12-math',
    code: 'MATH-12',
    grade: 12,
    icon: 'LineChart',
    color: 'indigo',
    name: {
      am: 'የ12ኛ ክፍል ካልኩለስና ሂሳብ',
      om: 'Herrega fi Kaalkulasii Kutaa 12',
      ti: 'ካልኩለስን ማቴማቲክስን 12 ክፍሊ',
      ar: 'التفاضل والتكامل والرياضيات (الصف 12)',
      so: 'Xisaabta iyo Kaalkulaska Fasalka 12',
      en: 'Grade 12 Calculus & Advanced Math',
    },
    units: [
      {
        id: 'g12-math-u1',
        unitNumber: 1,
        title: 'Limits and Continuity',
        description: 'Intuitive and formal definitions of limits, one-sided limits, continuity theorems, and limits at infinity.',
        topics: [
          {
            id: 'g12-m-t1',
            title: 'Evaluating Limits & L’Hôpital’s Rule',
            competencyObjectives: [
              'Evaluate indeterminate forms 0/0 and ∞/∞',
              'Apply squeeze theorem and continuity conditions',
              'Master university entrance limit examination shortcuts',
            ],
            summary: 'Limits form the foundational core of differential and integral calculus.',
            content: 'Rigorous limit computation essential for physics and engineering entrance exams in Ethiopia.',
            ethiopianExample: 'Instantaneous river discharge rate limits along the Omo River Gibe III basin.',
            estimatedStudyMinutes: 55,
            pageReference: 'MoE Grade 12 Math, pp. 1-58',
          },
        ],
      },
      {
        id: 'g12-math-u2',
        unitNumber: 2,
        title: 'Introduction to Differential Calculus',
        description: 'Derivatives, chain rule, implicit differentiation, and optimization applications.',
        topics: [
          {
            id: 'g12-m-t2',
            title: 'Applications of Derivatives (Optimization)',
            competencyObjectives: [
              'Find critical points, local extrema, and inflection points',
              'Solve real-world maximum profit and minimum material cost problems',
              'Apply derivatives to velocity and acceleration vectors',
            ],
            summary: 'Finding maxima and minima in geometry, business revenue, and industrial manufacturing.',
            content: 'Optimization is heavily tested in the Ethiopian University Entrance Examination (EUEE).',
            ethiopianExample: 'Optimizing container volume for Ethiopian Airlines cargo logistics at Bole International.',
            estimatedStudyMinutes: 60,
            pageReference: 'MoE Grade 12 Math, pp. 59-122',
          },
        ],
      },
      {
        id: 'g12-math-u3',
        unitNumber: 3,
        title: 'Integral Calculus',
        description: 'Antiderivatives, definite integrals, Fundamental Theorem of Calculus, and area under curves.',
        topics: [
          {
            id: 'g12-m-t3',
            title: 'Definite Integrals and Area Under Curves',
            competencyObjectives: [
              'Compute definite integrals using substitution and parts',
              'Calculate enclosed areas between two curves',
              'Solve entrance exam definite integral problems efficiently',
            ],
            summary: 'Integration as the accumulation of quantities and computing geometric areas.',
            content: 'Integral calculus models total work done, electric charge accumulation, and probability densities.',
            ethiopianExample: 'Calculating total water reservoir volume curve of Lake Tana.',
            estimatedStudyMinutes: 60,
            pageReference: 'MoE Grade 12 Math, pp. 123-180',
          },
        ],
      },
    ],
  },
  {
    id: 'g12-phys',
    code: 'PHYS-12',
    grade: 12,
    icon: 'Radioactive',
    color: 'amber',
    name: {
      am: 'የ12ኛ ክፍል ፊዚክስ',
      om: 'Fiiziksii Kutaa 12',
      ti: 'ፊዚክስ 12 ክፍሊ',
      ar: 'فيزياء الصف 12 (المتقدمة)',
      so: 'Fisikiska Fasalka 12',
      en: 'Grade 12 Advanced Physics',
    },
    units: [
      {
        id: 'g12-phys-u1',
        unitNumber: 1,
        title: 'Thermodynamics & Heat Engines',
        description: 'First and second laws of thermodynamics, Carnot cycle, heat pumps, and entropy.',
        topics: [
          {
            id: 'g12-p-t1',
            title: 'The Carnot Cycle and Efficiency',
            competencyObjectives: [
              'Calculate maximum theoretical Carnot efficiency η = 1 - (T_C / T_H)',
              'Explain PV diagrams for isothermal and adiabatic expansions',
              'Analyze geothermal energy plants in the Ethiopian Great Rift Valley',
            ],
            summary: 'Thermal cycle analysis and irreversible thermodynamic processes.',
            content: 'Thermodynamic principles underpin modern energy generation across Ethiopia.',
            ethiopianExample: 'Aluto-Langano and Corbetti Geothermal power production in the Ethiopian Rift.',
            estimatedStudyMinutes: 50,
            pageReference: 'MoE Grade 12 Physics, pp. 1-54',
          },
        ],
      },
      {
        id: 'g12-phys-u2',
        unitNumber: 2,
        title: 'Wave Motion and Physical Optics',
        description: 'Superposition, interference, diffraction grating, polarization, and Doppler effect.',
        topics: [
          {
            id: 'g12-p-t2',
            title: 'Young’s Double-Slit & Wave Interference',
            competencyObjectives: [
              'Derive constructive and destructive interference conditions: d sin θ = m λ',
              'Calculate fringe widths and wavelength of laser sources',
              'Solve EUEE optical physics questions with speed and precision',
            ],
            summary: 'Wave nature of light, diffraction patterns, and laser technologies.',
            content: 'Wave mechanics is central to telecommunications and optical fiber networks.',
            ethiopianExample: 'Ethio Telecom national fiber optic backbone and optical dispersion.',
            estimatedStudyMinutes: 45,
            pageReference: 'MoE Grade 12 Physics, pp. 55-102',
          },
        ],
      },
    ],
  },
];

// Helper to filter subjects by grade
export function getCurriculumByGrade(grade: GradeLevel): CurriculumSubject[] {
  return CURRICULUM_DATA.filter((s) => s.grade === grade);
}

// Sample Flashcards for Spaced Repetition Active Recall
export const SAMPLE_FLASHCARDS = [
  {
    id: 'fc-1',
    subject: 'Mathematics',
    grade: 12 as GradeLevel,
    front: 'What is the derivative of f(x) = ln(x) with respect to x?',
    back: 'f\'(x) = 1/x (for x > 0). Under the chain rule, d/dx[ln(u)] = (1/u) · (du/dx).',
    difficulty: 'easy' as const,
  },
  {
    id: 'fc-2',
    subject: 'Physics',
    grade: 12 as GradeLevel,
    front: 'State the Maximum Efficiency formula for an ideal Carnot Heat Engine.',
    back: 'η_max = 1 - (T_cold / T_hot) = (T_hot - T_cold) / T_hot, where temperatures must be in Kelvin.',
    difficulty: 'medium' as const,
  },
  {
    id: 'fc-3',
    subject: 'Chemistry',
    grade: 11 as GradeLevel,
    front: 'Define Hess’s Law of Constant Heat Summation.',
    back: 'The total enthalpy change for a chemical reaction is independent of the pathway taken, depending only on the initial and final states.',
    difficulty: 'medium' as const,
  },
  {
    id: 'fc-4',
    subject: 'Mathematics',
    grade: 10 as GradeLevel,
    front: 'What does the Discriminant Δ = b² - 4ac determine for ax² + bx + c = 0?',
    back: 'If Δ > 0: two distinct real roots. If Δ = 0: exactly one repeated real root. If Δ < 0: two complex conjugate roots (no real roots).',
    difficulty: 'easy' as const,
  },
  {
    id: 'fc-5',
    subject: 'Physics',
    grade: 9 as GradeLevel,
    front: 'State Newton\'s Second Law of Motion in both verbal and mathematical forms.',
    back: 'The net acceleration of an object is directly proportional to net force and inversely proportional to its mass: F_net = m · a (or F = dp/dt).',
    difficulty: 'easy' as const,
  },
];

// University Entrance Exam EUEE Past & Diagnostic Model Questions
export const SAMPLE_ENTRANCE_EXAM_QUESTIONS = [
  {
    id: 'euee-1',
    grade: 12 as GradeLevel,
    subject: 'Mathematics',
    question: 'Evaluate the limit: lim (x -> 0) [sin(5x) / (3x)]',
    options: [
      'A. 0',
      'B. 5/3',
      'C. 3/5',
      'D. Does not exist',
    ],
    correctIndex: 1,
    explanation: 'Using the fundamental trigonometric limit lim (u -> 0) [sin(u)/u] = 1, we rewrite [sin(5x)/(3x)] = (5/3) · [sin(5x)/(5x)]. Thus the limit is 5/3.',
    topicRef: 'Limits and Continuity (MoE Grade 12 Math)',
  },
  {
    id: 'euee-2',
    grade: 12 as GradeLevel,
    subject: 'Physics',
    question: 'A heat engine operates between a hot reservoir at 500 K and a cold reservoir at 300 K. What is the maximum theoretical efficiency of this engine?',
    options: [
      'A. 20%',
      'B. 40%',
      'C. 60%',
      'D. 80%',
    ],
    correctIndex: 1,
    explanation: 'Carnot efficiency η = 1 - (T_C / T_H) = 1 - (300 / 500) = 1 - 0.60 = 0.40, which is 40%.',
    topicRef: 'Thermodynamics (MoE Grade 12 Physics)',
  },
  {
    id: 'euee-3',
    grade: 11 as GradeLevel,
    subject: 'Mathematics',
    question: 'What is the sum of the infinite geometric series: 8 + 4 + 2 + 1 + ...?',
    options: [
      'A. 15',
      'B. 16',
      'C. 18',
      'D. Diverges',
    ],
    correctIndex: 1,
    explanation: 'Here the first term a = 8, and the common ratio r = 4/8 = 1/2. Since |r| < 1, the sum is S = a / (1 - r) = 8 / (1 - 0.5) = 16.',
    topicRef: 'Sequences and Series (MoE Grade 11 Math)',
  },
  {
    id: 'euee-4',
    grade: 10 as GradeLevel,
    subject: 'Physics',
    question: 'An electric kettle operates at 220 V and draws a current of 5 A. How much electrical energy does it consume in 10 minutes?',
    options: [
      'A. 1,100 J',
      'B. 11,000 J',
      'C. 660,000 J',
      'D. 2,200 J',
    ],
    correctIndex: 2,
    explanation: 'Power P = V · I = 220 V × 5 A = 1,100 W. Time t = 10 minutes = 600 seconds. Energy E = P × t = 1,100 W × 600 s = 660,000 J (or 660 kJ).',
    topicRef: 'Electromagnetism & Circuits (MoE Grade 10 Physics)',
  },
];
