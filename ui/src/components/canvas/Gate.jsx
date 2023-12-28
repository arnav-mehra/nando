import { For, createMemo, createSignal } from "solid-js";
import styles from './Canvas.module.css'
import { PIN_HARD_DATA } from "../../script/util";
import { LiveActions, LiveCircuit } from "../../script/stores/live_circuit";

const Gate = ({
    id,
    transform,
}) => {
    const gate = LiveCircuit.gateSigs[id].get;
    const pins = gate().pins.map((id, i) => {
        const position = PIN_HARD_DATA[gate().type].positions[i];
        const pin = LiveCircuit.pins[id];
        return { ...pin, id, position };
    });

    const size = [100, 50];
    const pinSize = [10, 10];

    const [ mouseDown, setMouseDown ] = createSignal(false);
    const isSelected = createMemo(_ => (
        LiveActions.selection.get()?.id == id
    ));

    const actions = {
        click: e => {
            LiveActions.selectGate(id);
            e.stopPropagation();
        },
        pinClick: (e, id) => {
            LiveActions.selectPin(id);
            e.stopPropagation();
        },

        mouseDown: e => {
            setMouseDown(true);
            e.stopPropagation();
        },
        mouseUp: e => {
            setMouseDown(false);
            e.stopPropagation();
        },
        mouseMove: e => {
            if (mouseDown()) {
                const position = transform.from_coord([ e.pageX, e.pageY ]);
                LiveCircuit.patchGate(id, { position });
            }
            e.stopPropagation();
        }
    };

    return (
        <div
            onClick={actions.click}
            onMouseDown={actions.mouseDown}
            onMouseUp={actions.mouseUp}
            onMouseMove={actions.mouseMove}

            class="
                absolute cursor-grab
                bg-black text-white
                flex justify-center items-center
            "
            style={{
                "border-radius": `5px ${size[1] / 2}px ${size[1] / 2}px 5px`,
                width: `${size[0]}px`,
                height: `${size[1]}px`,
                left: `${gate().position[0] - size[0] / 2}px`,
                top: `${gate().position[1] - size[1] / 2}px`,
                outline: isSelected() ? "2px solid white" : "none"
            }}
        >
            <div>
                {gate().type}
            </div>

            {pins.map(pin => (
                <>
                    <div
                        class={styles.pin}
                        style={{
                            top: `${pin.position[1] - pinSize[1] / 2}px`,
                            left: `${pin.position[0] - pinSize[0] / 2}px`,
                            width: `${pinSize[0]}px`,
                            height: `${pinSize[1]}px`
                        }}
                        onClick={e => actions.pinClick(e, pin.id)}
                    />

                    {LiveActions.selection.get()?.id == pin.id &&
                        <div
                            class={styles.selected_pin}
                            style={{
                                top: `${pin.position[1] - 3}px`,
                                left: `${pin.position[0] - 3}px`,
                            }}
                        />
                    }
                </>
            ))}
        </div>
    );
};

export default Gate;