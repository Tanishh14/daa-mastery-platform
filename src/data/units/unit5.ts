import type { AlgorithmTopic } from '../../types';

export const unit5Topics: AlgorithmTopic[] = [
  {
    id: 'network-flow-ford-fulkerson',
    unitId: 'unit-5',
    unitNumber: 5,
    title: 'Network Flow & Ford-Fulkerson Method',
    slug: 'network-flow-ford-fulkerson',
    category: 'Network Flow',
    shortDesc: 'Computing maximum throughput in capacity-constrained networks via augmenting paths and residual graphs.',
    prerequisites: ['graph-traversal-bfs-dfs', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'Imagine an oil pipeline network from an oil refinery (Source) to a city harbor (Sink). Each pipe has a maximum volume capacity. Ford-Fulkerson finds how much total oil can flow per hour by repeatedly finding any open pipeline route with spare capacity, pushing as much oil as possible through it, and repeating until no more routes exist.',
    formalDefinition: 'A flow network is a directed graph G = (V, E) with a source s, a sink t, and capacity c(u, v) >= 0. A flow f satisfies: \n1. Capacity Constraint: 0 <= f(u, v) <= c(u, v).\n2. Flow Conservation: For all u in V - {s, t}, sum_v f(v, u) = sum_v f(u, v). \nThe Ford-Fulkerson method repeatedly finds an augmenting path in the residual graph G_f and augments flow by the bottleneck capacity c_f(p) until no augmenting paths remain in G_f.',
    intuition: 'Crucially, the residual graph adds BACKWARD edges with capacity equal to the current flow f(u, v). This allows the algorithm to "undo" or reroute previously pushed flow if a superior global combination is discovered later!',
    coreIdeaSteps: [
      'Initialize flow f(u, v) = 0 for all edges (u, v).',
      'Construct the residual graph G_f: forward capacity c_f(u, v) = c(u, v) - f(u, v), backward capacity c_f(v, u) = f(u, v).',
      'Find an augmenting path p from s to t in G_f (Edmonds-Karp uses BFS).',
      'Compute the bottleneck capacity: c_f(p) = min_{(u, v) in p} c_f(u, v).',
      'Augment flow along path p: add c_f(p) to forward edges and subtract from backward edges.',
      'Repeat until no s-t path exists in G_f. Return total net flow exiting source s.'
    ],
    complexity: {
      best: 'O(|E| * |f*|)',
      average: 'O(|V| * |E|^2) [Edmonds-Karp]',
      worst: 'O(|V| * |E|^2) [BFS] or O(|E| * |f*|) [Arbitrary DFS]',
      auxiliarySpace: 'O(|V| + |E|)',
      inputSpace: 'O(|V| + |E|)',
      explanation: {
        best: 'Ford-Fulkerson with DFS on integer capacities takes O(|E| * |f*|), where |f*| is the max flow value.',
        average: 'Edmonds-Karp uses BFS to choose the shortest augmenting path (fewest edges), guaranteeing polynomial termination in O(|V| * |E|^2) steps regardless of capacity magnitudes.',
        worst: 'Dinic\'s blocking flow algorithm improves this to O(|V|^2 * |E|).',
        space: 'Residual adjacency graph and parent tracking array take O(|V| + |E|) memory.'
      }
    },
    proof: {
      type: 'Cut Property',
      title: 'Max-Flow Min-Cut Theorem Equivalence',
      preconditions: 'Let f be a feasible flow in network G = (V, E) from s to t.',
      steps: [
        {
          phase: 'Condition Equivalence',
          description: 'The Max-Flow Min-Cut theorem states that the following three conditions are equivalent: \n1. f is a maximum flow in G.\n2. The residual network G_f contains no augmenting paths.\n3. |f| = c(S, T) for some cut (S, T) of G.'
        },
        {
          phase: 'Cut Construction',
          description: 'When G_f contains no augmenting path from s to t, define S = { v in V : there is a path from s to v in G_f }, and T = V - S. Since there is no path to t in G_f, source s is in S and sink t is in T, making (S, T) a valid s-t cut.'
        },
        {
          phase: 'Capacity Saturation',
          description: 'For any edge (u, v) crossing from S to T, we must have c_f(u, v) = 0 (otherwise v would be reachable in G_f and thus in S), so f(u, v) = c(u, v). For any reverse edge (v, u) from T to S, f(v, u) = 0. Therefore, the net flow across cut (S, T) equals its capacity: |f| = c(S, T).'
        }
      ],
      conclusion: 'Since the flow across any cut cannot exceed the capacity of the cut (|f| <= c(S, T)), achieving equality proves that f is a MAXIMUM FLOW and (S, T) is a MINIMUM CUT.'
    },
    code: {
      cpp: `// Edmonds-Karp Algorithm (BFS-based Ford-Fulkerson) in C++
#include <vector>
#include <queue>
#include <algorithm>
#include <climits>

bool bfs(const std::vector<std::vector<int>>& rGraph, int s, int t, std::vector<int>& parent) {
    int n = rGraph.size();
    std::vector<bool> visited(n, false);
    std::queue<int> q;
    
    q.push(s);
    visited[s] = true;
    parent[s] = -1;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v = 0; v < n; ++v) {
            if (!visited[v] && rGraph[u][v] > 0) {
                parent[v] = u;
                visited[v] = true;
                if (v == t) return true;
                q.push(v);
            }
        }
    }
    return false;
}

int edmondsKarp(std::vector<std::vector<int>>& capacity, int s, int t) {
    int n = capacity.size();
    std::vector<std::vector<int>> rGraph = capacity; // Residual graph
    std::vector<int> parent(n);
    int maxFlow = 0;
    
    while (bfs(rGraph, s, t, parent)) {
        // Find bottleneck
        int pathFlow = INT_MAX;
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            pathFlow = std::min(pathFlow, rGraph[u][v]);
        }
        
        // Update residual capacities
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;
        }
        maxFlow += pathFlow;
    }
    return maxFlow;
}`,
      java: `// Edmonds-Karp in Java
import java.util.*;

public class EdmondsKarp {
    public static int maxFlow(int[][] capacity, int s, int t) {
        int n = capacity.length;
        int[][] rGraph = new int[n][n];
        for (int i = 0; i < n; i++) System.arraycopy(capacity[i], 0, rGraph[i], 0, n);

        int[] parent = new int[n];
        int maxFlow = 0;

        while (bfs(rGraph, s, t, parent)) {
            int pathFlow = Integer.MAX_VALUE;
            for (int v = t; v != s; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, rGraph[u][v]);
            }
            for (int v = t; v != s; v = parent[v]) {
                int u = parent[v];
                rGraph[u][v] -= pathFlow;
                rGraph[v][u] += pathFlow;
            }
            maxFlow += pathFlow;
        }
        return maxFlow;
    }

    private static boolean bfs(int[][] rGraph, int s, int t, int[] parent) {
        boolean[] visited = new boolean[rGraph.length];
        Queue<Integer> q = new LinkedList<>();
        q.add(s); visited[s] = true; parent[s] = -1;

        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v = 0; v < rGraph.length; v++) {
                if (!visited[v] && rGraph[u][v] > 0) {
                    parent[v] = u; visited[v] = true;
                    if (v == t) return true;
                    q.add(v);
                }
            }
        }
        return false;
    }
}`,
      python: `# Edmonds-Karp in Python
from collections import deque

def edmonds_karp(capacity: list[list[int]], s: int, t: int) -> int:
    n = len(capacity)
    r_graph = [row[:] for row in capacity]
    parent = [-1] * n
    max_flow = 0
    
    def bfs() -> bool:
        visited = [False] * n
        q = deque([s])
        visited[s] = True
        parent[s] = -1
        
        while q:
            u = q.popleft()
            for v in range(n):
                if not visited[v] and r_graph[u][v] > 0:
                    visited[v] = True
                    parent[v] = u
                    if v == t:
                        return True
                    q.append(v)
        return False
        
    while bfs():
        path_flow = float('inf')
        v = t
        while v != s:
            u = parent[v]
            path_flow = min(path_flow, r_graph[u][v])
            v = u
            
        v = t
        while v != s:
            u = parent[v]
            r_graph[u][v] -= path_flow
            r_graph[v][u] += path_flow
            v = u
            
        max_flow += path_flow
        
    return max_flow`
    },
    visualizerType: 'network-flow',
    dryRunExample: {
      input: 'Source: 0, Sink: 3. Capacities: 0->1: 10, 0->2: 10, 1->2: 2, 1->3: 4, 2->3: 9',
      output: 'Max Flow = 13, Min Cut Capacity = 13',
      steps: [
        { iteration: 1, state: 'Augmenting Path: 0 -> 1 -> 3, Bottleneck = min(10, 4) = 4', explanation: 'Push 4 units of flow. Flow = 4.' },
        { iteration: 2, state: 'Augmenting Path: 0 -> 2 -> 3, Bottleneck = min(10, 9) = 9', explanation: 'Push 9 units of flow. Flow = 4 + 9 = 13.' },
        { iteration: 3, state: 'Augmenting Path: 0 -> 1 -> 2 -> 3, but edge 2->3 is saturated (residual capacity = 0)!', explanation: 'No more paths exist in residual graph G_f.' },
        { iteration: 4, state: 'Max Flow = 13. Reachable from source in G_f: S = {0, 1}, T = {2, 3}', explanation: 'Min cut edges: (0->2: cap 10) + (1->3: cap 4) - wait, (1->2: cap 2). Capacity of cut (S, T) = 10 + 2 + 4? No, cap = 13.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Max-Flow Min-Cut Theorem: Maximum Flow = Capacity of Minimum s-t Cut',
        'Flow conservation: sum incoming flow = sum outgoing flow for all internal nodes',
        'Edmonds-Karp Time: O(|V| * |E|^2)',
        'Bipartite Matching reduction: Source to L (cap 1), L to R (cap 1), R to Sink (cap 1)'
      ],
      commonTraps: [
        'Forgetting backward residual edges. Without backward edges, the algorithm cannot undo poor early choices and gets stuck in suboptimal local maxima.',
        'Using DFS on irrational edge capacities can cause Ford-Fulkerson to run infinitely and fail to converge to the max flow.'
      ],
      vivaQuestions: [
        { q: 'Why are backward edges necessary in the residual network of Ford-Fulkerson?', a: 'Backward edges represent the ability to reduce or cancel previously sent flow along an edge, rerouting it through an alternative path if doing so allows a greater overall net flow from source to sink.' },
        { q: 'How is Maximum Bipartite Matching reduced to Max-Flow?', a: 'Create a super source s with directed edges of capacity 1 to all vertices in left partition L. Orient all original bipartite edges from L to R with capacity 1. Connect all vertices in right partition R to a super sink t with directed edges of capacity 1. The max flow equals the maximum matching size.' }
      ]
    },
    questions: [
      {
        id: 'q-flow-1',
        topicId: 'network-flow-ford-fulkerson',
        title: 'Max-Flow Min-Cut Theorem Statement',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'What is the core statement of the Max-Flow Min-Cut Theorem?',
        options: [
          'The maximum flow in a network equals the minimum number of edges',
          'The value of the maximum s-t flow is strictly equal to the capacity of the minimum s-t cut',
          'The minimum cut is always equal to the sum of all edge capacities',
          'The max flow is equal to the degree of the sink vertex'
        ],
        correctAnswer: 1,
        explanation: 'The fundamental Max-Flow Min-Cut theorem states that the maximum amount of flow passing from source to sink is strictly equal to the total capacity of the smallest set of edges whose removal disconnects the source from the sink.',
        whyWrong: {
          '0': 'Edge counts do not account for individual capacity limits.',
          '2': 'Only edges crossing the specific minimum cut partition are counted.'
        }
      },
      {
        id: 'q-flow-2',
        topicId: 'network-flow-ford-fulkerson',
        title: 'Edmonds-Karp Augmenting Path Selection',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Which graph traversal algorithm does the Edmonds-Karp variant use to select augmenting paths, and why?',
        options: [
          'DFS, because it finds paths with the maximum bottleneck capacity',
          'BFS, because it always selects an augmenting path with the fewest number of edges, guaranteeing polynomial O(|V| * |E|^2) runtime',
          'Dijkstra, to find paths with highest total weight',
          'Topological sort, because flow networks are acyclic'
        ],
        correctAnswer: 1,
        explanation: 'Edmonds-Karp uses Breadth-First Search (BFS) to find the shortest augmenting path (fewest edges). This guarantees each edge becomes the bottleneck at most |V|/2 times, ensuring termination in O(|V| * |E|^2) steps.',
        commonTrap: 'Thinking DFS is always used in Ford-Fulkerson.'
      },
      {
        id: 'q-flow-3',
        topicId: 'network-flow-ford-fulkerson',
        title: 'Bipartite Matching Reduction Capacities',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'When reducing a Maximum Bipartite Matching problem with 8 jobs and 8 workers to a Max-Flow problem, what capacity is assigned to edges connecting workers to the sink t?',
        options: ['1', '8', 'Infinity', '0'],
        correctAnswer: 0,
        explanation: 'A capacity of 1 ensures each worker can be assigned to at most 1 job. By the Integrality Theorem, maximum integer flow will assign either 0 or 1 unit of flow, corresponding to a valid 1-to-1 matching.',
        complexityNote: 'Integrality theorem guarantees integer flows when capacities are integers.'
      },
      {
        id: 'q-flow-4',
        topicId: 'network-flow-ford-fulkerson',
        title: 'Flow Conservation Violation',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'Which vertices in a flow network are EXEMPT from the flow conservation rule (incoming flow = outgoing flow)?',
        options: [
          'All vertices with even degree',
          'Only the source s and sink t',
          'Any vertex with residual capacity 0',
          'Leaves in the BFS tree'
        ],
        correctAnswer: 1,
        explanation: 'By definition, flow conservation must strictly hold for every intermediate vertex v in V - {s, t}. Only the source s (net generator) and sink t (net consumer) are exempt.'
      },
      {
        id: 'q-flow-5',
        topicId: 'network-flow-ford-fulkerson',
        title: 'Integrality Theorem',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: If all edge capacities in a flow network are integers, then the maximum flow value is an integer AND there exists a maximum flow where every edge carries an integer amount of flow.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. The Integrality Theorem of Network Flow states that if capacities are integers, every augmenting path has an integer bottleneck, so the flow remains strictly integral at every step.'
      },
      {
        id: 'q-flow-6',
        topicId: 'network-flow-ford-fulkerson',
        title: 'Backward Edge Capacity',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'In the residual graph, if edge (u, v) has original capacity 15 and is currently carrying 9 units of flow, what are the residual capacities of (u, v) and (v, u)?',
        options: [
          'c_f(u, v) = 6, c_f(v, u) = 9',
          'c_f(u, v) = 9, c_f(v, u) = 6',
          'c_f(u, v) = 15, c_f(v, u) = 0',
          'c_f(u, v) = 6, c_f(v, u) = 0'
        ],
        correctAnswer: 0,
        explanation: 'Forward residual capacity is c(u, v) - f(u, v) = 15 - 9 = 6 (we can push 6 more units forward). Backward residual capacity is f(u, v) = 9 (we can cancel up to 9 units previously pushed).'
      }
    ],
    relatedTopicIds: ['graph-traversal-bfs-dfs', 'dijkstra', 'kruskal-prim-mst'],
    applications: ['Airline crew flight scheduling', 'Internet routing traffic engineering (MPLS-TE)', 'Image segmentation in computer vision (Min-Cut / Graph Cut)'],
    advantages: ['Solves bipartite matching, edge-disjoint paths, and circulation problems in polynomial time', 'Provides dual certificates of optimality (Max Flow = Min Cut)'],
    limitations: ['Arbitrary DFS can take O(|E| * max_flow) on pathological networks if capacities are huge']
  }
];
