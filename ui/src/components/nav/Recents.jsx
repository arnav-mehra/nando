import { For, createEffect, createSignal } from "solid-js";
import { Circuits, RecentCircuits } from "../../script/stores/circuits";
import Save from "./Save";

const Recents = () => {
    const [ loading, setLoading ] = createSignal(true);

    const loadWrap = (cb) => {
        return async () => {
            setLoading(true);
            await cb();
            setLoading(false);
        };
    };
    
    const actions = {
        createCircuit: loadWrap(Circuits.create),
        load: loadWrap(RecentCircuits.load)
    };

    createEffect(actions.load, []);

    return (
        <>
            <div>
                <div class="text-2xl">
                    Recent
                </div>
                <div class="border-solid border-t-[1px]"/>
            </div>

            {loading() ?
                <div>
                    Loading...
                </div>
            :
                <div>
                    <For each={RecentCircuits.list()}>
                        {save => <Save save={save}/>}
                    </For>
                </div>
            }

            <button
                class="border-dashed border-[1px] rounded-md p-2"
                onClick={actions.createCircuit}
            >
                Create Circuit +
            </button>
        </>
    );
};

export default Recents;