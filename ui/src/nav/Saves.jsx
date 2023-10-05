import { createEffect, createSignal } from "solid-js"
import { createLocalCircuit, getLocalCircuits } from "../storage/local";
import styles from './Navbar.module.css';
import Save from "./Save";

const Saves = ({
    setCircuit,
    expanded
}) => {
    const [ loading, setLoading ] = createSignal(true);
    const [ results, setResults ] = createSignal([]);
    const [ optionModal, setOptionModal ] = createSignal(-1);
    
    const loadLocalCircuits = () => {
        setLoading(true);
        const res = getLocalCircuits();
        setResults(res);
        setLoading(false);
    }

    createEffect(() => {
        loadLocalCircuits();
    }, []);

    createEffect(() => {
        if (!expanded()) {
            setOptionModal(-1);
        }
    }, [expanded])

    return (
        <>
            {loading() ?
                <div>
                    Loading
                </div>
            :
                <>
                    <div class={styles.navbar_heading}>
                        Saves
                    </div>
                    <div class={styles.navbar_underrule}/>

                    <div>
                        {results().map((s, i) => (
                            <>
                                <Save
                                    save={s}
                                    setCircuit={setCircuit}
                                    loadLocalCircuits={loadLocalCircuits}
                                    optionModal={() => optionModal() == i}
                                    setOptionModal={() => setOptionModal(optionModal() == i ? -1 : i)}
                                />
                                <div class={styles.navbar_underrule}/>
                            </>
                        ))}
                    </div>
                </>
            }

            <button
                id={styles.create_circuit_button}
                onClick={() => {
                    createLocalCircuit();
                    loadLocalCircuits();
                }}
            >
                Create Circuit +
            </button>
        </>
    )
}

export default Saves