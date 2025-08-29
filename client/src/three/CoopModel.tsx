import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { CoopConfig } from "@shared/types";
import * as THREE from "three";

interface CoopModelProps {
  config: CoopConfig;
}

export default function CoopModel({ config }: CoopModelProps) {
  const mainStructureRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (mainStructureRef.current) {
      mainStructureRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Calculate dimensions based on size
  const dimensions = {
    small: { width: 6, depth: 4, height: 6 },
    medium: { width: 8, depth: 6, height: 7 },
    large: { width: 10, depth: 8, height: 8 }
  };

  const { width, depth, height } = dimensions[config.size];
  const roofHeight = config.roofStyle === "flat" ? 0.5 : 2;

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8db388" />
      </mesh>

      {/* Main structure */}
      <mesh
        ref={mainStructureRef}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={config.material === "metal" ? "#94a3b8" : "#d97706"} 
          opacity={hovered ? 0.8 : 1}
          transparent
        />
      </mesh>

      {/* Roof */}
      {config.roofStyle === "gable" ? (
        <group position={[0, height + roofHeight / 2, 0]}>
          {/* Roof left */}
          <mesh rotation={[0, 0, Math.PI / 6]} position={[0, 0, -depth / 4]}>
            <boxGeometry args={[width + 0.5, 0.2, depth / 2]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Roof right */}
          <mesh rotation={[0, 0, -Math.PI / 6]} position={[0, 0, depth / 4]}>
            <boxGeometry args={[width + 0.5, 0.2, depth / 2]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, height + roofHeight / 2, 0]}>
          <boxGeometry args={[width + 0.5, 0.2, depth + 0.5]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      )}

      {/* Nesting boxes */}
      {config.nestingBox && (
        <group>
          {Array.from({ length: Math.ceil(config.chickens / 3) }).map((_, i) => (
            <mesh
              key={i}
              position={[width / 2 + 0.6, 2 + i * 1.2, -depth / 2 + i * 1.5]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          ))}
        </group>
      )}

      {/* Roosting bars */}
      {config.roostingBar && (
        <group>
          {[0, 1.5].map((offset, i) => (
            <mesh
              key={i}
              position={[0, 2 + offset, depth / 4]}
            >
              <boxGeometry args={[width - 2, 0.1, 0.1]} />
              <meshStandardMaterial color="#8b5cf6" />
            </mesh>
          ))}
        </group>
      )}

      {/* Chicken run */}
      {config.chickenRun && (
        <group position={[width + 3, 0, 0]}>
          {/* Run floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[width * 1.5, depth]} />
            <meshStandardMaterial color="#92a362" />
          </mesh>
          
          {/* Run fence */}
          {[
            [-width * 0.75, height / 2, -depth / 2],
            [width * 0.75, height / 2, -depth / 2],
            [-width * 0.75, height / 2, depth / 2],
            [width * 0.75, height / 2, depth / 2],
          ].map((pos, i) => (
            <mesh
              key={i}
              position={pos as [number, number, number]}
            >
              <boxGeometry args={i < 2 ? [width * 1.5, height, 0.1] : [0.1, height, depth]} />
              <meshStandardMaterial color="#f97316" wireframe />
            </mesh>
          ))}
        </group>
      )}

      {/* Wheels */}
      {config.wheels && (
        <group>
          {[
            [-width / 2 + 0.5, -0.5, -depth / 2 + 0.5],
            [width / 2 - 0.5, -0.5, -depth / 2 + 0.5],
            [-width / 2 + 0.5, -0.5, depth / 2 - 0.5],
            [width / 2 - 0.5, -0.5, depth / 2 - 0.5],
          ].map((pos, i) => (
            <mesh
              key={i}
              position={pos as [number, number, number]}
            >
              <boxGeometry args={[0.6, 0.6, 0.3]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
