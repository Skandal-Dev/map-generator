import React, { useEffect, useState } from "react";

export default function TileSelector({ tileset, tileSize, selectedTile, setSelectedTile }) {
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!tileset) return;
    const img = new Image();
    img.src = tileset;
    img.onload = () => {
      const colsCount = Math.floor(img.width / tileSize);
      const rowsCount = Math.floor(img.height / tileSize);
      setCols(colsCount);
      setRows(rowsCount);
      setImageDims({ width: img.width, height: img.height });
      setImageLoaded(true);
    };
  }, [tileset, tileSize]);

  const handleSelect = (x, y) => {
    setSelectedTile({
      x,
      y,
      tileSize,
      tileset,
      imageWidth: imageDims.width,
      imageHeight: imageDims.height,
    });
  };

  if (!imageLoaded) {
    return <div>Chargement du tileset...</div>;
  }

  return (
    <div
      style={{
        border: "1px solid #888",
        padding: "5px",
        background: "#f9f9f9",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
          gap: "1px",
        }}
      >
        {Array.from({ length: rows }).map((_, y) =>
          Array.from({ length: cols }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              onMouseDown={() => handleSelect(x, y)}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundImage: `url(${tileset})`,
                backgroundSize: `${imageDims.width}px ${imageDims.height}px`,
                backgroundPosition: `-${x * tileSize}px -${y * tileSize}px`,
                border:
                  selectedTile && selectedTile.x === x && selectedTile.y === y
                    ? "2px solid blue"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
