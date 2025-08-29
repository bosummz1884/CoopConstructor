import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Plane } from "@react-three/drei";
import { Mesh } from "three";
import { CoopConfig } from "@shared/types";

interface CoopModelProps {
  config: CoopConfig;
}

export default function CoopModel({ config }: CoopModelProps) {
  const mainStructureRef = useRef<Mesh>(null);
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
      <Plane 
        args={[20, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
      >
        <meshStandardMaterial color="#8db388" />
      </Plane>

      {/* Main structure */}
      <Box
        ref={mainStructureRef}
        args={[width, height, depth]}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={config.material === "metal" ? "#94a3b8" : "#d97706"} 
          opacity={hovered ? 0.8 : 1}
          transparent
        />
      </Box>

      {/* Roof */}
      {config.roofStyle === "gable" ? (
        <group position={[0, height + roofHeight / 2, 0]}>
          {/* Roof left */}
          <Box 
            args={[width + 0.5, 0.2, depth / 2]} 
            rotation={[0, 0, Math.PI / 6]}
            position={[0, 0, -depth / 4]}
          >
            <meshStandardMaterial color="#64748b" />
          </Box>
          {/* Roof right */}
          <Box 
            args={[width + 0.5, 0.2, depth / 2]} 
            rotation={[0, 0, -Math.PI / 6]}
            position={[0, 0, depth / 4]}
          >
            <meshStandardMaterial color="#64748b" />
          </Box>
        </group>
      ) : (
        <Box 
          args={[width + 0.5, 0.2, depth + 0.5]}
          position={[0, height + roofHeight / 2, 0]}
        >
          <meshStandardMaterial color="#64748b" />
        </Box>
      )}

      {/* Nesting boxes */}
      {config.nestingBox && (
        <group>
          {Array.from({ length: Math.ceil(config.chickens / 3) }).map((_, i) => (
            <Box
              key={i}
              args={[1, 1, 1]}
              position={[width / 2 + 0.6, 2 + i * 1.2, -depth / 2 + i * 1.5]}
            >
              <meshStandardMaterial color="#3b82f6" />
            </Box>
          ))}
        </group>
      )}

      {/* Roosting bars */}
      {config.roostingBar && (
        <group>
          {[0, 1.5].map((offset, i) => (
            <Box
              key={i}
              args={[width - 2, 0.1, 0.1]}
              position={[0, 2 + offset, depth / 4]}
            >
              <meshStandardMaterial color="#8b5cf6" />
            </Box>
          ))}
        </group>
      )}

      {/* Chicken run */}
      {config.chickenRun && (
        <group position={[width + 3, 0, 0]}>
          {/* Run floor */}
          <Plane 
            args={[width * 1.5, depth]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]}
          >
            <meshStandardMaterial color="#92a362" />
          </Plane>
          
          {/* Run fence */}
          {[
            [-width * 0.75, height / 2, -depth / 2],
            [width * 0.75, height / 2, -depth / 2],
            [-width * 0.75, height / 2, depth / 2],
            [width * 0.75, height / 2, depth / 2],
          ].map((pos, i) => (
            <Box
              key={i}
              args={i < 2 ? [width * 1.5, height, 0.1] : [0.1, height, depth]}
              position={pos as [number, number, number]}
            >
              <meshStandardMaterial color="#f97316" wireframe />
            </Box>
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
            <Box
              key={i}
              args={[0.6, 0.6, 0.3]}
              position={pos as [number, number, number]}
            >
              <meshStandardMaterial color="#1f2937" />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
}
