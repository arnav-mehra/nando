#pragma once

#include "../gate/index.hpp"

#include <vector>
#include <string>
#include <iostream>

#define N_WIRES 1000

using namespace std;

namespace Wiring {
    bool wires[N_WIRES];
    bool updates[N_WIRES] = {};

    vector<GATE*> plugs[N_WIRES];

    bool get(int idx) {
        return wires[idx];
    }

    void set(int idx, int val) {
        updates[idx] = val;
    }

    bool changed(int idx) {
        return wires[idx] != updates[idx];
    }

    void apply_updates() {
        for (int i = 0; i < N_WIRES; i++) {
            wires[i] = updates[i];
        }
    }

    void init(int start, int n, int val) {
        for (int i = 0; i < n; i++) {
            updates[start + i] = val;
        }
        apply_updates();
    }

    void init(int start, string vals) {
        for (int i = 0; i < vals.size(); i++) {
            if      (vals[i] == '1') updates[start + i] = 1;
            else if (vals[i] == '0') updates[start + i] = 0;
        }
        apply_updates();
    }

    void init(string vals) {
        init(0, vals);
    }
};