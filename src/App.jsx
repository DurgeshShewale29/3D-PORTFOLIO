import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import DataCoreScene from './components/3d/DataCoreScene';
import TopNav from './components/ui/TopNav';
import CoreSkills from './components/ui/CoreSkills';
import FeaturedProjects from './components/ui/FeaturedProjects';
import BootSequence from './components/ui/BootSequence';
import HeroSection from './components/ui/HeroSection';
import ProjectShowcase from './components/ui/ProjectShowcase';
import SkillOrbit from './components/ui/SkillOrbit';
import SkillsHUD from './components/ui/SkillsHUD';
import CertificationsWall from './components/ui/CertificationsWall';
import ContactStation from './components/ui/ContactStation';
import EducationTimeline from './components/ui/EducationTimeline';
import AdminDashboard from './components/ui/AdminDashboard';
import { usePortfolio } from './context/PortfolioContext';

function CameraController({ activeView }) {
  useFrame((state, delta) => {
    // Resolve base view for grouped sequences
    let config;
    if (activeView.startsWith('JOURNEY')) {
      config = CAMERA_STOPS.JOURNEY;
    } else if (activeView.startsWith('PROJECT_')) {
      // Dynamically calculate camera position for any number of projects
      // PROJECT_1 is at x=80, PROJECT_2 at 120, etc. (stride of 40)
      const projectIndex = parseInt(activeView.split('_')[1], 10) - 1;
      const xPos = 80 + (projectIndex * 40);
      config = { pos: [xPos, 0, 18], lookAt: [xPos, 0, 0] };
    } else {
      config = CAMERA_STOPS[activeView] || CAMERA_STOPS.HOME;
    }

    cameraPos.set(...config.pos);
    cameraLookAt.set(...config.lookAt);

    // Smoothly fly camera to target position
    // Slow down the camera flight specifically when traveling to the Journey sector
    const lerpSpeed = activeView.startsWith('JOURNEY') ? 1.0 : 3.0;

    state.camera.position.lerp(cameraPos, delta * lerpSpeed);

    // Smoothly rotate camera to look at target
    if (!state.camera.userData.lookAtTarget) {
      state.camera.userData.lookAtTarget = new THREE.Vector3(0, 0, 0);
    }
    state.camera.userData.lookAtTarget.lerp(cameraLookAt, delta * lerpSpeed);
    state.camera.lookAt(state.camera.userData.lookAtTarget);
  });
  return null;
}

const CAMERA_STOPS = {
  HOME: { pos: [0, 0, 20], lookAt: [0, 0, 0] },
  ABOUT: { pos: [0, -0.4, 6], lookAt: [0, -0.4, 0] },
  JOURNEY: { pos: [40, 0, 18], lookAt: [40, 0, 0] },
  PROJECTS: { pos: [13, -1, 10], lookAt: [13, -1, 0] },
  DATA: { pos: [0, -8, 12], lookAt: [0, -8, 2] },
  RESEARCH: { pos: [0, -8, 12], lookAt: [0, -8, 2] },
  SKILLS: { pos: [300, 0, 85], lookAt: [300, 0, 0] },
  CERTIFICATIONS: { pos: [450, 0, 90], lookAt: [450, 0, 0] },
  CONTACT: { pos: [600, 0, 30], lookAt: [600, 0, 0] },
};

const cameraPos = new THREE.Vector3();
const cameraLookAt = new THREE.Vector3();

// Custom animated starfield to guarantee twinkling
function AnimatedStarfield() {
  const groupRef = useRef();

  // Slowly rotate the entire universe. As 1-pixel stars cross the pixel grid, 
  // anti-aliasing forces them to naturally fade in and out, creating a highly realistic twinkle.
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.00099;
      groupRef.current.rotation.x += delta * 0.00099;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={400} depth={200} count={8000} factor={6} saturation={0} />
      {/* Sparkles guarantee explicit size/opacity pulsing */}
      <Sparkles count={250} scale={600} size={6} speed={0.05} opacity={0.6} color="#00ffff" />
      <Sparkles count={250} scale={600} size={4} speed={0.08} opacity={0.4} color="#ff00ff" />
    </group>
  );
}

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [activeView, setActiveView] = useState('HOME');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { coreSkills, featuredProjects, showcaseProjects, educationData, aboutMe } = usePortfolio();
  const isScrolling = useRef(false);

  // Sync favicon with profile photo
  useEffect(() => {
    if (aboutMe?.profileImage) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = aboutMe.profileImage;
    }
  }, [aboutMe?.profileImage]);

  // Dynamically generate views based on current data lengths
  const VIEWS = useMemo(() => [
    'HOME', 'ABOUT',
    ...(educationData || []).map((_, i) => `JOURNEY_${i + 1}`),
    ...(showcaseProjects || []).map((_, i) => `PROJECT_${i + 1}`),
    'SKILLS', 'CERTIFICATIONS', 'CONTACT'
  ], [educationData, showcaseProjects]);

  // Secret Shortcut Listener (Ctrl + `)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default just in case
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }

      // Close on Escape
      if (e.key === 'Escape') {
        setIsAdminOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isBooted) return;

    const handleWheel = (e) => {
      if (isAdminOpen) return;
      if (document.body.style.overflow === 'hidden') return;
      if (isScrolling.current) return;

      const currentIndex = VIEWS.indexOf(activeView);
      if (currentIndex === -1) return; // Only process scroll if we are in the flow

      if ((e.deltaY > 50 || e.deltaX > 50) && currentIndex < VIEWS.length - 1) {
        setActiveView(VIEWS[currentIndex + 1]);
        isScrolling.current = true;
        setTimeout(() => isScrolling.current = false, 600); // 0.6s cooldown
      } else if ((e.deltaY < -50 || e.deltaX < -50) && currentIndex > 0) {
        setActiveView(VIEWS[currentIndex - 1]);
        isScrolling.current = true;
        setTimeout(() => isScrolling.current = false, 600);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeView, isBooted, VIEWS, isAdminOpen]);

  return (
    <>
      <Canvas dpr={[1, 1.2]} camera={{ position: [0, 0, 20], fov: 50 }} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <color attach="background" args={['#010409']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff00ff" />

        <CameraController activeView={activeView} />

        <AnimatedStarfield />

        <Suspense fallback={null}>
          <DataCoreScene isBooted={isBooted} setActiveView={setActiveView} />

          {/* 3D UI Elements using Html transform */}

          {/* Left Panel - Skills */}
          <Html transform position={[-13.5, -1, 0]} rotation={[0, 0.25, 0]} scale={0.9} className="html-3d-container">
            <div style={{ width: '400px' }}>
              <CoreSkills isBooted={isBooted} activeView={activeView} coreSkills={coreSkills} />
            </div>
          </Html>

          {/* Right Panel - Projects */}
          <Html transform position={[13.5, -1, 0]} rotation={[0, -0.25, 0]} scale={0.9} className="html-3d-container">
            <div style={{ width: '400px' }}>
              <FeaturedProjects isBooted={isBooted} activeView={activeView} featuredProjects={featuredProjects} />
            </div>
          </Html>



          {/* Epic Deep-Dive Project Showcase */}
          <ProjectShowcase isBooted={isBooted} activeView={activeView} />

          <SkillOrbit isBooted={isBooted} activeView={activeView} />
          <CertificationsWall isBooted={isBooted} activeView={activeView} />
          <ContactStation isBooted={isBooted} activeView={activeView} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} height={200} intensity={1.2} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* 2D Fixed Overlay for TopNav and HUDs */}
      <div className="hud-overlay">
        <TopNav isBooted={isBooted} activeView={activeView} setActiveView={setActiveView} />
        <HeroSection isBooted={isBooted} activeView={activeView} />
        <SkillsHUD isBooted={isBooted} activeView={activeView} />
        <EducationTimeline isBooted={isBooted} activeView={activeView} />
        <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        <ResumeViewerOverlay />
      </div>

      {!isBooted && <BootSequence onComplete={() => setIsBooted(true)} />}
    </>
  );
}

function ResumeViewerOverlay() {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const { aboutMe } = usePortfolio();

  useEffect(() => {
    const handler = () => setShowResumeModal(true);
    window.addEventListener('OPEN_RESUME', handler);
    return () => window.removeEventListener('OPEN_RESUME', handler);
  }, []);

  if (!showResumeModal) return null;

  return (
    <div style={{ pointerEvents: 'auto', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999 }}>
      <div style={{
        width: '100%', height: '100%',
        background: 'rgba(5, 10, 20, 0.85)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          width: '80%', height: '90%', background: '#0a0f1e',
          border: '1px solid #00f3ff', borderRadius: '8px',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Modal Header */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', padding: '15px 25px', 
            borderBottom: '1px solid rgba(0,255,255,0.3)', background: 'rgba(0,255,255,0.05)', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{color: '#00f3ff'}}>❯_</span>
              <h2 style={{ color: '#00f3ff', margin: 0, fontFamily: 'var(--font-mono)', fontSize: '1.2rem', letterSpacing: '2px' }}>
                RESUME_DOCUMENT
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <a 
                href={aboutMe?.resumeUrl || "/resume.pdf"} 
                download="Resume.pdf"
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: '#000', background: '#00f3ff', border: 'none', 
                  borderRadius: '4px', padding: '8px 20px', display: 'flex', 
                  alignItems: 'center', gap: '8px', textDecoration: 'none', 
                  fontFamily: 'var(--font-mono)', fontWeight: 'bold',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)'}
              >
                DOWNLOAD
              </a>
              <button 
                onClick={() => setShowResumeModal(false)} 
                style={{ 
                  color: '#ff00ff', cursor: 'pointer', background: 'none', 
                  border: 'none', display: 'flex', alignItems: 'center',
                  fontSize: '24px', lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* PDF / Image Viewer */}
          <div style={{ flex: 1, padding: '20px', background: 'rgba(5, 10, 20, 0.95)', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {aboutMe?.resumeUrl ? (
              <Document
                file={aboutMe.resumeUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)' }}>DECRYPTING DOCUMENT...</div>}
                error={<div style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>FAILED TO DECRYPT DOCUMENT.</div>}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} style={{ marginBottom: '20px', boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)', border: '1px solid rgba(0, 255, 255, 0.3)' }}>
                    <Page 
                      pageNumber={index + 1} 
                      width={800}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            ) : (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#888', fontFamily: 'var(--font-mono)', flexDirection: 'column', gap: '20px', marginTop: '100px' }}>
                <span style={{fontSize: '48px'}}>⚠</span>
                <h2>NO RESUME DETECTED ON SERVER</h2>
                <p>Please upload a resume in the Admin Dashboard and click 'SAVE TO DATABASE'.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
