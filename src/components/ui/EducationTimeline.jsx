import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, Calendar, ChevronRight, Building, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { usePortfolio } from '../../context/PortfolioContext';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function EducationTimeline({ isBooted, activeView }) {
  const { educationData } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCert]);
  
  if (!isBooted) return null;

  const isActive = activeView.startsWith('JOURNEY_');
  const activeIndex = isActive ? parseInt(activeView.split('_')[1]) - 1 : 0;

  // Progress percentage (0 to 1)
  const progress = Math.max(0, Math.min(1, activeIndex / (educationData.length - 1)));

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: isActive ? 'auto' : 'none',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.8s ease',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      paddingTop: '50px' // offset from TopNav
    }}>
      
      {/* Title */}
      <h2 style={{
        fontFamily: 'var(--font-header)', fontSize: '2rem', color: '#00ffff',
        letterSpacing: '0.2em', textShadow: '0 0 10px rgba(0,255,255,0.5)',
        marginBottom: '60px',
        transform: isActive ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        ACADEMIC ARCHIVE
      </h2>

      {/* Progress Line Container */}
      <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', marginBottom: '60px' }}>
        {/* Glow Line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          background: '#00ffff', borderRadius: '2px',
          boxShadow: '0 0 15px #00ffff',
          width: `${progress * 100}%`,
          transition: 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }} />
        
        {/* Nodes along the progress line */}
        {educationData.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: `${(i / (educationData.length - 1)) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '16px', height: '16px', borderRadius: '50%',
            background: i <= activeIndex ? '#00ffff' : '#111',
            border: `2px solid ${i <= activeIndex ? '#fff' : 'rgba(0,255,255,0.3)'}`,
            boxShadow: i <= activeIndex ? '0 0 15px #00ffff' : 'none',
            transition: 'all 0.5s ease',
            transitionDelay: `${i * 0.05}s`,
            zIndex: 2
          }} />
        ))}
      </div>

      {/* Cards Container (Window) */}
      <div style={{
        width: '100%', overflow: 'hidden', display: 'flex'
      }}>
        {/* Sliding Track */}
        <div style={{
          display: 'flex', gap: '40px',
          // 400px card width + 40px gap = 440px stride. 200px is half card.
          transform: `translateX(calc(50vw - ${activeIndex * 440 + 200}px))`, 
          transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
          width: 'max-content'
        }}>
          {educationData.map((edu, i) => {
            const isCardActive = i === activeIndex;
            const isPast = i < activeIndex;
            
            return (
              <div key={edu.id} style={{
                width: '400px', height: '350px',
                background: isCardActive ? 'rgba(0, 30, 60, 0.8)' : 'rgba(5, 10, 20, 0.6)',
                border: `1px solid ${isCardActive ? '#00ffff' : 'rgba(0, 255, 255, 0.2)'}`,
                borderRadius: '8px',
                padding: '30px',
                boxShadow: isCardActive ? '0 0 30px rgba(0, 255, 255, 0.2) inset, 0 0 20px rgba(0,0,0,0.8)' : '0 0 20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-mono)', color: '#fff',
                transform: `scale(${isCardActive ? 1.05 : 0.9}) translateY(${isCardActive ? '0' : '20px'})`,
                opacity: isCardActive ? 1 : isPast ? 0.5 : 0.3,
                transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(0,255,255,0.2)', paddingBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00ffff' }}>
                    <Calendar size={18} />
                    <span style={{ fontSize: '0.9rem', letterSpacing: '0.1em' }}>{edu.year}</span>
                    {edu.roleText && (
                      <>
                        <span style={{ color: 'rgba(0, 255, 255, 0.4)' }}>|</span>
                        <span style={{ fontSize: '0.85rem', color: '#ff00ff', letterSpacing: '0.05em' }}>{edu.roleText.toUpperCase()}</span>
                      </>
                    )}
                  </div>
                  {edu.type === 'work' || edu.type === 'company' ? (
                    <Building size={20} color={isCardActive ? '#ff00ff' : 'rgba(255,255,255,0.3)'} />
                  ) : (
                    <GraduationCap size={20} color={isCardActive ? '#ff00ff' : 'rgba(255,255,255,0.3)'} />
                  )}
                </div>
                
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: isCardActive ? '#fff' : '#ccc', lineHeight: 1.3 }}>
                  {edu.degree}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#ff00ff' }}>
                  <Award size={16} />
                  <span style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>{edu.institution}</span>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, flexGrow: 1, overflowY: 'auto', paddingRight: '5px' }}>
                  {edu.details}
                </p>
                
                {isCardActive && (
                  <button 
                    onClick={() => setSelectedCert(edu)}
                    style={{ 
                      alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '5px', 
                      color: '#00ffff', fontSize: '0.8rem', marginTop: '10px',
                      background: 'transparent', border: '1px solid rgba(0, 255, 255, 0.3)',
                      padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ animation: 'pulse 2s infinite' }}>CERTIFICATE</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Global CSS for the pulse animation if not exists */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; text-shadow: 0 0 8px #00ffff; }
          100% { opacity: 0.6; }
        }
      `}</style>

      {/* Certificate Popup Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: 'rgba(0, 5, 10, 0.8)'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '600px', maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto',
                background: 'rgba(10, 20, 35, 0.9)',
                border: '1px solid #00ffff', borderRadius: '12px',
                boxShadow: '0 0 50px rgba(0, 255, 255, 0.2)',
                position: 'relative', display: 'flex', flexDirection: 'column',
                alignItems: 'center', color: '#fff', padding: '40px 30px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedCert(null)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  background: 'transparent', border: 'none', color: '#ff00ff',
                  cursor: 'pointer'
                }}
              >
                <X size={28} />
              </motion.button>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#00ffff', textAlign: 'center' }}>
                {selectedCert.degree}
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '30px' }}>
                {selectedCert.institution}
              </p>
              
              {selectedCert.imageUrl ? (
                (() => {
                  const url = selectedCert.imageUrl;
                  const isPdfOrExternalDoc = url.startsWith('data:application/pdf') || 
                                             url.toLowerCase().endsWith('.pdf') || 
                                             url.includes('application/pdf') ||
                                             url.includes('drive.google.com');
                  
                  return isPdfOrExternalDoc ? (
                    <div className="pdf-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      <Document
                        file={url}
                        loading={<div style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)', padding: '20px' }}>Loading Certificate...</div>}
                        error={<div style={{ color: '#ff0055', fontFamily: 'var(--font-mono)', padding: '20px' }}>Failed to load PDF.</div>}
                      >
                        <Page 
                          pageNumber={1} 
                          renderTextLayer={false} 
                          renderAnnotationLayer={false} 
                          scale={2}
                          className="react-pdf-page-custom"
                        />
                      </Document>
                    </div>
                  ) : (
                    <div className="pdf-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      <img src={url} alt={selectedCert.degree} style={{ maxWidth: '100%', maxHeight: '60vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)' }} />
                    </div>
                  );
                })()
              ) : (
                <div style={{ padding: '10px 20px', border: '1px dashed rgba(255,0,255,0.5)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textAlign: 'center' }}>
                  [ CERTIFICATE IMAGE PLACEHOLDER ]<br />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
