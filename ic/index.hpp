#pragma once

#define VCC 1
#define GND 0

enum OP {
    AND,
    OR,
    NAND
};

struct IC {
    OP op;
    int* vcc;
    int* gnd;
    int* ins;
    int* outs;

    IC(OP op, int& vcc, int& gnd, int& ins, int& outs);

    void run();
    void prop();
    void print();
};