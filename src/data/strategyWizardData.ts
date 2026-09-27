export interface WizardQuestion {
  id: string;
  question: string;
  description: string;
  options: {
    label: string;
    description: string;
    nextQuestionId?: string;
    resultStrategy?: string;
    recommendation?: string;
    reasoning?: string;
    sampleProblems?: string[];
  }[];
}

export interface PatternProblem {
  id: string;
  title: string;
  scenario: string;
  constraints: string;
  correctStrategy: string;
  options: string[];
  explanation: string;
  whyOthersFail: Record<string, string>;
  recommendedAlgorithm: string;
}

export const STRATEGY_WIZARD_QUESTIONS: Record<string, WizardQuestion> = {
  start: {
    id: 'start',
    question: 'What is the primary objective of your computational problem?',
    description: 'Determine whether you are searching for an optimal configuration, satisfying constraints, or exploring graph connections.',
    options: [
      {
        label: 'Optimization (Maximize profit, minimize cost, find shortest/cheapest)',
        description: 'You need the single mathematically best answer among many valid options.',
        nextQuestionId: 'optimization_type'
      },
      {
        label: 'Constraint Satisfaction or Exhaustive Search',
        description: 'Find any one, all, or count valid arrangements that obey complex rules (e.g. Sudoku, N-Queens, Subsets).',
        nextQuestionId: 'backtracking_check'
      },
      {
        label: 'Network / Relational Connectivity',
        description: 'Entities with pairwise relationships, capacities, distances, or dependencies.',
        nextQuestionId: 'graph_type'
      },
      {
        label: 'Rearranging or Querying Monotonic / Structured Data',
        description: 'Sorting items, finding order statistics, or searching within sorted bounds.',
        resultStrategy: 'Divide & Conquer / Order Searching',
        recommendation: 'Use Divide & Conquer (Merge/Quick Sort, Quickselect) or Binary Search.',
        reasoning: 'When data exhibits monotonicity or clean recursive splitting without overlapping dependencies, divide-and-conquer isolates subproblems in O(n log n) or O(log n).',
        sampleProblems: ['Merge Sort', 'Quick Sort', 'Binary Search', 'Closest Pair of Points']
      }
    ]
  },
  optimization_type: {
    id: 'optimization_type',
    question: 'Can you prove that a greedy local choice never requires reconsideration later?',
    description: 'Can you commit to the best local choice right now (e.g. highest value-to-weight ratio, closest node) without checking downstream consequences?',
    options: [
      {
        label: 'YES — A local greedy choice can be proven globally safe (Greedy Choice Property)',
        description: 'The optimal choice at each step can be made immediately without checking subproblems.',
        resultStrategy: 'Greedy Strategy',
        recommendation: 'Use a Greedy Algorithm (e.g. Kruskal, Prim, Dijkstra, Fractional Knapsack, Huffman).',
        reasoning: 'Because making the local optimal decision leaves a subproblem of the exact same form and never causes regret, greedy algorithms achieve fast O(n log n) performance without state backtracking.',
        sampleProblems: ['Fractional Knapsack', 'Dijkstra Shortest Path', 'Kruskal MST', 'Activity Scheduling']
      },
      {
        label: 'NO — Decisions depend on choices made elsewhere (Overlapping Subproblems)',
        description: 'Choosing an item now restricts choices later; subproblems are revisited repeatedly.',
        nextQuestionId: 'dp_substructure'
      }
    ]
  },
  dp_substructure: {
    id: 'dp_substructure',
    question: 'Does the problem exhibit Optimal Substructure and Overlapping Subproblems?',
    description: 'Can an optimal solution be constructed from optimal solutions to subproblems, and do the same subproblems repeat?',
    options: [
      {
        label: 'YES — Optimal sub-solutions directly form the global solution, and states repeat',
        description: 'Ex: Matrix Chain Multiplication, 0/1 Knapsack, Longest Common Subsequence.',
        resultStrategy: 'Dynamic Programming (DP)',
        recommendation: 'Formulate a DP Recurrence (Memoization or Tabulation).',
        reasoning: 'By caching states in a table or array, you reduce an otherwise exponential O(2^n) brute force search down to polynomial O(states * transitions).',
        sampleProblems: ['Matrix Chain Multiplication', 'Longest Common Subsequence', '0/1 Knapsack', 'Floyd-Warshall']
      },
      {
        label: 'NO — Subproblems are NOT independent or lack optimal substructure',
        description: 'Ex: Longest Simple Path in general graphs, or state depends on entire history.',
        resultStrategy: 'Backtracking / Branch & Bound',
        recommendation: 'Use Backtracking or Branch & Bound with tight heuristic bounds.',
        reasoning: 'When optimal substructure fails, you must explore the state space tree with pruning to eliminate branches that cannot beat the current best known solution.',
        sampleProblems: ['Traveling Salesperson Problem (Exact)', 'Hamiltonian Cycle', 'Integer Linear Programming']
      }
    ]
  },
  backtracking_check: {
    id: 'backtracking_check',
    question: 'Can you detect invalid candidates BEFORE fully exploring their branches?',
    description: 'If you place a number or pick an item, can you immediately test if a constraint is violated?',
    options: [
      {
        label: 'YES — Early pruning is possible as soon as a partial constraint fails',
        description: 'Ex: Queen attacks another queen, number already in Sudoku row/box.',
        resultStrategy: 'Backtracking',
        recommendation: 'Build a State-Space Tree with early constraint pruning.',
        reasoning: 'Pruning allows you to discard massive subtrees of billions of dead ends without visiting them, turning intractable factorial searches into manageable execution.',
        sampleProblems: ['N-Queens', 'Sudoku Solver', 'Graph Coloring', 'Subset Sum']
      },
      {
        label: 'NO — Entire configuration must be completed before evaluation',
        description: 'Ex: Black-box objective function evaluation.',
        resultStrategy: 'Branch and Bound or Heuristic Approximation',
        recommendation: 'Use Branch and Bound with mathematical relaxation or Genetic / Simulated Annealing heuristics.',
        reasoning: 'Without early pruning, true backtracking cannot prune. You must rely on mathematical lower bounds or metaheuristic search.',
        sampleProblems: ['Job Shop Scheduling', 'Max SAT']
      }
    ]
  },
  graph_type: {
    id: 'graph_type',
    question: 'What specific network property are you trying to compute?',
    description: 'Select the exact nature of the graph problem.',
    options: [
      {
        label: 'Maximum bottleneck throughput from a Source to a Sink',
        description: 'Edge capacities with flow conservation constraints.',
        resultStrategy: 'Network Flow (Ford-Fulkerson / Edmonds-Karp)',
        recommendation: 'Model as a Flow Network and solve via Ford-Fulkerson or Push-Relabel.',
        reasoning: 'Computes maximum flow and finds the minimum cut bottleneck simultaneously in polynomial time.',
        sampleProblems: ['Bipartite Matching', 'Maximum Flow', 'Circulation with Demands', 'Image Segmentation']
      },
      {
        label: 'Ordering tasks with dependencies (Prerequisites)',
        description: 'Directed graph where task u must precede task v.',
        resultStrategy: 'Topological Sort',
        recommendation: 'Use Kahn\'s Algorithm (BFS) or DFS finishing times.',
        reasoning: 'Executes in linear O(|V| + |E|) time and immediately detects directed cycles.',
        sampleProblems: ['Course Schedule', 'Build System Compiler Order']
      },
      {
        label: 'Shortest path or minimum distance between points',
        description: 'Finding cheapest route from A to B.',
        resultStrategy: 'BFS (unweighted) or Dijkstra (positive weights)',
        recommendation: 'Use BFS if all edge weights are uniform (1), or Dijkstra if edge weights are non-negative.',
        reasoning: 'BFS guarantees fewest hops in O(|V| + |E|); Dijkstra maintains greedy priority queue in O((|V| + |E|) log |V|).',
        sampleProblems: ['GPS Navigation', 'Shortest Word Ladder', 'Network Latency']
      }
    ]
  }
};

export const PATTERN_PRACTICE_PROBLEMS: PatternProblem[] = [
  {
    id: 'pattern-1',
    title: 'The Steel Bar Cutting Problem',
    scenario: 'You are given a steel rod of length n and a price table p[i] for rods of length i. You can cut the rod into any number of integer pieces. How should you cut the rod to maximize total revenue?',
    constraints: 'n <= 1,000, prices are positive integers.',
    correctStrategy: 'Dynamic Programming',
    options: ['Greedy Strategy', 'Dynamic Programming', 'Divide & Conquer', 'Network Flow'],
    explanation: 'A greedy choice based on highest price-per-inch density fails on cases like n=4 where two cuts of length 2 yield more revenue than one greedy cut of length 3 plus a leftover 1. The problem has optimal substructure: best revenue for length n is max over 1<=i<=n of (p[i] + optimal_revenue(n - i)). The subproblems overlap, making Dynamic Programming the optimal strategy running in O(n^2).',
    whyOthersFail: {
      'Greedy Strategy': 'Density (price/length) can leave awkward remainder lengths that destroy global optimality.',
      'Divide & Conquer': 'Without caching, the naive recursive tree recalculates identical remaining lengths O(2^n) times.',
      'Network Flow': 'This is a 1D resource decomposition problem, not a capacity-constrained graph routing problem.'
    },
    recommendedAlgorithm: 'Bottom-Up Tabulation Rod Cutting DP'
  },
  {
    id: 'pattern-2',
    title: 'Classroom Lecture Scheduling',
    scenario: 'Given n lectures, each with start time s_i and finish time f_i. All lectures need the same single auditorium. Find the maximum number of mutually compatible (non-overlapping) lectures that can be held.',
    constraints: 'n <= 100,000 lectures.',
    correctStrategy: 'Greedy Strategy',
    options: ['Dynamic Programming', 'Greedy Strategy', 'Backtracking', 'Network Flow'],
    explanation: 'This is the classic Activity Selection problem. By greedily selecting the lecture that FINISHES EARLIEST (minimum f_i), we leave the maximum possible remaining time for subsequent lectures. This greedy choice property can be proven strictly optimal via an exchange argument, running in O(n log n) time by sorting finish times.',
    whyOthersFail: {
      'Dynamic Programming': 'DP works in O(n^2) or O(n log n), but is unnecessarily complex because the greedy choice is mathematically guaranteed to be optimal.',
      'Backtracking': 'Exploring all 2^n lecture combinations is exponentially too slow for n = 100,000.'
    },
    recommendedAlgorithm: 'Greedy Earliest-Finish-Time Selection'
  },
  {
    id: 'pattern-3',
    title: 'Assigning Medical Residents to Hospital Shifts',
    scenario: 'A hospital has 50 doctors and 50 night shifts. Each doctor has specified a list of shifts they are certified and willing to work. Each doctor can work at most 1 shift, and each shift needs exactly 1 doctor. Find an assignment that covers the maximum number of shifts.',
    constraints: '50 doctors, 50 shifts, up to 500 compatibility pairs.',
    correctStrategy: 'Network Flow',
    options: ['Dynamic Programming', 'Greedy Strategy', 'Network Flow', 'Divide & Conquer'],
    explanation: 'This is Maximum Bipartite Matching. A greedy pairing can strand doctors whose only alternative shifts were taken by flexible candidates. Modeling doctors as left nodes, shifts as right nodes, with a source s connected to doctors and shifts connected to a sink t (all capacities = 1) solves the problem definitively via Ford-Fulkerson / Edmonds-Karp in polynomial time O(|V| * |E|).',
    whyOthersFail: {
      'Greedy Strategy': 'Greedy matching easily gets trapped in non-maximal configurations and cannot "undo" assignments.',
      'Dynamic Programming': 'State space requires tracking the subset of assigned shifts (2^50 states), which is intractable.'
    },
    recommendedAlgorithm: 'Hopcroft-Karp or Edmonds-Karp Bipartite Matching'
  },
  {
    id: 'pattern-4',
    title: 'Solving Cryptarithmetic Puzzles',
    scenario: 'Assign distinct decimal digits (0-9) to letters such that SEND + MORE = MONEY holds true, with no leading zeroes.',
    constraints: 'At most 10 distinct letters.',
    correctStrategy: 'Backtracking',
    options: ['Greedy Strategy', 'Dynamic Programming', 'Backtracking', 'Network Flow'],
    explanation: 'There is no simple greedy rule or optimal substructure because carries propagate non-locally across column additions. Backtracking explores possible digit assignments letter-by-letter, immediately checking column sum consistency and pruning invalid branches before searching deeper.',
    whyOthersFail: {
      'Greedy Strategy': 'No local digit assignment can guarantee arithmetic carries match.',
      'Dynamic Programming': 'No independent overlapping subproblems; constraints span all variables globally.'
    },
    recommendedAlgorithm: 'Depth-First Backtracking with Column Carry Propagation'
  }
];
