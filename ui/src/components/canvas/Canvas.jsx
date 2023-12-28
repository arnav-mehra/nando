import { For, createMemo, createSignal } from 'solid-js';
import { LiveCircuit, LiveActions } from '../../script/stores/live_circuit';
import Gate from './Gate';
import Wire from './Wire';

const Canvas = () => {
    const [ mouseDown, setMouseDown ] = createSignal(false);
    const [ center, setCenter ] = createSignal([ 0, 0 ]);
    const [ zoom, setZoom ] = createSignal(1);

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

    const actions = {
        keyPress: e => LiveActions.command(e.key),

        mouseDown: _ => setMouseDown(true),
        mouseUp: _ => setMouseDown(false),
        mouseMove: e => {
            if (mouseDown()) {
                const [ x, y ] = center();
                setCenter([
                    x + e.movementX,
                    y + e.movementY
                ])
                console.log(center())
            }
        },

        wheelMove: e => {
            const d = e.deltaY;
            const nz = zoom() + (d / 1000);
            setZoom(nz);
        }
    }

    return (
        <div
            class="h-screen w-screen overflow-hidden cursor-grab relative"
            tabIndex={0}
            onKeyPress={actions.keyPress}
            onMouseDown={actions.mouseDown}
            onMouseUp={actions.mouseUp}
            onMouseMove={actions.mouseMove}
            onWheel={actions.wheelMove}
        >
            <div
                class="w-screen h-screen absolute overflow-hidden"
                style={{
                    transform: `
                        translate(${center()[0]}px, ${center()[1]}px)
                        scale(${zoom()})
                    `
                }}
            >
                <For each={LiveCircuit.gateIds.get()}>
                    {id => (
                        <Gate
                            id={id}
                            transform={transform}
                        />
                    )}
                </For>
                <For each={LiveCircuit.wireIds.get()}>
                    {id => (
                        <Wire
                            id={id}
                            transform={transform}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

export default Canvas;