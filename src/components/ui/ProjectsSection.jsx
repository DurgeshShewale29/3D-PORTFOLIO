import React from 'react';

const ProjectCard = ({ title, desc }) => (
  <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
    <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>{title}</h4>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{desc}</p>
  </div>
);

export default function ProjectsSection() {
  return (
    <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', padding: '0 10vw' }}>
      <div style={{ width: '400px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', letterSpacing: '0.05em', textAlign: 'right' }}>FEATURED PROJECTS</h3>
        <ProjectCard 
          title="SENTIENT AI INTERFACE" 
          desc="Developed a real-time conversational UI using WebGL and advanced LLM orchestrations." 
        />
        <ProjectCard 
          title="SYNTHETIC DATA GENERATION" 
          desc="Built an automated pipeline for generating robust, unbiased synthetic datasets for training." 
        />
        <ProjectCard 
          title="QUANTUM ANOMALY DETECTION" 
          desc="Implemented a quantum-inspired algorithm for identifying anomalies in high-frequency data streams." 
        />
      </div>
    </section>
  );
}
