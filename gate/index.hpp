#pragma once

#define VCC 1
#define GND 0

enum OP {
    AND,
    OR,
    NAND,
    NOR,
    XOR
};

struct GATE {
    OP op;
    int in1, in2, out;

    GATE(OP op, int in1, int in2, int out);

    void run();
    void prop();
    void print();
};