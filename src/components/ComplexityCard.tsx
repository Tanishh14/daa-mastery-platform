import React from 'react';
import type { ComplexityInfo } from '../types';
import { Gauge } from 'lucide-react';

interface ComplexityCardProps {
  complexity: ComplexityInfo;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({ complexity }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Gauge className="w-4 h-4 text-sky-400" />
        <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
          Asymptotic Complexity Breakdown & Justification
        </h3>
      </div>

      {/* Metrics Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-emerald-400 font-semibold uppercase">Best Case</span>
          <div className="text-base font-bold text-slate-100 mt-1">{complexity.best}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-blue-400 font-semibold uppercase">Average Case</span>
          <div className="text-base font-bold text-slate-100 mt-1">{complexity.average}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-rose-400 font-semibold uppercase">Worst Case</span>
          <div className="text-base font-bold text-slate-100 mt-1">{complexity.worst}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-[11px] text-purple-400 font-semibold uppercase">Auxiliary Space</span>
          <div className="text-base font-bold text-slate-100 mt-1">{complexity.auxiliarySpace}</div>
        </div>
      </div>

      {/* Analytical "Why?" Explanations */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col gap-3 text-xs sm:text-sm">
        <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
          Why these complexities occur:
        </div>

        <div className="space-y-2 text-slate-300">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-emerald-400">Best Case:</span>
            <span className="text-slate-400 text-xs leading-relaxed">{complexity.explanation.best}</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-blue-400">Average Case:</span>
            <span className="text-slate-400 text-xs leading-relaxed">{complexity.explanation.average}</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-rose-400">Worst Case:</span>
            <span className="text-slate-400 text-xs leading-relaxed">{complexity.explanation.worst}</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-purple-400">Memory & Space:</span>
            <span className="text-slate-400 text-xs leading-relaxed">{complexity.explanation.space}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
