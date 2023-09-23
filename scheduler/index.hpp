#pragma once

#include "../gate/index.hpp"

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

    void addGate(GATE* gate) {
        pq.push({ T + 1, gate });
    }

    void runTimerIncrement(function<void(void)> fn) {
        unordered_set<GATE*> seen;

        while (pq.size() && pq.top().first == T) {
            GATE* curr = pq.top().second;
            pq.pop();

            if (seen.find(curr) != seen.end()) continue;
            seen.insert(curr);

            curr->run();
        }
        Wiring::apply_updates();

        cout << "T = " << T << '\n';
        fn();

        // Sleep(1000);
        T++;
    }

    void runTimer(function<void(void)> fn) {
        while (pq.size()) {
            runTimerIncrement(fn);
        }
    }
};