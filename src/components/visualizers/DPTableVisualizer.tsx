import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface DPTableVisualizerProps {
  algorithmType?: 'lcs' | 'mcm' | 'fibonacci';
  onStepChange?: (stepIndex: number, currentLine?: number) => void;
}

interface DPStep {
  row: number;
  col: number;
  val: number | string;
  dependencies: [number, number][];
  transitionFormula: string;
  description: string;
  tableSnapshot: (number | string | null)[][];
  highlightedLine?: number;
}

export const DPTableVisualizer: React.FC<DPTableVisualizerProps> = ({
  algorithmType = 'lcs',
  onStepChange
}) => {
  const [activeTab, setActiveTab] = useState<'tabulation' | 'memoization' | 'transition'>('tabulation');
  const [steps, setSteps] = useState<DPStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const timerRef = useRef<number | null>(null);

  // Strings for LCS
  const strX = 'BD';
  const strY = 'ABCD';
  const m = strX.length;
  const n = strY.length;

  useEffect(() => {
    const gen: DPStep[] = [];
    const table: (number | string | null)[][] = Array.from({ length: m + 1 }, () =>
      Array(n + 1).fill(null)
    );

    // Step 0: Initialize base cases row 0 and col 0
    for (let i = 0; i <= m; i++) table[i][0] = 0;
    for (let j = 0; j <= n; j++) table[0][j] = 0;

    gen.push({
      row: 0,
      col: 0,
      val: 0,
      dependencies: [],
      transitionFormula: 'dp[i][0] = 0, dp[0][j] = 0',
      description: 'Base cases initialized: Empty prefix matches length 0.',
      tableSnapshot: table.map(r => [...r]),
      highlightedLine: 8
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const charX = strX[i - 1];
        const charY = strY[j - 1];

        if (charX === charY) {
          const prevVal = Number(table[i - 1][j - 1]) || 0;
          table[i][j] = prevVal + 1;
          gen.push({
            row: i,
            col: j,
            val: table[i][j]!,
            dependencies: [[i - 1, j - 1]],
            transitionFormula: `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${prevVal} + 1 = ${table[i][j]}`,
            description: `Characters MATCH ('${charX}' == '${charY}')! Take diagonal value dp[${i - 1}][${j - 1}] and add 1.`,
            tableSnapshot: table.map(r => [...r]),
            highlightedLine: 11
          });
        } else {
          const topVal = Number(table[i - 1][j]) || 0;
          const leftVal = Number(table[i][j - 1]) || 0;
          table[i][j] = Math.max(topVal, leftVal);
          gen.push({
            row: i,
            col: j,
            val: table[i][j]!,
            dependencies: [
              [i - 1, j],
              [i, j - 1]
            ],
            transitionFormula: `dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${topVal}, ${leftVal}) = ${table[i][j]}`,
            description: `Characters MISMATCH ('${charX}' != '${charY}'). Take maximum of top cell dp[${i - 1}][${j}] and left cell dp[${i}][${j - 1}].`,
            tableSnapshot: table.map(r => [...r]),
            highlightedLine: 13
          });
        }
      }
    }

    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [m, n]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  useEffect(() => {
    if (steps[currentStepIdx] && onStepChange) {
      onStepChange(currentStepIdx, steps[currentStepIdx].highlightedLine);
    }
  }, [currentStepIdx, steps, onStepChange]);

  const step = steps[currentStepIdx] || {
    row: 0,
    col: 0,
    val: 0,
    dependencies: [],
    transitionFormula: '',
    description: 'Ready.',
    tableSnapshot: []
  };

  const activeRow = selectedCell ? selectedCell[0] : step.row;
  const activeCol = selectedCell ? selectedCell[1] : step.col;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Top Bar with Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Dynamic Programming Table Engine ({algorithmType.toUpperCase()})
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('tabulation')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'tabulation'
                ? 'bg-blue-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tabulation Grid
          </button>
          <button
            onClick={() => setActiveTab('transition')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'transition'
                ? 'bg-blue-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            State Transitions
          </button>
          <button
            onClick={() => setActiveTab('memoization')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'memoization'
                ? 'bg-blue-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Memoization vs Tab
          </button>
        </div>
      </div>

      {activeTab === 'tabulation' && (
        <>
          {/* Strings Info */}
          <div className="flex items-center justify-center gap-6 text-xs font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div>
              String X (rows): <span className="text-purple-400 font-bold">"{strX}"</span>
            </div>
            <div>
              String Y (cols): <span className="text-amber-400 font-bold">"{strY}"</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              (Click any cell to inspect its direct dependencies)
            </div>
          </div>

          {/* Interactive 2D Grid */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex items-center justify-center overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs font-mono text-slate-500">i \ j</th>
                  <th className="p-2 text-xs font-mono text-slate-500 bg-slate-900/60 rounded">Ø</th>
                  {strY.split('').map((char, cIdx) => (
                    <th
                      key={cIdx}
                      className="p-2 text-xs font-mono text-amber-400 bg-slate-900/80 border border-slate-800/80 rounded"
                    >
                      {char} [{cIdx + 1}]
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {step.tableSnapshot.map((rowArr, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-2 text-xs font-mono text-purple-400 font-bold bg-slate-900/80 border border-slate-800/80 text-center rounded">
                      {rIdx === 0 ? 'Ø' : `${strX[rIdx - 1]} [${rIdx}]`}
                    </td>
                    {rowArr.map((cellVal, cIdx) => {
                      const isCurrent = activeRow === rIdx && activeCol === cIdx;
                      const isDependency = step.dependencies.some(
                        d => d[0] === rIdx && d[1] === cIdx
                      );

                      let cellBg = 'bg-slate-900/60 text-slate-300 border-slate-800';
                      if (isCurrent) {
                        cellBg =
                          'bg-purple-600 text-white font-bold border-purple-400 shadow-lg shadow-purple-600/40 scale-105';
                      } else if (isDependency) {
                        cellBg =
                          'bg-amber-500/80 text-slate-950 font-bold border-amber-300 animate-pulse';
                      } else if (cellVal !== null) {
                        cellBg = 'bg-slate-800/90 text-blue-300 border-slate-700';
                      }

                      return (
                        <td
                          key={cIdx}
                          onClick={() => setSelectedCell([rIdx, cIdx])}
                          className={`w-12 h-12 text-center text-xs font-mono border rounded cursor-pointer transition-all duration-300 ${cellBg}`}
                        >
                          {cellVal !== null ? cellVal : '·'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Formula & Dependency Banner */}
          <div className="bg-slate-950 border border-purple-900/50 p-3.5 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-purple-400 font-semibold tracking-wide">
                Cell Transition: dp[{activeRow}][{activeCol}]
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Step {currentStepIdx + 1} / {steps.length}
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm text-amber-300 font-semibold">
              {step.transitionFormula || 'dp[i][j] = 0'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentStepIdx(0);
                  setSelectedCell(null);
                }}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentStepIdx(prev => Math.max(0, prev - 1));
                  setSelectedCell(null);
                }}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/30 transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play Table Fill'}
              </button>
              <button
                onClick={() => {
                  setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1));
                  setSelectedCell(null);
                }}
                disabled={currentStepIdx >= steps.length - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'transition' && (
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg flex flex-col gap-4 text-xs sm:text-sm">
          <h4 className="font-semibold text-slate-200 text-sm">
            Optimal Substructure & Recurrence Formulation
          </h4>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono text-purple-300 leading-relaxed">
            dp[i][j] =
            <br />
            &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if i = 0 or j = 0
            <br />
            &nbsp;&nbsp;dp[i-1][j-1] + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if X[i-1] == Y[j-1] (Diagonal)
            <br />
            &nbsp;&nbsp;max(dp[i-1][j], dp[i][j-1]) &nbsp;if X[i-1] != Y[j-1] (Top / Left)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
              <span className="font-semibold text-amber-400">Match Intuition:</span>
              <p className="mt-1 text-slate-400 text-xs">
                When characters match, extending the optimal subsequence of prefixes X[0..i-2] and Y[0..j-2] guarantees maximal length without branch competition.
              </p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
              <span className="font-semibold text-blue-400">Mismatch Intuition:</span>
              <p className="mt-1 text-slate-400 text-xs">
                When characters do not match, the LCS cannot use both characters simultaneously. We greedily branch into two subproblems: ignore X[i-1] or ignore Y[j-1], picking whichever yielded longer.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'memoization' && (
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg flex flex-col gap-4 text-xs sm:text-sm">
          <h4 className="font-semibold text-slate-200 text-sm">
            Top-Down Memoization vs Bottom-Up Tabulation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
              <div className="font-semibold text-blue-400">Top-Down (Memoization)</div>
              <ul className="list-disc list-inside text-slate-300 space-y-1.5 text-xs">
                <li>Follows natural recursion tree from root to leaves.</li>
                <li>Only computes states that are actually queried (sparse evaluation).</li>
                <li>Incurs recursion function call stack overhead.</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
              <div className="font-semibold text-purple-400">Bottom-Up (Tabulation)</div>
              <ul className="list-disc list-inside text-slate-300 space-y-1.5 text-xs">
                <li>Solves subproblems iteratively starting from base cases.</li>
                <li>Completely avoids recursion stack overflow.</li>
                <li>Often allows massive memory reduction to O(1) or O(min(m, n)).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
