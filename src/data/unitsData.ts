import type { UnitInfo, AlgorithmTopic } from '../types';
import { unit1Topics } from './units/unit1';
import { unit2Topics } from './units/unit2';
import { unit3Topics } from './units/unit3';
import { unit4Topics } from './units/unit4';
import { unit5Topics } from './units/unit5';
import { unit6Topics } from './units/unit6';

export const UNITS_DATA: UnitInfo[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Introduction, Complexity & Basic Algorithms',
    shortTitle: 'Unit I: Foundations & Graph Basics',
    description: 'Algorithmic fundamentals, RAM computational model, asymptotic bounds (O, Ω, Θ, o), searching, graph traversals (BFS/DFS), topological sorting, and adversary lower-bound decision trees.',
    iconName: 'Network',
    topics: unit1Topics,
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Recursion & Divide and Conquer',
    shortTitle: 'Unit II: Divide & Conquer',
    description: 'Recurrence relations, Master Theorem, Merge Sort, Quick Sort, inversion counting, randomized algorithms, and order statistics.',
    iconName: 'Split',
    topics: unit2Topics,
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Dynamic Programming',
    shortTitle: 'Unit III: Dynamic Programming',
    description: 'Overlapping subproblems, optimal substructure, memoization vs tabulation, Matrix Chain Multiplication, Longest Common Subsequence, and table transitions.',
    iconName: 'Layers',
    topics: unit3Topics,
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Greedy Strategy & Backtracking',
    shortTitle: 'Unit IV: Greedy & Backtracking',
    description: 'Greedy choice property, Minimum Spanning Trees (Kruskal & Prim), Dijkstra shortest paths, state-space tree pruning, and N-Queens backtracking.',
    iconName: 'GitFork',
    topics: unit4Topics,
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'Network Flow Optimization',
    shortTitle: 'Unit V: Network Flow',
    description: 'Capacity networks, flow conservation, residual graphs, augmenting paths, Ford-Fulkerson / Edmonds-Karp, Max-Flow Min-Cut theorem, and bipartite matching reduction.',
    iconName: 'Workflow',
    topics: unit5Topics,
  },
  {
    id: 'unit-6',
    number: 6,
    title: 'Theory of NP-Completeness',
    shortTitle: 'Unit VI: NP-Completeness',
    description: 'Complexity classes P, NP, co-NP, P vs NP, polynomial-time reductions, Cook-Levin theorem, 3-SAT, Clique, Vertex Cover, and Integer Linear Programming (ILP).',
    iconName: 'Cpu',
    topics: unit6Topics,
  },
];

// Helper functions
export const getAllTopics = (): AlgorithmTopic[] => {
  return UNITS_DATA.flatMap(u => u.topics);
};

export const getTopicBySlug = (slug: string): AlgorithmTopic | undefined => {
  return getAllTopics().find(t => t.slug === slug || t.id === slug);
};

export const getUnitById = (unitId: string): UnitInfo | undefined => {
  return UNITS_DATA.find(u => u.id === unitId);
};

export const getUnitByNumber = (num: number): UnitInfo | undefined => {
  return UNITS_DATA.find(u => u.number === num);
};

export const getNextTopic = (currentSlug: string): AlgorithmTopic | undefined => {
  const all = getAllTopics();
  const index = all.findIndex(t => t.slug === currentSlug || t.id === currentSlug);
  if (index >= 0 && index < all.length - 1) {
    return all[index + 1];
  }
  return undefined;
};

export const getPrevTopic = (currentSlug: string): AlgorithmTopic | undefined => {
  const all = getAllTopics();
  const index = all.findIndex(t => t.slug === currentSlug || t.id === currentSlug);
  if (index > 0) {
    return all[index - 1];
  }
  return undefined;
};
