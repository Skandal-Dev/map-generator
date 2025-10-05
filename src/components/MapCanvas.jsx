// MapCanvas.jsx
import React from "react";

export default function MapCanvas({ mapData, tileSize, tileset }) {
  if (!mapData || !mapData.layers) return null;

  const tilesetUrl = tileset;

  return (
    <div
      style={{
        position: "relative",
        width: mapData.width * tileSize,
        height: mapData.height * tileSize,
        border: "1px solid #888",
      }}
    >
      {mapData.layers.map((layer, lIdx) => (
        <div
          key={lIdx}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${mapData.width}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${mapData.height}, ${tileSize}px)`,
            pointerEvents: "none", // pour éviter d'interférer avec MapGrid
          }}
        >
          {layer.data.flat().map((cell, idx) => {
            if (!cell) return <div key={idx} style={{ width: tileSize, height: tileSize }} />;
            const { x, y } = cell; // coordonnées dans le tileset
            return (
              <div
                key={idx}
                style={{
                  width: tileSize,
                  height: tileSize,
                  backgroundImage: `url(${tilesetUrl})`,
                  backgroundPosition: `-${x * tileSize}px -${y * tileSize}px`,
                  backgroundSize: "auto",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
