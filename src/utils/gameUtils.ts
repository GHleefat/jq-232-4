import type {
  Cell,
  GameState,
  Mower,
  PathPoint,
  ScoreResult,
  Direction,
  MowerConfig,
  SeasonConfig,
  MowerType,
  Season,
} from "../types/game";

export const GRID_ROWS = 16;
export const GRID_COLS = 20;
export const CELL_SIZE = 36;

export const MOWER_CONFIGS: Record<MowerType, MowerConfig> = {
  basic: {
    id: "basic",
    name: "基础割草机",
    description: "经典单刀割草机，灵活轻便",
    width: 1,
    speed: 1,
    turnRadius: 0,
    color: "#FF5722",
    darkColor: "#E64A19",
    unlockScore: 0,
    icon: "🛠️",
  },
  wide: {
    id: "wide",
    name: "宽幅割草机",
    description: "双刀宽幅设计，效率高但转弯稍笨拙",
    width: 2,
    speed: 1,
    turnRadius: 1,
    color: "#2196F3",
    darkColor: "#1976D2",
    unlockScore: 60,
    icon: "⚙️",
  },
  super: {
    id: "super",
    name: "超级割草机",
    description: "三刀巨无霸，极速修剪，转弯半径大",
    width: 3,
    speed: 1,
    turnRadius: 2,
    color: "#9C27B0",
    darkColor: "#7B1FA2",
    unlockScore: 80,
    icon: "🚜",
  },
};

export const SEASON_CONFIGS: Record<Season, SeasonConfig> = {
  spring: {
    id: "spring",
    name: "春夏绿草",
    icon: "🌱",
    grassColors: ["#4CAF50", "#66BB6A", "#81C784"],
    mowedColors: ["#2E7D32", "#388E3C", "#43A047"],
    grassStalkColor: "rgba(46, 125, 50, 0.3)",
    flowerColor: "#E91E63",
    flowerAltColor: "#FF9800",
    pathColors: ["#8D6E63", "#A1887F"],
    bgGradient: "from-green-100 via-emerald-50 to-teal-100",
    description: "万物生长的季节，绿草茵茵",
  },
  autumn: {
    id: "autumn",
    name: "秋日枯草",
    icon: "🍂",
    grassColors: ["#C9A86C", "#D4B77A", "#DEBF85"],
    mowedColors: ["#A68846", "#B89550", "#C9A86C"],
    grassStalkColor: "rgba(139, 94, 52, 0.35)",
    flowerColor: "#FF5722",
    flowerAltColor: "#FFC107",
    pathColors: ["#6D4C41", "#8D6E63"],
    bgGradient: "from-amber-100 via-orange-50 to-yellow-100",
    description: "金秋时节，枯黄的草地别有风味",
  },
  winter: {
    id: "winter",
    name: "冬季雪地",
    icon: "❄️",
    grassColors: ["#E3F2FD", "#ECEFF1", "#F5F5F5"],
    mowedColors: ["#90CAF9", "#B0BEC5", "#CFD8DC"],
    grassStalkColor: "rgba(96, 125, 139, 0.25)",
    flowerColor: "#E91E63",
    flowerAltColor: "#FF4081",
    pathColors: ["#78909C", "#90A4AE"],
    bgGradient: "from-slate-100 via-blue-50 to-indigo-100",
    description: "白雪皑皑，修剪雪道般的纹路",
  },
};

export function getMowerConfig(type: MowerType): MowerConfig {
  return MOWER_CONFIGS[type];
}

export function getSeasonConfig(season: Season): SeasonConfig {
  return SEASON_CONFIGS[season];
}

export function getMowedCellsForPosition(
  grid: Cell[][],
  x: number,
  y: number,
  direction: Direction,
  mowerWidth: number,
): { x: number; y: number }[] {
  const cells: { x: number; y: number }[] = [];
  const halfWidth = Math.floor(mowerWidth / 2);

  if (direction === "left" || direction === "right") {
    for (let dy = -halfWidth; dy <= halfWidth; dy++) {
      const ny = y + dy;
      if (ny >= 0 && ny < GRID_ROWS && x >= 0 && x < GRID_COLS) {
        const cell = grid[ny][x];
        if (cell.type === "grass" || cell.type === "mowed") {
          cells.push({ x, y: ny });
        }
      }
    }
  } else {
    for (let dx = -halfWidth; dx <= halfWidth; dx++) {
      const nx = x + dx;
      if (nx >= 0 && nx < GRID_COLS && y >= 0 && y < GRID_ROWS) {
        const cell = grid[y][nx];
        if (cell.type === "grass" || cell.type === "mowed") {
          cells.push({ x: nx, y });
        }
      }
    }
  }

  return cells;
}

export function canMoveToWithWidth(
  grid: Cell[][],
  x: number,
  y: number,
  direction: Direction,
  mowerWidth: number,
): boolean {
  const halfWidth = Math.floor(mowerWidth / 2);

  if (direction === "left" || direction === "right") {
    for (let dy = -halfWidth; dy <= halfWidth; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= GRID_ROWS || x < 0 || x >= GRID_COLS) return false;
      const cell = grid[ny][x];
      if (cell.type === "flower" || cell.type === "path") return false;
    }
  } else {
    for (let dx = -halfWidth; dx <= halfWidth; dx++) {
      const nx = x + dx;
      if (nx < 0 || nx >= GRID_COLS || y < 0 || y >= GRID_ROWS) return false;
      const cell = grid[y][nx];
      if (cell.type === "flower" || cell.type === "path") return false;
    }
  }

  return true;
}

export function canTurn(
  currentDirection: Direction,
  newDirection: Direction,
  turnRadius: number,
  path: PathPoint[],
): boolean {
  if (turnRadius === 0) return true;
  if (currentDirection === newDirection) return true;

  const isOpposite =
    (currentDirection === "up" && newDirection === "down") ||
    (currentDirection === "down" && newDirection === "up") ||
    (currentDirection === "left" && newDirection === "right") ||
    (currentDirection === "right" && newDirection === "left");

  if (isOpposite) return false;

  const requiredStraight = turnRadius;
  let straightCount = 0;

  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i].direction === currentDirection) {
      straightCount++;
    } else {
      break;
    }
  }

  return straightCount >= requiredStraight;
}

export function createInitialGrid(season: Season): {
  grid: Cell[][];
  totalGrassCells: number;
  startX: number;
  startY: number;
} {
  const grid: Cell[][] = [];
  let totalGrassCells = 0;
  const seasonCfg = SEASON_CONFIGS[season];

  for (let y = 0; y < GRID_ROWS; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      let grassHeight = 2 + Math.floor(Math.random() * 2);
      if (season === "winter") {
        grassHeight = 1 + Math.floor(Math.random() * 2);
      } else if (season === "autumn") {
        grassHeight = 1 + Math.floor(Math.random() * 3);
      }
      row.push({
        type: "grass",
        grassHeight,
        mowedRow: null,
        mowedCol: null,
      });
      totalGrassCells++;
    }
    grid.push(row);
  }

  const flowerPatterns = [
    { x: 3, y: 2, w: 3, h: 2 },
    { x: 14, y: 3, w: 3, h: 2 },
    { x: 8, y: 11, w: 4, h: 2 },
    { x: 2, y: 8, w: 2, h: 2 },
  ];

  flowerPatterns.forEach(({ x, y, w, h }) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS) {
          if (grid[ny][nx].type === "grass") {
            grid[ny][nx].type = "flower";
            totalGrassCells--;
          }
        }
      }
    }
  });

  for (let x = 0; x < GRID_COLS; x++) {
    const y = 6;
    if (x < 6 || x > 11) {
      if (grid[y][x].type === "grass") {
        grid[y][x].type = "path";
        totalGrassCells--;
      }
    }
  }

  for (let y = 0; y < GRID_ROWS; y++) {
    const x = 10;
    if (y < 3 || y > 8) {
      if (grid[y][x].type === "grass") {
        grid[y][x].type = "path";
        totalGrassCells--;
      }
    }
  }

  let startX = 0;
  let startY = 0;
  outer: for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (grid[y][x].type === "grass") {
        startX = x;
        startY = y;
        break outer;
      }
    }
  }

  return { grid, totalGrassCells, startX, startY };
}

export function createInitialState(
  mowerType: MowerType = "basic",
  season: Season = "spring",
): GameState {
  const { grid, totalGrassCells, startX, startY } = createInitialGrid(season);
  const mower: Mower = {
    x: startX,
    y: startY,
    direction: "right",
  };

  const path: PathPoint[] = [{ x: startX, y: startY, direction: "right" }];

  const initialGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const mowerCfg = MOWER_CONFIGS[mowerType];
  const initialMowedCells = getMowedCellsForPosition(
    initialGrid,
    startX,
    startY,
    "right",
    mowerCfg.width,
  );
  let mowedCount = 0;

  initialMowedCells.forEach(({ x, y }) => {
    if (initialGrid[y][x].type === "grass") {
      initialGrid[y][x].type = "mowed";
      initialGrid[y][x].grassHeight = 0;
      initialGrid[y][x].mowedRow = y;
      initialGrid[y][x].mowedCol = x;
      mowedCount++;
    }
  });

  if (mowedCount === 0 && initialGrid[startY][startX].type === "grass") {
    initialGrid[startY][startX].type = "mowed";
    initialGrid[startY][startX].grassHeight = 0;
    initialGrid[startY][startX].mowedRow = startY;
    initialGrid[startY][startX].mowedCol = startX;
    mowedCount = 1;
  }

  return {
    grid: initialGrid,
    mower,
    startTime: Date.now(),
    elapsedTime: 0,
    completed: false,
    totalGrassCells,
    mowedCells: mowedCount,
    path,
    mowerType,
    season,
  };
}

export function canMoveTo(grid: Cell[][], x: number, y: number): boolean {
  if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return false;
  const cell = grid[y][x];
  return cell.type !== "flower" && cell.type !== "path";
}

export function getDirectionDelta(direction: Direction): {
  dx: number;
  dy: number;
} {
  switch (direction) {
    case "up":
      return { dx: 0, dy: -1 };
    case "down":
      return { dx: 0, dy: 1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: 1, dy: 0 };
  }
}

export function calculateNeatness(path: PathPoint[]): number {
  if (path.length < 2) return 100;

  let straightSegments = 0;
  let totalSegments = path.length - 1;

  for (let i = 1; i < path.length; i++) {
    if (path[i].direction === path[i - 1].direction) {
      straightSegments++;
    }
  }

  return Math.round((straightSegments / totalSegments) * 100);
}

export function calculateScore(state: GameState): ScoreResult {
  const completion = Math.round(
    (state.mowedCells / state.totalGrassCells) * 100,
  );
  const neatness = calculateNeatness(state.path);
  const time = Math.round(state.elapsedTime / 1000);
  const mowerCfg = MOWER_CONFIGS[state.mowerType];

  const widthBonus =
    mowerCfg.width > 1 ? Math.min(10, (mowerCfg.width - 1) * 5) : 0;
  const timeScore = Math.max(0, 100 - Math.floor(time / 3));
  const total = Math.round(
    completion * 0.4 + neatness * 0.35 + timeScore * 0.25 + widthBonus,
  );

  let grade = "D";
  if (total >= 90) grade = "S";
  else if (total >= 80) grade = "A";
  else if (total >= 70) grade = "B";
  else if (total >= 60) grade = "C";

  return { time, completion, neatness, total, grade };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function loadBestScore(): number {
  try {
    const saved = localStorage.getItem("lawnmower_best_score");
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number): void {
  try {
    const current = loadBestScore();
    if (score > current) {
      localStorage.setItem("lawnmower_best_score", score.toString());
    }
  } catch {
    // ignore
  }
}
