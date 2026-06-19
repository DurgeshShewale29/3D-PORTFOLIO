import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldCheck, Cpu, Globe, Database, Award, Code, X, Cloud, Box, BrainCircuit, Server, Terminal, Network, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { ORBIT_ICONS } from '../../data/OrbitIcons';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const HEX_RADIUS = 6;
const HEX_APOTHEM = HEX_RADIUS * Math.sqrt(3) / 2;

export const CERT_ICONS = {
  ...ORBIT_ICONS,
  'Cloud': Cloud,
  'Database': Database,
  'Box': Box,
  'Brain': BrainCircuit,
  'Code': Code,
  'Grid': Layers,
  'Shield': ShieldCheck,
  'Globe': Globe,
  'Cpu': Cpu,
  'Server': Server,
  'Terminal': Terminal,
  'Network': Network
};

function Hexagon({ data, position, color, isBg, onSelect, isModalOpen }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  useCursor(!isBg && hovered);

  useFrame((state, delta) => {
    if (isBg) return;
    const targetZ = hovered ? 4 : 0;
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 8);
  });

  if (isBg) {
    return (
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.1, 6]} />
        <meshBasicMaterial color={color || "#00ffff"} transparent opacity={0.05} wireframe toneMapped={false} />
      </mesh>
    );
  }

  const IconComponent = CERT_ICONS[data.icon] || Award;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(data); }}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.4, 6]} />
        <meshBasicMaterial color={hovered ? color : '#0a192f'} transparent opacity={0.8} wireframe={!hovered} toneMapped={false} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[HEX_RADIUS * 0.95, HEX_RADIUS * 0.95, 0.45, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.4, 6]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>

      {/* FRONT FACE */}
      <Html transform position={[0, 0, 0.21]} scale={1.8} style={{ pointerEvents: 'none', transition: isModalOpen ? 'opacity 0.2s' : 'opacity 0.2s 0.4s', opacity: isModalOpen ? 0 : 1 }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '120px',
          color: '#fff', fontFamily: 'var(--font-mono)', textShadow: `0 0 10px ${color}`, position: 'relative'
        }}>
          <div style={{ color: color, marginBottom: '5px', filter: `drop-shadow(0 0 8px ${color})`, transition: 'transform 0.3s', transform: hovered ? 'scale(1.2)' : 'scale(1)' }}>
            <IconComponent size={32} />
          </div>
          <div style={{ fontSize: '0.6rem', fontWeight: 'bold', color: color, letterSpacing: '0.1em', textAlign: 'center', marginTop: '5px' }}>
            {data.issuer.toUpperCase()}
          </div>
        </div>
      </Html>

      {/* CRISP 2D TOOLTIP */}
      <Html center position={[0, -2, 0.5]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <AnimatePresence>
          {hovered && !isModalOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(5, 10, 20, 0.95)',
                border: `1px solid ${color}`,
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                color: '#fff',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: `0 0 15px ${color}60`,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase'
              }}
            >
              {data.name}
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  );
}

export default function CertificationsWall({ isBooted }) {
  const { certifications } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  // Convert Data URI to Blob URI so Chrome respects PDF viewer hash parameters (#view=Fit)
  useEffect(() => {
    if (selectedCert && selectedCert.imageUrl && selectedCert.imageUrl.startsWith('data:application/pdf')) {
      fetch(selectedCert.imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
        });
    } else {
      setPdfBlobUrl(null);
    }

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [selectedCert]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedCert) {
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  if (!isBooted) return null;

  const hexElements = [];
  let slotIndex = 1;

  // We loop from +R (top) to -R (bottom), and -C (left) to +C (right) for intuitive left-to-right reading flow
  for (let r = 3; r >= -3; r--) {
    for (let c = -4; c <= 4; c++) {

      const x = c * (1.5 * HEX_RADIUS);
      const y = r * 2 * HEX_APOTHEM + (Math.abs(c) % 2 === 1 ? HEX_APOTHEM : 0);

      // Calculate physical distance from the center of the grid for circular layer coloring
      const dist = Math.sqrt(x * x + y * y);
      const distRatio = dist / HEX_RADIUS;

      let hexColor = '#ffffff'; // Default Inner (White)
      if (distRatio < 2.5) {
        hexColor = '#ffffff'; // Inner layer
      } else if (distRatio < 5.5) {
        hexColor = '#00ff00'; // Middle layer (Neon Green)
      } else {
        hexColor = '#006600'; // Outer layer (Dark Emerald)
      }

      const certForSlot = certifications.find(cert => String(cert.slot || '32') === String(slotIndex));

      if (certForSlot) {
        hexElements.push(
          <Hexagon
            key={`fg-${c}-${r}`}
            data={certForSlot}
            position={[x, y, 0]}
            color={hexColor}
            onSelect={setSelectedCert}
            isModalOpen={!!selectedCert}
          />
        );
      } else {
        hexElements.push(
          <Hexagon
            key={`bg-${c}-${r}`}
            position={[x, y, -2]}
            isBg={true}
            color={hexColor}
          />
        );
      }
      slotIndex++;
    }
  }

  return (
    <group position={[450, -6, 0]}>
      {hexElements}

      <Html center position={[0, 0, 5]} zIndexRange={[100, 0]} style={{ pointerEvents: selectedCert ? 'auto' : 'none' }}>
        <AnimatePresence>
          {selectedCert && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* Massive Backdrop to cover the screen regardless of transform */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCert(null)}
                onWheel={(e) => e.stopPropagation()}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300vw', height: '300vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', cursor: 'pointer' }}
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                onWheel={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  width: '700px',
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  background: '#0a0f1e',
                  border: `1px solid #00f3ff`,
                  borderRadius: '12px',
                  padding: '30px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 0 40px rgba(0, 243, 255, 0.15)',
                  zIndex: 10
                }}
              >
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedCert(null)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ff00ff', cursor: 'pointer', zIndex: 11 }}
                >
                  <X size={24} />
                </motion.button>
                <h2 style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)', fontSize: '1.4rem', marginBottom: '5px', textAlign: 'center', letterSpacing: '1px', textShadow: '0 0 10px #00f3ff', paddingRight: '20px', paddingLeft: '20px' }}>
                  {selectedCert.name}
                </h2>
                <p style={{ color: '#888', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '15px' }}>
                  {selectedCert.issuer}
                </p>

                {selectedCert.imageUrl ? (
                  (() => {
                    const url = pdfBlobUrl || selectedCert.imageUrl;
                    const isPdfOrExternalDoc = url.startsWith('blob:') ||
                      url.startsWith('data:application/pdf') ||
                      url.toLowerCase().endsWith('.pdf') ||
                      url.includes('application/pdf') ||
                      url.includes('drive.google.com');

                    return isPdfOrExternalDoc ? (
                      <div className="pdf-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Document
                          file={url}
                          loading={<div style={{ color: '#00f3ff', fontFamily: 'var(--font-mono)', padding: '20px' }}>Loading Certificate...</div>}
                          error={<div style={{ color: '#ff0055', fontFamily: 'var(--font-mono)', padding: '20px' }}>Failed to load PDF.</div>}
                        >
                          <Page
                            pageNumber={1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            scale={2}
                            className="react-pdf-page-custom"
                          />
                        </Document>
                      </div>
                    ) : (
                      <div className="pdf-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <img src={url} alt={selectedCert.name} style={{ maxWidth: '100%', maxHeight: '60vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)' }} />
                      </div>
                    );
                  })()
                ) : (
                  <button style={{
                    background: 'transparent',
                    border: '1px dashed #ff00ff',
                    color: '#888',
                    padding: '15px 30px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    letterSpacing: '0.1em'
                  }}>
                    [ NO CERTIFICATE FILE PROVIDED ]
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Html>
    </group>
  );
}
