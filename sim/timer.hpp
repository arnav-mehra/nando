#include <chrono>
#include <iostream>
#include <functional>

using namespace std;
using chrono::high_resolution_clock;
using chrono::duration;
using chrono::duration_cast;
using chrono::milliseconds;

void time_fn(function<void(void)> fn) {
    auto t1 = high_resolution_clock::now();
    fn();
    auto t2 = high_resolution_clock::now();
    auto ms_int = duration_cast<milliseconds>(t2 - t1);
    cout << ms_int.count() << "ms\n";
}