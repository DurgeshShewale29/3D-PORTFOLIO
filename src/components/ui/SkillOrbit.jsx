import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFrame } from '@react-three/fiber';
import { Torus, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ORBIT_ICONS } from '../../data/OrbitIcons';
import { usePortfolio } from '../../context/PortfolioContext';

function ComplexCore({ isActive }) {
  const coreRef = useRef();
  const innerRef = useRef();
  
  useFrame((state, delta) => {
    if (!isActive) return;
    coreRef.current.rotation.z -= delta * 0.2;
    innerRef.current.rotation.z += delta * 0.5;
  });

  return (
    <group>
      {/* 1. Sharp Bright White Center Star */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color={[4, 4, 4]} toneMapped={false} />
      </mesh>
      
      {/* Center Soft Cyan Halo */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color={[0, 1.5, 1.5]} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      <group ref={innerRef}>
        {/* 2. Inner Thin Pink Ring */}
        <Torus args={[3, 0.03, 16, 128]}>
          <meshBasicMaterial color={[2, 0, 1]} toneMapped={false} />
        </Torus>
        
        {/* 3. Radial Dashed Cyan Ring */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.3, 0.08, 0.08]} />
              <meshBasicMaterial color={[0, 2, 2]} toneMapped={false} />
            </mesh>
          )
        })}
        
        {/* 4. Very thin boundary cyan ring for dashes */}
        <Torus args={[4.5, 0.015, 16, 128]}>
          <meshBasicMaterial color={[0, 2, 2]} toneMapped={false} />
        </Torus>
      </group>

      <group ref={coreRef}>
        {/* 5. Outer Thin Pink Ring */}
        <Torus args={[6, 0.03, 16, 128]}>
          <meshBasicMaterial color={[2, 0, 1]} toneMapped={false} />
        </Torus>

        {/* 6. Mechanical Outer Boundary */}
        <Torus args={[8, 0.06, 16, 128]}>
          <meshBasicMaterial color={[0, 2, 2]} toneMapped={false} />
        </Torus>
        <Torus args={[7.5, 0.015, 16, 128]}>
          <meshBasicMaterial color={[0, 2, 2]} toneMapped={false} />
        </Torus>
        {/* Mechanical Cross Bars */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 7.75, Math.sin(angle) * 7.75, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.5, 0.04, 0.04]} />
              <meshBasicMaterial color={[0, 1.5, 1.5]} toneMapped={false} />
            </mesh>
          )
        })}
      </group>
    </group>
  );
}

const SkillNode = ({ skill, x, y, color, cssColor, IconComponent }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[x, y, 0]}>
      {/* Glowing Node on the ring */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      
      {/* Holographic Cyberpunk Badge (Icon) */}
      <Billboard follow={true}>
        <Html center transform={false}>
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '55px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <motion.div 
              whileHover={{ scale: 1.2, boxShadow: `0 0 25px ${cssColor}ff` }}
              style={{
                padding: '10px',
                background: 'rgba(5, 10, 20, 0.8)',
                border: `1px solid ${cssColor}`,
                borderRadius: '50%',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 15px ${cssColor}60`,
                backdropFilter: 'blur(8px)',
                transition: 'border 0.3s ease'
              }}>
              {IconComponent ? <IconComponent size={22} /> : skill}
            </motion.div>

            {/* Hover Tooltip */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: 'absolute',
                    top: '110%',
                    background: 'rgba(5, 10, 20, 0.9)',
                    border: `1px solid ${cssColor}`,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    pointerEvents: 'none',
                    boxShadow: `0 0 10px ${cssColor}40`,
                    zIndex: 10
                  }}
                >
                  {skill}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Html>
      </Billboard>
    </group>
  );
};

function OrbitalRing({ radius, speed, color, cssColor, skills, isActive }) {
  const ringRef = useRef();
  
  useFrame((state, delta) => {
    if (!isActive) return;
    // Rotate around Z axis so it spins like a wheel facing the camera
    ringRef.current.rotation.z += delta * speed;
  });

  return (
    <group ref={ringRef}>
      {/* Thin glowing ring facing camera */}
      <Torus args={[radius, 0.04, 16, 128]}>
        <meshBasicMaterial color={color} toneMapped={false} />
      </Torus>

      {/* Orbiting Skills - Html badges only mounted when SKILLS view is active */}
      {isActive && skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const IconComponent = ORBIT_ICONS[skill];

        return (
          <SkillNode 
            key={skill}
            skill={skill}
            x={x} y={y}
            color={color}
            cssColor={cssColor}
            IconComponent={IconComponent}
          />
        );
      })}
    </group>
  );
}

export default function SkillOrbit({ isBooted, activeView }) {
  const { orbitSkills } = usePortfolio();
  const isActive = activeView === 'SKILLS';

  if (!isBooted) return null;

  return (
    <group position={[300, 0, 0]}>
      {/* Central Cyberpunk Reactor Core */}
      <ComplexCore isActive={isActive} />
      
      {/* Inner Ring (Core Languages) */}
      <OrbitalRing 
        radius={14} 
        speed={0.15} 
        color={[0, 1.5, 1.5]} 
        cssColor="#00ffff"
        skills={orbitSkills.inner || []}
        isActive={isActive}
      />
      
      {/* Middle Ring (AI & Frameworks) */}
      <OrbitalRing 
        radius={22} 
        speed={-0.1} 
        color={[2, 0, 1]} 
        cssColor="#ff00ff"
        skills={orbitSkills.middle || []}
        isActive={isActive}
      />
      
      {/* Outer Ring (Cloud & Tools) */}
      <OrbitalRing 
        radius={32} 
        speed={0.05} 
        color={[0, 1.5, 1.5]} 
        cssColor="#00ffff"
        skills={orbitSkills.outer || []}
        isActive={isActive}
      />
    </group>
  );
}
