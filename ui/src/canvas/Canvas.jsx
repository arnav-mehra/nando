import { For, createMemo, createSignal } from 'solid-js';
import Gate from './Gate';
import Wire from './Wire';

const Canvas = ({
    circuit,
    setCircuit
}) => {
    const [ center, setCenter ] = createSignal([ 0, 0 ]);
    const [ zoom, setZoom ] = createSignal(1);
    const [ mouseDown, setMouseDown ] = createSignal(false);
    const [ wireStart, setWireStart ] = createSignal(null);
    
    const gates = createMemo(() => circuit().data.gates)
    const wires = createMemo(() => circuit().data.wires)

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
    }

    const onPinClick = (gate, pin) => {
        // select wire
        if (!wireStart()) {
            setWireStart({ gate, pin });
            return;
        }

        const newWire = {
            from: wireStart(),
            to: { gate, pin },
            value: 0
        }
        const fromPin = gates()[wireStart().gate].pins[wireStart().pin]
        const toPin = gates()[gate].pins[pin]

        // wire already exists, reset
        const to_from_same = gate == wireStart().gate && pin == wireStart().pin
        const to_from_dup = fromPin.wire != -1 && fromPin.wire == toPin.wire
        if (to_from_same || to_from_dup) {
            setWireStart(null);
            return;
        }
        
        // create new wire & reset
        const copy = { ...circuit() }
        copy.data.wires = [ ...copy.data.wires, newWire ]
        const newWireNum = copy.data.wires.length - 1;
        fromPin.wire = newWireNum;
        toPin.wire = newWireNum;
        setCircuit(copy)
        setWireStart(null);
    }

    return (
        <div
            // onMouseDown={_ => setMouseDown(true)}
            // onMouseUp={_ => setMouseDown(false)}
            // onMouseMove={e => {
            //     if (mouseDown()) {
            //         const [ x, y ] = center();
            //         setCenter([
            //             x + e.movementX,
            //             y + e.movementY
            //         ])
            //     }
            // }}
            // onWheel={e => {
            //     const d = e.deltaY;
            //     const nz = zoom() + (d / 1000);
            //     setZoom(nz)
            // }}

            style={{
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                cursor: mouseDown() ? "grabbing" : "grab"
            }}
        >
            <For each={gates()}>
                {(g, i) => {
                    const gate = createMemo(() => circuit().data.gates[i()])
                    return (
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
                        />
                    )
                }}
            </For>

            <For each={wires()}>
                {(w, i) => {
                    const wire = createMemo(() => circuit().data.wires[i()])
                    return (
                        <Wire
                            wire={wire}
                            transform={transform}
                            circuit={circuit}
                        />
                    )
                }}
            </For>
        </div>
    )
}

export default Canvas