import React, { useState } from "react";
import TileSelector from "./components/TileSelector";
import MapGrid from "./components/MapGrid";
import tileset from "./tileset.jpg"; // ⚠️ ajoute ton tileset ici

export default function App() {
  const [selectedTile, setSelectedTile] = useState(null);
  const [mapData, setMapData] = useState(
    Array(10).fill(null).map(() => Array(10).fill(null)) // map vide 10x10
  );

  return (
    <div style={{ display: "flex" }}>
      <TileSelector tileset={tileset} tileSize={32} onSelect={setSelectedTile} />
      <MapGrid
        mapData={mapData}
        setMapData={setMapData}
        selectedTile={selectedTile}
        tileset={tileset}
        tileSize={32}
      />
    </div>
  );
}
