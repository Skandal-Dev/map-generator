// MapGrid.jsx
import React, { useState } from "react";

export default function MapGrid({ mapData, setMapData, selectedTile, tileSize }) {
  const [isPainting, setIsPainting] = useState(false);
  const [rows, setRows] = useState(mapData?.height || 10);
  const [cols, setCols] = useState(mapData?.width || 10);
  const [collisionMode, setCollisionMode] = useState(false);

  if (!mapData.layers) mapData.layers = [];
  if (!mapData.collision) {
    // initialize collision layer if undefined
    mapData.collision = Array.from({ length: mapData.height }, () =>
      Array.from({ length: mapData.width }, () => 0)
    );
  }

  const handlePaintTile = (rowIdx, colIdx) => {
    if (!selectedTile || mapData.layers.length === 0) return;

    const newLayers = mapData.layers.map((layer, i) => {
      if (i !== mapData.activeLayer) return layer;
      const newData = layer.data.map((row, r) =>
        row.map((cell, c) =>
          r === rowIdx && c === colIdx ? { ...selectedTile } : cell
        )
      );
      return { ...layer, data: newData };
    });

    setMapData({ ...mapData, layers: newLayers });
  };

  const handlePaintCollision = (rowIdx, colIdx) => {
    const newCollision = mapData.collision.map((row, r) =>
      row.map((cell, c) =>
        r === rowIdx && c === colIdx ? (cell === 0 ? 1 : 0) : cell
      )
    );
    setMapData({ ...mapData, collision: newCollision });
  };

  const handleCellPaint = (rowIdx, colIdx) => {
    if (collisionMode) handlePaintCollision(rowIdx, colIdx);
    else handlePaintTile(rowIdx, colIdx);
  };

  const generateGrid = () => {
    const newLayers = [
      {
        name: "Layer 1",
        data: Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => null)
        ),
      },
    ];
    const newCollision = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
    setMapData({
      width: cols,
      height: rows,
      layers: newLayers,
      activeLayer: 0,
      collision: newCollision,
    });
  };

  const addLayer = () => {
    const newLayer = {
      name: `Layer ${mapData.layers.length + 1}`,
      data: Array.from({ length: mapData.height }, () =>
        Array.from({ length: mapData.width }, () => null)
      ),
    };
    setMapData({ ...mapData, layers: [...mapData.layers, newLayer] });
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(mapData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Contrôles */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Lignes:{" "}
          <input
            type="number"
            value={rows}
            min="1"
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Colonnes:{" "}
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
        <button onClick={addLayer} style={{ marginLeft: "10px" }}>
          Ajouter Layer
        </button>
        <button onClick={exportJSON} style={{ marginLeft: "10px" }}>
          Export JSON
        </button>
        <button
          onClick={() => setCollisionMode(!collisionMode)}
          style={{ marginLeft: "10px" }}
        >
          Mode Collisions: {collisionMode ? "ON" : "OFF"}
        </button>
      </div>

      {/* Sélecteur de layer */}
      <div style={{ marginBottom: "10px" }}>
        {mapData.layers.map((layer, i) => (
          <button
            key={i}
            style={{
              marginRight: "5px",
              fontWeight: i === mapData.activeLayer ? "bold" : "normal",
            }}
            onClick={() => setMapData({ ...mapData, activeLayer: i })}
          >
            {layer.name}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div
        style={{
          position: "relative",
          width: mapData.width * tileSize,
          height: mapData.height * tileSize,
        }}
        onMouseUp={() => setIsPainting(false)}
      >
        {/* Tiles */}
        {mapData.layers.map((layer, layerIdx) =>
          layer.data.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`tile-${layerIdx}-${r}-${c}`}
                style={{
                  width: tileSize,
                  height: tileSize,
                  boxSizing: "border-box",
                  border: "1px solid #ddd",
                  backgroundImage: cell
                    ? `url(${cell.tileset})`
                    : "none",
                  backgroundPosition: cell
                    ? `-${cell.x * tileSize}px -${cell.y * tileSize}px`
                    : "none",
                  position: "absolute",
                  top: r * tileSize,
                  left: c * tileSize,
                  zIndex: layerIdx,
                  pointerEvents: layerIdx === mapData.activeLayer && !collisionMode ? "auto" : "none",
                }}
                onMouseDown={() => {
                  setIsPainting(true);
                  handleCellPaint(r, c);
                }}
                onMouseEnter={() => isPainting && handleCellPaint(r, c)}
              />
            ))
          )
        )}

        {/* Collisions overlay */}
        {collisionMode &&
          mapData.collision.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`col-${r}-${c}`}
                style={{
                  width: tileSize,
                  height: tileSize,
                  position: "absolute",
                  top: r * tileSize,
                  left: c * tileSize,
                  backgroundColor: cell ? "rgba(255,0,0,0.5)" : "transparent",
                  border: "1px solid rgba(255,0,0,0.2)",
                  zIndex: mapData.layers.length + 1,
                  cursor: "crosshair",
                }}
                onMouseDown={() => {
                  setIsPainting(true);
                  handleCellPaint(r, c);
                }}
                onMouseEnter={() => isPainting && handleCellPaint(r, c)}
              />
            ))
          )}
      </div>
    </div>
  );
}
