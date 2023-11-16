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

    struct PQ_ENTRY {
        int time;
        GATE* gate;
    };
    PQ_ENTRY pq_arr[1000];
    PQ_ENTRY* pq = pq_arr;
    int pq_size = 0;

    // PQ Operations

    PQ_ENTRY* pq_begin() {
        return &pq[0];
    }

    PQ_ENTRY* pq_end() {
        return &pq[pq_size - 1];
    }

    void push_pq(GATE* gate, int delta) {
        pq[pq_size++] = { T + delta, gate };
        push_heap(pq_begin(), pq_end(), greater<PQ_ENTRY>());
    }

    PQ_ENTRY pop_pq() {
        PQ_ENTRY p = *pq_begin();
        pop_heap(pq_begin(), pq_end(), greater<PQ_ENTRY>());
        pq_size--;
        return p;
    }

    void clear() {
        pq_size = 0;
    }

    // Circuit Runner

    void runIncrement(function<void(void)> fn) {
        unordered_set<GATE*> seen;

        while (pq_size && pq_begin()->time == T) {
            PQ_ENTRY curr = pop_pq();

            if (seen.find(curr.gate) != seen.end()) continue;
            seen.insert(curr.gate);

            curr.gate->run();
        }
        Wiring::apply_updates();

        // Sleep(1000);
        cout << "T = " << T << (pq_size ? "\n" : "-infinity\n");
        fn();
        T++;
    }

    void run(function<void(void)> fn) {
        while (pq_size) {
            runIncrement(fn);
        }
    }

    void print() {
        printf("PQ (size %d):\n", pq_size);

        for (int i = 0; i < pq_size; i++) {
            cout << pq[i].time << ": " << pq[i].gate << '\n';
        }
    }
};