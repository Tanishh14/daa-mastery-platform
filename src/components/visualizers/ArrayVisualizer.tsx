import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface ArrayVisualizerProps {
  initialArray?: number[];
  algorithmType?: string;
  onStepChange?: (stepIndex: number, currentLine?: number) => void;
}

interface Step {
  array: number[];
  comparing: number[];
  swapping: number[];
  pivot?: number;
  pointers: Record<string, number>;
  description: string;
  highlightedLine?: number;
  sortedIndices: number[];
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  initialArray = [38, 27, 43, 3, 9, 82, 10],
  algorithmType = 'merge-sort',
  onStepChange,
}) => {
  const [arrayInput, setArrayInput] = useState<string>(initialArray.join(', '));
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(700);
  const timerRef = useRef<number | null>(null);

  // Generate steps based on algorithm type
  const generateSteps = useCallback((rawArr: number[]): Step[] => {
    const arr = [...rawArr];
    const generated: Step[] = [];

    if (algorithmType === 'quick-sort') {
      // Generate Quicksort steps with Lomuto partition
      const work = [...arr];
      generated.push({
        array: [...work],
        comparing: [],
        swapping: [],
        pointers: {},
        description: 'Initial array before quicksort partitioning.',
        highlightedLine: 24,
        sortedIndices: []
      });

      const partition = (low: number, high: number) => {
        const pivot = work[high];
        let i = low - 1;
        generated.push({
          array: [...work],
          comparing: [],
          swapping: [],
          pivot: high,
          pointers: { low, high, i, pivot: high },
          description: `Chosen pivot: ${pivot} at index ${high}.`,
          highlightedLine: 6,
          sortedIndices: []
        });

        for (let j = low; j < high; j++) {
          generated.push({
            array: [...work],
            comparing: [j, high],
            swapping: [],
            pivot: high,
            pointers: { low, high, i, j, pivot: high },
            description: `Comparing A[${j}] (${work[j]}) with pivot (${pivot}).`,
            highlightedLine: 10,
            sortedIndices: []
          });

          if (work[j] <= pivot) {
            i++;
            const tmp = work[i]; work[i] = work[j]; work[j] = tmp;
            generated.push({
              array: [...work],
              comparing: [],
              swapping: [i, j],
              pivot: high,
              pointers: { low, high, i, j, pivot: high },
              description: `${work[i]} <= ${pivot}. Increment i to ${i} and swap A[${i}] with A[${j}].`,
              highlightedLine: 12,
              sortedIndices: []
            });
          }
        }

        const tmp = work[i + 1]; work[i + 1] = work[high]; work[high] = tmp;
        const pi = i + 1;
        generated.push({
          array: [...work],
          comparing: [],
          swapping: [pi, high],
          pivot: pi,
          pointers: { pivot: pi },
          description: `Place pivot ${work[pi]} into its permanent sorted index ${pi}.`,
          highlightedLine: 16,
          sortedIndices: [pi]
        });
        return pi;
      };

      const qs = (low: number, high: number) => {
        if (low < high) {
          const pi = partition(low, high);
          qs(low, pi - 1);
          qs(pi + 1, high);
        }
      };

      qs(0, work.length - 1);
      generated.push({
        array: [...work],
        comparing: [],
        swapping: [],
        pointers: {},
        description: 'Quick Sort complete! All elements partitioned and sorted in-place.',
        highlightedLine: 28,
        sortedIndices: work.map((_, idx) => idx)
      });
    } else {
      // Default: Merge Sort step generator
      const work = [...arr];
      generated.push({
        array: [...work],
        comparing: [],
        swapping: [],
        pointers: {},
        description: 'Initial unsorted array before divide-and-conquer.',
        highlightedLine: 24,
        sortedIndices: []
      });

      const merge = (left: number, mid: number, right: number) => {
        const leftArr = work.slice(left, mid + 1);
        const rightArr = work.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        generated.push({
          array: [...work],
          comparing: [],
          swapping: [],
          pointers: { left, mid, right },
          description: `Merging sorted subarrays [${left}..${mid}] and [${mid + 1}..${right}].`,
          highlightedLine: 5,
          sortedIndices: []
        });

        while (i < leftArr.length && j < rightArr.length) {
          generated.push({
            array: [...work],
            comparing: [left + i, mid + 1 + j],
            swapping: [],
            pointers: { left, right, curr: k },
            description: `Compare ${leftArr[i]} and ${rightArr[j]}. Smallest goes to index ${k}.`,
            highlightedLine: 13,
            sortedIndices: []
          });

          if (leftArr[i] <= rightArr[j]) {
            work[k] = leftArr[i];
            i++;
          } else {
            work[k] = rightArr[j];
            j++;
          }
          k++;
        }

        while (i < leftArr.length) {
          work[k] = leftArr[i];
          i++; k++;
        }
        while (j < rightArr.length) {
          work[k] = rightArr[j];
          j++; k++;
        }

        generated.push({
          array: [...work],
          comparing: [],
          swapping: [],
          pointers: { left, right },
          description: `Merged range [${left}..${right}]: [${work.slice(left, right + 1).join(', ')}]`,
          highlightedLine: 20,
          sortedIndices: left === 0 && right === work.length - 1 ? work.map((_, idx) => idx) : []
        });
      };

      const ms = (left: number, right: number) => {
        if (left < right) {
          const mid = Math.floor(left + (right - left) / 2);
          ms(left, mid);
          ms(mid + 1, right);
          merge(left, mid, right);
        }
      };

      ms(0, work.length - 1);
      generated.push({
        array: [...work],
        comparing: [],
        swapping: [],
        pointers: {},
        description: 'Merge Sort complete! Array fully sorted in O(n log n).',
        highlightedLine: 28,
        sortedIndices: work.map((_, idx) => idx)
      });
    }

    return generated;
  }, [algorithmType]);

  // Initialize steps when arrayInput changes
  useEffect(() => {
    try {
      const parsed = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length > 0) {
        const gen = generateSteps(parsed);
        setSteps(gen);
        setCurrentStepIdx(0);
        setIsPlaying(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [arrayInput, generateSteps]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  // Inform parent of current step line
  useEffect(() => {
    if (steps[currentStepIdx] && onStepChange) {
      onStepChange(currentStepIdx, steps[currentStepIdx].highlightedLine);
    }
  }, [currentStepIdx, steps, onStepChange]);

  const step = steps[currentStepIdx] || {
    array: initialArray,
    comparing: [],
    swapping: [],
    pointers: {},
    description: 'Ready.',
    sortedIndices: []
  };

  const maxVal = Math.max(...step.array, 1);

  const handleRandomize = () => {
    const len = 7 + Math.floor(Math.random() * 4);
    const rand = Array.from({ length: len }, () => Math.floor(Math.random() * 95) + 5);
    setArrayInput(rand.join(', '));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Top Header & Custom Input */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Interactive Array Visualizer ({algorithmType.replace('-', ' ').toUpperCase()})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="e.g. 38, 27, 43, 3, 9"
            className="bg-slate-950 border border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono w-48"
          />
          <button
            onClick={handleRandomize}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            Randomize
          </button>
        </div>
      </div>

      {/* Visual Bars Container */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-6 min-h-[240px] flex items-end justify-center gap-3 sm:gap-4 overflow-x-auto relative">
        {step.array.map((val, idx) => {
          const isComparing = step.comparing.includes(idx);
          const isSwapping = step.swapping.includes(idx);
          const isPivot = step.pivot === idx;
          const isSorted = step.sortedIndices.includes(idx);

          let barColor = 'bg-blue-600/80 border-blue-400';
          let textColor = 'text-blue-300';
          if (isComparing) {
            barColor = 'bg-amber-500 border-amber-300 animate-pulse';
            textColor = 'text-amber-300 font-bold';
          } else if (isSwapping) {
            barColor = 'bg-rose-500 border-rose-300';
            textColor = 'text-rose-300 font-bold';
          } else if (isPivot) {
            barColor = 'bg-purple-600 border-purple-300';
            textColor = 'text-purple-300 font-bold';
          } else if (isSorted) {
            barColor = 'bg-emerald-600 border-emerald-400';
            textColor = 'text-emerald-300 font-semibold';
          }

          const heightPercent = Math.max(18, Math.round((val / maxVal) * 160));

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[54px] min-w-[36px]">
              {/* Value tag */}
              <span className={`text-xs font-mono transition-colors ${textColor}`}>
                {val}
              </span>
              {/* Dynamic Bar */}
              <div
                style={{ height: `${heightPercent}px` }}
                className={`w-full rounded-t-md border-t-2 border-x shadow-md transition-all duration-300 flex items-center justify-center ${barColor}`}
              >
                {isPivot && <span className="text-[10px] text-white font-bold">P</span>}
              </div>
              {/* Index & Pointers */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-mono">[{idx}]</span>
                {/* Active pointer indicators */}
                <div className="flex flex-col text-[10px] font-mono leading-tight">
                  {Object.entries(step.pointers).map(([name, pIdx]) => (
                    pIdx === idx ? (
                      <span key={name} className="text-amber-400 font-semibold">
                        ↑ {name}
                      </span>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operation Explanation Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded shrink-0">
          Step {currentStepIdx + 1} / {Math.max(steps.length, 1)}
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIdx(0)}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play
              </>
            )}
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIdx >= steps.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Speed:</span>
          <input
            type="range"
            min="150"
            max="1500"
            step="50"
            value={1650 - speedMs}
            onChange={(e) => setSpeedMs(1650 - parseInt(e.target.value, 10))}
            className="w-24 accent-blue-500"
          />
          <span className="font-mono text-slate-300 w-12 text-right">
            {(1000 / speedMs).toFixed(1)}x
          </span>
        </div>
      </div>
    </div>
  );
};
