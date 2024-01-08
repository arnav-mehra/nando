import { createEffect, createSignal, onMount } from 'solid-js';
import { LiveCircuit, LiveActions } from '../../script/stores/live_circuit';
import { LiveGrid } from '../../script/stores/live_grid';

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
                const [ raw_x, raw_y ] = transform.to_vc(coords);
                const rnd = v => Math.round(v / 10) * 10;
                const [ x, y ] = [ rnd(raw_x), rnd(raw_y) ];
                const [ cx, cy ] = LiveActions.drag.get()?.position;

                if (x != cx || y != cy) {
                    LiveActions.drag.set(d => ({
                        ...d, position: [ x, y ]
                    }));
                }
            }
            if (mouseDown()) {
                const [ x, y ] = center();
                const [ dx, dy ] = [ e.movementX, e.movementY ];
                setCenter([ x + dx, y + dy ]);
            }
        },
        wheelMove: e => {
            const origin = [ e.pageX, e.pageY ];
            const vorigin = transform.to_vc(origin);
            
            const d = e.deltaY;
            const nz = zoom() - (d / 1000);
            const capped_nz = Math.max(Math.min(nz, 5), 0.5);
            setZoom(capped_nz);
            
            const neworigin = transform.from_vc(vorigin);
            setCenter(c => [
                c[0] + origin[0] - neworigin[0],
                c[1] + origin[1] - neworigin[1]
            ]);
        }
    }

    onMount(_ => {
        const cv = document.getElementById("canvas");
        cv.addEventListener("wheel", actions.wheelMove, { passive: true });
    })
    
    createEffect(_ => {
        const d = LiveActions.drag.get();
        if (d?.id) {
            LiveCircuit.patchGate(d.id, {
                position: d.position
            });
        }
    });

    createEffect(_ => {
        const [ left, top ] = transform.to_vc([ 0, 0 ]);
        const [ right, bot ] = transform.to_vc([ window.innerWidth, window.innerHeight ]);
        LiveGrid.updatePanels(left, top, right, bot);
    });

    return (
        <>
            <div
                id="canvas"
                class="h-screen w-screen overflow-hidden cursor-grab relative"
                tabIndex={0}
                onKeyPress={actions.keyPress}
                onMouseDown={actions.mouseDown}
                onMouseUp={actions.mouseUp}
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