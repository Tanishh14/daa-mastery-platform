import React, { useState } from 'react';

export const AsymptoticVisualizer: React.FC = () => {
  const [notation, setNotation] = useState<'O' | 'Omega' | 'Theta'>('O');
  const [cVal, setCVal] = useState<number>(3);
  const [n0Val, setN0Val] = useState<number>(4);

  // Generate curve points for n from 1 to 20
  const nPoints = Array.from({ length: 20 }, (_, i) => i + 1);

  // f(n) = 2n^2 + 5n
  // g(n) = n^2
  const f = (n: number) => 2 * n * n + 5 * n;
  const g = (n: number) => n * n;

  // Maximum value for scaling SVG height
  const maxN = 20;
  const maxY = Math.max(f(maxN), cVal * g(maxN), 1);
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = 35;

  const toSvgX = (n: number) => padding + ((n - 1) / (maxN - 1)) * (svgWidth - 2 * padding);
  const toSvgY = (y: number) => svgHeight - padding - (y / maxY) * (svgHeight - 2 * padding);

  const fPointsSvg = nPoints.map(n => `${toSvgX(n)},${toSvgY(f(n))}`).join(' ');
  const cgPointsSvg = nPoints.map(n => `${toSvgX(n)},${toSvgY(cVal * g(n))}`).join(' ');

  const n0X = toSvgX(n0Val);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Asymptotic Notation Interactive Bound Explorer
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => {
              setNotation('O');
              setCVal(3);
              setN0Val(5);
            }}
            className={`px-3 py-1 rounded-md transition ${
              notation === 'O' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Big-O (Upper: f ≤ c·g)
          </button>
          <button
            onClick={() => {
              setNotation('Omega');
              setCVal(2);
              setN0Val(1);
            }}
            className={`px-3 py-1 rounded-md transition ${
              notation === 'Omega' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Big-Ω (Lower: f ≥ c·g)
          </button>
          <button
            onClick={() => {
              setNotation('Theta');
              setCVal(3);
              setN0Val(5);
            }}
            className={`px-3 py-1 rounded-md transition ${
              notation === 'Theta' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Theta (Tight Sandwich)
          </button>
        </div>
      </div>

      {/* SVG Canvas Plotting Curves */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center relative">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[540px] h-[220px]">
          {/* Shaded Valid Region for n >= n0 */}
          <rect
            x={n0X}
            y={padding}
            width={svgWidth - padding - n0X}
            height={svgHeight - 2 * padding}
            fill="#1e3a8a"
            fillOpacity="0.15"
          />

          {/* Axes */}
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding}
            y2={svgHeight - padding}
            stroke="#475569"
            strokeWidth="1.5"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={svgHeight - padding}
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* n0 Vertical Threshold Line */}
          <line
            x1={n0X}
            y1={padding}
            x2={n0X}
            y2={svgHeight - padding}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text
            x={n0X}
            y={padding - 5}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            n₀ = {n0Val}
          </text>

          {/* Curve 1: f(n) = 2n^2 + 5n */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            points={fPointsSvg}
          />

          {/* Curve 2: c * g(n) = c * n^2 */}
          <polyline
            fill="none"
            stroke="#ec4899"
            strokeWidth="2.5"
            strokeDasharray={notation === 'Theta' ? '0' : '5 3'}
            points={cgPointsSvg}
          />

          {/* X axis labels */}
          <text x={svgWidth - padding} y={svgHeight - padding + 18} fill="#94a3b8" fontSize="10" textAnchor="end">
            Input Size (n) →
          </text>
          {/* Y axis labels */}
          <text x={padding + 5} y={padding + 10} fill="#94a3b8" fontSize="10">
            Operations T(n) ↑
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono pt-2 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-400"></span>
            <span>f(n) = 2n² + 5n</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-pink-500"></span>
            <span>
              c·g(n) = {cVal} · n²
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500/20 border border-amber-500 rounded-sm"></span>
            <span>Region n ≥ n₀ ({n0Val})</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls (c slider, n0 slider) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Constant Multiplier (c):</span>
            <span className="font-mono text-pink-400 font-bold">{cVal}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={cVal}
            onChange={(e) => setCVal(parseFloat(e.target.value))}
            className="accent-pink-500"
          />
          <span className="text-[11px] text-slate-500">
            Scales the asymptotic bounding function c · g(n)
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Threshold Threshold (n₀):</span>
            <span className="font-mono text-amber-400 font-bold">{n0Val}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={n0Val}
            onChange={(e) => setN0Val(parseInt(e.target.value, 10))}
            className="accent-amber-500"
          />
          <span className="text-[11px] text-slate-500">
            Starting point from which the inequality must strictly hold
          </span>
        </div>
      </div>

      {/* Inequality Verification Output */}
      <div className="bg-slate-950 border border-blue-900/50 p-3.5 rounded-lg flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="text-xs font-mono text-blue-400 font-semibold">
            Inequality Status for n ≥ {n0Val}:
          </div>
          <div className="text-xs text-slate-300">
            {cVal >= 3 ? (
              <span className="text-emerald-400 font-medium">
                ✓ Bound is SATISFIED: 2n² + 5n ≤ {cVal}n² holds for all n ≥ {n0Val} (e.g. at n=5: 75 ≤ {cVal * 25}).
              </span>
            ) : (
              <span className="text-rose-400 font-medium">
                ✕ Bound FAILS: c={cVal} is too small! At large n, 2n² + 5n will exceed {cVal}n². Increase c ≥ 3.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
