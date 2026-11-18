import type { IconType } from 'react-icons';
import {
  VscAccount,
  VscCode,
  VscEdit,
  VscGithubAlt,
  VscFiles,
  VscMail,
  VscSettings,
  VscTools,
} from 'react-icons/vsc';
import {
  SiAngular,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';

import { Project } from '@/types';

// Everything personal about the portfolio lives here.
// Fully aligned with Durgesh Rajendra Shewale's resume.

export const profile = {
  name: 'Durgesh Rajendra Shewale',
  role: 'AI & Full-Stack Developer',
  currentPosition: 'Computer Engineering Student & AI Developer',
  location: 'Malegaon, Maharashtra, India',
  phone: '+91 9975340539',
  email: 'shewaledurgesh29@gmail.com',
  siteUrl: 'https://durgesh-shewale.vercel.app',
  ogImage: '/hero.png',
  repository: 'https://github.com/DurgeshShewale29',
  metaDescription:
    'Portfolio of Durgesh Rajendra Shewale — Computer Engineering student and Full Stack Developer experienced in Spring Boot, Angular, React, Python, and Next.js, with additional skills in LLM integration, RAG, Vector Search, and OCR.',
  ogDescription:
    'Full-Stack Developer & AI Specialist · Spring Boot, Angular, React, Python, Next.js, LLM Integration & RAG',
  keywords: [
    'durgesh shewale',
    'durgesh rajendra shewale',
    'full stack developer',
    'ai engineer',
    'spring boot developer',
    'react developer',
    'angular developer',
    'nextjs developer',
    'rag',
    'vector search',
    'ocr',
  ],
  intro:
    'Computer Engineering student and Full Stack Developer experienced in Spring Boot, Angular, React, Python, and Next.js, with additional skills in LLM integration, RAG, Vector Search, and OCR. Seeking a role to build scalable, secure, user-focused software.',
  bio: [
    "I'm a Computer Science & Engineering student at Sanjivani University and Full Stack Developer with hands-on experience building scalable web applications, offline document digitization platforms, and multi-modal AI assistants.",
    'I bring expertise across modern frontend ecosystems (React, Next.js, Angular, Tailwind CSS) and robust backend architectures (Spring Boot, FastAPI, Node.js), combined with database modeling in MySQL, MongoDB, PostgreSQL, and Delta Lake.',
    'My passion lies at the intersection of agentic AI workflows, RAG architectures, systems security, and high-performance data engineering pipelines.',
  ],
  beyondCode:
    'Outside of development, I actively participate in hackathons (3rd Place in Spectra Vision Workshop at NCCU Taiwan, DIPEX State Level Hackathon), explore LLM agent frameworks (Agentforce Specialist), and dive into hyperspectral imaging and vector search technologies.',
};

export interface Social {
  id: string;
  handle: string;
  href: string;
}

export const socials: Social[] = [
  {
    id: 'email',
    handle: 'shewaledurgesh29@gmail.com',
    href: 'mailto:shewaledurgesh29@gmail.com',
  },
  {
    id: 'phone',
    handle: '+91 9975340539',
    href: 'tel:+919975340539',
  },
  {
    id: 'github',
    handle: 'DurgeshShewale29',
    href: 'https://github.com/DurgeshShewale29',
  },
  {
    id: 'linkedin',
    handle: 'durgesh-shewale-',
    href: 'https://www.linkedin.com/in/durgesh-shewale-/',
  },
];

export const getSocial = (id: string) => socials.find(s => s.id === id);

export interface Experience {
  role: string;
  company?: string;
  period: string;
  location?: string;
  highlights?: string[];
  description?: string;
}

export const experience: Experience[] = [
  {
    role: 'Full-Stack AI Developer Intern',
    company: 'IOCL (Indian Oil Corporation Limited)',
    period: 'May 2026 – July 2026',
    location: 'Guwahati, Assam',
    highlights: [
      'Architected a highly secure, offline document digitization platform and multi-format ingestion pipeline using FastAPI, packaging the entire ecosystem into a standalone executable (.exe) via PyInstaller.',
      'Engineered a "Zero-Shot" extraction engine utilizing OpenCV and Tesseract OCR with Spatial Coordinate Grouping to dynamically parse complex tabular grids and unseen industrial log formats.',
      'Built a local conversational AI agent using spaCy and advanced Regex to translate plain-English operator queries into direct SQLite database commands for instant data retrieval.',
    ],
  },
  {
    role: 'Full-Stack Developer Intern',
    company: 'HCL Tech',
    period: 'Mar 2025 – May 2025',
    location: 'Remote',
    highlights: [
      'Developed and enhanced web modules using Angular and Spring Boot.',
      'Implemented JWT-based authentication and role-based access control.',
      'Integrated REST APIs with frontend components and enhanced modular backend security.',
      'Improved application response times and enterprise reliability using Spring Boot architecture.',
    ],
  },
  {
    role: 'Software Development Intern',
    company: 'Sumago Infotech',
    period: 'Jan 2024 – Feb 2024',
    location: 'Nashik, Maharashtra',
    highlights: [
      'Built responsive front-end interfaces using HTML, CSS, and JavaScript.',
      'Worked on live project deployment, cross-device testing, and client-side integration.',
    ],
  },
];

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  score: string;
}

export const education: EducationItem[] = [
  {
    institution: 'Sanjivani University, Kopargaon',
    degree: 'Bachelor of Engineering in Computer Engineering',
    period: 'Aug 2024 – Present',
    location: 'Kopargaon, Maharashtra',
    score: '7.09 CGPA (3rd Year)',
  },
  {
    institution: 'K. B. H. Polytechnic, Malegaon (Nashik)',
    degree: 'Diploma in Computer Technology',
    period: 'Aug 2021 – June 2024',
    location: 'Malegaon, Maharashtra',
    score: '80.80%',
  },
];

export interface CertificationItem {
  title: string;
  issuer: string;
  year?: string;
  description?: string;
}

export const certifications: CertificationItem[] = [
  {
    title: 'Agentforce Specialist Certification',
    issuer: 'Salesforce',
    year: '2025',
    description: 'Configured and optimized Agentforce autonomous agents across Sales & Service Cloud.',
  },
  {
    title: '3rd Place – Spectra Vision Workshop',
    issuer: 'National Chung Cheng University, Taiwan',
    year: '2025',
    description: 'Hyperspectral Imaging Workshop & practical AI application development.',
  },
  {
    title: 'Problem Solving, Python & React (Frontend)',
    issuer: 'HackerRank',
    year: '2024',
    description: 'Verified skills in core algorithms, data structures, Python, and React UI development.',
  },
  {
    title: 'Exploratory Data Analysis (AI Ready)',
    issuer: 'NASSCOM Accenture',
    year: '2024',
    description: 'Data analytics, visualization, feature engineering, and predictive modeling.',
  },
  {
    title: 'DIPEX State Level Hackathon',
    issuer: 'State Level Project Presentation',
    year: '2024',
    description: 'Selected and presented engineering solutions at state-level project showcase.',
  },
];

// Skills as installed extensions in the Extensions view
export interface Extension {
  id: string;
  name: string;
  publisher: string;
  category: string;
  icon: IconType;
  color: string;
  description: string;
  details?: string;
  experience?: string;
}

export const extensions: Extension[] = [
  {
    id: 'python',
    name: 'Python',
    publisher: 'Python Software Foundation',
    category: 'Languages',
    icon: SiPython,
    color: '#3776ab',
    description: 'FastAPI, PySpark, OpenCV, Tesseract OCR, PyInstaller, and NLP data pipelines.',
    experience: '3 years',
  },
  {
    id: 'java',
    name: 'Java & Spring Boot',
    publisher: 'VMware & Oracle',
    category: 'Backend',
    icon: SiSpringboot,
    color: '#6db33f',
    description: 'Enterprise REST APIs, Spring Security, JWT authentication, and MVC architecture.',
    experience: '3 years',
  },
  {
    id: 'react',
    name: 'React 19 & Next.js',
    publisher: 'Meta & Vercel',
    category: 'Frontend',
    icon: SiReact,
    color: '#61dafb',
    description: 'Dynamic in-browser IDEs, StackBlitz WebContainers, state hooks, and SSR.',
    experience: '3 years',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    publisher: 'Microsoft',
    category: 'Languages',
    icon: SiTypescript,
    color: '#3178c6',
    description: 'Strict type systems, interface contracts, and scalable full-stack applications.',
    experience: '3 years',
  },
  {
    id: 'angular',
    name: 'Angular',
    publisher: 'Google',
    category: 'Frontend',
    icon: SiAngular,
    color: '#dd0031',
    description: 'Component architecture, reactive forms, RxJS observables, and JWT auth flow.',
    experience: '2 years',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    publisher: 'Tiangolo',
    category: 'Backend',
    icon: SiFastapi,
    color: '#009688',
    description: 'High-throughput async Python services, document parsing, and offline AI agents.',
    experience: '2 years',
  },
  {
    id: 'mongodb',
    name: 'MongoDB & Vector Search',
    publisher: 'MongoDB Inc.',
    category: 'Databases',
    icon: SiMongodb,
    color: '#47a248',
    description: 'NoSQL document storage, Atlas Vector Search, and RAG semantic embeddings.',
    experience: '2 years',
  },
  {
    id: 'mysql-postgres',
    name: 'MySQL & PostgreSQL',
    publisher: 'Oracle & PG Group',
    category: 'Databases',
    icon: SiMysql,
    color: '#4479a1',
    description: 'Relational database schema design, ACID transactions, and Delta Lake merges.',
    experience: '3 years',
  },
  {
    id: 'tailwind-css',
    name: 'Tailwind CSS',
    publisher: 'Tailwind Labs',
    category: 'Frontend',
    icon: SiTailwindcss,
    color: '#38bdf8',
    description: 'Responsive, modern UI styling for web applications and dashboards.',
    experience: '3 years',
  },
  {
    id: 'docker',
    name: 'Docker',
    publisher: 'Docker Inc.',
    category: 'DevOps & Cloud',
    icon: SiDocker,
    color: '#2496ed',
    description: 'Containerized microservices and reproducible deployment environments.',
    experience: '2 years',
  },
  {
    id: 'git',
    name: 'Git & GitHub Actions',
    publisher: 'Software Freedom Conservancy',
    category: 'Tools',
    icon: SiGit,
    color: '#f05032',
    description: 'Version control, automated CI/CD pipelines, and Prefect orchestration.',
    experience: '3 years',
  },
  {
    id: 'cpp',
    name: 'C & C++',
    publisher: 'ISO',
    category: 'Languages',
    icon: SiCplusplus,
    color: '#00599c',
    description: 'Data structures, algorithm optimization, and low-level memory concepts.',
    experience: '3 years',
  },
];

export const getExtension = (id: string) => extensions.find(e => e.id === id);

export const skills = extensions.reduce<Record<string, string[]>>(
  (groups, { category, name }) => {
    (groups[category] ??= []).push(name);
    return groups;
  },
  {}
);

export const writing = [
  { name: 'Offline Industrial Document Digitization with Zero-Shot OCR', href: 'https://github.com/DurgeshShewale29/LogDigitizer-Engine' },
  { name: 'Building In-Browser Autonomous IDEs with WebContainers', href: 'https://github.com/DurgeshShewale29/Spark-AI-2.0' },
  { name: 'Bronze-Silver-Gold Lakehouse Ingestion with Delta Lake', href: 'https://github.com/DurgeshShewale29/Tripflow-Lakehouse-Pipeline' },
];

export const projects: Project[] = [
  {
    title: 'Spark AI: In-Browser Autonomous IDE',
    description:
      'AI-powered in-browser IDE that autonomously generates, edits, and instantly previews multi-file applications (React, Next.js, Vue) using StackBlitz WebContainers, Gemini API, and MongoDB Vector Search RAG.',
    logo: '/logos/react_icon.svg',
    link: 'https://github.com/DurgeshShewale29/Spark-AI-2.0',
    slug: 'spark-ai',
  },
  {
    title: 'TripFlow: Lakehouse Data Pipeline',
    description:
      'Bronze–Silver–Gold data engineering pipeline ingesting millions of NYC taxi records into Delta tables via PySpark, Delta Lake, PostgreSQL, and Prefect with incremental MERGE loads and Z-ORDER partitioning.',
    logo: '/logos/js_icon.svg',
    link: 'https://github.com/DurgeshShewale29/Tripflow-Lakehouse-Pipeline',
    slug: 'tripflow-lakehouse',
  },
  {
    title: 'LogDigitizer Enterprise Platform',
    description:
      'Secure, entirely offline document digitization and conversational AI platform for air-gapped industrial environments. Built with FastAPI, OpenCV, Tesseract OCR Zero-Shot extraction, spaCy, and PyInstaller.',
    logo: '/logos/vsc.svg',
    link: 'https://github.com/DurgeshShewale29/LogDigitizer-Engine',
    slug: 'logdigitizer-enterprise',
  },
  {
    title: 'QR Maintenance & Equipment Management',
    description:
      'Laboratory equipment tracking system with QR-code scanning, maintenance scheduling, and usage logs. Built using Java, Spring Boot RESTful APIs, Angular, and MySQL.',
    logo: '/logos/coolify.svg',
    link: 'https://github.com/DurgeshShewale29/digital-maintenance-logbook',
    slug: 'qr-maintenance-system',
  },
];

export interface Route {
  path: string;
  label: string;
  icon: IconType;
  activityBar?: 'top' | 'bottom';
  shortcut?: string;
  file?: {
    name: string;
    icon: string;
  };
}

export const routes: Route[] = [
  {
    path: '/',
    label: 'Home',
    icon: VscFiles,
    activityBar: 'top',
    shortcut: 'h',
    file: { name: 'home.tsx', icon: '/logos/react_icon.svg' },
  },
  {
    path: '/about',
    label: 'About',
    icon: VscAccount,
    activityBar: 'top',
    shortcut: 'a',
    file: { name: 'about.html', icon: '/logos/html_icon.svg' },
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: VscCode,
    activityBar: 'top',
    shortcut: 'p',
    file: { name: 'projects.js', icon: '/logos/js_icon.svg' },
  },
  {
    path: '/skills',
    label: 'Skills',
    icon: VscTools,
    activityBar: 'top',
    shortcut: 'k',
    file: { name: 'skills.json', icon: '/logos/json_icon.svg' },
  },
  {
    path: '/contact',
    label: 'Contact',
    icon: VscMail,
    activityBar: 'top',
    shortcut: 'c',
    file: { name: 'contact.css', icon: '/logos/css_icon.svg' },
  },
  {
    path: '/github',
    label: 'GitHub',
    icon: VscGithubAlt,
    activityBar: 'top',
    shortcut: 'g',
    file: { name: 'github.md', icon: '/logos/markdown_icon.svg' },
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: VscSettings,
    activityBar: 'bottom',
    shortcut: 's',
  },
];

export const fileRoutes = routes.filter(
  (route): route is Route & { file: NonNullable<Route['file']> } =>
    route.file !== undefined
);
