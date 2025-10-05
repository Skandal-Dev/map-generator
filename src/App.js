import React, { useState } from "react";
import MapGrid from "./components/MapGrid";
import TileSelector from "./components/TileSelector";
import tileset from "./tileset.jpg"; // ton tileset

export default function App() {
  const tileSize = 32;

  // mapData: width, height, layers[], activeLayer
  const [mapData, setMapData] = useState({
    width: 10,
    height: 10,
    layers: [],
    activeLayer: 0,
  });

  const [selectedTile, setSelectedTile] = useState(null);

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <TileSelector
        tileset={tileset}
        tileSize={tileSize}
        selectedTile={selectedTile}
        setSelectedTile={setSelectedTile}
      />
      <MapGrid
        mapData={mapData}
        setMapData={setMapData}
        selectedTile={selectedTile}
        tileSize={tileSize}
      />
    </div>
  );
}
