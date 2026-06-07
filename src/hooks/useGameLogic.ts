import { useState, useEffect, useCallback, useRef } from "react";
import type { GameState, Direction, MowerType, Season } from "../types/game";
import {
  createInitialState,
  getDirectionDelta,
  calculateScore,
  formatTime,
  canMoveToWithWidth,
  canTurn,
  getMowedCellsForPosition,
  getMowerConfig,
  saveBestScore,
  loadBestScore,
} from "../utils/gameUtils";
import type { ScoreResult } from "../types/game";

export function useGameLogic() {
  const [selectedMower, setSelectedMower] = useState<MowerType>("basic");
  const [selectedSeason, setSelectedSeason] = useState<Season>("spring");
  const [bestScore, setBestScore] = useState<number>(() => loadBestScore());
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState("basic", "spring"),
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameState.completed) {
      timerRef.current = window.setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime,
        }));
      }, 100);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.completed]);

  const moveMower = useCallback((direction: Direction) => {
    setGameState((prev) => {
      if (prev.completed) return prev;

      const mowerCfg = getMowerConfig(prev.mowerType);

      if (
        !canTurn(
          prev.mower.direction,
          direction,
          mowerCfg.turnRadius,
          prev.path,
        )
      ) {
        return prev;
      }

      const { dx, dy } = getDirectionDelta(direction);
      const newX = prev.mower.x + dx;
      const newY = prev.mower.y + dy;

      if (
        !canMoveToWithWidth(prev.grid, newX, newY, direction, mowerCfg.width)
      ) {
        if (
          direction !== prev.mower.direction &&
          canTurn(
            prev.mower.direction,
            direction,
            mowerCfg.turnRadius,
            prev.path,
          ) &&
          canMoveToWithWidth(
            prev.grid,
            prev.mower.x,
            prev.mower.y,
            direction,
            mowerCfg.width,
          )
        ) {
          return {
            ...prev,
            mower: { ...prev.mower, direction },
          };
        }
        return prev;
      }

      const newGrid = prev.grid.map((row) => row.map((cell) => ({ ...cell })));
      let newMowedCells = prev.mowedCells;

      const mowedPositions = getMowedCellsForPosition(
        newGrid,
        newX,
        newY,
        direction,
        mowerCfg.width,
      );
      mowedPositions.forEach(({ x, y }) => {
        if (newGrid[y][x].type === "grass") {
          newGrid[y][x] = {
            ...newGrid[y][x],
            type: "mowed",
            grassHeight: 0,
            mowedRow: y,
            mowedCol: x,
          };
          newMowedCells++;
        }
      });

      const newPath = [...prev.path, { x: newX, y: newY, direction }];
      const isCompleted = newMowedCells >= prev.totalGrassCells;

      const newState = {
        ...prev,
        grid: newGrid,
        mower: { x: newX, y: newY, direction },
        mowedCells: newMowedCells,
        path: newPath,
        completed: isCompleted,
        elapsedTime: isCompleted
          ? Date.now() - prev.startTime
          : prev.elapsedTime,
      };

      if (isCompleted) {
        const finalScore = calculateScore(newState);
        saveBestScore(finalScore.total);
        setBestScore((prevBest) => Math.max(prevBest, finalScore.total));
      }

      return newState;
    });
  }, []);

  const resetGame = useCallback(
    (mowerType?: MowerType, season?: Season) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      const mt = mowerType ?? selectedMower;
      const sn = season ?? selectedSeason;
      setGameState(createInitialState(mt, sn));
    },
    [selectedMower, selectedSeason],
  );

  const changeMower = useCallback(
    (mowerType: MowerType) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setSelectedMower(mowerType);
      setGameState(createInitialState(mowerType, selectedSeason));
    },
    [selectedSeason],
  );

  const changeSeason = useCallback(
    (season: Season) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setSelectedSeason(season);
      setGameState(createInitialState(selectedMower, season));
    },
    [selectedMower],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          moveMower("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          moveMower("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          moveMower("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          moveMower("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveMower]);

  const score: ScoreResult | null = gameState.completed
    ? calculateScore(gameState)
    : null;

  return {
    gameState,
    score,
    bestScore,
    selectedMower,
    selectedSeason,
    moveMower,
    resetGame,
    changeMower,
    changeSeason,
    formattedTime: formatTime(gameState.elapsedTime),
    completionPercent: Math.round(
      (gameState.mowedCells / gameState.totalGrassCells) * 100,
    ),
  };
}
