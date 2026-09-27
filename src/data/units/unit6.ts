import type { AlgorithmTopic } from '../../types';

export const unit6Topics: AlgorithmTopic[] = [
  {
    id: 'np-completeness-classes',
    unitId: 'unit-6',
    unitNumber: 6,
    title: 'Complexity Classes: P, NP, co-NP & P vs NP',
    slug: 'np-completeness-classes',
    category: 'Complexity Classes',
    shortDesc: 'Theoretical taxonomy of decision problems: polynomial solvability vs polynomial verifiability.',
    prerequisites: ['intro-algorithms', 'asymptotic-notations'],
    importance: 'Essential',
    simpleExplanation: 'Solving a giant Sudoku or finding a needle in a haystack can take hours or centuries. But if someone gives you a completed Sudoku grid, you can verify it is correct in 10 seconds! Class P contains problems that are easy to SOLVE. Class NP contains problems whose proposed solutions are easy to VERIFY. Whether finding a solution is fundamentally as easy as checking one is the famous unresolved "P vs NP" problem.',
    formalDefinition: 'Let L be a decision problem (a formal language over {0, 1}*).\n- P = { L : L can be decided by a deterministic Turing machine in polynomial time O(n^k) }.\n- NP = { L : L can be verified by a deterministic polynomial-time verifier V(x, y) where certificate y has polynomial size |y| <= |x|^c } (or equivalently, decided by a non-deterministic Turing machine in polynomial time).\n- co-NP = { L : Complement(L) in NP } (problems where NO-instances have short verifiable certificates).\n- Status: P <= NP. Whether P = NP remains the foremost open problem in computer science.',
    intuition: 'Verification requires checking a certificate (witness). For Traveling Salesperson: finding the shortest tour is hard, but given a tour of length 450 km, adding the edge weights and confirming it visits all cities takes simple linear time O(n).',
    coreIdeaSteps: [
      'Focus on Decision Problems (output is strictly YES or NO).',
      'Class P: Solvable in polynomial time (e.g., Shortest Path, Minimum Spanning Tree, 2-SAT).',
      'Class NP: A proposed "YES" answer has a succinct certificate verifiable in polynomial time (e.g., Hamiltonian Cycle, 3-SAT, Clique).',
      'Class co-NP: A proposed "NO" answer has a succinct certificate verifiable in polynomial time (e.g., Tautology, Non-Hamiltonian Graph).',
      'Polynomial-Time Reduction: If problem A reduces to problem B in polynomial time (A <=p B), and B is in P, then A is in P.',
      'NP-Complete: A problem X in NP such that EVERY problem Y in NP reduces to X in polynomial time (Y <=p X).'
    ],
    complexity: {
      best: 'P: Polynomial O(n^k)',
      average: 'NP: Verifiable in O(n^k)',
      worst: 'Exhaustive search: O(2^n)',
      auxiliarySpace: 'Polynomial PSPACE',
      explanation: {
        best: 'Deterministic polynomial time for class P problems.',
        average: 'Verification procedure V(x, y) takes deterministic polynomial time.',
        worst: 'Brute-force verification of all possible certificates takes exponential time.',
        space: 'Polynomial-size witness/certificate.'
      }
    },
    code: {
      cpp: `// Polynomial Verifier for the Clique Decision Problem
// Decision Question: Does graph G contain a complete subgraph of size k?
#include <vector>

bool verifyCliqueCertificate(int n, const std::vector<std::vector<int>>& adj, 
                            const std::vector<int>& certificateNodes, int k) {
    // 1. Check size of certificate: O(1)
    if (certificateNodes.size() != static_cast<size_t>(k)) return false;
    
    // 2. Verify all pairs in certificate are connected by an edge: O(k^2)
    for (size_t i = 0; i < certificateNodes.size(); ++i) {
        for (size_t j = i + 1; j < certificateNodes.size(); ++j) {
            int u = certificateNodes[i];
            int v = certificateNodes[j];
            if (adj[u][v] == 0) {
                return false; // Not a clique!
            }
        }
    }
    return true; // Verified in polynomial O(k^2) time!
}`,
      java: `// Polynomial Verifier for Subset Sum in Java
// Verifies whether given subset of indices sums to Target S
public class SubsetSumVerifier {
    public static boolean verify(int[] arr, int[] certificateIndices, int targetS) {
        int sum = 0;
        boolean[] used = new boolean[arr.length];
        
        for (int idx : certificateIndices) {
            if (idx < 0 || idx >= arr.length || used[idx]) return false;
            used[idx] = true;
            sum += arr[idx];
        }
        return sum == targetS; // O(k) verification time
    }
}`,
      python: `# Polynomial Verifier for Hamiltonian Cycle
def verify_hamiltonian_cycle(n: int, adj_matrix: list[list[int]], cycle: list[int]) -> bool:
    """Verifies in O(n) polynomial time whether candidate path is a valid cycle."""
    if len(cycle) != n + 1 or cycle[0] != cycle[-1]:
        return False
        
    # Check all vertices visited exactly once
    if len(set(cycle[:-1])) != n:
        return False
        
    # Check all consecutive edges exist in graph
    for i in range(n):
        u, v = cycle[i], cycle[i + 1]
        if adj_matrix[u][v] == 0:
            return False
            
    return True # Verified in O(n) polynomial time!`
    },
    visualizerType: 'np-reduction',
    dryRunExample: {
      input: 'Graph G with 5 vertices. Target Clique size k = 3. Certificate: {1, 2, 4}',
      output: 'Verdict: YES, valid certificate',
      steps: [
        { iteration: 1, state: 'Check size: len({1, 2, 4}) == 3 == k', explanation: 'Certificate has correct target size.' },
        { iteration: 2, state: 'Check edge (1, 2): Present in G', explanation: 'Valid edge.' },
        { iteration: 3, state: 'Check edge (1, 4): Present in G', explanation: 'Valid edge.' },
        { iteration: 4, state: 'Check edge (2, 4): Present in G', explanation: 'All (3 choose 2) = 3 pairwise edges exist.' },
        { iteration: 5, state: 'Verifier terminates in O(k^2) steps with output ACCEPT', explanation: 'Proves Clique is in NP.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'P: Solvable in polynomial time',
        'NP: Verifiable in polynomial time given a certificate',
        'NP-Complete: In NP and all problems in NP reduce to it in polynomial time',
        'If ANY NP-Complete problem is proven in P, then P = NP!'
      ],
      commonTraps: [
        'Saying "NP stands for Non-Polynomial". NP stands for Nondeterministic Polynomial time.',
        'Claiming P != NP is a proven fact. While widely believed, it is an OPEN mathematical conjecture.',
        'Confusing NP-Hard with NP-Complete. An NP-Hard problem does NOT need to belong to NP (it may not be verifiable in polynomial time, e.g. the Halting Problem).'
      ],
      vivaQuestions: [
        { q: 'What does NP stand for, and what is its formal definition?', a: 'NP stands for Nondeterministic Polynomial time. Formally, it is the set of all decision problems for which a YES-instance has a polynomial-length certificate that can be verified by a deterministic Turing machine in polynomial time.' },
        { q: 'What is the exact distinction between NP-Hard and NP-Complete?', a: 'A problem X is NP-Hard if every problem in NP reduces to X in polynomial time (it is at least as hard as the hardest problems in NP). A problem is NP-Complete if it is both NP-Hard AND belongs to NP.' }
      ]
    },
    questions: [
      {
        id: 'q-npc-1',
        topicId: 'np-completeness-classes',
        title: 'Definition of Class NP',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'What does the acronym "NP" in complexity theory formally stand for?',
        options: [
          'Non-Polynomial time',
          'Nondeterministic Polynomial time',
          'Not Polynomial-time solvable',
          'Nearly Polynomial time'
        ],
        correctAnswer: 1,
        explanation: 'NP stands for Nondeterministic Polynomial time, representing problems solvable in polynomial time by a theoretical non-deterministic Turing machine (or verified in polynomial time deterministically).',
        whyWrong: {
          '0': 'A common misconception; many problems in NP are actually in P (since P is a subset of NP).'
        }
      },
      {
        id: 'q-npc-2',
        topicId: 'np-completeness-classes',
        title: 'Consequence of P = NP',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'If a researcher discovers a polynomial-time algorithm for ANY single NP-Complete problem, what is the theoretical consequence?',
        options: [
          'Only that specific problem is solved in polynomial time',
          'P = NP (every problem in NP can be solved in polynomial time)',
          'All NP-Hard problems become undecidable',
          'Cryptographic encryption algorithms become more secure'
        ],
        correctAnswer: 1,
        explanation: 'By definition of NP-Completeness, every problem in NP can be reduced in polynomial time to any NP-Complete problem. Therefore, solving one in polynomial time solves all of NP in polynomial time, proving P = NP.',
        commonTrap: 'Thinking NP-complete problems are unrelated to each other.'
      },
      {
        id: 'q-npc-3',
        topicId: 'np-completeness-classes',
        title: 'NP-Hard vs NP-Complete',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: Every NP-Complete problem is NP-Hard, but NOT every NP-Hard problem is NP-Complete.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. To be NP-Complete, a problem must be NP-Hard AND belong to NP. For example, the Halting Problem is NP-Hard, but it is undecidable and therefore NOT in NP (so it is not NP-Complete).',
        complexityNote: 'NP-Complete = NP-Hard ∩ NP.'
      },
      {
        id: 'q-npc-4',
        topicId: 'np-completeness-classes',
        title: 'Verification vs Solution',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Which of the following is in P?',
        options: [
          'Finding a 3-coloring of a general graph',
          'Finding a Hamiltonian cycle in a general graph',
          'Determining whether a graph has a cycle',
          'Solving the 0/1 Knapsack decision problem'
        ],
        correctAnswer: 2,
        explanation: 'Detecting a cycle in a graph is easily solved in linear time O(|V| + |E|) using BFS or DFS, making it belonging to class P. The other three are well-known NP-Complete problems.',
        whyWrong: {
          '0': 'Graph 3-Coloring is NP-Complete (though 2-coloring is in P).',
          '1': 'Hamiltonian Cycle is NP-Complete.',
          '3': '0/1 Knapsack is NP-Complete.'
        }
      },
      {
        id: 'q-npc-5',
        topicId: 'np-completeness-classes',
        title: 'Cook-Levin Theorem',
        type: 'dry-run',
        difficulty: 'Hard',
        question: 'What was the foundational breakthrough established by the Cook-Levin Theorem (1971)?',
        options: [
          'Proving that P does not equal NP',
          'Proving that the Boolean Satisfiability problem (SAT) is NP-Complete without needing to reduce from another problem',
          'Proving that QuickSort is optimal',
          'Proving that all NP problems are undecidable'
        ],
        correctAnswer: 1,
        explanation: 'The Cook-Levin Theorem proved that SAT is NP-Complete directly from first principles by showing how any nondeterministic Turing machine computation running in polynomial time can be encoded as a Boolean formula in polynomial time.',
        complexityNote: 'It provided the root problem from which all other NP-completeness reductions branch.'
      },
      {
        id: 'q-npc-6',
        topicId: 'np-completeness-classes',
        title: 'Complement of Class NP',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'What characterizes a problem in class co-NP?',
        options: [
          'It cannot be verified in polynomial time',
          'A "NO" instance has a concise certificate that can be verified in polynomial time',
          'It is strictly harder than NP-Hard',
          'It is the complement of class P'
        ],
        correctAnswer: 1,
        explanation: 'co-NP is the class of decision problems where a candidate counterexample showing the answer is "NO" can be verified in polynomial time (e.g. proving a formula is NOT a tautology by providing one falsifying assignment).'
      }
    ],
    relatedTopicIds: ['reductions-np-problems', 'intro-algorithms'],
    applications: ['Theoretical limits of computation', 'Public-key cryptography foundation (RSA, ECC)', 'Hardware verification and model checking'],
    advantages: ['Classifies computational difficulty objectively', 'Prevents wasting engineering resources seeking impossible polynomial exact algorithms'],
    limitations: ['Only analyzes worst-case asymptotic bounds; heuristics and approximation algorithms often solve real-world instances effectively']
  },
  {
    id: 'reductions-np-problems',
    unitId: 'unit-6',
    unitNumber: 6,
    title: 'Polynomial Reductions: 3-SAT, Clique & Vertex Cover',
    slug: 'reductions-np-problems',
    category: 'NP Reductions',
    shortDesc: 'Techniques for transforming one problem to another in polynomial time to prove NP-Completeness.',
    prerequisites: ['np-completeness-classes'],
    importance: 'Essential',
    simpleExplanation: 'Suppose you have a magic tool that solves jigsaw puzzles. If you can take any crossword puzzle and mechanically convert it into a jigsaw puzzle in 5 minutes, such that solving the jigsaw puzzle also solves the crossword, then crosswords cannot be harder than jigsaws. That conversion is a polynomial reduction.',
    formalDefinition: 'A language L1 is polynomial-time many-one reducible to L2 (written L1 <=p L2) if there exists a polynomial-time computable function f: {0, 1}* -> {0, 1}* such that for all x in {0, 1}*, x in L1 if and only if f(x) in L2. \nTo prove a new problem B is NP-Complete: \n1. Prove B is in NP (provide polynomial verifier).\n2. Choose a known NP-Complete problem A (e.g., 3-SAT).\n3. Construct a polynomial transformation f from A to B.\n4. Prove both directions: x in A <=> f(x) in B.',
    intuition: 'The reduction direction is crucial: A <=p B means "A is at most as hard as B" or "B is at least as hard as A". To prove B is hard, you must reduce a KNOWN HARD problem into B.',
    coreIdeaSteps: [
      'Reduction Direction: Known NP-Complete Problem A  ---(f in poly-time)--->  Target Problem B.',
      'Forward Correctness: If instance x of A evaluates to YES, then f(x) of B must evaluate to YES.',
      'Backward Correctness: If f(x) of B evaluates to YES, then x of A must evaluate to YES (or contrapositive: NO <=> NO).',
      'Polynomial Time: The transformation f must execute in polynomial time O(n^k).',
      'Canonical Chain: Circuit-SAT -> 3-SAT -> Clique -> Vertex Cover -> Subset Sum -> Hamiltonian Cycle.'
    ],
    complexity: {
      best: 'Reduction Time: O(n^k)',
      average: 'Reduction Time: O(n^k)',
      worst: 'Target Problem: Exponential O(2^n)',
      auxiliarySpace: 'Polynomial O(n^k)',
      explanation: {
        best: 'The transformation function f must run strictly in polynomial time.',
        average: 'Instance expansion is bounded by a polynomial factor.',
        worst: 'Solving target instance B may take exponential time, but transforming A to B is polynomial.',
        space: 'Transformed instance size |f(x)| <= p(|x|).'
      }
    },
    code: {
      cpp: `// Polynomial Reduction: 3-SAT to Independent Set / Clique
// For each clause (l1 OR l2 OR l3), create a triangle of 3 vertices.
// Connect vertices across clauses if and only if they represent mutually contradictory literals (x and NOT x).
#include <vector>
#include <string>

struct Literal {
    int var;
    bool isNegated;
};

struct Clause {
    Literal l1, l2, l3;
};

// Constructs an Independent Set instance (G, k) from 3-SAT with m clauses
void reduce3SatToIndependentSet(const std::vector<Clause>& clauses, 
                                std::vector<std::vector<int>>& adj, int& k) {
    int m = clauses.size();
    int totalVertices = 3 * m; // 3 vertices per clause -> O(m) size
    adj.assign(totalVertices, std::vector<int>(totalVertices, 0));
    k = m; // Must choose 1 true literal per clause
    
    // 1. Edges within same clause triangle
    for (int i = 0; i < m; ++i) {
        int v1 = 3 * i, v2 = 3 * i + 1, v3 = 3 * i + 2;
        adj[v1][v2] = adj[v2][v1] = 1;
        adj[v2][v3] = adj[v3][v2] = 1;
        adj[v1][v3] = adj[v3][v1] = 1;
    }
    
    // 2. Edges between contradictory literals across different clauses
    // If literal u is variable X and literal v is NOT X, add edge (u, v)
    // Ensures we cannot pick conflicting truth assignments
}`,
      java: `// 3-SAT to Vertex Cover Reduction Outline in Java
public class ReductionDemo {
    public static void satToVertexCover(int numVars, int numClauses) {
        // Variable gadget: 2 vertices for each variable (x_i and not_x_i) with an edge between them
        int varVertices = 2 * numVars;
        // Clause gadget: 3 vertices for each clause (a triangle of 3 edges)
        int clauseVertices = 3 * numClauses;
        
        int totalVertices = varVertices + clauseVertices;
        int targetCoverK = numVars + 2 * numClauses;
        // Construction runs in strictly polynomial time O(vars + clauses)
    }
}`,
      python: `# Reduction: Independent Set to Vertex Cover
# Graph G has an Independent Set of size k iff G has a Vertex Cover of size (|V| - k)
def independent_set_to_vertex_cover(num_vertices: int, k_is: int) -> int:
    """Transforms Independent Set parameter k to Vertex Cover parameter k'."""
    k_vc = num_vertices - k_is
    # The graph G remains exactly the same!
    # Transformation takes O(1) time and is completely solution-preserving.
    return k_vc`
    },
    visualizerType: 'np-reduction',
    dryRunExample: {
      input: 'Formula: (x1 OR x2 OR x3) AND (NOT x1 OR NOT x2 OR x3). m = 2 clauses.',
      output: 'Graph with 3*2 = 6 vertices. Independent Set target k = 2.',
      steps: [
        { iteration: 1, state: 'Clause 1: Vertices {v1: x1, v2: x2, v3: x3} formed into Triangle 1', explanation: 'At most 1 vertex per triangle can be in an independent set.' },
        { iteration: 2, state: 'Clause 2: Vertices {v4: NOT x1, v5: NOT x2, v6: x3} formed into Triangle 2', explanation: 'At most 1 vertex in Triangle 2 can be selected.' },
        { iteration: 3, state: 'Add contradiction edges: (v1, v4) since x1 conflicts with NOT x1; (v2, v5) since x2 conflicts with NOT x2', explanation: 'Prevents contradictory variable truth assignments.' },
        { iteration: 4, state: 'Pick {v1: x1, v6: x3}: no edge between them! Size = 2 = k.', explanation: 'Yields valid satisfying assignment: x1=True, x3=True.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'A <=p B: A reduces to B in polynomial time',
        'If A is NP-Hard and A <=p B, then B is NP-Hard',
        'Theorem: Independent Set size k <=> Vertex Cover size (|V| - k)',
        '3-SAT is in 3-CNF form: conjunction (AND) of clauses, each with exactly 3 literals'
      ],
      commonTraps: [
        'REVERSING the reduction direction! Reducing the new problem B to known problem A (B <=p A) does NOT prove B is NP-complete (it only shows B is no harder than A). You must reduce A <=p B.',
        'Thinking 2-SAT is NP-Complete. 2-SAT is solvable in linear O(|V| + |E|) time using strongly connected components (SCCs) via Tarjan/Kosaraju.'
      ],
      vivaQuestions: [
        { q: 'Why must the reduction function f run in polynomial time?', a: 'Because if the reduction itself took exponential time, finding a polynomial-time solver for problem B would still leave total runtime exponential, breaking the ability to solve problem A in polynomial time.' },
        { q: 'Prove that Vertex Cover and Independent Set are complementary problems.', a: 'A set of vertices S is an Independent Set (no two vertices in S share an edge) if and only if its complement V - S is a Vertex Cover (every edge has at least one endpoint in V - S). Thus G has an independent set of size k <=> G has a vertex cover of size |V| - k.' }
      ]
    },
    questions: [
      {
        id: 'q-red-1',
        topicId: 'reductions-np-problems',
        title: 'Correct Reduction Direction',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'To prove that an unknown new problem B is NP-Hard, which reduction must be constructed?',
        options: [
          'Reduce B to a known NP-Hard problem A (B <=p A)',
          'Reduce a known NP-Hard problem A to the new problem B (A <=p B)',
          'Reduce B to a problem in P',
          'Reduce a problem in P to B'
        ],
        correctAnswer: 1,
        explanation: 'We must reduce from a known NP-Hard problem A into B (A <=p B). This proves that if we could solve B in polynomial time, we could solve known-hard problem A in polynomial time, establishing that B is at least as hard as A.',
        whyWrong: {
          '0': 'Reducing B to A only proves that B is no harder than A (an upper bound on B\'s difficulty, not a lower bound).'
        },
        commonTrap: 'Accidentally reversing the direction of reduction.'
      },
      {
        id: 'q-red-2',
        topicId: 'reductions-np-problems',
        title: '2-SAT vs 3-SAT Complexity',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'What is the computational complexity difference between 2-SAT (clauses of 2 literals) and 3-SAT (clauses of 3 literals)?',
        options: [
          'Both are NP-Complete',
          '2-SAT is in P (solvable in linear time), while 3-SAT is NP-Complete',
          '2-SAT is undecidable, 3-SAT is in P',
          'Both are in P'
        ],
        correctAnswer: 1,
        explanation: '2-SAT can be modeled as an implication graph and solved in linear O(N + M) time using Strongly Connected Components (checking if x and NOT x are in the same SCC). 3-SAT is proven NP-Complete.',
        complexityNote: 'Shows how a seemingly small constraint change (2 to 3 literals) triggers an exponential phase transition.'
      },
      {
        id: 'q-red-3',
        topicId: 'reductions-np-problems',
        title: 'Independent Set to Vertex Cover Duality',
        type: 'dry-run',
        difficulty: 'Easy',
        question: 'A graph G has 10 vertices. If the maximum Independent Set in G has size 7, what is the size of the minimum Vertex Cover?',
        options: ['7', '3', '10', '4'],
        correctAnswer: 1,
        explanation: 'By the complement theorem, a set S is an Independent Set if and only if V - S is a Vertex Cover. Minimum Vertex Cover = |V| - Maximum Independent Set = 10 - 7 = 3.',
        complexityNote: '|Independent Set| + |Vertex Cover| = |V|.'
      },
      {
        id: 'q-red-4',
        topicId: 'reductions-np-problems',
        title: 'Clique to Independent Set Transformation',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'How is the Clique problem reduced to the Independent Set problem on a graph G = (V, E)?',
        options: [
          'Find the Minimum Spanning Tree of G',
          'Construct the complement graph G\' = (V, E\') where E\' contains all edges NOT in E. A clique of size k in G is an independent set of size k in G\'.',
          'Double the weight of all edges',
          'Remove all leaf nodes'
        ],
        correctAnswer: 1,
        explanation: 'In the complement graph G\', an edge exists between u and v if and only if NO edge existed in G. Therefore, a complete pairwise connected clique in G has zero edges between its vertices in G\', forming an Independent Set.',
        commonTrap: 'Thinking graph complementation requires complex algebraic reductions.'
      },
      {
        id: 'q-red-5',
        topicId: 'reductions-np-problems',
        title: 'Integer Linear Programming NP-Completeness',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: While Linear Programming (LP with continuous real variables) can be solved in polynomial time (e.g. via Interior Point methods), Integer Linear Programming (ILP with integer variables) is NP-Complete.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Linear Programming over real numbers is in P (proven by Khachiyan and Karmarkar). Adding the restriction that variables must be integers (ILP) makes the problem NP-Complete, as 3-SAT or Vertex Cover can easily be encoded into integer linear inequalities.',
        complexityNote: 'Continuous LP is in P; Integer LP is NP-Complete.'
      },
      {
        id: 'q-red-6',
        topicId: 'reductions-np-problems',
        title: 'Polynomial Time Preservation',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'If A <=p B and B is known to be in P, what can we definitively conclude about problem A?',
        options: [
          'A is NP-Complete',
          'A is in P (solvable in polynomial time)',
          'A is NP-Hard',
          'Nothing can be concluded about A'
        ],
        correctAnswer: 1,
        explanation: 'If problem A reduces to B in polynomial time (O(n^k)), and problem B can be solved in polynomial time (O(n^m)), we can solve A by running the reduction and then running B\'s solver, with total time O(n^(k*m)), proving A is in P.'
      }
    ],
    relatedTopicIds: ['np-completeness-classes', 'backtracking-nqueens'],
    applications: ['Automated theorem proving', 'Combinatorial optimization modeling via CPLEX/Gurobi ILP solvers', 'Compiler instruction scheduling and register allocation'],
    advantages: ['Enables solving dozens of diverse industrial problems using a single optimized SAT or ILP solver engine', 'Proves equivalence between seemingly unrelated problem domains'],
    limitations: ['Reductions do not preserve approximation ratios unless affine/L-reductions']
  }
];
