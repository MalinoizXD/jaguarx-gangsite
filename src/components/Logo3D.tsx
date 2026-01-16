'use client'

import { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Group } from 'three'

function LogoModel({ onLoaded }: { onLoaded?: () => void }) {
    const groupRef = useRef<Group>(null)
    const { scene } = useGLTF('/logo.glb')

    useEffect(() => {
        onLoaded?.()
    }, [onLoaded])

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.5
        }
    })

    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={2} position={[0, -1.9, 0]} />
        </group>
    )
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#333" wireframe />
        </mesh>
    )
}

export default function Logo3D({ onLoaded }: { onLoaded?: () => void }) {
    return (
        <div className="w-full h-[300px] md:h-[400px]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, -5]} intensity={0.5} />

                <Suspense fallback={<LoadingFallback />}>
                    <LogoModel onLoaded={onLoaded} />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    )
}

useGLTF.preload('/logo.glb')
