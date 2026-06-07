import { Trophy, Clock, CheckCircle2, Ruler, RefreshCw, Sparkles } from 'lucide-react';
import type { ScoreResult } from '../types/game';

interface CompletionPanelProps {
  score: ScoreResult;
  onRestart: () => void;
}

export function CompletionPanel({ score, onRestart }: CompletionPanelProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S':
        return 'from-yellow-400 via-amber-400 to-orange-500';
      case 'A':
        return 'from-green-400 via-emerald-500 to-teal-600';
      case 'B':
        return 'from-blue-400 via-cyan-500 to-sky-600';
      case 'C':
        return 'from-purple-400 via-violet-500 to-indigo-600';
      default:
        return 'from-gray-400 via-slate-500 to-zinc-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scaleIn">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">修剪完成！</h2>
          <p className="text-gray-500">院子焕然一新 🌿</p>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getGradeColor(score.grade)} flex items-center justify-center shadow-xl`}
          >
            <span className="text-5xl font-black text-white drop-shadow-lg">
              {score.grade}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-xs text-gray-500 mb-1">用时</p>
            <p className="text-lg font-bold text-green-800">{score.time}s</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-xs text-gray-500 mb-1">完成度</p>
            <p className="text-lg font-bold text-green-800">{score.completion}%</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Ruler className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-xs text-gray-500 mb-1">整齐度</p>
            <p className="text-lg font-bold text-green-800">{score.neatness}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <span className="text-white font-medium">综合评分</span>
          </div>
          <span className="text-3xl font-black text-white">{score.total}</span>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          再来一次
        </button>
      </div>
    </div>
  );
}
