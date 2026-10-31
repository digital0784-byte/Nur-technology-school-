import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Compass,
  GraduationCap,
  Building2,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  Award,
  Sparkles,
  Cpu,
  Stethoscope,
  Scale,
  Wheat,
  Plane,
  Zap,
  BookOpen,
  ChevronRight,
  Save,
  HelpCircle,
  TrendingUp,
  MapPin,
  Filter,
} from 'lucide-react';

// ================= DATA DEFINITIONS =================

export interface PathwayItem {
  id: string;
  stream: 'Natural Science' | 'Social Science';
  category: string;
  categoryAm: string;
  titleEn: string;
  titleAm: string;
  icon: string;
  descriptionEn: string;
  descriptionAm: string;
  prerequisites: string[];
  careerRolesEn: string[];
  careerRolesAm: string[];
  topUniversities: string[];
  nationalRelevance: string;
}

export interface UniversityProfile {
  id: string;
  code: string;
  nameEn: string;
  nameAm: string;
  location: string;
  locationAm: string;
  established: number;
  type: string;
  typeAm: string;
  flagshipPrograms: string[];
  cutoffPoints: {
    naturalMedicine: string;
    naturalEngineering: string;
    naturalGeneral: string;
    socialLaw: string;
    socialBusiness: string;
    socialGeneral: string;
  };
  prerequisites: string[];
  descriptionAm: string;
  highlights: string[];
}

export interface MegaprojectItem {
  id: string;
  nameEn: string;
  nameAm: string;
  icon: string;
  region: string;
  subjectsInvolved: {
    subject: string;
    scientificApplicationAm: string;
  }[];
  nationalImpactAm: string;
  relatedDegrees: string[];
}

// 1. PATHWAYS DATA
const PATHWAYS_DATA: PathwayItem[] = [
  // Natural Science Pathways
  {
    id: 'path-medicine',
    stream: 'Natural Science',
    category: 'Medicine & Health',
    categoryAm: 'ህክምናና ጤና ሳይንስ',
    titleEn: 'Medicine, Surgery & Public Health',
    titleAm: 'አጠቃላይ ህክምና፣ የቀዶ ጥገና እና የህዝብ ጤና',
    icon: '🩺',
    descriptionEn: 'Clinical pathology, surgery, biomedical therapeutics, and healthcare epidemic management.',
    descriptionAm: 'የክሊኒካል ህክምና፣ የቀዶ ህክምና፣ የፋርማሲዩቲካልስ ምርምር እና የህብረተሰብ ጤና አጠባበቅ ስርዓት መምራት።',
    prerequisites: ['Biology (Grade 9-12)', 'Chemistry', 'Physics', 'English'],
    careerRolesEn: ['Medical Doctor (MD)', 'Specialist Surgeon', 'Clinical Pharmacist', 'Epidemiologist'],
    careerRolesAm: ['ሀኪም (Medical Doctor)', 'የቀዶ ጥገና ስፔሻሊስት', 'የክሊኒክ ፋርማሲስት', 'የወረርሽኝ መቆጣጠሪያ ተመራማሪ'],
    topUniversities: ['Addis Ababa University (Tikur Anbessa)', 'University of Gondar', 'Jimma University', 'Hawassa University'],
    nationalRelevance: 'የኢትዮጵያን የጤና ኤክስቴንሽን ፕሮግራም ወደ ከፍተኛ ስፔሻላይዝድ ህክምና ማሸጋገርና በሀገር ውስጥ መድኃኒት ማምረት።',
  },
  {
    id: 'path-engineering',
    stream: 'Natural Science',
    category: 'Engineering & Tech',
    categoryAm: 'ምህንድስና እና ቴክኖሎጂ',
    titleEn: 'Electrical, Civil, Mechanical & Software Engineering',
    titleAm: 'የኤሌክትሪካል፣ ሲቪል፣ ሜካኒካል እና የሶፍትዌር ምህንድስና',
    icon: '⚡',
    descriptionEn: 'National infrastructure construction, smart power grid networks, telecommunications, and digital software development.',
    descriptionAm: 'የግድቦችና መንገዶች ግንባታ፣ የኃይል ማመንጫ መረቦች፣ የኤሮስፔስ ቴክኖሎጂ እና የዲጂታል ቴሌኮም ሶፍትዌር ማበልጸጊያ።',
    prerequisites: ['Advanced Mathematics', 'Physics', 'Chemistry', 'IT / Computer Science'],
    careerRolesEn: ['Power Grid Systems Engineer', 'Structural Civil Engineer', 'Software Architect / AI Engineer', 'Aviation Maintenance Engineer'],
    careerRolesAm: ['የኤሌክትሪክ መረብ መሀንዲስ', 'የሲቪልና ድልድይ መሀንዲስ', 'የሶፍትዌር እና AI አርክቴክት', 'የአቪዬሽን ጥገና መሀንዲስ'],
    topUniversities: ['AAU (AAiT)', 'ASTU (Adama)', 'AASTU (Kilinto)', 'Bahir Dar (BiT)'],
    nationalRelevance: 'እንደ ህዳሴ ግድብ፣ የኢትዮ ቴሌኮም ኔትወርክ እና የኢትዮጵያ አየር መንገድ ያሉትን ብሔራዊ ተቋማት በሀገር በቀል ባለሙያ መገንባት።',
  },
  {
    id: 'path-agriculture',
    stream: 'Natural Science',
    category: 'Agricultural Science',
    categoryAm: 'ግብርናና የምግብ ሳይንስ',
    titleEn: 'Agronomy, Irrigation Engineering & Food Science',
    titleAm: 'አግሮኖሚ፣ የመስኖ ምህንድስና እና የግብርና ምርታማነት',
    icon: '🌾',
    descriptionEn: 'Modernizing dry-season wheat farming, high-yield seed genetics, precision irrigation, and livestock value chains.',
    descriptionAm: 'የበጋ መስኖ ስንዴ፣ የቡናና ጥራጥሬ ምርት ማሳደግ፣ የአፈር ማዳበሪያ አጠቃቀም እና የእንስሳት እርባታ ቴክኖሎጂ።',
    prerequisites: ['Biology', 'Chemistry', 'Mathematics', 'Geography'],
    careerRolesEn: ['Agronomist & Soil Scientist', 'Hydrology Irrigation Specialist', 'Horticulturalist', 'Agro-Processing Director'],
    careerRolesAm: ['የአፈርና ምርት ሳይንቲስት', 'የመስኖ ውሃ መሀንዲስ', 'የሆርቲካልቸር ባለሙያ', 'የምግብ ፋብሪካ ስራ አስኪያጅ'],
    topUniversities: ['Haramaya University', 'Hawassa University (Wondo Genet)', 'Jimma College of Agriculture'],
    nationalRelevance: 'የኢትዮጵያን የምግብ ዋስትና ማረጋገጥና ወደ ውጭ የሚላኩ የግብርና ምርቶችን (ቡና፣ ስንዴ፣ አኩሪ አተር) በቴክኖሎጂ ማሳደግ።',
  },
  {
    id: 'path-biotechnology',
    stream: 'Natural Science',
    category: 'Biotechnology',
    categoryAm: 'ባዮቴክኖሎጂና ተግባራዊ ሳይንስ',
    titleEn: 'Molecular Genetics, Industrial Microbiology & Bioinformatics',
    titleAm: 'ሞለኪውላር ጀነቲክስ፣ የኢንዱስትሪ ማይክሮባዮሎጂ እና ባዮኢንፎርማቲክስ',
    icon: '🧬',
    descriptionEn: 'Engineering disease-resistant crops (Teff & Enset genomics), vaccine biomanufacturing, and biofuels.',
    descriptionAm: 'የጤፍና እንሰት የዘረ-መል (DNA) ምርምር፣ የክትባትና መድኃኒቶች ባዮፋብሪካ፣ እና የኢንዱስትሪ ባዮኢነርጂ።',
    prerequisites: ['Biology', 'Chemistry', 'Mathematics'],
    careerRolesEn: ['Biotechnologist', 'Genomics Researcher', 'Microbiologist', 'Quality Assurance Bio-Chemist'],
    careerRolesAm: ['የባዮቴክኖሎጂ ተመራማሪ', 'የዘረ-መል አጥኚ', 'የኢንዱስትሪ ማይክሮባዮሎጂስት', 'የጥራት ቁጥጥር ባዮኬሚስት'],
    topUniversities: ['AASTU Biotechnology Center', 'AAU College of Natural Sciences', 'ASTU Applied Science'],
    nationalRelevance: 'በኢትዮጵያ ብቻ የሚገኙ ዝርያዎችን (የኢትዮጵያ ጤፍ፣ እንሰት፣ ቡና) ዘረ-መል በሳይንስ በመጠበቅ ኢኮኖሚያዊ ጥቅም ማስገኘት።',
  },

  // Social Science Pathways
  {
    id: 'path-law',
    stream: 'Social Science',
    category: 'Law & Governance',
    categoryAm: 'ህግና አስተዳደር',
    titleEn: 'Law, Constitutional Governance & International Trade',
    titleAm: 'ህግ፣ ህገ-መንግስታዊ አስተዳደር እና ዓለም አቀፍ ንግድ',
    icon: '⚖️',
    descriptionEn: 'Constitutional law, commercial contracts, trade arbitration, human rights, and judicial administration.',
    descriptionAm: 'የንግድና ኢንቨስትመንት ህጎች፣ የዓለም አቀፍ ስምምነቶች ድርድር፣ የሰብዓዊ መብቶች ጥበቃ እና የፍትህ አካላት አስተዳደር።',
    prerequisites: ['History', 'English', 'Aptitude / Critical Thinking', 'Economics'],
    careerRolesEn: ['Corporate Legal Counsel', 'High Court Judge / Prosecutor', 'Diplomat / Trade Negotiator', 'Policy Analyst'],
    careerRolesAm: ['የኮርፖሬት የህግ አማካሪ', 'ዳኛ / ዓቃቤ ህግ', 'የዲፕሎማቲክ ተደራዳሪ', 'የህዝብ ፖሊሲ አርቃቂ'],
    topUniversities: ['Addis Ababa University (School of Law)', 'Bahir Dar University', 'Jimma Law', 'Hawassa Law'],
    nationalRelevance: 'የሀገሪቱን የፍትህ ስርዓት ዘመናዊ ማድረግ፣ የንግድና የኢንቨስትመንት ህግጋትን በዓለም አቀፍ ደረጃ ማስተካከል (AfCFTA & WTO)።',
  },
  {
    id: 'path-economics',
    stream: 'Social Science',
    category: 'Economics & Business',
    categoryAm: 'ኢኮኖሚክስና ቢዝነስ',
    titleEn: 'Macroeconomics, Banking, FinTech & Strategic Management',
    titleAm: 'ኢኮኖሚክስ፣ ባንኪንግ፣ የፋይናንስ ቴክኖሎጂ (FinTech) እና ንግድ',
    icon: '📊',
    descriptionEn: 'Monetary policy, financial econometric modeling, capital markets, investment banking, and Telebirr digital ecosystem management.',
    descriptionAm: 'የገንዘብ ፖሊሲ፣ የኢትዮጵያ ካፒታል ገበያ (ESX)፣ የባንክና ኢንሹራንስ አመራር፣ እና የዲጂታል ክፍያ ስነ-ምህዳር።',
    prerequisites: ['Mathematics for Social Science', 'Economics', 'English', 'Geography'],
    careerRolesEn: ['Macroeconomist (National Bank)', 'Investment Banker / Broker', 'FinTech Portfolio Manager', 'Chartered Financial Analyst'],
    careerRolesAm: ['የብሔራዊ ባንክ ኢኮኖሚስት', 'የኢንቨስትመንትና የአክሲዮን ደላላ', 'የዲጂታል ፋይናንስ ስራ አስኪያጅ', 'የፋይናንስ ተንታኝ (CFA)'],
    topUniversities: ['Addis Ababa University (FBE)', 'Hawassa University', 'Mekelle University (CBE)'],
    nationalRelevance: 'የኢትዮጵያን የካፒታል ገበያ ማስፋፋት፣ የዋጋ ግሽበትን መቆጣጠር እና የሀገር ውስጥ ገቢን በዲጂታል ስርዓት ማሳደግ።',
  },
  {
    id: 'path-journalism',
    stream: 'Social Science',
    category: 'Journalism & Media',
    categoryAm: 'ጋዜጠኝነትና ኮሙዩኒኬሽን',
    titleEn: 'Investigative Journalism, Broadcast Media & Corporate PR',
    titleAm: 'መርማሪ ጋዜጠኝነት፣ የብሮድካስት ሚዲያ እና ኮሙዩኒኬሽን',
    icon: '🎙️',
    descriptionEn: 'Digital storytelling, broadcast production, data journalism, media ethics, and strategic institutional communication.',
    descriptionAm: 'የዲጂታል ሚዲያ ፕሮዳክሽን፣ የቴሌቪዥንና ራዲዮ ጋዜጠኝነት፣ የመረጃ ተንታኝነት እና የህዝብ ግንኙነት አመራር።',
    prerequisites: ['English', 'History', 'Civics / Aptitude'],
    careerRolesEn: ['Investigative Journalist', 'Broadcast News Anchor', 'Chief Communications Officer', 'Digital Content Director'],
    careerRolesAm: ['መርማሪ ጋዜጠኛ', 'የዜና አቅራቢ', 'የኮሙዩኒኬሽን ዳይሬክተር', 'የዲጂታል ሚዲያ ስራ አስኪያጅ'],
    topUniversities: ['Addis Ababa University (School of Journalism)', 'Bahir Dar University'],
    nationalRelevance: 'ትክክለኛና ሀገራዊ ፋይዳ ያላቸውን መረጃዎች በሙያዊ ስነ-ምግባር ለህዝብ ማድረስ፣ ሀገራዊ ምስልን በዓለም መድረክ ማስተዋወቅ።',
  },
  {
    id: 'path-geography',
    stream: 'Social Science',
    category: 'Geography & Urban Planning',
    categoryAm: 'ጂኦግራፊና የአካባቢ ጥበቃ እቅድ',
    titleEn: 'GIS, Remote Sensing, Urban Spatial Design & Climate Adaptation',
    titleAm: 'ጂኦግራፊካል ኢንፎርሜሽን ሲስተም (GIS)፣ የከተማ ፕላን እና የአየር ንብረት ጥናት',
    icon: '🗺️',
    descriptionEn: 'Satellite remote sensing for urban planning, watershed conservation, green legacy mapping, and environmental impact assessments.',
    descriptionAm: 'የሳተላይት መረጃ ትንተና፣ የኮሪደር ልማትና ከተማ ፕላን፣ የአረንጓዴ አሻራ ካርታ ዝግጅት እና የአየር ንብረት ለውጥ መቋቋሚያ።',
    prerequisites: ['Geography', 'History', 'Mathematics / Economics'],
    careerRolesEn: ['GIS & Remote Sensing Analyst', 'Urban Spatial Planner', 'Environmental Impact Consultant', 'Disaster Risk Specialist'],
    careerRolesAm: ['የሳተላይትና ካርታ ተንታኝ (GIS)', 'የከተማ ፕላነር', 'የአካባቢ ጥበቃ አማካሪ', 'የአደጋ ስጋት መከላከያ ባለሙያ'],
    topUniversities: ['Addis Ababa University', 'University of Gondar', 'Hawassa University'],
    nationalRelevance: 'እንደ አዲስ አበባ ኮሪደር ልማት እና የአረንጓዴ አሻራ ፕሮጀክቶች ያሉትን ሀገራዊ ስራዎች በሳይንሳዊ ካርታና ፕላን መምራት።',
  },
];

// 2. UNIVERSITIES PROFILES DATA
const UNIVERSITIES_DATA: UniversityProfile[] = [
  {
    id: 'aau',
    code: 'AAU',
    nameEn: 'Addis Ababa University',
    nameAm: 'አዲስ አበባ ዩኒቨርሲቲ',
    location: 'Addis Ababa (Sidist Kilo, Arat Kilo, Tikur Anbessa)',
    locationAm: 'አዲስ አበባ (ስድስት ኪሎ፣ አራት ኪሎ፣ ጥቁር አንበሳ)',
    established: 1950,
    type: 'First Autonomous Research Flagship University',
    typeAm: 'የመጀመሪያው ራሱን የቻለ ቀዳሚ የምርምር ዩኒቨርሲቲ',
    flagshipPrograms: ['Medicine (Tikur Anbessa)', 'Electrical/Civil Engineering (AAiT)', 'School of Law', 'College of Business & Economics (FBE)'],
    cutoffPoints: {
      naturalMedicine: '525+ (EUEE)',
      naturalEngineering: '490+ (AAiT)',
      naturalGeneral: '450+',
      socialLaw: '445+',
      socialBusiness: '415+',
      socialGeneral: '385+',
    },
    prerequisites: ['Math, Physics, Biology, Chemistry, English', 'History, Economics, Aptitude'],
    descriptionAm: 'በኢትዮጵያ አንጋፋውና ቀዳሚው የትምህርት ማዕከል ሲሆን፣ በህክምና፣ በምህንድስና (AAiT) እና በህግ ዘርፍ ግንባር ቀደም ምሁራንን ያፈራል።',
    highlights: ['Tikur Anbessa Comprehensive Specialized Hospital', 'AAiT Innovation Incubator', 'Oldest Law School in East Africa'],
  },
  {
    id: 'astu',
    code: 'ASTU',
    nameEn: 'Adama Science & Technology University',
    nameAm: 'አዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ',
    location: 'Adama, Oromia',
    locationAm: 'አዳማ፣ ኦሮሚያ',
    established: 1993,
    type: 'National Center of Excellence for Applied STEM',
    typeAm: 'የተግባራዊ ሳይንስና ቴክኖሎጂ የልህቀት ማዕከል',
    flagshipPrograms: ['Mechanical & Vehicle Engineering', 'Electrical & Computer Engineering', 'Applied Chemistry', 'Software Engineering'],
    cutoffPoints: {
      naturalMedicine: 'N/A (Pure STEM Focus)',
      naturalEngineering: '480+ (Institutional Exam)',
      naturalGeneral: '465+',
      socialLaw: 'N/A',
      socialBusiness: 'N/A',
      socialGeneral: 'N/A',
    },
    prerequisites: ['Advanced Mathematics, Physics, Chemistry, English'],
    descriptionAm: 'ለኢትዮጵያ የኢንዱስትሪ ሽግግር ከፍተኛ የቴክኖሎጂ አቅም ያላቸውን መሀንዲሶች ለማፍራት በልዩ ትኩረት የተቋቋመ የSTEM ማዕከል።',
    highlights: ['Centers of Excellence in Advanced Manufacturing', 'Space Science Research Laboratory', 'Robotics & Automation Arena'],
  },
  {
    id: 'aastu',
    code: 'AASTU',
    nameEn: 'Addis Ababa Science & Technology University',
    nameAm: 'አዲስ አበባ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ',
    location: 'Kilinto, Addis Ababa',
    locationAm: 'ኪሊንጦ፣ አዲስ አበባ',
    established: 2011,
    type: 'Technology, Innovation & Incubation Flagship',
    typeAm: 'የቴክኖሎጂ፣ ኢኖቬሽን እና ኢንኩቤሽን መሪ ዩኒቨርሲቲ',
    flagshipPrograms: ['Biotechnology & Bio-processing', 'Artificial Intelligence & Data Science', 'Civil & Environmental Engineering', 'Chemical Engineering'],
    cutoffPoints: {
      naturalMedicine: 'N/A (Tech/Biotech Only)',
      naturalEngineering: '485+ (AASTU Exam)',
      naturalGeneral: '470+',
      socialLaw: 'N/A',
      socialBusiness: 'N/A',
      socialGeneral: 'N/A',
    },
    prerequisites: ['Mathematics, Physics, Chemistry, Biology'],
    descriptionAm: 'በኪሊንጦ ኢንዱስትሪ ፓርክ አቅራቢያ የሚገኝ ሲሆን፣ በላቁ የፈጠራ ማዕከላት፣ በባዮቴክኖሎጂና በሰው ሰራሽ አስተውሎት (AI) ይታወቃል።',
    highlights: ['State-of-the-art Nanotech & Biotech Labs', 'High Performance Supercomputing Cluster', 'Student Technology Incubation Hub'],
  },
  {
    id: 'ju',
    code: 'JU',
    nameEn: 'Jimma University',
    nameAm: 'ጅማ ዩኒቨርሲቲ',
    location: 'Jimma, Oromia',
    locationAm: 'ጅማ፣ ኦሮሚያ',
    established: 1952,
    type: 'Community-Based Education (CBE) National Pioneer',
    typeAm: 'የህብረተሰብ አቀፍ ትምህርት (CBE) ፈርቀዳጅ ዩኒቨርሲቲ',
    flagshipPrograms: ['Institute of Health (Tropical Medicine)', 'Jimma Institute of Technology (JiT)', 'College of Agriculture', 'Law & Governance'],
    cutoffPoints: {
      naturalMedicine: '510+',
      naturalEngineering: '465+ (JiT)',
      naturalGeneral: '440+',
      socialLaw: '410+',
      socialBusiness: '390+',
      socialGeneral: '375+',
    },
    prerequisites: ['Biology, Chemistry, Physics, Math, English'],
    descriptionAm: 'በህብረተሰብ አቀፍ ትምህርት (CBE) ፍልስፍና የሚመራ ሲሆን፣ በሞቃታማ አካባቢ ህክምና (Tropical Medicine) እና በJiT ኢንጂነሪንግ እውቅና ያለው።',
    highlights: ['Jimma Medical Center (serving 20M+ patients)', 'Jimma Institute of Technology (JiT)', 'Coffee & Agro-Forestry Research Center'],
  },
  {
    id: 'hu',
    code: 'HU',
    nameEn: 'Hawassa University',
    nameAm: 'ሀዋሳ ዩኒቨርሲቲ',
    location: 'Hawassa, Sidama',
    locationAm: 'ሀዋሳ፣ ሲዳማ',
    established: 1976,
    type: 'Comprehensive Research & Agro-Forestry Leader',
    typeAm: 'የግብርና፣ ደን እና አጠቃላይ የሳይንስ ምርምር መሪ',
    flagshipPrograms: ['Wondo Genet College of Forestry & Natural Resources', 'College of Medicine & Health Sciences', 'IoT Textile & Apparel Engineering'],
    cutoffPoints: {
      naturalMedicine: '495+',
      naturalEngineering: '455+',
      naturalGeneral: '435+',
      socialLaw: '405+',
      socialBusiness: '385+',
      socialGeneral: '370+',
    },
    prerequisites: ['Biology, Chemistry, Geography, Physics'],
    descriptionAm: 'በውብቷ ሀዋሳ ሀይቅ አቅራቢያ የሚገኝ ሲሆን፣ በደኖችን ጥበቃ (ወንዶ ገነት)፣ በጨርቃ ጨርቅ ምህንድስና እና በህክምናው የላቀ ዝና አለው።',
    highlights: ['Wondo Genet College of Forestry', 'Hawassa Comprehensive Specialized Hospital', 'Hawassa Eco-Industrial Textile Hub Partnership'],
  },
  {
    id: 'bdu',
    code: 'BDU',
    nameEn: 'Bahir Dar University',
    nameAm: 'ባሕር ዳር ዩኒቨርሲቲ',
    location: 'Bahir Dar, Amhara (Lake Tana)',
    locationAm: 'ባሕር ዳር፣ አማራ (ጣና ሀይቅ)',
    established: 1953,
    type: 'Maritime, Engineering & Water Resources Leader',
    typeAm: 'የባህር ኃይል ማሪታይም፣ ኢንጂነሪንግ እና የውሃ ሃብት መሪ',
    flagshipPrograms: ['Ethiopian Maritime Training Academy (EMTA)', 'Bahir Dar Institute of Technology (BiT)', 'Blue Nile Water Institute', 'School of Law'],
    cutoffPoints: {
      naturalMedicine: '490+',
      naturalEngineering: '460+ (BiT)',
      naturalGeneral: '430+',
      socialLaw: '415+',
      socialBusiness: '390+',
      socialGeneral: '370+',
    },
    prerequisites: ['Physics, Mathematics, Geography, English'],
    descriptionAm: 'በአፍሪካ ብቸኛው የንግድ መርከብ መኮንኖች ማሰልጠኛ አካዳሚ (EMTA) ባለቤት ሲሆን፣ በጣና እና አባይ ወንዝ የውሃ ምህንድስና ይመራል።',
    highlights: ['Ethiopian Maritime Academy (EMTA)', 'Bahir Dar Institute of Technology (BiT)', 'Lake Tana Biosphere Reserve Research'],
  },
  {
    id: 'hru',
    code: 'HrU',
    nameEn: 'Haramaya University',
    nameAm: 'ሐረማያ ዩኒቨርሲቲ',
    location: 'Haramaya, East Hararghe, Oromia',
    locationAm: 'ሐረማያ፣ ምሥራቅ ሐረርጌ፣ ኦሮሚያ',
    established: 1954,
    type: 'Pioneer Agricultural & Veterinary Institution in Africa',
    typeAm: 'በአፍሪካ ቀዳሚው የግብርና እና የእንስሳት ህክምና ማዕከል',
    flagshipPrograms: ['College of Agriculture & Environmental Sciences', 'College of Veterinary Medicine', 'HiT Institute of Technology'],
    cutoffPoints: {
      naturalMedicine: '480+',
      naturalEngineering: '445+',
      naturalGeneral: '425+',
      socialLaw: '395+',
      socialBusiness: '380+',
      socialGeneral: '365+',
    },
    prerequisites: ['Biology, Chemistry, Mathematics, Agriculture'],
    descriptionAm: 'በ1954 የተመሰረተ የአፍሪካ አንጋፋ የግብርና ዩኒቨርሲቲ ሲሆን፣ በምርጥ ዘር፣ በአፈር ለምነትና በእንስሳት ህክምና ግንባር ቀደም ነው።',
    highlights: ['70+ Years of Groundbreaking Crop Research', 'College of Veterinary Medicine', 'East Hararghe Watershed Management Hub'],
  },
  {
    id: 'mu',
    code: 'MU',
    nameEn: 'Mekelle University',
    nameAm: 'መቀሌ ዩኒቨርሲቲ',
    location: 'Mekelle, Tigray',
    locationAm: 'መቀሌ፣ ትግራይ',
    established: 1993,
    type: 'Dryland Agriculture, Technology (MIT) & Medicine',
    typeAm: 'የቆላማ ግብርና፣ የቴክኖሎጂ (MIT) እና የህክምና ማዕከል',
    flagshipPrograms: ['Mekelle Institute of Technology (MIT)', 'Ayder Comprehensive Specialized Hospital', 'Dryland Agriculture & Natural Resources'],
    cutoffPoints: {
      naturalMedicine: '500+',
      naturalEngineering: '470+ (MIT)',
      naturalGeneral: '435+',
      socialLaw: '400+',
      socialBusiness: '385+',
      socialGeneral: '370+',
    },
    prerequisites: ['Mathematics, Physics, Biology, Chemistry'],
    descriptionAm: 'በመቀሌ ኢንስቲትዩት ኦፍ ቴክኖሎጂ (MIT) የተካኑ የሶፍትዌርና ኤሌክትሮኒክስ መሀንዲሶችን እና በአይደር ስፔሻላይዝድ ሆስፒታል ህክምናን ይመራል።',
    highlights: ['Mekelle Institute of Technology (MIT)', 'Ayder Referral & Teaching Hospital', 'Dryland Soil Water Harvesting Innovations'],
  },
  {
    id: 'uog',
    code: 'UoG',
    nameEn: 'University of Gondar',
    nameAm: 'የጎንደር ዩኒቨርሲቲ',
    location: 'Gondar, Amhara',
    locationAm: 'ጎንደር፣ አማራ',
    established: 1954,
    type: 'Pioneer College of Public Health & Historic Heritage',
    typeAm: 'የህዝብ ጤና አጠባበቅ ፈርቀዳጅና የታሪክ ቅርስ ማዕከል',
    flagshipPrograms: ['College of Medicine & Health Sciences', 'Department of Optometry & Ophthalmology', 'Tourism, Heritage & Social Sciences'],
    cutoffPoints: {
      naturalMedicine: '505+',
      naturalEngineering: '445+',
      naturalGeneral: '430+',
      socialLaw: '405+',
      socialBusiness: '385+',
      socialGeneral: '370+',
    },
    prerequisites: ['Biology, Chemistry, Physics, History'],
    descriptionAm: 'በ1954 የተመሰረተ የኢትዮጵያ የመጀመሪያው የህዝብ ጤና ኮሌጅ ሲሆን፣ በአይን ህክምና (Optometry) እና በታሪክ ቅርስ ጥናት ይታወቃል።',
    highlights: ['Historic Public Health Training Pioneer', 'National Ophthalmology & Eye Care Center', 'World Heritage Tourism Research Center'],
  },
];

// 3. MEGAPROJECTS DATA
const MEGAPROJECTS_DATA: MegaprojectItem[] = [
  {
    id: 'mega-gerd',
    nameEn: 'Grand Ethiopian Renaissance Dam (GERD)',
    nameAm: 'ታላቁ የኢትዮጵያ ህዳሴ ግድብ (GERD)',
    icon: '🌊',
    region: 'Benshangul-Gumuz (Abbay Basin)',
    subjectsInvolved: [
      {
        subject: 'ፊዚክስ (Physics)',
        scientificApplicationAm:
          'የፈሳሽ ግፊትና ፍሰት ስሌት (Fluid Mechanics: P = ρgh)፣ የ5,150 ሜጋዋት ኃይል ማመንጫ ተርባይኖች የኤሌክትሮማግኔቲክ ኢንዳክሽን (Faraday\'s Law) እና የቮልቴጅ ትራንስፎርሜሽን።',
      },
      {
        subject: 'ሂሳብ (Mathematics)',
        scientificApplicationAm:
          'የ10.2 ሚሊዮን ሜትሪክ ኪዩብ የኮንክሪት መጠን ስሌት (Volume Integrals)፣ የውሃ መፍሰሻ ካልኩለስ ሞዴሊንግ እና የመዋቅር ጥንካሬ ጂኦሜትሪ።',
      },
      {
        subject: 'ጂኦግራፊ (Geography)',
        scientificApplicationAm:
          'የአባይ ተፋሰስ የዝናብ ስርጭት ካርታ፣ የአፈር መሸርሸር ጥናት እና የሃይድሮሎጂ ተፋሰስ ስነ-ምህዳር ጥበቃ።',
      },
    ],
    nationalImpactAm: 'የኢትዮጵያን የኤሌክትሪክ አቅርቦት በእጥፍ ማሳደግ፣ ለጎረቤት ሀገራት ኃይል በመሸጥ የውጭ ምንዛሬ ማመንጨት እና የኢንዱስትሪ ልማት ማስፋፋት።',
    relatedDegrees: ['Electrical Power Engineering', 'Hydraulic & Water Resources Engineering', 'Civil Structural Engineering'],
  },
  {
    id: 'mega-telebirr',
    nameEn: 'Telebirr & Digital Ethiopia 2025 Ecosystem',
    nameAm: 'ቴሌብር እና የዲጂታል ኢትዮጵያ 2025 ስነ-ምህዳር',
    icon: '📱',
    region: 'Nationwide (45M+ Active Users)',
    subjectsInvolved: [
      {
        subject: 'ኢንፎርሜሽን ቴክኖሎጂ (IT)',
        scientificApplicationAm:
          'የክላውድ ዳታቤዝ አሰራር፣ የባንክ ማይክሮ-ሰርቪስ አርክቴክቸር፣ የሞባይል API ደህንነት እና የሳይበር ደህንነት ጥበቃ ስርዓቶች።',
      },
      {
        subject: 'ሂሳብ (Mathematics)',
        scientificApplicationAm:
          'የምስጠራ ስሌት (Public-Key Cryptography RSA)፣ የሞጁላር አልጀብራ ስሌቶች እና የማሽን ለርኒንግ የብድር አሰጣጥ አልጎሪዝም (Sanduq/Endekise)።',
      },
      {
        subject: 'ኢኮኖሚክስ (Economics)',
        scientificApplicationAm:
          'የገንዘብ ዝውውር ፍጥነት (Velocity of Money)፣ የዲጂታል ግብርና ክፍያ ስርዓት እና የፋይናንስ ተደራሽነትን (Financial Inclusion) ወደ 80% ማድረስ።',
      },
    ],
    nationalImpactAm: 'ከ45 ሚሊዮን በላይ ዜጎችን ያለባንክ ደብተር የገንዘብ ባለቤት ማድረግ፣ የንግድ ግብይቶችን ዲጂታል ማድረግ እና የኢ-ኮሜርስ ንግድን ማቀላጠፍ።',
    relatedDegrees: ['Software Engineering', 'Computer Science & AI', 'FinTech & Financial Economics', 'Cybersecurity'],
  },
  {
    id: 'mega-airlines',
    nameEn: 'Ethiopian Airlines Aviation & Aerospace Expansion',
    nameAm: 'የኢትዮጵያ አየር መንገድ እና የአቪዬሽን ማስፋፊያ',
    icon: '✈️',
    region: 'Bole Hub & Bishoftu Mega-Airport Project',
    subjectsInvolved: [
      {
        subject: 'ፊዚክስ (Physics)',
        scientificApplicationAm:
          'የበርኑሊ የአየር ግፊት ህግ (Bernoulli\'s Lift Principle)፣ የጄት ሞተሮች ቴርሞዳይናሚክስ (Gas Turbines Brayton Cycle) እና የራዳር ሞገድ አሰሳ።',
      },
      {
        subject: 'ኬሚስትሪ (Chemistry)',
        scientificApplicationAm:
          'የጄት ነዳጅ (Jet A-1) ሙሉ የቃጠሎ ስሌት (Combustion Stoichiometry)፣ የአቪዬሽን አልሙኒየም ቅይጥ ኬሚካላዊ ጥንካሬ እና የሊቲየም ባትሪ ደህንነት።',
      },
      {
        subject: 'ሂሳብ (Mathematics)',
        scientificApplicationAm:
          'የበረራ መስመሮች የ3-ዳይመንሽን ቬክተር ስሌት (3D Spatial Vectors) እና አነስተኛ ነዳጅ የሚፈጅ የበረራ ከፍታ ኦፕቲማይዜሽን ካልኩለስ።',
      },
    ],
    nationalImpactAm: 'የአፍሪካ ቁጥር 1 አየር መንገድ ሆኖ መቀጠል፣ አዲሱን የ100 ሚሊዮን መንገደኞች ቢሾፍቱ ሜጋ ኤርፖርት መገንባት እና የቱሪዝም ገቢን ማሳደግ።',
    relatedDegrees: ['Aerospace Engineering', 'Avionics & Electrical Systems', 'Mechanical Engineering', 'Aviation Management'],
  },
  {
    id: 'mega-wheat',
    nameEn: 'National Irrigated Wheat & Agricultural Transformation',
    nameAm: 'የበጋ መስኖ ስንዴና የግብርና ዘመናዊነት ንቅናቄ',
    icon: '🌾',
    region: 'Afar, Oromia, Amhara, Somali Basins (3M+ Hectares)',
    subjectsInvolved: [
      {
        subject: 'ባዮሎጂ (Biology)',
        scientificApplicationAm:
          'የድርቅና በሽታ ተቋቋሚ የዘር ምርምር (Wheat Rust Genetics)፣ የአፈር ባክቴሪያዎች የናይትሮጅን ኬሚካል ቅንብር (Nitrogen Fixation) እና የሰብል ፊዚዮሎጂ።',
      },
      {
        subject: 'ኬሚስትሪ (Chemistry)',
        scientificApplicationAm:
          'የአፈር ፒኤች (pH) አሲዳማነት ማከሚያ ኖራ (Liming) አጠቃቀም፣ የNPK ማዳበሪያ ኬሚካላዊ ጥምርታ እና የውሃ ጥራት መመርመሪያ።',
      },
      {
        subject: 'ጂኦግራፊ (Geography)',
        scientificApplicationAm:
          'የአዋሽ፣ ኦሞና ዋቤ ሸበሌ ወንዞች የመስኖ ቦዮች አቀማመጥ ካርታ፣ የአየር ሁኔታ ትንበያ እና የአፈር ለምነት መረጃዎች።',
      },
    ],
    nationalImpactAm: 'ኢትዮጵያ ስንዴን ከውጭ ማስገባት አቁማ ለውጭ ሀገራት ማቅረብ እንድትችል ማስቻልና የአርሶ አደሩን ገቢ በእጥፍ ማሳደግ።',
    relatedDegrees: ['Agronomy & Plant Science', 'Agricultural & Irrigation Engineering', 'Soil Science', 'Agribusiness Management'],
  },
];

export const CareerPathwaysView: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'matchmaker' | 'universities' | 'megaprojects' | 'planner'>('matchmaker');

  // Matchmaker states
  const [selectedStream, setSelectedStream] = useState<'Natural Science' | 'Social Science'>('Natural Science');
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>('path-engineering');
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // University states
  const [uniSearch, setUniSearch] = useState('');
  const [selectedUniId, setSelectedUniId] = useState<string>('aau');

  // Goal Planner states
  const [targetUni, setTargetUni] = useState<string>('AAU');
  const [targetMajor, setTargetMajor] = useState<string>('Software Engineering / AI (AAiT)');
  const [targetScore, setTargetScore] = useState<number>(510);
  const [currentScore, setCurrentScore] = useState<number>(currentUser.xp > 0 ? 420 : 380);
  const [weeksRemaining, setWeeksRemaining] = useState<number>(20);
  const [savedGoalSuccess, setSavedGoalSuccess] = useState(false);

  // Load saved goal from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('ethio_career_goal_planner');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.targetUni) setTargetUni(data.targetUni);
        if (data.targetMajor) setTargetMajor(data.targetMajor);
        if (data.targetScore) setTargetScore(data.targetScore);
        if (data.currentScore) setCurrentScore(data.currentScore);
        if (data.weeksRemaining) setWeeksRemaining(data.weeksRemaining);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSaveGoal = () => {
    const goalData = {
      targetUni,
      targetMajor,
      targetScore,
      currentScore,
      weeksRemaining,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('ethio_career_goal_planner', JSON.stringify(goalData));
    setSavedGoalSuccess(true);
    setTimeout(() => setSavedGoalSuccess(false), 3000);
  };

  // Goal calculation logic
  const scoreGap = Math.max(0, targetScore - currentScore);
  // Base daily hours required: 3.5 base hours + 1 hour per 50 score points gap / (weeks / 10)
  const calculatedDailyHours = Math.min(
    10,
    Math.max(3.5, Number((3.5 + (scoreGap / 45) * (14 / Math.max(8, weeksRemaining))).toFixed(1)))
  );

  const selectedPathway = PATHWAYS_DATA.find((p) => p.id === selectedPathwayId) || PATHWAYS_DATA[0];
  const selectedUni = UNIVERSITIES_DATA.find((u) => u.id === selectedUniId) || UNIVERSITIES_DATA[0];

  const filteredUniversities = UNIVERSITIES_DATA.filter((u) => {
    const q = uniSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.nameEn.toLowerCase().includes(q) ||
      u.nameAm.includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q)
    );
  });

  // Stream matchmaker quiz logic
  const quizQuestions = [
    {
      id: 1,
      q: 'የትኛው የስራ መስክ የበለጠ ይስባችኋል?',
      options: [
        { label: 'መሳሪያዎችን፣ ሶፍትዌሮችንና መዋቅሮችን መገንባት', tag: 'Engineering' },
        { label: 'የሰዎችን ህይወት ማዳንና ህመሞችን ማከም', tag: 'Medicine' },
        { label: 'የሀገር ህግን ማስተካከልና ፍትህን ማስከበር', tag: 'Law' },
        { label: 'ንግድን፣ የገንዘብ ገበያዎችንና ባንኮችን መምራት', tag: 'Economics' },
      ],
    },
    {
      id: 2,
      q: 'በየትኛው የትምህርት አይነት የበለጠ ውጤታማ ነዎት?',
      options: [
        { label: 'ሂሳብ (Mathematics) እና ፊዚክስ (Physics)', tag: 'Engineering' },
        { label: 'ባዮሎጂ (Biology) እና ኬሚስትሪ (Chemistry)', tag: 'Medicine' },
        { label: 'ታሪክ (History) እና እንግሊዝኛ (English)', tag: 'Law' },
        { label: 'ኢኮኖሚክስ እና ማህበራዊ ሂሳብ', tag: 'Economics' },
      ],
    },
    {
      id: 3,
      q: 'ለኢትዮጵያ በየትኛው ዘርፍ የበኩሎን አሻራ ማኖር ይፈልጋሉ?',
      options: [
        { label: 'በህዳሴ ግድብና በቴክኖሎጂ ኢንዱስትሪዎች', tag: 'Engineering' },
        { label: 'በሆስፒታሎችና በህክምና ምርምር ማዕከላት', tag: 'Medicine' },
        { label: 'በፍትህ ተቋማትና በዓለም አቀፍ ድርድር', tag: 'Law' },
        { label: 'በቴሌብርና በኢትዮጵያ ካፒታል ገበያ መስፋፋት', tag: 'Economics' },
      ],
    },
  ];

  const handleEvaluateQuiz = () => {
    const counts: Record<string, number> = { Engineering: 0, Medicine: 0, Law: 0, Economics: 0 };
    Object.values(quizAnswers).forEach((tag) => {
      if (counts[tag] !== undefined) counts[tag]++;
    });

    let bestTag = 'Engineering';
    let max = -1;
    Object.entries(counts).forEach(([t, count]) => {
      if (count > max) {
        max = count;
        bestTag = t;
      }
    });

    if (bestTag === 'Engineering') {
      setSelectedStream('Natural Science');
      setSelectedPathwayId('path-engineering');
      setQuizResult('ምህንድስና እና ቴክኖሎጂ (Engineering & Tech) ለእርስዎ እጅግ ተስማሚ ዘርፍ ነው!');
    } else if (bestTag === 'Medicine') {
      setSelectedStream('Natural Science');
      setSelectedPathwayId('path-medicine');
      setQuizResult('ህክምናና ጤና ሳይንስ (Medicine & Health Sciences) ለእርስዎ እጅግ ተስማሚ ዘርፍ ነው!');
    } else if (bestTag === 'Law') {
      setSelectedStream('Social Science');
      setSelectedPathwayId('path-law');
      setQuizResult('ህግና ዲፕሎማሲ (Law & Governance) ለእርስዎ እጅግ ተስማሚ ዘርፍ ነው!');
    } else {
      setSelectedStream('Social Science');
      setSelectedPathwayId('path-economics');
      setQuizResult('ኢኮኖሚክስና ቢዝነስ (Economics & FinTech) ለእርስዎ እጅግ ተስማሚ ዘርፍ ነው!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-emerald-300" />
              {t('mod_career_pathways')} • የከፍተኛ ትምህርትና ሙያ መሪ
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              የከፍተኛ ትምህርትና የSTEM ሙያ አሰሳ መመሪያ
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              በኢትዮጵያ ዩኒቨርሲቲዎች ምደባ ስርዓት (University Placement)፣ በEUEE መግቢያ ነጥቦች፣
              እና በሀገራዊ ሜጋ-ፕሮጀክቶች ፍላጎት መሰረት የወደፊት የትምህርትና የሙያ አላማዎን ይቅረጹ።
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setQuizModalOpen(true);
                setQuizAnswers({});
                setQuizResult(null);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              ፈጣን የዘርፍ መራጭ ፈተና
            </button>
          </div>
        </div>
      </div>

      {/* 4 Feature Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('matchmaker')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'matchmaker'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>1. የሙያ ዘርፍ መራጭ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('universities')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'universities'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>2. የዩኒቨርሲቲ መረጃዎች</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('megaprojects')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'megaprojects'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span>3. የሜጋ-ፕሮጀክቶች ትስስር</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'planner'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>4. የጥናት ሰዓት ማቀጃ</span>
        </button>
      </div>

      {/* ================= TAB 1: STREAM MATCHMAKER ================= */}
      {activeTab === 'matchmaker' && (
        <div className="space-y-6">
          {/* Stream Switcher */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                የትምህርት ዘርፍ እና የሙያ አቅጣጫዎች (Stream Pathways)
              </h2>
              <p className="text-xs text-slate-500">
                የተፈጥሮ ሳይንስ እና የማህበራዊ ሳይንስ የዩኒቨርሲቲ የትምህርት መስኮች
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedStream('Natural Science');
                  setSelectedPathwayId('path-engineering');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStream === 'Natural Science'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🔬 Natural Science
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedStream('Social Science');
                  setSelectedPathwayId('path-law');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStream === 'Social Science'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                📜 Social Science
              </button>
            </div>
          </div>

          {/* Pathways Grid & Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List of Pathways */}
            <div className="lg:col-span-5 space-y-3">
              {PATHWAYS_DATA.filter((p) => p.stream === selectedStream).map((p) => {
                const isSelected = selectedPathwayId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPathwayId(p.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      {p.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {p.categoryAm}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {p.titleAm}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {p.titleEn}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-3 transition-transform ${
                        isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Detailed Pathway Profile */}
            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {selectedPathway.categoryAm} ({selectedPathway.stream})
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {selectedPathway.titleAm}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">{selectedPathway.titleEn}</p>
                  </div>
                  <div className="text-4xl p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 shrink-0">
                    {selectedPathway.icon}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    የዘርፉ ማብራሪያ (Scope & Overview):
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedPathway.descriptionAm}
                  </p>
                </div>

                {/* Prerequisite Subjects */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>የሁለተኛ ደረጃ ቅድመ-ሁኔታ የትምህርት አይነቶች (High School Prerequisite Subjects):</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedPathway.prerequisites.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Roles */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    ተፈላጊ የሙያ ዘርፎች (In-Demand Career Roles in Ethiopia):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedPathway.careerRolesAm.map((role, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {role}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {selectedPathway.careerRolesEn[idx]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Universities */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <span>ዋና ዋና መሪ ዩኒቨርሲቲዎች (Flagship Universities):</span>
                  </div>
                  <p className="text-xs text-amber-950 dark:text-amber-100">
                    {selectedPathway.topUniversities.join(' • ')}
                  </p>
                </div>

                {/* National Relevance */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>ሀገራዊ ፋይዳ (National Relevance & Impact):</span>
                  </div>
                  <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                    {selectedPathway.nationalRelevance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ETHIOPIAN UNIVERSITIES PROFILES ================= */}
      {activeTab === 'universities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                የኢትዮጵያ አንጋፋ ዩኒቨርሲቲዎች መረጃና የመግቢያ ነጥቦች (University Profiles)
              </h2>
              <p className="text-xs text-slate-500">
                የAAU፣ ASTU፣ AASTU፣ ጅማ፣ ሀዋሳ፣ ባህር ዳር፣ ሐረማያ፣ መቀሌና ጎንደር ዩኒቨርሲቲዎች መግቢያ መስፈርቶች
              </p>
            </div>

            {/* University Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={uniSearch}
                onChange={(e) => setUniSearch(e.target.value)}
                placeholder="ዩኒቨርሲቲ ይፈልጉ..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* University Selection Pills/Cards */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredUniversities.map((uni) => {
                const isSelected = selectedUniId === uni.id;
                return (
                  <div
                    key={uni.id}
                    onClick={() => setSelectedUniId(uni.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {uni.code}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Est. {uni.established}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {uni.nameAm}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{uni.locationAm}</span>
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-3 transition-transform ${
                        isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* University Detailed Profile */}
            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {selectedUni.code}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        የተመሰረተበት: {selectedUni.established} ዓ.ም
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                      {selectedUni.nameAm}
                    </h2>
                    <p className="text-xs text-slate-500">{selectedUni.nameEn}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedUni.locationAm} ({selectedUni.location})</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-center sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      የተቋሙ ደረጃ
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedUni.typeAm}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedUni.descriptionAm}
                </p>

                {/* Expected Cutoff Points Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      የEUEE መግቢያ ዝቅተኛ ነጥቦች (Estimated Cutoff Points):
                    </h4>
                    <span className="text-[11px] text-amber-600 font-semibold">
                      *እንደ አመቱ የፈተና ከበድነት ሊለያይ ይችላል
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Medicine & Surgery
                      </span>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {selectedUni.cutoffPoints.naturalMedicine}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Tech & Engineering
                      </span>
                      <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-1">
                        {selectedUni.cutoffPoints.naturalEngineering}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Natural General
                      </span>
                      <div className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">
                        {selectedUni.cutoffPoints.naturalGeneral}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        School of Law
                      </span>
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {selectedUni.cutoffPoints.socialLaw}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Business & Econ
                      </span>
                      <div className="text-sm font-black text-violet-600 dark:text-violet-400 mt-1">
                        {selectedUni.cutoffPoints.socialBusiness}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Social General
                      </span>
                      <div className="text-sm font-black text-teal-600 dark:text-teal-400 mt-1">
                        {selectedUni.cutoffPoints.socialGeneral}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flagship Programs */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    ዋና ዋና የልህቀት ፕሮግራሞች (Flagship Departments):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUni.flagshipPrograms.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    🌟 ልዩ መለያዎች (Key Highlights & Centers):
                  </div>
                  <ul className="space-y-1">
                    {selectedUni.highlights.map((h, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: NATIONAL MEGAPROJECTS & REAL-LIFE CONTEXT ================= */}
      {activeTab === 'megaprojects' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              የትምህርት እና የብሔራዊ ሜጋ-ፕሮጀክቶች ትስስር (National Megaprojects & Science)
            </h2>
            <p className="text-xs text-slate-500">
              በሁለተኛ ደረጃ የሚማሩት ፊዚክስ፣ ሂሳብ፣ ኬሚስትሪና ባዮሎጂ በሀገራችን ታላላቅ ፕሮጀክቶች ላይ እንዴት በተግባር እንደሚውሉ ይመልከቱ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MEGAPROJECTS_DATA.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      {proj.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {proj.region}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {proj.nameAm}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{proj.nameEn}</p>
                    </div>
                  </div>

                  {/* High School Subjects Application */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                      የትምህርት አይነቶች ሳይንሳዊ አጠቃቀም (High School Subject Applications):
                    </span>
                    <div className="space-y-2">
                      {proj.subjectsInvolved.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
                        >
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                            {item.subject}:
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.scientificApplicationAm}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-900 dark:text-emerald-200">
                    <strong>ሀገራዊ ተፅዕኖ:</strong> {proj.nationalImpactAm}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      ተዛማጅ የዩኒቨርሲቲ ዲግሪዎች (Related University Degrees):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.relatedDegrees.map((deg, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {deg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: INTERACTIVE GOAL PLANNER ================= */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              የተማሪ የግብ ማቀጃ እና የዕለት ጥናት ሰዓት አስሊ (Interactive Goal Planner)
            </h2>
            <p className="text-xs text-slate-500">
              የሚፈልጉትን ዩኒቨርሲቲና የውጤት ግብ በማስገባት በየቀኑ ማጥናት የሚጠበቅቦትን ትክክለኛ የሰዓት ድልድል ያግኙ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>የግብ መረጃዎችዎን ይምረጡ (Configure Target Goals)</span>
              </div>

              {/* Target University Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  የታለመው ዩኒቨርሲቲ (Target University):
                </label>
                <select
                  value={targetUni}
                  onChange={(e) => setTargetUni(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="AAU">አዲስ አበባ ዩኒቨርሲቲ (Addis Ababa University - AAU)</option>
                  <option value="ASTU">አዳማ ሳይንስና ቴክኖሎጂ (ASTU Adama)</option>
                  <option value="AASTU">አዲስ አበባ ሳይንስና ቴክኖሎጂ (AASTU Kilinto)</option>
                  <option value="Jimma">ጅማ ዩኒቨርሲቲ (Jimma University)</option>
                  <option value="Hawassa">ሀዋሳ ዩኒቨርሲቲ (Hawassa University)</option>
                  <option value="Bahir Dar">ባሕር ዳር ዩኒቨርሲቲ (Bahir Dar University)</option>
                  <option value="Haramaya">ሐረማያ ዩኒቨርሲቲ (Haramaya University)</option>
                  <option value="Mekelle">መቀሌ ዩኒቨርሲቲ (Mekelle University)</option>
                  <option value="Gondar">የጎንደር ዩኒቨርሲቲ (University of Gondar)</option>
                </select>
              </div>

              {/* Target Major / Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  የሚፈልጉት የትምህርት መስክ (Target Major / Department):
                </label>
                <input
                  type="text"
                  value={targetMajor}
                  onChange={(e) => setTargetMajor(e.target.value)}
                  placeholder="e.g. Software Engineering, Medicine, Law"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Target Entrance Score Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    የታለመው የEUEE መግቢያ ውጤት (Target Score):
                  </span>
                  <span className="text-emerald-600 font-black text-sm">{targetScore} / 600</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="580"
                  step="5"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>350 (አማካይ)</span>
                  <span>450 (ከፍተኛ)</span>
                  <span>550+ (ልሂቅ / Elite)</span>
                </div>
              </div>

              {/* Current Diagnostic Score Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    የአሁኑ የሙከራ/ዲያግኖስቲክ ውጤት (Current Score):
                  </span>
                  <span className="text-amber-600 font-black text-sm">{currentScore} / 600</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="550"
                  step="5"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Weeks Remaining Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    እስከ ብሔራዊ ፈተናው የቀረው ሳምንታት (Weeks Remaining):
                  </span>
                  <span className="text-indigo-600 font-black text-sm">{weeksRemaining} ሳምንታት</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  step="1"
                  value={weeksRemaining}
                  onChange={(e) => setWeeksRemaining(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveGoal}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {savedGoalSuccess ? 'ግብዎ ተቀምጧል! (Goal Saved)' : 'የጥናት ግቤን አስቀምጥ (Save Goal Target)'}
              </button>
            </div>

            {/* Calculated Study Hours & Daily Schedule Plan */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      የእለት ጥናት ስሌት (Study Hours Engine)
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">
                      የእርስዎ የጥናት ቀመር ውጤት
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">የውጤት ክፍተት</span>
                    <span className="text-lg font-black text-amber-400">+{scoreGap} ነጥብ</span>
                  </div>
                </div>

                {/* Big Hour Metric */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-800 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                      በየቀኑ የሚያስፈልግ ንቁ የጥናት ሰዓት
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                      {calculatedDailyHours}{' '}
                      <span className="text-base sm:text-lg font-semibold text-emerald-300">
                        ሰዓታት / ቀን (Hours/Day)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      ከሳምንታዊ የEUEE ሞዴል ፈተናዎች እና ክለሳዎች ጋር
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-emerald-400 shrink-0 opacity-80" />
                </div>

                {/* Recommended Daily Schedule Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    የዕለት የጥናት ሰዓታት ክፍፍል (Daily Time Allocation):
                  </h4>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white">ዋና የትምህርት ክፍለ ጊዜ (Math / Physics / Bio)</span>
                      </div>
                      <span className="font-black text-emerald-400">
                        {(calculatedDailyHours * 0.45).toFixed(1)} ሰዓት
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="font-bold text-white">የችግር መፍቻና ስሌቶች (Problem Solving & Lab)</span>
                      </div>
                      <span className="font-black text-amber-400">
                        {(calculatedDailyHours * 0.35).toFixed(1)} ሰዓት
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                        <span className="font-bold text-white">ፈጣን ፍላሽካርድና የጽናት ክለሳ (Spaced Recall)</span>
                      </div>
                      <span className="font-black text-indigo-400">
                        {(calculatedDailyHours * 0.20).toFixed(1)} ሰዓት
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestones Target Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>የስኬት መመዘኛ (Target Benchmark):</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    በዚህ የ{calculatedDailyHours} ሰዓት ዕለታዊ የጥናት መርሃ-ግብር ከቀጠሉ በ{weeksRemaining} ሳምንታት ውስጥ
                    የ{targetUni} ({targetMajor}) የመግቢያ መስፈርትን በ{targetScore} ነጥብ ለማሳካት የሚያስችል ከፍተኛ ዝግጁነት ይኖራችኋል!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STREAM MATCHMAKER QUIZ MODAL ================= */}
      {quizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  ፈጣን የዘርፍና የሙያ መራጭ ፈተና (Stream Matchmaker)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuizModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!quizResult ? (
              <div className="space-y-4">
                {quizQuestions.map((qItem, qIdx) => (
                  <div key={qItem.id} className="space-y-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {qIdx + 1}. {qItem.q}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {qItem.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[qItem.id] === opt.tag;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [qItem.id]: opt.tag }))
                            }
                            className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  onClick={handleEvaluateQuiz}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-40"
                >
                  የኔን ተስማሚ ሙያ ገምግም (Analyze My Best Match)
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
                <div className="text-4xl">🎉</div>
                <h4 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                  {quizResult}
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                  በሰጡት መልስ መሰረት ተዛማጁ የትምህርት ዘርፍ በስክሪኑ ላይ ተመርጦ ቀርቧል።
                </p>
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  ዝርዝሩን እይ (View Detailed Pathway)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
