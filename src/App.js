import React, { useState } from "react";
import MapGrid from "./components/MapGrid";
import TileSelector from "./components/TileSelector";
import tileset from "./tileset.jpg";

export default function App() {
  const tileSize = 32;

  const [mapData, setMapData] = useState({
    width: 10,
    height: 10,
    layers: [
      Array(10).fill(null).map(() => Array(10).fill(null)), // première layer
    ],
    collisions: Array(10).fill(null).map(() => Array(10).fill(0)),
    activeLayer: 0,
  });

  const [selectedTile, setSelectedTile] = useState(null);
  const [mode, setMode] = useState("tiles"); // "tiles" ou "collisions"

  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);

  // === Générer une nouvelle map ===
  const handleResize = () => {
    const newMap = {
      width,
      height,
      layers: [
        Array(height).fill(null).map(() => Array(width).fill(null)),
      ],
      collisions: Array(height).fill(null).map(() => Array(width).fill(0)),
      activeLayer: 0,
    };
    setMapData(newMap);
  };

  // === Export JSON ===
  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(mapData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "map.json");
    link.click();
  };

  // === Ajouter un layer ===
  const addLayer = () => {
    const newLayer = Array(mapData.height)
      .fill(null)
      .map(() => Array(mapData.width).fill(null));

    setMapData((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 1fr",
        height: "100vh",
        fontFamily: "sans-serif",
        background: "#d9d9d9",
        
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#ececec",
          borderBottom: "1px solid #aaa",
          padding: "20px",
          gap: "10px",

          margin: "10px",
            borderRadius: "5px",
        }}
      >
        <button onClick={() => setMode("tiles")}>🎨 Tiles</button>
        <button onClick={() => setMode("collisions")}>🚧 Collisions</button>
        <button onClick={addLayer}>➕ Layer</button>
        <button onClick={exportJSON}>💾 Export</button>

        {/* Dimensions inline dans la barre */}
        <label style={{ marginLeft: "20px" }}>
          Largeur:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Hauteur:
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </label>
        <button onClick={handleResize} style={{ marginLeft: "10px" }}>
          🔄 Générer
        </button>
      </div>

      {/* Main workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 200px" }}>
        {/* Sidebar gauche */}
        <div
          style={{
            background: "#f5f5f5",
            borderRight: "1px solid #aaa",
            padding: "10px",
            overflowY: "auto",
             margin: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>Tileset</h3>
          <TileSelector
            tileset={tileset}
            tileSize={tileSize}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
          />
        </div>

        {/* Zone principale */}
        <div
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #aaa",
            margin: "10px",
            borderRadius: "5px",
          }}
        >
          <MapGrid
            mapData={mapData}
            setMapData={setMapData}
            selectedTile={selectedTile}
            tileSize={tileSize}
            tileset={tileset}
            mode={mode}
          />
        </div>

        {/* Sidebar droite */}
        <div
          style={{
            background: "#f5f5f5",
            borderLeft: "1px solid #aaa",
            padding: "10px",
            margin: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>Propriétés</h3>
          <p>
            <b>Dimensions :</b> {mapData.width} x {mapData.height}
          </p>
          <p>
            <b>Layer actif :</b> {mapData.activeLayer + 1}
          </p>
          <p>
            <b>Mode :</b> {mode}
          </p>
        </div>
      </div>
    </div>
  );
}
