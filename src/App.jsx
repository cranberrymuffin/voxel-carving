import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const gridSize = 10;
const voxelSize = 1;


function isVisible(x, y, z) {
  const R = gridSize / 2.5;
  return x * x + y * y + z * z < R * R;
}

function generateVoxels() {
  let voxels = [];
  for (let x = -gridSize / 2; x < gridSize / 2; x++) {
    for (let y = -gridSize / 2; y < gridSize / 2; y++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        if (isVisible(x, y, z)) {
          voxels.push([x * voxelSize, y * voxelSize, z * voxelSize]);
        }
      }
    }
  }
  return voxels;
}

function Voxel({ position }) {
  return (
      <mesh position={position}>
        <boxGeometry args={[voxelSize, voxelSize, voxelSize]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
  );
}

function VoxelGrid() {
  return generateVoxels().map((voxel, i) => <Voxel key={i} position={voxel} />);
}

export default function App() {
  const baseUrl = import.meta.env.VITE_EXAMPLE || 'garbage';
  console.log("xyz " + baseUrl)

  return (
    <Canvas camera={{ position: [15, 15, 15] }}>
      <color attach="background" args={['pink']} />
      <ambientLight intensity={1} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
      />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={1}
        castShadow
      />
      <directionalLight
        position={[-10, 10, 10]}
        intensity={1}
        castShadow
      />
      <directionalLight
        position={[10, 10, -10]}
        intensity={1} // Brightness of the light
        castShadow
      />      <VoxelGrid />
      <OrbitControls />
    </Canvas>
  );
}
