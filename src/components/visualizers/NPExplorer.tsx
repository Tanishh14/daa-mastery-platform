import React, { useState } from 'react';

export const NPExplorer: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<'P' | 'NP' | 'NPC' | 'NPH' | 'coNP'>('NPC');
  const [activeTab, setActiveTab] = useState<'diagram' | 'reduction'>('diagram');

  const classInfo = {
    P: {
      name: 'Class P (Deterministic Polynomial Time)',
      definition: 'Problems solvable by a deterministic algorithm in O(n^k) polynomial time.',
      examples: ['Shortest Path (Dijkstra)', 'Minimum Spanning Tree (Kruskal)', 'Sorting (Merge Sort)', '2-SAT'],
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-700'
    },
    NP: {
      name: 'Class NP (Nondeterministic Polynomial Time)',
      definition: 'Problems where any candidate solution (certificate) can be VERIFIED in polynomial time.',
      examples: ['All problems in P', '3-SAT', 'Hamiltonian Cycle', 'Subset Sum', 'Graph Coloring'],
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/60 border-blue-700'
    },
    NPC: {
      name: 'Class NP-Complete (The Hardest in NP)',
      definition: 'Problems in NP to which every other problem in NP can be reduced in polynomial time (NP ∩ NP-Hard).',
      examples: ['Circuit-SAT', '3-CNF SAT', 'Clique', 'Vertex Cover', 'Traveling Salesperson (Decision)'],
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/60 border-purple-700'
    },
    NPH: {
      name: 'Class NP-Hard (At least as hard as NP)',
      definition: 'Problems at least as hard as the hardest problems in NP. Need NOT belong to NP (can be undecidable).',
      examples: ['Halting Problem', 'TSP Optimization (Find exact minimum tour)', 'Max-SAT', 'General ILP'],
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/60 border-rose-700'
    },
    coNP: {
      name: 'Class co-NP (Complement of NP)',
      definition: 'Problems where NO-instances have short verifiable certificates (e.g. proof of falsehood).',
      examples: ['Tautology testing', 'Non-Hamiltonian graph check', 'Prime number verification'],
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-700'
    }
  };

  const curr = classInfo[selectedClass];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">
            NP-Completeness Taxonomy & Polynomial Reduction Explorer
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'diagram' ? 'bg-purple-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Euler Venn Diagram
          </button>
          <button
            onClick={() => setActiveTab('reduction')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'reduction' ? 'bg-purple-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            3-SAT ➔ Clique Reduction
          </button>
        </div>
      </div>

      {activeTab === 'diagram' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Interactive SVG Euler Diagram */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center">
            <svg viewBox="0 0 340 240" className="w-full max-w-[320px] h-[220px]">
              {/* NP-Hard outer boundary */}
              <ellipse
                cx="170"
                cy="110"
                rx="155"
                ry="100"
                fill="#4c0519"
                fillOpacity="0.2"
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="cursor-pointer hover:fill-opacity-30 transition"
                onClick={() => setSelectedClass('NPH')}
              />
              <text x="170" y="32" fill="#fda4af" fontSize="10" textAnchor="middle" fontWeight="bold">
                NP-Hard (Outer Space)
              </text>

              {/* Class NP ellipse */}
              <ellipse
                cx="170"
                cy="135"
                rx="125"
                ry="75"
                fill="#1e1b4b"
                fillOpacity="0.6"
                stroke="#6366f1"
                strokeWidth="2"
                className="cursor-pointer hover:fill-opacity-80 transition"
                onClick={() => setSelectedClass('NP')}
              />
              <text x="170" y="80" fill="#a5b4fc" fontSize="11" textAnchor="middle" fontWeight="bold">
                Class NP (Verifiable in Poly-Time)
              </text>

              {/* NP-Complete region */}
              <ellipse
                cx="170"
                cy="120"
                rx="70"
                ry="30"
                fill="#581c87"
                fillOpacity="0.8"
                stroke="#c084fc"
                strokeWidth="2"
                className="cursor-pointer hover:fill-opacity-95 transition"
                onClick={() => setSelectedClass('NPC')}
              />
              <text x="170" y="124" fill="#f3e8ff" fontSize="11" textAnchor="middle" fontWeight="bold">
                ★ NP-Complete
              </text>

              {/* Class P ellipse */}
              <ellipse
                cx="170"
                cy="175"
                rx="45"
                ry="22"
                fill="#064e3b"
                fillOpacity="0.8"
                stroke="#34d399"
                strokeWidth="2"
                className="cursor-pointer hover:fill-opacity-95 transition"
                onClick={() => setSelectedClass('P')}
              />
              <text x="170" y="179" fill="#a7f3d0" fontSize="11" textAnchor="middle" fontWeight="bold">
                Class P
              </text>
            </svg>
            <span className="text-[11px] text-slate-500 font-mono text-center pt-1">
              Assumption: P ⊆ NP. (Whether P = NP remains unresolved)
            </span>
          </div>

          {/* Class details card */}
          <div className={`p-4 rounded-lg border flex flex-col gap-3 transition-colors ${curr.bgColor}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold font-mono ${curr.color}`}>
                {curr.name}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{curr.definition}</p>

            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Canonical Examples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {curr.examples.map((ex, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-900/80 border border-slate-700/60 px-2 py-0.5 rounded text-[11px] font-mono text-slate-200"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Polynomial Reduction Walkthrough */
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col gap-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-semibold text-purple-400">
              Cook-Levin Core: 3-SAT ≤p Independent Set / Clique
            </span>
            <span className="text-xs font-mono text-slate-500">Polynomial Transformation f</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="bg-slate-900 p-3 rounded border border-slate-800 flex-1">
              <div className="text-amber-400 font-bold font-mono">Problem A: 3-SAT</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Formula: (x1 ∨ x2 ∨ x3) ∧ (¬x1 ∨ ¬x2 ∨ x3)
              </div>
              <div className="text-[10px] text-slate-500 mt-1">m clauses, n variables</div>
            </div>

            <div className="font-mono text-purple-400 text-lg">➔ f(x) in O(n) ➔</div>

            <div className="bg-slate-900 p-3 rounded border border-slate-800 flex-1">
              <div className="text-sky-400 font-bold font-mono">Problem B: Clique</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Graph G with 3m vertices; target size k = m
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Connect non-contradictory literals</div>
            </div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-100">Reduction Proof Argument:</span>
            <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
              <li>Each clause forms a triangle gadget: at most 1 vertex can be picked per clause.</li>
              <li>A clique of size k = m requires choosing exactly 1 vertex from each clause triangle.</li>
              <li>Since contradictory literals (x and ¬x) are NOT connected, no conflicting assignments can be chosen simultaneously.</li>
              <li>Therefore: Formula is SATISFIABLE ⟺ Graph has a Clique of size m.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
