import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

export default function HeroSection({ isBooted, activeView }) {
  const { aboutMe } = usePortfolio();

  if (!isBooted) return null;

  return (
    <AnimatePresence>
      {activeView === 'ABOUT' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-50%', x: '-50%' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1000px',
              textAlign: 'center',
              pointerEvents: 'auto',
              zIndex: 10
            }}
          >
            <h1 style={{ fontFamily: 'var(--font-header)', fontSize: 'clamp(2rem, 3.5vw, 4rem)', whiteSpace: 'nowrap', color: '#fff', textShadow: '0 0 10px var(--color-primary)', margin: 0, letterSpacing: '0.1em' }}>
              {aboutMe.heroName}
            </h1>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '0.5rem', letterSpacing: '0.2em' }}>
              {aboutMe.heroTitle}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3rem', textAlign: 'left' }}>
              {aboutMe.profileImage && (
                <motion.img
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  src={aboutMe.profileImage}
                  alt="Profile"
                  style={{ marginLeft: '-120px', width: '250px', height: '250px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)', boxShadow: '0 0 30px rgba(0, 243, 255, 0.4)', flexShrink: 0 }}
                />
              )}

              <div style={{ flex: 1, minWidth: 0, padding: '2rem', background: 'rgba(1, 4, 9, 0.85)', border: '1px solid rgba(0, 243, 255, 0.2)', boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.8, margin: 0 }}>
                  {aboutMe.description1}
                  {aboutMe.description2 && (
                    <>
                      <br /><br />
                      {aboutMe.description2}
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
