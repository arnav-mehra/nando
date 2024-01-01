# Description

I'm making a circuit sim. Why? Cuz I felt like it.

Originally, the idea was to create a C++ lib for circuit sim, then later on compile to WASM and create a Solid.js UI for creating circuits.

I might still do this, but have decided to proceed with a rudimentary JS runner that enables user-programmable gate logic. Replicating this programmability would require 
runtime compilation to WASM, which could be an iteresting project of its own. Plus, due to JS-WASM overhead, the JS runner would actually perform better for simpler circuits.

# UI Progression

Tools: Solid.js, IndexedDB. 

Features:
1. Circuit storage using IDB.
        Why: Need peristence, but don't want to spend on cloud resources, so we can simply store it on the user's device. Using the user's FS didn't seem clean in UX, so IDB was chosen.
        Includes: Download circuit JSON. Recently modified list. 
        To-Do: Page to manage all saved circuits. Circuit file upload/import.
        Maybe: Add Google Drive import/export (would be a pain tho).
2. Custom gate functions.
        Why: Rather than restricting users to a fixed set of gates, users can define any gate to most accurately represents their scenario (and improve performance).
        Includes: IDB storage. Management modal for CRUD w/ truth tables preview.
        Maybe: WASM compilation for C++ sim compatibility.
3. Circuit Builder.
        Why: Building a circuit in JSON is slow and boring.
        Includes: Pan/Zoom. Gate drag-drop. Object selection. Shift CMDs for basic ops. Gate io count and function editor. Vanilla JS impl for performance and avoiding solid.js anomalies.
        To-Do: Discrete coordinates. Multi-select. Copy and paste. Undo/redo.
        Maybe: Non-linear/parametric wire pathing. Automatic wire pathing.
4. Circuit Simulator.
        Why: It's the core of the project.
        Includes: Optimized JS Runner.
        To-Do: WASM Runner. State history for stepping.
5. More to be written.



# C++ Sim Progression

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
