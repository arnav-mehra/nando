#pragma once

#include "../ic/index.hpp"

#include <vector>
#include <string>

using namespace std;

namespace Wiring {
    int wires[1000];

    vector<IC*> plugs[1000];

    void set(int start, int n, int val) {
        for (int i = 0; i < n; i++) {
            wires[start + i] = val;
        }
    }

    void set(int start, string vals) {
        for (int i = 0; i < vals.size(); i++) {
            wires[start + i] = vals[i] == '1';
        }
    }
};