export interface AlgorithmComparison {
  id: string;
  title: string;
  description: string;
  headers: string[];
  rows: {
    feature: string;
    values: string[];
  }[];
  keyTakeaway: string;
}

export const COMPARISONS_DATA: AlgorithmComparison[] = [
  {
    id: 'sorting-comparison',
    title: 'Merge Sort vs Quick Sort vs Heap Sort',
    description: 'Direct comparison of fundamental O(n log n) comparison-based sorting paradigms.',
    headers: ['Feature', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
    rows: [
      { feature: 'Paradigm', values: ['Divide & Conquer', 'Divide & Conquer', 'Selection / Complete Binary Heap'] },
      { feature: 'Best Case Time', values: ['O(n log n)', 'O(n log n)', 'O(n log n)'] },
      { feature: 'Average Case Time', values: ['O(n log n)', 'O(n log n)', 'O(n log n)'] },
      { feature: 'Worst Case Time', values: ['O(n log n)', 'O(n^2)', 'O(n log n)'] },
      { feature: 'Auxiliary Space', values: ['O(n)', 'O(log n) stack', 'O(1) in-place'] },
      { feature: 'Stable?', values: ['Yes (preserves relative order)', 'No (partitioning swaps jump)', 'No (heap siftdown disrupts order)'] },
      { feature: 'In-Place?', values: ['No (requires temp buffer)', 'Yes', 'Yes'] },
      { feature: 'Cache Locality', values: ['Fair (extra buffers)', 'Excellent (sequential scans)', 'Poor (parent/child index jumps)'] },
      { feature: 'Best For', values: ['Linked lists, external sorting, stable records', 'General-purpose in-memory sorting', 'Memory-constrained real-time systems'] }
    ],
    keyTakeaway: 'Quick Sort is the fastest in practice due to superior cache locality, Merge Sort is chosen when stability or linked lists are involved, and Heap Sort guarantees strictly O(1) extra space with O(n log n) worst-case time.'
  },
  {
    id: 'mst-comparison',
    title: 'Kruskal\'s Algorithm vs Prim\'s Algorithm',
    description: 'Comparing Minimum Spanning Tree strategies: edge-centric vs vertex-growth.',
    headers: ['Feature', 'Kruskal\'s Algorithm', 'Prim\'s Algorithm'],
    rows: [
      { feature: 'Primary Structure', values: ['Sorted Edge List + Disjoint Set (DSU)', 'Priority Queue (Min-Heap) + Adjacency List'] },
      { feature: 'Growth Paradigm', values: ['Global: grows a forest of trees until unified', 'Local: grows a single connected tree outward from a root'] },
      { feature: 'Time (Standard Binary Heap)', values: ['O(|E| log |E|) = O(|E| log |V|)', 'O(|E| log |V|)'] },
      { feature: 'Time (Fibonacci Heap)', values: ['O(|E| log |V|)', 'O(|E| + |V| log |V|)'] },
      { feature: 'Time (Adjacency Matrix)', values: ['O(|E| log |E|)', 'O(|V|^2) (optimal for dense graphs)'] },
      { feature: 'Cycle Detection', values: ['Explicit via DSU Find & Union', 'Implicit: only unvisited vertices extracted from heap'] },
      { feature: 'Handles Disconnected Graph?', values: ['Yes (produces Minimum Spanning Forest)', 'No (only spans component of initial start vertex)'] },
      { feature: 'Ideal Graph Topology', values: ['Sparse graphs (|E| << |V|^2)', 'Dense graphs (|E| ≈ |V|^2)'] }
    ],
    keyTakeaway: 'Use Kruskal on sparse networks where edge sorting is cheap and disconnected components may exist; use Prim with matrix or dense heaps when graphs are dense.'
  },
  {
    id: 'traversal-comparison',
    title: 'Breadth-First Search (BFS) vs Depth-First Search (DFS)',
    description: 'Level-by-level queue frontier vs branch-deep recursive backtracking.',
    headers: ['Feature', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)'],
    rows: [
      { feature: 'Data Structure', values: ['FIFO Queue', 'LIFO Stack (Call Stack / Iterative Stack)'] },
      { feature: 'Shortest Path Guarantee', values: ['Yes, in unweighted graphs (fewest edges)', 'No, may find arbitrarily long paths first'] },
      { feature: 'Memory Consumption', values: ['O(Width of graph) — can be O(|V|) at wide levels', 'O(Depth of graph) — can be O(|V|) on deep chains'] },
      { feature: 'Edge Classifications', values: ['Tree edges and Cross edges only', 'Tree, Back, Forward, and Cross edges'] },
      { feature: 'Cycle Detection', values: ['Cross-edges within level or to parent', 'Back-edges to an ancestor currently on recursion stack'] },
      { feature: 'Applications', values: ['Shortest paths, Peer-to-peer neighbor search, Bipartite check', 'Topological sort, Strongly Connected Components, Maze pathing'] }
    ],
    keyTakeaway: 'BFS is the undisputed tool for unweighted shortest paths and radius searches; DFS is the tool of choice for deep structural graph properties like cycle detection, topological order, and articulation points.'
  },
  {
    id: 'paradigm-comparison',
    title: 'Divide & Conquer vs Dynamic Programming vs Greedy',
    description: 'Fundamental algorithmic paradigm selection matrix.',
    headers: ['Feature', 'Divide & Conquer', 'Dynamic Programming', 'Greedy Strategy'],
    rows: [
      { feature: 'Subproblem Independence', values: ['Independent disjoint subproblems', 'Overlapping shared subproblems', 'Local choice made without solving subproblems first'] },
      { feature: 'Optimal Substructure', values: ['Yes (combine sub-solutions)', 'Yes (mandatory)', 'Yes (mandatory)'] },
      { feature: 'Choice Timing', values: ['Top-down recursive branching', 'Explores all choices and picks best after subproblems return', 'Greedily commits to best local choice immediately'] },
      { feature: 'Backtracking / Memoization', values: ['None required (disjoint)', 'Stores state in memo table or DP matrix', 'Never re-evaluates or backtracks'] },
      { feature: 'Proof Requirement', values: ['Mathematical induction on input size', 'Proof of optimal substructure', 'Greedy choice property (Exchange Argument)'] },
      { feature: 'Canonical Examples', values: ['Merge Sort, Quick Sort, Strassen', '0/1 Knapsack, LCS, Matrix Chain Mult', 'Fractional Knapsack, Huffman, Kruskal, Dijkstra'] }
    ],
    keyTakeaway: 'Greedy makes the fastest irrevocable local decision; DP guarantees global optimality when decisions depend on overlapping sub-choices; Divide & Conquer splits independent problems.'
  }
];
