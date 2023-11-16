#include "index.hpp"

#include <string>
#include <array>

using namespace std;

namespace WasmSim {
    GATE* gates;
    int reserved_gates;

    void add_gate() {
        GATE& g = gates[reserved_gates++];
        g.op = OP::NAND;
        g.out = Wiring::reserve();
    }

    void add_wire(int from_gate_idx, int to_gate_idx, int to_pin_idx) {
        GATE& from_gate = gates[from_gate_idx];
        GATE& to_gate = gates[to_gate_idx];

        int& from_pin = to_gate.in[to_pin_idx];
        int& to_pin = from_gate.out;
        from_pin = to_pin;

        Wiring::plugs[from_pin].push_back(&to_gate);
    }

    void import(int* gate_buff, int n_gates,
                int* wire_buff, int n_wires,
                int* pq_buff, int pq_size) {
        reserved_gates = n_gates;
        gates = (GATE*)gate_buff;

        Wiring::reserved = n_wires;
        Wiring::wires = (bool*)wire_buff;

        Scheduler::pq = (Scheduler::PQ_ENTRY*)pq_buff;
        Scheduler::pq_size = pq_size;
    }

    string next_iter() {
        Scheduler::runIncrement([](){});
        return Wiring::to_string();
    }
};