import { createEffect, createMemo, createSignal } from "solid-js";
import styles from './Canvas.module.css'

const Gate = ({
    gate,
    transform,
    zoom,
    setPosition,
    onPinClick
}) => {
    const [ mouseDown, setMouseDown ] = createSignal(false);

    const position = createMemo(() => (
        transform.to_coord(gate().position)
    ));
    const size = createMemo(() => (
        transform.to_delta([ gate().width, gate().height ])
    ));
    const pin_positions = createMemo(() => (
        gate().pins.map(pin => (
            transform.to_delta(pin.position)
        ))
    ));

    return (
        <>
            <div
                class={styles.gate}
                style={{
                    cursor: mouseDown() ? "grabbing" : "grab",
                    
                    "border-radius": `5px ${size()[1]/2}px ${size()[1]/2}px 5px`,
                    
                    height: `${size()[1]}px`,
                    width: `${size()[0]}px`,
                    left: `${position()[0] - size()[0] / 2}px`,
                    top: `${position()[1] - size()[1] / 2}px`,
                }}

                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
                onMouseMove={e => {
                    if (mouseDown()) {
                        const vcoords = transform.from_coord([ e.pageX, e.pageY ])
                        setPosition(vcoords)
                    }
                }}
            >
                <div class={styles.gate_lable}>
                    {gate().name}
                </div>

                {pin_positions().map((pos, i) => (
                    <div
                        // class={styles.pin}
                        style={{
                            position: "absolute",
                            width: "10px",
                            height: "10px",
                            "border-radius": "5px",
                            "background-color": "gray",
                            left: `${pos[0] - 5}px`,
                            top: `${pos[1] - 5}px`
                        }}
                        onClick={() => onPinClick(i)}
                    >
                        <div
                            style={{
                                width: "6px",
                                height: "6px",
                                margin: "2px",
                                "border-radius": "3px",
                                background: "orange",
                                "z-index": "200"
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Gate
