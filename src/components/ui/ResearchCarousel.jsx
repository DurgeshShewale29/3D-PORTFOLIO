import React from 'react';
import { motion } from 'framer-motion';

const ResearchThumb = ({ img }) => (
  <div className="hud-panel" style={{ width: '80px', height: '60px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', cursor: 'pointer' }}>
    {img}
  </div>
);

export default function ResearchCarousel({ isBooted, activeView }) {
  if (!isBooted) return null;

  const isFocused = activeView === 'HOME' || activeView === 'DATA' || activeView === 'RESEARCH';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isFocused ? 1 : 0.1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
      style={{ display: 'flex', gap: '2rem', alignItems: 'center', pointerEvents: isFocused ? 'auto' : 'none' }}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-header)', fontSize: '1rem', color: 'var(--color-text-muted)' }}>LATEST RESEARCH</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <ResearchThumb img="🔬" />
          <ResearchThumb img="🌌" />
          <ResearchThumb img="🧬" />
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-header)', fontSize: '1rem', color: 'var(--color-text-muted)' }}>PUBLICATIONS</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <ResearchThumb img="📄" />
          <ResearchThumb img="📊" />
          <ResearchThumb img="📚" />
        </div>
      </div>
    </motion.div>
  );
}
