#pragma once

#include "../../wire/index.hpp"
#include "../register/impl.hpp"
#include "../multiplexer/impl.hpp"

#include "operations/adder/impl.hpp"
#include "operations/bitwise/impl.hpp"

struct ALU {
    REGISTER<8> ireg;   // instruction register. [i1|i2|o1|op]
    REGISTER<8> reg[4]; // general registers
    MUX m[2][8];        // input register read selection multiplexer

    ADDER<8>                adder;   // operation 0: addition
    BITWISE_OP<OP::NAND, 8> bw_nand; // operation 1: bitwise nand
    BITWISE_OP<OP::XOR, 8>  bw_xor;  // operation 2: bitwise xor
    BITWISE_OP<OP::AND, 8>  bw_and;  // operation 2: bitwise and
    
    MUX m_op[8];
    DEMUX dm_op;
    GATE enable_gates[4];

    ALU();
    void init();
};