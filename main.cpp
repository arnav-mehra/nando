#include "index.hpp"

#include <string>

using namespace std;

int main() {
    ALU alu;
    alu.init();

    Wiring::print_usage();

    cout << "\nREG:\n";

    for (int i = 0; i < 4; i++) {
        cout << i << ": ";
        alu.reg[i].print();
    }

    cout << '\n';

    Scheduler::run([](){});

    cout << "\nIO:\n";
    cout << "i1: "; 
    for (int i = 0; i < 8; i++)
        cout << Wiring::get(alu.m[0][i].get_out());
    cout << '\n';
    cout << "i2: "; 
    for (int i = 0; i < 8; i++)
        cout << Wiring::get(alu.m[1][i].get_out());
    cout << '\n';

    cout << "\nALU Results:\n";
    cout << "0: ";
    Wiring::print(alu.adder.get_out(0), 8);
    cout << "1: ";
    Wiring::print(alu.bw_nand.get_out(0), 8);
    cout << "2: ";
    Wiring::print(alu.bw_xor.get_out(0), 8);
    cout << "3: ";
    Wiring::print(alu.bw_and.get_out(0), 8);
    cout << "r: ";
    for (int i = 0; i < 8; i++)
        cout << Wiring::get(alu.m_op[i].get_out());
    cout << '\n';

    cout << "\nENABLE:\n";

    alu.dm_op.print();

    for (int i = 0; i < 4; i++)
        cout << Wiring::get(alu.enable_gates[i].out);
    cout << '\n';    

    cout << "\nREG:\n";

    for (int i = 0; i < 4; i++) {
        cout << i << ": ";
        alu.reg[i].print();
    }
}