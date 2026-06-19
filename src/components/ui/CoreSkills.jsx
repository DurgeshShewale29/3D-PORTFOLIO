import React from 'react';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import { motion } from 'framer-motion';

const SkillItem = ({ iconName, name, percent, color }) => {
  // Check Lucide first, then FontAwesome, then SimpleIcons. Default to Code.
  const IconComponent = LucideIcons[iconName] || FaIcons[iconName] || SiIcons[iconName] || LucideIcons.Code;
  return (
    <div className="hud-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
          <IconComponent size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-header)', fontSize: '1.2rem', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{name}</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%`, background: color, color: color }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CoreSkills({ isBooted, activeView, coreSkills }) {
  if (!coreSkills || !isBooted) return null;

  const isFocused = activeView === 'HOME' || activeView === 'PROFILE';

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: isFocused ? 1 : 0.1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      style={{ pointerEvents: isFocused ? 'auto' : 'none' }}
    >
      <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>CORE SKILLS</h3>
      {coreSkills.map(skill => (
        <SkillItem 
          key={skill.id} 
          iconName={skill.icon} 
          name={skill.name} 
          percent={skill.percent} 
          color={skill.color} 
        />
      ))}
    </motion.div>
  );
}
