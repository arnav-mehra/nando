#include "index.hpp"

#include <string>
#include <array>

using namespace std;

namespace Gates {
    array<GATE, 1000> gates;
    int reserved = 0;

    void add(OP op, int in1, int in2, int out) {
        gates[reserved++].init(
            op, in1, in2, out
        );
    }
};

OP getOP(string &str, int &i) {
    if (str[i] == 'N' && str[i + 1] == 'A') {
        i += 5;
        return OP::NAND;
    }
}

int getInt(string& str, int& i) {
    int n = 0;
    while (i < str.size() && str[i] != ',' && str[i] != '|') {
        int t = str[i] - '0';
        n += t;
        n *= 10;
        i++;
    }
    return n;
}

struct JsGate {
    OP op;
    vector<int> pin_wires[3];

    JsGate() {}
};

void init_circuit(string str) {
    Gates::reserved = 0;
    Wiring::reserved = 0;
    
    int i = 0;

    while (i != str.size()) {
        JsGate js;
        js.op = getOP(str, i);

        for (int it = 0; it < 3; it++) {
            vector<int> &v = js.pin_wires[it];

            while (true) {
                int n = getInt(str, i);
                v.push_back(n);
                i++;
                
                if (str[i - 1] == ';' && str[i - 1] == '|') {
                    break;
                }
            }
        }
    }
}

int main() {
    init_circuit("NAND|1|0|2;NAND|0|1,2|");
}