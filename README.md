# Description

I'm making a circuit sim. Why? Cuz I felt like it.
Prob gonna start it out as a lib, then later on compile to WASM and create a UI for creating circuits.

# Progression

## Part 1: The Basics
    1. wires: hold temporary digital states.
    2. gates: take values of 2 wires, runs logic, outputs it to a 3rd wire.
    3. write buffering: write gate updates to a temp buffer, then write all wires updates at once. (avoiding dirty reads)
    4. propagation: map input wires to gates to identify gates that could be affected by output wire change.
    5. scheduling: add all affected gates to a min priority queue with T + 1 priority. Run all gates at T = 0, then run gates in order of T until circuit stabilizes.

## Part 2: The ALU
    6. sr-latches: store durable digital states. modifiable via set, reset, and enable.
    7. registers: store 8 bits durably, have 4 for data (reg[4]) and 1 for instruction (ireg, i1|i2|o1|op).
    8. operations: define 8-bit addition, bitwise, etc. operations.
    9. multiplexer: select a bit from 4 options based on 2-bit input.
    10. 8-bit multiplexers:
        - select registers for alu operations based on instruction's i1 and i2.
        - select alu operation output based on instruction's opcode.
    11. demultiplexer: direct a bit to 4 options based on 2-bit input.
    12. 8-bit demultiplexer: direct selected alu result to 1 of 4 registers based on instruction's o1.
    13. alu: put everything described above together.

[progress pointer]

## Part 3: The Program
    13. clock: determine when alu is done and write-back occurs. add clock to enable condition for writing to register.
    14. counter: counts up in binary to point to next instruction after each clock tick.
    15. branching?
    16. write a program?
    17. TBD
