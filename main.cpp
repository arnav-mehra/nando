#include "index.hpp"

using namespace std;

int main() {
    Wiring::init("1000");

    GATE g1 = GATE(
        OP::NOR,
        0, 1, 2
    );
    GATE g2 = GATE(
        OP::NOR,
        3, 2, 1
    );

    GATE* g1_ptr = &g1;
    GATE* g2_ptr = &g2;
    Scheduler::runTimer([g1_ptr, g2_ptr]() {
        g1_ptr->print();
        g2_ptr->print();
    });
}