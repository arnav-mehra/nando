import { createMemo } from "solid-js"
import styles from './Canvas.module.css'
import { LiveActions, LiveCircuit } from "../../script/stores/live_circuit"
import { PIN_HARD_DATA } from "../../script/util";

const Wire = ({
    id,
    transform,
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

        const [ xit, yit ] = transform.to_coord([ xi, yi ])
        const [ xft, yft ] = transform.to_coord([ xf, yf ])
        
        const dx = xft - xit;
        const dy = yft - yit;
        const len = Math.sqrt(dx * dx + dy * dy)

        return {
            top: (yit + yft) / 2,
            left: (xit + xft) / 2,
            width: len,
            angle: Math.atan(dy / dx),
            xit, yit,
            xft, yft
        };
    })

    return (
        <>
            <div
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    left: `${vec().left - vec().width / 2 - (isSelected() ? 1 : 0)}px`,
                    top: `${vec().top - (isSelected() ? 1 : 0)}px`,
                    width: `${vec().width}px`,
                    height: `2px`,
                    transform: `rotate(${vec().angle}rad)`,
                    "background-color": wire().value ? "red" : "black",
                    border: isSelected() ? "1px solid white" : "none"
                }}
                onClick={onSelect}
            />
            <div
                class={styles.wire_dots}
                style={{
                    left: `${vec().xit - 3}px`,
                    top: `${vec().yit - 3}px`
                }}
            />
            <div
                class={styles.wire_dots}
                style={{
                    left: `${vec().xft - 3}px`,
                    top: `${vec().yft - 3}px`
                }}
            />
        </>
    )
}

export default Wire