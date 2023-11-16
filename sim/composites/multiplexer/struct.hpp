#pragma once

#include "../../gate/struct.hpp"
#include "../../wire/index.hpp"

template<int N_SELECT>
struct MUX {
    GATE g[13];

    MUX();
    void init(int i[4], int p[2]);
    void init(int i[4], int p[2], int o);

    int get_out();
    void print();
};

template<int N_SELECT>
struct DEMUX {
    GATE g[6];

    DEMUX();
    void init(int i[2]);

    int get_out(int i);
    void print();
};