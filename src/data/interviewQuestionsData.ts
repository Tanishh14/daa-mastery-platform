export interface VivaQuestion {
  id: string;
  category: string;
  question: string;
  shortAnswer: string;
  deepExplanation: string;
  keyPhrases: string[];
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 'viva-1',
    category: 'Sorting & Divide and Conquer',
    question: 'Why is Merge Sort always O(n log n) in all cases, whereas Quick Sort degrades to O(n^2) in the worst case?',
    shortAnswer: 'Merge Sort always forces perfectly balanced n/2 partitions regardless of input values, whereas Quick Sort\'s partition balance depends on pivot values and can degrade to 0 and n-1 splits on sorted data.',
    deepExplanation: 'Merge Sort splits an array by index arithmetic mid = (left + right) / 2. This guarantees the recursion tree depth is strictly ceil(log2 n) with O(n) work per level, producing T(n) = 2T(n/2) + O(n) = O(n log n) unconditionally. Quick Sort splits by value comparison against a pivot. If the pivot is consistently the minimum or maximum element (such as an already-sorted array with Lomuto partitioning), one partition receives 0 elements and the other n-1, creating a degenerate linear tree of depth n with sum of arithmetic work n + (n-1) + ... + 1 = O(n^2).',
    keyPhrases: ['Index-based splitting vs value-based partitioning', 'Recursion tree height log2(n) vs n', 'Degenerate partitions 0 and n-1']
  },
  {
    id: 'viva-2',
    category: 'Graph Algorithms',
    question: 'Why cannot Dijkstra\'s algorithm handle graphs with negative edge weights, and why does adding a constant to all edges fail to fix it?',
    shortAnswer: 'Dijkstra assumes that once a vertex is extracted from the priority queue, its distance is finalized; negative edges violate this monotonic property. Adding a constant C adds k*C to a k-edge path, unfairly penalizing paths with more edges.',
    deepExplanation: 'Dijkstra relies on a greedy invariant: because all edge weights are >= 0, relaxing edges out of the currently closest unvisited node cannot be beaten by paths routed through nodes that are already further away. If negative edges exist, a path with 5 edges might have a high initial sum but later drop below the current distance via negative weights. Adding a constant C to all edges alters the problem: a 2-edge path increases by 2C, while a 4-edge path increases by 4C, changing which path is minimal.',
    keyPhrases: ['Monotonic distance property', 'Permanent label finalized upon extraction', 'Path length bias when adding constant C']
  },
  {
    id: 'viva-3',
    category: 'Graph Algorithms',
    question: 'Why does Breadth-First Search (BFS) guarantee the shortest path in unweighted graphs while Depth-First Search (DFS) does not?',
    shortAnswer: 'BFS expands concentric level-frontiers in strictly increasing order of edge hops, discovering distance k vertices before distance k+1 vertices.',
    deepExplanation: 'In BFS, vertices are placed in a FIFO queue. If source s is at distance 0, its immediate neighbors are enqueued at distance 1, followed by distance 2, etc. The first time a vertex v is popped, it has been reached via the minimal possible number of edges. DFS charges deeply down a single arbitrary branch; it might reach a target 10 hops away through a long meandering path first, ignoring an unvisited 1-hop direct neighbor.',
    keyPhrases: ['Concentric level frontiers', 'FIFO queue ordering', 'First visit is shortest hop']
  },
  {
    id: 'viva-4',
    category: 'Theory of NP-Completeness',
    question: 'What exact mathematical conditions make a decision problem NP-Complete?',
    shortAnswer: 'A problem must belong to class NP (polynomial-time verifiable with a certificate) AND be NP-Hard (every problem in NP reduces to it in polynomial time).',
    deepExplanation: 'Formally, language L is NP-Complete iff: (1) L in NP: there exists a deterministic verifier V(x, y) running in polynomial time O(|x|^k) such that x in L iff there exists a polynomial-size certificate y where V(x, y) = ACCEPT. (2) L is NP-Hard: for every language L\' in NP, L\' <=p L (L\' is polynomial-time many-one reducible to L). Cook-Levin first established this for SAT, and Karp demonstrated it for 21 core combinatorial problems.',
    keyPhrases: ['In NP (polynomial verifiable)', 'NP-Hard (all NP problems reduce to it)', 'Certificate / Witness']
  },
  {
    id: 'viva-5',
    category: 'Dynamic Programming vs Divide & Conquer',
    question: 'What is the precise architectural difference between Dynamic Programming and Divide & Conquer?',
    shortAnswer: 'Divide & Conquer solves disjoint (independent) subproblems without caching; Dynamic Programming solves overlapping (repeated) subproblems by caching states.',
    deepExplanation: 'In Divide and Conquer (e.g. Merge Sort, Quick Sort), the problem is partitioned into mutually exclusive sub-arrays; each subproblem is solved independently, and combining them requires no state memoization. In Dynamic Programming (e.g. Fibonacci, LCS, Matrix Chain Multiplication), recursive branching generates identical subproblems over and over. Without caching, time is exponential O(2^n). DP stores results in a table (memoization or tabulation), collapsing the exponential recursion tree into an acyclic state graph of polynomial size.',
    keyPhrases: ['Disjoint vs overlapping subproblems', 'State memoization table', 'Exponential tree to DAG compression']
  },
  {
    id: 'viva-6',
    category: 'Complexity & Lower Bounds',
    question: 'Explain why comparison-based sorting has a lower bound of Ω(n log n), and how Counting Sort beats it in O(n).',
    shortAnswer: 'Any comparison sort can be modeled as a decision tree with n! leaves; tree height must be at least log2(n!) = Ω(n log n). Counting Sort does not use comparisons; it uses integer values directly as memory array indices.',
    deepExplanation: 'A comparison sort treats elements as opaque black boxes compared only via `<`. There are n! possible input permutations. A binary comparison tree of height h has at most 2^h leaves. To distinguish all permutations, 2^h >= n!, which by Stirling\'s approximation means h >= log2(n!) = Ω(n log n). Counting Sort breaks out of the comparison model: it treats elements as integers in range [0..k] and uses their values directly as array addresses to count occurrences in O(n + k) time.',
    keyPhrases: ['Decision tree with n! leaves', 'Height h >= log2(n!)', 'Direct memory addressing vs opaque pairwise comparisons']
  }
];
