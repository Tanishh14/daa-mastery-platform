import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface NodePos {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface EdgeDef {
  u: string;
  v: string;
  weight?: number;
  isDirected?: boolean;
}

interface GraphStep {
  visited: string[];
  activeNode: string | null;
  activeEdge: [string, string] | null;
  queueOrStack: string[];
  distances: Record<string, number | string>;
  inDegrees?: Record<string, number>;
  mstEdges?: [string, string][];
  description: string;
  highlightedLine?: number;
}

interface GraphVisualizerProps {
  algorithmType?: 'bfs' | 'dfs' | 'topological-sort' | 'dijkstra' | 'kruskal' | 'prim';
  onStepChange?: (stepIndex: number, currentLine?: number) => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  algorithmType = 'bfs',
  onStepChange
}) => {
  // Canonical sample graph node coordinates
  const nodes: NodePos[] = [
    { id: '0', label: '0', x: 80, y: 130 },
    { id: '1', label: '1', x: 200, y: 60 },
    { id: '2', label: '2', x: 200, y: 200 },
    { id: '3', label: '3', x: 330, y: 60 },
    { id: '4', label: '4', x: 330, y: 200 },
    { id: '5', label: '5', x: 450, y: 130 },
  ];

  // Canonical edges
  const edges: EdgeDef[] = [
    { u: '0', v: '1', weight: 4 },
    { u: '0', v: '2', weight: 2 },
    { u: '1', v: '2', weight: 1 },
    { u: '1', v: '3', weight: 5 },
    { u: '2', v: '4', weight: 8 },
    { u: '2', v: '3', weight: 10 },
    { u: '3', v: '4', weight: 2 },
    { u: '3', v: '5', weight: 6 },
    { u: '4', v: '5', weight: 3 },
  ];

  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Generate steps based on algorithm
  useEffect(() => {
    const gen: GraphStep[] = [];

    if (algorithmType === 'topological-sort') {
      // Directed DAG
      gen.push({
        visited: [],
        activeNode: null,
        activeEdge: null,
        queueOrStack: ['0'],
        distances: {},
        inDegrees: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 2 },
        description: 'Initialize in-degrees. Node 0 has in-degree 0: Enqueue 0.',
        highlightedLine: 12
      });
      gen.push({
        visited: ['0'],
        activeNode: '0',
        activeEdge: ['0', '1'],
        queueOrStack: [],
        distances: {},
        inDegrees: { '0': 0, '1': 0, '2': 1, '3': 2, '4': 2, '5': 2 },
        description: 'Dequeue 0. Decrement neighbor 1 in-degree to 0. Enqueue 1.',
        highlightedLine: 18
      });
      gen.push({
        visited: ['0'],
        activeNode: '0',
        activeEdge: ['0', '2'],
        queueOrStack: ['1', '2'],
        distances: {},
        inDegrees: { '0': 0, '1': 0, '2': 0, '3': 2, '4': 2, '5': 2 },
        description: 'Decrement neighbor 2 in-degree to 0. Enqueue 2.',
        highlightedLine: 20
      });
      gen.push({
        visited: ['0', '1'],
        activeNode: '1',
        activeEdge: ['1', '3'],
        queueOrStack: ['2', '3'],
        distances: {},
        inDegrees: { '0': 0, '1': 0, '2': 0, '3': 1, '4': 2, '5': 2 },
        description: 'Dequeue 1. Append 1 to topological order. Decrement neighbor 3 in-degree to 1.',
        highlightedLine: 22
      });
      gen.push({
        visited: ['0', '1', '2'],
        activeNode: '2',
        activeEdge: ['2', '4'],
        queueOrStack: ['3', '4'],
        distances: {},
        inDegrees: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 1, '5': 2 },
        description: 'Dequeue 2. Append 2 to order. Decrement neighbors 3 and 4.',
        highlightedLine: 24
      });
      gen.push({
        visited: ['0', '1', '2', '3', '4', '5'],
        activeNode: null,
        activeEdge: null,
        queueOrStack: [],
        distances: {},
        inDegrees: { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        description: 'Topological Sort complete! Valid DAG ordering: [0, 1, 2, 3, 4, 5].',
        highlightedLine: 28
      });
    } else if (algorithmType === 'dijkstra') {
      // Dijkstra Single-Source Shortest Path
      gen.push({
        visited: [],
        activeNode: '0',
        activeEdge: null,
        queueOrStack: ['(dist:0, node:0)'],
        distances: { '0': 0, '1': '∞', '2': '∞', '3': '∞', '4': '∞', '5': '∞' },
        description: 'Initialize source dist[0] = 0, all others = ∞. Push (0, 0) to Min-Heap.',
        highlightedLine: 12
      });
      gen.push({
        visited: ['0'],
        activeNode: '0',
        activeEdge: ['0', '2'],
        queueOrStack: ['(2, 2)', '(4, 1)'],
        distances: { '0': 0, '1': 4, '2': 2, '3': '∞', '4': '∞', '5': '∞' },
        description: 'Pop (0, 0). Relax edges (0->1: weight 4) and (0->2: weight 2). dist[2]=2, dist[1]=4.',
        highlightedLine: 18
      });
      gen.push({
        visited: ['0', '2'],
        activeNode: '2',
        activeEdge: ['2', '1'],
        queueOrStack: ['(3, 1)', '(4, 1)', '(10, 4)'],
        distances: { '0': 0, '1': 3, '2': 2, '3': 12, '4': 10, '5': '∞' },
        description: 'Pop min (2, 2). Relax neighbor 1 via edge (2-1: 1): dist[2]+1 = 3 < 4! Shortcut found! Update dist[1] = 3.',
        highlightedLine: 22
      });
      gen.push({
        visited: ['0', '2', '1'],
        activeNode: '1',
        activeEdge: ['1', '3'],
        queueOrStack: ['(8, 3)', '(10, 4)'],
        distances: { '0': 0, '1': 3, '2': 2, '3': 8, '4': 10, '5': '∞' },
        description: 'Pop min (3, 1). Relax neighbor 3 via edge (1-3: 5): dist[1]+5 = 8 < ∞. Update dist[3] = 8.',
        highlightedLine: 24
      });
      gen.push({
        visited: ['0', '2', '1', '3', '4', '5'],
        activeNode: null,
        activeEdge: null,
        queueOrStack: [],
        distances: { '0': 0, '1': 3, '2': 2, '3': 8, '4': 10, '5': 13 },
        description: 'All vertices finalized! Final shortest path distances computed in O(|E| log |V|).',
        highlightedLine: 28
      });
    } else {
      // Default: BFS Traversal
      gen.push({
        visited: ['0'],
        activeNode: '0',
        activeEdge: null,
        queueOrStack: ['0'],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Start BFS at node 0. Mark 0 visited. Enqueue 0. Queue: [0].',
        highlightedLine: 9
      });
      gen.push({
        visited: ['0', '1'],
        activeNode: '0',
        activeEdge: ['0', '1'],
        queueOrStack: ['1'],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Dequeue 0. Discover unvisited neighbor 1. Mark 1 visited, dist[1] = 1, Enqueue 1.',
        highlightedLine: 16
      });
      gen.push({
        visited: ['0', '1', '2'],
        activeNode: '0',
        activeEdge: ['0', '2'],
        queueOrStack: ['1', '2'],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Discover unvisited neighbor 2. Mark 2 visited, dist[2] = 1, Enqueue 2. Queue: [1, 2].',
        highlightedLine: 18
      });
      gen.push({
        visited: ['0', '1', '2', '3'],
        activeNode: '1',
        activeEdge: ['1', '3'],
        queueOrStack: ['2', '3'],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Dequeue 1. Discover neighbor 3 at distance 2. Enqueue 3.',
        highlightedLine: 20
      });
      gen.push({
        visited: ['0', '1', '2', '3', '4'],
        activeNode: '2',
        activeEdge: ['2', '4'],
        queueOrStack: ['3', '4'],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Dequeue 2. Discover neighbor 4 at distance 2. Enqueue 4. Queue: [3, 4].',
        highlightedLine: 22
      });
      gen.push({
        visited: ['0', '1', '2', '3', '4', '5'],
        activeNode: '3',
        activeEdge: ['3', '5'],
        queueOrStack: ['4', '5'],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Dequeue 3. Discover neighbor 5 at distance 3. Enqueue 5.',
        highlightedLine: 24
      });
      gen.push({
        visited: ['0', '1', '2', '3', '4', '5'],
        activeNode: null,
        activeEdge: null,
        queueOrStack: [],
        distances: { '0': 0, '1': 1, '2': 1, '3': 2, '4': 2, '5': 3 },
        description: 'Queue empty. Level-by-level BFS traversal complete in O(|V| + |E|)!',
        highlightedLine: 28
      });
    }

    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [algorithmType]);

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
    visited: [],
    activeNode: null,
    activeEdge: null,
    queueOrStack: [],
    distances: {},
    description: 'Ready.'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            Graph Visualizer ({algorithmType.replace('-', ' ').toUpperCase()})
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Vertices: <span className="text-blue-400">{nodes.length}</span> | Edges:{' '}
          <span className="text-blue-400">{edges.length}</span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 540 260" className="w-full max-w-[580px] h-[260px]">
          {/* Render Edges */}
          {edges.map((e, idx) => {
            const uNode = nodes.find(n => n.id === e.u)!;
            const vNode = nodes.find(n => n.id === e.v)!;
            const isActiveEdge =
              step.activeEdge &&
              ((step.activeEdge[0] === e.u && step.activeEdge[1] === e.v) ||
                (step.activeEdge[0] === e.v && step.activeEdge[1] === e.u));

            const isMstEdge =
              step.mstEdges &&
              step.mstEdges.some(
                m => (m[0] === e.u && m[1] === e.v) || (m[0] === e.v && m[1] === e.u)
              );

            let strokeColor = '#334155';
            let strokeWidth = 2;
            if (isActiveEdge) {
              strokeColor = '#f59e0b';
              strokeWidth = 3.5;
            } else if (isMstEdge) {
              strokeColor = '#10b981';
              strokeWidth = 3;
            }

            const midX = (uNode.x + vNode.x) / 2;
            const midY = (uNode.y + vNode.y) / 2;

            return (
              <g key={idx}>
                <line
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-300"
                />
                {/* Weight badge */}
                {e.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <circle r="9" fill="#0f172a" stroke="#1e293b" />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {e.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map(node => {
            const isVisited = step.visited.includes(node.id);
            const isActive = step.activeNode === node.id;
            const dist = step.distances[node.id];

            let fillColor = '#1e293b';
            let strokeColor = '#475569';
            let textColor = '#f1f5f9';

            if (isActive) {
              fillColor = '#f59e0b';
              strokeColor = '#fde68a';
              textColor = '#0f172a';
            } else if (isVisited) {
              fillColor = '#2563eb';
              strokeColor = '#60a5fa';
            }

            return (
              <g key={node.id} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  className={isActive ? 'animate-pulse' : ''}
                />
                <text
                  x={node.x}
                  y={node.y + 4.5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
                {/* Distance or In-degree label */}
                {dist !== undefined && (
                  <text
                    x={node.x}
                    y={node.y - 25}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    d:{dist}
                  </text>
                )}
                {step.inDegrees && step.inDegrees[node.id] !== undefined && (
                  <text
                    x={node.x}
                    y={node.y + 34}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    in:{step.inDegrees[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* State Tracking: Queue / Stack / Distance array */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase">
            {algorithmType === 'topological-sort' ? 'Queue (In-degree 0)' : 'Queue / Heap'}:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {step.queueOrStack.length > 0 ? (
              step.queueOrStack.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-blue-900/60 border border-blue-700/60 text-blue-300 px-2 py-0.5 rounded text-[11px]"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-slate-600 italic">Empty</span>
            )}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase">Visited:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {step.visited.length > 0 ? (
              step.visited.map((v, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 px-2 py-0.5 rounded text-[11px]"
                >
                  {v}
                </span>
              ))
            ) : (
              <span className="text-slate-600 italic">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded shrink-0">
          Step {currentStepIdx + 1} / {steps.length}
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Playback Controls */}
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 transition"
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
      </div>
    </div>
  );
};
