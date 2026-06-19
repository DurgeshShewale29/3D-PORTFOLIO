import React from 'react';

const SkillBar = ({ name, percent }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
      <span>{name}</span>
      <span>{percent}%</span>
    </div>
    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', boxShadow: '0 0 10px var(--color-primary)' }} />
    </div>
  </div>
);

export default function SkillsSection() {
  return (
    <section style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '350px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', letterSpacing: '0.05em' }}>CORE SKILLS</h3>
        <SkillBar name="NEURAL NETWORKS" percent={95} />
        <SkillBar name="MACHINE LEARNING" percent={90} />
        <SkillBar name="QUANTUM COMPUTING" percent={75} />
        <SkillBar name="NLP & LLMs" percent={85} />
        <SkillBar name="PYTHON / C++" percent={98} />
      </div>
    </section>
  );
}
