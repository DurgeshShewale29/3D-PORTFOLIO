import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

const targetVector = new THREE.Vector3();

export default function DataCoreScene({ isBooted, setActiveView }) {
  const groupRef = useRef();
  const innerCoreRef = useRef();
  const wireframeRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    // Core Entrance Animation
    const targetScale = isBooted ? 0.85 : 0;
    targetVector.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(targetVector, delta * 4);

    // Core floating
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2 - 0.4;
    
    // Rotations
    innerCoreRef.current.rotation.y += delta * 0.2;
    wireframeRef.current.rotation.x -= delta * 0.1;
    wireframeRef.current.rotation.y += delta * 0.15;
    
    ring1Ref.current.rotation.x += delta * 0.5;
    ring1Ref.current.rotation.y += delta * 0.2;
    
    ring2Ref.current.rotation.x -= delta * 0.3;
    ring2Ref.current.rotation.z += delta * 0.4;

    ring3Ref.current.rotation.y -= delta * 0.6;
    ring3Ref.current.rotation.x += delta * 0.1;
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.4, 0]} 
      scale={0}
      onClick={(e) => { e.stopPropagation(); setActiveView('ABOUT'); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { document.body.style.cursor = 'default'; }}
    >

      {/* Inner Glowing Singularity */}
      <Sphere ref={innerCoreRef} args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#00f3ff"
          emissiveIntensity={3}
          distort={0.2}
          speed={4}
          roughness={0}
        />
      </Sphere>

      {/* Cybernetic Wireframe Shell */}
      <Sphere ref={wireframeRef} args={[2.2, 24, 24]}>
        <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.3} toneMapped={false} />
      </Sphere>
      
      {/* Outer faint energy shield */}
      <Sphere args={[2.5, 32, 32]}>
        <meshStandardMaterial color="#00f3ff" transparent opacity={0.05} depthWrite={false} />
      </Sphere>

      {/* Complex Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ff00ff" toneMapped={false} />
        {/* Glowing node on ring */}
        <mesh position={[3.2, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" toneMapped={false} />
        <mesh position={[-4.5, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </mesh>

      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[5.5, 0.03, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.3} toneMapped={false} />
      </mesh>

      <pointLight distance={20} intensity={5} color="#00f3ff" />
    </group>
  );
}
