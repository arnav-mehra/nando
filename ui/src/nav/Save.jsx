import { createEffect, createSignal } from 'solid-js';
import styles from './Navbar.module.css';
import { deleteLocalCircuit, downloadCircuit, saveLocalCircuit } from '../storage/local';

const Save = ({
    save,
    setCircuit,
    loadLocalCircuits,
    optionModal,
    setOptionModal
}) => {
    const last_updated = new Date(save.meta.last_updated).toLocaleString();
    const [ name, setName ] = createSignal(save.meta.name);

    return (
        <div
            class={styles.save_button}
            onClick={() => setCircuit(save)}
        >
            <input
                value={name()}
                onKeyUp={e => {
                    setName(e.target.value)
                    if (e.key === 'Enter') {
                        save.meta.name = name();
                        saveLocalCircuit(save);
                    }
                    if (e.key === 'Escape') {
                        setName(save.meta.name);
                    }
                }}
                style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    width: "80px"
                }}
            />
            
            <div
                style={{
                    display: 'flex',
                    "align-items": "center"
                }}
            >
                <div
                    style={{
                        opacity: 0.4,
                        "font-size": "10px",
                        "justify-self": "end",
                        "margin-right": "5px"
                    }}
                >
                    Last Updated: {last_updated}
                </div>

                <div
                    style={{
                        color: "white",
                        "background": "none",
                        width: "22px"
                    }}
                    onClick={() => setOptionModal()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </div>
            </div>

            {/* {optionModal() && */}
                <div
                    class={styles.option_modal}
                    style={{
                        opacity: optionModal() ? 1 : 0,
                        "pointer-events": optionModal() ? "auto" : "none"
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            border: "5px solid rgb(62, 74, 87)",
                            "border-bottom-left-radius": "10px"
                        }}
                    />
                    <div
                        style={{
                            background: "rgb(62, 74, 87)",
                            padding: "10px",
                            "margin-left": "5px",
                            "border-radius": "0 5px 5px 5px"
                        }}
                    >
                        <div
                            style={{
                                width: "18px",
                                "margin-bottom": "10px"
                            }}
                            onClick={() => downloadCircuit(save)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>

                        <div
                            style={{
                                width: "18px"
                            }}
                            onClick={() => {
                                deleteLocalCircuit(save);
                                loadLocalCircuits();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                    </div>
                </div>
            {/* } */}
        </div>
    )
}

export default Save