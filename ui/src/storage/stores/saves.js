import { createSignal } from "solid-js";
import { getAllDocs, getAllKeys, upsertDoc } from "../db_ops";

export const [ saveList, setSaveList ] = createSignal(null);

export const loadLocalSaves = async () => {
    const docs = await getAllKeys("circuits", "name, last_updated");
    console.log({docs});
    setSaveList(docs);
};

export const saveLocalSaveName = (save, name) => {
    // const docs = getAllDocs("circuits");
    // console.log(docs);
    // setSaveList(docs);
};

export const createLocalCircuit = () => {
    const doc = {
        last_updated: Date.now(),
        name: "000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16)),
        data: {
            gates: {},
            wires: {},
            pins: {}
        }
    };
    upsertDoc("circuits", doc);
};

export const deleteLocalCircuit = (save) => {
    // const key = save.meta.id;
};

// const docMeta = {
//     name: "C1",
//     last_updated: Date.now()
// };

// const docData = {
//     gates: {
//         'gate/1': {
//             type: 'NAND',
//             pins: ['pin/1', 'pin/2', 'pin/3'],
//             position: [176, 248]
//         }
//     },
//     wires: {
//         'wire/1': {
//             pins: ['pin/1', 'pin/2']
//         }
//     },
//     pins: {
//         'pin/1': {
//             position: [0, 15]
//         },
//         'pin/2': {
//             position: [0, 35]
//         },
//         'pin/3': {
//             position: [100, 25]
//         }
//     }
// };

////

export const downloadCircuit = (save) => {
    downloadObjectAsJson(save, save.meta.name)
};

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};