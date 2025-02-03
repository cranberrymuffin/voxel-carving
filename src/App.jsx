import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";
import { SVD } from "ml-matrix";

export default function App() {
  const [points, setPoints] = useState({ img1: [], img2: [] });
  const [images, setImages] = useState({ img1: null, img2: null });
  const canvasRefs = { img1: useRef(null), img2: useRef(null) };

  const handleClick = (event, imgKey) => {
    if (points[imgKey].length >= 8) return;
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPoints((prev) => ({
      ...prev,
      [imgKey]: [...prev[imgKey], { x, y }],
    }));
  };

  useEffect(() => {
    Object.keys(canvasRefs).forEach((imgKey) => {
      const canvas = canvasRefs[imgKey].current;
      if (canvas && images[imgKey]) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = images[imgKey];
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          points[imgKey].forEach((point) => {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
          });
        };
      }
    });
  }, [points, images]);

  const handleImageUpload = (event, imgKey) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => ({ ...prev, [imgKey]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const computeFundamentalMatrix = () => {
    if (points.img1.length < 8 || points.img2.length < 8) {
      console.log("Need exactly 8 points in each image");
      return;
    }

    const A = points.img1.map((p1, i) => {
      const p2 = points.img2[i];
      return [
        p1.x * p2.x, p1.x * p2.y, p1.x,
        p1.y * p2.x, p1.y * p2.y, p1.y,
        p2.x, p2.y, 1
      ];
    });
    const svd = new SVD(A);
    const F = svd.rightSingularVectors.getColumn(svd.rightSingularVectors.columns - 1);
    // Reshape F to 3x3 matrix
    const FMatrix = math.reshape(F, [3, 3]);

    console.log(FMatrix);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(images).map((imgKey) => (
          <div key={imgKey} className="relative border">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, imgKey)}
              className="mb-2"
            />
            <canvas
              ref={canvasRefs[imgKey]}
              width={384}
              height={384}
              className="w-96 h-96 border"
              onClick={(e) => handleClick(e, imgKey)}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={computeFundamentalMatrix}
      >
        Compute Fundamental Matrix
      </button>
    </div>
  );
}
