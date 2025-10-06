// MapGrid.jsx
import React, { useState } from "react";
import "./MapGrid.css";

export default function MapGrid({
  tileset,
  tileSize,
  selectedTile,
  selectedEntity,
  mode,
  mapData,
  setMapData,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  // safe deep clone helper (structuredClone fallback)
  const cloneMap = (m) => {
    if (typeof structuredClone === "function") return structuredClone(m);
    return JSON.parse(JSON.stringify(m));
  };

  // action when clicking / painting a cell
  const handleCellAction = (x, y) => {
    const newMap = cloneMap(mapData);

    // ensure structures exist
    if (!Array.isArray(newMap.layers)) newMap.layers = [
      Array(newMap.height).fill(null).map(() => Array(newMap.width).fill(null)),
    ];
    if (!newMap.entityLayer) newMap.entityLayer = Array(newMap.height)
      .fill(null)
      .map(() => Array(newMap.width).fill(null));
    if (!newMap.collisions) newMap.collisions = Array(newMap.height)
      .fill(null)
      .map(() => Array(newMap.width).fill(0));

    if (mode === "tiles") {
      if (!selectedTile) return;
      // place the selectedTile object into the active layer
      newMap.layers[newMap.activeLayer][y][x] = selectedTile;
    } else if (mode === "collisions") {
      newMap.collisions[y][x] = newMap.collisions[y][x] === 1 ? 0 : 1;
    } else if (mode === "entities") {
      if (!selectedEntity) return;
      newMap.entityLayer[y][x] = selectedEntity;
    }

    setMapData(newMap);
  };

  // sizes for collision overlay container
  const overlayWidth = mapData.width * tileSize;
  const overlayHeight = mapData.height * tileSize;

  return (
    <div
      className="map-grid"
      style={{
        position: "relative",
        width: overlayWidth,
        height: overlayHeight,
        display: "grid",
        gridTemplateColumns: `repeat(${mapData.width}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${mapData.height}, ${tileSize}px)`,
        border: "1px solid #444",
        boxSizing: "content-box",
      }}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {/* -- CELLS -- (tiles + entities) */}
      {Array.from({ length: mapData.height }).map((_, y) =>
        Array.from({ length: mapData.width }).map((_, x) => {
          // find topmost tile across layers
          let tile = null;
          for (let l = 0; l < (mapData.layers?.length || 0); l++) {
            const layer = mapData.layers[l];
            if (!layer || !layer[y]) continue;
            const t = layer[y][x];
            if (t) tile = t;
          }

          const entity = mapData.entityLayer?.[y]?.[x] || null;

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
                boxSizing: "border-box",
                border: "1px solid #ccc",
                position: "relative",
                userSelect: "none",
                backgroundImage: tile ? `url(${tile.tileset || tileset})` : "none",
                backgroundSize: tile
                  ? `${tile.imageWidth || (tile.cols ? tile.cols * (tile.tileSize || tileSize) : tileSize)}px ${tile.imageHeight || (tile.rows ? tile.rows * (tile.tileSize || tileSize) : tileSize)}px`
                  : "none",
                backgroundPosition: tile
                  ? `-${(tile.x || 0) * (tile.tileSize || tileSize)}px -${(tile.y || 0) * (tile.tileSize || tileSize)}px`
                  : "none",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Entity overlay as child (below collisions) */}
              {entity && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${entity.entitySpritesheet})`,
                    backgroundSize: `${entity.cols * tileSize}px ${entity.rows * tileSize}px`,
                    backgroundPosition: `-${entity.x * tileSize}px -${entity.y * tileSize}px`,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })
      )}

      {/* -- COLLISION LAYER (ALWAYS ON TOP) -- */}
      <div
        className="collision-layer"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: overlayWidth,
          height: overlayHeight,
          pointerEvents: "none", // let clicks go through to the cells
          zIndex: 9999, // very high so collisions are always visible above entities
        }}
      >
        {Array.from({ length: mapData.height }).map((_, y) =>
          Array.from({ length: mapData.width }).map((_, x) => {
            const c = mapData.collisions?.[y]?.[x] || 0;
            if (!c) return null;
            return (
              <div
                key={`col-${x}-${y}`}
                style={{
                  position: "absolute",
                  left: x * tileSize,
                  top: y * tileSize,
                  width: tileSize,
                  height: tileSize,
                  background: "rgba(255,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: Math.max(10, tileSize / 3),
                  pointerEvents: "none",
                }}
              >
                X
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
