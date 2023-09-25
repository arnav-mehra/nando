#pragma once

#include "struct.hpp"

template<int N_BITS>
ADDER<N_BITS>::ADDER() {}

template<int N_BITS>
void ADDER<N_BITS>::init(int ins1[N_BITS], int ins2[N_BITS]) {
    int outs = Wiring::reserve(N_BITS);
    int c = Wiring::reserve(N_BITS - 1);
    int i = N_BITS - 1;
    int ig = 0;

    g[ig++].init(OP::XOR, ins1[i], ins2[i], outs + i);
    g[ig++].init(OP::AND, ins1[i], ins2[i], c++);
    i--;

    for (; i >= 1; i--) {
        int t = Wiring::reserve(4);
        g[ig++].init(OP::XOR, ins1[i], ins2[i], t);
        g[ig++].init(OP::XOR, t, c - 1, outs + i);

        g[ig++].init(OP::AND, ins1[i], ins2[i], t + 1);
        g[ig++].init(OP::OR, ins1[i], ins2[i], t + 2);
        g[ig++].init(OP::AND, c - 1, t + 2, t + 3);
        g[ig++].init(OP::OR, t + 1, t + 3, c++);
    }

    int t = Wiring::reserve();
    g[ig++].init(OP::XOR, ins1[i], ins2[i], t);
    g[ig++].init(OP::XOR, t, c - 1, outs + i);
}

template<int N_BITS>
int ADDER<N_BITS>::get_out(int i) {
    return g[6 * N_BITS - 9].out + i;
}