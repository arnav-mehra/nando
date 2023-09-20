#include "index.hpp"

using namespace std;

int main() {
    Wiring::set(0, 1, VCC);
    Wiring::set(1, 1, GND);
    Wiring::set(2, "000111");

    IC ic = IC(
        OP::OR,
        Wiring::wires[0], Wiring::wires[1],
        Wiring::wires[2], Wiring::wires[8]
    );

    IC* ic_ptr = &ic;
    Scheduler::runTimer([ic_ptr]() {
        ic_ptr->print();
    });
}