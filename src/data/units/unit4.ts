import type { AlgorithmTopic } from '../../types';

export const unit4Topics: AlgorithmTopic[] = [
  {
    id: 'kruskal-prim-mst',
    unitId: 'unit-4',
    unitNumber: 4,
    title: 'Minimum Spanning Trees: Kruskal vs Prim',
    slug: 'kruskal-prim-mst',
    category: 'Greedy',
    shortDesc: 'Greedy tree construction spanning all vertices with minimal total edge weight via edge-sorting or vertex-growth.',
    prerequisites: ['graph-traversal-bfs-dfs', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'Imagine connecting a cluster of islands with underwater cables. You want every island connected to the grid, but undersea cable is expensive. A Minimum Spanning Tree (MST) connects all islands using the least possible total length of cable without forming any redundant loops.',
    formalDefinition: 'Given a connected, undirected graph G = (V, E) with weight function w: E -> R, a Minimum Spanning Tree is an acyclic subgraph T <= E that connects all vertices V with minimum total weight w(T) = sum_{e in T} w(e). \n- Kruskal\'s Algorithm sorts all edges in non-decreasing order and greedily adds edges that do not create cycles using a Disjoint Set Union (DSU) in O(|E| log |E|) time.\n- Prim\'s Algorithm grows a single tree outward from an arbitrary root by repeatedly picking the minimum-weight cut edge using a priority queue in O(|E| log |V|) time.',
    intuition: 'Both rely on the Cut Property: For any cut (S, V - S) of graph G, the lightest edge crossing the cut belongs to some MST of G.',
    coreIdeaSteps: [
      'Kruskal:',
      '  Sort all edges E in non-decreasing order of weight.',
      '  Initialize DSU where each vertex is in its own set.',
      '  For each edge (u, v) with weight w: if find(u) != find(v), union(u, v) and add edge to MST.',
      '  Stop when MST contains exactly |V| - 1 edges.',
      'Prim:',
      '  Initialize priority queue with key[v] = infinity, key[start] = 0.',
      '  While queue is not empty: extract min u, mark u as added to MST.',
      '  For each neighbor v of u: if v not in MST and weight(u, v) < key[v], update key[v] = weight(u, v) and parent[v] = u.'
    ],
    complexity: {
      best: 'O(|E| log |V|)',
      average: 'O(|E| log |V|)',
      worst: 'O(|E| log |V|)',
      auxiliarySpace: 'O(|V| + |E|)',
      inputSpace: 'O(|V| + |E|)',
      explanation: {
        best: 'Kruskal: Sorting |E| edges dominates with O(|E| log |E|) = O(|E| log |V|). DSU operations take almost linear O(|E| * alpha(|V|)).',
        average: 'Prim with Min-Heap: |V| extract-mins + |E| decrease-keys = O(|V| log |V| + |E| log |V|).',
        worst: 'Dense graphs: Prim with Fibonacci heap achieves O(|E| + |V| log |V|).',
        space: 'DSU arrays (parent, rank) of size |V|; Prim min-heap of size |V|.'
      }
    },
    proof: {
      type: 'Cut Property',
      title: 'Cut Property for Minimum Spanning Trees',
      preconditions: 'Let G = (V, E) be a connected undirected graph with real-valued edge weights.',
      steps: [
        {
          phase: 'Cut Definition',
          description: 'A cut (S, V - S) partitions vertices into two disjoint sets S and V - S. An edge crosses the cut if one endpoint is in S and the other in V - S.'
        },
        {
          phase: 'Exchange Argument',
          description: 'Let e = (u, v) be the minimum-weight edge crossing the cut. Assume for contradiction that e is NOT in an optimal MST T*. Since T* is a spanning tree, adding e creates a unique cycle C. This cycle must cross the cut back from V - S to S via some other edge e\'.'
        },
        {
          phase: 'Substitution',
          description: 'Construct a new tree T\' = T* - {e\'} + {e}. T\' remains a connected spanning tree. Since e is the minimal crossing edge, w(e) <= w(e\'). Thus w(T\') = w(T*) - w(e\') + w(e) <= w(T*).'
        }
      ],
      conclusion: 'Since w(T\') <= w(T*), T\' is also an optimal MST containing edge e, proving that e safely belongs to an MST.'
    },
    code: {
      cpp: `// Kruskal's Algorithm using Disjoint Set Union (DSU)
#include <vector>
#include <algorithm>

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const { return weight < other.weight; }
};

struct DSU {
    std::vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    bool unite(int i, int j) {
        int root_i = find(i), root_j = find(j);
        if (root_i == root_j) return false;
        if (rank[root_i] < rank[root_j]) parent[root_i] = root_j;
        else if (rank[root_i] > rank[root_j]) parent[root_j] = root_i;
        else { parent[root_j] = root_i; rank[root_i]++; }
        return true;
    }
};

int kruskalMST(int n, std::vector<Edge>& edges) {
    std::sort(edges.begin(), edges.end());
    DSU dsu(n);
    int totalWeight = 0, edgesCount = 0;
    
    for (const auto& edge : edges) {
        if (dsu.unite(edge.u, edge.v)) {
            totalWeight += edge.weight;
            if (++edgesCount == n - 1) break;
        }
    }
    return totalWeight;
}`,
      java: `// Kruskal's MST in Java
import java.util.*;

public class KruskalMST {
    static class Edge implements Comparable<Edge> {
        int u, v, weight;
        Edge(int u, int v, int w) { this.u = u; this.v = v; this.weight = w; }
        public int compareTo(Edge o) { return Integer.compare(this.weight, o.weight); }
    }

    public static int kruskal(int n, List<Edge> edges) {
        Collections.sort(edges);
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        int totalWeight = 0, count = 0;
        for (Edge e : edges) {
            int rootU = find(parent, e.u);
            int rootV = find(parent, e.v);
            if (rootU != rootV) {
                parent[rootU] = rootV;
                totalWeight += e.weight;
                if (++count == n - 1) break;
            }
        }
        return totalWeight;
    }

    private static int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent, parent[i]);
    }
}`,
      python: `# Kruskal's Algorithm in Python
class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        
    def find(self, i: int) -> int:
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
        
    def union(self, i: int, j: int) -> bool:
        root_i, root_j = self.find(i), self.find(j)
        if root_i == root_j:
            return False
        if self.rank[root_i] < self.rank[root_j]:
            self.parent[root_i] = root_j
        elif self.rank[root_i] > self.rank[root_j]:
            self.parent[root_j] = root_i
        else:
            self.parent[root_j] = root_i
            self.rank[root_i] += 1
        return True

def kruskal(n: int, edges: list[tuple[int, int, int]]) -> int:
    edges.sort(key=lambda x: x[2])
    dsu = DSU(n)
    total_cost = 0
    count = 0
    
    for u, v, w in edges:
        if dsu.union(u, v):
            total_cost += w
            count += 1
            if count == n - 1:
                break
    return total_cost`
    },
    visualizerType: 'graph',
    dryRunExample: {
      input: 'Vertices: 4 {0, 1, 2, 3}, Edges: (0-1: 1), (1-2: 2), (0-2: 4), (2-3: 3)',
      output: 'MST Weight: 6, Edges: [(0-1), (1-2), (2-3)]',
      steps: [
        { iteration: 1, state: 'Sorted Edges: (0-1: 1), (1-2: 2), (2-3: 3), (0-2: 4)', explanation: 'Edge weights sorted.' },
        { iteration: 2, state: 'Pick (0-1: 1): find(0) != find(1) -> ACCEPT edge', explanation: 'MST contains 1 edge, weight = 1.' },
        { iteration: 3, state: 'Pick (1-2: 2): find(1) != find(2) -> ACCEPT edge', explanation: 'MST contains 2 edges, weight = 1 + 2 = 3.' },
        { iteration: 4, state: 'Pick (2-3: 3): find(2) != find(3) -> ACCEPT edge', explanation: 'MST contains 3 edges (= n-1). Termination condition reached!' },
        { iteration: 5, state: 'Edge (0-2: 4) discarded (would create cycle)', explanation: 'Final tree has minimum total weight 6.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'MST has exactly |V| - 1 edges',
        'Kruskal Time: O(|E| log |E|) = O(|E| log |V|)',
        'Prim with Binary Heap Time: O(|E| log |V|)',
        'Prim with Fibonacci Heap Time: O(|E| + |V| log |V|)'
      ],
      commonTraps: [
        'Assuming a graph has a UNIQUE MST. If multiple edges share the same weight, multiple distinct MSTs can exist.',
        'Attempting Kruskal without cycle detection (DSU), resulting in disconnected components or cycles.'
      ],
      vivaQuestions: [
        { q: 'When should one choose Prim\'s algorithm over Kruskal\'s algorithm?', a: 'Prim\'s algorithm (using an adjacency matrix or dense heap) is faster on DENSE graphs where |E| ≈ |V|^2 (O(|V|^2) vs O(|V|^2 log |V|)). Kruskal is strictly preferred on SPARSE graphs where |E| << |V|^2 because sorting |E| edges is fast.' },
        { q: 'If all edge weights in a connected graph are distinct, is the MST unique?', a: 'Yes. If all edge weights are distinct, every cut has a strictly unique minimum-weight crossing edge, guaranteeing a unique MST.' }
      ]
    },
    questions: [
      {
        id: 'q-mst-1',
        topicId: 'kruskal-prim-mst',
        title: 'Number of Edges in Spanning Tree',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'A connected undirected graph has 20 vertices and 45 edges. How many edges will be in its Minimum Spanning Tree?',
        options: ['19', '20', '44', '45'],
        correctAnswer: 0,
        explanation: 'Any spanning tree of a graph with V vertices must contain exactly V - 1 edges to connect all vertices without forming cycles. 20 - 1 = 19 edges.',
        complexityNote: 'Edges in spanning tree is always |V| - 1.'
      },
      {
        id: 'q-mst-2',
        topicId: 'kruskal-prim-mst',
        title: 'Uniqueness of MST',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Under which condition is the Minimum Spanning Tree of a connected graph GUARANTEED to be unique?',
        options: [
          'The graph is planar',
          'All edge weights in the graph are distinct',
          'The graph has an even number of vertices',
          'The graph contains no cycles'
        ],
        correctAnswer: 1,
        explanation: 'If all edge weights are distinct, every cut in the graph has a unique minimal crossing edge. By the Cut Property, that edge must be in the MST, yielding a strictly unique MST.',
        whyWrong: {
          '0': 'Planar graphs with duplicate weights can have multiple MSTs.',
          '2': 'Parity of vertex count is irrelevant.'
        }
      },
      {
        id: 'q-mst-3',
        topicId: 'kruskal-prim-mst',
        title: 'Disjoint Set Union Complexity',
        type: 'complexity',
        difficulty: 'Hard',
        question: 'What is the time complexity of m operations (find and union) on n elements using BOTH path compression and union by rank?',
        options: ['O(m log n)', 'O(m * α(n))', 'O(m * n)', 'O(m + n log n)'],
        correctAnswer: 1,
        explanation: 'Tarjan proved that combining union by rank with path compression yields a nearly linear amortized bound of O(m * α(n)), where α(n) is the inverse Ackermann function, which is <= 4 for any practical input size.',
        commonTrap: 'Thinking DSU is strictly O(m log n).'
      },
      {
        id: 'q-mst-4',
        topicId: 'kruskal-prim-mst',
        title: 'Prim on Disconnected Graphs',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'What occurs if Prim\'s algorithm is run on a graph that has 2 disconnected components?',
        options: [
          'It constructs a spanning tree for the whole graph',
          'It only produces an MST for the single connected component containing the start vertex',
          'It enters an infinite loop',
          'It throws an arithmetic exception'
        ],
        correctAnswer: 1,
        explanation: 'Prim\'s algorithm grows outward along crossing edges from a single root. Since there are no edges connecting across disjoint components, it terminates after spanning only the root component.',
        complexityNote: 'Kruskal produces a Minimum Spanning Forest on disconnected graphs.'
      },
      {
        id: 'q-mst-5',
        topicId: 'kruskal-prim-mst',
        title: 'Negative Edge Weights in MST',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: Kruskal and Prim algorithms work correctly even if the graph contains negative edge weights.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True! Unlike Dijkstra\'s shortest path algorithm which breaks on negative edges, the Cut Property for MST holds for any real edge weights (positive, zero, or negative). Adding a large constant to all weights preserves tree ordering.',
        commonTrap: 'Confusing MST algorithms with Dijkstra\'s shortest path algorithm.'
      },
      {
        id: 'q-mst-6',
        topicId: 'kruskal-prim-mst',
        title: 'Cycle Property of MST',
        type: 'mcq',
        difficulty: 'Hard',
        question: 'In any cycle of a graph G, what can be stated about the edge with the STRICTLY MAXIMUM weight?',
        options: [
          'It must belong to every MST',
          'It can NEVER belong to any Minimum Spanning Tree',
          'It belongs to at least one MST',
          'It has no effect on MST'
        ],
        correctAnswer: 1,
        explanation: 'By the Cycle Property: for any cycle C in G, if an edge e has weight strictly greater than all other edges in C, e cannot belong to any MST (because deleting e from any tree still leaves a cheaper spanning path through the remainder of cycle C).',
        complexityNote: 'Dual of the Cut Property.'
      }
    ],
    relatedTopicIds: ['dijkstra', 'graph-traversal-bfs-dfs', 'network-flow-ford-fulkerson'],
    applications: ['Telecommunications fiber optic cable routing', 'Cluster analysis in machine learning (Single-linkage)', 'Approximation algorithms for Metric TSP (2-approximation)'],
    advantages: ['Guaranteed global minimum cost via simple local greedy decisions', 'Handles negative weights without issues'],
    limitations: ['Only applies to undirected connected graphs']
  },
  {
    id: 'dijkstra',
    unitId: 'unit-4',
    unitNumber: 4,
    title: 'Dijkstra\'s Algorithm: Shortest Paths',
    slug: 'dijkstra',
    category: 'Greedy',
    shortDesc: 'Single-source shortest path algorithm on graphs with non-negative edge weights using greedy frontier relaxation.',
    prerequisites: ['graph-traversal-bfs-dfs', 'kruskal-prim-mst'],
    importance: 'Essential',
    simpleExplanation: 'Dijkstra works like a GPS navigation system. Starting from your home, it tracks the shortest driving distance known to every intersection. It greedily locks in the closest unvisited intersection, then checks if driving through it offers a faster shortcut to all neighboring points (relaxation).',
    formalDefinition: 'Let G = (V, E) be a directed or undirected graph with non-negative edge weights w(u, v) >= 0. Dijkstra\'s algorithm computes the shortest path distance from source s to all vertices v in V. It maintains a set S of vertices whose final shortest-path weights have already been determined, repeatedly selecting u in V - S with minimal distance estimate d[u] and relaxing all outgoing edges (u, v).',
    intuition: 'Because all edge weights are >= 0, whenever the algorithm selects the closest unvisited vertex, no future path routed through longer unvisited vertices could ever loop back and make this path shorter.',
    coreIdeaSteps: [
      'Initialize dist[s] = 0, and dist[v] = infinity for all other vertices.',
      'Insert (0, s) into a Min-Priority Queue.',
      'While Priority Queue is not empty:',
      '  Extract pair (d, u) with minimum distance.',
      '  If d > dist[u], continue (stale heap entry).',
      '  For each neighbor v of u with edge weight w:',
      '    If dist[u] + w < dist[v] (Relaxation):',
      '      dist[v] = dist[u] + w, parent[v] = u, push (dist[v], v) to queue.'
    ],
    complexity: {
      best: 'O((|V| + |E|) log |V|)',
      average: 'O((|V| + |E|) log |V|)',
      worst: 'O((|V| + |E|) log |V|)',
      auxiliarySpace: 'O(|V|)',
      inputSpace: 'O(|V| + |E|)',
      explanation: {
        best: 'Binary heap: each of |V| vertices is extracted once (O(|V| log |V|)); each of |E| edges is relaxed at most once (O(|E| log |V|)).',
        average: 'O(|E| log |V|) when using adjacency list and min-heap.',
        worst: 'Dense graph with binary heap: O(|V|^2 log |V|). (With Fibonacci heap: O(|E| + |V| log |V|)).',
        space: 'Distance array of size |V| + Priority queue with at most |E| entries.'
      }
    },
    code: {
      cpp: `// Dijkstra's Algorithm with Min-Priority Queue in C++
#include <vector>
#include <queue>
#include <climits>

struct Edge {
    int to, weight;
};

std::vector<int> dijkstra(int n, int src, const std::vector<std::vector<Edge>>& adj) {
    std::vector<int> dist(n, INT_MAX);
    // Min-heap stores pairs of (distance, vertex)
    std::priority_queue<std::pair<int, int>, 
                        std::vector<std::pair<int, int>>, 
                        std::greater<std::pair<int, int>>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (d > dist[u]) continue; // Stale entry
        
        for (const auto& edge : adj[u]) {
            int v = edge.to;
            int weight = edge.weight;
            
            // Edge relaxation
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      java: `// Dijkstra's Algorithm in Java
import java.util.*;

public class Dijkstra {
    static class Edge {
        int to, weight;
        Edge(int to, int weight) { this.to = to; this.weight = weight; }
    }

    public static int[] dijkstra(int n, int src, List<List<Edge>> adj) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));

        dist[src] = 0;
        pq.add(new int[]{0, src});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];
            if (d > dist[u]) continue;

            for (Edge e : adj.get(u)) {
                if (dist[u] + e.weight < dist[e.to]) {
                    dist[e.to] = dist[u] + e.weight;
                    pq.add(new int[]{dist[e.to], e.to});
                }
            }
        }
        return dist;
    }
}`,
      python: `# Dijkstra's Algorithm in Python
import heapq

def dijkstra(n: int, src: int, adj: list[list[tuple[int, int]]]) -> list[int]:
    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)] # (dist, u)
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
            
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
                
    return dist`
    },
    visualizerType: 'graph',
    dryRunExample: {
      input: 'Vertices: 0, 1, 2. Edges: (0->1: 4), (0->2: 1), (2->1: 2), Src = 0',
      output: 'Distances: [0: 0, 1: 3, 2: 1]',
      steps: [
        { iteration: 1, state: 'dist = [0, inf, inf], PQ = [(0, 0)]', explanation: 'Source distance initialized to 0.' },
        { iteration: 2, state: 'Pop (0, 0). Relax neighbor 1 (dist=4), relax neighbor 2 (dist=1)', explanation: 'PQ = [(1, 2), (4, 1)].' },
        { iteration: 3, state: 'Pop (1, 2). Relax neighbor 1 via edge (2->1: 2): dist[2]+2 = 1+2 = 3 < 4!', explanation: 'Shortcut found! dist[1] updated to 3. PQ = [(3, 1), (4, 1)].' },
        { iteration: 4, state: 'Pop (3, 1). No unvisited outgoing neighbors.', explanation: 'Final distances locked in.' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Relaxation: if (dist[u] + w(u, v) < dist[v]) { dist[v] = dist[u] + w(u, v); }',
        'Time: O((|V| + |E|) log |V|)',
        'Fails on negative weight edges (requires Bellman-Ford O(|V| * |E|))'
      ],
      commonTraps: [
        'Attempting to fix negative edges by adding a constant C to all edges. This corrupts shortest paths because paths with more edges are penalized more than paths with fewer edges!',
        'Forgetting to check `d > dist[u]` in lazy deletion min-heaps, causing redundant duplicate neighbor evaluations.'
      ],
      vivaQuestions: [
        { q: 'Why does Dijkstra\'s algorithm fail when negative weight edges are present?', a: 'Dijkstra assumes that once a vertex is extracted from the priority queue and marked visited, its shortest distance is permanently finalized. A negative weight edge encountered later can produce a cheaper path, violating the greedy invariant.' },
        { q: 'Can we add a constant C to all edge weights to eliminate negative edges and run Dijkstra?', a: 'NO. Adding C adds k * C to a path of k edges. A 5-edge path will increase by 5C, while a 2-edge path increases by only 2C, artificially altering which path is truly minimal.' }
      ]
    },
    questions: [
      {
        id: 'q-dijk-1',
        topicId: 'dijkstra',
        title: 'Negative Weight Edges',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: Dijkstra\'s algorithm is guaranteed to produce the correct shortest path on graphs containing negative edge weights as long as there are no negative cycles.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. Even without negative cycles, a single negative edge can cause Dijkstra to greedily finalize an incorrect distance early. Bellman-Ford or SPFA is required for graphs with negative weights.',
        commonTrap: 'Assuming only negative CYCLES cause Dijkstra to fail.'
      },
      {
        id: 'q-dijk-2',
        topicId: 'dijkstra',
        title: 'Fibonacci Heap Asymptotic Bound',
        type: 'complexity',
        difficulty: 'Hard',
        question: 'What is the theoretical runtime of Dijkstra\'s algorithm when implemented using a Fibonacci Heap?',
        options: [
          'O(|V|^2)',
          'O(|E| log |V|)',
          'O(|E| + |V| log |V|)',
          'O(|V| log |E|)'
        ],
        correctAnswer: 2,
        explanation: 'A Fibonacci heap performs `decrease-key` operations in O(1) amortized time and `extract-min` in O(log |V|). With |E| relaxations and |V| extractions, total time is O(|E| + |V| log |V|).',
        complexityNote: 'Ideal for very dense graphs where |E| ≈ |V|^2.'
      },
      {
        id: 'q-dijk-3',
        topicId: 'dijkstra',
        title: 'Edge Relaxation Invariant',
        type: 'mcq',
        difficulty: 'Easy',
        question: 'What is the mathematical condition for relaxing an edge (u, v) with weight w in Dijkstra\'s algorithm?',
        options: [
          'if (dist[u] + w < dist[v])',
          'if (dist[v] + w < dist[u])',
          'if (dist[u] * w < dist[v])',
          'if (dist[u] + dist[v] < w)'
        ],
        correctAnswer: 0,
        explanation: 'Relaxing edge (u, v) tests whether traversing through vertex u provides a shorter path to vertex v than previously discovered.',
        whyWrong: {
          '1': 'Reverses the direction of the edge.',
          '2': 'Path weight is additive, not multiplicative.'
        }
      },
      {
        id: 'q-dijk-4',
        topicId: 'dijkstra',
        title: 'Single Target Optimization',
        type: 'dry-run',
        difficulty: 'Medium',
        question: 'If Dijkstra is run to find the shortest path from source S to a SINGLE target destination T, when can the algorithm safely stop?',
        options: [
          'The moment T is first inserted/relaxed into the priority queue',
          'The moment T is EXTRACTED (popped) from the priority queue',
          'Only after the priority queue becomes completely empty',
          'When all neighbors of S have been visited'
        ],
        correctAnswer: 1,
        explanation: 'A vertex\'s shortest distance is only guaranteed to be optimal when it is EXTRACTED from the priority queue, not when it is first enqueued (as shorter paths might still be found while in the queue).',
        commonTrap: 'Terminating when the target is first enqueued gives suboptimal paths.'
      },
      {
        id: 'q-dijk-5',
        topicId: 'dijkstra',
        title: 'Uniform Weight Degeneration',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'If all edge weights in a graph are strictly equal to 1, what does Dijkstra\'s algorithm functionally reduce to?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Kruskal\'s Algorithm', 'Floyd-Warshall'],
        correctAnswer: 1,
        explanation: 'When edge weights are uniform, the priority queue behaves exactly like a standard FIFO queue, and Dijkstra\'s algorithm degenerates into Breadth-First Search (BFS), running in O(|V| + |E|).',
        complexityNote: 'BFS is the uniform-weight specialization of Dijkstra.'
      },
      {
        id: 'q-dijk-6',
        topicId: 'dijkstra',
        title: 'Triangular Inequality',
        type: 'true-false',
        difficulty: 'Easy',
        question: 'True or False: Upon termination of Dijkstra\'s algorithm, the triangle inequality dist[v] <= dist[u] + w(u, v) holds for all edges (u, v) in the graph.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. This is the fundamental property of shortest paths: no edge can offer a shortcut over the finalized shortest distance.'
      }
    ],
    relatedTopicIds: ['kruskal-prim-mst', 'floyd-warshall', 'shortest-paths-dag'],
    applications: ['Google Maps / GPS road navigation', 'OSPF (Open Shortest Path First) internet routing', 'Flight connection cost optimization'],
    advantages: ['Extremely fast with min-heaps O(|E| log |V|)', 'Versatile for all non-negative weighted networks'],
    limitations: ['Cannot handle negative weight edges', 'Calculates paths from one source only; for all pairs use Floyd-Warshall']
  },
  {
    id: 'backtracking-nqueens',
    unitId: 'unit-4',
    unitNumber: 4,
    title: 'Backtracking & The N-Queens Problem',
    slug: 'backtracking-nqueens',
    category: 'Backtracking',
    shortDesc: 'Systematic exploration of state-space trees with early pruning of constraint-violating dead ends.',
    prerequisites: ['graph-traversal-bfs-dfs', 'intro-algorithms'],
    importance: 'Essential',
    simpleExplanation: 'Imagine solving a maze: when you reach an intersection, you pick one path. If it leads to a dead end, you physically turn around (backtrack) to the last intersection and try the alternative path. N-Queens places queens row-by-row on a chessboard: if a queen attacks another, that branch is pruned immediately.',
    formalDefinition: 'Backtracking is a systematic refinement of brute-force search that incrementally builds candidates to solutions and abandons a candidate ("prunes" the state-space tree) as soon as it determines the candidate cannot possibly be completed to a valid solution. In N-Queens, place N queens on an N x N chessboard such that no two queens share the same row, column, or diagonal.',
    intuition: 'Brute force checks all (N^2 choose N) combinations (for N=8, that is 4.4 billion boards!). Backtracking places one queen per row, checking only valid columns and diagonals, cutting the search tree to just 2,057 states!',
    coreIdeaSteps: [
      'Represent board: row index represents queen row, `cols[r]` stores its column.',
      'To place queen at (row, col), check: is `col` already occupied in `cols[0..row-1]`?',
      'Check diagonals: does `abs(row - r) == abs(col - cols[r])` for any previously placed queen?',
      'If safe: place queen, recur on `solve(row + 1)`.',
      'If `row == N`: valid configuration found! Record solution.',
      'Backtrack: remove queen from `cols[row]` and try the next column.'
    ],
    complexity: {
      best: 'O(N) [First solution found quickly]',
      average: 'O(N!) [Pruned tree exploration]',
      worst: 'O(N!)',
      auxiliarySpace: 'O(N)',
      inputSpace: 'O(1)',
      explanation: {
        best: 'Heuristic or early valid leaf reached in linear steps.',
        average: 'Much smaller than naive N^N due to constraint pruning.',
        worst: 'Upper bounded by N! permutations of column placements.',
        space: 'Recursion depth is exactly N; column and diagonal bitsets take O(N) space.'
      }
    },
    code: {
      cpp: `// Optimized N-Queens with O(1) Safety Checks via Bitsets
#include <vector>
#include <iostream>

class NQueens {
    int n;
    std::vector<int> colUsed, diag1, diag2;
    std::vector<std::vector<std::string>> solutions;
    std::vector<std::string> board;

    void backtrack(int row) {
        if (row == n) {
            solutions.push_back(board);
            return;
        }
        for (int col = 0; col < n; ++col) {
            int d1 = row - col + n - 1; // Major diagonal: row - col
            int d2 = row + col;         // Minor diagonal: row + col
            
            if (!colUsed[col] && !diag1[d1] && !diag2[d2]) {
                // Place queen
                board[row][col] = 'Q';
                colUsed[col] = diag1[d1] = diag2[d2] = 1;
                
                backtrack(row + 1);
                
                // Backtrack (undo move)
                board[row][col] = '.';
                colUsed[col] = diag1[d1] = diag2[d2] = 0;
            }
        }
    }

public:
    std::vector<std::vector<std::string>> solve(int N) {
        n = N;
        colUsed.assign(n, 0);
        diag1.assign(2 * n, 0);
        diag2.assign(2 * n, 0);
        board.assign(n, std::string(n, '.'));
        backtrack(0);
        return solutions;
    }
};`,
      java: `// N-Queens Solver in Java
import java.util.*;

public class NQueens {
    public static List<List<String>> solve(int n) {
        List<List<String>> solutions = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        boolean[] cols = new boolean[n];
        boolean[] d1 = new boolean[2 * n];
        boolean[] d2 = new boolean[2 * n];

        backtrack(0, n, board, cols, d1, d2, solutions);
        return solutions;
    }

    private static void backtrack(int r, int n, char[][] board, boolean[] cols, 
                                  boolean[] d1, boolean[] d2, List<List<String>> res) {
        if (r == n) {
            List<String> valid = new ArrayList<>();
            for (char[] row : board) valid.add(new String(row));
            res.add(valid);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (!cols[c] && !d1[r - c + n] && !d2[r + c]) {
                board[r][c] = 'Q';
                cols[c] = d1[r - c + n] = d2[r + c] = true;
                backtrack(r + 1, n, board, cols, d1, d2, res);
                board[r][c] = '.';
                cols[c] = d1[r - c + n] = d2[r + c] = false;
            }
        }
    }
}`,
      python: `# N-Queens Solver in Python
def solve_n_queens(n: int) -> list[list[str]]:
    solutions = []
    board = [['.'] * n for _ in range(n)]
    cols = set()
    diag1 = set() # (r - c)
    diag2 = set() # (r + c)
    
    def backtrack(r: int) -> None:
        if r == n:
            solutions.append(["".join(row) for row in board])
            return
            
        for c in range(n):
            if c in cols or (r - c) in diag1 or (r + c) in diag2:
                continue # Prune dead end
                
            # Place Queen
            cols.add(c)
            diag1.add(r - c)
            diag2.add(r + c)
            board[r][c] = 'Q'
            
            backtrack(r + 1)
            
            # Backtrack
            cols.remove(c)
            diag1.remove(r - c)
            diag2.remove(r + c)
            board[r][c] = '.'
            
    backtrack(0)
    return solutions`
    },
    visualizerType: 'backtracking',
    dryRunExample: {
      input: '4-Queens (N = 4)',
      output: '2 distinct solutions: [1, 3, 0, 2] and [2, 0, 3, 1]',
      steps: [
        { iteration: 1, state: 'Row 0: Place Q at (0, 0)', explanation: 'Queen 0 placed.' },
        { iteration: 2, state: 'Row 1: Col 0 & 1 attacked! Place Q at (1, 2)', explanation: 'Prune cols 0 & 1.' },
        { iteration: 3, state: 'Row 2: All 4 cols under attack! DEAD END!', explanation: 'Conflict detected. Backtrack to Row 1.' },
        { iteration: 4, state: 'Row 1: Move Q to (1, 3)', explanation: 'Try next candidate column in Row 1.' },
        { iteration: 5, state: 'Row 2: Place Q at (2, 1). Row 3: Place Q at (3, 2) -> DEAD END! Backtrack to Row 0...', explanation: 'Explore full tree to find valid board [1, 3, 0, 2].' }
      ]
    },
    examEssentials: {
      keyFormulas: [
        'Diagonal test 1: row - col is constant',
        'Diagonal test 2: row + col is constant',
        'Solutions for N=4: 2, N=8: 92, N=1: 1, N=2 & N=3: 0 solutions'
      ],
      commonTraps: [
        'Checking rows is redundant if placing exactly 1 queen per row iteration.',
        'Scanning the entire 2D board in O(N) to check safety; using hash sets or boolean arrays reduces safety checks to O(1).'
      ],
      vivaQuestions: [
        { q: 'For what values of N does the N-Queens problem have NO solution?', a: 'For N = 2 and N = 3, there are mathematically zero valid solutions. For N = 1, there is 1 trivial solution; for all N >= 4, at least one solution exists.' },
        { q: 'What is the exact distinction between Backtracking and Branch & Bound?', a: 'Backtracking uses Depth-First Search with pruning on decision problems (satisfiability). Branch and Bound uses Breadth-First or Best-First search with bounding functions on optimization problems (minimization/maximization).' }
      ]
    },
    questions: [
      {
        id: 'q-nq-1',
        topicId: 'backtracking-nqueens',
        title: 'Number of Solutions for N = 4',
        type: 'numerical',
        difficulty: 'Easy',
        question: 'How many distinct valid solutions exist for the 4-Queens problem on a 4x4 chessboard?',
        options: ['0', '1', '2', '4'],
        correctAnswer: 2,
        explanation: 'The 4-Queens problem has exactly 2 solutions: Queen column placements [1, 3, 0, 2] and [2, 0, 3, 1] (or in 1-indexed notation: 2-4-1-3 and 3-1-4-2).',
        complexityNote: 'For N=8, there are 92 distinct solutions.'
      },
      {
        id: 'q-nq-2',
        topicId: 'backtracking-nqueens',
        title: 'Diagonal Conflict Formula',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'Two queens placed at positions (r1, c1) and (r2, c2) attack each other diagonally if and only if:',
        options: [
          'r1 == r2',
          'c1 == c2',
          '|r1 - r2| == |c1 - c2|',
          'r1 + r2 == c1 + c2'
        ],
        correctAnswer: 2,
        explanation: 'Diagonals have a slope of +1 or -1. Hence, the difference in rows must equal the difference in columns: |r1 - r2| == |c1 - c2|.',
        whyWrong: {
          '0': 'Same row attack (horizontal).',
          '1': 'Same column attack (vertical).'
        }
      },
      {
        id: 'q-nq-3',
        topicId: 'backtracking-nqueens',
        title: 'State-Space Tree Pruning',
        type: 'mcq',
        difficulty: 'Medium',
        question: 'What is the primary factor that makes Backtracking exponentially faster than naive Brute Force enumeration?',
        options: [
          'It uses multithreading',
          'Bounding / pruning: abandoning an entire subtree the moment a constraint violation is detected',
          'It relies on dynamic programming tables',
          'It converts constraints into matrix multiplications'
        ],
        correctAnswer: 1,
        explanation: 'Pruning discards massive subtrees of invalid states without exploring them. For 8-Queens, pruning reduces search from 4.4 billion permutations down to just 2,057 nodes visited.'
      },
      {
        id: 'q-nq-4',
        topicId: 'backtracking-nqueens',
        title: 'No-solution Board Sizes',
        type: 'multiple-select',
        difficulty: 'Easy',
        question: 'For which of the following chessboard sizes N do there exist NO valid solutions to N-Queens?',
        options: ['N = 1', 'N = 2', 'N = 3', 'N = 4'],
        correctAnswer: [1, 2],
        explanation: 'N = 2 and N = 3 have zero solutions. N = 1 has 1 solution. N = 4 has 2 solutions.',
        commonTrap: 'Thinking all board sizes have at least one solution.'
      },
      {
        id: 'q-nq-5',
        topicId: 'backtracking-nqueens',
        title: 'Auxiliary Space Complexity',
        type: 'complexity',
        difficulty: 'Easy',
        question: 'What is the auxiliary space complexity of recursive N-Queens when searching for all solutions?',
        options: ['O(1)', 'O(N)', 'O(N^2)', 'O(N!)'],
        correctAnswer: 1,
        explanation: 'The call stack reaches a maximum depth of N (one frame per row), and the tracking arrays (column, diagonals) each require at most 2N entries, giving O(N) auxiliary space.',
        complexityNote: 'Space is strictly linear O(N) even though runtime is O(N!).'
      },
      {
        id: 'q-nq-6',
        topicId: 'backtracking-nqueens',
        title: 'Backtracking vs Branch and Bound',
        type: 'true-false',
        difficulty: 'Medium',
        question: 'True or False: Backtracking typically uses Depth-First Search on decision problems, whereas Branch-and-Bound uses Breadth-First or Best-First Search on optimization problems.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Backtracking searches depth-first for any/all constraint-satisfying solutions; Branch-and-Bound uses heuristic bounds and queues to find the optimal objective value.'
      }
    ],
    relatedTopicIds: ['kruskal-prim-mst', 'dijkstra', 'graph-coloring'],
    applications: ['VLSI circuit floorplanning and routing', 'Sudoku and puzzle resolution engines', 'Automated constraint satisfaction solvers (SAT)'],
    advantages: ['Finds exact solutions to NP-hard problems where heuristics fail', 'Minimal O(N) memory consumption'],
    limitations: ['Exponential O(N!) worst-case runtime on degenerate constraint graphs']
  }
];
