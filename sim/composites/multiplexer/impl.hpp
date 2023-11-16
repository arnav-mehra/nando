#pragma once

#include "struct.hpp"

MUX::MUX() {}

void MUX::init(int i[4], int p[2], int o) {
    int np = Wiring::reserve(2);
    g[0].init(OP::NAND, p[0], p[0], np + 0);
    g[1].init(OP::NAND, p[1], p[1], np + 1);

    int np0_np1 = Wiring::reserve();
    int np0_p1  = Wiring::reserve();
    int p0_np1  = Wiring::reserve();
    int p0_p1   = Wiring::reserve();
    g[2].init(OP::AND, np + 0, np + 1, np0_np1);
    g[3].init(OP::AND, np + 0, p[1],   np0_p1);
    g[4].init(OP::AND, p[0],   np + 1, p0_np1);
    g[5].init(OP::AND, p[0],   p[1],   p0_p1);

    int oi = Wiring::reserve(4);
    g[6].init(OP::AND, i[0], np0_np1, oi + 0);
    g[7].init(OP::AND, i[1], np0_p1,  oi + 1);
    g[8].init(OP::AND, i[2], p0_np1,  oi + 2);
    g[9].init(OP::AND, i[3], p0_p1,   oi + 3);

    int t = Wiring::reserve(2);
    g[10].init(OP::OR, oi + 0, oi + 1, t + 0);
    g[11].init(OP::OR, oi + 2, oi + 3, t + 1);
    g[12].init(OP::OR, t + 0, t + 1, o);
}

void MUX::init(int i[4], int p[2]) {
    int o = Wiring::reserve();
    init(i, p, o);
}

int MUX::get_out() {
    return g[12].out;
}

void MUX::print() {
    printf("    _____  \n");
    printf(" %d-|     |\n",     Wiring::get(g[6].in[0]));
    printf(" %d-| MUX |- %d\n", Wiring::get(g[7].in[0]), Wiring::get(g[12].out));
    printf(" %d-|     |\n",     Wiring::get(g[8].in[0]));
    printf(" %d-|_v_v_|\n",     Wiring::get(g[9].in[0]));
    printf("     %d %d \n",     Wiring::get(g[0].in[0]), Wiring::get(g[1].in[0]));
}

DEMUX::DEMUX() {}

void DEMUX::init(int i[2]) {
    int niw = Wiring::reserve(2);
    int ni[2] = { niw, niw + 1 };
    g[0].init(OP::NAND, i[0], i[0], ni[0]);
    g[1].init(OP::NAND, i[1], i[1], ni[1]);

    int o = Wiring::reserve(4);
    g[2].init(OP::AND, ni[0], ni[1], o + 0);
    g[3].init(OP::AND, ni[0],  i[1], o + 1);
    g[4].init(OP::AND,  i[0], ni[1], o + 2);
    g[5].init(OP::AND,  i[0],  i[1], o + 3);
}

int DEMUX::get_out(int i) {
    return g[i + 2].out;
}

void DEMUX::print() {
    printf(" _____    \n");
    printf("|     |-%d\n", Wiring::get(g[2].out));
    printf("|DEMUX|-%d\n", Wiring::get(g[3].out));
    printf("|     |-%d\n", Wiring::get(g[4].out));
    printf("|_v_v_|-%d\n", Wiring::get(g[5].out));
    printf("  %d %d   \n", Wiring::get(g[0].in[0]), Wiring::get(g[1].in[0]));
}