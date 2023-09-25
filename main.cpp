#include "index.hpp"

#include <string>

using namespace std;

int main() {
    ALU alu;
    alu.init(
        "10001100", // i1 = 2, i2 = 0, o = 3, op = 3. r[3] = r[2] + r[0];
        {
            "00010001",
            "00100010",
            "01000100",
            "10001000"
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