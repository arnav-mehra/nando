#pragma once

#include "../wire/index.hpp"
#include "../scheduler/index.hpp"
#include "struct.hpp"

#include <iostream>

using namespace std;

void GATE::init(OP op, int in1, int in2, int out) {
    this->op = op;
    this->in1 = in1;
    this->in2 = in2;
    this->out = out;

    Wiring::plugs[in1].push_back(this);
    Wiring::plugs[in2].push_back(this);

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
            Wiring::set(out, !(Wiring::get(in1) & Wiring::get(in2)));
            break;
        }
        case OP::NOR: {
            Wiring::set(out, !(Wiring::get(in1) | Wiring::get(in2)));
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