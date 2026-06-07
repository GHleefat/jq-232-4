import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Repeat,
  Sparkles,
} from "lucide-react";
import type { MowerType, Season } from "../types/game";
import { getMowerConfig, getSeasonConfig } from "../utils/gameUtils";

interface ControlTipsProps {
  onMove?: (direction: "up" | "down" | "left" | "right") => void;
  mowerType?: MowerType;
  season?: Season;
}

export function ControlTips({
  onMove,
  mowerType = "basic",
  season = "spring",
}: ControlTipsProps) {
  const handleClick = (direction: "up" | "down" | "left" | "right") => {
    onMove?.(direction);
  };

  const mowerCfg = getMowerConfig(mowerType);
  const seasonCfg = getSeasonConfig(season);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-green-100">
      <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
        操作说明
      </h3>

      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-5">
        <div></div>
        <button
          onClick={() => handleClick("up")}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div></div>
        <button
          onClick={() => handleClick("left")}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleClick("down")}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleClick("right")}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-green-50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{mowerCfg.icon}</span>
          <span className="font-bold text-gray-800 text-sm">
            {mowerCfg.name}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Move className="w-3 h-3" />
            刀宽 {mowerCfg.width} 格
          </span>
          <span className="flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            {mowerCfg.turnRadius === 0
              ? "灵活转向"
              : `转弯需直行 ${mowerCfg.turnRadius} 格`}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: seasonCfg.grassColors[0] }}
          ></span>
          草地：需要修剪
        </p>
        <p className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: seasonCfg.mowedColors[0] }}
          ></span>
          已修剪：深浅交替纹路
        </p>
        <p className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${seasonCfg.flowerColor}, ${seasonCfg.flowerAltColor})`,
            }}
          ></span>
          花坛：不可进入
        </p>
        <p className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: seasonCfg.pathColors[0] }}
          ></span>
          小路：不可进入
        </p>
      </div>

      {mowerCfg.turnRadius > 0 && (
        <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-700 flex items-start gap-1">
            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>
              宽幅割草机转弯前需先直行 {mowerCfg.turnRadius}{" "}
              格，才能改变方向哦！
            </span>
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400 text-center">
        使用方向键或 WASD 控制割草机
      </p>
    </div>
  );
}
