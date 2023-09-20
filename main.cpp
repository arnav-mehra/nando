#include <unordered_map>
#include <vector>
#include <queue>

using namespace std;

#define VCC 1
#define GND 0

enum OP {
    AND,
    OR,
    NAND
};

struct IC {
    OP op;
    int* vcc;
    int* gnd;

    IC(
        OP op,
        int& vcc,
        int& gnd,
        int& ins1,
        int& ins2,
        int& outs1
    ) : op(op), vcc(&vcc), gnd(&gnd) {

    }

    int* ins;
    int* outs;

    void run();
    void prop();
};

int wires[1000];

unordered_map<int*, vector<IC*>> plugs;

void IC::run() {
    if (*vcc != 1 && *gnd != 0) {
        // throw err, undefined behavior
        return;
    }

    switch (op) {
        case OP::AND: {
            for (int i = 0; i < 6; i += 2) {
                outs[i] = ins[i] & ins[i + 1];
            }
            return;
        }
        case OP::OR: {
            for (int i = 0; i < 6; i += 2) {
                outs[i] = ins[i] | ins[i + 1];
            }
            return;
        }
        case OP::NAND: {
            for (int i = 0; i < 6; i += 2) {
                outs[i] = ~(ins[i] & ins[i + 1]);
            }
            return;
        }
    }

    prop();
}

void IC::prop() {
    for (int i = 0; i < 3; i++) {
        int* o = &outs[i];
        if (plugs.find(o) != plugs.end()) {
            for (IC* ic : plugs[o]) {
                ic->run();
            }
        }
    }
}

priority_queue<int, IC> pq;

int main() {
    wires[0] = VCC;
    wires[1] = GND;
    
    IC ic = {
        OP::AND,
        &wires[0],
        &wires[1],

    };
    
    pq
}