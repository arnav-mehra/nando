import { For, createMemo } from "solid-js";
import { LiveActions, LiveCircuit } from "../../script/stores/live_circuit";
import { GateFunctions } from "../../script/stores/functions";
import { ezSignal } from "../../script/util";

const GateEditor = () => {
    const gateForm = LiveActions.editor;

    const inLock = createMemo(() => {
        const type = gateForm.get().type;
        const { ins, _ } = GateFunctions.fnMap[type];
        return ins !== null;
    });
    const outLock = createMemo(() => {
        const type = gateForm.get().type;
        const { _, outs } = GateFunctions.fnMap[type];
        return outs !== null;
    });

    const actions = {
        closeEditor: _ => {
            LiveActions.closeGateEditor();
        },
        manageFunctions: _ => {
            GateFunctions.visible.set(true);
        },
        setType: e => {
            const val = e.target.value;
            const { ins: numInPins, outs: numOutPins } = GateFunctions.fnMap[val];
            gateForm.set(f => ({ ...f, type: val, numInPins, numOutPins }));
        },
        setNumInPins: e => {
            const numInPins = Number(e.target.value);
            if (isNaN(numInPins)) return;
            gateForm.set(f => ({ ...f, numInPins }));
        },
        setNumOutPins: e => {
            const numOutPins = Number(e.target.value);
            if (isNaN(numOutPins)) return;
            gateForm.set(f => ({ ...f, numOutPins }));
        },
        save: _ => {
            const upd = {};

            const gid = gateForm.get().id;
            const oldGate = LiveCircuit.gates[gid];

            const adjustPins = (formField, gateField) => {
                const oldPins = oldGate[gateField].length;
                const newPins = gateForm.get()[formField];
                if (newPins > oldPins) {
                    const addedPins = LiveCircuit.addPins(gid, newPins - oldPins);
                    upd[gateField] = [ ...oldGate[gateField], ...addedPins ];
                }
                else if (newPins < oldPins) {
                    const keptPins = oldGate[gateField].filter((_, i) => i < newPins);
                    upd[gateField] = keptPins;
                    const removedPins = oldGate[gateField].filter((_, i) => i >= newPins);
                    removedPins.forEach(pid => LiveCircuit.deleteGatePin(pid));
                }
            };

            adjustPins("numInPins", "inPins");
            adjustPins("numOutPins", "outPins");
            upd.type = gateForm.get().type;

            LiveCircuit.patchGate(gid, upd);
            LiveActions.closeGateEditor();
        }
    }

    const inputs = [
        {
            label: "Pins In",
            value: "numInPins",
            onChange: actions.setNumInPins,
            lock: inLock
        },
        {
            label: "Pins Out",
            value: "numOutPins",
            onChange: actions.setNumOutPins,
            lock: outLock
        }
    ];

    return (
        <div
            class="fixed w-screen h-screen left-0 top-0 flex justify-center items-center"
            id="gate-editor"
        >
            <div class="flex flex-col bg-black rounded-lg p-6 gap-4">

                <div class="flex justify-between items-center">
                    <div class="text-xl">
                        Edit Gate
                    </div>
                    <button onClick={actions.closeEditor}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-[1.5]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="flex flex-col justify-between gap-2">
                    <div class="flex justify-between items-center gap-4">
                        <div class="whitespace-nowrap">
                            Function
                        </div>
                        <div class="flex gap-2 items-center">
                            <button
                                class="text-xs"
                                onClick={actions.manageFunctions}
                            >
                                Manage Functions
                            </button>

                            <select
                                class="p-2 bg-black border-gray-700 border-dashed border-[1px] rounded-md"
                                onChange={actions.setType}
                                value={gateForm.get().type}
                            >
                                <For each={GateFunctions.list.get()}>
                                    {item =>
                                        <option value={item.name}>
                                            {item.name}
                                        </option>
                                    }
                                </For>
                            </select>
                        </div>
                    </div>

                    {inputs.map(d => (
                        <div class="flex justify-between items-center gap-4">
                            <div class="whitespace-nowrap">
                                {d.label}
                            </div>
                            <input
                                class="p-2 bg-black border-gray-700 border-dashed border-[1px] rounded-md"
                                style={{
                                    color: d.lock() ? 'gray' : 'white',
                                    cursor: d.lock() ? 'not-allowed' : 'pointer'
                                }}
                                value={gateForm.get()[d.value]}
                                onChange={d.onChange}
                                disabled={d.lock()}
                            />
                        </div>
                    ))}

                    <button
                        class="border-[1px] rounded-md p-2"
                        onClick={actions.save}
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GateEditor;