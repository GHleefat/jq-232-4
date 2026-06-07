import { Lock, Unlock, Gauge, Move, Repeat } from "lucide-react";
import type { MowerType, Season } from "../types/game";
import { MOWER_CONFIGS, SEASON_CONFIGS } from "../utils/gameUtils";

interface MowerSelectorProps {
  selectedMower: MowerType;
  selectedSeason: Season;
  bestScore: number;
  onSelectMower: (type: MowerType) => void;
  onSelectSeason: (season: Season) => void;
}

export function MowerSelector({
  selectedMower,
  selectedSeason,
  bestScore,
  onSelectMower,
  onSelectSeason,
}: MowerSelectorProps) {
  const mowers = Object.values(MOWER_CONFIGS);
  const seasons = Object.values(SEASON_CONFIGS);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-green-100 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          选择割草机
        </h3>
        <div className="space-y-2">
          {mowers.map((mower) => {
            const isUnlocked = bestScore >= mower.unlockScore;
            const isSelected = selectedMower === mower.id;

            return (
              <button
                key={mower.id}
                onClick={() => isUnlocked && onSelectMower(mower.id)}
                disabled={!isUnlocked}
                className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : isUnlocked
                      ? "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                      : "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-inner"
                    style={{ backgroundColor: mower.color + "20" }}
                  >
                    {mower.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">
                        {mower.name}
                      </span>
                      {isUnlocked ? (
                        <Unlock className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {mower.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Move className="w-3 h-3" />宽 {mower.width}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Repeat className="w-3 h-3" />
                        转弯{" "}
                        {mower.turnRadius === 0
                          ? "灵活"
                          : `${mower.turnRadius}格`}
                      </span>
                    </div>
                    {!isUnlocked && (
                      <p className="text-xs text-amber-600 mt-1.5 font-medium">
                        🔒 需要历史最高 {mower.unlockScore} 分解锁（当前{" "}
                        {bestScore}）
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      <div>
        <h3 className="text-lg font-bold text-green-800 mb-3">🌤️ 选择季节</h3>
        <div className="grid grid-cols-3 gap-2">
          {seasons.map((season) => {
            const isSelected = selectedSeason === season.id;
            return (
              <button
                key={season.id}
                onClick={() => onSelectSeason(season.id)}
                className={`p-3 rounded-xl transition-all border-2 text-center ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                }`}
              >
                <div className="text-2xl mb-1">{season.icon}</div>
                <div className="text-xs font-bold text-gray-800">
                  {season.name}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {SEASON_CONFIGS[selectedSeason].description}
        </p>
      </div>
    </div>
  );
}
