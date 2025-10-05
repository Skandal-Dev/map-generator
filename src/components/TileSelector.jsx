import React from "react";

export default function TileSelector({ tileset, tileSize, selectedTile, setSelectedTile }) {
  const columns = 8; // nombre de colonnes dans le tileset
  const rows = 8; // nombre de lignes dans le tileset

  const tiles = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      tiles.push({ x, y, tileset });
    }
  }

  return (
    <div>
      <h3>Tileset</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${tileSize}px)`,
          gridGap: "2px",
          border: "1px solid #888",
          padding: "5px",
        }}
      >
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            style={{
              width: tileSize,
              height: tileSize,
              backgroundImage: `url(${tileset})`,
              backgroundPosition: `-${tile.x * tileSize}px -${tile.y * tileSize}px`,
              border: tile === selectedTile ? "2px solid red" : "1px solid #ccc",
              cursor: "pointer",
            }}
            onMouseDown={() => setSelectedTile(tile)}
          />
        ))}
      </div>
    </div>
  );
}
