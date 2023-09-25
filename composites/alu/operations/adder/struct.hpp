#pragma once

#include "../../../../gate/impl.hpp"

template<int N_BITS>
struct ADDER {
    GATE g[6 * N_BITS - 8];
    
    ADDER();
    void init(int ins1[N_BITS], int ins2[N_BITS]);

    int get_out(int i);
};