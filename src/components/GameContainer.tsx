import { useGameLogic } from "../hooks/useGameLogic";
import { GameCanvas } from "./GameCanvas";
import { ControlTips } from "./ControlTips";
import { StatusBar } from "./StatusBar";
import { CompletionPanel } from "./CompletionPanel";
import { MowerSelector } from "./MowerSelector";
import { Leaf } from "lucide-react";
import { getSeasonConfig } from "../utils/gameUtils";

export function GameContainer() {
  const {
    gameState,
    score,
    bestScore,
    selectedMower,
    selectedSeason,
    moveMower,
    resetGame,
    changeMower,
    changeSeason,
    formattedTime,
    completionPercent,
  } = useGameLogic();

  const seasonCfg = getSeasonConfig(selectedSeason);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${seasonCfg.bgGradient} py-6 px-4 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              快乐割草机
            </h1>
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-green-700/80 font-medium">
            推着割草机走出整齐纹路，享受修剪的极致舒适感 {seasonCfg.icon}
          </p>
        </div>

        <div className="mb-5">
          <StatusBar
            time={formattedTime}
            completion={completionPercent}
            bestScore={bestScore}
            mowerType={selectedMower}
            season={selectedSeason}
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start justify-center">
          <div className="w-full xl:w-64 order-2 xl:order-1">
            <MowerSelector
              selectedMower={selectedMower}
              selectedSeason={selectedSeason}
              bestScore={bestScore}
              onSelectMower={changeMower}
              onSelectSeason={changeSeason}
            />
          </div>

          <div className="flex-shrink-0 order-1 xl:order-2 mx-auto">
            <GameCanvas gameState={gameState} />
          </div>

          <div className="w-full xl:w-64 order-3">
            <ControlTips
              onMove={moveMower}
              mowerType={selectedMower}
              season={selectedSeason}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-green-700/60">
          💡
          小提示：尽量保持直线行驶，可以获得更高的整齐度评分哦！更高分数可以解锁更好的割草机
          🚜
        </div>
      </div>

      {gameState.completed && score && (
        <CompletionPanel score={score} onRestart={() => resetGame()} />
      )}
    </div>
  );
}
