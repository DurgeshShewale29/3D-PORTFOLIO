import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom SVG Area Chart with smooth bezier curves and gradients
const AreaChart = ({ data1, data2, labels, color1, color2, title }) => {
  const width = 280;
  const height = 120; // Slightly shorter to fit labels
  
  const createPath = (data) => {
    const pts = data.map((val, i) => [
      (i / (data.length - 1)) * width,
      height - (val / 100) * height
    ]);
    
    let path = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const x_mid = (pts[i][0] + pts[i + 1][0]) / 2;
      path += ` C ${x_mid},${pts[i][1]} ${x_mid},${pts[i+1][1]} ${pts[i+1][0]},${pts[i+1][1]}`;
    }
    return path;
  };

  const path1 = createPath(data1);
  const path2 = createPath(data2);
  
  // Area paths (close the path to the bottom)
  const area1 = `${path1} L ${width},${height} L 0,${height} Z`;
  const area2 = `${path2} L ${width},${height} L 0,${height} Z`;

  return (
    <div style={{
      padding: '20px', background: 'rgba(5, 10, 20, 0.6)',
      border: `1px solid ${color1}40`, borderRadius: '8px',
      boxShadow: `0 0 20px ${color1}20 inset`, backdropFilter: 'blur(10px)',
      color: '#fff', fontFamily: 'var(--font-mono)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: color1, fontSize: '0.9rem', letterSpacing: '0.1em' }}>{title}</h3>
      
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: `${width / (labels.length - 1)}px 100%` }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100% 24px' }}></div>

        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`grad1-${title.replace(/ /g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color1} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color1} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`grad2-${title.replace(/ /g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color2} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color2} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Areas */}
          <motion.path 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            d={area2} fill={`url(#grad2-${title.replace(/ /g, '')})`} 
          />
          <motion.path 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}
            d={area1} fill={`url(#grad1-${title.replace(/ /g, '')})`} 
          />
          
          {/* Lines */}
          <motion.path 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            d={path2} fill="none" stroke={color2} strokeWidth="2" 
            style={{ filter: `drop-shadow(0 0 6px ${color2})` }}
          />
          <motion.path 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
            d={path1} fill="none" stroke={color1} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 6px ${color1})` }}
          />
        </svg>
      </div>
      
      {/* X-Axis Labels Removed */}      {/* Legend */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.65rem', color: '#aaa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', background: color1, borderRadius: '50%', boxShadow: `0 0 8px ${color1}` }}></div>
          <span>PROFICIENCY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', background: color2, borderRadius: '50%', boxShadow: `0 0 8px ${color2}` }}></div>
          <span>USAGE FREQUENCY</span>
        </div>
      </div>
    </div>
  );
};

export default function SkillsHUD({ isBooted, activeView }) {
  if (!isBooted) return null;

  // Language & AI Skills (Left Panel)
  const mlLabels = ['PY', 'C++', 'SQL', 'TORCH', 'TF', 'FASTAPI'];
  const mlProficiency = [0, 25, 50, 75, 85, 95];
  const mlUsage = [0, 15, 40, 65, 80, 90];

  // Web & Cloud Skills (Right Panel)
  const webLabels = ['JS', 'REACT', 'NODE', 'AWS', 'DOCKER', 'K8S'];
  const webProficiency = [0, 30, 55, 70, 85, 95];
  const webUsage = [0, 20, 45, 60, 80, 90];

  return (
    <AnimatePresence>
      {activeView === 'SKILLS' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '0 4vw', zIndex: 10
          }}
        >
          {/* LEFT PANEL */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            style={{ width: '320px' }}
          >
            <AreaChart 
              title="AI / ML PROFICIENCY INDEX"
              labels={mlLabels}
              data1={mlProficiency} data2={mlUsage}
              color1="#00ffff" color2="#ff00ff"
            />
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            style={{ width: '320px' }}
          >
             <AreaChart 
              title="SYSTEM ARCHITECTURE EXP."
              labels={webLabels}
              data1={webProficiency} data2={webUsage}
              color1="#ff00ff" color2="#00ffff"
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
