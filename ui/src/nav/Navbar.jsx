import { createSignal } from 'solid-js';
import styles from './Navbar.module.css';
import Saves from './Saves';

const Navbar = ({
    setCircuit
}) => {
    const [ expanded, setExpanded ] = createSignal(false);

    return (
        <>
            <div 
                id={styles.navbar_expand_button}
                onClick={() => setExpanded(!expanded())}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    {expanded() ?
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    :
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    }
                </svg>
            </div>

            <div
                id={styles.navbar}
                style={{
                    left: expanded() ? "0" : "-340px"
                }}
            >
                <div class={styles.logo}>
                    Nando
                </div>

                <Saves
                    setCircuit={setCircuit}
                    expanded={expanded}
                />

                <div id={styles.credit_bar}>
                    <div class={styles.credit_dots}/>
                    <div id={styles.credit_text}>
                        Built by Arnav
                    </div>
                    <div class={styles.credit_dots}/>
                </div>
            </div>
        </>
    );
}

export default Navbar