import { HomeworkQuestion, PremiumAssignment, StemProject } from '../types/academicWorkHub';

// ==========================================
// 1. HOMEWORK ENGINE QUESTION BANK (Grades 9-12)
// Aligned with FDRE MoE New Curriculum 2019 E.C.
// ==========================================
export const CURRICULUM_HOMEWORK_BANK: HomeworkQuestion[] = [
  // --- GRADE 10 MATHEMATICS (Unit 1: Relations & Functions) ---
  {
    id: 'hw-g10-math-01',
    grade: 10,
    subject: 'Mathematics',
    unit: 'Unit 1: Relations and Functions',
    chapter: '1.2 Functions & Domain/Range',
    topic: 'Determining the Domain and Range of Rational Functions',
    type: 'numerical',
    prompt: 'Given the function f(x) = (3x + 6) / (2x - 8), find the restricted value of x where the function is undefined (i.e. the vertical asymptote denominator zero).',
    correctNumericalAnswer: 4,
    numericalTolerance: 0.01,
    unitOfMeasure: '',
    sampleSolution: 'Set the denominator equal to zero: 2x - 8 = 0 => 2x = 8 => x = 4. The domain of f(x) is {x ∈ ℝ | x ≠ 4}. Restricted value is 4.',
    stepByStepDerivation: [
      'Step 1: Identify that a rational function is undefined when its denominator equals zero.',
      'Step 2: Formulate the denominator equation: 2x - 8 = 0.',
      'Step 3: Add 8 to both sides: 2x = 8.',
      'Step 4: Divide both sides by 2: x = 4.',
      'Step 5: Conclude that f(x) is defined for all real numbers except x = 4.',
    ],
    textbookCitation: {
      grade: 10,
      subject: 'Mathematics',
      unit: 'Unit 1 Relations and Functions',
      pageNumber: 'p. 21-25',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'ክፍልፋይ የሂሳብ ቀመሮች (Rational functions) ተለዋዋጭ ቁጥራቸው ታችኛው (Denominator) ክፍል ዜሮ ሲሆን ትርጉም አልባ (undefined) ይሆናሉ።',
      level2FormulaClue: 'Denominator D(x) = 2x - 8 = 0 የሚለውን እኩልታ ይፍቱ።',
      level3Setup: '2x - 8 = 0 => 2x = 8 => x ን ለብቻው አውጥተው ይፈልጉ።',
    },
    points: 15,
  },
  {
    id: 'hw-g10-math-02',
    grade: 10,
    subject: 'Mathematics',
    unit: 'Unit 2: Polynomial Functions',
    chapter: '2.4 Zeros of Polynomial Functions',
    topic: 'Finding Rational Roots using Factor Theorem',
    type: 'mcq',
    prompt: 'According to the Factor Theorem (የብዜት ቴዎረም), which of the following linear binomials is a factor of the polynomial P(x) = x³ - 4x² + x + 6?',
    options: [
      'A. (x - 2)',
      'B. (x + 2)',
      'C. (x - 4)',
      'D. (x + 3)',
    ],
    correctOptionIndex: 0,
    sampleSolution: 'Evaluate P(2): P(2) = (2)³ - 4(2)² + (2) + 6 = 8 - 16 + 2 + 6 = 0. Since P(2) = 0, by the Factor Theorem, (x - 2) is a factor.',
    stepByStepDerivation: [
      'Step 1: The Factor Theorem states that (x - c) is a factor of P(x) if and only if P(c) = 0.',
      'Step 2: Test candidate c = 2: P(2) = 2³ - 4(2)² + 2 + 6.',
      'Step 3: Calculate powers: 8 - 4(4) + 2 + 6 = 8 - 16 + 2 + 6.',
      'Step 4: Sum the terms: (8 + 2 + 6) - 16 = 16 - 16 = 0.',
      'Step 5: Since the remainder is 0, (x - 2) is a confirmed factor.',
    ],
    textbookCitation: {
      grade: 10,
      subject: 'Mathematics',
      unit: 'Unit 2 Polynomial Functions',
      pageNumber: 'p. 84-93',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'የብዜት ቴዎረም (Factor Theorem) እንደሚለው P(c) = 0 ከሆነ (x - c) የP(x) ብዜት (factor) ነው።',
      level2FormulaClue: 'ለእያንዳንዱ ምርጫ c ዋጋን በP(x) ውስጥ በመተካት ዜሮ የሚሰጠውን ፈትሹ።',
      level3Setup: 'P(2) = 2³ - 4(4) + 2 + 6 = ? የሚለውን አስሉ።',
    },
    points: 15,
  },
  {
    id: 'hw-g10-math-03',
    grade: 10,
    subject: 'Mathematics',
    unit: 'Unit 3: Exponential and Logarithmic Functions',
    chapter: '3.4 Solving Exponential & Logarithmic Equations',
    topic: 'Solving Base-10 Logarithmic Equations',
    type: 'numerical',
    prompt: 'Solve for x in the equation: log₂(x + 5) + log₂(x - 1) = 4. What is the valid real solution for x?',
    correctNumericalAnswer: 3,
    numericalTolerance: 0.01,
    unitOfMeasure: '',
    sampleSolution: 'Using product property: log₂[(x + 5)(x - 1)] = 4 => (x + 5)(x - 1) = 2⁴ = 16 => x² + 4x - 5 = 16 => x² + 4x - 21 = 0 => (x + 7)(x - 3) = 0. Since arguments must be positive, x = 3 (x = -7 is extraneous).',
    stepByStepDerivation: [
      'Step 1: Apply product law of logarithms: log_b(M) + log_b(N) = log_b(M × N).',
      'Step 2: Combine: log₂[(x + 5)(x - 1)] = 4.',
      'Step 3: Convert to exponential form: (x + 5)(x - 1) = 2⁴ = 16.',
      'Step 4: Expand quadratic: x² + 4x - 5 - 16 = 0 => x² + 4x - 21 = 0.',
      'Step 5: Factor: (x + 7)(x - 3) = 0 => x = -7 or x = 3.',
      'Step 6: Check domain restriction: x - 1 > 0 => x > 1. Therefore x = -7 is extraneous and the unique solution is x = 3.',
    ],
    textbookCitation: {
      grade: 10,
      subject: 'Mathematics',
      unit: 'Unit 3 Exponential and Logarithmic Functions',
      pageNumber: 'p. 172-178',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'የሎጋሪዝም የብዜት ህግን (Product Rule) በመጠቀም ሁለቱን ሎጎች ወደ አንድ ሎግ ያዋህዱ።',
      level2FormulaClue: 'log_b(A) + log_b(B) = log_b(A × B) እና log_b(Y) = c ከሆነ Y = b^c ይሆናል።',
      level3Setup: '(x + 5)(x - 1) = 2⁴ = 16 => x² + 4x - 21 = 0። ከአሉታዊ ቁጥሮች ውስጥ ሎግ የማይፈቀድ መሆኑን አስታውሱ።',
    },
    points: 20,
  },
  {
    id: 'hw-g10-math-04',
    grade: 10,
    subject: 'Mathematics',
    unit: 'Unit 4: Trigonometric Functions',
    chapter: '4.1 Radian Measure of Angle & Unit Circle',
    topic: 'Converting Degrees to Radians',
    type: 'short_answer',
    prompt: 'Convert an angle of 150° into radians in terms of π (Write your answer in the form aπ/b or simplified fraction times pi).',
    expectedKeyTerms: ['5pi/6', '5π/6', '5/6 pi'],
    sampleSolution: 'Angle in radians = Degrees × (π / 180°) = 150° × (π / 180°) = (150/180)π = 5π/6 radians.',
    stepByStepDerivation: [
      'Step 1: Formula for degree to radian conversion: θ_rad = θ_deg × (π / 180°).',
      'Step 2: Substitute θ_deg = 150°: θ_rad = 150 × π / 180.',
      'Step 3: Simplify the fraction 150/180 by dividing numerator and denominator by GCD (30): 150/30 = 5, 180/30 = 6.',
      'Step 4: Final exact form: 5π/6 radians (approx 2.618 rad).',
    ],
    textbookCitation: {
      grade: 10,
      subject: 'Mathematics',
      unit: 'Unit 4 Trigonometric Functions',
      pageNumber: 'p. 200-206',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: '180 ዲግሪ ከ π ራዲያን ጋር እኩል ነው። ዲግሪን ወደ ራዲያን ለመቀየር በ π/180 ማባዛት ነው።',
      level2FormulaClue: 'Radian = Degree × (π / 180)። 150 እና 180ን በጋራ አካፋያቸው 30 ያቃልሉ።',
      level3Setup: '150/180 = 15/18 = 5/6። መልሱ 5π/6 ይሆናል።',
    },
    points: 15,
  },

  // --- GRADE 10/11 PHYSICS (Electromagnetism & Mechanics) ---
  {
    id: 'hw-g10-phys-01',
    grade: 10,
    subject: 'Physics',
    unit: 'Unit 3: Energy & Power Transmission',
    chapter: 'Hydroelectric Generation & Transformers',
    topic: 'Transformer Voltage Step-Up Calculation at GERD',
    type: 'numerical',
    prompt: 'A step-up generator transformer at the Grand Ethiopian Renaissance Dam (GERD) steps up generated voltage from 15 kV to 400 kV for the high-voltage national grid. If the primary winding has 300 turns, how many turns are on the secondary winding?',
    correctNumericalAnswer: 8000,
    numericalTolerance: 5,
    unitOfMeasure: 'turns',
    sampleSolution: 'Using the ideal transformer turn ratio: Vp / Vs = Np / Ns => Ns = Np × (Vs / Vp) = 300 × (400 kV / 15 kV) = 300 × 26.6667 = 8,000 turns.',
    stepByStepDerivation: [
      'Step 1: Identify given quantities: Vp = 15 kV, Vs = 400 kV, Np = 300 turns.',
      'Step 2: Transformer law: Vs / Vp = Ns / Np.',
      'Step 3: Rearrange for secondary turns: Ns = Np × (Vs / Vp).',
      'Step 4: Compute voltage ratio: 400 / 15 = 26.6667.',
      'Step 5: Multiply: 300 × 26.6667 = 8,000 turns.',
    ],
    textbookCitation: {
      grade: 10,
      subject: 'Physics',
      unit: 'Unit 3 Electromagnetism & Power',
      pageNumber: 'p. 142-148',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'ትራንስፎርመር ቮልቴጅን በሽቦ ዙሮች ብዛት (Turns ratio) ተመጣጣኝነት ይጨምራል ወይም ይቀንሳል።',
      level2FormulaClue: 'Vs / Vp = Ns / Np => Ns = Np × (Vs / Vp)።',
      level3Setup: 'Ns = 300 × (400 / 15)። 300 በ 15 ሲካፈል 20 ይሰጣል፤ 20 × 400 = 8000።',
    },
    points: 20,
  },
  {
    id: 'hw-g11-phys-02',
    grade: 11,
    subject: 'Physics',
    unit: 'Unit 2: Two-Dimensional Kinematics',
    chapter: '2.3 Projectile Motion',
    topic: 'Maximum Height Calculation',
    type: 'numerical',
    prompt: 'A projectile is launched from ground level in the Awash valley with an initial velocity of 40 m/s at an angle of 30° to the horizontal. Taking g = 10 m/s², what is the maximum height (H_max) reached by the projectile?',
    correctNumericalAnswer: 20,
    numericalTolerance: 0.1,
    unitOfMeasure: 'm',
    sampleSolution: 'Vertical initial velocity: v_0y = v_0 × sin(30°) = 40 × 0.5 = 20 m/s. Maximum height: H_max = (v_0y)² / (2g) = (20)² / (2 × 10) = 400 / 20 = 20 meters.',
    stepByStepDerivation: [
      'Step 1: Identify given parameters: v₀ = 40 m/s, θ = 30°, g = 10 m/s².',
      'Step 2: Calculate vertical component of velocity: v₀y = v₀ sin(30°) = 40 × 0.5 = 20 m/s.',
      'Step 3: At maximum height, vertical velocity vy = 0.',
      'Step 4: Use kinematic equation: vy² = v₀y² - 2gH => 0 = 20² - 2(10)H.',
      'Step 5: Solve for H: 20H = 400 => H = 20 m.',
    ],
    textbookCitation: {
      grade: 11,
      subject: 'Physics',
      unit: 'Unit 2 Two-Dimensional Motion',
      pageNumber: 'p. 62-68',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'ከፍተኛ ከፍታ ላይ ሲደርስ ወደ ላይ የሚጓዘው ፍጥነት (vy) ዜሮ ይሆናል።',
      level2FormulaClue: 'H_max = (v₀ × sin θ)² / (2g)።',
      level3Setup: 'v₀y = 40 × sin(30°) = 20 m/s => H = 20² / (2 × 10) = 400 / 20 = ?',
    },
    points: 20,
  },

  // --- GRADE 10/11 CHEMISTRY (Stoichiometry & Acid-Base) ---
  {
    id: 'hw-g10-chem-01',
    grade: 10,
    subject: 'Chemistry',
    unit: 'Unit 3: Chemical Reactions & Stoichiometry',
    chapter: '3.2 Molar Mass & Stoichiometric Calculations',
    topic: 'Neutralization of Acidic Soils using Agricultural Lime (CaCO3)',
    type: 'numerical',
    prompt: 'Agricultural lime (Calcium Carbonate, CaCO₃) is applied to neutralize sulfuric acid runoff in Gojjam agricultural fields: CaCO₃ + H₂SO₄ → CaSO₄ + CO₂ + H₂O. How many grams of CaCO₃ are required to completely neutralize 49 grams of pure H₂SO₄? (Molar masses: Ca=40, C=12, O=16, H=1, S=32 g/mol)',
    correctNumericalAnswer: 50,
    numericalTolerance: 0.5,
    unitOfMeasure: 'g',
    sampleSolution: 'Molar mass of H₂SO₄ = 2(1) + 32 + 4(16) = 98 g/mol. Moles of H₂SO₄ = 49 / 98 = 0.50 mol. The mole ratio CaCO₃ : H₂SO₄ is 1:1, so 0.50 mol of CaCO₃ is needed. Molar mass of CaCO₃ = 40 + 12 + 3(16) = 100 g/mol. Mass = 0.50 × 100 = 50 grams.',
    stepByStepDerivation: [
      'Step 1: Compute molar mass of H₂SO₄: 2(1.0) + 32.0 + 4(16.0) = 98.0 g/mol.',
      'Step 2: Find moles of H₂SO₄: n = mass / M = 49 g / 98 g/mol = 0.50 moles.',
      'Step 3: From balanced equation, mole ratio of CaCO₃ to H₂SO₄ is 1 : 1.',
      'Step 4: Moles of CaCO₃ required = 0.50 moles.',
      'Step 5: Compute molar mass of CaCO₃: 40.0 + 12.0 + 3(16.0) = 100.0 g/mol.',
      'Step 6: Mass of CaCO₃ required = 0.50 mol × 100.0 g/mol = 50.0 grams.',
    ],
    textbookCitation: {
      grade: 10,
      subject: 'Chemistry',
      unit: 'Unit 3 Stoichiometry & Neutralization',
      pageNumber: 'p. 112-118',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'መጀመሪያ የተሰጠውን የሰልፈሪክ አሲድ ግራም ወደ ሞል (moles) ቀይሩ።',
      level2FormulaClue: 'Moles = mass / molar mass። የ H₂SO₄ ሞላር ማስ 98 g/mol ሲሆን የ CaCO₃ ደግሞ 100 g/mol ነው።',
      level3Setup: '49 / 98 = 0.5 mol H₂SO₄ => 0.5 mol CaCO₃ × 100 g/mol = ?',
    },
    points: 20,
  },

  // --- GRADE 12 MATHEMATICS (Calculus & Optimization) ---
  {
    id: 'hw-g12-math-01',
    grade: 12,
    subject: 'Mathematics',
    unit: 'Unit 3: Applications of Differential Calculus',
    chapter: '3.3 Optimization Problems in Ethiopian Business',
    topic: 'Maximizing Revenue for Teff Export Enterprise',
    type: 'numerical',
    prompt: 'An Ethiopian grain cooperative models its daily revenue function for premium Magna Teff sales as R(x) = -2x² + 600x - 1000, where x represents the number of quintals sold. Find the sales quantity x that maximizes the cooperative revenue.',
    correctNumericalAnswer: 150,
    numericalTolerance: 0.1,
    unitOfMeasure: 'quintals',
    sampleSolution: 'Differentiate R(x) with respect to x: R\'(x) = -4x + 600. Set R\'(x) = 0 for critical point: -4x + 600 = 0 => 4x = 600 => x = 150 quintals. Since R\'\'(x) = -4 < 0, x = 150 gives the absolute maximum revenue.',
    stepByStepDerivation: [
      'Step 1: Set up the revenue model R(x) = -2x² + 600x - 1000.',
      'Step 2: Find first derivative: R\'(x) = d/dx(-2x² + 600x - 1000) = -4x + 600.',
      'Step 3: Set first derivative to zero: -4x + 600 = 0.',
      'Step 4: Solve for x: 4x = 600 => x = 150 quintals.',
      'Step 5: Second derivative test: R\'\'(x) = -4 < 0 (concave downwards, confirming maximum).',
    ],
    textbookCitation: {
      grade: 12,
      subject: 'Mathematics',
      unit: 'Unit 3 Applications of Calculus',
      pageNumber: 'p. 135-142',
      edition: 'MoE New Curriculum 2019 E.C.',
    },
    hints: {
      level1Nudge: 'ከፍተኛ ገቢ (Maximum revenue) የሚገኘው የመጀመሪያው ደሪቫቲቭ (First derivative) ዜሮ ሲሆን ነው።',
      level2FormulaClue: 'R\'(x) = 0 ወይም የፓራቦላ ጫፍ x = -b / (2a)።',
      level3Setup: 'a = -2, b = 600 => x = -600 / (2 × -2) = -600 / -4 = 150።',
    },
    points: 20,
  },
];

// ==========================================
// 2. PREMIUM ASSIGNMENTS (54 ETB Single Pack)
// Evaluated with 4-part structured AI rubrics:
// Comprehension (25%), Methodology (35%),
// Factual Accuracy (25%), Presentation (15%)
// ==========================================
export const PREMIUM_ASSIGNMENTS_BANK: PremiumAssignment[] = [
  {
    id: 'prem-assign-01',
    grade: 10,
    subject: 'Mathematics',
    unit: 'Unit 2: Polynomial Functions',
    chapter: '2.6 Applications of Polynomials in Ethiopian Economics',
    title: 'Higher-Order Polynomial Optimization & Revenue Modeling in Ethiopian Trade',
    subtitle: 'Mathematical modeling of coffee supply chain yield and market equilibrium',
    rigorLevel: 'Advanced Entrance (EUEE)',
    priceETB: 54,
    problemStatement: `An agricultural exporter in Jimma models the net operational profit P(x) in thousands of Ethiopian Birr (ETB) from processing x metric tons of specialty Arabica coffee beans according to the cubic polynomial:
P(x) = -x³ + 24x² - 144x + 500  (for domain 2 ≤ x ≤ 15 metric tons)

Your Tasks:
1. Mathematical Derivation: Find the first and second derivatives P'(x) and P''(x). Determine the critical points of the processing volume within the domain.
2. Optimization Analysis: Identify the metric tonnage that yields the local minimum vs. local maximum profit. Justify using the second derivative concavity test.
3. Financial Calculation: Calculate the maximum profit in ETB and evaluate the economic implications if the cooperative exceeds capacity beyond x = 16 metric tons.
4. MoE Syllabus Link: Ground your solution in the Ethiopian Grade 10 Mathematics Unit 2 Theorem on Polynomials (p. 84-116).`,
    starterTemplate: `### 1. Given & Domain (የተሰጡ መረጃዎች)
Function: P(x) = -x³ + 24x² - 144x + 500, Domain: [2, 15]

### 2. Derivative & Critical Values (ደሪቫቲቭ እና ወሳኝ ነጥቦች)
P'(x) = d/dx(-x³ + 24x² - 144x + 500) = ...
Set P'(x) = 0:

### 3. Optimization & Concavity Test (የሁለተኛ ደሪቫቲቭ ማረጋገጫ)
P''(x) = ...
At critical points:

### 4. Final Solution & Economic Interpretation (ድምዳሜ)`,
    guidingQuestions: [
      'What is the factored form of the derivative quadratic?',
      'Does x = 4 give a minimum or maximum? Test P\'\'(4).',
      'What happens when x = 12? Test P\'\'(12).',
      'Convert the resulting thousands of ETB into exact Birr.',
    ],
    formulaReference: [
      'Power Rule: d/dx(axⁿ) = n·a·xⁿ⁻¹',
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a)',
      'Second Derivative Test: P\'\'(c) < 0 indicates Local Maximum; P\'\'(c) > 0 indicates Local Minimum.',
    ],
    rubricGuidelines: {
      comprehensionFocus: 'Correctly identifies the cubic polynomial behavior, domain constraints, and economic variables (25%).',
      methodologyFocus: 'Rigorous application of the power rule, factoring of quadratic derivative, and second derivative concavity proof (35%).',
      factualAccuracyFocus: 'Zero arithmetic errors in determining roots x = 4 and x = 12, correct calculation of P(12) = 932 thousand ETB (25%).',
      presentationFocus: 'Neat mathematical notation, clear step labeling, and insightful contextual application to Ethiopian coffee trade (15%).',
    },
    textbookCitation: 'MoE Grade 10 Mathematics, Unit 2 Polynomial Functions, p. 84-116',
    estimatedTimeMinutes: 45,
  },
  {
    id: 'prem-assign-02',
    grade: 10,
    subject: 'Physics',
    unit: 'Unit 4: Electromagnetism & Electricity Generation',
    chapter: '4.3 Faraday Induction & Synchronous Generators',
    title: 'Electromagnetic Induction & Turbine Generation at GERD',
    subtitle: 'Derivation of magnetic flux rate of change and terminal voltage regulation',
    rigorLevel: 'STEM Honors',
    priceETB: 54,
    problemStatement: `At the Grand Ethiopian Renaissance Dam (GERD), each Francis hydro turbine drives a 375 MW synchronous rotor generator inside a uniform magnetic field of B = 1.2 Tesla. The rotor coil has N = 450 turns with an effective cross-sectional area of A = 8.5 m² per turn, rotating at an angular frequency of ω = 100π rad/s (50 Hz grid frequency).

Your Tasks:
1. Law Derivation: State Faraday's Law of Electromagnetic Induction and Lenz's Law in mathematical notation.
2. Peak EMF Calculation: Calculate the maximum electromotive force (EMF_peak) induced across the stator windings.
3. RMS Grid Voltage: Compute the Root Mean Square (V_rms) voltage supplied to the step-up transformer.
4. Hydrological Impact: Explain how a 20% seasonal drop in water flow through the penstock during dry months influences turbine angular velocity ω and induced voltage, and recommend mitigation strategies based on MoE Physics Unit 4.`,
    starterTemplate: `### 1. Governing Laws (የፋራዴይ እና ሌንዝ ህግጋት)
Faraday's Law: ε = -N · (dΦ_B / dt)
Magnetic Flux: Φ_B = B · A · cos(ωt)

### 2. Peak EMF Derivation (ከፍተኛ ኢ.ኤም.ኤፍ ስሌት)
ε_max = N · B · A · ω = ...

### 3. RMS Voltage Calculation (የመረብ ቮልቴጅ)
V_rms = ε_max / √2 = ...

### 4. Hydrological & Engineering Analysis (የአባይ ውሃ ፍሰት ትንተና)`,
    guidingQuestions: [
      'How does angular frequency relate to frequency f = 50 Hz?',
      'Compute: 450 turns × 1.2 T × 8.5 m² × (100 × 3.14159) rad/s.',
      'What is the ratio between peak voltage and RMS voltage in AC circuits?',
    ],
    formulaReference: [
      'Faraday\'s Law: ε = -N(ΔΦ / Δt)',
      'Rotational Induced EMF: ε(t) = N·B·A·ω·sin(ωt)',
      'RMS AC Voltage: V_rms = V_peak / √2 ≈ 0.7071 × V_peak',
    ],
    rubricGuidelines: {
      comprehensionFocus: 'Demonstrates clear grasp of magnetic flux linkage, angular velocity, and AC generation physics (25%).',
      methodologyFocus: 'Complete differential derivation of ε(t) with proper units (Tesla, m², rad/s, Volts) (35%).',
      factualAccuracyFocus: 'Precise numerical calculation of peak EMF (≈ 1,441,991 V or 1.44 MV) and V_rms (≈ 1.02 MV) (25%).',
      presentationFocus: 'Professional SI documentation, clean formulas, and realistic Ethiopian energy grid context (15%).',
    },
    textbookCitation: 'MoE Grade 10 Physics, Unit 4 Electromagnetism & Grid Power, p. 165-190',
    estimatedTimeMinutes: 50,
  },
  {
    id: 'prem-assign-03',
    grade: 10,
    subject: 'Chemistry',
    unit: 'Unit 4: Acids, Bases and Salts',
    chapter: '4.4 Stoichiometric Neutralization & Soil Reclamation',
    title: 'Chemical Stoichiometry & Nitisols Neutralization in Ethiopian Highlands',
    subtitle: 'Balancing chemical equations and titration analysis of agricultural lime',
    rigorLevel: 'University Preparatory',
    priceETB: 54,
    problemStatement: `Highland Nitisols in western Ethiopia (e.g. East Wollega and Gojjam) frequently develop severe aluminum toxicity and soil acidity (pH < 4.8), significantly reducing Teff and wheat grain yields.
An agronomy lab collects a 10-hectare soil sample contaminated with exchangeable hydrogen and aluminum ions equivalent to 0.04 moles of H⁺ ions per kilogram of topsoil.
Assuming 1 hectare contains 2.5 × 10⁶ kg of active topsoil:

Your Tasks:
1. Stoichiometric Equation: Write the balanced chemical reaction for neutralizing H⁺ ions with agricultural slaked lime Ca(OH)₂.
2. Moles of Acid: Calculate the total moles of H⁺ ions that must be neutralized across the entire 10-hectare farmland.
3. Lime Mass Requirement: Determine the metric tons of pure Ca(OH)₂ required for complete neutralization.
4. Practical Field Advisory: If the locally sourced quarry lime has only 82% purity, calculate the adjusted gross tonnage needed and explain the pH buffering mechanism in Nitisols.`,
    starterTemplate: `### 1. Balanced Neutralization Equation (የኬሚካል እኩልታ)
Reaction: Ca(OH)₂ + 2H⁺ → Ca²⁺ + 2H₂O

### 2. Total Farmland Soil Mass & Moles of Acid
Topsoil mass per hectare = 2,500,000 kg
For 10 hectares = ...
Total H⁺ moles = ...

### 3. Stoichiometric Lime Requirement (የኖራ ስሌት)
Moles of Ca(OH)₂ required = Moles H⁺ / 2 = ...
Molar mass of Ca(OH)₂ = ...
Metric tons of pure lime = ...

### 4. Purity Adjustment & Soil Chemistry Advisory (82% ንፅህና ማስተካከያ)`,
    guidingQuestions: [
      'What is the mole ratio of Ca(OH)₂ to H⁺?',
      'How do you adjust mass when purity is 82%? Divide by 0.82.',
      'What chemical changes occur in the soil solution as pH rises above 5.5?',
    ],
    formulaReference: [
      'Neutralization: 1 mol Ca(OH)₂ neutralizes 2 mol H⁺',
      'Molar Mass Ca(OH)₂ = 40.08 + 2(16.00 + 1.01) = 74.10 g/mol',
      'Actual Mass = Theoretical Mass / (% Purity / 100)',
    ],
    rubricGuidelines: {
      comprehensionFocus: 'Deep understanding of soil pH, hydronium ion neutrality, and exchangeable acidity (25%).',
      methodologyFocus: 'Step-by-step stoichiometric mole-to-mass conversions with unit consistency (35%).',
      factualAccuracyFocus: 'Exact total mass calculation (1,000,000 mol H⁺ => 500,000 mol Ca(OH)₂ = 37.05 metric tons pure; 45.18 tons at 82% purity) (25%).',
      presentationFocus: 'Clear agronomic structure, precise scientific notation, and agricultural practical guidance (15%).',
    },
    textbookCitation: 'MoE Grade 10 Chemistry, Unit 4 Acids, Bases, Salts & Soil Chemistry, p. 182-205',
    estimatedTimeMinutes: 45,
  },
];

// ==========================================
// 3. PRACTICAL STEM PROJECT HUB (Free Access)
// Multi-Phase Projects with Ethiopian Themes:
// Phase 1: Proposal & Materials
// Phase 2: Execution & Data Collection
// Phase 3: Scientific Conclusion & Community Impact
// ==========================================
export const STEM_PROJECTS_BANK: StemProject[] = [
  {
    id: 'stem-proj-01',
    grade: 10,
    subject: 'Physics & Environmental Science',
    title: 'Renewable Solar & Micro-Hydro Energy Prototype for Rural Ethiopian Kebele',
    titleAmharic: 'የታዳሽ የፀሐይ እና አነስተኛ የውሃ ኃይል አመንጪ ፕሮቶታይፕ',
    theme: 'Clean Energy & GERD Hydropower Principles',
    ethiopianContext: 'Developing low-cost decentralized energy solutions for off-grid rural communities across Oromia, Amhara, and Southern Ethiopia, modeled on GERD turbine principles.',
    summary: 'A 3-phase engineering project designing, building, and measuring electrical output from a dual renewable energy kit (photovoltaic + micro-hydro water wheel model).',
    badgeName: 'Green Energy Pioneer (የአረንጓዴ ኃይል አምባሳደር)',
    badgeIcon: 'Zap',
    estimatedDuration: '2-3 Weeks (3 Milestones)',
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Proposal & Materials Specification',
        titleAmharic: 'ደረጃ 1: የፕሮጀክት እቅድ፣ ዓላማ እና የሚያስፈልጉ ቁሳቁሶች',
        objective: 'Formulate an engineering problem statement, state your hypothesis regarding solar tilt angle vs. energy output, and compile an itemized bill of materials from local recyclables.',
        deliverables: [
          'Hypothesis on optimal solar panel tilt angle at Ethiopian latitudes (8° - 12° North).',
          'List of materials: 12V 10W mini solar panel, DC bicycle dynamo / micro turbine motor, recycled plastic spoons/paddles for water wheel, multimeter, resistor load.',
          'Safety and environmental hazard protocol.',
        ],
        checklistItems: [
          'Problem statement formulated for rural Ethiopian electrification.',
          'Local solar tilt angle calculated using latitude.',
          'Materials sourced safely from school lab or local market.',
          'Safety equipment (insulated wires, safety glasses) confirmed.',
        ],
        studentInputPrompt: 'Write your Phase 1 Project Proposal below. Detail your design hypothesis, component list, and safety measures.',
        placeholderText: 'የፕሮጀክት ዓላማ: በአካባቢያችን ለሚገኙ የመብራት ሃይል ላልደረሳቸው መንደሮች አነስተኛ የፀሐይ እና የውሃ ኃይል ማመንጨት...\nየቁሳቁስ ዝርዝር:\n1. 12V ሚኒ ሶላር ፓናል\n2. መልቲሜትር (Multimeter)\n3. ሪሳይክልድ የተደረጉ ፕላስቲኮች...',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Execution & Experimental Data Collection',
        titleAmharic: 'ደረጃ 2: የሙከራ አፈጻጸም እና የልኬት መረጃዎች ሰንጠረዥ',
        objective: 'Construct the apparatus, run controlled tests under varying sunlight conditions and water flow rates, and record Voltage (V), Current (mA), and calculated Power (mW).',
        deliverables: [
          'Tabulated experimental measurements taken across 5 distinct solar tilt angles (0°, 10°, 20°, 30°, 45°) at 12:00 PM.',
          'Water flow rate (L/min) vs. DC motor terminal voltage readings.',
          'Photos/diagram sketches of the assembled prototype circuit.',
        ],
        checklistItems: [
          'Multimeter calibrated and verified.',
          'At least 5 distinct angle readings recorded.',
          'Water flow rate measured using graduated bucket & stopwatch.',
          'Power (P = V × I) calculated for each condition.',
        ],
        studentInputPrompt: 'Enter your Phase 2 Data Log. Provide your measurement table (Angle/Flow Rate, Voltage V, Current mA, Power mW) and observational notes.',
        placeholderText: 'የሙከራ ውጤቶች:\n- 0° Tilt: 11.2 V, 380 mA => 4.25 W\n- 10° Tilt (Optimal): 12.8 V, 490 mA => 6.27 W\n- 20° Tilt: 12.1 V, 430 mA => 5.20 W\nየውሃ ፍሰት ልኬት: 5 L/min ሲሆን ሞተሩ 4.8 V አመንጭቷል...',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Scientific Conclusion & Community Impact Plan',
        titleAmharic: 'ደረጃ 3: ሳይንሳዊ ድምዳሜ እና የማህበረሰብ ተጠቃሚነት እቅድ',
        objective: 'Analyze experimental data, graph power curves, evaluate discrepancies against theoretical models, and draft an actionable implementation brief for an Ethiopian kebele administration.',
        deliverables: [
          'Mathematical comparison between empirical peak power and manufacturer rating.',
          'Payback period and cost-benefit estimation in Ethiopian Birr (ETB).',
          '3 specific recommendations for scaling the micro-hydro prototype on local streams (e.g. Tekeze or Awash tributaries).',
        ],
        checklistItems: [
          'Hypothesis accepted or rejected with data justification.',
          'Efficiency loss factors (heat, dust deposition, friction) analyzed.',
          'Cost analysis in ETB completed.',
          'Community presentation summary written in Amharic/English.',
        ],
        studentInputPrompt: 'Summarize your Phase 3 Scientific Conclusion, efficiency findings, and practical recommendations for rural Ethiopian adoption.',
        placeholderText: 'ሳይንሳዊ ድምዳሜ:\nሙከራው በኢትዮጵያ ኬክሮስ (Latitude ~9°N) የፀሐይ ፓናል በ10° ዘንበል ብሎ ሲቀመጥ ከፍተኛ 6.27 ዋት ኃይል እንደሚሰጥ አረጋግጧል።\nየማህበረሰብ ተጠቃሚነት: አነስተኛ ወጪ (በአጠቃላይ 850 ብር) በመጠቀም የገጠር ቤተሰቦች ስልክ መሙላት እና 2 የLED መብራቶችን ማብራት ይችላሉ...',
      },
    ],
  },
  {
    id: 'stem-proj-02',
    grade: 10,
    subject: 'Chemistry & Agronomy',
    title: 'Highland Soil Acidity (Nitisols) Titration & Organic Lime Amendment',
    titleAmharic: 'የአፈር አሲዳማነት ልኬት እና የተፈጥሮ ኖራ ማሻሻያ ጥናት',
    theme: 'Food Security, Agricultural Chemistry & Teff Yields',
    ethiopianContext: 'Investigating high acid soils in Gojjam, Wollega, and Sidama which reduce national Teff and cereal harvest yields.',
    summary: 'A field and lab project testing soil pH using natural indicators (red cabbage anthocyanin) and determining exact neutralization thresholds using crushed eggshells and limestone.',
    badgeName: 'Agronomy Scientist (የአፈርና ምርታማነት ተመራማሪ)',
    badgeIcon: 'Sprout',
    estimatedDuration: '2 Weeks (3 Milestones)',
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Sampling Plan & Indicator Preparation',
        titleAmharic: 'ደረጃ 1: የአፈር ናሙና አሰባሰብ እና የተፈጥሮ ኢንዲኬተር ዝግጅት',
        objective: 'Collect representative agricultural soil samples from your local area, extract natural pH indicator solution from boiled red cabbage, and calibrate with known standards (lemon juice, soap water).',
        deliverables: [
          'Geographical sampling log with GPS or village landmarks.',
          'Colorimetric pH calibration chart prepared from natural anthocyanin.',
          'Safety protocol for soil filtration.',
        ],
        checklistItems: [
          'Soil samples collected at 15 cm depth.',
          'Red cabbage extract boiled, strained, and tested on vinegar/soap.',
          'Clean test containers and filter papers labeled.',
        ],
        studentInputPrompt: 'Describe your Phase 1 Soil Sampling site, depth, soil texture, and your calibration results with the natural indicator.',
        placeholderText: 'የናሙና ቦታ: ከእርሻ መሬት በ15 ሳ.ሜ ጥልቀት የተወሰደ ቀይ አፈር (Nitisol)...\nየኢንዲኬተር ዝግጅት: የቀይ ጎመን ጭማቂ በሎሚ ጭማቂ ላይ ቀይ/ሮዝ ሲሆን፣ በሳሙና ውሃ ላይ አረንጓዴ/ሰማያዊ ሆኗል...',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Experimental Titration & pH Measurement',
        titleAmharic: 'ደረጃ 2: የአፈር አሲዳማነት ልኬት እና የኖራ ሙከራ',
        objective: 'Mix soil-to-water 1:2.5 suspension, measure initial pH, add incremental doses of agricultural lime / powdered eggshells, and record pH recovery steps.',
        deliverables: [
          'Initial soil suspension pH reading.',
          'Incremental titration curve: Grams of lime added vs. measured pH (target pH 6.0 - 6.8 for optimal Teff growth).',
          'Observations on soil flocculation and sediment clarity.',
        ],
        checklistItems: [
          'Soil-water suspension stirred for 10 minutes.',
          'Accurate balance used to measure 0.5g increments.',
          'pH readings logged before and after each increment.',
        ],
        studentInputPrompt: 'Enter your Phase 2 Titration Data (Grams of lime added, resulting pH color, calculated pH value).',
        placeholderText: 'የልኬት ውጤት:\n- መነሻ የአፈር pH: 4.8 (ከፍተኛ አሲዳማ)\n- 1.0g ኖራ ሲጨመር: pH 5.4\n- 2.5g ኖራ ሲጨመር: pH 6.2 (ለጤፍ ምቹ ደረጃ)\n- 4.0g ኖራ ሲጨመር: pH 6.9...',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Agronomic Recommendations & Farmer Handbook',
        titleAmharic: 'ደረጃ 3: የአፈር ማሻሻያ ድምዳሜ እና ለአርሶ አደሩ የሚሰጥ ምክረ-ሃሳብ',
        objective: 'Translate laboratory results into a farmer-friendly advisory sheet detailing quintals of lime per hectare required, cost-benefit analysis, and organic compost pairing.',
        deliverables: [
          'Recommendation of tons/hectare for local acidic soils.',
          'Economic return estimate (increased Teff yield quintals per hectare).',
          'Printable 1-page Farmer Guide in local Ethiopian language.',
        ],
        checklistItems: [
          'Field conversion factor calculated correctly.',
          'Yield gain percentage projected.',
          'Farmer guide written in accessible language.',
        ],
        studentInputPrompt: 'Write your Phase 3 Final Report, summarizing lime requirements per hectare and expected crop yield improvements for local farmers.',
        placeholderText: 'የምርምር ድምዳሜ:\nበሙከራው መሰረት 1 ሄክታር መሬት 25 ኩንታል የተፈጨ የኖራ ድንጋይ ይፈልጋል።\nይህንን ማድረግ የጤፍ ምርትን በሄክታር ከ14 ኩንታል ወደ 22 ኩንታል ያሳድጋል።\nየአርሶ አደር መመሪያ: ኖራውን ከማረስ 1 ወር በፊት ከአፈር ጋር በደንብ ማደባለቅ ያስፈልጋል...',
      },
    ],
  },
  {
    id: 'stem-proj-03',
    grade: 10,
    subject: 'Biology & Public Health',
    title: 'Indigenous Moringa Oleifera Seed & Sand Multi-Barrier Water Filtration',
    titleAmharic: 'የሽፈራው (ሞሪንጋ) ፍሬ እና አሸዋ ባለብዙ-ደረጃ የተፈጥሮ ውሃ ማጣሪያ',
    theme: 'Clean Drinking Water, Turbidity Reduction & Biocoagulation',
    ethiopianContext: 'Designing low-cost household water purification systems for communities fetching turbid surface water from seasonal rivers and ponds in rural Ethiopia.',
    summary: 'A public health and biology STEM project utilizing crushed Moringa stenopetala / oleifera seed powder as a natural cationic polyelectrolyte coagulant alongside layered sand and activated charcoal.',
    badgeName: 'Water Quality Champion (የንፁህ ውሃ ተከላካይ)',
    badgeIcon: 'Droplets',
    estimatedDuration: '2 Weeks (3 Milestones)',
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Filter Column Design & Seed Preparation',
        titleAmharic: 'ደረጃ 1: የማጣሪያ ማማ ንድፍ እና የሽፈራው ፍሬ ዝግጅት',
        objective: 'Design a gravity-fed multi-barrier filtration column (gravel, coarse sand, fine sand, crushed charcoal) and prepare standardized Moringa seed coagulant suspension.',
        deliverables: [
          'Cross-sectional blueprint of the 4-layer physical filtration column.',
          'Protocol for decorticating, drying, and crushing dried Moringa seeds into fine powder.',
          'Baseline turbidity test of river water sample.',
        ],
        checklistItems: [
          'Clean recycled PET bottle or PVC pipe selected.',
          'Sand and gravel washed with clean water until free of silt.',
          'Moringa seed kernel crushed in traditional mortar (ሙቀጫ).',
        ],
        studentInputPrompt: 'Describe your Phase 1 Filter Column architecture, layer depths (cm), and seed suspension preparation procedure.',
        placeholderText: 'የማጣሪያው ንብርብሮች:\n1. ጠጠር (Gravel) - 5 ሳ.ሜ\n2. ሻካራ አሸዋ (Coarse sand) - 8 ሳ.ሜ\n3. የከሰል ዱቄት (Activated charcoal) - 5 ሳ.ሜ\n4. ስስ አሸዋ (Fine sand) - 10 ሳ.ሜ\nየሽፈራው ዝግጅት: 5 የደረቁ የሽፈራው ፍሬዎችን በመውቀጥ ዱቄቱን በውሃ ውስጥ መበጥበጥ...',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Jar Test Coagulation & Filtration Trial',
        titleAmharic: 'ደረጃ 2: የፍሬው የረጋጭነት (Coagulation) ሙከራ እና የማጣራት ሂደት',
        objective: 'Conduct a controlled jar test comparing water settling rates: (A) Untreated river water, (B) Water with Moringa seed powder, (C) Multi-barrier filtered water.',
        deliverables: [
          'Sedimentation time log (0 min, 15 min, 30 min, 60 min, 120 min).',
          'Secchi disk / transparency depth measurements (cm of visual clarity).',
          'Flow rate measurement (Liters filtered per hour).',
        ],
        checklistItems: [
          'Equal volumes (1 Liter) of turbid water used in all 3 test jars.',
          'Rapid mixing for 1 min followed by gentle stirring for 5 min.',
          'Clarity photographed or measured with transparency tube.',
        ],
        studentInputPrompt: 'Log your Phase 2 experimental observations: Coagulation speed, visual clarity changes, and filter flow rate (L/hr).',
        placeholderText: 'የሙከራ ውጤት:\n- ያልታከመ ውሃ: ከ2 ሰዓት በኋላም ደፍራሳ ሆኖ ቀጥሏል።\n- በሽፈራው የታከመ: በ30 ደቂቃ ውስጥ ቆሻሻው ወደ ታች ረግቶ ውሃው ጥርት ብሏል (85% ግልጽነት)።\n- በአሸዋ እና ከሰል ማጣሪያ ያለፈው: ፍጹም ጥርት ያለ ውሃ (Transparency > 30cm) ተገኝቷል። የማጣራት ፍጥነት: 4.5 ሊትር በሰዓት...',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Microbiological Evaluation & Safe Storage Protocol',
        titleAmharic: 'ደረጃ 3: የጥራት ግምገማ እና የደህንነት ማረጋገጫ መመሪያ',
        objective: 'Evaluate effectiveness against biological pathogens, outline household chlorine or solar disinfection (SODIS) pairing, and compile a community water-safety guide.',
        deliverables: [
          'Comparative analysis of physical filtration vs. biological safety.',
          'SODIS solar disinfection protocol (6 hours in clear PET bottles in Ethiopian sun).',
          'Safe water storage recommendations to prevent recontamination in traditional pots (እንስራ).',
        ],
        checklistItems: [
          'Clarified that Moringa eliminates turbidity but SODIS/boiling is required for pathogens.',
          'SODIS guidelines specified for Ethiopian UV conditions.',
          'Community guide completed with illustrations.',
        ],
        studentInputPrompt: 'Provide your Phase 3 Final Conclusion, noting safety limitations and your complete 3-step household water treatment protocol (Coagulate → Filter → Disinfect).',
        placeholderText: 'የሳይንሳዊ ድምዳሜ:\nየሽፈራው ፍሬ የተፈጥሮ ኬሚካል (Cationic protein) ቆሻሻዎችን አጣብቆ በማርገብ ረገድ 90% ውጤታማ ነው።\nየደህንነት መመሪያ:\n1. በሽፈራው ማርገብ (Coagulate)\n2. በአሸዋና ከሰል ማጣራት (Filter)\n3. በፀሐይ (SODIS) ለ6 ሰዓት በማቆየት ባክቴሪያዎችን መግደል (Disinfect)...',
      },
    ],
  },
];
