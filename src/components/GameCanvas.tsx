import { useEffect, useRef } from "react";
import type { GameState } from "../types/game";
import {
  GRID_ROWS,
  GRID_COLS,
  CELL_SIZE,
  getSeasonConfig,
  getMowerConfig,
} from "../utils/gameUtils";

interface GameCanvasProps {
  gameState: GameState;
}

export function GameCanvas({ gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = GRID_COLS * CELL_SIZE;
    const height = GRID_ROWS * CELL_SIZE;
    const seasonCfg = getSeasonConfig(gameState.season);
    const mowerCfg = getMowerConfig(gameState.mowerType);

    ctx.clearRect(0, 0, width, height);

    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const cell = gameState.grid[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        if (cell.type === "path") {
          ctx.fillStyle =
            y % 2 === 0 ? seasonCfg.pathColors[0] : seasonCfg.pathColors[1];
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.fillStyle = "rgba(0,0,0,0.05)";
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(px + 4 + i * 10, py + CELL_SIZE / 2 - 1, 6, 2);
          }
          if (gameState.season === "winter") {
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.fillRect(px, py, CELL_SIZE, 3);
          }
        } else if (cell.type === "flower") {
          const baseColor =
            (x + y) % 2 === 0
              ? seasonCfg.grassColors[1]
              : seasonCfg.grassColors[2];
          ctx.fillStyle = baseColor;
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          const cx = px + CELL_SIZE / 2;
          const cy = py + CELL_SIZE / 2;
          const petalColor =
            (x * 3 + y * 7) % 3 === 0
              ? seasonCfg.flowerColor
              : seasonCfg.flowerAltColor;

          if (gameState.season === "winter") {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          }

          ctx.fillStyle = petalColor;
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const petalX = cx + Math.cos(angle) * 6;
            const petalY = cy + Math.sin(angle) * 6;
            ctx.beginPath();
            ctx.arc(petalX, petalY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = "#FFEB3B";
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fill();

          if (gameState.season === "winter") {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.beginPath();
            ctx.arc(cx - 5, cy - 8, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx + 5, cy - 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (cell.type === "grass") {
          const h = cell.grassHeight;
          const colors = seasonCfg.grassColors;
          if (h === 3) {
            ctx.fillStyle = colors[0];
          } else if (h === 2) {
            ctx.fillStyle = colors[1];
          } else {
            ctx.fillStyle = colors[2];
          }
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          if (gameState.season === "autumn") {
            ctx.fillStyle = "rgba(139, 69, 19, 0.1)";
            for (let i = 0; i < 3; i++) {
              const lx = px + 5 + ((x * 7 + y * 3 + i * 13) % (CELL_SIZE - 10));
              const ly =
                py + 8 + ((x * 5 + y * 11 + i * 17) % (CELL_SIZE - 16));
              ctx.beginPath();
              ctx.ellipse(lx, ly, 3, 1.5, i * 0.7, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.fillStyle = seasonCfg.grassStalkColor;
          const seed = x * 13 + y * 7;
          const stalkCount = gameState.season === "winter" ? 2 + h : 4 + h;
          for (let i = 0; i < stalkCount; i++) {
            const gx = px + 3 + ((seed + i * 11) % (CELL_SIZE - 6));
            const gy = py + 4 + ((seed * 3 + i * 7) % (CELL_SIZE - 8));
            const stalkHeight = gameState.season === "winter" ? 2 + h : 3 + h;
            ctx.fillRect(gx, gy, 1, stalkHeight);
          }

          if (gameState.season === "winter") {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            for (let i = 0; i < 4; i++) {
              const sx = px + ((seed * 2 + i * 9) % CELL_SIZE);
              const sy = py + ((seed * 5 + i * 7) % CELL_SIZE);
              ctx.beginPath();
              ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (cell.type === "mowed") {
          const isEvenRow = (cell.mowedRow ?? y) % 2 === 0;
          const isEvenCol = (cell.mowedCol ?? x) % 2 === 0;
          const mColors = seasonCfg.mowedColors;

          if (isEvenRow) {
            ctx.fillStyle = isEvenCol ? mColors[0] : mColors[1];
          } else {
            ctx.fillStyle = isEvenCol ? mColors[1] : mColors[2];
          }
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          if (gameState.season === "winter") {
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
          } else {
            ctx.strokeStyle = "rgba(255,255,255,0.08)";
          }
          ctx.lineWidth = 1;
          for (let i = 0; i < CELL_SIZE; i += 4) {
            ctx.beginPath();
            ctx.moveTo(px, py + i);
            ctx.lineTo(px + CELL_SIZE, py + i);
            ctx.stroke();
          }

          if (gameState.season === "autumn") {
            ctx.fillStyle = "rgba(139, 94, 52, 0.06)";
            ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          }
        }

        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
      }
    }

    const mower = gameState.mower;
    const mx = mower.x * CELL_SIZE;
    const my = mower.y * CELL_SIZE;
    const cx = mx + CELL_SIZE / 2;
    const cy = my + CELL_SIZE / 2;

    ctx.save();
    ctx.translate(cx, cy);

    let rotation = 0;
    switch (mower.direction) {
      case "right":
        rotation = 0;
        break;
      case "down":
        rotation = Math.PI / 2;
        break;
      case "left":
        rotation = Math.PI;
        break;
      case "up":
        rotation = -Math.PI / 2;
        break;
    }
    ctx.rotate(rotation);

    const mowerWidth = mowerCfg.width;
    const bladeLength = CELL_SIZE * (0.8 + (mowerWidth - 1) * 0.9);
    const bladeHalfWidth = bladeLength / 2;

    ctx.fillStyle = "#9E9E9E";
    ctx.fillRect(-bladeHalfWidth + 2, -5, bladeLength - 4, 10);

    ctx.strokeStyle = "#757575";
    ctx.lineWidth = 1;
    for (let i = 0; i < mowerWidth; i++) {
      const offset =
        -bladeHalfWidth +
        4 +
        i * ((bladeLength - 8) / Math.max(1, mowerWidth - 1 || 1));
      ctx.beginPath();
      ctx.moveTo(offset, -5);
      ctx.lineTo(offset, 5);
      ctx.stroke();
    }

    const bodyWidth = CELL_SIZE * (0.6 + (mowerWidth - 1) * 0.5);
    const bodyHalfWidth = bodyWidth / 2;

    ctx.fillStyle = mowerCfg.color;
    ctx.fillRect(
      -bodyHalfWidth + 4,
      -CELL_SIZE / 3,
      bodyWidth - 8,
      (CELL_SIZE * 2) / 3,
    );

    ctx.fillStyle = mowerCfg.darkColor;
    ctx.fillRect(-bodyHalfWidth + 4, CELL_SIZE / 3 - 4, bodyWidth - 8, 4);

    ctx.fillStyle = "#37474F";
    ctx.beginPath();
    ctx.arc(-bodyHalfWidth + 6, -CELL_SIZE / 3 + 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-bodyHalfWidth + 6, CELL_SIZE / 3 - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    if (mowerWidth > 1) {
      ctx.beginPath();
      ctx.arc(bodyHalfWidth - 10, -CELL_SIZE / 3 + 3, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bodyHalfWidth - 10, CELL_SIZE / 3 - 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#546E7A";
    ctx.beginPath();
    ctx.arc(-bodyHalfWidth + 6, -CELL_SIZE / 3 + 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-bodyHalfWidth + 6, CELL_SIZE / 3 - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    if (mowerWidth > 1) {
      ctx.beginPath();
      ctx.arc(bodyHalfWidth - 10, -CELL_SIZE / 3 + 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bodyHalfWidth - 10, CELL_SIZE / 3 - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#FFF";
    ctx.font = `bold ${10 + mowerWidth * 2}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(mowerCfg.icon, 0, 0);

    ctx.restore();
  }, [gameState]);

  const seasonCfg = getSeasonConfig(gameState.season);
  const borderColor =
    gameState.season === "spring"
      ? "border-green-800/30"
      : gameState.season === "autumn"
        ? "border-amber-800/30"
        : "border-slate-600/30";

  return (
    <canvas
      ref={canvasRef}
      width={GRID_COLS * CELL_SIZE}
      height={GRID_ROWS * CELL_SIZE}
      className={`rounded-2xl shadow-2xl border-4 ${borderColor}`}
    />
  );
}
