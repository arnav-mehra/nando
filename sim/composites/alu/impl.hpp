#pragma once

#include "struct.hpp"

#include <iostream>
#include <string>
#include <array>

using namespace std;

template<int N_BITS, int N_REGS>
ALU<N_BITS, N_REGS>::ALU() {}

template<int N_BITS, int N_REGS>
void ALU<N_BITS, N_REGS>::init() {
    init(
        "10001111",
        { // i1 = 2, i2 = 0, o = 3, op = 3. r[3] = r[2] & r[0];
            "00010001",
            "00100010",
            "01000100",
            "10001000"
        }
    );
}

template<int N_BITS, int N_REGS>
void ALU<N_BITS, N_REGS>::init(string ireg_str, array<string, N_REGS> reg_strs) {
    // init registers each with a enable

    int enable = Wiring::reserve(N_REGS);
    int ins = Wiring::reserve(N_BITS);
    
    int ins_arr[N_BITS];
    for (int i = 0; i < N_BITS; i++) {
        ins_arr[i] = ins + i;
    };

    ireg.init(ireg_str);
    for (int r = 0; r < N_REGS; r++) {
        reg[r].init(enable + r, ins_arr, reg_strs[r]);
    }

    // mount mux onto registers for input selection

    int pin1[2] = {
        ireg.get_out(0),
        ireg.get_out(1)
    };
    int pin2[2] = {
        ireg.get_out(2),
        ireg.get_out(3)
    };
    for (int i = 0; i < N_BITS; i++) {
        int ins[N_REGS];
        for (int r = 0; r < N_REGS; r++) { 
            ins[r] = reg[r].get_out(i);
        }
        m[0][i].init(ins, pin1);
        m[1][i].init(ins, pin2);
    }

    // prep io wires

    int ins1[N_BITS], ins2[N_BITS];
    for (int i = 0; i < N_BITS; i++) {
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

    // op outputs -> 1 output (shared register input)

    int outs[N_BITS];
    for (int i = 0; i < N_BITS; i++) {
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

    for (int i = 0; i < N_REGS; i++) {
        REGISTER<N_BITS>& r = reg[i];
        int is_sel = dm_op.get_out(i);
        enable_gates[i].init(OP::AND, is_sel, is_sel, enable + i);
    }
}