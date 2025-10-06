import React, { useState, useEffect } from "react";

export default function EntitySelector({ entitySpritesheet, tileSize, selectedEntity, setSelectedEntity }) {
  const [cols, setCols] = useState(8);
  const [rows, setRows] = useState(8);

  // Charger l'image pour détecter colonnes / lignes
  useEffect(() => {
    const img = new Image();
    img.src = entitySpritesheet;
    img.onload = () => {
      setCols(Math.floor(img.width / tileSize));
      setRows(Math.floor(img.height / tileSize));
    };
  }, [entitySpritesheet, tileSize]);

  const handleSelect = (x, y) => {
    setSelectedEntity({ x, y, entitySpritesheet, cols, rows });
  };

  return (
    <div
      style={{
        border: "1px solid #888",
        padding: "5px",
        background: "#f9f9f9",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
          gap: "2px",
        }}
      >
        {Array.from({ length: rows }).map((_, y) =>
          Array.from({ length: cols }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              onMouseDown={() => handleSelect(x, y)}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundImage: `url(${entitySpritesheet})`,
                backgroundSize: `${cols * tileSize}px ${rows * tileSize}px`,
                backgroundPosition: `-${x * tileSize}px -${y * tileSize}px`,
                border:
                  selectedEntity && selectedEntity.x === x && selectedEntity.y === y
                    ? "2px solid red"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
