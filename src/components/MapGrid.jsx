import React, { useRef, useEffect, useState } from "react";

export default function MapGrid({ mapData, setMapData, selectedTile, tileset, tileSize }) {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [rows, setRows] = useState(mapData.length);
  const [cols, setCols] = useState(mapData[0].length);

  // === Dessin du canvas ===
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
              cell.x * tileSize, // coord X dans tileset
              cell.y * tileSize, // coord Y dans tileset
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

  // === Fonction peinture ===
  const paintTile = (e) => {
    if (!selectedTile) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);

    if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[0].length) return;

    setMapData((prev) =>
      prev.map((row, rowIdx) =>
        row.map((cell, colIdx) =>
          rowIdx === y && colIdx === x ? selectedTile : cell
        )
      )
    );
  };

  // === Events souris ===
  const handleMouseDown = (e) => {
    setIsPainting(true);
    paintTile(e);
  };

  const handleMouseMove = (e) => {
    if (isPainting) {
      paintTile(e);
    }
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  // === Génération nouvelle grille ===
  const generateGrid = () => {
    const newMap = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );
    setMapData(newMap);
  };

  return (
    <div>
      <h3>Grille</h3>

      {/* Formulaire de génération */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Lignes :{" "}
          <input
            type="number"
            value={rows}
            min="1"
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Colonnes :{" "}
          <input
            type="number"
            value={cols}
            min="1"
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </label>
        <button onClick={generateGrid} style={{ marginLeft: "10px" }}>
          Générer
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />
    </div>
  );
}
