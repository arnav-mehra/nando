import { createMemo, createSignal } from 'solid-js';
import { deleteLocalCircuit, downloadCircuit, saveLocalSaveName } from '../storage/stores/saves';

const Save = ({
    save,
    isOptionModalOpen,
    openOptionModal
}) => {
    const last_updated = new Date(save.last_updated);
    const same_date = new Date().toDateString() === last_updated.toDateString();
    const last_updated_msg = (
        same_date ? last_updated.toLocaleTimeString()
                  : last_updated.toLocaleDateString()
    );

    const [ name, setName ] = createSignal(save.name);

    const _loadCircuit = () => {
        setCircuit(save);
    };

    const _downloadCircuit = () => {
        downloadCircuit(save);
    };

    const _deleteCircuit = () => {
        deleteLocalCircuit(save);
        loadLocalCircuits();
    };

    const _handleNameUpdate = (e) => {
        setName(e.target.value);
        if (e.key === 'Enter') {
            saveLocalSaveName(save, name());
        }
        if (e.key === 'Escape') {
            setName(save.name);
        }
    };

    return (
        <div
            class="flex justify-between border-y-[1px] border-solid border-gray-800 p-2"
            onClick={_loadCircuit}
        >
            <input
                value={name()}
                onKeyUp={_handleNameUpdate}
                class="border-none bg-transparent w-20"
            />
            
            <div class="flex items-center gap-1">
                <div class="opacity-40 text-xs">
                    Last Updated: {last_updated_msg}
                </div>

                <button onClick={openOptionModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]">
                        <path  strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg>
                </button>
            </div>

            <div
                class="absolute right-[-20px] mt-2 flex duration-200"
                style={!isOptionModalOpen() && "opacity: 0; auto: none;"}
            >
                <div class="h-2 border-4 border-solid border-gray-600 rounded-bl-xl"/>
                
                <div class="p-2 rounded-b-md rounded-tr-md bg-gray-600 flex flex-col gap-2">
                    <button onClick={_downloadCircuit}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </button>
                    <button onClick={_deleteCircuit}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Save;