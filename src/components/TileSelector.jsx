import React, { useEffect, useState } from "react";

export default function TileSelector({ tileset, tileSize, onSelect }) {
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = tileset;
    img.onload = () => {
      const cols = Math.floor(img.width / tileSize);
      const rows = Math.floor(img.height / tileSize);
      const newTiles = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          newTiles.push({ x, y });
        }
      }
      setTiles(newTiles);
    };
  }, [tileset, tileSize]);

  const handleSelect = (tile) => {
    setSelected(tile);
    onSelect(tile);
  };

  return (
    <div style={{ marginRight: 20 }}>
      <h3>Tileset</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, ${tileSize + 10}px)`,
          gap: "10px",
          border: "1px solid #aaa",
          padding: "10px",
          background: "#eee",
          maxWidth: "400px",
          maxHeight: "800px",
            overflow: "auto",
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleSelect(tile)}
            style={{
              width: tileSize,
              height: tileSize,
              backgroundImage: `url(${tileset})`,
              backgroundPosition: `-${tile.x * tileSize}px -${tile.y * tileSize}px`,
              backgroundSize: "auto",
              border: selected === tile ? "2px solid red" : "1px solid #444",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
