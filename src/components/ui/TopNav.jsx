import React, { useState, useEffect } from 'react';
import { Home, User, GraduationCap, FolderGit2, BookOpen, Database, Mail, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

function TypewriterText({ text, delay = 0, speed = 50 }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    setDisplayText('');
    let i = 0;
    let currentText = '';
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          currentText += text.charAt(i);
          setDisplayText(currentText);
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return <>{displayText}</>;
}

export default function TopNav({ isBooted, activeView, setActiveView }) {
  const { aboutMe } = usePortfolio();

  if (!isBooted) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: activeView === 'HOME' ? 'space-between' : 'center', 
        alignItems: 'center', 
        position: 'relative', 
        zIndex: 100 
      }}
    >
      <motion.div
        animate={{ opacity: activeView === 'HOME' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: activeView === 'HOME' ? 'block' : 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-header)', letterSpacing: '0.05em' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', margin: 0, whiteSpace: 'nowrap', lineHeight: 1 }}>
            <TypewriterText text={aboutMe.navName || ''} delay={500} speed={40} />
          </h1>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '3.5rem' }}
            transition={{ delay: 1.5, duration: 0.5 }}
            style={{ width: '3px', backgroundColor: '#ffffff', borderRadius: '2px', opacity: 0.8 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: '#ffffff', fontSize: '2.1rem', whiteSpace: 'nowrap', lineHeight: 1.1 }}>
              <TypewriterText text={aboutMe.navTitle1 || ''} delay={1600} speed={40} />
            </span>
            <span style={{ color: '#ffffff', fontSize: '2.1rem', whiteSpace: 'nowrap', lineHeight: 1.1 }}>
              <TypewriterText text={aboutMe.navTitle2 || ''} delay={2200} speed={40} />
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className="hud-panel" style={{ display: 'flex', gap: '1.5rem', padding: '0.75rem 2rem' }}>
        {[
          { icon: <Home size={16} />, label: 'HOME' },
          { icon: <User size={16} />, label: 'ABOUT' },
          { icon: <GraduationCap size={16} />, label: 'JOURNEY' },
          { icon: <FolderGit2 size={16} />, label: 'PROJECTS' },
          { icon: <BookOpen size={16} />, label: 'SKILLS' },
          { icon: <Award size={16} />, label: 'CERTIFICATIONS' },
          { icon: <Mail size={16} />, label: 'CONTACT' }
        ].map(item => (
          <div key={item.label}
            onClick={() => {
              if (item.label === 'PROJECTS') {
                setActiveView('PROJECT_1');
              } else if (item.label === 'JOURNEY') {
                setActiveView('JOURNEY_1');
              } else {
                setActiveView(item.label);
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              color: activeView === item.label || (item.label === 'PROJECTS' && activeView.startsWith('PROJECT')) || (item.label === 'JOURNEY' && activeView.startsWith('JOURNEY')) ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              borderBottom: activeView === item.label || (item.label === 'PROJECTS' && activeView.startsWith('PROJECT')) || (item.label === 'JOURNEY' && activeView.startsWith('JOURNEY')) ? '2px solid var(--color-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'color 0.2s ease'
            }}>
            {item.icon} {item.label}
          </div>
        ))}
      </motion.div>

      {/* Top right text removed as per request */}
    </motion.div>
  );
}
