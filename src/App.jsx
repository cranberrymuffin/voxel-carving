import { useEffect, useState } from "react";

// Utility to parse the matrices from _par file
const parseMatrix = (data) => {
  const matrix = data.split(' ').map(Number);
  return {
    intrinsic: matrix.slice(1, 10),  // 3x3 intrinsic matrix
    rotation: matrix.slice(10, 19),  // 3x3 rotation matrix
    translation: matrix.slice(19, 22), // 3x1 translation vector
  };
};

// Utility to parse the angles from _ang file
const parseAngles = (data) => {
  const angles = data.split(' ').map(Number);
  return {
    latitude: angles[0], // assuming first value is latitude
    longitude: angles[1], // assuming second value is longitude
  };
};

export default function App() {
  const [cameraData, setCameraData] = useState([]);

  useEffect(() => {
    // Fetch the camera parameters from the 'temple_par.txt' file
    fetch('/temple/temple_par.txt')
      .then((response) => response.text())
      .then((rawData) => {
        const lines = rawData.split('\n');
        const parsedData = new Map();
        lines.forEach((line) => {
          const parts = line.split(' ');
          const imgName = parts[0];
          const matrixData = parseMatrix(parts.join(' '));
          if(imgName.includes('.png'))
            parsedData.set(imgName, matrixData);
        });
        console.log(parsedData)
        setCameraData(parsedData);
      })
      .catch((error) => {
        console.error('Error loading camera data:', error);
      });
  }, []);

  return (
    <div>
      hello
    </div>
  );
}
