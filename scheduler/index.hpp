#pragma once

#include "../ic/index.hpp"

#include <queue>
#include <unordered_set>
#include <iostream>
#include <functional>
#include <windows.h>

using namespace std;

namespace Scheduler {
    int T = 0;
    priority_queue<pair<int, IC*>> pq;

    void addIC(IC* ic) {
        pq.push({ T + 1, ic });
    }

    void runTimerIncrement() {
        unordered_set<IC*> seen;

        while (pq.size() && pq.top().first == T) {
            IC* curr = pq.top().second;
            pq.pop();

            if (seen.find(curr) != seen.end()) continue;

            curr->run();
        }

        T++;
    }

    void runTimer(function<void(void)> fn) {
        while (pq.size()) {
            cout << "T = " << T << '\n';
            runTimerIncrement();
            fn();
            Sleep(1000);
        }
    }
};