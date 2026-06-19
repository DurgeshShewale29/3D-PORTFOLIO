import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Icosahedron, TorusKnot, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { usePortfolio } from '../../context/PortfolioContext';

function ProjectMonitor({ project, position, type }) {
  const groupRef = useRef();
  
  // Create a gentle floating hover effect for the monitor
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + (project.id * 10)) * 0.5;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + (project.id * 10)) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8 + (project.id * 10)) * 0.05;
    }
  });

  const color = type % 2 === 0 ? '#00ffff' : '#ff00ff';

  return (
    <group position={[position[0] - 3, position[1], position[2]]} ref={groupRef}>
      {/* 3D Monitor Frame */}
      <mesh>
        <boxGeometry args={[8, 4.5, 0.2]} />
        <meshBasicMaterial color={color} wireframe opacity={0.3} transparent />
      </mesh>

      <Html transform position={[0, 0, 0.15]} distanceFactor={8} occlude>
        <div style={{
          width: '800px',
          height: '450px',
          background: 'rgba(5, 10, 20, 0.85)',
          border: `2px solid ${color}`,
          borderRadius: '8px',
          boxShadow: `0 0 50px ${color}40 inset`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Decorative Corner Accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: `4px solid ${color}`, borderLeft: `4px solid ${color}` }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: `4px solid ${color}`, borderRight: `4px solid ${color}` }} />

          {project.image ? (
            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'fill', opacity: 0.9 }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', color, textShadow: `0 0 40px ${color}`, fontWeight: 'bold' }}>
                {project.title.substring(0, 2)}
              </div>
              <div style={{ marginTop: '20px', fontSize: '1.2rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.6)' }}>
                NO_VISUAL_DATA_FOUND
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '15px', color: color, letterSpacing: '0.1em' }}>
                [ UPLOAD SCREENSHOT VIA ADMIN ]
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

function ProjectPanel({ project, position, isFocused, type }) {
  const primaryColor = type === 1 || type === 4 ? '#ff00ff' : '#00f3ff';
  const secondaryColor = type === 1 || type === 4 ? '#00f3ff' : '#ff00ff';
  
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!isFocused) setIsFlipped(false);
  }, [isFocused]);

  const techList = project.techStack ? project.techStack.split(',').map(s => s.trim()) : [];

  return (
    <Html position={position} center className="html-2d-overlay">
      <motion.div
        initial={{ opacity: 0, x: 50, rotateY: 0 }}
        animate={{ opacity: isFocused ? 1 : 0, x: isFocused ? 0 : 50, rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut", rotateY: { duration: 0.6, type: "spring", stiffness: 60 } }}
        style={{ pointerEvents: isFocused ? 'auto' : 'none', width: '420px', height: '480px', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* FRONT SIDE */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '2.5rem', background: 'rgba(5, 10, 20, 0.95)', border: `1px solid ${primaryColor}40`, boxShadow: `0 0 30px ${primaryColor}20`, borderRadius: '16px', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Cyberpunk corner accents */}
          <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '15px', height: '15px', borderTop: `2px solid ${primaryColor}`, borderLeft: `2px solid ${primaryColor}`, borderTopLeftRadius: '16px' }} />
          <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '15px', height: '15px', borderTop: `2px solid ${secondaryColor}`, borderRight: `2px solid ${secondaryColor}`, borderTopRightRadius: '16px' }} />
          <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '15px', height: '15px', borderBottom: `2px solid ${primaryColor}`, borderLeft: `2px solid ${primaryColor}`, borderBottomLeftRadius: '16px' }} />
          <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '15px', height: '15px', borderBottom: `2px solid ${secondaryColor}`, borderRight: `2px solid ${secondaryColor}`, borderBottomRightRadius: '16px' }} />

          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '2px', background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '2px', background: secondaryColor, boxShadow: `0 0 10px ${secondaryColor}` }} />

          <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '2.4rem', color: '#fff', textShadow: `0 0 15px ${primaryColor}`, margin: 0, letterSpacing: '0.05em', lineHeight: 1.1, textAlign: 'left', textTransform: 'uppercase' }}>{project.title}</h2>
          <div style={{ marginTop: '1.2rem', fontFamily: 'sans-serif', fontSize: '0.95rem', color: '#d0d0d0', lineHeight: 1.6, textAlign: 'left', flex: 1, overflowY: 'auto' }}>
            {project.desc}
          </div>
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
            <motion.button onClick={() => window.open(project.viewProjectLink || '#', '_blank')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '1rem', background: project.urlType === 'Git Link' ? '#ff00ff20' : `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', border: project.urlType === 'Git Link' ? '1px solid #ff00ff' : 'none', borderRadius: '30px', fontFamily: 'var(--font-header)', fontSize: '1.2rem', cursor: 'pointer', boxShadow: project.urlType === 'Git Link' ? '0 0 15px #ff00ff40' : `0 0 20px ${primaryColor}80`, textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{project.urlType === 'Git Link' ? 'GIT LINK' : 'VIEW PROJECT'}</motion.button>
            <motion.button onClick={() => setIsFlipped(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '1rem', background: `#00f3ff20`, color: '#fff', border: `1px solid #00f3ff`, borderRadius: '30px', fontFamily: 'var(--font-header)', fontSize: '1.2rem', cursor: 'pointer', boxShadow: `0 0 15px #00f3ff40`, textTransform: 'uppercase' }}>TECH STACK</motion.button>
          </div>
        </div>

        {/* BACK SIDE */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '2.5rem', background: 'rgba(5, 10, 20, 0.95)', border: `1px solid ${secondaryColor}40`, boxShadow: `0 0 30px ${secondaryColor}20`, borderRadius: '16px', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '15px', height: '15px', borderTop: `2px solid ${secondaryColor}`, borderLeft: `2px solid ${secondaryColor}`, borderTopLeftRadius: '16px' }} />
          <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '15px', height: '15px', borderTop: `2px solid ${primaryColor}`, borderRight: `2px solid ${primaryColor}`, borderTopRightRadius: '16px' }} />
          <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '15px', height: '15px', borderBottom: `2px solid ${secondaryColor}`, borderLeft: `2px solid ${secondaryColor}`, borderBottomLeftRadius: '16px' }} />
          <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '15px', height: '15px', borderBottom: `2px solid ${primaryColor}`, borderRight: `2px solid ${primaryColor}`, borderBottomRightRadius: '16px' }} />

          <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '2rem', color: '#fff', textShadow: `0 0 15px ${secondaryColor}`, margin: 0, letterSpacing: '0.05em', lineHeight: 1.1, textAlign: 'left', textTransform: 'uppercase' }}>TECH STACK</h2>
          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '10px', flex: 1, alignContent: 'flex-start' }}>
            {techList.map((tech, idx) => (
              <span key={idx} style={{ background: `${primaryColor}20`, border: `1px solid ${primaryColor}`, padding: '6px 12px', borderRadius: '20px', color: '#fff', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {tech}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
            <motion.button onClick={() => setIsFlipped(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#fff', border: `1px solid #fff`, borderRadius: '30px', fontFamily: 'var(--font-header)', fontSize: '1.2rem', cursor: 'pointer', textTransform: 'uppercase' }}>BACK</motion.button>
          </div>
        </div>
      </motion.div>
    </Html>
  );
}

export default function ProjectShowcase({ isBooted, activeView }) {
  const { showcaseProjects } = usePortfolio();
  
  if (!isBooted) return null;

  return (
    <group>
      {showcaseProjects.map((proj, index) => {
        // Position them 40 units apart starting at X=74, shifted down by -0.5 to avoid nav bar
        const shapePos = [74 + (index * 40), -0.5, 0];
        // Shifted project card further right to increase gap from monitor, shifted down
        const panelPos = [86 + (index * 40), -0.5, 0];
        // Cycle types 1 through 4
        const type = (index % 4) + 1;

        return (
          <React.Fragment key={proj.id}>
            <ProjectMonitor project={proj} type={type} position={shapePos} />
            <ProjectPanel 
              project={proj}
              position={panelPos} 
              isFocused={activeView === `PROJECT_${index + 1}`} 
              type={type}
            />
          </React.Fragment>
        );
      })}
    </group>
  );
}
