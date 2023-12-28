import { For, createMemo, createSignal } from 'solid-js';
import { LiveCircuit, LiveActions } from '../../script/stores/live_circuit';
import Gate from './Gate';
import Wire from './Wire';

const Canvas = () => {
    const [ mouseDown, setMouseDown ] = createSignal(false);
    const [ center, setCenter ] = createSignal([ 0, 0 ]);
    const [ zoom, setZoom ] = createSignal(1);

    const [ drag, setDrag ] = createSignal(null);

    const transform = {
        to_vc: ([x, y]) => {
            const [ w, h ] = [ window.innerWidth, window.innerHeight ];
            return [
                (x - w / 2 - center()[0]) / zoom() + w / 2,
                (y - h / 2 - center()[1]) / zoom() + h / 2
            ];
        },
        from_vc: ([x, y]) => {
            const [ w, h ] = [ window.innerWidth, window.innerHeight ];
            return [
                (x - w / 2) * zoom() + w / 2 + center()[0],
                (y - h / 2) * zoom() + h / 2 + center()[1]
            ];
        }
    };

    const actions = {
        keyPress: e => {
            if (e.shiftKey) {
                const key = e.key.toLowerCase();
                LiveActions.command(key);
            }
        },
        mouseDown: _ => {
            setMouseDown(true);
        },
        mouseUp: _ => {
            setMouseDown(false);
            setDrag(null);
        },
        mouseMove: e => {
            if (drag()) {
                const coords = [ e.pageX, e.pageY ];
                setDrag(d => ({
                    ...d, position: transform.to_vc(coords)
                }));
            }
            if (mouseDown()) {
                const [ x, y ] = center();
                setCenter([
                    x + e.movementX,
                    y + e.movementY
                ]);
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
            onWheel={actions.wheelMove}
            onMouseMove={actions.mouseMove}
        >
            <div
                class="w-screen h-screen absolute"
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
                            drag={drag}
                            setDrag={setDrag}
                        />
                    )}
                </For>
                <For each={LiveCircuit.wireIds.get()}>
                    {id => <Wire id={id}/>}
                </For>
            </div>
        </div>
    );
};

export default Canvas;