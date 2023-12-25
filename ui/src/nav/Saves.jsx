import { For, createEffect, createSignal } from "solid-js"
import { createLocalCircuit, loadLocalSaves, saveList } from "../storage/stores/saves";
import Save from "./Save";

const Saves = ({
    expanded
}) => {
    const [ loading, setLoading ] = createSignal(true);
    const [ optionModal, setOptionModal ] = createSignal(null);
    
    const loadLocalCircuits = () => {
        setLoading(true);
        loadLocalSaves();
        setLoading(false);
    };

    const updateOptionModal = (sel) => {
        const is_selected = optionModal() == sel;
        setOptionModal(is_selected ? null : sel);
        console.log(optionModal())
    };

    const createCircuit = () => {
        createLocalCircuit();
        loadLocalCircuits();
    };

    createEffect(() => {
        loadLocalCircuits();
    }, []);

    createEffect(() => {
        if (!expanded()) setOptionModal(-1);
    }, [expanded]);

    return (
        <>
            <div>
                <div class="text-2xl">
                    Saves
                </div>
                <div class="border-solid border-t-[1px]"/>
            </div>

            {loading() ?
                <div>
                    Loading...
                </div>
            :
                <For each={saveList()}>
                    {(save, _) => (
                        <Save
                            save={save}
                            isOptionModalOpen={() => optionModal() == save.id}
                            openOptionModal={() => updateOptionModal(save.id)}
                        />
                    )}
                </For>
            }

            <button
                class="border-dashed border-[1px] rounded-md p-2"
                onClick={createCircuit}
            >
                Create Circuit +
            </button>
        </>
    )
};

export default Saves;