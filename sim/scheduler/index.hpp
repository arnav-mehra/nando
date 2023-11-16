#pragma once

#include "../gate/struct.hpp"

#include <queue>
#include <unordered_set>
#include <iostream>
#include <functional>
// #include <windows.h>

using namespace std;

namespace Scheduler {
    int T = 0;

    typedef pair<int, GATE*> PQ_PAIR; 
    priority_queue<PQ_PAIR, vector<PQ_PAIR>, greater<PQ_PAIR>> pq;

    void clear() {
        pq = priority_queue<PQ_PAIR, vector<PQ_PAIR>, greater<PQ_PAIR>>();
    }

    void addGate(GATE* gate) {
        pq.push({ T + 1, gate });
    }

    void runIncrement(function<void(void)> fn) {
        unordered_set<GATE*> seen;

        while (pq.size() && pq.top().first == T) {
            GATE* curr = pq.top().second;
            pq.pop();

            if (seen.find(curr) != seen.end()) continue;
            seen.insert(curr);

            curr->run();
        }
        Wiring::apply_updates();

        // Sleep(1000);
        cout << "T = " << T << (pq.size() ? "\n" : "-infinity\n");
        fn();
        T++;
    }

    void run(function<void(void)> fn) {
        while (pq.size()) {
            runIncrement(fn);
        }
    }

    void print() {
        vector<PQ_PAIR> buffer;

        printf("PQ (size %d):\n", pq.size());

        while (pq.size()) {
            PQ_PAIR p = pq.top();
            buffer.push_back(p);
            pq.pop();
            cout << p.first << ": " << p.second << '\n';
        }

        for (PQ_PAIR p : buffer) {
            pq.push(p);
        }
    }
};