export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionType = 
  | 'mcq' 
  | 'multiple-select' 
  | 'true-false' 
  | 'dry-run' 
  | 'complexity' 
  | 'debugging' 
  | 'numerical';

export interface Question {
  id: string;
  topicId: string;
  title: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  correctAnswer: string | number | number[]; // index or value or multiple indices
  explanation: string;
  whyWrong?: Record<string, string>; // explanation of why distractor options fail
  commonTrap?: string;
  complexityNote?: string;
  codeSnippet?: string;
}

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  auxiliarySpace: string;
  inputSpace?: string;
  explanation: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
}

export interface ProofInfo {
  type: 'Loop Invariant' | 'Mathematical Induction' | 'Greedy Exchange Argument' | 'Contradiction' | 'Cut Property' | 'State Space';
  title: string;
  preconditions?: string;
  steps: {
    phase: string;
    description: string;
  }[];
  conclusion: string;
}

export interface CodeImplementations {
  cpp: string;
  java: string;
  python: string;
}

export interface VisualizerStateStep {
  stepNumber: number;
  description: string;
  highlightedLine?: number; // 1-based index in the code
  actionType?: 'compare' | 'swap' | 'partition' | 'visit' | 'enqueue' | 'dequeue' | 'push' | 'pop' | 'update' | 'backtrack' | 'select' | 'done';
  arrayState?: number[];
  indices?: Record<string, number | number[]>; // e.g. { left: 0, right: 7, pivot: 3, i: 2, j: 4 }
  activeIndices?: number[];
  sortedIndices?: number[];
  graphState?: {
    visitedNodes?: string[];
    currentNode?: string;
    neighborNode?: string;
    currentEdge?: [string, string];
    queueOrStack?: string[];
    distances?: Record<string, number | string>;
    parent?: Record<string, string>;
    mstEdges?: [string, string][];
    inDegrees?: Record<string, number>;
  };
  dpTableState?: {
    table: (number | string | null)[][];
    rowLabels?: string[];
    colLabels?: string[];
    currentCell?: [number, number];
    dependencyCells?: [number, number][];
    transitionFormula?: string;
  };
  recursionTreeState?: {
    activeNodeId?: string;
    callStack?: { func: string; args: string; depth: number }[];
    treeNodes?: { id: string; label: string; parentId?: string; status: 'active' | 'done' | 'pruned' }[];
  };
  backtrackingState?: {
    board?: (number | string)[][];
    currentRow?: number;
    currentCol?: number;
    conflicts?: [number, number][];
    isValid?: boolean;
    choiceDescription?: string;
    solutionsFound?: number;
  };
  flowState?: {
    flows: Record<string, number>; // edgeId -> flow
    capacities: Record<string, number>;
    augmentingPath?: string[];
    bottleneck?: number;
    minCutS?: string[];
    minCutT?: string[];
    maxFlowValue?: number;
  };
}

export interface AlgorithmTopic {
  id: string;
  unitId: string;
  unitNumber: number;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  prerequisites: string[];
  importance: 'Essential' | 'High' | 'Foundational';
  
  // Content sections
  simpleExplanation: string;
  formalDefinition: string;
  intuition: string;
  coreIdeaSteps: string[];
  
  // Complexity
  complexity: ComplexityInfo;
  
  // Proof
  proof?: ProofInfo;
  
  // Implementations
  code: CodeImplementations;
  
  // Visualizer settings & default steps generator
  visualizerType: 
    | 'sorting' 
    | 'searching' 
    | 'graph' 
    | 'dp' 
    | 'recursion' 
    | 'greedy' 
    | 'backtracking' 
    | 'network-flow' 
    | 'asymptotic' 
    | 'master-theorem' 
    | 'adversary' 
    | 'np-reduction'
    | 'sudoku';
  
  defaultInput?: unknown;
  
  // Dry run walkthrough example
  dryRunExample: {
    input: string;
    output: string;
    steps: {
      iteration: number | string;
      state: string;
      explanation: string;
    }[];
  };
  
  // Exam essentials
  examEssentials: {
    keyFormulas: string[];
    commonTraps: string[];
    vivaQuestions: { q: string; a: string }[];
  };

  // Questions (Target 5-6)
  questions: Question[];

  relatedTopicIds: string[];
  applications: string[];
  advantages: string[];
  limitations: string[];
}

export interface UnitInfo {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  topics: AlgorithmTopic[];
}

export interface UserProgress {
  completedTopics: string[]; // topic slugs or IDs
  bookmarkedTopics: string[];
  notes: Record<string, string>; // topicId -> note
  quizScores: Record<string, { score: number; total: number; timestamp: number; completed: boolean }>;
  unitTestScores: Record<string, { score: number; total: number; percentage: number; timestamp: number }>;
  mockTestScores: { score: number; total: number; percentage: number; timestamp: number }[];
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  xp: number;
  unlockedBadges: string[];
  history: { topicId: string; timestamp: number }[];
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXP: number;
  condition: string;
}
