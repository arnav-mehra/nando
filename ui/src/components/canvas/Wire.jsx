import { createMemo } from "solid-js"
import styles from './Canvas.module.css'
import { LiveActions, LiveCircuit } from "../../script/stores/live_circuit"
import { PIN_HARD_DATA } from "../../script/util";

const Wire = ({
    id
}) => {
    const gateSize = [100, 50];

    const wire = LiveCircuit.wireSigs[id].get;
    
    const [ fromPid, toPid ] = wire().pins;
    const fromPin = LiveCircuit.pins[fromPid];
    const toPin = LiveCircuit.pins[toPid];

    const fromGate = LiveCircuit.gateSigs[fromPin.gate].get;
    const toGate = LiveCircuit.gateSigs[toPin.gate].get;

    const fromPinPos = PIN_HARD_DATA['NAND'].positions[fromGate().pins.findIndex(x => x === fromPid)];
    const toPinPos = PIN_HARD_DATA['NAND'].positions[toGate().pins.findIndex(x => x === toPid)];

    const isSelected = createMemo(_ => (
        LiveActions.selection.get()?.id === id
    ));
    const onSelect = _ => LiveActions.selectWire(id);

    const vec = createMemo(_ => {
        const fromGatePos = fromGate().position;
        const toGatePos = toGate().position;

        const xi = fromGatePos[0] + fromPinPos[0] - gateSize[0] / 2
        const yi = fromGatePos[1] + fromPinPos[1] - gateSize[1] / 2
        const xf = toGatePos[0] + toPinPos[0] - gateSize[0] / 2
        const yf = toGatePos[1] + toPinPos[1] - gateSize[1] / 2

        const dx = xf - xi;
        const dy = yf - yi;
        const len = Math.sqrt(dx * dx + dy * dy)

        return {
            top: (yi + yf) / 2,
            left: (xi + xf) / 2,
            width: len,
            angle: Math.atan(dy / dx),
            xi, yi, xf, yf
        };
    })

    return (
        <>
            <div
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    left: `${vec().left - vec().width / 2}px`,
                    top: `${vec().top}px`,
                    width: `${vec().width}px`,
                    height: `2px`,
                    transform: `rotate(${vec().angle}rad)`,
                    "background-color": wire().value ? "red" : "black",
                    outline: isSelected() ? "1px solid white" : "none"
                }}
                onClick={onSelect}
            />

            <div
                class={styles.wire_dots}
                style={{
                    left: `${vec().xi - 3}px`,
                    top: `${vec().yi - 3}px`
                }}
            />
            <div
                class={styles.wire_dots}
                style={{
                    left: `${vec().xf - 3}px`,
                    top: `${vec().yf - 3}px`
                }}
            />
        </>
    )
}

export default Wire