import React, { useRef, useEffect } from "react";

export default function MapGrid({ mapData, setMapData, selectedTile, tileset, tileSize }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = tileset;

    img.onload = () => {
      canvas.width = mapData[0].length * tileSize;
      canvas.height = mapData.length * tileSize;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner la map
      mapData.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            ctx.drawImage(
              img,
              cell.x * tileSize, // tuile X
              cell.y * tileSize, // tuile Y
              tileSize,
              tileSize,
              x * tileSize,
              y * tileSize,
              tileSize,
              tileSize
            );
          } else {
            ctx.fillStyle = "#fff";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            ctx.strokeStyle = "#ddd";
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
        });
      });
    };
  }, [mapData, tileset, tileSize]);

  const handleClick = (e) => {
    if (!selectedTile) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);

    const newData = mapData.map((row, rowIdx) =>
      row.map((cell, colIdx) =>
        rowIdx === y && colIdx === x ? selectedTile : cell
      )
    );
    setMapData(newData);
  };

  return (
    <div>
      <h3>Grille</h3>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />
    </div>
  );
}
