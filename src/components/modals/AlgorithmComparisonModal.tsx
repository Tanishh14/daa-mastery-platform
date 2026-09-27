import React, { useState } from 'react';
import { X, Scale } from 'lucide-react';
import { COMPARISONS_DATA } from '../../data/comparisonData';

interface AlgorithmComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmComparisonModal: React.FC<AlgorithmComparisonModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(COMPARISONS_DATA[0].id);

  if (!isOpen) return null;

  const currentComp = COMPARISONS_DATA.find(c => c.id === selectedCompId) || COMPARISONS_DATA[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Algorithm Comparison Engine
              </h3>
              <p className="text-xs text-slate-400">
                Rigorous side-by-side theoretical and empirical evaluation matrix.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-xs font-mono">
          {COMPARISONS_DATA.map(comp => (
            <button
              key={comp.id}
              onClick={() => setSelectedCompId(comp.id)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
                selectedCompId === comp.id
                  ? 'bg-purple-600 text-white border-purple-400 font-semibold shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {comp.title}
            </button>
          ))}
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentComp.description}
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-mono">
                  {currentComp.headers.map((h, idx) => (
                    <th key={idx} className="p-3.5 font-bold uppercase tracking-wider text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {currentComp.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5 font-semibold text-slate-200 font-mono text-xs bg-slate-950/40">
                      {row.feature}
                    </td>
                    {row.values.map((val, vIdx) => (
                      <td key={vIdx} className="p-3.5 text-slate-300 leading-relaxed">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Takeaway Banner */}
          <div className="bg-purple-950/40 border border-purple-800/60 p-4 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-mono uppercase text-purple-400 font-bold">
              Engineering Rule of Thumb:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {currentComp.keyTakeaway}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
