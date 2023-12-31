import { createSignal } from 'solid-js';
import Recents from './Recents';
import { Circuits } from '../../script/stores/circuits';

const Navbar = () => {
    const [ expanded, setExpanded ] = createSignal(true);

    const actions = {
        toggleExpanded: _ => setExpanded(e => !e),
        createCircuit: Circuits.create,
        closeNavbar: _ => setExpanded(false)
    };

    return (
        <>
            <button
                class="fixed p-4 cursor-pointer"
                onClick={actions.toggleExpanded}
                id="nav-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-8 h-8 fill-none stroke-[1.5px]"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d={expanded() ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
                    />
                </svg>
            </button>

            <div
                style={{ left: expanded() ? "0" : "-340px" }}
                class="
                    bg-black duration-200
                    fixed p-4 w-80 h-full
                    flex flex-col justify-between
                "
                id="nav-menu"
            >
                <div class="flex flex-col gap-4">
                    <div class="bg-white text-black rounded self-end px-2 py-1 font-bold">
                        Nando
                    </div>

                    <Recents
                        closeNavbar={actions.closeNavbar}
                    />

                    <button
                        class="border-dashed border-[1px] rounded-md p-2"
                        onClick={actions.createCircuit}
                    >
                        Create Circuit +
                    </button>
                </div>

                <div class="justify-self-end w-full flex items-center opacity-20">
                    <div class="border-[1px] border-dashed h-0 w-[inherit]"/>
                    <div class="text-sm w-min whitespace-nowrap mx-1">
                        Built by Arnav
                    </div>
                    <div class="border-[1px] border-dashed h-0 w-[inherit]"/>
                </div>
            </div>
        </>
    );
};

export default Navbar;