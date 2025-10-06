import React, { useState } from "react";
import "./MapGrid.css";

export default function MapGrid({ tileset, tileSize, selectedTile, selectedEntity, mode, mapData, setMapData }) {
  const [isDrawing, setIsDrawing] = useState(false);

  // === Dessin sur la grille ===
  const handleCellAction = (x, y) => {
    const newMap = structuredClone(mapData);

    if (mode === "tiles" && selectedTile) {
      newMap.layers[newMap.activeLayer][y][x] = selectedTile;
    } 
    else if (mode === "collisions") {
      newMap.collisions[y][x] = newMap.collisions[y][x] === 1 ? 0 : 1;
    } 
    else if (mode === "entities" && selectedEntity) {
      newMap.entityLayer[y][x] = selectedEntity;
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
          const entity = mapData.entityLayer?.[y]?.[x];

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
                backgroundImage: tile ? `url(${tile.tileset})` : "linear-gradient(45deg, #eee, #ddd)",
                backgroundSize: tile
                  ? `${tile.imageWidth}px ${tile.imageHeight}px`
                  : "cover",
                backgroundPosition: tile
                  ? `-${tile.x * tile.tileSize}px -${tile.y * tile.tileSize}px`
                  : "none",
                border: "1px solid #ccc",
                position: "relative",
                userSelect: "none",
              }}
            >
              {/* Collision overlay */}
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
                    zIndex: 5,
                  }}
                >
                  X
                </div>
              )}

              {/* Entity overlay */}
              {entity && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${entity.entitySpritesheet})`,
                    backgroundSize: `${entity.cols * tileSize}px ${entity.rows * tileSize}px`,
                    backgroundPosition: `-${entity.x * tileSize}px -${entity.y * tileSize}px`,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
