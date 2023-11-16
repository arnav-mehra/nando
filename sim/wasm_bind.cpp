#include "index.hpp"

#include <string>
#include <array>

using namespace std;

namespace WasmSim {
    GATE* gates;
    int reserved_gates;

    void add_gate() {
        gates[reserved_gates++].init(OP::NAND, 0, 0, 0);
    }

    void add_wire(string str) {
        
    }

    void import(int* gate_buff, int n_gates,
                int* wire_buff, int n_wires,
                int* pq_buff, int pq_size) {
        reserved_gates = n_gates;
        gates = (GATE*)gate_buff;

        Wiring::reserved = n_wires;
        Wiring::wires = (bool*)wire_buff;
        
        Scheduler::PQ_PAIR* sched_buff = (Scheduler::PQ_PAIR*)pq_buff;
        Scheduler::clear();
        for (int i; i < pq_size; i++) {
            Scheduler::pq.push(sched_buff[i]);
        }
    }

    void export(int* pq_buff, int* pq_size) {
        *pq_size = Scheduler::pq.size();

        Scheduler::PQ_PAIR* sched_buff = (Scheduler::PQ_PAIR*)pq_buff;
        int i = 0;
        while (Scheduler::pq.size()) {
            sched_buff[i++] = Scheduler::pq.top();
            Scheduler::pq.pop();
        }
        for (int i = 0; i < *pq_size; i++) {
            Scheduler::pq.push(sched_buff[i]);
        }
    }

    string next_iter() {
        Scheduler::runIncrement([](){});
        return Wiring::to_string();
    }
};

int main() {
}