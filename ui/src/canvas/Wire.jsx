import { createMemo } from "solid-js"
import styles from './Canvas.module.css'

const Wire = ({
    wire,
    transform,
    circuit,
    isSelected,
    setSelected
}) => {
    const vec = createMemo(() => {
        const fromGate = circuit().data.gates[wire().from.gate]
        const toGate = circuit().data.gates[wire().to.gate]
        const fromPin = fromGate.pins[wire().from.pin]
        const toPin = toGate.pins[wire().to.pin]

        const xi = fromGate.position[0] + fromPin.position[0] - fromGate.width / 2
        const yi = fromGate.position[1] + fromPin.position[1] - fromGate.height / 2
        const xf = toGate.position[0] + toPin.position[0] - toGate.width / 2
        const yf = toGate.position[1] + toPin.position[1] - toGate.height / 2

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
                onClick={setSelected}
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