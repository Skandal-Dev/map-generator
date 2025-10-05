import React from "react";
import MapCanvas from "../components/MapCanvas";
import sampleMap from "../maps/sampleMap"; // ou inline

export default function Game() {
  // tileset: une image sprite contenant toutes les tiles (chaque tile = tileSize px)
  return (
    <div>
      <h2>Map</h2>
      <MapCanvas
        mapData={sampleMap}
        tilesetSrc="/assets/tileset.png"
        tilesetColumns={8}
        initialScale={1}
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
}
