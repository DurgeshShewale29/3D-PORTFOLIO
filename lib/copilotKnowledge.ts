import { profile } from '@/portfolio.config';

// Exactly 4 clean, humanized suggestion queries (NO emoji overload)
export const SUGGESTED_CHIPS = [
  'What did Durgesh build at IOCL?',
  'Tell me about his Spark AI project',
  'What is Durgesh\'s core tech stack?',
  'How can I get in touch with Durgesh?',
];

export function answerQueryLocally(query: string): string {
  const q = query.toLowerCase().trim();

  // Contact / Hire
  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('call') || q.includes('reach') || q.includes('touch')) {
    return `You can reach **Durgesh Rajendra Shewale** directly:\n\n• **Email**: [${profile.email}](mailto:${profile.email})\n• **Phone**: [${profile.phone}](tel:${profile.phone})\n• **Location**: ${profile.location}\n• **GitHub**: [github.com/DurgeshShewale29](https://github.com/DurgeshShewale29)\n• **LinkedIn**: [linkedin.com/in/durgesh-shewale-](https://www.linkedin.com/in/durgesh-shewale-/)\n\nHe is currently open to full-stack, software engineering, and AI developer roles.`;
  }

  // IOCL Internship
  if (q.includes('iocl') || q.includes('indian oil') || q.includes('assam') || q.includes('guwahati') || q.includes('zero-shot') || q.includes('logdigitizer')) {
    return `During his internship at **IOCL (Indian Oil Corporation Limited)** as a Full-Stack AI Developer:\n\n1. **Offline Digitization Platform**: Architected a highly secure, offline document parsing pipeline with FastAPI, packaged into a standalone executable (.exe) using PyInstaller.\n2. **Zero-Shot OCR Extraction**: Engineered an extraction engine utilizing OpenCV and Tesseract OCR with Spatial Coordinate Grouping to parse complex tabular grids and industrial log formats without hardcoded schemas.\n3. **Conversational AI Agent**: Built a local intelligent agent using spaCy and advanced regex to convert operator natural-language queries into direct SQLite database commands for instant retrieval.`;
  }

  // HCL Tech Internship
  if (q.includes('hcl') || q.includes('hcl tech') || (q.includes('spring boot') && q.includes('angular'))) {
    return `At **HCL Tech**, Durgesh worked as a Full-Stack Developer Intern:\n\n• Developed and enhanced scalable web modules using **Angular** and **Spring Boot**.\n• Implemented **JWT-based authentication** and role-based access control (RBAC).\n• Built and integrated RESTful APIs with frontend components while enhancing modular backend security.`;
  }

  // Sumago Infotech
  if (q.includes('sumago')) {
    return `At **Sumago Infotech**, Durgesh worked as a Software Development Intern in Nashik, building responsive frontend web interfaces with HTML, CSS, and JavaScript, while handling live project deployment and client integration.`;
  }

  // Spark AI
  if (q.includes('spark') || q.includes('spark ai') || q.includes('webcontainer') || q.includes('ide')) {
    return `**Spark AI** is Durgesh's flagship in-browser autonomous IDE project:\n\n• Autonomously generates, edits, and previews multi-file applications (React, Next.js, Vue) in-browser using **StackBlitz WebContainers**.\n• Features a self-improving **RAG 'Hive Mind'** using **MongoDB Vector Search** that extracts coding rules from user errors.\n• Includes a custom prompt firewall and UI interceptor to dynamically catch framework mismatches and prevent crashes.\n• Supports automated GitHub repo creation, multimodal inputs (Voice/Image/Zip), and Clerk Auth.`;
  }

  // TripFlow Lakehouse
  if (q.includes('tripflow') || q.includes('lakehouse') || q.includes('pyspark') || q.includes('delta lake') || q.includes('taxi')) {
    return `**TripFlow** is an enterprise Lakehouse Data Pipeline engineered by Durgesh:\n\n• Ingests millions of NYC taxi records (Parquet, CSV, JSON, PostgreSQL) into **Delta tables** using a Bronze–Silver–Gold architecture.\n• Features strict data quality validation, quarantine tables, and incremental MERGE loads.\n• Dramatically cut query runtimes via data partitioning, broadcast joins, and **Z-ORDER** clustering, orchestrated with **Prefect** flows and GitHub Actions.`;
  }

  // QR Maintenance
  if (q.includes('qr') || q.includes('maintenance') || q.includes('device') || q.includes('equipment')) {
    return `**QR-Based Maintenance & Device Management System**:\n\n• Developed for laboratory equipment management to digitize physical records and automate tracking.\n• Implemented QR-code scanning enabled web application using **Java, Spring Boot, Angular, and MySQL** with RESTful endpoints for maintenance history, logs, and status updates.`;
  }

  // Skills & Tech Stack
  if (q.includes('skill') || q.includes('stack') || q.includes('language') || q.includes('tech') || q.includes('framework') || q.includes('tool')) {
    return `**Durgesh's Technical Stack**:\n\n• **Languages**: Python, Java, C, C++, JavaScript, TypeScript\n• **Frontend**: React 19, Next.js, Angular, Tailwind CSS, HTML/CSS\n• **Backend**: Spring Boot, FastAPI, Node.js, RESTful APIs, JWT Auth\n• **Databases**: MySQL, MongoDB (Vector Search), PostgreSQL, Delta Lake, Firebase\n• **AI & Systems**: RAG, Vector Embeddings, OpenCV, Tesseract OCR, spaCy, PyInstaller, PySpark\n• **Tools & Cloud**: Docker, Git, GitHub Actions, Prefect, Postman, Vercel, Render`;
  }

  // Education
  if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('cgpa') || q.includes('sanjivani') || q.includes('degree') || q.includes('polytechnic')) {
    return `**Durgesh's Educational Background**:\n\n1. **Bachelor of Engineering in Computer Engineering**\n   • Sanjivani University, Kopargaon (Aug 2024 – Present)\n   • **7.09 CGPA** (3rd Year)\n\n2. **Diploma in Computer Technology**\n   • K. B. H. Polytechnic, Malegaon (Nashik) (Aug 2021 – June 2024)\n   • Graduated with **80.80% Aggregate**`;
  }

  // Certifications & Achievements
  if (q.includes('cert') || q.includes('achievement') || q.includes('award') || q.includes('taiwan') || q.includes('agentforce') || q.includes('hackathon') || q.includes('dipex')) {
    return `**Certifications & Key Achievements**:\n\n• **Salesforce Agentforce Specialist (2025)**: Configured autonomous agents for sales/service workflows.\n• **3rd Place – Spectra Vision Workshop (2025)**: National Chung Cheng University, Taiwan (Hyperspectral Imaging Workshop).\n• **HackerRank**: Problem Solving, Python, and React Frontend Developer verified.\n• **NASSCOM Accenture**: Exploratory Data Analysis (AI Ready).\n• **DIPEX Hackathon**: State-Level Project Presentation Finalist.`;
  }

  // General Who is Durgesh / Summary
  if (q.includes('who') || q.includes('about') || q.includes('durgesh') || q.includes('intro') || q.includes('summary')) {
    return `**Durgesh Rajendra Shewale** is a Computer Engineering student at Sanjivani University and a **Full Stack Developer** from Malegaon, Maharashtra.\n\nHe has industry internship experience at **IOCL** and **HCL Tech**, and has engineered production-grade projects like **Spark AI** (an autonomous in-browser IDE) and **TripFlow** (Delta Lake Lakehouse pipeline). He specializes in Spring Boot, Angular, React, Next.js, and AI workflows.`;
  }

  // Resume
  if (q.includes('resume') || q.includes('cv') || q.includes('pdf')) {
    return `Durgesh's official resume is integrated into this portfolio. You can check the **About** page or open the contact options to get in touch with him directly.`;
  }

  // Default intelligent helpful response
  return `Durgesh Rajendra Shewale is a Full Stack Developer experienced in **React, Next.js, Spring Boot, FastAPI, and Lakehouse pipelines**.\n\nFeel free to ask about:\n• His **IOCL** or **HCL Tech** internships\n• His **Spark AI** or **TripFlow** projects\n• His **Technical Skills** or **Education**\n• How to **Contact** him`;
}
