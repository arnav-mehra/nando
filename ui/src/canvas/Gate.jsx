import { createEffect, createMemo, createSignal } from "solid-js";
import styles from './Canvas.module.css'

const Gate = ({
    gate,
    transform,
    setPosition,
    onPinClick,
    selectedPin,
    isSelected,
    setSelected
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
                onClick={setSelected}
                onMouseDown={e => {
                    setMouseDown(true);
                    e.stopPropagation();
                }}
                onMouseUp={e => {
                    setMouseDown(false);
                    e.stopPropagation();
                }}
                onMouseMove={e => {
                    if (mouseDown()) {
                        const vcoords = transform.from_coord([ e.pageX, e.pageY ])
                        setPosition(vcoords)
                    }
                    e.stopPropagation();
                }}

                class={styles.gate}
                style={{
                    cursor: "grab",
                    "border-radius": `5px ${size()[1]/2}px ${size()[1]/2}px 5px`,
                    height: `${size()[1]}px`,
                    width: `${size()[0]}px`,
                    left: `${position()[0] - size()[0] / 2 - (isSelected() ? 2 : 0)}px`,
                    top: `${position()[1] - size()[1] / 2 - (isSelected() ? 2 : 0)}px`,
                    border: isSelected() ? "2px solid white" : "none"
                }}
            >
                <div class={styles.gate_label}>
                    {gate().name}
                </div>

                {pin_positions().map((pos, i) => (
                    <>
                        <div
                            class={styles.pin}
                            style={{
                                top: `${pos[1] - 5}px`,
                                left: `${pos[0] - 5}px`,
                            }}
                            onClick={() => onPinClick(i)}
                        />
                        {selectedPin() == i &&
                            <div
                                class={styles.selected_pin}
                                style={{
                                    top: `${pos[1] - 3}px`,
                                    left: `${pos[0] - 3}px`,
                                }}
                            />
                        }
                    </>
                ))}
            </div>
        </>
    );
};

export default Gate
