#pragma once

#include "../sr-latch/struct.hpp"

template<int N_LATCHES>
struct REGISTER {
    SR_LATCH latches[N_LATCHES];

    REGISTER();
    void init(string str);
    void init(int en, string str);
    void init(int en, int ins[N_LATCHES], string str);

    int get_out(int i);
    int get_in(int i);
    int get_en(int i);
    void print();
};