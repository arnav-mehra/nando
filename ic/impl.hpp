#pragma once

#include "index.hpp"
#include "../wires/index.hpp"
#include "../scheduler/index.hpp"

using namespace std;

IC::IC(OP op, int& vcc, int& gnd, int& ins, int& outs):
       op(op), vcc(&vcc), gnd(&gnd), ins(&ins), outs(&outs) {

    switch (op) {
        case OP::AND:
        case OP::OR:
        case OP::NAND: {
            for (int i = 0; i < 6; i++) {
                int* ptr = &this->ins[i];
                int idx = (ptr - (int*)Wiring::wires) / sizeof(int);
                Wiring::plugs[idx].push_back(this);
            }
            break;
        }
    }

    Scheduler::addIC(this);
}

void IC::run() {
    if (*vcc != 1 && *gnd != 0) {
        // throw err, undefined behavior
        return;
    }

    switch (op) {
        case OP::AND: {
            for (int i = 0; i < 3; i++) {
                outs[i] = ins[2 * i] & ins[2 * i + 1];
            }
            return;
        }
        case OP::OR: {
            for (int i = 0; i < 3; i++) {
                outs[i] = ins[2 * i] | ins[2 * i + 1];
            }
            return;
        }
        case OP::NAND: {
            for (int i = 0; i < 3; i++) {
                outs[i] = ~(ins[2 * i] & ins[2 * i + 1]);
            }
            return;
        }
    }

    prop();
}

void IC::prop() {
    for (int i = 0; i < 3; i++) {
        int* o = &outs[i];
        int idx = (o - (int*)Wiring::wires) / sizeof(int);
        for (IC* ic : Wiring::plugs[idx]) {
            Scheduler::addIC(ic);
        }
    }
}

void IC::print() {
    switch (op) {
        case OP::AND:
        case OP::OR:
        case OP::NAND: {
            cout << "------------\n";
            for (int i = 0; i < 3; i++) {
                cout << "| " << ins[2 * i]
                     << ' ' << ins[2 * i + 1]
                     << " -> "<< outs[i]
                     << " |\n";
            }
            cout << "------------\n";
            return;
        }
    }
}
