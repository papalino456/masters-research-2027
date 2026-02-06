// Masters Research Dashboard Data
// Structured from /notes/masters-research-2027/

export interface Requirement {
  id: string;
  name: string;
  category: "document" | "test" | "deadline" | "scholarship";
  description?: string;
  deadline?: string;
  completed: boolean;
}

export interface University {
  id: string;
  name: string;
  program: string;
  location: string;
  country: string;
  deadline: string;
  scholarshipDeadline?: string;
  status: "priority" | "target" | "aspirational";
  focus: string;
  url: string;
  tuition: string;
  tuitionAmount: number; // yearly in EUR
  duration: string;
  credits: number;
  requirements: Requirement[];
  highlights: string[];
  notes?: {
    curriculumMatch?: string;
    industryEcosystem?: string;
    euAdvantages?: string;
    scholarships?: string;
    applicationPeriod?: string;
  };
}

export interface FinancialItem {
  category: string;
  items: {
    name: string;
    amount: number;
    currency: string;
    frequency: "yearly" | "monthly" | "one-time";
    note?: string;
  }[];
}

export interface Scholarship {
  id: string;
  name: string;
  university?: string;
  amount: string;
  deadline?: string;
  eligibility: string[];
  status: "eligible" | "check" | "ineligible";
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "deadline" | "milestone" | "scholarship";
  university?: string;
  critical: boolean;
}

// ============================================
// UNIVERSITIES DATA
// ============================================

export const universities: University[] = [
  {
    id: "tum",
    name: "TU Munich",
    program: "MSc Robotics, Cognition, Intelligence",
    location: "Munich",
    country: "Germany",
    deadline: "2027-05-31",
    status: "priority",
    focus: "Industrial AI & Sensor Fusion",
    url: "https://www.tum.de/en/studies/degree-programs/detail/robotics-cognition-intelligence-master-of-science-msc/",
    tuition: "€0 (EU Citizen)",
    tuitionAmount: 150, // semester fee only
    duration: "4 Semesters (2 years)",
    credits: 120,
    highlights: [
      "Tuition-free for EU citizens (semester fee ~€150)",
      "Munich ecosystem: BMW, Siemens, DLR, Franka Robotics",
      "English-taught (EU: may be exempt from IELTS/TOEFL)",
      "Aptitude assessment: Stage 1 (GPA) or Stage 2 (+interview)",
      "No GRE required for EU applicants",
      "Access to MIRMI robotics research institute",
      "Direct TUMonline application (no Uni-Assist/VPD)"
    ],
    requirements: [
      { id: "tum-1", name: "Aptitude Assessment (EFV) - Stage 1", category: "test", completed: false, description: "Automatic scoring based on GPA and subject background. Direct offer if threshold met." },
      { id: "tum-2", name: "Aptitude Assessment (EFV) - Stage 2", category: "test", completed: false, description: "Online interview if middle-tier. Focus: motivation and domain knowledge." },
      { id: "tum-3", name: "English Proficiency (IELTS 6.5+ / TOEFL 88+)", category: "test", completed: false, description: "EU applicants may be exempt if Bachelor's was in English" },
      { id: "tum-4", name: "Letter of Motivation", category: "document", completed: false, description: "Focus: interest in robotics/AI and career goals" },
      { id: "tum-5", name: "CV/Resume", category: "document", completed: false },
      { id: "tum-6", name: "Transcripts", category: "document", completed: false },
      { id: "tum-7", name: "TUMonline Application", category: "deadline", deadline: "2027-05-31", completed: false, description: "Direct application portal - opens April 1, 2027" },
    ],
    notes: {
      curriculumMatch: "Mechatronics graduates generally meet prerequisites. TUM looks for: Higher Mathematics, CS fundamentals, Control Theory. Possible 'Auflage' (conditional) exams in Theoretical CS if missing.",
      industryEcosystem: "Munich is Germany's premier robotics hub. Corporate opportunities: BMW, Audi, Siemens, Airbus. Research: DLR (German Aerospace), Franka Robotics, Magazino, MIRMI institute.",
      euAdvantages: "No GRE required. No VPD/Uni-Assist (direct TUMonline). Unlimited German labor market access. No student visa needed.",
      scholarships: "Deutschlandstipendium (€300/month, post-enrollment), Bavarian State Scholarships (one-time grants)",
      applicationPeriod: "April 1 - May 31, 2027 (both EU and non-EU)"
    }
  },
  {
    id: "eth",
    name: "ETH Zurich",
    program: "MSc Robotics, Systems and Control",
    location: "Zurich",
    country: "Switzerland",
    deadline: "2026-11-30",
    scholarshipDeadline: "2026-11-30",
    status: "target",
    focus: "Control Theory & Physical Integration",
    url: "https://master-robotics.ethz.ch/",
    tuition: "~CHF 1,500/yr",
    tuitionAmount: 1400, // EUR equivalent
    duration: "3-5 Semesters (1.5-2.5 years)",
    credits: 90,
    highlights: [
      "Top 10 worldwide for engineering",
      "Low tuition for everyone",
      "ESOP scholarship opportunity",
      "Strong control systems focus"
    ],
    requirements: [
      { id: "eth-1", name: "ESOP Thesis Pre-proposal (500 words)", category: "scholarship", deadline: "2026-11-30", completed: false, description: "Required for Excellence Scholarship" },
      { id: "eth-2", name: "Top 10% Class Rank Documentation", category: "document", completed: false, description: "Required for ESOP eligibility" },
      { id: "eth-3", name: "Two Reference Letters", category: "document", completed: false },
      { id: "eth-4", name: "Motivation Letter (1-2 pages)", category: "document", completed: false },
      { id: "eth-5", name: "CV/Resume", category: "document", completed: false },
      { id: "eth-6", name: "Transcripts", category: "document", completed: false },
      { id: "eth-7", name: "Online Application Submission", category: "deadline", deadline: "2026-11-30", completed: false },
    ]
  },
  {
    id: "tudelft",
    name: "TU Delft",
    program: "MSc Robotics",
    location: "Delft",
    country: "Netherlands",
    deadline: "2027-07-01",
    scholarshipDeadline: "2026-12-01",
    status: "target",
    focus: "Brain-Body Integration & Haptics",
    url: "https://www.tudelft.nl/en/education/programmes/masters/robotics/msc-robotics",
    tuition: "~€2,530/yr (EU)",
    tuitionAmount: 2530,
    duration: "4 Semesters (2 years)",
    credits: 120,
    highlights: [
      "Strong Human-Robot Interaction focus",
      "RoboValley industry partnerships",
      "Three track options (AI, Physical, Haptic)",
      "Lower cost of living than Zurich/Munich"
    ],
    requirements: [
      { id: "delft-1", name: "Excellence Scholarship Application", category: "scholarship", deadline: "2026-12-01", completed: false, description: "Justus & Louise van Effen - Full funding" },
      { id: "delft-2", name: "English Proficiency (TOEFL 100 / IELTS 7.0)", category: "test", completed: false },
      { id: "delft-3", name: "Python/C++ Proficiency Evidence", category: "document", completed: false },
      { id: "delft-4", name: "CV/Resume", category: "document", completed: false },
      { id: "delft-5", name: "Transcripts", category: "document", completed: false },
      { id: "delft-6", name: "Motivation Letter", category: "document", completed: false },
      { id: "delft-7", name: "Application Submission", category: "deadline", deadline: "2027-07-01", completed: false },
    ]
  },
  {
    id: "mit",
    name: "MIT",
    program: "SM EECS / MechE",
    location: "Boston",
    country: "USA",
    deadline: "2026-12-15",
    status: "aspirational",
    focus: "Biomimetic Robotics & CSAIL",
    url: "https://www.csail.mit.edu/",
    tuition: "Full Funding (RA/TA)",
    tuitionAmount: 60000,
    duration: "4 Semesters (2 years)",
    credits: 72,
    highlights: [
      "World's top robotics research",
      "CSAIL access",
      "Full funding via RA/TA typical",
      "Industry connections"
    ],
    requirements: [
      { id: "mit-1", name: "GRE (MechE only)", category: "test", completed: false, description: "Not required for EECS" },
      { id: "mit-2", name: "Research Portfolio / Publications", category: "document", completed: false, description: "Critical differentiator" },
      { id: "mit-3", name: "Statement of Objectives", category: "document", completed: false },
      { id: "mit-4", name: "Three Reference Letters", category: "document", completed: false },
      { id: "mit-5", name: "CV/Resume", category: "document", completed: false },
      { id: "mit-6", name: "Transcripts", category: "document", completed: false },
      { id: "mit-7", name: "Application Submission", category: "deadline", deadline: "2026-12-15", completed: false },
    ]
  },
];

// ============================================
// FINANCIAL DATA
// ============================================

export const financialProfiles: Record<string, FinancialItem[]> = {
  tum: [
    {
      category: "Tuition & Fees",
      items: [
        { name: "Semester Fee", amount: 150, currency: "EUR", frequency: "yearly", note: "Includes public transport" },
      ]
    },
    {
      category: "Living Costs",
      items: [
        { name: "Rent (Shared)", amount: 900, currency: "EUR", frequency: "monthly" },
        { name: "Food & Utilities", amount: 400, currency: "EUR", frequency: "monthly" },
        { name: "Health Insurance", amount: 120, currency: "EUR", frequency: "monthly" },
        { name: "Misc & Transport", amount: 80, currency: "EUR", frequency: "monthly" },
      ]
    },
    {
      category: "One-Time Costs",
      items: [
        { name: "Moving Budget", amount: 2500, currency: "EUR", frequency: "one-time" },
        { name: "Deposit (3 months rent)", amount: 2700, currency: "EUR", frequency: "one-time" },
      ]
    }
  ],
  eth: [
    {
      category: "Tuition & Fees",
      items: [
        { name: "Tuition (per semester)", amount: 730, currency: "CHF", frequency: "yearly" },
      ]
    },
    {
      category: "Living Costs",
      items: [
        { name: "Rent (Shared)", amount: 1200, currency: "CHF", frequency: "monthly" },
        { name: "Food & Utilities", amount: 600, currency: "CHF", frequency: "monthly" },
        { name: "Health Insurance", amount: 400, currency: "CHF", frequency: "monthly" },
        { name: "Misc & Transport", amount: 200, currency: "CHF", frequency: "monthly" },
      ]
    },
    {
      category: "One-Time Costs",
      items: [
        { name: "Moving Budget", amount: 4000, currency: "EUR", frequency: "one-time" },
        { name: "Deposit (3 months rent)", amount: 3600, currency: "CHF", frequency: "one-time" },
      ]
    }
  ],
  tudelft: [
    {
      category: "Tuition & Fees",
      items: [
        { name: "Statutory Tuition (EU)", amount: 2530, currency: "EUR", frequency: "yearly" },
      ]
    },
    {
      category: "Living Costs",
      items: [
        { name: "Rent (Shared)", amount: 700, currency: "EUR", frequency: "monthly" },
        { name: "Food & Utilities", amount: 350, currency: "EUR", frequency: "monthly" },
        { name: "Health Insurance", amount: 130, currency: "EUR", frequency: "monthly" },
        { name: "Misc & Transport", amount: 120, currency: "EUR", frequency: "monthly" },
      ]
    },
    {
      category: "One-Time Costs",
      items: [
        { name: "Moving Budget", amount: 2500, currency: "EUR", frequency: "one-time" },
        { name: "Deposit (2 months rent)", amount: 1400, currency: "EUR", frequency: "one-time" },
      ]
    }
  ],
  mit: [
    {
      category: "Tuition & Fees",
      items: [
        { name: "Tuition (if not funded)", amount: 60000, currency: "USD", frequency: "yearly", note: "Usually covered by RA/TA" },
      ]
    },
    {
      category: "Living Costs",
      items: [
        { name: "Rent (Shared)", amount: 1700, currency: "USD", frequency: "monthly" },
        { name: "Food & Utilities", amount: 600, currency: "USD", frequency: "monthly" },
        { name: "Health Insurance", amount: 300, currency: "USD", frequency: "monthly" },
        { name: "Misc & Transport", amount: 300, currency: "USD", frequency: "monthly" },
      ]
    },
    {
      category: "One-Time Costs",
      items: [
        { name: "Moving Budget", amount: 5000, currency: "USD", frequency: "one-time" },
        { name: "Deposit & Setup", amount: 5000, currency: "USD", frequency: "one-time" },
      ]
    }
  ],
};

// ============================================
// SCHOLARSHIPS DATA
// ============================================

export const scholarships: Scholarship[] = [
  {
    id: "esop",
    name: "ETH Excellence Scholarship (ESOP)",
    university: "eth",
    amount: "CHF 12,000/semester + tuition waiver",
    deadline: "2026-11-30",
    eligibility: ["Top 10% of Bachelor's program", "No existing Master's degree", "Research pre-proposal required"],
    status: "check"
  },
  {
    id: "delft-excellence",
    name: "Justus & Louise van Effen Excellence Scholarship",
    university: "tudelft",
    amount: "Full tuition + €12,500/year living allowance",
    deadline: "2026-12-01",
    eligibility: ["Top 0.1% of applicants", "Outstanding academic record"],
    status: "check"
  },
  {
    id: "daad",
    name: "DAAD Study Scholarship",
    amount: "€934/month + travel + insurance",
    eligibility: ["Any nationality", "Technical fields prioritized"],
    status: "eligible"
  },
  {
    id: "deutschlandstipendium",
    name: "Deutschlandstipendium",
    university: "tum",
    amount: "€300/month",
    eligibility: ["High academic achievement", "Applied after enrollment"],
    status: "eligible"
  },
  {
    id: "holland",
    name: "Holland Scholarship",
    amount: "€5,000 one-time",
    eligibility: ["Non-EEA students only"],
    status: "ineligible"
  },
];

// ============================================
// TIMELINE DATA
// ============================================

export const timeline: TimelineEvent[] = [
  {
    id: "t1",
    date: "2026-10-01",
    title: "Prepare ETH Application Materials",
    description: "Draft ESOP thesis pre-proposal, gather transcripts, request reference letters",
    type: "milestone",
    university: "eth",
    critical: true
  },
  {
    id: "t2",
    date: "2026-10-15",
    title: "Knight-Hennessy Deadline (Stanford)",
    description: "If applying to Stanford with Knight-Hennessy scholarship",
    type: "scholarship",
    critical: false
  },
  {
    id: "t3",
    date: "2026-11-01",
    title: "ETH Application Opens",
    description: "Portal opens for Fall 2027 applications",
    type: "milestone",
    university: "eth",
    critical: false
  },
  {
    id: "t4",
    date: "2026-11-30",
    title: "ETH Zurich Deadline",
    description: "Admission + ESOP scholarship application due",
    type: "deadline",
    university: "eth",
    critical: true
  },
  {
    id: "t5",
    date: "2026-12-01",
    title: "TU Delft Excellence Scholarship",
    description: "Justus & Louise van Effen scholarship deadline",
    type: "scholarship",
    university: "tudelft",
    critical: true
  },
  {
    id: "t6",
    date: "2026-12-15",
    title: "MIT Application Deadline",
    description: "EECS and MechE graduate applications due",
    type: "deadline",
    university: "mit",
    critical: true
  },
  {
    id: "t7",
    date: "2027-03-01",
    title: "ETH Decision Expected",
    description: "Admission decisions typically released",
    type: "milestone",
    university: "eth",
    critical: false
  },
  {
    id: "t8",
    date: "2027-04-01",
    title: "TUM Application Opens",
    description: "TUMonline portal opens for Fall 2027",
    type: "milestone",
    university: "tum",
    critical: false
  },
  {
    id: "t9",
    date: "2027-05-31",
    title: "TUM Application Deadline",
    description: "Final deadline for document submission",
    type: "deadline",
    university: "tum",
    critical: true
  },
  {
    id: "t10",
    date: "2027-07-01",
    title: "TU Delft Final Deadline",
    description: "Absolute final deadline for EU applicants",
    type: "deadline",
    university: "tudelft",
    critical: true
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getUniversityById(id: string): University | undefined {
  return universities.find(u => u.id === id);
}

export function calculateYearlyCost(universityId: string): number {
  const profile = financialProfiles[universityId];
  if (!profile) return 0;
  
  let total = 0;
  profile.forEach(category => {
    category.items.forEach(item => {
      if (item.frequency === "yearly") total += item.amount;
      else if (item.frequency === "monthly") total += item.amount * 12;
    });
  });
  return total;
}

export function calculateTotalCost(universityId: string, years: number = 2): number {
  const profile = financialProfiles[universityId];
  if (!profile) return 0;
  
  let total = 0;
  profile.forEach(category => {
    category.items.forEach(item => {
      if (item.frequency === "yearly") total += item.amount * years;
      else if (item.frequency === "monthly") total += item.amount * 12 * years;
      else if (item.frequency === "one-time") total += item.amount;
    });
  });
  return total;
}

export function getUpcomingDeadlines(days: number = 90): TimelineEvent[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return timeline
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= cutoff;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getDaysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
