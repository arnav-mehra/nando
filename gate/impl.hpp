#pragma once

#include "index.hpp"
#include "../wires/index.hpp"
#include "../scheduler/index.hpp"

using namespace std;

GATE::GATE(OP op, int in1, int in2, int out):
           op(op), in1(in1), in2(in2), out(out) {
    Wiring::plugs[in1].push_back(this);
    Wiring::plugs[in2].push_back(this);
    Wiring::plugs[out].push_back(this);

    Scheduler::addGate(this);
}

void GATE::run() {
    switch (op) {
        case OP::AND: {
            Wiring::set(out, Wiring::get(in1) & Wiring::get(in2));
            break;
        }
        case OP::OR: {
            Wiring::set(out, Wiring::get(in1) | Wiring::get(in2));
            break;
        }
        case OP::XOR: {
            Wiring::set(out, Wiring::get(in1) ^ Wiring::get(in2));
            break;
        }
        case OP::NAND: {
            Wiring::set(out, ~(Wiring::get(in1) & Wiring::get(in2)));
            break;
        }
        case OP::NOR: {
            Wiring::set(out, ~(Wiring::get(in1) | Wiring::get(in2)));
            break;
        }
    }

    // propogate if any outputs changed.
    if (Wiring::changed(out)) {
        prop();
    }
}

void GATE::prop() {
    for (GATE* gate : Wiring::plugs[out]) {
        Scheduler::addGate(gate);
    }
}

void GATE::print() {
    switch (op) {
        case OP::AND: {
            printf( "     _____       \n");
            printf("%d --|     \\-- %d\n", Wiring::get(in1), Wiring::get(out));
            printf("%d --|_____/    \n\n", Wiring::get(in2));
            return;
        }
        case OP::OR: {
            printf( "    ______        \n");
            printf("%d --\\     \\-- %d\n", Wiring::get(in1), Wiring::get(out));
            printf("%d --/_____/     \n\n", Wiring::get(in2));
            return;
        }
        case OP::NAND: {
            printf( "     _____       \n");
            printf("%d --|     \\o- %d\n", Wiring::get(in1), Wiring::get(out));
            printf("%d --|_____/    \n\n", Wiring::get(in2));
            return;
        }
        case OP::NOR: {
            printf( "    ______        \n");
            printf("%d --\\     \\o- %d\n", Wiring::get(in1), Wiring::get(out));
            printf("%d --/_____/     \n\n", Wiring::get(in2));
            return;
        }
        case OP::XOR: {
            printf( "     ______       \n");
            printf("%d --\\\\     \\__ %d\n", Wiring::get(in1), Wiring::get(out));
            printf("%d --//_____/    \n\n", Wiring::get(in2));
            return;
        }
    }
}