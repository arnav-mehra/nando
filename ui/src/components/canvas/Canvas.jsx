import { For, createEffect, createSignal, onMount } from 'solid-js';
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
            const d = e.deltaY;
            const nz = zoom() + (d / 1000);
            const capped_nz = Math.max(Math.min(nz, 5), 0.5);
            setZoom(capped_nz);
        }
    }

    let gridPanels = {};

    createEffect(_ => {
        const [ left, top ] = transform.to_vc([ 0, 0 ]);
        const [ right, bot ] = transform.to_vc([ window.innerWidth, window.innerHeight ]);
        const { floor, ceil } = Math;

        const drawPanel = (sx, sy) => {
            const el = (
                <svg
                    width="200px" height="200px" class="fixed"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ left: `${sx}px`, top: `${sy + 5}px` }}
                >
                    <defs>
                        <pattern id="sub-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                        </pattern>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <rect width="50" height="50" fill="url(#sub-grid)" stroke-width="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="200px" height="200px" fill="url(#grid)" />
                </svg>
            );
            return el;
        };

        const newPanels = new Map();

        for (let x = floor(left / 200); x <= ceil(right / 200); x++) {
            for (let y = floor(top / 200); y <= ceil(bot / 200); y++) {
                if (!newPanels[x]) newPanels[x] = new Map();

                if (gridPanels[x] && gridPanels[x][y]) {
                    newPanels[x][y] = gridPanels[x][y];
                    delete gridPanels[x][y];
                }
                else {
                    const el = drawPanel(200 * x, 200 * y);
                    newPanels[x][y] = el;
                    LiveCircuit.ref.appendChild(el);
                }
            }
        }

        Object.values(gridPanels).forEach(obj => {
            Object.values(obj).forEach(el => {
                el.remove();
            });
        });
        gridPanels = newPanels;
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