#pragma once

#include "../gate/struct.hpp"

#include <vector>
#include <string>
#include <iostream>

using namespace std;

namespace Wiring {
    constexpr int N_WIRES = 1000;

    int reserved = 0;

    bool wires_arr[N_WIRES] = {};
    bool* wires = wires_arr;
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

    // RESERVE

    int reserve() {
        return reserved++;
    }

    int reserve(int n) {
        int temp = reserved;
        reserved += n;
        return temp;
    }

    int reserve(int n, int val) {
        int res = reserved;
        for (int i = 0; i < n; i++) {
            updates[reserved++] = val;
        }
        apply_updates();
        return res;
    }

    int reserve(string vals) {
        int res = reserved;
        for (int i = 0; i < vals.size(); i++) {
            if (vals[i] == '_') continue;
            updates[reserved++] = vals[i] == '1' ? 1
                                : vals[i] == '0' ? 0
                                : rand() % 2;
        }
        apply_updates();
        return res;
    }

    // PRINT

    void print(int start, int n) {
        for (int i = 0; i < n; i++) {
            cout << wires[i + start]; 
        }
        cout << '\n';
    }

    void print_usage() {
        cout << "WIRE USAGE: " << Wiring::reserved
                      << " / " << Wiring::N_WIRES << '\n';
    }

    string to_string() {
        char ch[1000];
        for (int i = 0; i < reserved; i++) {
            ch[i] = Wiring::get(i) ? '1' : '0';
        }
        return string(ch);
    }
};