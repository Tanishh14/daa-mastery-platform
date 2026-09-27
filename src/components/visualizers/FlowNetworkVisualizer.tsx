import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface FlowStep {
  flows: Record<string, number>;
  activePath: string[];
  bottleneck: number;
  totalFlow: number;
  isMinCut: boolean;
  minCutS?: string[];
  minCutT?: string[];
  description: string;
}

export const FlowNetworkVisualizer: React.FC = () => {
  const nodes = [
    { id: 's', label: 'Source (s)', x: 70, y: 120 },
    { id: 'A', label: 'A', x: 220, y: 55 },
    { id: 'B', label: 'B', x: 220, y: 185 },
    { id: 't', label: 'Sink (t)', x: 380, y: 120 },
  ];

  const edgeCapacities: Record<string, number> = {
    's-A': 10,
    's-B': 8,
    'A-B': 2,
    'A-t': 7,
    'B-t': 10,
  };

  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const gen: FlowStep[] = [
      {
        flows: { 's-A': 0, 's-B': 0, 'A-B': 0, 'A-t': 0, 'B-t': 0 },
        activePath: [],
        bottleneck: 0,
        totalFlow: 0,
        isMinCut: false,
        description: 'Initial state: All edge flows f(u, v) = 0. Build residual graph G_f.'
      },
      {
        flows: { 's-A': 7, 's-B': 0, 'A-B': 0, 'A-t': 7, 'B-t': 0 },
        activePath: ['s', 'A', 't'],
        bottleneck: 7,
        totalFlow: 7,
        isMinCut: false,
        description: 'Augmenting Path 1: s -> A -> t. Bottleneck = min(10, 7) = 7. Push 7 units. Total flow = 7.'
      },
      {
        flows: { 's-A': 7, 's-B': 8, 'A-B': 0, 'A-t': 7, 'B-t': 8 },
        activePath: ['s', 'B', 't'],
        bottleneck: 8,
        totalFlow: 15,
        isMinCut: false,
        description: 'Augmenting Path 2: s -> B -> t. Bottleneck = min(8, 10) = 8. Push 8 units. Total flow = 7 + 8 = 15.'
      },
      {
        flows: { 's-A': 9, 's-B': 8, 'A-B': 2, 'A-t': 7, 'B-t': 10 },
        activePath: ['s', 'A', 'B', 't'],
        bottleneck: 2,
        totalFlow: 17,
        isMinCut: false,
        description: 'Augmenting Path 3: s -> A -> B -> t. Bottleneck = min(3, 2, 2) = 2. Push 2 units. Total flow = 17.'
      },
      {
        flows: { 's-A': 9, 's-B': 8, 'A-B': 2, 'A-t': 7, 'B-t': 10 },
        activePath: [],
        bottleneck: 0,
        totalFlow: 17,
        isMinCut: true,
        minCutS: ['s', 'A'],
        minCutT: ['B', 't'],
        description: '🏁 TERMINATION: No augmenting path exists in residual network G_f! MAX FLOW = 17. Min Cut partition: S={s, A}, T={B, t} with capacity = 17.'
      }
    ];

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
      }, 1400);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  const step = steps[currentStepIdx] || {
    flows: {},
    activePath: [],
    bottleneck: 0,
    totalFlow: 0,
    isMinCut: false,
    description: 'Ready.'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Network Flow & Max-Flow Min-Cut Visualizer
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Max Flow:{' '}
          <span className="text-emerald-400 font-bold text-sm">{step.totalFlow}</span> units
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 460 240" className="w-full max-w-[520px] h-[240px]">
          {/* Edges with flow/capacity labels */}
          {Object.entries(edgeCapacities).map(([key, cap]) => {
            const [uId, vId] = key.split('-');
            const uNode = nodes.find(n => n.id === uId)!;
            const vNode = nodes.find(n => n.id === vId)!;
            const flow = step.flows[key] || 0;

            const isPathEdge =
              step.activePath.includes(uId) &&
              step.activePath.includes(vId) &&
              step.activePath.indexOf(vId) === step.activePath.indexOf(uId) + 1;

            const isSaturated = flow === cap;

            let strokeColor = '#334155';
            let strokeWidth = 2.5;
            if (isPathEdge) {
              strokeColor = '#38bdf8';
              strokeWidth = 4;
            } else if (isSaturated) {
              strokeColor = '#ef4444';
            }

            const midX = (uNode.x + vNode.x) / 2;
            const midY = (uNode.y + vNode.y) / 2;

            return (
              <g key={key}>
                <line
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-300"
                />
                {/* Arrowhead marker */}
                <polygon
                  points={`${midX},${midY} ${midX - 6},${midY - 4} ${midX - 6},${midY + 4}`}
                  fill={strokeColor}
                  transform={`rotate(${
                    (Math.atan2(vNode.y - uNode.y, vNode.x - uNode.x) * 180) / Math.PI
                  }, ${midX}, ${midY})`}
                />
                {/* Flow / Capacity badge */}
                <g transform={`translate(${midX}, ${midY - 14})`}>
                  <rect
                    x="-20"
                    y="-9"
                    width="40"
                    height="17"
                    rx="4"
                    fill="#0f172a"
                    stroke={isSaturated ? '#ef4444' : '#1e293b'}
                  />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill={isSaturated ? '#f87171' : '#94a3b8'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {flow}/{cap}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Min Cut Line if reached */}
          {step.isMinCut && (
            <line
              x1="280"
              y1="20"
              x2="280"
              y2="220"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
          )}

          {/* Nodes */}
          {nodes.map(node => {
            const isSource = node.id === 's';
            const isSink = node.id === 't';
            const inCutS = step.minCutS && step.minCutS.includes(node.id);

            let nodeFill = '#1e293b';
            let strokeColor = '#475569';
            if (isSource) {
              nodeFill = '#1e3a8a';
              strokeColor = '#60a5fa';
            } else if (isSink) {
              nodeFill = '#065f46';
              strokeColor = '#34d399';
            } else if (inCutS) {
              nodeFill = '#312e81';
              strokeColor = '#818cf8';
            }

            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="22" fill={nodeFill} stroke={strokeColor} strokeWidth="2.5" />
                <text
                  x={node.x}
                  y={node.y + 4.5}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Description Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
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
            {isPlaying ? 'Pause' : 'Play Augmentation'}
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
