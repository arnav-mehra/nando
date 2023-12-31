import { createEffect, createMemo } from "solid-js";
import { LiveActions, LiveCircuit } from "../../script/stores/live_circuit";
import Pin from "./Pin";
import { pinY } from "../../script/util";

const Gate = ({
    id,
    drag,
    setDrag
}) => {
    const gate = LiveCircuit.gateSigs[id].get;

    const in_cnt = createMemo(_ => {
        return gate().inPins.length;
    });
    const out_cnt = createMemo(_ => {
        return gate().outPins.length;
    });

    const height = createMemo(_ => {
        const height = 25 * Math.max(in_cnt(), out_cnt());
        return height;
    });

    const width = 100;

    const inPins = createMemo(_ => {
        const inPins = gate().inPins.map((id, i) => {
            const pin = LiveCircuit.pins[id];
            const pos = [0, pinY(in_cnt(), i) + height() / 2];
            return { ...pin, id, pos };
        });
        return inPins;
    });

    const outPins = createMemo(_ => {
        const outPins = gate().outPins.map((id, i) => {
            const pin = LiveCircuit.pins[id];
            const pos = [100, pinY(out_cnt(), i) + height() / 2];
            return { ...pin, id, pos };
        });
        return outPins;
    });

    const isSelected = createMemo(_ =>
        LiveActions.selection.get()?.id == id
    );

    const actions = {
        click: e => {
            LiveActions.selectGate(id);
            e.stopPropagation();
        },
        doubleClick: e => {
            LiveActions.openGateEditor(id, gate());
            e.stopPropagation();
        },
        closeEditor: e => {
            setShowEditor(false);
            e.stopPropagation();
        },
        pinClick: (e, id) => {
            LiveActions.selectPin(id);
            e.stopPropagation();
        },
        mouseDown: e => {
            setDrag({ id, position: gate().position });
            e.stopPropagation();
        }
    };

    createEffect(() => {
        if (drag()?.id == id) {
            const position = drag().position;
            LiveCircuit.patchGate(id, { position });
        }
    });

    return (
        <div
            onClick={actions.click}
            onDblClick={actions.doubleClick}
            onMouseDown={actions.mouseDown}
            onMouseUp={_ => {}}

            class="
                absolute cursor-grab bg-black text-white
                flex justify-center items-center
            "
            style={{
                "border-radius": `5px 20px 20px 5px`,
                width: `${width}px`,
                height: `${height()}px`,
                left: `${gate().position[0] - width / 2}px`,
                top: `${gate().position[1] - height() / 2}px`,
                outline: isSelected() ? "2px solid white" : "none"
            }}
        >
            <div>
                {gate().type}
            </div>

            {inPins().map(pin =>
                <Pin
                    pin={pin}
                    pinClick={actions.pinClick}
                />
            )}
            {outPins().map(pin =>
                <Pin
                    pin={pin}
                    pinClick={actions.pinClick}
                />
            )}
        </div>
    );
};

export default Gate;