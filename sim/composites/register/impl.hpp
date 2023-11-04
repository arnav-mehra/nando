#pragma once

#include "struct.hpp"

#include <string>

template<int N_LATCHES>
REGISTER<N_LATCHES>::REGISTER() {}

template<int N_LATCHES>
void REGISTER<N_LATCHES>::init(string str) {
    for (int i = 0; i < N_LATCHES; i++) {
        SR_LATCH& latch = latches[i];
        latch.init();
    }
    for (int i = 0; i < N_LATCHES; i++) {
        SR_LATCH& latch = latches[i];
        int idx = latch.get_out(str[i] == '1' ? 1 : 0);
        Wiring::set(idx, 1);
    }
    Wiring::apply_updates();
}

template<int N_LATCHES>
void REGISTER<N_LATCHES>::init(int en, string str) {
    for (int i = 0; i < N_LATCHES; i++) {
        SR_LATCH& latch = latches[i];
        latch.init(en);
    }
    for (int i = 0; i < N_LATCHES; i++) {
        SR_LATCH& latch = latches[i];
        int idx = latch.get_out(str[i] == '1' ? 1 : 0);
        Wiring::set(idx, 1);
    }
    Wiring::apply_updates();
}

template<int N_LATCHES>
void REGISTER<N_LATCHES>::init(int en, int ins[N_LATCHES], string str) {
    for (int i = 0; i < N_LATCHES; i++) {
        SR_LATCH& latch = latches[i];
        latch.init(en, ins[i]);
    }
    for (int i = 0; i < N_LATCHES; i++) {
        SR_LATCH& latch = latches[i];
        int idx = latch.get_out(str[i] == '1' ? 1 : 0);
        Wiring::set(idx, 1);
    }
    Wiring::apply_updates();
}

template<int N_LATCHES>
int REGISTER<N_LATCHES>::get_out(int idx) {
    SR_LATCH& latch = latches[idx];
    return latch.get_out(1);
}

template<int N_LATCHES>
int REGISTER<N_LATCHES>::get_in(int idx) {
    SR_LATCH& latch = latches[idx];
    return latch.get_in();
}

template<int N_LATCHES>
int REGISTER<N_LATCHES>::get_en(int idx) {
    SR_LATCH& latch = latches[idx];
    return latch.get_en();
}

template<int N_LATCHES>
void REGISTER<N_LATCHES>::print() {
    for (int i = 0; i < N_LATCHES; i++) {
        int v = Wiring::get(get_out(i));
        cout << v;
    }
    cout << '\n';
}