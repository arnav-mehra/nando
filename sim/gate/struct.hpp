#pragma once

using namespace std;

enum OP {
    AND,
    OR,
    NAND,
    NOR,
    XOR
};

struct GATE {
    OP op;
    int in[2];
    int out;

    GATE() {}
    void init(OP op, int in1, int in2, int out);

    void run();
    void prop();
    void print();
};