import type { AlgorithmTopic } from '../../types';

export const unit3Topics: AlgorithmTopic[] = [
  {
    id: 'dp-fundamentals',
    unitId: 'unit-3',
    unitNumber: 3,
    title: 'Dynamic Programming: Memoization vs Tabulation',
    slug: 'dp-fundamentals',
    category: 'DP Fundamentals',
    shortDesc: 'Systematic caching of overlapping subproblems under the principle of optimal substructure.',
    prerequisites: ['master-theorem', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'Imagine writing 1 + 1 + 1 + 1 + 1 on a blackboard and asking someone what it equals: "5". Now add another "+ 1" to the end and ask again. They answer "6" instantly! Why? Because they remembered (cached) the previous 5 instead of re-adding from scratch. That is Dynamic Programming.',
    formalDefinition: 'Dynamic programming is an algorithm design paradigm applicable to problems exhibiting two core properties: \n1. Optimal Substructure: An optimal solution to the problem contains within it optimal solutions to subproblems.\n2. Overlapping Subproblems: A naive recursive algorithm revisits the same subproblems repeatedly rather than generating new ones. DP solves each subproblem exactly once and stores the result in a table (memoization or tabulation).',
    intuition: 'Brute-force recursion explores a branching tree of identical calculations (e.g. Fib(n) recalculates Fib(n-2) exponentially many times). DP collapses this exponential call tree O(2^n) into a Directed Acyclic Graph of unique states solved in polynomial time O(n).',
    coreIdeaSteps: [
      'Identify the state: the minimal set of parameters that uniquely identify a subproblem.',
      'Formulate the state transition recurrence relation.',
      'Identify base cases where values are known immediately.',
      'Choose evaluation order: Top-Down with Memoization (caching recursive results) or Bottom-Up with Tabulation (filling iterative table).',
      'Optimize space by observing if only the previous row/values are needed.'
    ],
    complexity: {
      best: 'O(n) [e.g. Fibonacci]',
      average: 'O(n) to O(n^2)',
      worst: 'State Count * Transition Time',
      auxiliarySpace: 'O(State Count)',
      explanation: {
        best: 'Subproblems solved once in linear sequence.',
        average: 'Proportional to (Number of unique states) x (Cost of computing each state transition).',
        worst: 'Polynomial in state space.',
        space: 'Memoization hash table / DP matrix table size.'
      }
    },
    code: {
      cpp: `// Progression: Recursion -> Memoization -> Tabulation -> Space Optimized
#include <vector>

// 1. Memoization Top-Down: O(n) time, O(n) space
long long fibMemo(int n, std::vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}

// 2. Tabulation Bottom-Up: O(n) time, O(n) space
long long fibTab(int n) {
    if (n <= 1) return n;
    std::vector<long long> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; ++i) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// 3. Space Optimized: O(n) time, O(1) space
long long fibOptimized(int n) {
    if (n <= 1) return n;
    long long prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; ++i) {
        long long curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      java: `// DP Progression in Java
public class DPBasics {
    public static long fibOptimized(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
      python: `# DP Progression in Python
def fib_memo(n: int, memo: dict = None) -> int:
    if memo is None: memo = {}
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

def fib_space_opt(n: int) -> int:
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`
    },
    visualizerType: 'dp',
    dryRunExample: {
      input: 'Fibonacci n = 5',
      output: 'fib(5) = 5',
      steps: [
        { iteration: 1, state: 'dp[0] = 0, dp[1] = 1', explanation: 'Base cases initialized.' },
        { iteration: 2, state: 'dp[2] = dp[1] + dp[0] = 1 + 0 = 1', explanation: 'Solved subproblem n = 2.' },
        { iteration: 3, state: 'dp[3] = dp[2] + dp[1] = 1 + 1 = 2', explanation: 'Solved subproblem n = 3.' },
        { iteration: 4, state: 'dp[4] = dp[3] + dp[2] = 2 + 1 = 3', explanation: 'Solved subproblem n = 4.' },
        { iteration: 5, state: 'dp[5] = dp[4] + dp[3] = 3 + 2 = 5', explanation: 'Final answer computed without re-evaluating duplicate branches.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Total DP Time = (Total Number of States) * (Transition Cost per State)',
        'Top-down = Recursive + Memoization table',
        'Bottom-up = Iterative + Tabulation',
        'Optimal substructure test: Does optimal solution to subproblem remain optimal in parent problem?'
      ],
      commonTraps: [
        'Applying DP to problems without optimal substructure (e.g. Longest Simple Path in general graphs).',
        'Confusing Divide and Conquer with Dynamic Programming. D&C solves INDEPENDENT subproblems (Merge Sort); DP solves OVERLAPPING subproblems.'
      ],
      vivaQuestions: [
        { q: 'What is the exact difference between Divide & Conquer and Dynamic Programming?', a: 'Divide and conquer partitions a problem into DISJOINT/independent subproblems (e.g. left and right halves in Merge Sort). Dynamic programming is applied when subproblems OVERLAP and share identical sub-subproblems, caching them to avoid redundant computation.' },
        { q: 'When is Memoization preferred over Tabulation?', a: 'Memoization is preferred when not all subproblems in the state space need to be solved to find the final answer (sparse evaluation), or when top-down state transitions are natural to formulate.' }
      ]
    },
    questions: [
      {
        id: 'q-dp-1',
        topicId: 'dp-fundamentals',
        title: 'Core Prerequisites for DP',
        type: 'multiple-select',
        difficulty: 'Easy',
        question: 'What two fundamental mathematical properties must a problem satisfy to be solvable via Dynamic Programming?',
        options: [
          'Optimal Substructure',
          'Overlapping Subproblems',
          'Greedy Choice Property',
          'Linear Constraints'
        ],
        correctAnswer: [0, 1],
        explanation: 'Dynamic Programming strictly requires Optimal Substructure (optimal solution formed from optimal sub-solutions) and Overlapping Subproblems (subproblems recur repeatedly). Greedy choice is for greedy algorithms.',
        commonTrap: 'Confusing greedy choice with dynamic programming requirements.'
      },
      {
        id: 'q-dp-2',
        topicId: 'dp-fundamentals',
        title: 'Call Tree Complexity Reduction',
        type: 'complexity',
        difficulty: 'Medium',
        question: 'Naive recursive Fibonacci T(n) = T(n-1) + T(n-2) runs in O(2^n). What is the time complexity when memoization is introduced?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctAnswer: 2,
        explanation: 'There are only n+1 unique subproblems: fib(0), fib(1), ..., fib(n). Each unique state is computed once in O(1) time and subsequent calls return from the cache in O(1). Total time: O(n).',
        complexityNote: 'Memoization reduces exponential 2^n branches down to linear n states.'
      },
      {
        id: 'q-dp-3',
        topicId: 'dp-fundamentals',
        title: 'Tabulation vs Memoization',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Which of the following is an advantage of Bottom-Up Tabulation over Top-Down Memoization?',
        options: [
          'It avoids recursion stack overflow and often allows space optimization (e.g. discarding older rows)',
          'It guarantees strictly fewer states are evaluated',
          'It can be formulated without recurrence relations',
          'It runs in O(log n)'
        ],
        correctAnswer: 0,
        explanation: 'Bottom-up tabulation uses iteration, completely eliminating runtime call stack overhead. Furthermore, since state dependencies are known, memory can often be compressed to only the last 1 or 2 rows.',
        whyWrong: {
          '1': 'Tabulation solves all subproblems in table order, whereas memoization may skip unvisited states.',
          '2': 'Both require identical recurrence formulas.'
        }
      },
      {
        id: 'q-dp-4',
        topicId: 'dp-fundamentals',
        title: 'Lack of Optimal Substructure',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'Why does the Longest Simple Path problem between two vertices in a general graph FAIL to have optimal substructure?',
        options: [
          'The graph has too many vertices',
          'The subpath of a longest simple path between s and t may not be a longest simple path itself due to vertex non-repeat constraints',
          'Paths cannot be measured with integers',
          'DFS is already optimal'
        ],
        correctAnswer: 1,
        explanation: 'In the longest simple path problem, choosing a path for a subproblem consumes vertices that can no longer be used in the remainder of the path, creating subproblem dependency and violating optimal substructure.',
        commonTrap: 'Assuming all shortest/longest path problems exhibit optimal substructure.'
      },
      {
        id: 'q-dp-5',
        topicId: 'dp-fundamentals',
        title: 'Space Complexity Optimization',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'If dp[i] depends only on dp[i-1] and dp[i-2], what is the minimum auxiliary memory (number of scalar variables) needed to compute the nth term?',
        options: ['1', '2', 'n', 'n^2'],
        correctAnswer: 1,
        explanation: 'Only the two most recent values (prev1 and prev2) must be preserved in memory. Thus, auxiliary space is reduced from O(n) to O(1) using 2 state variables.',
        complexityNote: 'Space optimization reduces table memory when transitions look back only a fixed distance.'
      },
      {
        id: 'q-dp-6',
        topicId: 'dp-fundamentals',
        title: 'State Representation',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: If a problem has 3 parameters that vary during recursion, its tabulation matrix will typically be 3-dimensional.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. The dimensionality of the DP table directly reflects the number of varying parameters in the subproblem state signature (e.g. dp[i][j][k]).'
      }
    ],
    relatedTopicIds: ['matrix-chain-multiplication', 'longest-common-subsequence', 'floyd-warshall'],
    applications: ['Resource allocation', 'Bioinformatics DNA alignment', 'Shortest route navigation algorithms'],
    advantages: ['Converts intractable exponential problems into polynomial time', 'Guaranteed global optimality'],
    limitations: ['Requires subproblem states to fit within memory', 'Not all problems satisfy optimal substructure']
  },
  {
    id: 'matrix-chain-multiplication',
    unitId: 'unit-3',
    unitNumber: 3,
    title: 'Matrix Chain Multiplication (MCM)',
    slug: 'matrix-chain-multiplication',
    category: 'Optimization Problems',
    shortDesc: 'Finding optimal parenthesization of a chain of matrices to minimize total scalar multiplications.',
    prerequisites: ['dp-fundamentals'],
    importance: 'Essential',
    simpleExplanation: 'Multiplying matrices is associative: (A * B) * C = A * (B * C), giving the exact same final matrix. But the number of scalar multiplications can vary wildly! Multiplying a 10x100 matrix by a 100x5 by a 5x50 could take 7,500 operations or 75,000 operations depending on which pair you multiply first. MCM finds the cheapest order.',
    formalDefinition: 'Given a chain <A1, A2, ..., An> of n matrices where matrix Ai has dimensions p_{i-1} x p_i, find a parenthesization that minimizes the total number of scalar multiplications. Recurrence: m[i, j] = 0 if i == j; min_{i <= k < j} { m[i, k] + m[k+1, j] + p_{i-1} * p_k * p_j } if i < j.',
    intuition: 'We cannot multiply all matrices at once. The very last operation must multiply some prefix product (A_i...A_k) by some suffix product (A_{k+1}...A_j). We test all possible split points k from i to j-1, taking the minimum.',
    coreIdeaSteps: [
      'Input: Array p where matrix Ai has dimension p[i-1] x p[i].',
      'Table m[n][n]: m[i][j] stores minimum multiplications for Ai...Aj.',
      'Base cases: Diagonal elements m[i][i] = 0 (single matrix requires 0 multiplications).',
      'Iterate over chain length L from 2 to n:',
      '  For each starting matrix i from 1 to n - L + 1:',
      '    Set ending matrix j = i + L - 1.',
      '    For each possible split point k from i to j - 1:',
      '      cost = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j].',
      '      m[i][j] = min(m[i][j], cost), and record optimal split in s[i][j].'
    ],
    complexity: {
      best: 'O(n^3)',
      average: 'O(n^3)',
      worst: 'O(n^3)',
      auxiliarySpace: 'O(n^2)',
      inputSpace: 'O(n) dimension array',
      explanation: {
        best: 'All O(n^2) subchains evaluate O(n) splits.',
        average: 'Triangular table of size n*(n+1)/2, each cell considers up to n split points.',
        worst: 'Sum_{L=2}^n (n - L + 1)(L - 1) = (n^3 - n)/6 = Theta(n^3).',
        space: 'n x n DP cost matrix m and split matrix s -> O(n^2).'
      }
    },
    code: {
      cpp: `// Matrix Chain Multiplication in C++
#include <vector>
#include <climits>
#include <iostream>

int matrixChainOrder(const std::vector<int>& p) {
    int n = p.size() - 1; // number of matrices
    std::vector<std::vector<int>> m(n + 1, std::vector<int>(n + 1, 0));
    std::vector<std::vector<int>> s(n + 1, std::vector<int>(n + 1, 0));
    
    // L is chain length
    for (int L = 2; L <= n; ++L) {
        for (int i = 1; i <= n - L + 1; ++i) {
            int j = i + L - 1;
            m[i][j] = INT_MAX;
            for (int k = i; k < j; ++k) {
                int cost = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (cost < m[i][j]) {
                    m[i][j] = cost;
                    s[i][j] = k;
                }
            }
        }
    }
    return m[1][n];
}`,
      java: `// Matrix Chain Multiplication in Java
public class MatrixChain {
    public static int minOperations(int[] p) {
        int n = p.length - 1;
        int[][] m = new int[n + 1][n + 1];

        for (int L = 2; L <= n; L++) {
            for (int i = 1; i <= n - L + 1; i++) {
                int j = i + L - 1;
                m[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int cost = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                    if (cost < m[i][j]) m[i][j] = cost;
                }
            }
        }
        return m[1][n];
    }
}`,
      python: `# Matrix Chain Multiplication in Python
def matrix_chain_order(p: list[int]) -> int:
    n = len(p) - 1
    m = [[0] * (n + 1) for _ in range(n + 1)]
    
    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            m[i][j] = float('inf')
            for k in range(i, j):
                cost = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]
                if cost < m[i][j]:
                    m[i][j] = cost
                    
    return m[1][n]`
    },
    visualizerType: 'dp',
    dryRunExample: {
      input: 'Dimensions: p = [10, 30, 5, 60] (3 matrices: A1: 10x30, A2: 30x5, A3: 5x60)',
      output: 'Minimum cost: 4,500 multiplications, Optimal: ((A1 * A2) * A3)',
      steps: [
        { iteration: 1, state: 'm[1][1] = 0, m[2][2] = 0, m[3][3] = 0', explanation: 'Base cases (single matrices cost 0).' },
        { iteration: 2, state: 'm[1][2] = 10 * 30 * 5 = 1,500', explanation: 'Cost to multiply (A1 * A2).' },
        { iteration: 3, state: 'm[2][3] = 30 * 5 * 60 = 9,000', explanation: 'Cost to multiply (A2 * A3).' },
        { iteration: 4, state: 'm[1][3]: Split k=1 -> m[1][1] + m[2][3] + 10*30*60 = 0 + 9000 + 18000 = 27,000. Split k=2 -> m[1][2] + m[3][3] + 10*5*60 = 1500 + 0 + 3000 = 4,500.', explanation: 'Compare splits: min(27000, 4500) = 4,500! Optimal split is k = 2.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Total Catalan parenthesizations: C(n-1) = (1/n) * (2n-2 choose n-1) = Omega(4^n / n^(3/2))',
        'DP Table: m[i, j] = min_{i <= k < j} { m[i, k] + m[k+1, j] + p_{i-1} * p_k * p_j }',
        'Time: O(n^3), Space: O(n^2)'
      ],
      commonTraps: [
        'Looping i from 1 to n and j from 1 to n naively; MCM requires filling diagonally in order of chain length L = j - i + 1.',
        'Confusing number of matrices n with length of dimensions array (which is n + 1).'
      ],
      vivaQuestions: [
        { q: 'Why is the brute force search for Matrix Chain Multiplication exponential?', a: 'Because the number of distinct parenthesizations of n matrices equals the Catalan number C(n-1), which grows exponentially as Ω(4^n / n^(3/2)).' },
        { q: 'In what order must the DP table cells be populated in MCM?', a: 'Diagonally, by increasing chain length L from 2 up to n. To compute m[i, j], all smaller subchains m[i, k] and m[k+1, j] must already be computed.' }
      ]
    },
    questions: [
      {
        id: 'q-mcm-1',
        topicId: 'matrix-chain-multiplication',
        title: 'Catalan Number Growth',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'How many different ways can a product of n matrices A1 * A2 * ... * An be parenthesized?',
        options: [
          'n!',
          'Catalan number C(n-1) = (1/n) * (2n-2 choose n-1)',
          '2^n',
          'n^3'
        ],
        correctAnswer: 1,
        explanation: 'Every full parenthesization corresponds to a unique binary tree with n leaves, which is counted by the (n-1)th Catalan number, growing as Ω(4^n / n^(1.5)).',
        whyWrong: {
          '0': 'n! is permutations, not parenthesizations of associative products.',
          '2': '2^n is subsets, not binary tree bracketings.'
        }
      },
      {
        id: 'q-mcm-2',
        topicId: 'matrix-chain-multiplication',
        title: 'MCM Time Complexity',
        type: 'complexity',
        difficulty: 'Easy',
        question: 'What is the time complexity of the standard Dynamic Programming algorithm for Matrix Chain Multiplication with n matrices?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n^3)'],
        correctAnswer: 3,
        explanation: 'There are O(n^2) pairs (i, j). For each pair, the algorithm loops through up to n choices of k to find the minimum. Total runtime is O(n^2 * n) = O(n^3).',
        complexityNote: 'Hu-Shing algorithm can achieve O(n log n), but standard DP is O(n^3).'
      },
      {
        id: 'q-mcm-3',
        topicId: 'matrix-chain-multiplication',
        title: 'Scalar Multiplications of Two Matrices',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'How many scalar multiplications are required to multiply a matrix A of size 4 x 7 by a matrix B of size 7 x 5?',
        options: ['28', '35', '140', '168'],
        correctAnswer: 2,
        explanation: 'Standard matrix multiplication of (p x q) and (q x r) matrices requires p * q * r scalar multiplications: 4 * 7 * 5 = 140 operations.',
        complexityNote: 'Resulting matrix is 4 x 5.'
      },
      {
        id: 'q-mcm-4',
        topicId: 'matrix-chain-multiplication',
        title: 'Table Filling Order',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'Why cannot the DP table m[i][j] in MCM be filled using standard nested loops: for i=1..n, for j=1..n?',
        options: [
          'Because m[i][j] depends on m[k+1][j], which lies on a higher row (k+1 > i) that would not yet be computed',
          'Because the table is symmetric',
          'Because i must always equal j',
          'Because recursion is required'
        ],
        correctAnswer: 0,
        explanation: 'Computing m[i][j] requires m[k+1][j], which corresponds to a subproblem starting at row k+1. If we loop i from 1 to n, row k+1 has not yet been processed. Hence cells must be filled by increasing chain length L = j - i + 1.',
        commonTrap: 'Assuming all 2D DP tables can be filled row-by-row.'
      },
      {
        id: 'q-mcm-5',
        topicId: 'matrix-chain-multiplication',
        title: 'Optimal Parenthesization Extraction',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'If s[1][4] = 3, what does this indicate about the optimal top-level split of matrices A1 * A2 * A3 * A4?',
        options: [
          '(A1) * (A2 * A3 * A4)',
          '(A1 * A2) * (A3 * A4)',
          '(A1 * A2 * A3) * (A4)',
          'All splits have equal cost'
        ],
        correctAnswer: 2,
        explanation: 'The split index s[i][j] = k indicates that the optimal parenthesization splits the chain into (Ai...Ak) and (Ak+1...Aj). For i=1, j=4, k=3, the optimal split is (A1 * A2 * A3) * (A4).',
        complexityNote: 'The s matrix stores the argmin split indices.'
      },
      {
        id: 'q-mcm-6',
        topicId: 'matrix-chain-multiplication',
        title: 'Diagonal Base Cases',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: In the MCM cost table, all main diagonal entries m[i][i] are strictly 0.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. m[i][i] represents a chain consisting of a single matrix Ai. Multiplying zero other matrices requires zero scalar multiplications.'
      }
    ],
    relatedTopicIds: ['dp-fundamentals', 'longest-common-subsequence', 'floyd-warshall'],
    applications: ['High-performance linear algebra packages (BLAS)', 'Relational database join order optimization', 'Computer graphics transform pipeline chaining'],
    advantages: ['Guarantees minimum computational cost', 'Reconstructs explicit optimal parentheses structure'],
    limitations: ['O(n^3) time is expensive if matrix count n is very large (> 1000)']
  },
  {
    id: 'longest-common-subsequence',
    unitId: 'unit-3',
    unitNumber: 3,
    title: 'Longest Common Subsequence (LCS)',
    slug: 'longest-common-subsequence',
    category: 'Sequence Problems',
    shortDesc: 'Finding the longest sequence appearing in both strings in the same relative order (not necessarily contiguous).',
    prerequisites: ['dp-fundamentals'],
    importance: 'Essential',
    simpleExplanation: 'Unlike a substring which must be unbroken, a subsequence allows gaps: "ACE" is a subsequence of "ABCDE". LCS finds the longest shared pattern between two sequences, which is the foundational algorithm behind `git diff` and DNA matching.',
    formalDefinition: 'Given two sequences X = <x1, ..., xm> and Y = <y1, ..., yn>, find a maximum-length sequence Z that is a subsequence of both X and Y. Recurrence: c[i, j] = 0 if i=0 or j=0; c[i-1, j-1] + 1 if X[i] == Y[j]; max(c[i-1, j], c[i, j-1]) if X[i] != Y[j].',
    intuition: 'If the last characters match (X[i] == Y[j]), that character must be part of the optimal LCS extension: add 1 to the solution for prefixes X[1..i-1] and Y[1..j-1]. If they do not match, the LCS cannot use both last characters simultaneously, so take the max of dropping X[i] or dropping Y[j].',
    coreIdeaSteps: [
      'Create 2D table dp[m+1][n+1] initialized to 0.',
      'Base cases: dp[i][0] = 0 and dp[0][j] = 0 (empty string matches length 0).',
      'For i = 1 to m and j = 1 to n:',
      '  If X[i-1] == Y[j-1]: dp[i][j] = dp[i-1][j-1] + 1 (diagonal transition).',
      '  Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (top or left transition).',
      'Backtrack from dp[m][n] to reconstruct the actual string sequence.'
    ],
    complexity: {
      best: 'O(m * n)',
      average: 'O(m * n)',
      worst: 'O(m * n)',
      auxiliarySpace: 'O(m * n) or O(min(m, n)) for length only',
      inputSpace: 'O(m + n)',
      explanation: {
        best: 'All m x n table entries are evaluated.',
        average: 'Fills m x n grid with O(1) state transitions.',
        worst: 'Theta(m * n) comparisons.',
        space: 'Full table requires O(m * n) space. Rolling 2-row buffer requires O(min(m, n)) space.'
      }
    },
    code: {
      cpp: `// Longest Common Subsequence in C++
#include <vector>
#include <string>
#include <algorithm>

std::string lcs(const std::string& X, const std::string& Y) {
    int m = X.size(), n = Y.size();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (X[i - 1] == Y[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Backtracking to reconstruct LCS string
    std::string result = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (X[i - 1] == Y[j - 1]) {
            result.push_back(X[i - 1]);
            --i; --j;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            --i;
        } else {
            --j;
        }
    }
    std::reverse(result.begin(), result.end());
    return result;
}`,
      java: `// LCS in Java
public class LCS {
    public static int lcsLength(String X, String Y) {
        int m = X.length(), n = Y.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (X.charAt(i - 1) == Y.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`,
      python: `# LCS in Python
def lcs(X: str, Y: str) -> str:
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i - 1] == Y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    # Reconstruct
    res = []
    i, j = m, n
    while i > 0 and j > 0:
        if X[i - 1] == Y[j - 1]:
            res.append(X[i - 1])
            i -= 1; j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return "".join(reversed(res))`
    },
    visualizerType: 'dp',
    dryRunExample: {
      input: 'X = "BD", Y = "ABCD"',
      output: 'LCS = "BD" (length = 2)',
      steps: [
        { iteration: 1, state: 'Row 0 & Col 0 initialized to 0', explanation: 'Base cases.' },
        { iteration: 2, state: 'X[0]="B": matches Y[1]="B" -> dp[1][2] = dp[0][1] + 1 = 1', explanation: 'Character match at index B.' },
        { iteration: 3, state: 'X[1]="D": matches Y[3]="D" -> dp[2][4] = dp[1][3] + 1 = 2', explanation: 'Character match at index D.' },
        { iteration: 4, state: 'Reconstruct path from (2, 4) -> (1, 2) -> (0, 0)', explanation: 'Yields string "BD".' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'c[i, j] = c[i-1, j-1] + 1 if X[i] == Y[j]',
        'c[i, j] = max(c[i-1, j], c[i, j-1]) if X[i] != Y[j]',
        'Length of Shortest Common Supersequence = m + n - LCS(X, Y)',
        'Minimum Deletions & Insertions to transform X to Y = (m - LCS) + (n - LCS)'
      ],
      commonTraps: [
        'Confusing Subsequence with Substring. Substrings must be contiguous; subsequences do not need to be contiguous.',
        'Thinking LCS is unique. Two strings can have multiple distinct subsequences with identical maximum length.'
      ],
      vivaQuestions: [
        { q: 'How does git diff use the Longest Common Subsequence algorithm?', a: 'git diff treats lines of files as tokens and computes the LCS between two file versions. Lines present in the LCS are unchanged; lines in file A but not in LCS are deletions (-); lines in file B but not in LCS are additions (+).' },
        { q: 'Can LCS length be computed with O(min(m, n)) space?', a: 'Yes. Since dp[i][j] only depends on the current row and the immediately preceding row, we only need to store 2 rows at any time.' }
      ]
    },
    questions: [
      {
        id: 'q-lcs-1',
        topicId: 'longest-common-subsequence',
        title: 'LCS vs Substring Distinction',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Given string X = "AGGTAB" and Y = "GXTXAYB", what is their Longest Common Subsequence?',
        options: ['GTAB', 'AGG', 'TXA', 'TAB'],
        correctAnswer: 0,
        explanation: '"GTAB" appears in both X (G-TAB) and Y (G-T-A-B) in the same relative order and has length 4, which is the maximum possible.',
        whyWrong: {
          '1': 'Length is only 3.',
          '2': 'Does not appear in X.',
          '3': 'Length is only 3.'
        }
      },
      {
        id: 'q-lcs-2',
        topicId: 'longest-common-subsequence',
        title: 'Space Optimization Bounds',
        type: 'complexity',
        difficulty: 'Medium',
        question: 'If only the LENGTH of the LCS is required (without reconstructing the string), what is the optimal auxiliary space complexity?',
        options: ['O(1)', 'O(min(m, n))', 'O(m * n)', 'O(m + n)'],
        correctAnswer: 1,
        explanation: 'Because filling row i only requires values from row i-1, we only need two rows of size n+1 (or m+1), achieving O(min(m, n)) auxiliary space.',
        complexityNote: 'Hirschberg\'s algorithm can reconstruct the string in O(m * n) time and O(min(m, n)) space using divide-and-conquer.'
      },
      {
        id: 'q-lcs-3',
        topicId: 'longest-common-subsequence',
        title: 'Shortest Common Supersequence Relation',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'If string X has length 7, string Y has length 6, and their LCS has length 4, what is the length of their Shortest Common Supersequence (SCS)?',
        options: ['9', '13', '10', '7'],
        correctAnswer: 0,
        explanation: 'Length(SCS) = len(X) + len(Y) - len(LCS) = 7 + 6 - 4 = 9.',
        commonTrap: 'Forgetting to subtract the shared LCS characters.'
      },
      {
        id: 'q-lcs-4',
        topicId: 'longest-common-subsequence',
        title: 'Diagonal Transition Rule',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'In the LCS DP table, why do we transition diagonally from dp[i-1][j-1] + 1 when X[i-1] == Y[j-1]?',
        options: [
          'Because both characters match, so neither character can match with any other character in this branch',
          'Because it guarantees minimum operations',
          'Because the table is square',
          'To avoid duplicate keys'
        ],
        correctAnswer: 0,
        explanation: 'When X[i-1] == Y[j-1], this character can safely be appended to the optimal LCS of prefixes X[0..i-2] and Y[0..j-2], increasing the length by 1.'
      },
      {
        id: 'q-lcs-5',
        topicId: 'longest-common-subsequence',
        title: 'Reconstructing Multiple LCS',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: Two strings of equal length can have multiple distinct Longest Common Subsequences of the same maximum length.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. For example, for "AB" and "BA", both "A" and "B" are valid LCS of length 1.'
      },
      {
        id: 'q-lcs-6',
        topicId: 'longest-common-subsequence',
        title: 'Transformation Edit Operations',
        type: 'numerical',
        difficulty: 'Hard',
        question: 'What is the minimum number of insertions and deletions needed to transform "HEAP" into "PEA"?',
        options: ['2', '3', '4', '1'],
        correctAnswer: 1,
        explanation: 'The LCS of "HEAP" and "PEA" is "EA" (length 2). Deletions from "HEAP" = 4 - 2 = 2 (delete H, P). Insertions to form "PEA" = 3 - 2 = 1 (insert P at front). Total edits = 2 + 1 = 3.',
        complexityNote: 'Total operations = (len(X) - LCS) + (len(Y) - LCS).'
      }
    ],
    relatedTopicIds: ['dp-fundamentals', 'matrix-chain-multiplication'],
    applications: ['`git diff` and file reconciliation', 'Bioinformatics DNA/RNA sequence alignment', 'Spell checkers and text diffing utilities'],
    advantages: ['Polynomial O(m*n) time vs 2^(m+n) brute force', 'Reconstructs exact character mappings'],
    limitations: ['O(m*n) space if full DP table is stored for reconstruction without Hirschberg optimization']
  }
];
