import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface NQueensStep {
  board: number[]; // row -> col (or -1 if unplaced)
  currentRow: number;
  currentCol: number;
  conflict: boolean;
  conflictReason?: string;
  isSolution: boolean;
  solutionsCount: number;
  description: string;
}

export const BacktrackingVisualizer: React.FC = () => {
  const [n, setN] = useState<number>(4);
  const [steps, setSteps] = useState<NQueensStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const gen: NQueensStep[] = [];
    const board = Array(n).fill(-1);
    let count = 0;

    const isSafe = (r: number, c: number) => {
      for (let prevR = 0; prevR < r; prevR++) {
        const prevC = board[prevR];
        if (prevC === c) {
          return { safe: false, reason: `Queen at row ${prevR}, col ${c} attacks vertically` };
        }
        if (Math.abs(prevR - r) === Math.abs(prevC - c)) {
          return { safe: false, reason: `Queen at (${prevR}, ${prevC}) attacks diagonally` };
        }
      }
      return { safe: true, reason: '' };
    };

    const solve = (r: number) => {
      if (r === n) {
        count++;
        gen.push({
          board: [...board],
          currentRow: r,
          currentCol: -1,
          conflict: false,
          isSolution: true,
          solutionsCount: count,
          description: `🎉 VALID SOLUTION #${count} FOUND! All ${n} queens placed with zero attacks.`
        });
        return;
      }

      for (let c = 0; c < n; c++) {
        const check = isSafe(r, c);
        board[r] = c;

        if (check.safe) {
          gen.push({
            board: [...board],
            currentRow: r,
            currentCol: c,
            conflict: false,
            isSolution: false,
            solutionsCount: count,
            description: `Place Queen at row ${r}, col ${c}. Position is safe. Recur on row ${r + 1}.`
          });
          solve(r + 1);
        } else {
          gen.push({
            board: [...board],
            currentRow: r,
            currentCol: c,
            conflict: true,
            conflictReason: check.reason,
            isSolution: false,
            solutionsCount: count,
            description: `✕ PRUNE INVALID BRANCH: Queen at (${r}, ${c}) conflicts: ${check.reason}. Backtrack!`
          });
        }
        board[r] = -1;
      }
    };

    gen.push({
      board: Array(n).fill(-1),
      currentRow: 0,
      currentCol: -1,
      conflict: false,
      isSolution: false,
      solutionsCount: 0,
      description: `Begin ${n}-Queens State Space Tree exploration on an empty ${n}x${n} board.`
    });

    solve(0);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [n]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 700);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  const step = steps[currentStepIdx] || {
    board: Array(n).fill(-1),
    currentRow: 0,
    currentCol: -1,
    conflict: false,
    isSolution: false,
    solutionsCount: 0,
    description: 'Ready.'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header & Size Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            N-Queens Backtracking & State-Space Pruning
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Board Size (N):</span>
          {[4, 5, 6].map(val => (
            <button
              key={val}
              onClick={() => setN(val)}
              className={`px-2.5 py-1 text-xs rounded font-mono transition ${
                n === val
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {val}x{val}
            </button>
          ))}
        </div>
      </div>

      {/* Chessboard */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center">
        <div
          className="grid gap-1 border-2 border-slate-700 p-1.5 rounded-lg bg-slate-900 shadow-xl"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: n }).map((_, rIdx) =>
            Array.from({ length: n }).map((_, cIdx) => {
              const isDarkSquare = (rIdx + cIdx) % 2 === 1;
              const hasQueen = step.board[rIdx] === cIdx;
              const isCurrentCell = step.currentRow === rIdx && step.currentCol === cIdx;

              let squareBg = isDarkSquare ? 'bg-slate-800' : 'bg-slate-700/60';
              if (isCurrentCell) {
                if (step.conflict) squareBg = 'bg-rose-950 border border-rose-500';
                else squareBg = 'bg-amber-950 border border-amber-400';
              } else if (step.isSolution && hasQueen) {
                squareBg = 'bg-emerald-950 border border-emerald-400';
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded flex items-center justify-center text-xl transition-all duration-200 ${squareBg}`}
                >
                  {hasQueen && (
                    <span
                      className={`font-bold transition-transform duration-300 ${
                        step.conflict && isCurrentCell
                          ? 'text-rose-400 scale-125'
                          : step.isSolution
                          ? 'text-emerald-400 scale-110'
                          : 'text-amber-300 scale-100'
                      }`}
                    >
                      ♛
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* State / Conflict Banner */}
      <div
        className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors ${
          step.conflict
            ? 'bg-rose-950/50 border-rose-800 text-rose-200'
            : step.isSolution
            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
            : 'bg-slate-950 border-slate-800 text-slate-200'
        }`}
      >
        <div className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 shrink-0">
          Step {currentStepIdx + 1} / {steps.length}
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIdx(0)}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/30 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play Backtracking'}
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Total Solutions: <span className="text-emerald-400 font-bold">{step.solutionsCount}</span>
        </div>
      </div>
    </div>
  );
};
