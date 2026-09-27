import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface SudokuStep {
  board: number[][];
  currR: number;
  currC: number;
  val: number;
  conflict: boolean;
  description: string;
}

export const SudokuVisualizer: React.FC = () => {
  // 4x4 Mini-Sudoku for crystal-clear visual comprehension (or 9x9)
  const initialGrid = [
    [1, 0, 0, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [3, 0, 0, 2],
  ];

  const [steps, setSteps] = useState<SudokuStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const gen: SudokuStep[] = [];
    const board = initialGrid.map(r => [...r]);

    const isSafe = (b: number[][], r: number, c: number, num: number) => {
      // Row and col check
      for (let i = 0; i < 4; i++) {
        if (b[r][i] === num) return false;
        if (b[i][c] === num) return false;
      }
      // 2x2 box check
      const startR = Math.floor(r / 2) * 2;
      const startC = Math.floor(c / 2) * 2;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (b[startR + i][startC + j] === num) return false;
        }
      }
      return true;
    };

    const solve = (b: number[][], r = 0, c = 0): boolean => {
      if (r === 4) return true;
      const nextR = c === 3 ? r + 1 : r;
      const nextC = c === 3 ? 0 : c + 1;

      if (initialGrid[r][c] !== 0) {
        return solve(b, nextR, nextC);
      }

      for (let num = 1; num <= 4; num++) {
        const safe = isSafe(b, r, c, num);
        b[r][c] = num;

        if (safe) {
          gen.push({
            board: b.map(row => [...row]),
            currR: r,
            currC: c,
            val: num,
            conflict: false,
            description: `Candidate ${num} at (${r}, ${c}) is safe! Advance to next cell.`
          });

          if (solve(b, nextR, nextC)) return true;

          // Backtrack
          b[r][c] = 0;
          gen.push({
            board: b.map(row => [...row]),
            currR: r,
            currC: c,
            val: 0,
            conflict: true,
            description: `Future dead end encountered. Backtrack: reset cell (${r}, ${c}) = 0.`
          });
        } else {
          gen.push({
            board: b.map(row => [...row]),
            currR: r,
            currC: c,
            val: num,
            conflict: true,
            description: `Candidate ${num} at (${r}, ${c}) conflicts with row, column, or 2x2 box! Try next number.`
          });
          b[r][c] = 0;
        }
      }

      return false;
    };

    gen.push({
      board: initialGrid.map(r => [...r]),
      currR: -1,
      currC: -1,
      val: 0,
      conflict: false,
      description: 'Initial Sudoku puzzle loaded. Ready for backtracking.'
    });

    solve(board);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 600);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  const step = steps[currentStepIdx] || {
    board: initialGrid,
    currR: -1,
    currC: -1,
    val: 0,
    conflict: false,
    description: 'Ready.'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Sudoku Constraint Propagation & Backtracking
          </h3>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center">
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900 rounded-lg border-2 border-slate-700 shadow-xl">
          {step.board.map((row, rIdx) =>
            row.map((cellVal, cIdx) => {
              const isFixed = initialGrid[rIdx][cIdx] !== 0;
              const isCurrent = step.currR === rIdx && step.currC === cIdx;

              let cellBg = isFixed ? 'bg-slate-800 font-bold text-slate-200' : 'bg-slate-900/80 text-cyan-400';
              if (isCurrent) {
                cellBg = step.conflict
                  ? 'bg-rose-950 border border-rose-500 text-rose-300'
                  : 'bg-cyan-950 border border-cyan-400 text-cyan-200';
              }

              // Visual 2x2 box border boundaries
              const rightBorder = cIdx === 1 ? 'border-r-2 border-r-slate-500' : '';
              const bottomBorder = rIdx === 1 ? 'border-b-2 border-b-slate-500' : '';

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-14 h-14 rounded flex items-center justify-center text-lg font-mono transition-all duration-200 border border-slate-800 ${cellBg} ${rightBorder} ${bottomBorder}`}
                >
                  {cellVal !== 0 ? cellVal : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Description */}
      <div
        className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors ${
          step.conflict
            ? 'bg-rose-950/50 border-rose-800 text-rose-200'
            : 'bg-slate-950 border-slate-800 text-slate-200'
        }`}
      >
        <div className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 shrink-0">
          Step {currentStepIdx + 1} / {steps.length}
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed">{step.description}</p>
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/30 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play Sudoku'}
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
