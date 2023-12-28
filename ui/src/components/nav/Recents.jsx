import { For, createEffect } from "solid-js";
import { RecentCircuits } from "../../script/stores/circuits";
import Save from "./Save";

const Recents = () => {
    const actions = {
        load: _ => RecentCircuits.load()
    };

    createEffect(actions.load, []);

    return (
        <div>
            <div class="text-2xl border-solid border-b-[1px] mb-1">
                Recent
            </div>

            <For each={RecentCircuits.list()}>
                {save => <Save save={save}/>}
            </For>
        </div>
    );
};

export default Recents;