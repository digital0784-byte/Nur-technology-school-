export interface EUEEQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cognitiveLevel: 'Knowledge & Comprehension' | 'Application & Problem Solving' | 'Critical Thinking, Analysis & Synthesis';
  explanation: string;
  misconceptions: Record<string, string>;
}

export const EUEE_GRADE_12_MATH_MODEL_EXAM: EUEEQuestion[] = [
  {
    id: 'euee-math-q1',
    questionNumber: 1,
    prompt: 'Which one of the following statements is strictly TRUE regarding the convergence of infinite real sequences and series?',
    options: [
      'A. If lim (n -> ∞) a_n = 0, then the infinite series ∑ a_n must converge.',
      'B. Every bounded monotonic sequence of real numbers is convergent.',
      'C. A real sequence is convergent if and only if its terms alternate in sign.',
      'D. If ∑ a_n converges, then the series ∑ |a_n| must also converge unconditionally.'
    ],
    correctIndex: 1,
    topic: 'Sequences and Series',
    difficulty: 'medium',
    cognitiveLevel: 'Knowledge & Comprehension',
    explanation: 'According to the Monotone Convergence Theorem (MoE Grade 12 Mathematics Unit 1, p. 18), every bounded monotonic sequence of real numbers converges to its supremum (if monotonically increasing) or its infimum (if monotonically decreasing).',
    misconceptions: {
      '0': 'Common student trap confusing necessary and sufficient conditions for series convergence: lim a_n = 0 is necessary, but NOT sufficient (e.g., harmonic series ∑ 1/n diverges even though 1/n -> 0).',
      '2': 'Confusing the Leibniz alternating series test with general sequence convergence; alternating sign neither guarantees convergence nor is a requirement.',
      '3': 'Confusing conditional convergence with absolute convergence; for example, the alternating harmonic series converges conditionally, but its absolute counterpart diverges.'
    }
  },
  {
    id: 'euee-math-q2',
    questionNumber: 2,
    prompt: 'In three-dimensional Euclidean space ℝ³, if a non-zero vector v makes angles α, β, and γ with the positive x, y, and z axes respectively, what is the exact value of cos²(α) + cos²(β) + cos²(γ)?',
    options: [
      'A. 0',
      'B. 1',
      'C. √3',
      'D. 3'
    ],
    correctIndex: 1,
    topic: 'Vectors in Three Dimensions',
    difficulty: 'easy',
    cognitiveLevel: 'Knowledge & Comprehension',
    explanation: 'The direction cosines l = cos(α), m = cos(β), n = cos(γ) form the components of the unit vector in the direction of v. By the Pythagorean theorem in ℝ³, l² + m² + n² = cos²(α) + cos²(β) + cos²(γ) = 1 (MoE Grade 12 Mathematics Unit 5, p. 214).',
    misconceptions: {
      '0': 'Confusing the orthogonality dot product condition (u · v = 0) with the sum of squared direction cosines.',
      '2': 'Mistakenly calculating the spatial diagonal norm of vector (1, 1, 1), which is √(1² + 1² + 1²) = √3.',
      '3': 'Naively summing the maximum algebraic values of each cosine squared individually (1 + 1 + 1 = 3), ignoring geometric constraints.'
    }
  },
  {
    id: 'euee-math-q3',
    questionNumber: 3,
    prompt: 'Let f(x) be a real-valued function defined on an open interval containing x = c. Which of the following conditions is strictly NECESSARY for f(x) to be differentiable at x = c?',
    options: [
      'A. f(x) must be continuous at x = c',
      'B. f"(c) must exist and be strictly non-zero',
      'C. f\'(x) must be strictly increasing on the entire neighborhood',
      'D. f(x) must attain a local extremum at x = c'
    ],
    correctIndex: 0,
    topic: 'Introduction to Calculus - Continuity and Differentiability',
    difficulty: 'easy',
    cognitiveLevel: 'Knowledge & Comprehension',
    explanation: 'A fundamental theorem of calculus states that if f is differentiable at x = c, then f must be continuous at x = c (MoE Grade 12 Mathematics Unit 2, p. 74). Therefore, continuity is a necessary (though not sufficient) condition.',
    misconceptions: {
      '1': 'Confusing requirements for concavity or inflection points (second derivative) with the baseline existence of the first derivative.',
      '2': 'Confusing monotonicity/convexity requirements with the localized definition of differentiability.',
      '3': 'Misinterpreting Fermat\'s stationary point theorem (f\'(c) = 0 at extrema) as a prerequisite for differentiability in general.'
    }
  },
  {
    id: 'euee-math-q4',
    questionNumber: 4,
    prompt: 'Evaluate the trigonometric limit: lim (x -> 0) [(1 - cos(4x)) / (x · sin(2x))]',
    options: [
      'A. 2',
      'B. 4',
      'C. 8',
      'D. 0'
    ],
    correctIndex: 1,
    topic: 'Limits and Continuity',
    difficulty: 'medium',
    cognitiveLevel: 'Application & Problem Solving',
    explanation: 'Using the identity 1 - cos(4x) = 2 sin²(2x), we get: lim (x -> 0) [2 sin²(2x) / (x · sin(2x))] = lim (x -> 0) [2 sin(2x) / x] = 2 · 2 · lim (x -> 0) [sin(2x) / (2x)] = 4 · 1 = 4. (MoE Grade 12 Mathematics Unit 2, p. 86).',
    misconceptions: {
      '0': 'Forgetting the chain rule coefficient 2 from sin(2x)/x, computing 2 · 1 = 2.',
      '2': 'Squaring the frequency multiplier (4x)² / (2x) = 16/2 = 8 without accounting for the 1/2 factor in 2 sin²(2x).',
      '3': 'Directly substituting x = 0 to get 0/0 and erroneously concluding the limit is 0 without applying L\'Hôpital or trigonometric identities.'
    }
  },
  {
    id: 'euee-math-q5',
    questionNumber: 5,
    prompt: 'What is the equation of the tangent line to the logarithmic curve y = ln(x² - 3) at the point where x = 2?',
    options: [
      'A. y = 4x - 8',
      'B. y = 2x - 4',
      'C. y = 4x - 6',
      'D. y = (1/2)x - 1'
    ],
    correctIndex: 0,
    topic: 'Applications of Differential Calculus',
    difficulty: 'medium',
    cognitiveLevel: 'Application & Problem Solving',
    explanation: 'At x = 2, y = ln(2² - 3) = ln(1) = 0, giving point (2, 0). Differentiating by Chain Rule: dy/dx = 2x / (x² - 3). At x = 2, slope m = 2(2) / (4 - 3) = 4. The tangent equation is y - 0 = 4(x - 2) => y = 4x - 8 (MoE Grade 12 Mathematics Unit 3, p. 112).',
    misconceptions: {
      '1': 'Omitting the internal derivative of x² - 3, taking dy/dx = 1 / (x² - 3) · 2 or slope m = 2, giving y = 2x - 4.',
      '2': 'Sign and expansion error: calculating 4(x - 2) as 4x - 6 instead of 4x - 8.',
      '3': 'Reciprocal fraction error: differentiating ln(u) as u / u\' rather than u\' / u, leading to fractional slope.'
    }
  },
  {
    id: 'euee-math-q6',
    questionNumber: 6,
    prompt: 'What is the exact area of the closed region bounded between the parabola y = 4 - x² and the straight line y = x + 2?',
    options: [
      'A. 7/2 square units',
      'B. 9/2 square units',
      'C. 11/2 square units',
      'D. 9 square units'
    ],
    correctIndex: 1,
    topic: 'Integral Calculus and Area Calculations',
    difficulty: 'medium',
    cognitiveLevel: 'Application & Problem Solving',
    explanation: 'Find intersection points: 4 - x² = x + 2 => x² + x - 2 = 0 => (x + 2)(x - 1) = 0, so x = -2 and x = 1. Area = ∫_{-2}^{1} [(4 - x²) - (x + 2)] dx = ∫_{-2}^{1} (2 - x - x²) dx = [2x - x²/2 - x³/3]_{-2}^{1} = (2 - 1/2 - 1/3) - (-4 - 2 + 8/3) = 7/6 - (-10/3) = 27/6 = 9/2 square units (MoE Grade 12 Mathematics Unit 4, pp. 165-172).',
    misconceptions: {
      '0': 'Minus sign error when distributing the subtraction of the lower limit evaluation, getting 7/6 - 2 = 7/2.',
      '2': 'Failing to reverse the signs of the lower line, integrating (x + 2) - (4 - x²) and getting negative area or arithmetic error.',
      '3': 'Omitting the integration coefficients (neglecting the division by 2 and 3), evaluating 2(3) + 3 = 9.'
    }
  },
  {
    id: 'euee-math-q7',
    questionNumber: 7,
    prompt: 'In an infinite geometric series, the first term is a = 6 and the sum to infinity is S_∞ = 18. What is the common ratio r and the third term a_3?',
    options: [
      'A. r = 2/3, a_3 = 8/3',
      'B. r = 1/3, a_3 = 2/3',
      'C. r = 2/3, a_3 = 4',
      'D. r = 3/2, a_3 = 27/2'
    ],
    correctIndex: 0,
    topic: 'Sequences and Series',
    difficulty: 'medium',
    cognitiveLevel: 'Application & Problem Solving',
    explanation: 'S_∞ = a / (1 - r) => 18 = 6 / (1 - r) => 1 - r = 6/18 = 1/3 => r = 2/3. Then the third term is a_3 = a · r² = 6 · (2/3)² = 6 · (4/9) = 24/9 = 8/3 (MoE Grade 12 Mathematics Unit 1, p. 32).',
    misconceptions: {
      '1': 'Setting r = 1/3 directly from 1 - r = 1/3 without subtracting from 1.',
      '2': 'Calculating a_3 = a · r instead of a · r², calculating 6 · 2/3 = 4.',
      '3': 'Inverting the ratio 18/6 = 3 => r = 3/2, which produces a divergent series (|r| > 1).'
    }
  },
  {
    id: 'euee-math-q8',
    questionNumber: 8,
    prompt: 'A cylindrical water tank with an open top is being constructed for a high school lab in Hawassa. The volume must be exactly 54π m³. What base radius r minimizes the total surface area of sheet metal required?',
    options: [
      'A. r = 3 m',
      'B. r = 3√2 m',
      'C. r = 6 m',
      'D. r = 27 m'
    ],
    correctIndex: 0,
    topic: 'Optimization and Applications of Derivatives',
    difficulty: 'hard',
    cognitiveLevel: 'Application & Problem Solving',
    explanation: 'Volume V = π r² h = 54π => h = 54 / r². Open-top surface area A(r) = π r² + 2π r h = π r² + 108π / r. Setting dA/dr = 2π r - 108π / r² = 0 => 2π r³ = 108π => r³ = 54 / 2 = 27 => r = ∛27 = 3 m (MoE Grade 12 Mathematics Unit 3, pp. 138-142).',
    misconceptions: {
      '1': 'Formulating for a closed cylinder (top and bottom included: 2π r² + 2π r h), which leads to r³ = 27/2 and miscalculated roots.',
      '2': 'Confusing base diameter with radius (2r = 6 m) and selecting 6 m.',
      '3': 'Failing to take the cube root of r³ = 27, leaving r = 27 m.'
    }
  },
  {
    id: 'euee-math-q9',
    questionNumber: 9,
    prompt: 'Consider the cubic polynomial f(x) = 2x³ - 9x² + 12x - k, where k is a real parameter. For which interval of k does the equation f(x) = 0 have exactly THREE distinct real roots?',
    options: [
      'A. 4 < k < 5',
      'B. k < 4 or k > 5',
      'C. 0 < k < 4',
      'D. k = 4 or k = 5'
    ],
    correctIndex: 0,
    topic: 'Polynomial Analysis, Critical Values & Rolle\'s Theorem',
    difficulty: 'hard',
    cognitiveLevel: 'Critical Thinking, Analysis & Synthesis',
    explanation: 'Find critical points: f\'(x) = 6x² - 18x + 12 = 6(x - 1)(x - 2) = 0 => x = 1, x = 2. Local maximum: f(1) = 2 - 9 + 12 - k = 5 - k. Local minimum: f(2) = 16 - 36 + 24 - k = 4 - k. For three distinct real roots, the local extremum values must have opposite signs: f(1) > 0 => k < 5, and f(2) < 0 => k > 4. Hence 4 < k < 5 (MoE Grade 12 Mathematics Unit 3, p. 145).',
    misconceptions: {
      '1': 'Inverting the condition: setting f(1) < 0 or f(2) > 0, which corresponds to the cubic having only 1 real root.',
      '2': 'Confusing the domain critical values (1 and 2) with k-intervals.',
      '3': 'Selecting the boundary values k = 4 or k = 5 where the polynomial touches the x-axis with a repeated root (only 2 distinct roots).'
    }
  },
  {
    id: 'euee-math-q10',
    questionNumber: 10,
    prompt: 'In ℝ³, what is the shortest perpendicular distance from the point P(2, -1, 3) to the plane given by the equation 2x - 2y + z + 7 = 0?',
    options: [
      'A. 16/3 units',
      'B. 11/3 units',
      'C. 4 units',
      'D. 16/9 units'
    ],
    correctIndex: 0,
    topic: 'Three-Dimensional Coordinate Geometry & Vectors',
    difficulty: 'hard',
    cognitiveLevel: 'Critical Thinking, Analysis & Synthesis',
    explanation: 'Distance formula: d = |A x₀ + B y₀ + C z₀ + D| / √(A² + B² + C²). Here (x₀, y₀, z₀) = (2, -1, 3) and plane is 2x - 2y + z + 7 = 0. Numerator = |2(2) - 2(-1) + 1(3) + 7| = |4 + 2 + 3 + 7| = 16. Denominator = √(2² + (-2)² + 1²) = √(4 + 4 + 1) = √9 = 3. Distance = 16/3 units (MoE Grade 12 Mathematics Unit 5, pp. 228-232).',
    misconceptions: {
      '1': 'Sign mistake in coordinate evaluation: computing -2(-1) as -2, giving numerator 11 and distance 11/3.',
      '2': 'Summing absolute plane coefficients |2| + |-2| + |1| = 5 or 4 instead of Pythagorean Euclidean norm √(A² + B² + C²).',
      '3': 'Squaring the denominator norm (using A² + B² + C² = 9 instead of the square root √9 = 3), resulting in 16/9.'
    }
  }
];
