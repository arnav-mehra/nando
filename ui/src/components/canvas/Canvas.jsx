import { createSignal } from 'solid-js';
import { LiveCircuit, LiveActions } from '../../script/stores/live_circuit';

const Canvas = () => {
    const [ mouseDown, setMouseDown ] = createSignal(false);
    const [ center, setCenter ] = createSignal([ 0, 0 ]);
    const [ zoom, setZoom ] = createSignal(1);

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
            LiveActions.drag.set(null);
        },
        mouseMove: e => {
            if (LiveActions.drag.get()) {
                const coords = [ e.pageX, e.pageY ];
                LiveActions.drag.set(d => ({
                    ...d, position: transform.to_vc(coords)
                }));
            }
            if (mouseDown()) {
                const [ x, y ] = center();
                const [ dx, dy ] = [ e.movementX, e.movementY ];
                setCenter([ x + dx, y + dy ]);
            }
        },
        wheelMove: e => {
            const d = e.deltaY;
            const nz = zoom() + (d / 1000);
            setZoom(nz);
        }
    }

    return (
        <>
            <div
                id="canvas"
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
                    ref={LiveCircuit.ref}
                >
                </div>
            </div>
        </>
    );
};

export default Canvas;