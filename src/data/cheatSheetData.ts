export interface FormulaSection {
  title: string;
  category: string;
  items: {
    name: string;
    formula: string;
    notes: string;
    complexity?: string;
  }[];
}

export const CHEAT_SHEET_DATA: FormulaSection[] = [
  {
    title: 'Asymptotic Growth Classes Hierarchy',
    category: 'Complexity',
    items: [
      { name: 'Constant', formula: 'O(1)', notes: 'Hash map access, array index dereference' },
      { name: 'Logarithmic', formula: 'O(log n)', notes: 'Binary Search, balanced BST search' },
      { name: 'Linear', formula: 'O(n)', notes: 'Linear search, BFS/DFS tree scan' },
      { name: 'Linearithmic', formula: 'O(n log n)', notes: 'Merge Sort, Heap Sort, Quick Sort expected' },
      { name: 'Quadratic', formula: 'O(n^2)', notes: 'Bubble Sort, Insertion Sort, all pairs matrix scan' },
      { name: 'Cubic', formula: 'O(n^3)', notes: 'Matrix Chain Mult, Floyd-Warshall' },
      { name: 'Exponential', formula: 'O(2^n)', notes: 'Subset enumeration, brute-force 0/1 knapsack' },
      { name: 'Factorial', formula: 'O(n!)', notes: 'TSP brute-force, permutation enumeration' }
    ]
  },
  {
    title: 'Master Theorem Reference Table: T(n) = aT(n/b) + f(n)',
    category: 'Recurrences',
    items: [
      { name: 'Critical Exponent', formula: 'c_crit = log_b(a)', notes: 'Number of leaves in recursion tree is n^(log_b a)' },
      { name: 'Case 1 (Leaves Dominate)', formula: 'f(n) = O(n^(c_crit - ε)) => T(n) = Θ(n^(log_b a))', notes: 'Work concentrates at the bottom leaves of the recursion tree' },
      { name: 'Case 2 (Balanced Levels)', formula: 'f(n) = Θ(n^c_crit * log^k n) => T(n) = Θ(n^(log_b a) * log^(k+1) n)', notes: 'Each level of the tree does asymptotically identical work' },
      { name: 'Case 3 (Root Dominates)', formula: 'f(n) = Ω(n^(c_crit + ε)) + Regularity => T(n) = Θ(f(n))', notes: 'Top root level dominates all downstream subproblems combined' }
    ]
  },
  {
    title: 'Canonical Recurrences Quick Reference',
    category: 'Recurrences',
    items: [
      { name: 'Binary Search', formula: 'T(n) = T(n/2) + O(1)', notes: 'Case 2 (k=0)', complexity: 'Θ(log n)' },
      { name: 'Merge Sort', formula: 'T(n) = 2T(n/2) + O(n)', notes: 'Case 2 (k=0)', complexity: 'Θ(n log n)' },
      { name: 'Karatsuba Fast Multiply', formula: 'T(n) = 3T(n/2) + O(n)', notes: 'Case 1: log2(3) ≈ 1.585', complexity: 'Θ(n^1.585)' },
      { name: 'Strassen Matrix Multiply', formula: 'T(n) = 7T(n/2) + O(n^2)', notes: 'Case 1: log2(7) ≈ 2.807', complexity: 'Θ(n^2.807)' },
      { name: 'QuickSort Worst Case', formula: 'T(n) = T(n-1) + O(n)', notes: 'Arithmetic sum of 1 to n', complexity: 'Θ(n^2)' },
      { name: 'Tower of Hanoi', formula: 'T(n) = 2T(n-1) + 1', notes: 'Geometric progression 2^n - 1', complexity: 'Θ(2^n)' }
    ]
  },
  {
    title: 'Sorting Algorithms Master Summary',
    category: 'Sorting',
    items: [
      { name: 'Merge Sort', formula: 'Best: O(n log n), Worst: O(n log n), Space: O(n)', notes: 'Stable, not in-place, divide-and-conquer' },
      { name: 'Quick Sort', formula: 'Best: O(n log n), Worst: O(n^2), Space: O(log n)', notes: 'Unstable, in-place, cache-friendly partition' },
      { name: 'Heap Sort', formula: 'Best: O(n log n), Worst: O(n log n), Space: O(1)', notes: 'Unstable, in-place, poor cache locality' },
      { name: 'Insertion Sort', formula: 'Best: O(n), Worst: O(n^2), Space: O(1)', notes: 'Stable, in-place, adaptive for nearly-sorted data' },
      { name: 'Counting Sort', formula: 'Time: O(n + k), Space: O(n + k)', notes: 'Stable, non-comparison based integer sort' }
    ]
  },
  {
    title: 'Graph & Network Flow Complexities',
    category: 'Graphs',
    items: [
      { name: 'BFS / DFS (Adj List)', formula: 'O(|V| + |E|)', notes: 'Space: O(|V|)' },
      { name: 'Topological Sort (Kahn)', formula: 'O(|V| + |E|)', notes: 'Queue + in-degree array on DAGs' },
      { name: 'Dijkstra (Binary Heap)', formula: 'O((|V| + |E|) log |V|)', notes: 'Non-negative edge weights only' },
      { name: 'Dijkstra (Fibonacci Heap)', formula: 'O(|E| + |V| log |V|)', notes: 'O(1) amortized decrease-key' },
      { name: 'Prim\'s MST (Binary Heap)', formula: 'O(|E| log |V|)', notes: 'Grows single tree from root' },
      { name: 'Kruskal\'s MST (DSU)', formula: 'O(|E| log |E|) = O(|E| log |V|)', notes: 'DSU Find/Union with path compression' },
      { name: 'Floyd-Warshall All-Pairs', formula: 'O(|V|^3)', notes: 'Space: O(|V|^2), DP on intermediate vertices k' },
      { name: 'Edmonds-Karp Max-Flow', formula: 'O(|V| * |E|^2)', notes: 'BFS shortest augmenting paths' }
    ]
  },
  {
    title: 'NP-Completeness Key Reductions Chain',
    category: 'NP-Theory',
    items: [
      { name: 'Cook-Levin Theorem', formula: 'Turing Machine computation <=p Circuit-SAT <=p SAT', notes: 'First problem proven NP-Complete from axioms' },
      { name: '3-SAT <=p Clique', formula: 'Clause triangles + cross-clause contradiction edges', notes: 'Independent set size k in complement graph' },
      { name: 'Clique <=p Vertex Cover', formula: 'S is Clique in G <=> V - S is Vertex Cover in G\'', notes: 'Duality between cliques and vertex covers' },
      { name: 'Vertex Cover <=p Subset Sum', formula: 'Base-4 incident edge incidence vector encodings', notes: 'Reduces graph cover to integer knapsack' }
    ]
  }
];
