// client/src/components/MapCanvas.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";

export default function MapCanvas({
  mapData,
  tilesetSrc,
  tilesetColumns = 8,
  scale: initialScale = 1,
  style = { width: "600px", height: "600px", border: "1px solid #888" },
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [camera, setCamera] = useState({ x: 0, y: 0, scale: initialScale });

  // --- 1) Draw function placé AVANT son usage ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, w, h);

    if (!mapData || !mapData.layers || !img) {
      ctx.fillStyle = "#fff";
      ctx.fillText("Chargement...", 20, 30);
      return;
    }

    const { tileSize, width: mapCols, height: mapRows, layers } = mapData;
    const camScale = camera.scale;

    for (let layer of layers) {
      for (let r = 0; r < mapRows; r++) {
        for (let c = 0; c < mapCols; c++) {
          const tileId = layer.data[r][c];
          if (!tileId) continue;
          const tid = tileId - 1;
          const sx = (tid % tilesetColumns) * tileSize;
          const sy = Math.floor(tid / tilesetColumns) * tileSize;
          const dx = (c * tileSize - camera.x) * camScale;
          const dy = (r * tileSize - camera.y) * camScale;
          const dSize = tileSize * camScale;
          ctx.drawImage(img, sx, sy, tileSize, tileSize, dx, dy, dSize, dSize);
        }
      }
    }
  }, [camera, mapData, tilesetColumns]);

  // --- 2) Charger tileset ---
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
    img.src = tilesetSrc;
  }, [tilesetSrc, draw]);

  // --- 3) Resize canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // --- 4) Redraw on camera change ---
  useEffect(() => {
    draw();
  }, [camera, draw]);

  return <canvas ref={canvasRef} style={style} />;
}
