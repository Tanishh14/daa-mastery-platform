import type { AlgorithmTopic } from '../../types';

export const unit2Topics: AlgorithmTopic[] = [
  {
    id: 'master-theorem',
    unitId: 'unit-2',
    unitNumber: 2,
    title: 'Recurrence Relations & Master Theorem',
    slug: 'master-theorem',
    category: 'Recurrences',
    shortDesc: 'Analytical cookbook for solving divide-and-conquer recurrences T(n) = aT(n/b) + f(n).',
    prerequisites: ['asymptotic-notations', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'When an algorithm divides a problem of size n into "a" subproblems each of size n/b, with extra work f(n) to divide and combine, the Master Theorem compares the leaf work n^(log_b a) against the root work f(n) to immediately tell which dominates the total runtime.',
    formalDefinition: 'Let T(n) = a T(n/b) + f(n) with a >= 1, b > 1. Let c_crit = log_b(a).\n- Case 1: If f(n) = O(n^(c_crit - eps)) for some eps > 0, then T(n) = Theta(n^c_crit) [Leaves dominate].\n- Case 2: If f(n) = Theta(n^c_crit * log^k(n)) for k >= 0, then T(n) = Theta(n^c_crit * log^(k+1)(n)) [Balanced at all levels].\n- Case 3: If f(n) = Omega(n^(c_crit + eps)) for some eps > 0 AND regularity condition a*f(n/b) <= c*f(n) holds for c < 1, then T(n) = Theta(f(n)) [Root dominates].',
    intuition: 'A recursion tree has depth log_b(n). Number of subproblem leaves is a^(log_b n) = n^(log_b a). The Master Theorem determines if work accumulates mostly at the leaves, is evenly split across all levels, or is dominated by the top root.',
    coreIdeaSteps: [
      'Extract parameters a, b, and f(n) from recurrence T(n) = aT(n/b) + f(n).',
      'Compute the watershed critical exponent c_crit = log_b(a).',
      'Compare the asymptotic growth of f(n) against n^(c_crit).',
      'Check polynomial gap: f(n) must be polynomially smaller (Case 1) or polynomially larger (Case 3), not merely logarithmically different unless matching Case 2.',
      'Check regularity condition for Case 3: a * f(n/b) <= c * f(n) for some c < 1.'
    ],
    complexity: {
      best: 'Analytical Formula',
      average: 'Analytical Formula',
      worst: 'Analytical Formula',
      auxiliarySpace: 'O(1)',
      explanation: {
        best: 'Closed-form evaluation in constant algebraic steps.',
        average: 'Direct algebraic resolution.',
        worst: 'Constant time substitution.',
        space: 'Analytical pencil-and-paper method.'
      }
    },
    code: {
      cpp: `// Programmatic Master Theorem Analyzer
#include <iostream>
#include <cmath>
#include <string>

struct RecurrenceResult {
    double log_b_a;
    int theoremCase;
    std::string asymptoticBound;
};

RecurrenceResult solveMasterTheorem(double a, double b, double f_exponent) {
    double log_val = std::log2(a) / std::log2(b);
    RecurrenceResult res;
    res.log_b_a = log_val;
    
    const double EPS = 1e-6;
    if (f_exponent < log_val - EPS) {
        res.theoremCase = 1;
        res.asymptoticBound = "Theta(n^" + std::to_string(log_val) + ")";
    } else if (std::abs(f_exponent - log_val) < EPS) {
        res.theoremCase = 2;
        res.asymptoticBound = "Theta(n^" + std::to_string(log_val) + " * log n)";
    } else {
        res.theoremCase = 3;
        res.asymptoticBound = "Theta(n^" + std::to_string(f_exponent) + ")";
    }
    return res;
}`,
      java: `// Master Theorem Analyzer
public class MasterTheorem {
    public static String solve(double a, double b, double f_exponent) {
        double log_b_a = Math.log(a) / Math.log(b);
        if (f_exponent < log_b_a - 0.0001) {
            return "Case 1: Theta(n^" + String.format("%.2f", log_b_a) + ")";
        } else if (Math.abs(f_exponent - log_b_a) < 0.0001) {
            return "Case 2: Theta(n^" + String.format("%.2f", log_b_a) + " * log n)";
        } else {
            return "Case 3: Theta(n^" + String.format("%.2f", f_exponent) + ")";
        }
    }
}`,
      python: `# Master Theorem Analyzer in Python
import math

def solve_master_theorem(a: float, b: float, f_exponent: float) -> str:
    log_b_a = math.log(a, b)
    eps = 1e-5
    
    if f_exponent < log_b_a - eps:
        return f"Case 1: Leaves dominate -> Theta(n^{log_b_a:.2f})"
    elif abs(f_exponent - log_b_a) < eps:
        return f"Case 2: Balanced -> Theta(n^{log_b_a:.2f} * log n)"
    else:
        return f"Case 3: Root dominates -> Theta(n^{f_exponent:.2f})"`
    },
    visualizerType: 'master-theorem',
    dryRunExample: {
      input: 'T(n) = 2T(n/2) + n  (Merge Sort Recurrence)',
      output: 'Theta(n log n) [Case 2]',
      steps: [
        { iteration: 1, state: 'a = 2, b = 2, f(n) = n', explanation: 'Identify recurrence parameters.' },
        { iteration: 2, state: 'c_crit = log_2(2) = 1', explanation: 'Compute critical exponent: n^(log_b a) = n^1 = n.' },
        { iteration: 3, state: 'f(n) = n = Theta(n^1 * log^0 n)', explanation: 'f(n) matches n^c_crit with k = 0.' },
        { iteration: 4, state: 'Apply Case 2 with k = 0', explanation: 'T(n) = Theta(n^(c_crit) * log^(0+1) n) = Theta(n log n).' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'c_crit = log_b(a) = log(a) / log(b)',
        'Leaves count = n^(log_b a)',
        'Strassen: T(n) = 7T(n/2) + Theta(n^2) => log2(7) ≈ 2.81 => Theta(n^2.81)',
        'Binary Search: T(n) = T(n/2) + O(1) => log2(1) = 0 => Theta(log n)'
      ],
      commonTraps: [
        'Trying to apply Master Theorem when a < 1, b <= 1, or b is non-constant.',
        'Ignoring polynomial gap requirement: T(n) = 2T(n/2) + n/log(n) cannot be solved by standard Master Theorem because n/log(n) is not polynomially smaller than n.'
      ],
      vivaQuestions: [
        { q: 'Why does Master Theorem require a polynomial gap for Case 1 and Case 3?', a: 'Because a logarithmic difference is insufficient to overcome the compounding levels in the recursion tree; such borderline cases violate the asymptotic separation required between leaf and root levels.' },
        { q: 'Can Master Theorem solve T(n) = 2T(n/2) + n log n?', a: 'Standard Master theorem cannot (gap is not polynomial), but the Extended Master Theorem (Case 2 with k=1) gives Theta(n log^2 n).' }
      ]
    },
    questions: [
      {
        id: 'q-mt-1',
        topicId: 'master-theorem',
        title: 'Master Theorem for Strassen\'s Algorithm',
        type: 'complexity',
        difficulty: 'Medium',
        question: 'Strassen\'s matrix multiplication recurrence is T(n) = 7T(n/2) + Θ(n^2). What is its solution via Master Theorem?',
        options: [
          'Θ(n^2 log n)',
          'Θ(n^(log2 7)) ≈ Θ(n^2.807)',
          'Θ(n^3)',
          'Θ(n^2)'
        ],
        correctAnswer: 1,
        explanation: 'Here a = 7, b = 2, f(n) = n^2. Critical exponent is log2(7) ≈ 2.807. Since f(n) = n^2 = O(n^(2.807 - eps)) for eps ≈ 0.8, Case 1 applies, yielding T(n) = Θ(n^(log2 7)).',
        whyWrong: {
          '0': 'Case 2 only applies when exponent matches log_b(a).',
          '2': 'Standard naive matrix multiplication is O(n^3); Strassen strictly beats it.',
          '3': 'Root work does not dominate because log2(7) > 2.'
        }
      },
      {
        id: 'q-mt-2',
        topicId: 'master-theorem',
        title: 'Applicability Test',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'Which of the following recurrences CANNOT be solved using the standard Master Theorem?',
        options: [
          'T(n) = 4T(n/2) + n',
          'T(n) = 2T(n/2) + n / log n',
          'T(n) = 3T(n/3) + n^2',
          'T(n) = 8T(n/2) + n^3'
        ],
        correctAnswer: 1,
        explanation: 'For T(n) = 2T(n/2) + n/log n, c_crit = log2(2) = 1. f(n) = n / log n is asymptotically smaller than n^1, but NOT polynomially smaller (there is no eps > 0 such that n/log n <= n^(1 - eps)). Hence standard Master Theorem fails.',
        commonTrap: 'Thinking any recurrence with T(n/2) can be solved by Master Theorem.'
      },
      {
        id: 'q-mt-3',
        topicId: 'master-theorem',
        title: 'Case 3 Regularity Condition',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: In Case 3 of the Master Theorem, having f(n) = Ω(n^(log_b a + ε)) is sufficient on its own without needing any regularity condition.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Case 3 strictly requires the regularity condition: a * f(n/b) <= c * f(n) for some constant c < 1 and sufficiently large n, ensuring the work does not oscillate between recursion levels.',
        complexityNote: 'Regularity guarantees that root work dominates the sum of child work.'
      },
      {
        id: 'q-mt-4',
        topicId: 'master-theorem',
        title: 'Binary Search Recurrence',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'For Binary Search recurrence T(n) = T(n/2) + 1, what is the value of the critical exponent c_crit = log_b(a)?',
        options: ['0', '1', '2', '0.5'],
        correctAnswer: 0,
        explanation: 'Here a = 1 and b = 2. c_crit = log2(1) = 0. Since f(n) = 1 = n^0, Case 2 applies with k = 0, giving T(n) = Θ(n^0 * log n) = Θ(log n).',
        complexityNote: 'log_b(1) is always 0.'
      },
      {
        id: 'q-mt-5',
        topicId: 'master-theorem',
        title: 'Karatsuba Recurrence',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Karatsuba integer multiplication satisfies T(n) = 3T(n/2) + O(n). Which case of the Master Theorem applies?',
        options: ['Case 1', 'Case 2', 'Case 3', 'Does not apply'],
        correctAnswer: 0,
        explanation: 'a = 3, b = 2 => log2(3) ≈ 1.585. f(n) = O(n^1). Since 1 < 1.585, f(n) is polynomially smaller than n^(log2 3), so Case 1 applies, yielding Θ(n^(log2 3)) ≈ Θ(n^1.585).',
        whyWrong: {
          '1': 'f(n) does not match n^1.585.',
          '2': 'f(n) is smaller, not larger than n^(log_b a).'
        }
      },
      {
        id: 'q-mt-6',
        topicId: 'master-theorem',
        title: 'Master Theorem Case 2 Extension',
        type: 'complexity',
        difficulty: 'Hard',
        question: 'What is the asymptotic complexity of T(n) = 2T(n/2) + n log n?',
        options: ['Θ(n log n)', 'Θ(n log^2 n)', 'Θ(n^2)', 'Θ(n)'],
        correctAnswer: 1,
        explanation: 'By the Extended Master Theorem, when f(n) = Θ(n^(log_b a) * log^k n) with k >= 0: here a=2, b=2, so log_b(a) = 1, and f(n) = n log^1 n (k = 1). The solution is Θ(n^(log_b a) * log^(k+1) n) = Θ(n log^2 n).'
      }
    ],
    relatedTopicIds: ['intro-algorithms', 'merge-sort', 'quick-sort'],
    applications: ['Divide and conquer design', 'Predicting parallel divide-and-conquer execution trees', 'Algorithm design proofing'],
    advantages: ['Instant resolution without drawing complete trees', 'Mathematically rigorous'],
    limitations: ['Only applies when subproblems are equal fractions n/b', 'Cannot solve Fibonacci T(n) = T(n-1) + T(n-2)']
  },
  {
    id: 'merge-sort',
    unitId: 'unit-2',
    unitNumber: 2,
    title: 'Merge Sort & Inversion Counting',
    slug: 'merge-sort',
    category: 'Sorting',
    shortDesc: 'Canonical stable divide-and-conquer sorting running in guaranteed O(n log n) worst-case time.',
    prerequisites: ['master-theorem', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'Merge Sort takes an unsorted deck of cards, splits it into two equal halves, sorts each half recursively, and then zips the two sorted halves together by repeatedly picking the smaller of the two top cards.',
    formalDefinition: 'Merge Sort is a comparison-based divide-and-conquer sorting algorithm. It divides an array of size n into two halves of size n/2, recursively sorts each half, and merges the two sorted sequences in O(n) time. Recurrence: T(n) = 2T(n/2) + O(n) => T(n) = Theta(n log n) across all cases.',
    intuition: 'Dividing takes O(1). Merging two sorted lists of total size n takes at most n-1 comparisons. The recursion tree has exactly ceil(log2 n) levels, with O(n) work at each level.',
    coreIdeaSteps: [
      'Divide: Find midpoint mid = left + (right - left) / 2.',
      'Conquer: Recursively invoke mergeSort(left, mid) and mergeSort(mid + 1, right).',
      'Combine (Merge): Allocate temporary auxiliary buffers for the two halves.',
      'Two-pointer sweep: Compare left[i] and right[j], place smaller into arr[k], increment respective pointer.',
      'Copy any remaining elements from either buffer back into the primary array.'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      auxiliarySpace: 'O(n)',
      inputSpace: 'O(n)',
      explanation: {
        best: 'Even if the array is already sorted, merge sort splits down to single elements and merges across all log2 n levels.',
        average: 'Uniformly O(n log n) comparisons.',
        worst: 'Guaranteed O(n log n) with no degenerate inputs.',
        space: 'Requires O(n) auxiliary buffer during the merge step, plus O(log n) stack space.'
      }
    },
    proof: {
      type: 'Mathematical Induction',
      title: 'Correctness of Merge Sort via Structural Induction',
      preconditions: 'Array A contains n elements.',
      steps: [
        {
          phase: 'Base Case (n = 1)',
          description: 'An array of size 1 is trivially sorted by definition. Merge sort returns without changes.'
        },
        {
          phase: 'Inductive Hypothesis',
          description: 'Assume merge sort correctly sorts any subarray of size k < n.'
        },
        {
          phase: 'Inductive Step',
          description: 'For size n, the array is partitioned into left half of size floor(n/2) and right half of size ceil(n/2). By the hypothesis, both halves are correctly sorted. The Merge subroutine uses a two-pointer invariant: at each step, the smallest remaining element in either sorted half is selected and placed into the destination array, correctly producing a combined sorted sequence of size n.'
        }
      ],
      conclusion: 'By mathematical induction, Merge Sort correctly sorts any array of size n.'
    },
    code: {
      cpp: `// Production Merge Sort in C++
#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    std::vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; ++i) L[i] = arr[left + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) { // '<=' ensures stability
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
      java: `// Production Merge Sort in Java
public class MergeSort {
    public static void sort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            sort(arr, left, mid);
            sort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        int[] L = new int[n1];
        int[] R = new int[n2];

        System.arraycopy(arr, left, L, 0, n1);
        System.arraycopy(arr, mid + 1, R, 0, n2);

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++]; // Stable
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
}`,
      python: `# Production Merge Sort in Python
def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge step
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # <= guarantees stability
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged`
    },
    visualizerType: 'sorting',
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    dryRunExample: {
      input: 'Array: [38, 27, 43, 3, 9, 82, 10]',
      output: '[3, 9, 10, 27, 38, 43, 82]',
      steps: [
        { iteration: 1, state: 'Divide: [38, 27, 43, 3] and [9, 82, 10]', explanation: 'Split at midpoint index 3.' },
        { iteration: 2, state: 'Sub-divide down to single elements: [38], [27], [43], [3]...', explanation: 'Single element arrays are trivially sorted base cases.' },
        { iteration: 3, state: 'Merge [38] & [27] -> [27, 38]', explanation: '27 < 38: place 27, then 38.' },
        { iteration: 4, state: 'Merge [27, 38] & [3, 43] -> [3, 27, 38, 43]', explanation: 'Two-pointer merge.' },
        { iteration: 5, state: 'Final merge of [3, 27, 38, 43] and [9, 10, 82] -> Complete!', explanation: 'Full sorted array produced in O(n log n).' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Recurrence: T(n) = 2T(n/2) + O(n)',
        'Height of recursion tree: ceil(log2 n)',
        'Work per tree level: cn => Total time = cn * log2 n = Theta(n log n)',
        'Inversion counting modification: when right[j] < left[i], add (mid - i + 1) inversions.'
      ],
      commonTraps: [
        'Using `<` instead of `<=` when merging destroys the stability of Merge Sort.',
        'Believing Merge Sort is in-place. Standard array merge sort requires O(n) auxiliary memory for buffer allocations.'
      ],
      vivaQuestions: [
        { q: 'Is Merge Sort stable, and why does stability matter?', a: 'Yes, because when comparing equal elements (L[i] == R[j]), the algorithm prioritizes L[i], preserving original relative order. Stability is critical when sorting records on multiple secondary keys (e.g., sort by First Name, then Last Name).' },
        { q: 'Why is Merge Sort preferred over Quick Sort for Linked Lists?', a: 'Merge sort does not require random array indexing; splitting a linked list via slow/fast pointers is O(n), and merging requires only rewiring pointers in O(1) auxiliary space.' }
      ]
    },
    questions: [
      {
        id: 'q-ms-1',
        topicId: 'merge-sort',
        title: 'Preserving Stability',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'In the merge step of Merge Sort, what condition must be used when comparing elements from left (L[i]) and right (R[j]) to guarantee stability?',
        options: [
          'if (L[i] < R[j])',
          'if (L[i] <= R[j])',
          'if (L[i] >= R[j])',
          'if (L[i] > R[j])'
        ],
        correctAnswer: 1,
        explanation: 'Using `<=` ensures that when elements are equal, the element from the left array (which originally appeared earlier) is placed first into the merged array, strictly preserving relative order.',
        whyWrong: {
          '0': 'Using strictly `<` would cause the right element to be chosen on equality, inverting their relative order.'
        }
      },
      {
        id: 'q-ms-2',
        topicId: 'merge-sort',
        title: 'Counting Inversions via Merge Sort',
        type: 'dry-run',
        difficulty: 'Hard',
        question: 'An inversion in array A is a pair (i, j) such that i < j and A[i] > A[j]. When merging L = [3, 8] and R = [2, 5], how many inversions are contributed when 2 is picked?',
        options: ['1', '2', '3', '0'],
        correctAnswer: 1,
        explanation: 'Because L is sorted, if R[0] (which is 2) is smaller than L[0] (which is 3), 2 is strictly smaller than ALL remaining elements in L (both 3 and 8). Hence, selecting 2 adds len(L) - i = 2 - 0 = 2 inversions.',
        complexityNote: 'Counting inversions via modified merge sort runs in O(n log n), vs O(n^2) brute force.'
      },
      {
        id: 'q-ms-3',
        topicId: 'merge-sort',
        title: 'Merge Sort Memory Requirement',
        type: 'complexity',
        difficulty: 'Easy',
        question: 'What is the auxiliary space complexity of standard Merge Sort on an array of size n?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 2,
        explanation: 'Merging two subarrays requires allocating temporary memory of size proportional to the elements being merged. At the top level, this requires O(n) auxiliary space.',
        commonTrap: 'Thinking that recursive stack O(log n) is the total auxiliary memory; the temporary array O(n) dominates.'
      },
      {
        id: 'q-ms-4',
        topicId: 'merge-sort',
        title: 'Worst-case Input Sensitivity',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: Merge Sort runs in O(n^2) time if the input array is already sorted in reverse order.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Merge Sort ALWAYS runs in O(n log n) time regardless of initial array ordering, because the division tree is always perfectly balanced into n/2 halves.',
        complexityNote: 'Best, Average, and Worst cases are all Theta(n log n).'
      },
      {
        id: 'q-ms-5',
        topicId: 'merge-sort',
        title: 'Tree Levels and Comparisons',
        type: 'numerical',
        difficulty: 'Medium',
        question: 'For an array of n = 64 elements, how many levels are there in the Merge Sort recursion tree (including the root)?',
        options: ['6', '7', '8', '64'],
        correctAnswer: 1,
        explanation: 'The tree starts at n = 64 (level 0) and halves at each step: 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1. Total levels = log2(64) + 1 = 6 + 1 = 7 levels.',
        complexityNote: 'Height is log2(n), number of levels is log2(n) + 1.'
      },
      {
        id: 'q-ms-6',
        topicId: 'merge-sort',
        title: 'Linked List Sorting Optimality',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Why is Merge Sort particularly favored over Quick Sort and Heap Sort for sorting singly linked lists?',
        options: [
          'It can be implemented with O(1) auxiliary space by only relinking pointers',
          'It runs in O(n) time on linked lists',
          'Linked lists do not support recursion',
          'It avoids cache misses'
        ],
        correctAnswer: 0,
        explanation: 'Unlike arrays where merging requires temporary buffer allocation, merging two sorted linked lists only requires updating `.next` pointers, achieving O(n log n) time with O(1) extra space without needing random index access.'
      }
    ],
    relatedTopicIds: ['quick-sort', 'master-theorem', 'adversary-lower-bounds'],
    applications: ['External sorting on massive disk datasets', 'Timsort (Python and Java default sort)', 'Counting inversions in ranking systems'],
    advantages: ['Strict O(n log n) worst-case performance', 'Guaranteed stability', 'Optimal for linked structures and sequential storage'],
    limitations: ['O(n) auxiliary space overhead on arrays', 'Higher constant factor than Quicksort on typical in-memory cache architectures']
  },
  {
    id: 'quick-sort',
    unitId: 'unit-2',
    unitNumber: 2,
    title: 'Quick Sort & Randomized Quick Sort',
    slug: 'quick-sort',
    category: 'Sorting',
    shortDesc: 'Divide-and-conquer in-place partitioning sort with O(n log n) expected and O(n^2) worst-case complexity.',
    prerequisites: ['master-theorem', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'Quick Sort picks a "pivot" element and rearranges the array so that all items smaller than the pivot move to the left, and all items larger move to the right. The pivot is now in its exact final sorted spot! It then repeats this recursively on the left and right sides.',
    formalDefinition: 'Quick Sort partitions an array A[p..r] around a chosen pivot x = A[r] such that A[p..q-1] <= x < A[q+1..r]. It recursively sorts the subarrays. While worst-case time is O(n^2) when partitions are unbalanced (e.g., 0 and n-1), expected time with randomized pivot selection is O(n log n) with excellent cache locality.',
    intuition: 'Unlike Merge Sort which does work during combining (merging), Quick Sort does all its heavy lifting up front during partitioning. Once both sides are recursively partitioned, the array is already sorted!',
    coreIdeaSteps: [
      'Choose a pivot element (Lomuto: last element, Hoare: first/middle, or Randomized).',
      'Partition array in-place: maintain pointer i for boundary of elements <= pivot.',
      'Scan with pointer j: if A[j] <= pivot, increment i and swap A[i] with A[j].',
      'Place pivot in its correct final index q by swapping A[i+1] with A[r].',
      'Recursively apply quickSort(p, q - 1) and quickSort(q + 1, r).'
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n^2)',
      auxiliarySpace: 'O(log n) stack space',
      inputSpace: 'O(n)',
      explanation: {
        best: 'Pivot always splits the array into two equal halves of size n/2: T(n) = 2T(n/2) + O(n) => O(n log n).',
        average: 'Expected comparisons across random permutations = 2n ln n ≈ 1.39 n log2 n = O(n log n).',
        worst: 'Pivot is always the minimum or maximum element (e.g. sorted array with last element pivot): T(n) = T(n-1) + O(n) => O(n^2).',
        space: 'In-place array modifications; auxiliary memory is recursion call stack (O(log n) best/average, O(n) worst).'
      }
    },
    code: {
      cpp: `// Production In-Place QuickSort with Lomuto Partition
#include <vector>
#include <cstdlib>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; ++j) {
        if (arr[j] <= pivot) {
            ++i;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1; // Pivot final index
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      java: `// Production QuickSort in Java
public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}`,
      python: `# Production QuickSort with Randomized Pivot in Python
import random

def partition(arr: list[int], low: int, high: int) -> int:
    # Randomized pivot prevents O(n^2) worst case on sorted data
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx]
    
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`
    },
    visualizerType: 'sorting',
    defaultInput: [10, 80, 30, 90, 40, 50, 70],
    dryRunExample: {
      input: 'Array: [10, 80, 30, 90, 40, 50, 70], Pivot = 70',
      output: 'Partitioned: [10, 30, 40, 50, 70, 90, 80]',
      steps: [
        { iteration: 1, state: 'Scan 10: 10 <= 70 -> swap to front (i=0)', explanation: '10 is smaller than pivot.' },
        { iteration: 2, state: 'Scan 80: 80 > 70 -> no swap', explanation: '80 remains in right partition.' },
        { iteration: 3, state: 'Scan 30: 30 <= 70 -> swap with 80 (i=1)', explanation: 'Array: [10, 30, 80, 90, 40, 50, 70].' },
        { iteration: 4, state: 'Scan 40 & 50: both <= 70 -> swap forward (i=3)', explanation: 'Array: [10, 30, 40, 50, 90, 80, 70].' },
        { iteration: 5, state: 'Final step: swap pivot 70 into index i+1 = 4', explanation: 'Pivot 70 locked in position [10, 30, 40, 50, 70, 90, 80].' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Expected Comparisons: 2n ln n ≈ 1.386 n log2 n',
        'Worst Case Recurrence: T(n) = T(n-1) + Theta(n) => Theta(n^2)',
        'Best Case Recurrence: T(n) = 2T(n/2) + Theta(n) => Theta(n log n)',
        'Tail Call Optimization reduces worst-case stack space from O(n) to O(log n).'
      ],
      commonTraps: [
        'Assuming QuickSort is stable. The swaps during partitioning jump over elements, destroying original relative order.',
        'Believing randomized quicksort eliminates worst-case entirely. Worst case remains O(n^2), but the probability of hitting it on random pivots is infinitesimally small (1/n!).'
      ],
      vivaQuestions: [
        { q: 'Why is Quick Sort typically faster in practice than Merge Sort despite having an O(n^2) worst case?', a: 'Quick Sort operates strictly in-place with exceptional CPU cache locality and minimal memory bus traffic. It avoids the continuous memory allocation and copy overhead of Merge Sort.' },
        { q: 'How does Tail Call Optimization guarantee O(log n) space in Quick Sort?', a: 'By always recurring on the smaller partition first (at most size n/2) and iterating on the larger partition using a while loop, the stack depth cannot exceed log2(n).' }
      ]
    },
    questions: [
      {
        id: 'q-qs-1',
        topicId: 'quick-sort',
        title: 'Worst-case Trigger Condition',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'When using the standard last-element pivot selection (Lomuto partition), what input triggers worst-case O(n^2) time?',
        options: [
          'An array with randomly shuffled elements',
          'An array that is already sorted in ascending or descending order',
          'An array containing only powers of 2',
          'An array with exactly 3 distinct elements'
        ],
        correctAnswer: 1,
        explanation: 'When the array is already sorted, the last element is always the maximum. Each partition step splits the problem into sizes 0 and n-1, creating a degenerate recursion tree of depth n with total work n + (n-1) + ... + 1 = O(n^2).',
        whyWrong: {
          '0': 'Random inputs yield balanced partitions and O(n log n) time.',
          '2': 'Magnitude of values does not affect partitioning balance.'
        }
      },
      {
        id: 'q-qs-2',
        topicId: 'quick-sort',
        title: 'Stability of Quick Sort',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: Standard in-place QuickSort is a stable sorting algorithm.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. During partitioning, elements can be swapped across large distances over intermediate identical elements, altering their original relative input order.',
        commonTrap: 'Confusing Merge Sort (stable) with Quick Sort (unstable).'
      },
      {
        id: 'q-qs-3',
        topicId: 'quick-sort',
        title: 'Randomized QuickSort Expected Runtime',
        type: 'complexity',
        difficulty: 'Medium',
        question: 'What is the EXPECTED time complexity of Randomized QuickSort on ANY input array of size n?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'Because every element has an equal 1/n probability of being chosen as the pivot regardless of input ordering, the expected number of comparisons is strictly 2n ln n = O(n log n).',
        complexityNote: 'No adversary can construct an input that always forces O(n^2) on Randomized Quicksort.'
      },
      {
        id: 'q-qs-4',
        topicId: 'quick-sort',
        title: 'Median of Three Pivot Selection',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'What is the primary motivation for using the "Median-of-Three" (first, middle, last) pivot selection strategy?',
        options: [
          'It guarantees O(n) worst case time',
          'It eliminates worst-case O(n^2) behavior on already sorted or reverse-sorted arrays',
          'It makes QuickSort stable',
          'It reduces auxiliary space to O(1)'
        ],
        correctAnswer: 1,
        explanation: 'For sorted arrays, the median of the first, middle, and last elements is the true middle element, ensuring a balanced 50-50 split and preventing the degenerate O(n^2) worst case.',
        whyWrong: {
          '0': 'Worst-case comparison sorting cannot beat Ω(n log n).',
          '2': 'Does not affect stability of partitioning swaps.'
        }
      },
      {
        id: 'q-qs-5',
        topicId: 'quick-sort',
        title: 'Stack Space with Tail Call Elimination',
        type: 'numerical',
        difficulty: 'Hard',
        question: 'If QuickSort is optimized to always recur on the smaller partition and iterate on the larger partition, what is the MAXIMUM call stack depth for n = 1024?',
        options: ['10', '512', '1024', '2048'],
        correctAnswer: 0,
        explanation: 'Because the smaller partition is guaranteed to be of size at most floor(n/2), the stack depth can at most halve at each recursive step: floor(log2(1024)) = 10 stack frames.',
        complexityNote: 'Guarantees O(log n) auxiliary stack space even in the worst-case partitioning.'
      },
      {
        id: 'q-qs-6',
        topicId: 'quick-sort',
        title: 'Lomuto vs Hoare Partition Comparisons',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'How does Hoare\'s original two-pointer partition compare to Lomuto\'s single-scan partition in terms of swaps?',
        options: [
          'Hoare\'s partition does on average 3x fewer swaps than Lomuto\'s',
          'Lomuto does fewer swaps than Hoare',
          'Both perform the exact identical sequence of swaps',
          'Hoare requires an auxiliary array'
        ],
        correctAnswer: 0,
        explanation: 'Hoare\'s scheme uses two pointers converging from both ends and only swaps when an inversion is detected. Lomuto swaps whenever an element is <= pivot, resulting in roughly 3 times more swaps on average.',
        commonTrap: 'Lomuto is simpler to code and explain, but Hoare is practically more efficient.'
      }
    ],
    relatedTopicIds: ['merge-sort', 'order-statistics', 'master-theorem'],
    applications: ['Standard C++ `std::sort` (Introsort)', 'Operating system kernel sorting', 'High-frequency trading low-latency sorting'],
    advantages: ['Outstanding in-place CPU cache efficiency', 'Fastest general-purpose comparison sort in practice'],
    limitations: ['O(n^2) worst case if pivots degrade', 'Unstable by default']
  }
];
