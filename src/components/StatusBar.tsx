import { Clock, Gauge, Trophy } from "lucide-react";
import type { MowerType, Season } from "../types/game";
import { getMowerConfig, getSeasonConfig } from "../utils/gameUtils";

interface StatusBarProps {
  time: string;
  completion: number;
  bestScore: number;
  mowerType: MowerType;
  season: Season;
}

export function StatusBar({
  time,
  completion,
  bestScore,
  mowerType,
  season,
}: StatusBarProps) {
  const mowerCfg = getMowerConfig(mowerType);
  const seasonCfg = getSeasonConfig(season);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-green-100 flex gap-4 items-center justify-center flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">用时</p>
          <p className="text-xl font-bold text-green-800 font-mono">{time}</p>
        </div>
      </div>

      <div className="w-px h-12 bg-green-100"></div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Gauge className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">完成度</p>
          <p className="text-xl font-bold text-green-800 font-mono">
            {completion}%
          </p>
        </div>
      </div>

      <div className="w-px h-12 bg-green-100"></div>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: mowerCfg.color + "20" }}
        >
          <span className="text-lg">{mowerCfg.icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">割草机</p>
          <p className="text-sm font-bold text-gray-800">{mowerCfg.name}</p>
        </div>
      </div>

      <div className="w-px h-12 bg-green-100"></div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <span className="text-lg">{seasonCfg.icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">季节</p>
          <p className="text-sm font-bold text-gray-800">{seasonCfg.name}</p>
        </div>
      </div>

      <div className="w-px h-12 bg-green-100"></div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">最高分</p>
          <p className="text-xl font-bold text-yellow-700 font-mono">
            {bestScore}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-40">
        <div className="h-3 bg-green-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
