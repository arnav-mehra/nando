import { createMemo } from "solid-js"

const Wire = ({
    wire,
    transform,
    circuit
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
            angle: Math.atan(dy / dx)
        };
    })

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    left: `${vec().left - vec().width / 2}px`,
                    top: `${vec().top}px`,
                    width: `${vec().width}px`,
                    height: `1px`,
                    transform: `rotate(${vec().angle}rad)`,
                    "background-color": wire().value ? "red" : "black",
                }}
            />
            {/* <div
                style={{
                    position: "absolute",
                    left: `${vec().left - 2.5}px`,
                    top: `${vec().top - 2.5}px`,
                    width: `5px`,
                    height: `5px`,
                    "background-color": "green",
                }}
            /> */}
        </>
    )
}

export default Wire