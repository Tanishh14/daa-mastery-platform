import React from 'react';
import type { ProofInfo } from '../types';
import { ShieldCheck } from 'lucide-react';

interface ProofCardProps {
  proof?: ProofInfo;
}

export const ProofCard: React.FC<ProofCardProps> = ({ proof }) => {
  if (!proof) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-400 text-xs italic">
        Analytical proof is integrated into the formal definition and invariants above.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Mathematical Correctness Proof: {proof.title}
          </h3>
        </div>
        <span className="text-xs font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-2.5 py-0.5 rounded">
          {proof.type}
        </span>
      </div>

      {/* Preconditions */}
      {proof.preconditions && (
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-amber-400 font-semibold">Preconditions: </span>
          {proof.preconditions}
        </div>
      )}

      {/* Proof Phases (e.g. Initialization, Maintenance, Termination) */}
      <div className="flex flex-col gap-3">
        {proof.steps.map((st, idx) => (
          <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-lg flex flex-col gap-1">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wide">
              {idx + 1}. {st.phase}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {st.description}
            </p>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 p-3.5 rounded-lg flex flex-col gap-1">
        <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Conclusion Q.E.D.</span>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{proof.conclusion}</p>
      </div>
    </div>
  );
};
