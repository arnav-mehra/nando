import { createSignal } from "solid-js";
import { LiveCircuit } from "../../script/stores/live_circuit";

const Tools = () => {
    const [ play, setPlay ] = createSignal(true);

    const actions = {
        addGate: () => LiveCircuit.addGate("NAND"),
        togglePlay: () => setPlay(p => !p)
    };

    return (
        <>
        <div class="fixed right-0 bottom-0 p-4 gap-2">
            {/* <div>SHIFT + CMD</div> */}
            <div>(P)lay/pause</div>
            <div>(I)nfo</div>
            <div>(S)ave</div>
        </div>

        <div class="fixed right-0 top-0 p-4 gap-2 flex">
            <button onClick={actions.togglePlay}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-8 h-8 stroke-[1.5] fill-none"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d={play() ? "M15.75 5.25v13.5m-7.5-13.5v13.5"
                                  : "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"}
                    />
                </svg>
            </button>

            <button onClick={actions.addGate}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-8 h-8 stroke-[1.5] fill-none"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </button>
        </div>
        </>
    );
};

export default Tools;