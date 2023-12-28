import { createSignal } from 'solid-js';
import Recents from './Recents';

const Navbar = () => {
    const [ expanded, setExpanded ] = createSignal(false);

    const actions = {
        toggleExpanded: () => setExpanded(e => !e)
    };

    return (
        <>
            <button
                class="z-[101] fixed p-4 cursor-pointer"
                onClick={actions.toggleExpanded}
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
                    fixed z-[100] p-4 w-80 h-full
                    flex flex-col justify-between
                "
            >
                <div class="flex flex-col gap-4">
                    <div class="bg-white text-black rounded self-end px-2 py-1 font-bold">
                        Nando
                    </div>

                    <Recents/>
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