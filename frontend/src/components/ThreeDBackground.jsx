import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'

function FloatingGeometries() {
  const group = useRef()
  
  useFrame(() => {
    if (group.current) {
      group.current.rotation.x += 0.001
      group.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={group}>
      {/* Floating boxes */}
      <mesh position={[-5, 2, -5]} scale={[2, 2, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a5f23" wireframe />
      </mesh>
      
      <mesh position={[5, 1, -8]} scale={[1.5, 1.5, 1.5]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2d4620" wireframe />
      </mesh>

      {/* Floating spheres */}
      <mesh position={[0, 3, -10]} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4a7c3b" wireframe />
      </mesh>

      <mesh position={[8, -2, -5]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#5a8c4b" wireframe />
      </mesh>

      {/* Central rotating cube */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#3a5f23" opacity={0.3} transparent wireframe />
      </mesh>
    </group>
  )
}

export default function ThreeDBackground() {
  return (
    <Canvas 
      camera={{ position: [0, 8, 25], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.4} color="#3a5f23" />
      
      <FloatingGeometries />
      
      <ContactShadows position={[0, -8, 0]} scale={30} blur={8} far={15} opacity={0.3} />
      
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={1.5}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}
