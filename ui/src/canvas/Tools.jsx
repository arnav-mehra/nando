import { createSignal } from "solid-js"
import styles from './Canvas.module.css'

const Tools = ({
    circuit,
    setCircuit
}) => {
    const [ play, setPlay ] = createSignal(true);

    const gates = {
        "NAND": {
            name: 'NAND',
            width: 100,
            height: 50,
            position: [ 0, 0 ],
            pins: [
                {
                    wire: -1,
                    position: [ 0, 15 ]
                },
                {
                    wire: -1,
                    position: [ 0, 35 ]
                },
                {
                    wire: -1,
                    position: [ 100, 25 ]
                }
            ]
        }
    }

    const addGate = (gate) => {
        const copy = { ...circuit() }
        copy.data.gates = [ ...copy.data.gates, gate ]
        setCircuit(copy)
        console.log(copy)
    }

    return (
        <>
            <div
                class={styles.tool_button}
                style={{
                    top: "12px",
                    right: "10px"
                }}
                onClick={() => setPlay(!play())}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    {play() ?
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    :
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    }
                </svg>
            </div>

            <div
                class={styles.tool_button}
                style={{
                    top: "12px",
                    right: "60px"
                }}
                onClick={() => addGate(gates["NAND"])}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>
        </>
    )
}

export default Tools