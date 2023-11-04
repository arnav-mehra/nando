#include "index.hpp"

#include <string>

using namespace std;

int main() {
    ALU<16, 4> alu;
    alu.init(
        "1000110000000000", // i1 = 2, i2 = 0, o = 3, op = 3. r[3] = r[2] + r[0];
        {
            "0001000100000000",
            "0010001000000000",
            "0100010000000000",
            "1000100000000000"
        }
    );

    cout << "\nREG:\n";
    for (int i = 0; i < 4; i++) {
        cout << i << ": ";
        alu.reg[i].print();
    }
    cout << '\n';

    Scheduler::run([](){});

    cout << "\nREG:\n";
    for (int i = 0; i < 4; i++) {
        cout << i << ": ";
        alu.reg[i].print();
    }
}