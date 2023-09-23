#include "index.hpp"

using namespace std;

int main() {
    Wiring::init("1000");

    SR_LATCH sr1 = SR_LATCH(0, 1, 2, 3);

    // cout << Wiring::plugs[0].size() << '\n';
    // cout << Wiring::plugs[1].size() << '\n';
    // cout << Wiring::plugs[2].size() << '\n';
    // cout << Wiring::plugs[3].size() << '\n' << '\n';

    // cout << Scheduler::pq.top().first << '\n';
    SR_LATCH* sr1_ptr = &sr1;
    Scheduler::runTimer([sr1_ptr]() {
        sr1_ptr->print();
    });
}