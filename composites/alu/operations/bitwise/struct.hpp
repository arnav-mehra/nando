#pragma once

#include "../../../../gate/struct.hpp"

template<OP OP_TYPE, int N_BITS>
struct BITWISE_OP {
    GATE g[8];

    BITWISE_OP();
    void init(int ins1[N_BITS], int ins2[N_BITS]);

    int get_out(int i);
};