import { For, createMemo, createSignal } from 'solid-js';
import Gate from './Gate';
import Wire from './Wire';
import { feed_wasm, init_wasm } from '../storage/conversion';

const Canvas = ({
    circuit,
    setCircuit,
    circuitOps
}) => {
    const [ center, setCenter ] = createSignal([ 0, 0 ]);
    const [ zoom, setZoom ] = createSignal(1);

    const [ mouseDown, setMouseDown ] = createSignal(false);
    
    const [ selectedPin, setSelectedPin ] = createSignal(null);
    const [ selectedGate, setSelectedGate ] = createSignal(-1);
    const [ selectedWire, setSelectedWire ] = createSignal(-1);

    const gates = createMemo(() => circuit().data.gates);
    const wires = createMemo(() => circuit().data.wires);

    const transform = {
        to_delta: ([ dx, dy ]) => {
            const ndx = dx * zoom();
            const ndy = dy * zoom();
            return [ ndx, ndy ];
        },
        to_coord: ([x, y]) => {
            const nx = x * zoom() + center()[0];
            const ny = y * zoom() + center()[1];
            return [ nx, ny ];
        },
        from_coord: ([x, y]) => {
            const nx = (x - center()[0]) / zoom();
            const ny = (y - center()[1]) / zoom();
            return [ nx, ny ];
        }
    };

    const onPinClick = (gate, pin) => {
        // select wire
        if (!selectedPin()) {
            setSelectedPin({ gate, pin });
            return;
        }

        // wire already exists, reset
        const same_pin = gate == selectedPin().gate && pin == selectedPin().pin
        const out_to_out = selectedPin().pin == 2 && pin == 2
        
        if (!same_pin && out_to_out) {
            alert("You cannot connect outputs to each other.");
        }
        if (same_pin || out_to_out) {
            setSelectedPin(null);
            return;
        }
        
        // create new wire & reset
        circuitOps.addWire({
            from: selectedPin(),
            to: { gate, pin },
            value: 0
        })
        setSelectedPin(null);
    };

    const onKeyPress = (key) => {
        console.log({key});

        switch (key) {
            case 'd': { // delete
                const selGate = selectedGate()
                const selWire = selectedWire()
                setSelectedGate(-1)
                setSelectedWire(-1)

                if (selGate != -1) {
                    circuitOps.deleteGate(selGate);
                }
                else if (selWire != -1) {
                    circuitOps.deleteWire(selWire);
                }
                break;
            }
            case 'p': { // play/pause
                console.log(init_wasm(circuit().data.gates))
                console.log(feed_wasm(circuit().data.wires))
                break;
            }
            case 's': { // save
                circuitOps.save();
                break;
            }
            case 'i': { // info
                console.log(circuit());
                break;
            }
        }
    }

    return (
        <div
            tabIndex={0}
            onKeyPress={e => onKeyPress(e.key)}
            onMouseDown={_ => setMouseDown(true)}
            onMouseUp={_ => setMouseDown(false)}
            onMouseMove={e => {
                if (mouseDown()) {
                    const [ x, y ] = center();
                    setCenter([
                        x + e.movementX,
                        y + e.movementY
                    ])
                }
            }}
            onWheel={e => {
                const d = e.deltaY;
                const nz = zoom() + (d / 1000);
                setZoom(nz)
            }}

            style={{
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                cursor: "grab"
            }}
        >
            <For each={gates()}>
                {(g, i) => {
                    const gate = createMemo(() => circuit().data.gates[i()])
                    const relSelectedPin = createMemo(() => (i() == selectedPin()?.gate) ? selectedPin().pin : -1)
                    const isSelected = createMemo(() => selectedGate() == i())
                    const setSelected = () => {
                        setSelectedGate(isSelected() ? -1 : i())
                        if (isSelected()) {
                            setSelectedWire(-1);
                        }
                    }

                    return (
                        <>
                            {gate() &&
                                <Gate
                                    gate={gate}
                                    transform={transform}
                                    zoom={zoom}
                                    setPosition={(pos) => {
                                        const copy = { ...circuit() }
                                        copy.data.gates[i()] = {
                                            ...copy.data.gates[i()],
                                            position: pos
                                        }
                                        setCircuit(copy)
                                    }}
                                    onPinClick={(pin) => onPinClick(i(), pin)}
                                    selectedPin={relSelectedPin}
                                    isSelected={isSelected}
                                    setSelected={setSelected}
                                />
                            }
                        </>
                    )
                }}
            </For>

            <For each={wires()}>
                {(w, i) => {
                    const wire = createMemo(() => circuit().data.wires[i()])
                    const isSelected = createMemo(() => selectedWire() == i())
                    const setSelected = () => {
                        setSelectedWire(isSelected() ? -1 : i())
                        if (isSelected()) {
                            setSelectedGate(-1);
                        }
                    }

                    return (
                        <>
                            {wire() &&
                                <Wire
                                    wire={wire}
                                    transform={transform}
                                    circuit={circuit}
                                    isSelected={isSelected}
                                    setSelected={setSelected}
                                />
                            }
                        </>
                        
                    )
                }}
            </For>
        </div>
    );
};

export default Canvas;