#pragma once

#include "struct.hpp"

SR_LATCH::SR_LATCH() {}

void SR_LATCH::init(int en, int in) {
    int in_neg = Wiring::reserve();
    g[0].init(OP::NAND, in, in, in_neg);

    int sr_in = Wiring::reserve(2);
    g[1].init(OP::AND, en, in,     sr_in);
    g[2].init(OP::AND, en, in_neg, sr_in + 1);

    int outs = Wiring::reserve(2);
    g[3].init(OP::NOR, sr_in,     outs + 1, outs);
    g[4].init(OP::NOR, sr_in + 1, outs, outs + 1);
}

void SR_LATCH::init(int en) {
    int in = Wiring::reserve();
    init(en, in);
}

void SR_LATCH::init() {
    int en = Wiring::reserve();
    int in = Wiring::reserve();
    init(en, in);
}

int SR_LATCH::get_en() {
    return g[1].in1;
}

int SR_LATCH::get_in() {
    return g[0].in1;
}

int SR_LATCH::get_out(int i) {
    return g[i + 3].out;
}

void SR_LATCH::print() {
    printf( "    ______        \n");
    printf("%d --\\     \\o- %d\n", Wiring::get(g[0].in1), Wiring::get(g[0].out));
    printf("%d --/_____/ |  \n", Wiring::get(g[0].in2)); 
    printf( "   |____    |    \n");
    printf( "    ____|___|     \n");
    printf( "   |    |___      \n");
    printf( "   |______  |     \n");
    printf("%d --\\     \\o- %d\n", Wiring::get(g[1].in2), Wiring::get(g[1].out));
    printf("%d --/_____/     \n\n", Wiring::get(g[1].in1));  
}