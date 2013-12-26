---
layout: post
category : Technology 
tagline: "最短路径和网络流问题集锦"
tags : [Algorithm, Technology]
---
{% include JB/setup %}

#### FLow Network problem
    
This is all the algorithm and method that can find the maximum flow in the flow network problem with different complexity in space and time.

* Ford-Fulkerson (Time complexity based on how many augmenting path it has.)
* Edmonds karp ( O(VE^2) in time)
* Minimum Cut Maximum method

#### Shortest Path problem.

This is all the algorithm and method that can find the shortest path in a graph with different complexity in space and time.

* Floyd-Warshll (O(V^3) in time, compute the distance of all the postible pairs of path, can reconstruct the path after modifying the algorithm)
* Dijkstra ( Greedy Algo, time complexity is depended on the data structure which stores the the vertex such as binary heap, skiplist, MST, Fabonacci heap or array, BST etc.)
* Breadth First Search ( O(V+E) in tiem, undirect graph)
* Bellman-Ford ( O(VE) in time specified for negtive-weight or negtive circles )

#### Other graph theory problem

These problem can be solved by building up a Integer Linear Proggraming model, set up a goal function, and assume all the variables which obey the capacity constraint and flow conservation. At last minimize goal function.

* Minimum edage cover ___(use ILP)___
* Minimum vertex cover ___(use ILP Approximation method)___

LP formulation
Assume that every vertex has an associated cost of c(v)>= 0. The (weighted) minimum vertex cover problem can be formulated as the following integer linear program (ILP).

This ILP belongs to the more general class of ILPs for covering problems. The integrality gap of this ILP is 2, so its relaxation gives a factor-2 approximation algorithm for the minimum vertex cover problem. Furthermore, the linear programming relaxation of that ILP is half-integral, that is, there exists an optimal solution for which each entry x_v is either 0, 1/2, or 1.
