import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Search } from 'lucide-react';

interface SearchingVisualizerProps {
  onStepChange?: (stepIndex: number, currentLine?: number) => void;
}

interface SearchStep {
  left: number;
  right: number;
  mid: number;
  target: number;
  foundIndex: number | null;
  description: string;
  eliminatedRange?: [number, number];
  highlightedLine?: number;
}

export const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ onStepChange }) => {
  const [array] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
  const [target, setTarget] = useState<number>(23);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const generateBinarySearchSteps = useCallback((arr: number[], tgt: number): SearchStep[] => {
    const gen: SearchStep[] = [];
    let l = 0;
    let r = arr.length - 1;

    gen.push({
      left: l,
      right: r,
      mid: -1,
      target: tgt,
      foundIndex: null,
      description: `Initial state: search entire range [${l}..${r}] for target = ${tgt}.`,
      highlightedLine: 5
    });

    while (l <= r) {
      const mid = Math.floor(l + (r - l) / 2);
      const midVal = arr[mid];

      gen.push({
        left: l,
        right: r,
        mid,
        target: tgt,
        foundIndex: null,
        description: `Compute mid = ${l} + (${r} - ${l})/2 = ${mid} (value = ${midVal}). Comparing ${midVal} with target ${tgt}.`,
        highlightedLine: 9
      });

      if (midVal === tgt) {
        gen.push({
          left: l,
          right: r,
          mid,
          target: tgt,
          foundIndex: mid,
          description: `MATCH FOUND! arr[${mid}] == ${tgt}. Binary search terminates in logarithmic time.`,
          highlightedLine: 12
        });
        return gen;
      } else if (midVal < tgt) {
        gen.push({
          left: mid + 1,
          right: r,
          mid,
          target: tgt,
          foundIndex: null,
          eliminatedRange: [l, mid],
          description: `${midVal} < ${tgt}. Target must be in right half. Eliminate range [${l}..${mid}], set left = ${mid + 1}.`,
          highlightedLine: 14
        });
        l = mid + 1;
      } else {
        gen.push({
          left: l,
          right: mid - 1,
          mid,
          target: tgt,
          foundIndex: null,
          eliminatedRange: [mid, r],
          description: `${midVal} > ${tgt}. Target must be in left half. Eliminate range [${mid}..${r}], set right = ${mid - 1}.`,
          highlightedLine: 16
        });
        r = mid - 1;
      }
    }

    gen.push({
      left: l,
      right: r,
      mid: -1,
      target: tgt,
      foundIndex: -1,
      description: `Search range exhausted (left > right). Target ${tgt} is NOT present in array. Return -1.`,
      highlightedLine: 19
    });

    return gen;
  }, []);

  useEffect(() => {
    const s = generateBinarySearchSteps(array, target);
    setSteps(s);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [array, target, generateBinarySearchSteps]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 900);
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
    left: 0,
    right: array.length - 1,
    mid: -1,
    target,
    foundIndex: null,
    description: 'Ready.'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header and Target Input */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Binary Search Domain Reduction
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Value:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value, 10) || 0)}
            className="bg-slate-950 border border-slate-700 text-xs px-3 py-1.5 rounded-lg text-blue-400 font-mono w-20 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => {
              const randVal = array[Math.floor(Math.random() * array.length)];
              setTarget(randVal);
            }}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            Pick From Array
          </button>
        </div>
      </div>

      {/* Array Elements with Range Indicators */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-6 flex flex-col gap-4 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {array.map((val, idx) => {
            const isMid = step.mid === idx;
            const isLeft = step.left === idx;
            const isRight = step.right === idx;
            const isFound = step.foundIndex === idx;
            const isOutOfRange = idx < step.left || idx > step.right;

            let cardBg = 'bg-slate-800/90 border-slate-700 text-slate-200';
            if (isFound) {
              cardBg = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 scale-105';
            } else if (isMid) {
              cardBg = 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105';
            } else if (isOutOfRange) {
              cardBg = 'bg-slate-900/40 border-slate-800 text-slate-600 line-through opacity-40';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[42px]">
                {/* Pointer tags above */}
                <div className="h-5 flex items-center justify-center font-mono text-[11px] font-bold">
                  {isMid && <span className="text-amber-400">M</span>}
                  {!isMid && isLeft && isRight && <span className="text-blue-400">L,R</span>}
                  {!isMid && isLeft && !isRight && <span className="text-blue-400">L</span>}
                  {!isMid && isRight && !isLeft && <span className="text-purple-400">R</span>}
                </div>

                {/* Number Box */}
                <div
                  className={`w-11 h-12 rounded-lg border flex items-center justify-center font-mono text-sm font-semibold transition-all duration-300 ${cardBg}`}
                >
                  {val}
                </div>

                {/* Index tag below */}
                <span className="text-[10px] text-slate-500 font-mono">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500"></span> L (Left Bound)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> M (Midpoint / Pivot)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-500"></span> R (Right Bound)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Target Matched
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-700 opacity-40"></span> Eliminated Half
          </div>
        </div>
      </div>

      {/* Step explanation */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded shrink-0">
          Step {currentStepIdx + 1} / {steps.length}
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
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
          Search Space: <span className="text-blue-400 font-semibold">{Math.max(0, step.right - step.left + 1)}</span> elements
        </div>
      </div>
    </div>
  );
};
