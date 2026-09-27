import React, { useState } from 'react';

export const AdversaryLowerBoundVisualizer: React.FC = () => {
  const [numElements, setNumElements] = useState<number>(3);

  // Compute factorial and log2(factorial)
  let factorial = 1;
  for (let i = 1; i <= numElements; i++) factorial *= i;

  const minComparisons = Math.ceil(Math.log2(factorial));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Adversary Argument & Comparison Sorting Lower Bound Decision Tree
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Number of Elements (n):</span>
          {[3, 4, 5].map(val => (
            <button
              key={val}
              onClick={() => setNumElements(val)}
              className={`px-2.5 py-1 text-xs rounded font-mono transition ${
                numElements === val
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              n = {val}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Tree Diagram for n=3 */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center overflow-x-auto">
        <div className="text-center font-mono text-xs text-slate-400 pb-2">
          Binary Decision Tree for Sorting [A, B, C] (Worst Case Height h ≥ 3)
        </div>
        <svg viewBox="0 0 460 170" className="w-full max-w-[480px] h-[170px]">
          {/* Root comparison A : B */}
          <rect x="195" y="10" width="70" height="24" rx="4" fill="#1e3a8a" stroke="#60a5fa" />
          <text x="230" y="26" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">
            A &lt; B ?
          </text>

          {/* Level 1 branches */}
          <line x1="205" y1="34" x2="120" y2="60" stroke="#475569" strokeWidth="1.5" />
          <line x1="255" y1="34" x2="340" y2="60" stroke="#475569" strokeWidth="1.5" />
          <text x="155" y="44" fill="#38bdf8" fontSize="9">YES</text>
          <text x="305" y="44" fill="#f43f5e" fontSize="9">NO</text>

          {/* Level 1 nodes */}
          <rect x="85" y="60" width="70" height="22" rx="4" fill="#1e293b" stroke="#64748b" />
          <text x="120" y="75" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
            B &lt; C ?
          </text>

          <rect x="305" y="60" width="70" height="22" rx="4" fill="#1e293b" stroke="#64748b" />
          <text x="340" y="75" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
            A &lt; C ?
          </text>

          {/* Leaves: ABC, ACB, BAC, BCA, CAB, CBA */}
          <g transform="translate(0, 110)">
            <rect x="10" y="20" width="55" height="20" rx="3" fill="#064e3b" stroke="#34d399" />
            <text x="37" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
              [A, B, C]
            </text>

            <rect x="75" y="20" width="55" height="20" rx="3" fill="#064e3b" stroke="#34d399" />
            <text x="102" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
              [A, C, B]
            </text>

            <rect x="140" y="20" width="55" height="20" rx="3" fill="#064e3b" stroke="#34d399" />
            <text x="167" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
              [C, A, B]
            </text>

            <rect x="260" y="20" width="55" height="20" rx="3" fill="#064e3b" stroke="#34d399" />
            <text x="287" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
              [B, A, C]
            </text>

            <rect x="325" y="20" width="55" height="20" rx="3" fill="#064e3b" stroke="#34d399" />
            <text x="352" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
              [B, C, A]
            </text>

            <rect x="390" y="20" width="55" height="20" rx="3" fill="#064e3b" stroke="#34d399" />
            <text x="417" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
              [C, B, A]
            </text>
          </g>
        </svg>
      </div>

      {/* Information Theory Calculation Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Total Permutations:</span>
          <div className="text-lg font-bold text-rose-400 mt-1">
            {numElements}! = {factorial}
          </div>
          <span className="text-[10px] text-slate-500">Leaves required in tree</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Binary Tree Capacity:</span>
          <div className="text-lg font-bold text-sky-400 mt-1">
            2^h ≥ {factorial}
          </div>
          <span className="text-[10px] text-slate-500">Each query yields ≤ 1 bit</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Min Worst-Case Comparisons:</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">
            h ≥ ⌈log₂({factorial})⌉ = {minComparisons}
          </div>
          <span className="text-[10px] text-slate-500">Ω(n log n) lower bound</span>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-rose-400">The Adversary Argument:</span> An adversary chooses the answer to each comparison that keeps the largest number of permutations active. Because a question can at most halve the remaining possibilities, the adversary can always force any comparison algorithm to take at least ⌈log₂(n!)⌉ comparisons.
      </div>
    </div>
  );
};
