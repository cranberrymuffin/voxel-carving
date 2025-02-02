import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";

const gridSize = 10;
const voxelSize = 1;

function generateVoxels() {
  let voxels = [];
  for (let x = -gridSize / 2; x < gridSize / 2; x++) {
    for (let y = -gridSize / 2; y < gridSize / 2; y++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        voxels.push({ position: [x * voxelSize, y * voxelSize, z * voxelSize], visible: true });
      }
    }
  }
  return voxels;
}

function getSilhouette(x, y, z) {
  const R = gridSize / 2.5;
  return x * x + y * y + z * z < R * R;
}

function Voxel({ position, visible }) {
  return (
    visible && (
      <mesh position={position}>
        <boxGeometry args={[voxelSize, voxelSize, voxelSize]} />
        <meshStandardMaterial color="white" />
      </mesh>
    )
  );
}

function VoxelGrid() {
  const [voxels, setVoxels] = useState(generateVoxels());

  useEffect(() => {
    setVoxels((prevVoxels) =>
      prevVoxels.map((voxel) => ({
        ...voxel,
        visible: getSilhouette(...voxel.position),
      }))
    );

  }, []);

  return voxels.map((voxel, i) => <Voxel key={i} position={voxel.position} visible={voxel.visible} />);
}

export default function App() {
  return (
    <Canvas camera={{ position: [15, 15, 15] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <VoxelGrid />
      <OrbitControls />
    </Canvas>
  );
}
