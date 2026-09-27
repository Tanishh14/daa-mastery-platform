import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export const MasterTheoremSolver: React.FC = () => {
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(2);
  const [fExponent, setFExponent] = useState<number>(1);
  const [logPower, setLogPower] = useState<number>(0);

  // Compute c_crit = log_b(a)
  const logBA = Math.log(a) / Math.log(b);
  const eps = 1e-4;

  let identifiedCase = 1;
  let solution = '';
  let explanation = '';

  if (fExponent < logBA - eps) {
    identifiedCase = 1;
    solution = `Θ(n^${logBA.toFixed(2)})`;
    explanation = `Since f(n) = O(n^${fExponent}) is polynomially smaller than n^(log_b a) = n^${logBA.toFixed(
      2
    )}, Case 1 applies: work at the bottom leaves of the recursion tree dominates total runtime.`;
  } else if (Math.abs(fExponent - logBA) <= eps) {
    identifiedCase = 2;
    const newLogK = logPower + 1;
    const logStr = newLogK === 1 ? 'log n' : `log^${newLogK} n`;
    solution = `Θ(n^${logBA.toFixed(2)} · ${logStr})`;
    explanation = `Since f(n) = Θ(n^${logBA.toFixed(
      2
    )} · log^${logPower} n) matches the watershed n^(log_b a), Case 2 applies: every level of the recursion tree performs equal asymptotic work.`;
  } else {
    identifiedCase = 3;
    solution = `Θ(n^${fExponent})`;
    explanation = `Since f(n) = Ω(n^${fExponent}) is polynomially larger than n^(log_b a) = n^${logBA.toFixed(
      2
    )}, and assuming the regularity condition a·f(n/b) ≤ c·f(n) holds, Case 3 applies: work at the top root problem dominates total runtime.`;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Interactive Master Theorem Solver: T(n) = a·T(n/b) + f(n)
          </h3>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-mono">Subproblems (a ≥ 1):</label>
          <input
            type="number"
            min="1"
            max="16"
            value={a}
            onChange={(e) => setA(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-blue-400 font-mono text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-mono">Division Factor (b &gt; 1):</label>
          <input
            type="number"
            min="2"
            max="8"
            value={b}
            onChange={(e) => setB(Math.max(2, parseInt(e.target.value, 10) || 2))}
            className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-blue-400 font-mono text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-mono">f(n) power (n^d):</label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="6"
            value={fExponent}
            onChange={(e) => setFExponent(parseFloat(e.target.value) || 0)}
            className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-blue-400 font-mono text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-mono">f(n) log factor (log^k n):</label>
          <input
            type="number"
            min="0"
            max="3"
            value={logPower}
            onChange={(e) => setLogPower(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-blue-400 font-mono text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-mono">Quick Presets:</span>
        <button
          onClick={() => { setA(2); setB(2); setFExponent(1); setLogPower(0); }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-mono transition"
        >
          Merge Sort: 2T(n/2) + n
        </button>
        <button
          onClick={() => { setA(1); setB(2); setFExponent(0); setLogPower(0); }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-mono transition"
        >
          Binary Search: T(n/2) + 1
        </button>
        <button
          onClick={() => { setA(7); setB(2); setFExponent(2); setLogPower(0); }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-mono transition"
        >
          Strassen: 7T(n/2) + n²
        </button>
        <button
          onClick={() => { setA(3); setB(2); setFExponent(1); setLogPower(0); }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-mono transition"
        >
          Karatsuba: 3T(n/2) + n
        </button>
      </div>

      {/* Math Derivation Panel */}
      <div className="bg-slate-950 border border-blue-900/40 p-4 rounded-lg flex flex-col gap-2 font-mono">
        <div className="text-xs text-slate-400">Step 1: Compute Critical Watershed Exponent</div>
        <div className="text-sm text-sky-400 font-semibold">
          log_b(a) = log_{b}({a}) = {logBA.toFixed(3)} ⇒ Leaves Count = n^{logBA.toFixed(3)}
        </div>
        <div className="text-xs text-slate-400 pt-1">
          Step 2: Compare f(n) = n^{fExponent} {logPower > 0 ? `· log^${logPower} n` : ''} against n^{logBA.toFixed(3)}
        </div>
        <div className="text-xs text-amber-300">
          Resulting Master Theorem Branch: <span className="font-bold underline">Case {identifiedCase}</span>
        </div>
      </div>

      {/* Solution Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-800/80 p-4 rounded-lg flex flex-col gap-1.5">
        <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold font-mono">
          Final Asymptotic Solution:
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-white">
          T(n) = {solution}
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
          {explanation}
        </p>
      </div>
    </div>
  );
};
