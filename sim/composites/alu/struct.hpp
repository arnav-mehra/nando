#pragma once

#include "../../wire/index.hpp"
#include "../register/impl.hpp"
#include "../multiplexer/impl.hpp"

#include "operations/adder/impl.hpp"
#include "operations/bitwise/impl.hpp"

#include <array>
#include <string>

using namespace std;

template<int N_BITS, int N_REGS>
struct ALU {
    REGISTER<N_BITS> ireg;        // instruction register. [i1|i2|o1|op]
    REGISTER<N_BITS> reg[N_REGS]; // general registers
    MUX m[2][N_BITS];             // input register read selection multiplexer

    ADDER<N_BITS>                adder;   // operation 0: addition
    BITWISE_OP<OP::NAND, N_BITS> bw_nand; // operation 1: bitwise nand
    BITWISE_OP<OP::XOR, N_BITS>  bw_xor;  // operation 2: bitwise xor
    BITWISE_OP<OP::AND, N_BITS>  bw_and;  // operation 2: bitwise and
    
    MUX m_op[N_BITS];
    DEMUX dm_op;
    GATE enable_gates[N_REGS];

    ALU();
    void init();
    void init(string ireg_str, array<string, N_REGS> reg_strs);
};