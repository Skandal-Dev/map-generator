import React, { useState } from "react";
import "./MapGrid.css";

export default function MapGrid({ tileSize, selectedTile, mode, mapData, setMapData }) {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCellAction = (x, y) => {
    const newMap = { ...mapData };

    if (mode === "tiles") {
      newMap.layers[newMap.activeLayer][y][x] = selectedTile;
    } else if (mode === "collisions") {
      newMap.collisions[y][x] = newMap.collisions[y][x] === 1 ? 0 : 1;
    }

    setMapData(newMap);
  };

  return (
    <div
      className="map-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${mapData.width}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${mapData.height}, ${tileSize}px)`,
        border: "1px solid #444",
      }}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {Array.from({ length: mapData.height }).map((_, y) =>
        Array.from({ length: mapData.width }).map((_, x) => {
          let tile = null;

          for (let l = 0; l < mapData.layers.length; l++) {
            const t = mapData.layers[l][y][x];
            if (t) tile = t;
          }

          const collision = mapData.collisions?.[y]?.[x] || 0;

          return (
            <div
              key={`${x}-${y}`}
              className="map-cell"
              onMouseDown={() => {
                setIsDrawing(true);
                handleCellAction(x, y);
              }}
              onMouseEnter={() => {
                if (isDrawing) handleCellAction(x, y);
              }}
              onMouseUp={() => setIsDrawing(false)}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundImage: tile
                  ? `url(${tile.tileset})`
                  : "linear-gradient(45deg, #eee, #ddd)",
                backgroundSize: tile
                  ? `${tile.cols * tileSize}px ${tile.rows * tileSize}px`
                  : "none",
                backgroundPosition: tile
                  ? `-${tile.x * tileSize}px -${tile.y * tileSize}px`
                  : "none",
                border: "1px solid #ccc",
                position: "relative",
                userSelect: "none",
              }}
            >
              {collision === 1 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  X
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
