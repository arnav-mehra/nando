#pragma once

#include "struct.hpp"

#include <iostream>
#include <string>

using namespace std;

ALU::ALU() {}

void ALU::init() {
    // init registers each with a enable

    int enable = Wiring::reserve(4);
    int ins = Wiring::reserve(8);
    int ins_arr[8] = {
        ins + 0, ins + 1, ins + 2, ins + 3,
        ins + 4, ins + 5, ins + 6, ins + 7, 
    };

    // ireg.init("10001111"); // i1 = 2, i2 = 0, o = 3, op = 3. r[3] = r[2] & r[0];
    ireg.init("00001000"); // r[2] = r[0] + r[0];
    reg[0].init(enable + 0, ins_arr, string("00010001"));
    reg[1].init(enable + 1, ins_arr, string("00100010"));
    reg[2].init(enable + 2, ins_arr, string("01000100"));
    reg[3].init(enable + 3, ins_arr, string("10001000"));

    // mount mux onto registers for input selection

    int pin1[2] = {
        ireg.get_out(0),
        ireg.get_out(1)
    };
    int pin2[2] = {
        ireg.get_out(2),
        ireg.get_out(3)
    };
    for (int i = 0; i < 8; i++) {
        int ins[4] = { 
            reg[0].get_out(i),
            reg[1].get_out(i),
            reg[2].get_out(i),
            reg[3].get_out(i)
        };
        m[0][i].init(ins, pin1);
        m[1][i].init(ins, pin2);
    }

    // prep io wires

    int ins1[8], ins2[8];
    for (int i = 0; i < 8; i++) {
        ins1[i] = m[0][i].get_out();
        ins2[i] = m[1][i].get_out();
    }

    // mount ops into alu

    for (int oi = 0; oi < 4; oi++) {
        switch (oi) {
            case 0: adder.init(ins1, ins2);   break;
            case 1: bw_nand.init(ins1, ins2); break;
            case 2: bw_xor.init(ins1, ins2);  break;
            case 3: bw_and.init(ins1, ins2);  break;
        }
    }

    // op outputs -> 1 output

    int outs[8];
    for (int i = 0; i < 8; i++) {
        int ins[4] = { 
            adder.get_out(i),
            bw_nand.get_out(i),
            bw_xor.get_out(i),
            bw_and.get_out(i)
        };
        int pin[2] = {
            ireg.get_out(6),
            ireg.get_out(7)
        };
        m_op[i].init(ins, pin, ins_arr[i]);
    }

    // determine write enable

    {
        int ins[2] = {
            ireg.get_out(4),
            ireg.get_out(5)
        };
        dm_op.init(ins);
    }

    // mount enable logic

    for (int i = 0; i < 4; i++) {
        REGISTER<8>& r = reg[i];
        int is_sel = dm_op.get_out(i);
        enable_gates[i].init(OP::AND, is_sel, is_sel, enable + i);
    }
}