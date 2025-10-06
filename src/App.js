import React, { useState } from "react";
import MapGrid from "./components/MapGrid";
import TileSelector from "./components/TileSelector";
import EntitySelector from "./components/EntitySelector";
import defaultTileset from "./tileset.jpg";
import defaultEntities from "./tileset.jpg"; // ton spritesheet par défaut

export default function App() {
  const tileSize = 32;

  const [mapData, setMapData] = useState({
    width: 10,
    height: 10,
    layers: [
      Array(10).fill(null).map(() => Array(10).fill(null)), // première layer
    ],
    entityLayer: Array(10).fill(null).map(() => Array(10).fill(null)), // couche entités
    collisions: Array(10).fill(null).map(() => Array(10).fill(0)),
    activeLayer: 0,
  });

  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [mode, setMode] = useState("tiles"); // "tiles", "collisions", "entities"

  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [tileset, setTileset] = useState(defaultTileset);
  const [entitySpritesheet, setEntitySpritesheet] = useState(defaultEntities);

  // === Upload tileset ===
  const handleTilesetChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTileset(url);
    }
  };

  // === Upload spritesheet entités ===
  const handleEntitiesChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEntitySpritesheet(url);
    }
  };

  // === Générer une nouvelle map ===
  const handleResize = () => {
    const newMap = {
      width,
      height,
      layers: [
        Array(height).fill(null).map(() => Array(width).fill(null)),
      ],
      entityLayer: Array(height).fill(null).map(() => Array(width).fill(null)),
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
        <button onClick={() => setMode("entities")}>👤 Entités</button>
        <button onClick={addLayer}>➕ Layer</button>
        <button onClick={exportJSON}>💾 Export</button>

        {/* Upload tileset */}
        <input
          type="file"
          accept="image/*"
          onChange={handleTilesetChange}
          style={{ marginLeft: "20px" }}
        />
        {/* Upload entities */}
        <input
          type="file"
          accept="image/*"
          onChange={handleEntitiesChange}
          style={{ marginLeft: "10px" }}
        />

        {/* Dimensions inline */}
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
            width: "400px",
          }}
        >
          <h3>Tileset</h3>
          <TileSelector
            tileset={tileset}
            tileSize={tileSize}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
          />
          <h3 style={{ marginTop: "20px" }}>Entités / Décors</h3>
          <EntitySelector
            entitySpritesheet={entitySpritesheet}
            tileSize={tileSize}
            selectedEntity={selectedEntity}
            setSelectedEntity={setSelectedEntity}
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
            width: "936px",
            marginLeft: "240px",
          }}
        >
          <MapGrid
            mapData={mapData}
            setMapData={setMapData}
            selectedTile={selectedTile}
            selectedEntity={selectedEntity}
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
