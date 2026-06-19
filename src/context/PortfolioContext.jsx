import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PortfolioContext = createContext();

const defaultSkills = [
  { id: '1', name: 'NEURAL NETWORKS', percent: 95, icon: 'Brain', color: 'var(--color-primary)' },
  { id: '2', name: 'MACHINE LEARNING', percent: 90, icon: 'Cpu', color: 'var(--color-primary)' },
  { id: '3', name: 'QUANTUM COMPUTING', percent: 75, icon: 'Binary', color: 'var(--color-primary)' },
  { id: '4', name: 'NLP & LLMs', percent: 85, icon: 'Database', color: 'var(--color-primary)' },
  { id: '5', name: 'ROBOTICS', percent: 80, icon: 'Bot', color: 'var(--color-primary)' },
  { id: '6', name: 'AI ETHICS', percent: 100, icon: 'Shield', color: 'var(--color-accent)' }
];

const defaultProjects = [
  { id: '1', title: 'SENTIENT AI INTERFACE', desc: 'Advanced NLP orchestration.', percent: 100 },
  { id: '2', title: 'SYNTHETIC DATA GEN', desc: 'Pipeline for robust datasets.', percent: 85 },
  { id: '3', title: 'QUANTUM ANOMALY', desc: 'High-frequency stream scanner.', percent: 90 },
  { id: '4', title: 'ROBOTIC SWARM INTEL', desc: 'Decentralized drone coordination.', percent: 70 }
];

const defaultShowcaseProjects = [
  { id: '1', title: 'SENTIENT AI INTERFACE', desc: 'Unveiling the next evolution in human-machine synergy. A comprehensive case study exploring deep learning integration, ethical AI development, and advanced cognitive systems for the digital age.', viewProjectLink: 'https://github.com', techStack: 'React, Three.js, Python, TensorFlow' },
  { id: '2', title: 'SYNTHETIC DATA GEN', desc: 'A robust data pipeline utilizing Generative Adversarial Networks (GANs) to produce high-fidelity synthetic datasets for training machine learning models without compromising privacy.', viewProjectLink: 'https://github.com', techStack: 'Python, PyTorch, GANs, AWS' },
  { id: '3', title: 'QUANTUM ANOMALY', desc: 'High-frequency stream scanner capable of detecting sub-millisecond anomalies in financial or network traffic data using bleeding-edge quantum-inspired algorithms.', viewProjectLink: 'https://github.com', techStack: 'C++, Rust, Qiskit, Kafka' },
  { id: '4', title: 'ROBOTIC SWARM INTEL', desc: 'A decentralized drone coordination framework written in Rust. Allows swarms of independent agents to map environments and share intelligence over peer-to-peer mesh networks.', viewProjectLink: 'https://github.com', techStack: 'Rust, WebRTC, ROS, WebSockets' }
];

const defaultOrbitSkills = {
  inner: ['Python', 'JavaScript', 'C++', 'SQL', 'HTML/CSS'],
  middle: ['PyTorch', 'TensorFlow', 'React', 'Node.js', 'FastAPI'],
  outer: ['AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Terraform']
};

const defaultEducation = [
  { id: 1, type: 'education', roleText: 'Student', year: '2020 - 2024', degree: 'B.Tech in Computer Science', institution: 'Tech University', details: 'Specialization in AI & ML. Graduated with Honors.' },
  { id: 2, type: 'education', roleText: 'Student', year: '2023', degree: 'Advanced Deep Learning', institution: 'Neural Academy', details: 'Intensive bootcamp on CNNs, RNNs, and Transformers.' },
  { id: 3, type: 'education', roleText: 'Student', year: '2022', degree: 'Quantum Computing Fundamentals', institution: 'Q-Institute', details: 'Introduction to quantum algorithms and Qiskit.' },
  { id: 4, type: 'education', roleText: 'Student', year: '2021', degree: 'Data Science Certification', institution: 'DataCamp', details: 'Comprehensive track covering Python, Pandas, and Scikit-Learn.' },
  { id: 5, type: 'education', roleText: 'Student', year: '2020', degree: 'Web Development Bootcamp', institution: 'CodeSpace', details: 'Full-stack development using MERN stack.' },
  { id: 6, type: 'education', roleText: 'Student', year: '2018 - 2020', degree: 'Higher Secondary', institution: 'Science College', details: 'Majored in Mathematics and Computer Science.' }
];

const defaultCertifications = [
  { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon', status: 'ACTIVE', level: '07', icon: 'Cloud', slot: '32' },
  { id: 2, name: 'Professional Data Engineer', issuer: 'Google Cloud', status: 'ACTIVE', level: '09', icon: 'Database', slot: '31' },
  { id: 3, name: 'Certified Kubernetes Administrator', issuer: 'CNCF', status: 'VERIFIED', level: '08', icon: 'Box', slot: '33' },
  { id: 4, name: 'Deep Learning Specialization', issuer: 'Coursera', status: 'ACTIVE', level: '06', icon: 'Brain', slot: '23' },
  { id: 5, name: 'Meta React Native Developer', issuer: 'Meta', status: 'VERIFIED', level: '05', icon: 'Code', slot: '41' },
  { id: 6, name: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', status: 'ACTIVE', level: '07', icon: 'Grid', slot: '40' },
  { id: 7, name: 'Cybernetic Security Protocol', issuer: 'STEL NET', status: 'SECURE', level: '09', icon: 'Shield', slot: '42' },
];

const defaultSocialLinks = [
  { id: 1, platform: 'Github', url: 'https://github.com', color: '#ffffff' },
  { id: 2, platform: 'LinkedIn', url: 'https://linkedin.com', color: '#00ffff' },
  { id: 3, platform: 'Email', url: 'mailto:hello@example.com', color: '#ff00ff' }
];

const defaultAboutMe = {
  heroName: 'DURGESH RAJENDRA SHEWALE',
  heroTitle: 'AI & MACHINE LEARNING ENGINEER',
  navName: 'Durgesh Shewale',
  navTitle1: 'AI & Full-Stack',
  navTitle2: 'Developer',
  description1: 'Computer Science And Engineering student and Full Stack Developer with proven experience in building scalable web application and multi-modal AI assistant. Seeking a challenging role to leverage my expertise in Spring Boot, Angular, and AI integration to drive innovation. Committed delivering high-quality, modular software solutions that enhance user experience and system security.',
  description2: '',
  profileImage: '' // Base64 image data
};

export function PortfolioProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [coreSkills, setCoreSkills] = useState(defaultSkills);
  const [featuredProjects, setFeaturedProjects] = useState(defaultProjects);
  const [educationData, setEducationData] = useState(defaultEducation);
  const [showcaseProjects, setShowcaseProjects] = useState(defaultShowcaseProjects);
  const [orbitSkills, setOrbitSkills] = useState(defaultOrbitSkills);
  const [certifications, setCertifications] = useState(defaultCertifications);
  const [messages, setMessages] = useState([]);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [aboutMe, setAboutMe] = useState(defaultAboutMe);

  // Initialize from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const collections = [
        { id: 'skills', setter: setCoreSkills, fallback: defaultSkills },
        { id: 'projects', setter: setFeaturedProjects, fallback: defaultProjects },
        { id: 'education', setter: setEducationData, fallback: defaultEducation },
        { id: 'showcase', setter: setShowcaseProjects, fallback: defaultShowcaseProjects },
        { id: 'orbit', setter: setOrbitSkills, fallback: defaultOrbitSkills },
        { id: 'certifications', setter: setCertifications, fallback: defaultCertifications },
        { id: 'social', setter: setSocialLinks, fallback: defaultSocialLinks },
        { id: 'aboutMe', setter: setAboutMe, fallback: defaultAboutMe },
        { id: 'messages', setter: setMessages, fallback: [] }
      ];

      const fetchPromises = collections.map(async ({ id, setter, fallback }) => {
        try {
          const docRef = doc(db, 'portfolio', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().data) {
            setter(docSnap.data().data);
          } else {
            setter(fallback);
          }
        } catch (err) {
          console.error(`Error fetching ${id} from Firestore:`, err);
        }
      });

      await Promise.all(fetchPromises);
      setIsInitialized(true);
    };

    fetchData();
  }, []);

  const cleanData = (data) => JSON.parse(JSON.stringify(data));

  const saveAllData = async (dataOverrides = {}) => {
    const saveOperations = [
      { id: 'skills', data: cleanData(dataOverrides.coreSkills || coreSkills) },
      { id: 'projects', data: cleanData(dataOverrides.featuredProjects || featuredProjects) },
      { id: 'education', data: cleanData(dataOverrides.educationData || educationData) },
      { id: 'showcase', data: cleanData(dataOverrides.showcaseProjects || showcaseProjects) },
      { id: 'orbit', data: cleanData(dataOverrides.orbitSkills || orbitSkills) },
      { id: 'certifications', data: cleanData(dataOverrides.certifications || certifications) },
      { id: 'social', data: cleanData(dataOverrides.socialLinks || socialLinks) },
      { id: 'aboutMe', data: cleanData(dataOverrides.aboutMe || aboutMe) },
      { id: 'messages', data: cleanData(messages) }
    ];

    const promises = saveOperations.map(op => 
      setDoc(doc(db, 'portfolio', op.id), { data: op.data })
    );

    await Promise.all(promises);
  };

  // We no longer passively save on state change. The UI must explicitly call saveAllData()
  
  const resetToDefault = async () => {
    setCoreSkills(defaultSkills);
    setFeaturedProjects(defaultProjects);
    setEducationData(defaultEducation);
    setShowcaseProjects(defaultShowcaseProjects);
    setOrbitSkills(defaultOrbitSkills);
    setCertifications(defaultCertifications);
    setMessages([]);
    setSocialLinks(defaultSocialLinks);
    setAboutMe(defaultAboutMe);
  };

  return (
    <PortfolioContext.Provider value={{
      coreSkills, setCoreSkills,
      featuredProjects, setFeaturedProjects,
      educationData, setEducationData,
      showcaseProjects, setShowcaseProjects,
      orbitSkills, setOrbitSkills,
      certifications, setCertifications,
      messages, setMessages,
      socialLinks, setSocialLinks,
      aboutMe, setAboutMe,
      resetToDefault,
      saveAllData
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
