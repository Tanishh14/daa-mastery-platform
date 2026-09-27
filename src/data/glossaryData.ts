export interface GlossaryTerm {
  term: string;
  category: 'Foundations' | 'Techniques' | 'Graphs' | 'Complexity' | 'Data Structures';
  definition: string;
  example: string;
  relatedTopicSlug?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Adversary Argument',
    category: 'Foundations',
    definition: 'A proof technique establishing lower bounds where an imaginary opponent provides the worst permissible answers to algorithm queries, forcing maximal operations.',
    example: 'Proving that any comparison sort requires at least Ω(n log n) comparisons.',
    relatedTopicSlug: 'adversary-lower-bounds'
  },
  {
    term: 'Augmenting Path',
    category: 'Graphs',
    definition: 'A simple directed path from source s to sink t in the residual network G_f along which positive additional flow can be pushed.',
    example: 'In Ford-Fulkerson, each augmenting path increases net flow by its bottleneck capacity.',
    relatedTopicSlug: 'network-flow-ford-fulkerson'
  },
  {
    term: 'Backtracking',
    category: 'Techniques',
    definition: 'An algorithmic technique that builds candidate solutions incrementally, abandoning (pruning) candidates as soon as they violate any problem constraint.',
    example: 'Solving N-Queens or Sudoku by backing up when a column conflict occurs.',
    relatedTopicSlug: 'backtracking-nqueens'
  },
  {
    term: 'Bottleneck Capacity',
    category: 'Graphs',
    definition: 'The minimum residual capacity of any edge along an augmenting path in a flow network.',
    example: 'If an augmenting path has residual edge capacities [10, 4, 7], the bottleneck is 4.',
    relatedTopicSlug: 'network-flow-ford-fulkerson'
  },
  {
    term: 'Certificate (Witness)',
    category: 'Complexity',
    definition: 'A piece of evidence associated with a problem instance that allows a polynomial-time verifier to verify that the answer is YES.',
    example: 'For the Hamiltonian Cycle problem, the certificate is the sequence of vertices in the cycle.',
    relatedTopicSlug: 'np-completeness-classes'
  },
  {
    term: 'Cut Property',
    category: 'Graphs',
    definition: 'In an undirected weighted graph, for any cut separating vertices into two disjoint sets, the minimum-weight edge crossing the cut belongs to some Minimum Spanning Tree.',
    example: 'Used to prove the correctness of Kruskal\'s and Prim\'s algorithms.',
    relatedTopicSlug: 'kruskal-prim-mst'
  },
  {
    term: 'Disjoint Set Union (DSU)',
    category: 'Data Structures',
    definition: 'A data structure that tracks elements partitioned into disjoint subsets, supporting near-constant time Find and Union operations with path compression and union by rank.',
    example: 'Used in Kruskal\'s algorithm to detect cycles in O(α(V)) amortized time.',
    relatedTopicSlug: 'kruskal-prim-mst'
  },
  {
    term: 'Dynamic Programming',
    category: 'Techniques',
    definition: 'A paradigm that solves optimization problems by breaking them into overlapping subproblems and caching results to prevent redundant recalculation.',
    example: 'Matrix Chain Multiplication, 0/1 Knapsack, Longest Common Subsequence.',
    relatedTopicSlug: 'dp-fundamentals'
  },
  {
    term: 'Greedy Choice Property',
    category: 'Techniques',
    definition: 'The property that a globally optimal solution can be reached by making a series of locally optimal (greedy) choices without reconsidering past decisions.',
    example: 'Choosing the smallest edge crossing the cut in Prim\'s MST algorithm.',
    relatedTopicSlug: 'kruskal-prim-mst'
  },
  {
    term: 'Loop Invariant',
    category: 'Foundations',
    definition: 'A formal predicate that remains true before and after each iteration of a loop, used to mathematically prove algorithm correctness via Initialization, Maintenance, and Termination.',
    example: 'In Binary Search: target, if present, is guaranteed to be in arr[left..right].',
    relatedTopicSlug: 'binary-search'
  },
  {
    term: 'Master Theorem',
    category: 'Foundations',
    definition: 'An analytical formula providing asymptotic solutions for divide-and-conquer recurrences of the form T(n) = aT(n/b) + f(n).',
    example: 'T(n) = 2T(n/2) + O(n) yields Θ(n log n) by Case 2.',
    relatedTopicSlug: 'master-theorem'
  },
  {
    term: 'Max-Flow Min-Cut Theorem',
    category: 'Graphs',
    definition: 'The fundamental theorem proving that the maximum throughput in any flow network equals the total capacity of the minimum s-t cut.',
    example: 'Used in network routing, image segmentation, and bipartite matching.',
    relatedTopicSlug: 'network-flow-ford-fulkerson'
  },
  {
    term: 'NP-Complete',
    category: 'Complexity',
    definition: 'A problem that is in class NP and to which every other problem in NP can be transformed in polynomial time (NP-Hard).',
    example: '3-SAT, Clique, Vertex Cover, Traveling Salesperson (Decision version).',
    relatedTopicSlug: 'np-completeness-classes'
  },
  {
    term: 'Optimal Substructure',
    category: 'Techniques',
    definition: 'A problem exhibits optimal substructure if an optimal solution to the problem contains optimal solutions to its subproblems.',
    example: 'Shortest paths: subpaths of a shortest path are also shortest paths.',
    relatedTopicSlug: 'dp-fundamentals'
  },
  {
    term: 'Polynomial-Time Reduction',
    category: 'Complexity',
    definition: 'A mapping function f computable in polynomial time that transforms instances of problem A into instances of problem B such that x in A iff f(x) in B.',
    example: 'Reducing 3-SAT to Clique in polynomial time to prove Clique is NP-Complete.',
    relatedTopicSlug: 'reductions-np-problems'
  },
  {
    term: 'Topological Sort',
    category: 'Graphs',
    definition: 'A linear permutation of the vertices of a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), u precedes v in the sequence.',
    example: 'Task scheduling, compiler build pipelines, and course prerequisites.',
    relatedTopicSlug: 'topological-sort'
  }
];
