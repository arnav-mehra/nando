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

    GATE() {}
    GATE(OP op, int in1, int in2, int out);

    void run();
    void prop();
    void print();
};

struct SR_LATCH {
    GATE g1;
    GATE g2;

    SR_LATCH() {}
    SR_LATCH(int in1, int in2, int out1, int out2);

    void print();
};