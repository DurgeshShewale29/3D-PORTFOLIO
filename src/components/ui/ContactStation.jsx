import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Download, X } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaYoutube, FaMedium, FaKaggle, FaGlobe } from 'react-icons/fa';
import { SiGmail, SiLeetcode } from 'react-icons/si';
import { usePortfolio } from '../../context/PortfolioContext';

export const SOCIAL_ICONS = {
  'Github': FaGithub,
  'LinkedIn': FaLinkedin,
  'Twitter': FaTwitter,
  'Discord': FaDiscord,
  'YouTube': FaYoutube,
  'Medium': FaMedium,
  'Kaggle': FaKaggle,
  'LeetCode': SiLeetcode,
  'Email': SiGmail,
  'Website': FaGlobe
};

export default function ContactStation({ isBooted, activeView }) {
  const { messages, setMessages, socialLinks, aboutMe } = usePortfolio();
  // Refs removed as we are replacing the relay with the globe

  useFrame((state, delta) => {
    // Empty frame hook
  });

  if (!isBooted) return null;

  return (
    <group position={[600, -1.5, 0]}>
      {/* Glowing Holographic Globe */}
      <HolographicGlobe />

      {/* Glassmorphism Contact Form Interface */}
      <Html transform position={[10.8, 0.3, 5]} rotation={[0, -0.15, 0]} scale={1.12}>
        <div style={{
          width: '460px',
          padding: '30px',
          background: 'rgba(5, 10, 20, 0.8)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.1) inset, 0 0 50px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          // Prevent interaction unless we are actually on the CONTACT view
          pointerEvents: activeView === 'CONTACT' ? 'auto' : 'none',
          opacity: activeView === 'CONTACT' ? 1 : 0.1,
          transition: 'opacity 0.8s ease'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid rgba(0, 255, 255, 0.3)', paddingBottom: '15px' }}>
            <Terminal size={24} color="#00ffff" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '0.2em', color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>
              SECURE COMMLINK
            </h2>
          </div>

          {/* Contact Form */}
          <form 
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} 
            onSubmit={(e) => { 
              e.preventDefault(); 
              const form = e.currentTarget;
              
              const newMsg = {
                id: Date.now(),
                name: form.elements[0].value,
                email: form.elements[1].value,
                message: form.elements[2].value,
                timestamp: new Date().toISOString()
              };
              setMessages([...messages, newMsg]);

              // Basic fake success feedback for the template
              const btn = form.querySelector('button');
              const oldText = btn.innerHTML;
              btn.innerHTML = 'TRANSMISSION SENT';
              btn.style.background = '#00ffff';
              btn.style.color = '#000';
              setTimeout(() => {
                btn.innerHTML = oldText;
                btn.style.background = 'rgba(0, 255, 255, 0.1)';
                btn.style.color = '#00ffff';
              }, 3000);
              e.currentTarget.reset();
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>ORIGIN (NAME)</label>
              <input 
                type="text" 
                required
                style={{
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,0,255,0.3)',
                  padding: '12px 15px', color: '#fff', outline: 'none', fontFamily: 'inherit',
                  borderRadius: '4px', transition: 'border-color 0.3s'
                }} 
                onFocus={(e) => e.target.style.borderColor = '#ff00ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,0,255,0.3)'}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>SIGNAL VECTOR (EMAIL)</label>
              <input 
                type="email" 
                required
                style={{
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,0,255,0.3)',
                  padding: '12px 15px', color: '#fff', outline: 'none', fontFamily: 'inherit',
                  borderRadius: '4px', transition: 'border-color 0.3s'
                }} 
                onFocus={(e) => e.target.style.borderColor = '#ff00ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,0,255,0.3)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>ENCRYPTED MESSAGE</label>
              <textarea 
                rows="4"
                required
                style={{
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,0,255,0.3)',
                  padding: '12px 15px', color: '#fff', outline: 'none', fontFamily: 'inherit',
                  borderRadius: '4px', resize: 'none', transition: 'border-color 0.3s'
                }} 
                onFocus={(e) => e.target.style.borderColor = '#ff00ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,0,255,0.3)'}
              />
            </div>

            <button 
              type="submit"
              style={{
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid #00ffff',
                color: '#00ffff',
                padding: '15px',
                marginTop: '10px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#00ffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.boxShadow = '0 0 20px #00ffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                e.currentTarget.style.color = '#00ffff';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Send size={18} /> TRANSMIT
            </button>
            
          </form>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('OPEN_RESUME'))}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 0, 255, 0.5)',
              color: '#ff00ff',
              padding: '15px',
              marginTop: '15px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              letterSpacing: '0.2em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '4px',
              textDecoration: 'none',
              transition: 'all 0.3s',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Download size={18} /> RESUME
          </button>

          {/* Social Links Sub-Panel */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
            {socialLinks && socialLinks.map(link => {
              const Icon = SOCIAL_ICONS[link.platform] || FaGlobe;
              return <SocialIcon key={link.id} icon={<Icon size={24} />} link={link.url} color={link.color} />;
            })}
          </div>
        </div>
      </Html>

    </group>
  );
}

function HolographicGlobe() {
  const globeRef = useRef();
  
  useFrame((state, delta) => {
    if (globeRef.current) {
      // Slowly rotate the globe
      globeRef.current.rotation.y += delta * 0.15;
      // Slight tilt
      globeRef.current.rotation.z = 0.1;
      globeRef.current.rotation.x = 0.1;
    }
  });

  return (
    <group position={[-15, 0, -5]}>
      <group ref={globeRef}>
        {/* Inner solid sphere - gives it base volume but dark enough to not trigger bloom blowout */}
        <mesh>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#001133" transparent opacity={0.6} depthWrite={false} />
        </mesh>
        
        {/* Wireframe for lat/long grid lines (Holographic grid) */}
        <mesh>
          <sphereGeometry args={[8.1, 32, 16]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.15} wireframe toneMapped={false} />
        </mesh>

        {/* Outer Glowing Aura / Atmosphere Shield */}
        <mesh>
          <sphereGeometry args={[9.5, 32, 32]} />
          <meshBasicMaterial color="#0044ff" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        
        {/* Equatorial Holographic Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[11, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function SocialIcon({ icon, link, color }) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid rgba(255,255,255,0.1)`,
        transition: 'all 0.3s',
        textDecoration: 'none'
      }}
      onMouseOver={(e) => {
        // Parse color logic so cyan shadow uses cyan color, etc.
        e.currentTarget.style.background = `rgba(${color === '#fff' ? '255,255,255' : color === '#00ffff' ? '0,255,255' : '255,0,255'}, 0.2)`;
        e.currentTarget.style.boxShadow = `0 0 15px ${color}`;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      {icon}
    </a>
  );
}
