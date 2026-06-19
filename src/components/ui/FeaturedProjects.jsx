import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, TorusKnot, Sphere, MeshDistortMaterial } from '@react-three/drei';

// Mini spinning 3D shape component
function RotatingShape({ type }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.8;
    meshRef.current.rotation.y += delta * 1.2;
  });

  if (type === 1) {
    return (
      <Icosahedron ref={meshRef} args={[1.5, 0]}>
        <meshBasicMaterial color="#ff00ff" wireframe />
      </Icosahedron>
    );
  }
  if (type === 2) {
    return (
      <TorusKnot ref={meshRef} args={[1, 0.3, 64, 8]}>
        <meshBasicMaterial color="#00f3ff" wireframe />
      </TorusKnot>
    );
  }
  if (type === 3) {
    return (
      <Sphere ref={meshRef} args={[1.2, 32, 32]}>
        <MeshDistortMaterial color="#00f3ff" wireframe distort={0.6} speed={3} />
      </Sphere>
    );
  }
  return (
    <Icosahedron ref={meshRef} args={[1.5, 1]}>
      <meshBasicMaterial color="#ff00ff" wireframe />
    </Icosahedron>
  );
}

// Mini Canvas container for the icons
const Mini3DIcon = ({ type }) => (
  <Canvas camera={{ position: [0, 0, 4] }} style={{ width: '100%', height: '100%', background: 'transparent' }}>
    <ambientLight intensity={1} />
    <RotatingShape type={type} />
  </Canvas>
);

const ProjectItem = ({ title, desc, percent, iconType }) => (
  <div className="hud-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
    <div style={{ width: '80px', height: '80px', background: 'rgba(0, 243, 255, 0.05)', border: '1px solid var(--color-primary)', borderRadius: '4px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <Mini3DIcon type={iconType} />
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-header)', fontSize: '1.2rem', color: 'var(--color-text)', lineHeight: 1 }}>{title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div className="progress-track" style={{ height: '4px' }}>
          <div className="progress-fill" style={{ width: `${percent}%`, background: 'var(--color-primary)', color: 'var(--color-primary)' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default function FeaturedProjects({ isBooted, activeView, featuredProjects }) {
  if (!featuredProjects || !isBooted) return null;

  const isFocused = activeView === 'HOME' || activeView === 'PROJECTS';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: isFocused ? 1 : 0.1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      style={{ pointerEvents: isFocused ? 'auto' : 'none' }}
    >
      <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', color: 'var(--color-primary)', letterSpacing: '0.1em', textAlign: 'right' }}>FEATURED PROJECTS</h3>
      {featuredProjects.map((proj, index) => (
        <ProjectItem 
          key={proj.id}
          title={proj.title} 
          desc={proj.desc} 
          percent={proj.percent} 
          iconType={(index % 4) + 1}
        />
      ))}
    </motion.div>
  );
}
