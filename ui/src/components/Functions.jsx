import { For, createMemo } from "solid-js";
import { GateFunctions } from "../script/stores/functions";
import { ezSignal } from "../script/util";

const Functions = () => {
    const newForm = ezSignal({ name: '', fn: '' });

    const ttFunc = ezSignal();
    const ttResult = createMemo(() => {
        const res = GateFunctions.validateFn(ttFunc.get());
        if (!res) return null;
        return GateFunctions.genTT(res);
    })

    const actions = {
        close: _ => {
            GateFunctions.visible.set(false);
        },
        setForm: (field, e) => {
            const val = e.target.value;
            newForm.set(f => ({ ...f, [field]: val }));
        },
        add: async () => {
            const { name, fn } = newForm.get();
            await GateFunctions.add(name, fn);
            newForm.set({ name: '', fn: '' });
        },
        update: (name, fn) => {
            GateFunctions.update(name, fn);
        },
        delete: name => {
            GateFunctions.remove(name);
        },
        seeTT: fn => {
            ttFunc.set(f => f === fn ? null : fn);
        }
    };

    return (
        <div
            class="fixed w-screen h-screen flex justify-center items-center top-0 left-0"
            id="functions"
        >
            <div class="bg-black rounded-lg p-6 flex flex-col gap-4">
    
                <div class="w-full flex justify-between items-center">
                    <div class="text-xl">
                        Manage Gate Functions
                    </div>
                    <button
                        onClick={actions.close}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-[1.5]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="max-h-60 overflow-y-scroll border-[1px] rounded-tl-lg rounded-bl-lg">
                    <table>
                        <thead>
                            <tr>
                                <th class="border-[1px] border-gray-700 p-2">
                                    *
                                </th>
                                <th class="border-[1px] border-gray-700 p-2">
                                    Name
                                </th>
                                <th class="border-[1px] border-gray-700 p-2">
                                    Function
                                </th>
                                <th class="border-[1px] border-gray-700 p-2">
                                    *
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <For each={GateFunctions.list.get()}>
                                {doc => {
                                    const fnForm = ezSignal(doc.fn);

                                    return (
                                        <tr>
                                            <td class="border-[1px] border-gray-700">
                                                <button
                                                    class="p-2 flex items-center"
                                                    onClick={_ => actions.seeTT(fnForm.get())}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        {ttFunc.get() === fnForm.get() ?
                                                            <>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            </>
                                                        :
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        }
                                                    </svg>
                                                </button>
                                            </td>

                                            <td class="border-[1px] border-gray-700">
                                                <div class="p-2">
                                                    {doc.name}
                                                </div>
                                            </td>

                                            <td class="border-[1px] border-gray-700">
                                                <input
                                                    class="p-2"
                                                    value={fnForm.get()}
                                                    onKeyUp={e => {
                                                        fnForm.set(
                                                            e.key === 'Escape'
                                                                ? save.name
                                                                : e.target.value
                                                        );
                                                        if (e.key === 'Enter') {
                                                            actions.update(doc.name, fnForm.get());
                                                        }
                                                    }}
                                                    onFocusOut={_ => fnForm.set(doc.fn)}
                                                />
                                            </td>

                                            <td class="border-[1px] border-gray-700">
                                                <button
                                                    class="p-2 flex items-center"
                                                    onClick={_ => actions.delete(doc.name)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }}
                            </For>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td class="border-[1px] border-gray-700">
                                    <button
                                        class="flex items-center p-2"
                                        onClick={_ => actions.seeTT(newForm.get().fn)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            {ttFunc.get() === newForm.get().fn ?
                                                <>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </>
                                            :
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            }
                                        </svg>
                                    </button>
                                </td>
                                <td class="border-[1px] border-gray-700">
                                    <input
                                        class="p-2"
                                        placeholder="FnName"
                                        value={newForm.get().name}
                                        onChange={e => actions.setForm("name", e)}
                                    />
                                </td>
                                <td class="border-[1px] border-gray-700">
                                    <input
                                        class="p-2"
                                        placeholder="FnStr"
                                        value={newForm.get().fn}
                                        onChange={e => actions.setForm("fn", e)}
                                    />
                                </td>
                                <td class="border-[1px] border-gray-700">
                                    <button
                                        class="flex items-center p-2"
                                        onClick={actions.add}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {ttResult() &&
                    <div class="max-h-40 overflow-y-scroll border-[1px] rounded-tl-lg rounded-bl-lg">
                        <table>
                            <thead>
                                <tr>
                                    <th class="border-[1px] border-gray-700 p-2">
                                        Inputs
                                    </th>
                                    <th class="border-[1px] border-gray-700 p-2">
                                        Outputs
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <For each={ttResult()}>
                                    {res => 
                                        <tr>
                                            <td class="border-[1px] border-gray-700">
                                                <div class="flex justify-around p-2">
                                                    {res.input.map(x => <div>{x}</div>)}
                                                </div>
                                            </td>
                                            <td class="border-[1px] border-gray-700">
                                                <div class="flex justify-around p-2">
                                                    {res.output.map ? 
                                                        res.output.map(x => <div>{x}</div>)
                                                    :
                                                        res.output
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </For>
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    );
};

export default Functions;