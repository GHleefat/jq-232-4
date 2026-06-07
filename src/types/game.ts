export type CellType = 'grass' | 'flower' | 'path' | 'mowed';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type MowerType = 'basic' | 'wide' | 'super';

export type Season = 'spring' | 'autumn' | 'winter';

export interface MowerConfig {
  id: MowerType;
  name: string;
  description: string;
  width: number;
  speed: number;
  turnRadius: number;
  color: string;
  darkColor: string;
  unlockScore: number;
  icon: string;
}

export interface SeasonConfig {
  id: Season;
  name: string;
  icon: string;
  grassColors: string[];
  mowedColors: string[];
  grassStalkColor: string;
  flowerColor: string;
  flowerAltColor: string;
  pathColors: string[];
  bgGradient: string;
  description: string;
}

export interface Cell {
  type: CellType;
  grassHeight: number;
  mowedRow: number | null;
  mowedCol: number | null;
}

export interface Mower {
  x: number;
  y: number;
  direction: Direction;
}

export interface PathPoint {
  x: number;
  y: number;
  direction: Direction;
}

export interface GameState {
  grid: Cell[][];
  mower: Mower;
  startTime: number;
  elapsedTime: number;
  completed: boolean;
  totalGrassCells: number;
  mowedCells: number;
  path: PathPoint[];
  mowerType: MowerType;
  season: Season;
}

export interface ScoreResult {
  time: number;
  completion: number;
  neatness: number;
  total: number;
  grade: string;
}
