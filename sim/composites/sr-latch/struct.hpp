#pragma once

#include "../../wire/index.hpp"
#include "../../gate/struct.hpp"

struct SR_LATCH {
    GATE g[5];

    SR_LATCH();
    void init();
    void init(int en);
    void init(int en, int in);

    int get_en();
    int get_in();
    int get_out(int i);

    void print();
};