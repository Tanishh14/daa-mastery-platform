import type { AlgorithmTopic } from '../../types';

export const unit1Topics: AlgorithmTopic[] = [
  {
    id: 'intro-algorithms',
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Introduction to Algorithms & Complexity',
    slug: 'intro-algorithms',
    category: 'Complexity',
    shortDesc: 'Foundations of algorithmic problem solving, step-by-step specifications, and time/space resource consumption.',
    prerequisites: ['Basic Discrete Math', 'Elementary Programming'],
    importance: 'Foundational',
    simpleExplanation: 'An algorithm is like a precise recipe: given inputs, it follows unambiguous steps to produce a correct output in finite time. We measure its quality not by clock seconds (which vary by machine), but by how its operations scale as input size grows.',
    formalDefinition: 'An algorithm is a well-defined computational procedure that takes some value, or set of values, as input and produces some value, or set of values, as output. It must satisfy finiteness, definiteness, input, output, and effectiveness (Knuth).',
    intuition: 'If your code takes 1ms for 10 items, does it take 10ms, 100ms, or 10 years for 1,000,000 items? Time and space complexity measure this fundamental growth rate independently of hardware or programming language.',
    coreIdeaSteps: [
      'Specify input preconditions and desired postconditions mathematically.',
      'Formulate deterministic, unambiguous sequence of computational instructions.',
      'Quantify primary basic operations executed as a function T(n) of input size n.',
      'Quantify peak auxiliary memory S(n) required during execution.',
      'Determine growth rate as n approaches infinity (asymptotic behavior).'
    ],
    complexity: {
      best: 'Problem Dependent',
      average: 'Problem Dependent',
      worst: 'Problem Dependent',
      auxiliarySpace: 'O(1) to O(n)',
      inputSpace: 'O(n)',
      explanation: {
        best: 'Minimum computational steps for the most favorable input configuration.',
        average: 'Expected steps taken under a uniform probability distribution of valid inputs.',
        worst: 'Maximum steps across all possible inputs of size n; guarantees an upper-bound performance safety net.',
        space: 'Auxiliary memory allocated beyond the read-only input itself.'
      }
    },
    code: {
      cpp: `// Fundamental Algorithm Evaluation Pattern
#include <iostream>
#include <vector>

long long sumArray(const std::vector<int>& arr) {
    long long total = 0; // O(1) space
    for (int num : arr) { // n iterations
        total += num;     // 1 operation per iteration -> T(n) = O(n)
    }
    return total;
}`,
      java: `// Fundamental Algorithm Evaluation Pattern
public class AlgorithmBasics {
    public static long sumArray(int[] arr) {
        long total = 0; // O(1) space
        for (int num : arr) { // n iterations
            total += num;     // T(n) = O(n)
        }
        return total;
    }
}`,
      python: `# Fundamental Algorithm Evaluation Pattern
def sum_array(arr: list[int]) -> int:
    total = 0  # O(1) auxiliary space
    for num in arr:  # n iterations -> T(n) = O(n)
        total += num
    return total`
    },
    visualizerType: 'asymptotic',
    dryRunExample: {
      input: 'Array: [3, 7, 2, 9, 5], n = 5',
      output: 'Sum: 26',
      steps: [
        { iteration: 0, state: 'total = 0', explanation: 'Initialization: auxiliary space allocated.' },
        { iteration: 1, state: 'num = 3, total = 3', explanation: 'Read arr[0], 1 addition.' },
        { iteration: 2, state: 'num = 7, total = 10', explanation: 'Read arr[1], 1 addition.' },
        { iteration: 3, state: 'num = 2, total = 12', explanation: 'Read arr[2], 1 addition.' },
        { iteration: 4, state: 'num = 9, total = 21', explanation: 'Read arr[3], 1 addition.' },
        { iteration: 5, state: 'num = 5, total = 26', explanation: 'Read arr[4], loop terminates in exactly n steps.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Time Complexity T(n) = c * count_of_primitive_operations(n)',
        'Total Space = Input Space + Auxiliary Space',
        'RAM Model: Each elementary instruction (arithmetic, assignment, pointer dereference) costs O(1) uniform time.'
      ],
      commonTraps: [
        'Conflating wall-clock execution time (seconds) with theoretical asymptotic complexity.',
        'Ignoring hidden language abstraction costs (e.g. string slicing creating O(n) copies in Python).'
      ],
      vivaQuestions: [
        { q: 'What is the RAM model of computation and why do we use it in DAA?', a: 'The Random Access Machine (RAM) model assumes basic operations (add, store, branch) take 1 unit of time and memory access is O(1). It abstracts hardware nuances so algorithms can be compared objectively.' },
        { q: 'Can an algorithm have O(1) auxiliary space but O(n) total space?', a: 'Yes. An algorithm processing an array of size n that only modifies variables in-place uses O(n) input space but O(1) auxiliary space.' }
      ]
    },
    questions: [
      {
        id: 'q-intro-1',
        topicId: 'intro-algorithms',
        title: 'RAM Computational Model',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Under the standard RAM model used in algorithm analysis, what is the cost assigned to basic arithmetic operations?',
        options: [
          'Variable time depending on processor clock speed',
          'O(1) uniform constant time',
          'Logarithmic in the magnitude of operand values',
          'O(n) where n is input size'
        ],
        correctAnswer: 1,
        explanation: 'The RAM model assumes that primitive operations (addition, subtraction, logical ops, pointer access) execute in constant O(1) time regardless of physical CPU architecture.',
        whyWrong: {
          '0': 'Physical clock speed is hardware-specific, which algorithmic complexity intentionally abstracts away.',
          '2': 'Only arbitrary-precision bignum libraries require logarithmic/bit complexity; standard machine-word arithmetic is O(1).',
          '3': 'Primitive scalar arithmetic does not scale with the problem array size n.'
        },
        commonTrap: 'Thinking that algorithm analysis measures physical CPU nanoseconds.'
      },
      {
        id: 'q-intro-2',
        topicId: 'intro-algorithms',
        title: 'Auxiliary vs Total Space',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'An algorithm takes an input array of size n, creates a temporary copy of size n, and performs sorting using 3 pointer variables. What is its auxiliary space complexity?',
        options: ['O(1)', 'O(n)', 'O(n + 3)', 'O(2n)'],
        correctAnswer: 1,
        explanation: 'Auxiliary space is the extra memory allocated by the algorithm beyond the input itself. Creating a temporary copy of size n requires O(n) auxiliary space.',
        whyWrong: {
          '0': 'O(1) would only hold if the sort were in-place without the temporary array copy.',
          '2': 'Constants like +3 are dropped in asymptotic notation.',
          '3': 'O(2n) simplifies asymptotically to O(n).'
        },
        commonTrap: 'Confusing in-place algorithms (O(1) auxiliary space) with algorithms that duplicate input buffers.'
      },
      {
        id: 'q-intro-3',
        topicId: 'intro-algorithms',
        title: 'Criteria for a Valid Algorithm',
        type: 'multiple-select',
        difficulty: 'Medium',
        question: 'Which of the following are mandatory properties of an algorithm according to Knuth?',
        options: [
          'Finiteness: must terminate after a finite number of steps',
          'Definiteness: each step must be clear and unambiguous',
          'Optimality: must be the fastest possible mathematical solution',
          'Input: must accept zero or more external quantities'
        ],
        correctAnswer: [0, 1, 3],
        explanation: 'Knuth defines 5 properties: Finiteness, Definiteness, Input, Output, and Effectiveness. Optimality is a desirable goal, not a mandatory condition for being classified as an algorithm.',
        commonTrap: 'Assuming heuristic or non-optimal algorithms are not technically algorithms.'
      },
      {
        id: 'q-intro-4',
        topicId: 'intro-algorithms',
        title: 'Loop Complexity Identification',
        type: 'complexity',
        difficulty: 'Easy',
        question: 'What is the time complexity of the following loop: for (int i = 1; i <= n; i *= 2) { ... }?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'Since the loop variable i doubles in each iteration (1, 2, 4, 8, ...), after k steps i = 2^k. Terminating when 2^k > n yields k = ceil(log2 n) steps, making the time complexity O(log n).',
        complexityNote: 'Doubling or halving a loop counter always yields logarithmic execution steps.'
      },
      {
        id: 'q-intro-5',
        topicId: 'intro-algorithms',
        title: 'Space Complexity of Recursive Stack',
        type: 'dry-run',
        difficulty: 'Hard',
        question: 'A recursive function calls itself twice with argument (n-1) until n <= 0. What is the maximum auxiliary space occupied on the runtime call stack?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(2^n)'],
        correctAnswer: 2,
        explanation: 'Although the total number of function calls is exponential (2^n - 1), memory on the call stack is determined by the MAXIMUM DEPTH of the recursion branch at any single moment. The recursion tree has depth n, so call stack memory is O(n).',
        whyWrong: {
          '0': 'Each recursive call consumes a stack frame.',
          '1': 'O(log n) stack depth corresponds to divide-and-conquer (n/2), not (n-1).',
          '3': 'Total operations are O(2^n), but stack frames are reclaimed upon returning, so active stack space is only O(n).'
        },
        commonTrap: 'Confusing total call node count O(2^n) with peak call stack depth O(n).'
      },
      {
        id: 'q-intro-6',
        topicId: 'intro-algorithms',
        title: 'Asymptotic Significance',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: If Algorithm A takes 1000n operations and Algorithm B takes 0.01n^2 operations, Algorithm A is guaranteed to execute fewer operations for sufficiently large n.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. 1000n < 0.01n^2 for all n > 100,000. Asymptotically linear growth O(n) always eventually beats quadratic growth O(n^2), regardless of leading constant factors.',
        commonTrap: 'Being misled by the initial large constant (1000 vs 0.01) on small n.'
      }
    ],
    relatedTopicIds: ['asymptotic-notations', 'analysis-recursive', 'binary-search'],
    applications: ['Resource planning in distributed systems', 'Database query plan optimization', 'Embedded systems memory profiling'],
    advantages: ['Hardware-agnostic comparison', 'Predicts scalability to massive data'],
    limitations: ['Ignores hardware cache lines and memory latency', 'High constant factors can make asymptotically slower algorithms faster for small n']
  },
  {
    id: 'asymptotic-notations',
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Asymptotic Notations: Big O, Ω, Θ, and little o',
    slug: 'asymptotic-notations',
    category: 'Complexity',
    shortDesc: 'Mathematical bounds for algorithmic growth rates: upper, lower, tight, and strict bounds.',
    prerequisites: ['intro-algorithms', 'Basic Calculus / Limits'],
    importance: 'Essential',
    simpleExplanation: 'Asymptotic notations provide a mathematical shorthand for rates of growth. Big-O gives an upper ceiling ("it will not grow faster than this"), Big-Omega gives a lower floor ("it takes at least this much"), and Theta gives a tight sandwich bound where upper and lower match.',
    formalDefinition: 'Let f(n) and g(n) be non-negative functions. \n- f(n) = O(g(n)) iff ∃ c > 0, n0 > 0 such that f(n) ≤ c · g(n) ∀ n ≥ n0.\n- f(n) = Ω(g(n)) iff ∃ c > 0, n0 > 0 such that f(n) ≥ c · g(n) ∀ n ≥ n0.\n- f(n) = Θ(g(n)) iff f(n) = O(g(n)) and f(n) = Ω(g(n)).\n- f(n) = o(g(n)) iff ∀ c > 0, ∃ n0 > 0 such that f(n) < c · g(n) ∀ n ≥ n0 (or lim n→∞ f(n)/g(n) = 0).',
    intuition: 'Think of Big-O as ≤, Big-Omega as ≥, Theta as =, and little-o as < in terms of growth rates as n tends towards infinity.',
    coreIdeaSteps: [
      'Identify the highest-order dominant term in the runtime equation T(n).',
      'Discard lower-order terms (e.g. in 3n^2 + 5n + 12, discard 5n and 12).',
      'Discard positive constant multipliers (drop 3, leaving n^2).',
      'Confirm the formal inequality by finding valid constants (c, n0).',
      'Distinguish between loose upper bounds (O) and strict non-tight bounds (o).'
    ],
    complexity: {
      best: 'Formal Proof',
      average: 'Analytical Bound',
      worst: 'Asymptotic Envelope',
      auxiliarySpace: 'O(1)',
      explanation: {
        best: 'Characterized via Ω bound on the best-case input family.',
        average: 'Characterized via Θ or O on probabilistic expected runtime.',
        worst: 'Characterized via O or Θ on the worst-case input family.',
        space: 'Mathematical analysis requires constant scratch space.'
      }
    },
    code: {
      cpp: `// Demonstration of growth classes
// O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)
#include <iostream>
#include <cmath>

bool verifyBigO(double (*f)(double), double (*g)(double), double c, double n0, double testN) {
    if (testN < n0) return true;
    return f(testN) <= c * g(testN);
}`,
      java: `// Growth Verification Demo
import java.util.function.Function;

public class AsymptoticCheck {
    public static boolean verifyBound(Function<Double, Double> f, 
                                      Function<Double, Double> g, 
                                      double c, double n0, double n) {
        if (n < n0) return true;
        return f.apply(n) <= c * g.apply(n);
    }
}`,
      python: `# Growth Verification Demo
def verify_big_o(f, g, c: float, n0: float, n_val: float) -> bool:
    """Verifies f(n) <= c * g(n) for n >= n0."""
    if n_val < n0:
        return True
    return f(n_val) <= c * g(n_val)`
    },
    visualizerType: 'asymptotic',
    dryRunExample: {
      input: 'Prove 3n^2 + 5n + 2 = O(n^2)',
      output: 'c = 10, n0 = 1',
      steps: [
        { iteration: 1, state: 'For n >= 1: 5n <= 5n^2 and 2 <= 2n^2', explanation: 'Replace lower order terms by higher order powers.' },
        { iteration: 2, state: '3n^2 + 5n + 2 <= 3n^2 + 5n^2 + 2n^2 = 10n^2', explanation: 'Combine terms to obtain upper bound c * g(n).' },
        { iteration: 3, state: 'Choose c = 10, n0 = 1', explanation: 'Since 3n^2 + 5n + 2 <= 10n^2 for all n >= 1, the definition holds.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'f(n) = O(g(n)) <=> lim_{n->inf} f(n)/g(n) < infinity',
        'f(n) = o(g(n)) <=> lim_{n->inf} f(n)/g(n) = 0',
        'f(n) = Theta(g(n)) <=> lim_{n->inf} f(n)/g(n) = L, where 0 < L < infinity'
      ],
      commonTraps: [
        'Saying an algorithm is O(n^2) does not mean it cannot also run in O(n) or O(1) on some inputs (Big-O is merely an upper bound, not necessarily tight).',
        'Confusing little-o with Big-O: 2n = O(n) is true, but 2n = o(n) is false because lim 2n/n = 2 != 0.'
      ],
      vivaQuestions: [
        { q: 'What is the exact distinction between Big-O and Theta?', a: 'Big-O is an asymptotic upper bound (f <= c*g). Theta is an asymptotically tight bound (c1*g <= f <= c2*g), meaning both upper and lower bounds match.' },
        { q: 'Is n^2 = O(n^3)? Is n^2 = o(n^3)?', a: 'Yes to both. n^2 <= 1 * n^3 for n >= 1 (Big-O), and lim(n^2/n^3) = lim(1/n) = 0 as n->inf (little-o strict upper bound).' }
      ]
    },
    questions: [
      {
        id: 'q-asym-1',
        topicId: 'asymptotic-notations',
        title: 'Limit Definition of Theta',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'If lim_{n -> ∞} [ f(n) / g(n) ] = 7, which asymptotic relationship is mathematically correct?',
        options: [
          'f(n) = o(g(n))',
          'f(n) = Θ(g(n))',
          'f(n) = ω(g(n))',
          'g(n) = o(f(n))'
        ],
        correctAnswer: 1,
        explanation: 'When the limit of the ratio is a finite positive constant (here 7), f(n) and g(n) grow at the exact same rate asymptotically, meaning f(n) = Θ(g(n)).',
        whyWrong: {
          '0': 'little-o requires the limit to equal 0.',
          '2': 'little-omega requires the limit to equal infinity.',
          '3': 'If f/g -> 7, then g/f -> 1/7, which is also finite positive, not 0.'
        }
      },
      {
        id: 'q-asym-2',
        topicId: 'asymptotic-notations',
        title: 'Tight vs Loose Bounds',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Which of the following statements is FALSE?',
        options: [
          '3n + 4 = O(n)',
          '3n + 4 = O(n^2)',
          '3n + 4 = Θ(n^2)',
          '3n + 4 = o(n^2)'
        ],
        correctAnswer: 2,
        explanation: '3n + 4 = Θ(n^2) is FALSE because 3n + 4 does not grow at the rate of n^2; it is strictly smaller, so no positive lower constant c1 exists such that 3n + 4 >= c1 * n^2 for large n.',
        whyWrong: {
          '0': 'True, linear upper bound with c=7, n0=1.',
          '1': 'True, n^2 is a valid (loose) upper bound.',
          '3': 'True, lim (3n+4)/n^2 = 0, so little-o holds.'
        }
      },
      {
        id: 'q-asym-3',
        topicId: 'asymptotic-notations',
        title: 'Growth Rate Ordering',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'Arrange the following functions in increasing order of asymptotic growth: f1(n) = 2^n, f2(n) = n^(log2 n), f3(n) = n!, f4(n) = n^100.',
        options: [
          'f4 < f2 < f1 < f3',
          'f2 < f4 < f1 < f3',
          'f4 < f1 < f2 < f3',
          'f2 < f1 < f4 < f3'
        ],
        correctAnswer: 0,
        explanation: 'Taking logarithms: log(f4) = 100 log n (polynomial). log(f2) = (log n)^2 (quasi-polynomial). log(f1) = n (exponential). log(f3) = n log n (factorial). Thus: n^100 < n^(log n) < 2^n < n! for sufficiently large n.',
        commonTrap: 'Believing n^100 is larger than n^(log n). For n > 2^100, (log n)^2 > 100 log n.'
      },
      {
        id: 'q-asym-4',
        topicId: 'asymptotic-notations',
        title: 'Definition of little-o',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: If f(n) = o(g(n)), then f(n) = O(g(n)) AND f(n) ≠ Θ(g(n)).',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. little-o denotes a strictly tighter upper bound where f grows strictly slower than g. Hence it satisfies Big-O but cannot satisfy Theta (which requires matching lower bound).',
        complexityNote: 'little-o is the strict inequality (<) analog of Big-O (<=).'
      },
      {
        id: 'q-asym-5',
        topicId: 'asymptotic-notations',
        title: 'Transitivity of Big-O',
        type: 'multiple-select',
        difficulty: 'Medium',
        question: 'Which of the following algebraic properties hold for Big-O notation?',
        options: [
          'Transitivity: If f = O(g) and g = O(h), then f = O(h)',
          'Symmetry: If f = O(g), then g = O(f)',
          'Reflexivity: f = O(f)',
          'Additivity: If f1 = O(g1) and f2 = O(g2), then f1 + f2 = O(max(g1, g2))'
        ],
        correctAnswer: [0, 2, 3],
        explanation: 'Transitivity, reflexivity, and additivity are core properties of Big-O. Symmetry fails because Big-O is an upper bound (e.g. n = O(n^2), but n^2 != O(n)).',
        commonTrap: 'Thinking asymptotic notations behave like arithmetic equality.'
      },
      {
        id: 'q-asym-6',
        topicId: 'asymptotic-notations',
        title: 'Big-Omega Verification',
        type: 'dry-run',
        difficulty: 'Easy',
        question: 'To prove that 5n^3 + 2n = Ω(n^3), which choice of constants (c, n0) is valid?',
        options: [
          'c = 5, n0 = 1',
          'c = 10, n0 = 1',
          'c = 0.1, n0 = 1000 (only)',
          'No constants exist'
        ],
        correctAnswer: 0,
        explanation: 'For all n >= 1, 5n^3 + 2n >= 5n^3. Thus c = 5 and n0 = 1 directly satisfies f(n) >= c * g(n).'
      }
    ],
    relatedTopicIds: ['intro-algorithms', 'master-theorem', 'adversary-lower-bounds'],
    applications: ['Algorithm selection', 'Complexity theory classification', 'Benchmarking theoretical limits'],
    advantages: ['Suppresses machine noise', 'Standardized universal communication'],
    limitations: ['Does not capture memory hierarchy cache misses', 'Asymptotic behavior only guaranteed as n -> infinity']
  },
  {
    id: 'binary-search',
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Binary Search & Order Searching',
    slug: 'binary-search',
    category: 'Searching',
    shortDesc: 'Logarithmic search on monotonic sorted collections via divide-and-conquer domain reduction.',
    prerequisites: ['intro-algorithms', 'asymptotic-notations'],
    importance: 'Essential',
    simpleExplanation: 'When searching a sorted phonebook or list, instead of checking every page one-by-one from the start, you open directly to the middle. If the target is smaller, you eliminate the entire right half; if larger, you eliminate the left half. You repeat this until found or exhausted.',
    formalDefinition: 'Binary search is an optimal comparison search algorithm on a sorted sequence A[0..n-1]. In each iteration, it compares the target with the median element A[mid]. It reduces the search space by half, establishing a recurrence T(n) = T(n/2) + O(1), yielding O(log n) worst-case time.',
    intuition: 'Each comparison throws away 50% of the remaining candidates. Starting with 1,000,000 items, after 20 comparisons only 1 item remains because 2^20 > 1,000,000.',
    coreIdeaSteps: [
      'Initialize pointers: left = 0, right = n - 1.',
      'While left <= right:',
      '  Compute mid = left + (right - left) / 2 to avoid 32-bit integer overflow.',
      '  If A[mid] == target, return mid.',
      '  If A[mid] < target, target must be in right half: set left = mid + 1.',
      '  If A[mid] > target, target must be in left half: set right = mid - 1.',
      'If loop finishes without return, target is not present: return -1.'
    ],
    complexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
      auxiliarySpace: 'O(1) iterative / O(log n) recursive',
      inputSpace: 'O(n) sorted array',
      explanation: {
        best: 'Target found at the very first midpoint calculated.',
        average: 'Average comparisons = sum_{i=1}^{log n} i * 2^(i-1) / n ≈ log2 n - 1 = O(log n).',
        worst: 'Target at endpoints or not present; requires floor(log2 n) + 1 comparisons.',
        space: 'Iterative version uses 3 integer pointers (left, right, mid) -> O(1) space.'
      }
    },
    proof: {
      type: 'Loop Invariant',
      title: 'Correctness of Iterative Binary Search',
      preconditions: 'Array A[0..n-1] is sorted in non-decreasing order: A[0] <= A[1] <= ... <= A[n-1].',
      steps: [
        {
          phase: 'Initialization',
          description: 'Before the first iteration, left = 0 and right = n - 1. If target is in A, it must reside within A[left..right] since this spans the entire array.'
        },
        {
          phase: 'Maintenance',
          description: 'Assume target is in A[left..right]. If A[mid] == target, we return mid (correct). If A[mid] < target, then because A is sorted, all elements A[left..mid] are <= A[mid] < target, so target cannot be in A[left..mid]. Thus target must be in A[mid+1..right]. Setting left = mid + 1 preserves the invariant. Symmetrically, if A[mid] > target, target cannot be in A[mid..right], so setting right = mid - 1 preserves the invariant.'
        },
        {
          phase: 'Termination',
          description: 'The search interval (right - left + 1) strictly decreases in each iteration. The loop terminates either when A[mid] == target, or when left > right (empty search space), proving target does not exist in A.'
        }
      ],
      conclusion: 'Binary search terminates in at most floor(log2 n) + 1 iterations and returns a correct index if and only if target exists in A.'
    },
    code: {
      cpp: `// Production Binary Search in C++
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    
    while (left <= right) {
        // Prevents (left + right) integer overflow bug
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    return -1; // Target not found
}`,
      java: `// Production Binary Search in Java
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            // Unsigned shift avoids 32-bit overflow
            int mid = left + ((right - left) >>> 1);
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}`,
      python: `# Production Binary Search in Python
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`
    },
    visualizerType: 'searching',
    defaultInput: {
      array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      target: 23
    },
    dryRunExample: {
      input: 'arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23',
      output: 'Index 5',
      steps: [
        { iteration: 1, state: 'left=0, right=9, mid=4 (val=16)', explanation: '16 < 23 -> Target in right half. Set left = 5.' },
        { iteration: 2, state: 'left=5, right=9, mid=7 (val=56)', explanation: '56 > 23 -> Target in left half. Set right = 6.' },
        { iteration: 3, state: 'left=5, right=6, mid=5 (val=23)', explanation: '23 == 23 -> Match found at index 5! Return 5.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Recurrence: T(n) = T(n/2) + O(1) => T(n) = O(log n)',
        'Maximum comparisons = floor(log2 n) + 1',
        'Mid calculation: mid = left + (right - left) / 2'
      ],
      commonTraps: [
        'Writing mid = (left + right) / 2 causes integer overflow when left + right > 2^31 - 1.',
        'Using condition left < right instead of left <= right fails to check the single remaining element.'
      ],
      vivaQuestions: [
        { q: 'Why did Java\'s Arrays.binarySearch have a bug for over 9 years?', a: 'Joshua Bloch discovered that `(low + high) / 2` overflows positive 32-bit signed integers when low + high exceeds 2^31 - 1, producing a negative index and an ArrayIndexOutOfBoundsException.' },
        { q: 'Can Binary Search be applied to a linked list in O(log n)?', a: 'No. Finding the middle element in a singly or doubly linked list requires O(n) sequential pointer traversals, so time remains O(n).' }
      ]
    },
    questions: [
      {
        id: 'q-bs-1',
        topicId: 'binary-search',
        title: 'Worst-case Comparison Count',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'For a sorted array of 128 elements, what is the maximum number of comparisons needed to conclude an element is NOT present?',
        options: ['6', '7', '8', '128'],
        correctAnswer: 2,
        explanation: 'Worst case comparisons = floor(log2(128)) + 1 = 7 + 1 = 8 comparisons. (Specifically: 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1 -> 0).',
        complexityNote: 'log2(128) = 7, plus 1 comparison when the interval size is 1.'
      },
      {
        id: 'q-bs-2',
        topicId: 'binary-search',
        title: 'Integer Overflow Bug',
        type: 'debugging',
        difficulty: 'Medium',
        question: 'Which line contains a critical bug for large arrays in classic binary search?\n1: int left = 0, right = n - 1;\n2: while (left <= right) {\n3:     int mid = (left + right) / 2;\n4:     if (arr[mid] == target) return mid;\n...',
        options: [
          'Line 1: right should be n',
          'Line 2: condition must be left < right',
          'Line 3: (left + right) can overflow 32-bit signed integer',
          'Line 4: mid index is miscalculated'
        ],
        correctAnswer: 2,
        explanation: 'If left + right exceeds 2,147,483,647 (INT_MAX), it wraps into negative values, resulting in arr[negative] and memory segmentation fault. Fix: left + (right - left) / 2.',
        whyWrong: {
          '0': '0 to n-1 is standard 0-indexed inclusive bounds.',
          '1': 'left <= right is required to test the 1-element interval.',
          '3': 'The comparison itself is correct; only the sum computation in Line 3 overflows.'
        }
      },
      {
        id: 'q-bs-3',
        topicId: 'binary-search',
        title: 'Binary Search on Rotated Sorted Array',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'Can binary search be adapted to search for an element in a sorted array that has been cyclically rotated by k positions (e.g. [4, 5, 6, 7, 0, 1, 2]) in O(log n) time?',
        options: [
          'No, rotation destroys monotonic order so O(n) is required',
          'Yes, by observing that at least one half (left..mid or mid..right) is always strictly sorted',
          'Only if the rotation offset k is known in advance',
          'Only if all elements are positive'
        ],
        correctAnswer: 1,
        explanation: 'At any midpoint, either arr[left..mid] or arr[mid..right] must be normally sorted. We check if target lies within the sorted half; if so, narrow to it, else search the other half. Runtime remains O(log n).',
        commonTrap: 'Assuming partial rotation necessitates full linear scanning.'
      },
      {
        id: 'q-bs-4',
        topicId: 'binary-search',
        title: 'Recursive vs Iterative Space',
        type: 'complexity',
        difficulty: 'Easy',
        question: 'What is the auxiliary space complexity of iterative binary search versus recursive binary search without tail-call optimization?',
        options: [
          'Iterative: O(1), Recursive: O(log n)',
          'Iterative: O(log n), Recursive: O(1)',
          'Both are O(1)',
          'Both are O(log n)'
        ],
        correctAnswer: 0,
        explanation: 'Iterative binary search updates three scalar pointers in place, requiring O(1) auxiliary space. Recursive binary search creates a stack frame per level of recursion (depth = log2 n), requiring O(log n) stack memory.',
        complexityNote: 'Iterative implementation is strictly preferred in embedded systems for memory safety.'
      },
      {
        id: 'q-bs-5',
        topicId: 'binary-search',
        title: 'First Occurrence Modification',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'To modify binary search to return the FIRST occurrence of a target in an array containing duplicates, what should be done when arr[mid] == target?',
        options: [
          'Return mid immediately',
          'Set left = mid + 1 to check right',
          'Record mid as candidate answer, and set right = mid - 1 to continue searching left',
          'Scan linearly from index 0'
        ],
        correctAnswer: 2,
        explanation: 'When arr[mid] == target, earlier occurrences could still exist to the left. Saving ans = mid and continuing the search in the left half (right = mid - 1) guarantees finding the first occurrence in O(log n).',
        commonTrap: 'Scanning linearly backward from mid degrades worst-case time to O(n) when all elements are duplicates.'
      },
      {
        id: 'q-bs-6',
        topicId: 'binary-search',
        title: 'Applicability Criterion',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: Binary search can only be applied to sorted numeric arrays, never to monotonic abstract mathematical functions f(x).',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. "Binary Search on Answer" is a fundamental paradigm applied to any monotonic predicate P(x): if P(x) is true for all x >= x0 and false for all x < x0, binary search finds the optimal boundary x0 in O(log(range)).',
        commonTrap: 'Thinking binary search is strictly an array container utility.'
      }
    ],
    relatedTopicIds: ['merge-sort', 'quick-sort', 'order-statistics'],
    applications: ['Database B+ Tree leaf searches', 'Git bisect regression debugging', 'Square root and optimization search on real numbers'],
    advantages: ['Blazing fast O(log n) throughput', 'Extremely minimal O(1) memory footprint'],
    limitations: ['Requires random access memory O(1); inefficient on linked lists', 'Requires collection to be maintained in pre-sorted order']
  },
  {
    id: 'graph-traversal-bfs-dfs',
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Graph Traversal: BFS, DFS & Applications',
    slug: 'graph-traversal-bfs-dfs',
    category: 'Graph Traversal',
    shortDesc: 'Systematic vertex exploration via Breadth-First Search (Queue) and Depth-First Search (Stack/Recursion).',
    prerequisites: ['intro-algorithms', 'Queues and Stacks'],
    importance: 'Essential',
    simpleExplanation: 'BFS explores a network like ripples spreading in a pond: first all immediate 1-hop neighbors, then 2-hop neighbors, and so on. DFS explores like navigating a maze: walk forward as deep as possible down one path, and when hitting a dead end, backtrack and try the next branch.',
    formalDefinition: 'Let G = (V, E) be a graph. \n- BFS systematically explores edges of G to "discover" every vertex reachable from source s, computing shortest path distances in unweighted graphs in O(|V| + |E|) time using a FIFO queue.\n- DFS explores as deeply as possible along each branch before backtracking, computing discovery and finishing timestamps in O(|V| + |E|) time using a LIFO call stack.',
    intuition: 'BFS is guaranteed to find the shortest hop path in unweighted graphs because it expands concentric level frontiers. DFS is ideal for topological structure, cycle detection, and connectivity.',
    coreIdeaSteps: [
      'Represent graph via Adjacency List: Adj[u] contains neighbors of u.',
      'Maintain boolean visited[|V|] initialized to all false.',
      'BFS: Enqueue source vertex s, set dist[s] = 0. While queue not empty: dequeue u, for each neighbor v in Adj[u]: if not visited[v], visited[v]=true, dist[v]=dist[u]+1, enqueue(v).',
      'DFS: Start at u, mark visited[u] = true. For each neighbor v in Adj[u]: if not visited[v], recursively invoke DFS(v).',
      'Record discovery and finishing times (DFS) or predecessor tree (BFS/DFS).'
    ],
    complexity: {
      best: 'O(1) [Source has target neighbor]',
      average: 'O(|V| + |E|)',
      worst: 'O(|V| + |E|)',
      auxiliarySpace: 'O(|V|)',
      inputSpace: 'O(|V| + |E|)',
      explanation: {
        best: 'Target is the immediate first neighbor examined.',
        average: 'Every reachable vertex is enqueued/visited once, and every incident edge is examined once (directed) or twice (undirected).',
        worst: 'Graph is fully connected or a single chain; all |V| vertices and |E| edges must be traversed.',
        space: 'BFS queue stores at most O(|V|) vertices; DFS recursion stack depth is at most |V|.'
      }
    },
    code: {
      cpp: `// Graph Traversals in C++
#include <iostream>
#include <vector>
#include <queue>

void bfs(int start, const std::vector<std::vector<int>>& adj, std::vector<int>& dist) {
    int n = adj.size();
    std::vector<bool> visited(n, false);
    std::queue<int> q;
    
    visited[start] = true;
    dist[start] = 0;
    q.push(start);
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
}

void dfs(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}`,
      java: `// Graph Traversals in Java
import java.util.*;

public class GraphTraversals {
    public static void bfs(int start, List<List<Integer>> adj, int[] dist) {
        boolean[] visited = new boolean[adj.size()];
        Queue<Integer> q = new LinkedList<>();
        
        visited[start] = true;
        dist[start] = 0;
        q.add(start);
        
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    dist[v] = dist[u] + 1;
                    q.add(v);
                }
            }
        }
    }

    public static void dfs(int u, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                dfs(v, adj, visited);
            }
        }
    }
}`,
      python: `# Graph Traversals in Python
from collections import deque

def bfs(start: int, adj: list[list[int]]) -> list[int]:
    n = len(adj)
    dist = [-1] * n
    q = deque([start])
    dist[start] = 0
    
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

def dfs(u: int, adj: list[list[int]], visited: list[bool]) -> None:
    visited[u] = True
    for v in adj[u]:
        if not visited[v]:
            dfs(v, adj, visited)`
    },
    visualizerType: 'graph',
    dryRunExample: {
      input: 'Vertices: {0, 1, 2, 3, 4}, Edges: (0-1), (0-2), (1-3), (2-4), Start = 0',
      output: 'BFS Distances: [0:0, 1:1, 2:1, 3:2, 4:2]',
      steps: [
        { iteration: 1, state: 'Queue: [0], Visited: {0}', explanation: 'Initialize source vertex 0 with distance 0.' },
        { iteration: 2, state: 'Dequeue 0. Enqueue neighbors 1, 2. Queue: [1, 2]', explanation: 'Distance to 1 and 2 set to 0 + 1 = 1.' },
        { iteration: 3, state: 'Dequeue 1. Enqueue neighbor 3. Queue: [2, 3]', explanation: 'Distance to 3 set to 1 + 1 = 2.' },
        { iteration: 4, state: 'Dequeue 2. Enqueue neighbor 4. Queue: [3, 4]', explanation: 'Distance to 4 set to 1 + 1 = 2.' },
        { iteration: 5, state: 'Dequeue 3 & 4. No unvisited neighbors.', explanation: 'Queue empty. Level-by-level BFS complete.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Adjacency List Time = O(|V| + |E|)',
        'Adjacency Matrix Time = O(|V|^2)',
        'Unweighted Shortest Path = BFS distance array'
      ],
      commonTraps: [
        'Using an Adjacency Matrix causes BFS/DFS to become O(|V|^2) because checking neighbors requires scanning a whole row.',
        'Marking a node visited when DEQUEUED instead of when ENQUEUED in BFS causes vertices to be inserted into the queue multiple times, blowing up memory.'
      ],
      vivaQuestions: [
        { q: 'Why does BFS guarantee the shortest path in unweighted graphs while DFS does not?', a: 'BFS explores vertices in strictly increasing order of their distance from the source (distance k before distance k+1). DFS charges down one deep branch regardless of path length, potentially finding an arbitrarily long path first.' },
        { q: 'When should we mark a vertex as visited in BFS?', a: 'Immediately when pushing it into the Queue. If delayed until pop, the same neighbor will be enqueued repeatedly by different predecessors.' }
      ]
    },
    questions: [
      {
        id: 'q-graph-1',
        topicId: 'graph-traversal-bfs-dfs',
        title: 'BFS Shortest Path Guarantee',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Under which condition does BFS guarantee the shortest path between any two vertices?',
        options: [
          'All edge weights are positive arbitrary real numbers',
          'All edge weights are strictly equal (or graph is unweighted)',
          'The graph has no directed cycles',
          'The graph is represented by an adjacency matrix'
        ],
        correctAnswer: 1,
        explanation: 'BFS explores in monotonically non-decreasing order of edge count. When all edge weights are uniform (e.g. weight = 1), minimum edge count equals minimum total path weight.',
        whyWrong: {
          '0': 'Arbitrary positive weights require Dijkstra\'s Priority Queue algorithm.',
          '2': 'A DAG with unequal weights still fails BFS shortest path.',
          '3': 'Storage format (matrix vs list) affects runtime, not correctness.'
        }
      },
      {
        id: 'q-graph-2',
        topicId: 'graph-traversal-bfs-dfs',
        title: 'Adjacency List vs Matrix Complexity',
        type: 'complexity',
        difficulty: 'Medium',
        question: 'What is the time complexity of BFS on a sparse graph where |E| = O(|V|) when using an Adjacency Matrix representation?',
        options: ['O(|V|)', 'O(|V| + |E|)', 'O(|V|^2)', 'O(|E| log |V|)'],
        correctAnswer: 2,
        explanation: 'With an adjacency matrix, finding the neighbors of any vertex requires checking all |V| columns in that row. For |V| vertices, total time is |V| * |V| = O(|V|^2), regardless of whether |E| is small.',
        commonTrap: 'Assuming BFS is always O(|V| + |E|) regardless of underlying data structure.'
      },
      {
        id: 'q-graph-3',
        topicId: 'graph-traversal-bfs-dfs',
        title: 'Cycle Detection in Directed Graphs',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'In Depth-First Search on a directed graph, a cycle exists if and only if DFS encounters which type of edge?',
        options: ['Tree Edge', 'Forward Edge', 'Back Edge', 'Cross Edge'],
        correctAnswer: 2,
        explanation: 'A back edge connects a vertex to an ancestor in the current DFS recursion stack (gray vertex). An ancestor being reachable from a descendant closes a directed cycle.',
        whyWrong: {
          '0': 'Tree edges form the DFS spanning forest without cycles.',
          '1': 'Forward edges connect to a descendant already visited, not an ancestor.',
          '3': 'Cross edges connect across different branches with no ancestor relationship.'
        }
      },
      {
        id: 'q-graph-4',
        topicId: 'graph-traversal-bfs-dfs',
        title: 'DFS Tree Edge Classification',
        type: 'multiple-select',
        difficulty: 'Medium',
        question: 'Which of the following edge types can appear in a DFS traversal of an UNDIRECTED graph?',
        options: ['Tree Edges', 'Back Edges', 'Forward Edges', 'Cross Edges'],
        correctAnswer: [0, 1],
        explanation: 'In an undirected graph, every edge is either a Tree Edge (traversed to discover an unvisited node) or a Back Edge (connecting to an already visited ancestor). Forward and Cross edges cannot exist in undirected DFS.',
        commonTrap: 'Assuming undirected and directed DFS produce the same 4 edge classifications.'
      },
      {
        id: 'q-graph-5',
        topicId: 'graph-traversal-bfs-dfs',
        title: 'Bipartite Graph Checking',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'How can BFS be used to determine if a graph is 2-colorable (bipartite)?',
        options: [
          'Color the source RED; during BFS, assign every neighbor the opposite color of the current vertex. If an edge connects two vertices of the same color, the graph is not bipartite.',
          'Count the number of vertices; if even, it is always bipartite.',
          'Run BFS from every node; if number of components is 2, it is bipartite.',
          'Check if degree of every vertex is even.'
        ],
        correctAnswer: 0,
        explanation: 'A graph is bipartite if and only if it contains no odd-length cycles. 2-coloring vertices level-by-level via BFS detects any cross-edge within the same level, proving an odd cycle exists.'
      },
      {
        id: 'q-graph-6',
        topicId: 'graph-traversal-bfs-dfs',
        title: 'Stack vs Queue Duality',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: Replacing the FIFO Queue with a LIFO Stack in an iterative traversal algorithm transforms BFS into DFS.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. The only structural difference between iterative BFS and iterative DFS is the ordering discipline: a Queue processes breadth-first (FIFO), whereas a Stack processes depth-first (LIFO).',
        complexityNote: 'Both have O(|V| + |E|) time and O(|V|) space complexity.'
      }
    ],
    relatedTopicIds: ['topological-sort', 'dijkstra', 'shortest-paths-dag'],
    applications: ['Web crawler page indexing', 'Social network degrees of separation', 'Garbage collection reachable object marking'],
    advantages: ['Linear time O(|V| + |E|)', 'Simple, robust state machine'],
    limitations: ['Does not handle non-uniform edge weights for shortest paths', 'Recursive DFS can exceed maximum stack call limits on deep chains']
  },
  {
    id: 'topological-sort',
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Topological Sorting & DAGs',
    slug: 'topological-sort',
    category: 'Graph Traversal',
    shortDesc: 'Linear ordering of vertices in Directed Acyclic Graphs such that every directed edge u -> v has u appearing before v.',
    prerequisites: ['graph-traversal-bfs-dfs'],
    importance: 'Essential',
    simpleExplanation: 'Imagine course prerequisites at university: you cannot take Advanced Algorithms before Discrete Math. A topological sort produces a valid timetable order where every prerequisite is completed before the courses that depend on it.',
    formalDefinition: 'A topological sort of a directed graph G = (V, E) is a linear ordering of all its vertices such that if G contains an edge (u, v), then u appears before v in the ordering. A topological sort exists if and only if G is a Directed Acyclic Graph (DAG).',
    intuition: 'If there were a directed cycle (A -> B -> C -> A), A must precede B, B must precede C, and C must precede A, which is impossible in a linear sequence.',
    coreIdeaSteps: [
      'Kahn\'s Algorithm (BFS-based):',
      'Compute in-degree for every vertex v: inDegree[v] = number of incoming edges.',
      'Initialize a queue Q with all vertices having inDegree == 0 (no prerequisites).',
      'While Q is not empty:',
      '  Dequeue vertex u and append to topological order.',
      '  For each neighbor v of u: decrement inDegree[v] by 1.',
      '  If inDegree[v] becomes 0, enqueue v.',
      'If ordered list contains fewer than |V| vertices, the graph contains at least one cycle!'
    ],
    complexity: {
      best: 'O(|V| + |E|)',
      average: 'O(|V| + |E|)',
      worst: 'O(|V| + |E|)',
      auxiliarySpace: 'O(|V|)',
      inputSpace: 'O(|V| + |E|)',
      explanation: {
        best: 'Linear scanning of in-degrees and neighbor decrement.',
        average: 'Each vertex is enqueued/dequeued once; each directed edge is removed once.',
        worst: 'DAG processed completely in O(|V| + |E|) steps.',
        space: 'In-degree array O(|V|) + Queue O(|V|).'
      }
    },
    code: {
      cpp: `// Kahn's Algorithm (Topological Sort)
#include <vector>
#include <queue>

std::vector<int> topologicalSort(int numCourses, const std::vector<std::vector<int>>& adj) {
    std::vector<int> inDegree(numCourses, 0);
    for (int u = 0; u < numCourses; ++u) {
        for (int v : adj[u]) {
            inDegree[v]++;
        }
    }
    
    std::queue<int> q;
    for (int i = 0; i < numCourses; ++i) {
        if (inDegree[i] == 0) q.push(i);
    }
    
    std::vector<int> topoOrder;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        topoOrder.push_back(u);
        
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) {
                q.push(v);
            }
        }
    }
    
    // Cycle detected if topoOrder.size() != numCourses
    if (topoOrder.size() != static_cast<size_t>(numCourses)) return {};
    return topoOrder;
}`,
      java: `// Kahn's Algorithm in Java
import java.util.*;

public class TopoSort {
    public static List<Integer> sort(int n, List<List<Integer>> adj) {
        int[] inDegree = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) inDegree[v]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) q.add(i);
        }
        
        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (--inDegree[v] == 0) q.add(v);
            }
        }
        return order.size() == n ? order : new ArrayList<>();
    }
}`,
      python: `# Kahn's Algorithm in Python
from collections import deque

def topological_sort(n: int, adj: list[list[int]]) -> list[int]:
    in_degree = [0] * n
    for u in range(n):
        for v in adj[u]:
            in_degree[v] += 1
            
    q = deque([i for i in range(n) if in_degree[i] == 0])
    topo_order = []
    
    while q:
        u = q.popleft()
        topo_order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
                
    return topo_order if len(topo_order) == n else []`
    },
    visualizerType: 'graph',
    dryRunExample: {
      input: 'DAG with edges: 5->2, 5->0, 4->0, 4->1, 2->3, 3->1',
      output: 'Topological Order: [4, 5, 2, 0, 3, 1]',
      steps: [
        { iteration: 1, state: 'In-degrees: {0:2, 1:2, 2:1, 3:1, 4:0, 5:0}', explanation: 'Nodes 4 and 5 have 0 in-degree. Enqueue 4, 5.' },
        { iteration: 2, state: 'Pop 4. Neighbors 0, 1 -> In-degrees: {0:1, 1:1}', explanation: 'Append 4 to order.' },
        { iteration: 3, state: 'Pop 5. Neighbors 0, 2 -> in-degree[2] becomes 0! Enqueue 2.', explanation: 'Append 5 to order.' },
        { iteration: 4, state: 'Pop 2. Neighbor 3 -> in-degree[3] becomes 0! Enqueue 3.', explanation: 'Append 2 to order.' },
        { iteration: 5, state: 'Pop 3. Neighbor 1 -> in-degree[1] becomes 0! Enqueue 1.', explanation: 'Append 3 to order.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Topological sort is possible <=> Graph is a DAG (Directed Acyclic Graph)',
        'DFS reverse finishing times yields a valid topological sort',
        'If Kahn\'s output length < |V|, graph has a cycle'
      ],
      commonTraps: [
        'Attempting topological sort on undirected graphs (undirected edges count as 2-cycles).',
        'Assuming a graph has a UNIQUE topological order. A DAG can have multiple valid topological orderings.'
      ],
      vivaQuestions: [
        { q: 'Why does topological sort only work on DAGs?', a: 'If a directed graph has a cycle v1 -> v2 -> ... -> vk -> v1, then v1 must appear before vk, but vk must appear before v1, which is a mathematical contradiction in any linear ordering.' },
        { q: 'How does DFS compute topological sort?', a: 'By prepending each vertex to a linked list upon its FINISHING time (when all its descendants have been fully explored). Since any edge (u, v) finishes v before u, u ends up before v in the reversed finish list.' }
      ]
    },
    questions: [
      {
        id: 'q-topo-1',
        topicId: 'topological-sort',
        title: 'Existence Condition',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Under what condition does a directed graph have at least one valid topological ordering?',
        options: [
          'It is strongly connected',
          'It has no directed cycles (is a DAG)',
          'It is a complete directed tournament',
          'It has an equal number of vertices and edges'
        ],
        correctAnswer: 1,
        explanation: 'A topological sort requires no circular dependency. By definition, a directed graph has a topological sort if and only if it is acyclic (a DAG).',
        whyWrong: {
          '0': 'Strongly connected means every node can reach every other node, which implies cycles!',
          '2': 'Tournaments may have cycles unless transitive.',
          '3': 'Vertex and edge counts do not dictate acyclicity.'
        }
      },
      {
        id: 'q-topo-2',
        topicId: 'topological-sort',
        title: 'Uniqueness of Topological Order',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: A DAG has a UNIQUE topological sort if and only if there is a directed Hamiltonian path connecting all vertices.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. If and only if a directed Hamiltonian path exists, every pair of consecutive vertices in the topological sort has an edge between them, leaving zero choices/ties at any step in Kahn\'s queue.',
        complexityNote: 'If the queue ever contains > 1 vertex, multiple topological sorts exist.'
      },
      {
        id: 'q-topo-3',
        topicId: 'topological-sort',
        title: 'Kahn\'s Algorithm Cycle Detection',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'Given a directed graph with 6 vertices, Kahn\'s algorithm finishes with 4 vertices in the output array. What can be concluded?',
        options: [
          'The graph has exactly 2 connected components',
          'The graph contains at least one directed cycle involving the remaining 2 vertices',
          'The algorithm encountered a runtime error',
          'The graph is bipartite'
        ],
        correctAnswer: 1,
        explanation: 'Vertices belonging to or reachable only through a cycle can never reach in-degree 0. Since only 4 of 6 vertices reached in-degree 0, the remaining 2 are trapped in a cycle.',
        commonTrap: 'Thinking Kahn\'s algorithm crashes on cyclic graphs instead of returning partial output.'
      },
      {
        id: 'q-topo-4',
        topicId: 'topological-sort',
        title: 'DFS-based Topological Ordering',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'In DFS-based topological sort, in what order should vertices be listed to form the valid topological sequence?',
        options: [
          'Increasing order of discovery times',
          'Decreasing order of discovery times',
          'Increasing order of finishing times',
          'Decreasing order of finishing times (reverse finish order)'
        ],
        correctAnswer: 3,
        explanation: 'For any directed edge (u, v), vertex v must finish before u (either v is a descendant of u or was explored earlier). Thus, sorting by decreasing finishing time ensures u appears before v.',
        whyWrong: {
          '0': 'Discovery time does not reflect when the entire subtree has concluded.',
          '2': 'Increasing finishing time gives the reverse topological order.'
        }
      },
      {
        id: 'q-topo-5',
        topicId: 'topological-sort',
        title: 'Compilation Dependencies',
        type: 'multiple-select',
        difficulty: 'Easy',
        question: 'Which real-world engineering problems are solved directly using Topological Sort?',
        options: [
          'Build system compilation order (Make, CMake, Gradle)',
          'Task scheduling with precedence constraints',
          'Finding the minimum spanning tree in a road network',
          'Resolving package manager dependencies (npm, pip)'
        ],
        correctAnswer: [0, 1, 3],
        explanation: 'Build systems, task schedulers, and package managers resolve dependency DAGs using topological sorting. MST on road networks is an undirected optimization problem solved by Prim/Kruskal.'
      },
      {
        id: 'q-topo-6',
        topicId: 'topological-sort',
        title: 'Time Complexity of Kahn\'s Algorithm',
        type: 'complexity',
        difficulty: 'Easy',
        question: 'What is the optimal time complexity of Kahn\'s algorithm for a graph with V vertices and E edges using an Adjacency List?',
        options: ['O(V log V)', 'O(V + E)', 'O(V * E)', 'O(V^2)'],
        correctAnswer: 1,
        explanation: 'Calculating initial in-degrees takes O(V + E). Each vertex enters and leaves the queue once (O(V)), and each edge is traversed once to decrement in-degrees (O(E)). Total time: O(V + E).'
      }
    ],
    relatedTopicIds: ['graph-traversal-bfs-dfs', 'shortest-paths-dag'],
    applications: ['Package managers (npm, apt, pip) resolution', 'Build orchestration (Makefile, Bazel)', 'Spreadsheet formula cell evaluation order'],
    advantages: ['Linear O(V + E) performance', 'Simultaneously performs cycle detection'],
    limitations: ['Only applicable to Directed Acyclic Graphs']
  },
  {
    id: 'adversary-lower-bounds',
    unitId: 'unit-1',
    unitNumber: 1,
    title: 'Adversary Lower Bounds & Sorting Limits',
    slug: 'adversary-lower-bounds',
    category: 'Correctness & Lower Bounds',
    shortDesc: 'Information-theoretic proofs establishing Ω(n log n) comparisons for all comparison-based sorting algorithms.',
    prerequisites: ['asymptotic-notations', 'Decision Trees'],
    importance: 'Foundational',
    simpleExplanation: 'Imagine an opponent who answers your questions maliciously to force you to ask as many questions as possible. Each "is A < B?" question can at best cut the remaining permutations in half. To distinguish among all n! possible arrangements, any algorithm must take at least log2(n!) ≈ n log2 n questions in the worst case.',
    formalDefinition: 'In the comparison tree model, any sorting algorithm corresponds to a binary decision tree where each internal node represents a comparison A[i] <= A[j], and each leaf represents a unique permutation of the input. Since there are n! distinct permutations, the tree must have at least n! leaves. A binary tree of height h has at most 2^h leaves. Therefore, 2^h >= n!, which implies h >= log2(n!) = Ω(n log n).',
    intuition: 'Sorting is equivalent to finding 1 needle out of n! possible needles. A binary question provides at most 1 bit of information. Information theory dictates you need log2(n!) bits of information.',
    coreIdeaSteps: [
      'Model any comparison-based algorithm as a Decision Tree.',
      'A valid sorting algorithm must correctly identify any of the n! possible permutations: Number of leaves L >= n!.',
      'A binary tree of height h can have at most 2^h leaves: 2^h >= L >= n!.',
      'Take binary logarithms on both sides: h >= log2(n!).',
      'Apply Stirling\'s Approximation: n! >= (n/e)^n => log2(n!) >= n log2(n) - n log2(e) = Ω(n log n).',
      'Conclusion: No comparison sort can ever achieve a worst-case time faster than Ω(n log n).'
    ],
    complexity: {
      best: 'Ω(n)',
      average: 'Ω(n log n)',
      worst: 'Ω(n log n)',
      auxiliarySpace: 'O(1)',
      explanation: {
        best: 'Verifying an already sorted array requires n-1 comparisons (Ω(n)).',
        average: 'Average path length in a decision tree with n! leaves is Ω(n log n).',
        worst: 'Tree height h is at least ceil(log2(n!)) = Ω(n log n).',
        space: 'Information-theoretic lower bound is an analytical limit.'
      }
    },
    proof: {
      type: 'Mathematical Induction',
      title: 'Comparison Sorting Lower Bound via Stirling\'s Formula',
      preconditions: 'Algorithm only accesses elements through pairwise comparisons (a <= b).',
      steps: [
        {
          phase: 'Decision Tree Modeling',
          description: 'Any execution traces a path from root to leaf in a binary decision tree. Each leaf corresponds to a distinct sorted permutation of the n inputs. Hence, the number of leaves L >= n!.'
        },
        {
          phase: 'Height Inequality',
          description: 'A binary tree of height h has at most 2^h leaves. Therefore: 2^h >= L >= n! => h >= log2(n!).'
        },
        {
          phase: 'Log-Factorial Expansion',
          description: 'log2(n!) = sum_{i=1}^n log2(i) >= sum_{i=n/2}^n log2(i) >= (n/2) * log2(n/2) = (n/2)(log2 n - 1) = (n/2) log2 n - n/2.'
        }
      ],
      conclusion: 'Since h >= (1/2) n log2 n - O(n), the worst-case number of comparisons is bounded below by Ω(n log n).'
    },
    code: {
      cpp: `// Decision Tree Lower Bound Demonstration
#include <iostream>
#include <cmath>

double lowerBoundComparisons(int n) {
    // Calculates ceil(log2(n!)) = sum_{i=1}^n log2(i)
    double comparisons = 0;
    for (int i = 1; i <= n; ++i) {
        comparisons += std::log2(i);
    }
    return std::ceil(comparisons);
}`,
      java: `// Decision Tree Lower Bound Demo
public class LowerBoundDemo {
    public static long minComparisons(int n) {
        double sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += Math.log(i) / Math.log(2);
        }
        return (long) Math.ceil(sum);
    }
}`,
      python: `# Decision Tree Lower Bound Demo
import math

def min_comparisons_lower_bound(n: int) -> int:
    """Calculates ceil(log2(n!))"""
    log_factorial = sum(math.log2(i) for i in range(1, n + 1))
    return math.ceil(log_factorial)`
    },
    visualizerType: 'adversary',
    dryRunExample: {
      input: 'n = 3 elements: [A, B, C]',
      output: 'n! = 6 leaves, Height h >= ceil(log2(6)) = 3 comparisons',
      steps: [
        { iteration: 1, state: 'Root: Compare A with B', explanation: 'Branch left if A < B, right if A > B.' },
        { iteration: 2, state: 'Level 1: Compare B with C or A with C', explanation: 'Leaves remaining on each branch <= 3.' },
        { iteration: 3, state: 'Level 2: Final comparison isolates 1 of the 6 permutations', explanation: 'All 6 permutations [ABC, ACB, BAC, BCA, CAB, CBA] require at least 3 comparisons in worst case.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Number of leaves L >= n!',
        'Height h >= ceil(log2(n!))',
        'Stirling: log2(n!) = n log2 n - 1.44n + O(log n) = Omega(n log n)'
      ],
      commonTraps: [
        'Assuming non-comparison sorts (Counting Sort, Radix Sort, Bucket Sort) violate this theorem. They do not; they exploit integer digit distributions, not pairwise comparisons.',
        'Thinking an algorithm can sort in O(n) average time using comparisons. Average-case comparison sorting is also Ω(n log n).'
      ],
      vivaQuestions: [
        { q: 'Why can Counting Sort or Radix Sort run in O(n) if the lower bound is Ω(n log n)?', a: 'The Ω(n log n) lower bound strictly applies to COMPARISON-BASED sorting where elements are black boxes compared via `<`. Counting Sort and Radix Sort do not compare elements; they use integer values directly as array memory indices.' },
        { q: 'What is an adversary argument in algorithm lower bounds?', a: 'An adversary acts as an oracle providing answers to algorithm queries dynamically, choosing the response that maximizes remaining ambiguity (leaves), forcing the algorithm to make the maximal possible number of queries.' }
      ]
    },
    questions: [
      {
        id: 'q-adv-1',
        topicId: 'adversary-lower-bounds',
        title: 'Decision Tree Leaves',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'For an array of 4 distinct elements, what is the minimum number of leaves required in any valid comparison-based sorting decision tree?',
        options: ['4', '16', '24', '64'],
        correctAnswer: 2,
        explanation: 'An array of 4 distinct elements can be in any of 4! = 4 * 3 * 2 * 1 = 24 permutations. The decision tree must have at least 24 leaves to uniquely identify every possible outcome.',
        complexityNote: 'Leaves L >= n!.'
      },
      {
        id: 'q-adv-2',
        topicId: 'adversary-lower-bounds',
        title: 'Minimum Height for n = 4',
        type: 'numerical',
        difficulty: 'Medium',
        question: 'Since a binary tree of height h has at most 2^h leaves, what is the minimum possible worst-case comparison count (height h) to sort 4 elements?',
        options: ['4', '5', '6', '8'],
        correctAnswer: 1,
        explanation: '2^h >= 24. Since 2^4 = 16 < 24 and 2^5 = 32 >= 24, height h must be at least 5. Hence, at least 5 comparisons are needed in the worst case.',
        whyWrong: {
          '0': '2^4 = 16 leaves, which cannot distinguish all 24 permutations.',
          '2': '6 is achievable, but the minimum height is 5.',
          '3': '8 is higher than the minimum theoretical bound.'
        }
      },
      {
        id: 'q-adv-3',
        topicId: 'adversary-lower-bounds',
        title: 'Applicability to Non-Comparison Sorts',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: The Ω(n log n) lower bound proves that Radix Sort CANNOT sort n 32-bit integers in O(n) time.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Radix sort does not use element-to-element comparisons; it indexes by bit patterns or digits. The Ω(n log n) bound applies strictly to comparison-based models.',
        commonTrap: 'Broadening the comparison sorting theorem to all computational sorting models.'
      },
      {
        id: 'q-adv-4',
        topicId: 'adversary-lower-bounds',
        title: 'Adversary Strategy for Finding Minimum',
        type: 'dry-run',
        difficulty: 'Hard',
        question: 'To find the minimum element among n items, how many comparisons does an adversary force any comparison algorithm to perform in the worst case?',
        options: ['n - 1', 'n / 2', 'log2 n', 'n log2 n'],
        correctAnswer: 0,
        explanation: 'Every element except the true minimum must lose at least one comparison to be eliminated as a candidate for minimum. Each comparison produces at most one loser. Therefore, at least n - 1 comparisons are required.',
        complexityNote: 'Finding min takes exactly n - 1 comparisons.'
      },
      {
        id: 'q-adv-5',
        topicId: 'adversary-lower-bounds',
        title: 'Average-case Comparison Bound',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'Does randomization allow a comparison-based sorting algorithm to achieve o(n log n) expected comparisons on arbitrary inputs?',
        options: [
          'Yes, randomized quicksort achieves O(n) expected comparisons',
          'No, the average depth of leaves in any binary tree with n! leaves is also Ω(n log n)',
          'Yes, by choosing pivots uniformly at random',
          'Only if elements are bounded integers'
        ],
        correctAnswer: 1,
        explanation: 'By Yao\'s Minimax Principle and information theory, the average external path length of any binary tree with n! leaves is at least log2(n!) - O(1) = Ω(n log n). Randomization cannot beat this information limit.',
        commonTrap: 'Thinking randomized quicksort has an expected time better than O(n log n).'
      },
      {
        id: 'q-adv-6',
        topicId: 'adversary-lower-bounds',
        title: 'Simultaneous Min and Max Bound',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Using pairwise comparison pairing, what is the exact lower bound on comparisons to find BOTH the minimum and maximum of an n-element array?',
        options: ['2n - 2', 'ceil(3n / 2) - 2', 'n log n', 'n'],
        correctAnswer: 1,
        explanation: 'By pairing elements first (n/2 comparisons), separating into candidate winners and candidate losers, finding max among winners takes n/2 - 1 comparisons, and min among losers takes n/2 - 1 comparisons. Total = 3n/2 - 2 comparisons.',
        commonTrap: 'Comparing each element independently to min and max costs 2n - 2 comparisons.'
      }
    ],
    relatedTopicIds: ['intro-algorithms', 'merge-sort', 'quick-sort'],
    applications: ['Theoretical optimality bounds', 'Information theory limits', 'Cryptographic key entropy requirements'],
    advantages: ['Proves an algorithm cannot be asymptotically improved', 'Deep mathematical certainty'],
    limitations: ['Only holds within the comparison model framework']
  }
];
