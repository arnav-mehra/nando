#pragma once

#include "struct.hpp"

template<OP OP_TYPE, int N_BITS>
BITWISE_OP<OP_TYPE, N_BITS>::BITWISE_OP() {}

template<OP OP_TYPE, int N_BITS>
void BITWISE_OP<OP_TYPE, N_BITS>::init(int ins1[N_BITS], int ins2[N_BITS]) {
    int outs = Wiring::reserve(N_BITS);
    for (int i = 0; i < 8; i++) {
        g[i].init(OP_TYPE, ins1[i], ins2[i], outs + i);
    }
}

template<OP OP_TYPE, int N_BITS>
int BITWISE_OP<OP_TYPE, N_BITS>::get_out(int i) {
    return g[i].out;
}