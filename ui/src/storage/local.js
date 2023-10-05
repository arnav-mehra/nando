export const getLocalCircuits = () => {
    const res = [];

    for (let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        if (id.substring(0, 5) != "save/") {
            continue;
        }

        const val = localStorage.getItem(id);
        try {
            const data = JSON.parse(val);
            res.push(data)
        } catch (err) {
            console.log(err);
        }
    }

    return res.sort((a, b) => (
        b.meta.last_updated - a.meta.last_updated
    ));
}

export const saveLocalCircuit = (save) => {
    localStorage.setItem(
        save.meta.id,
        JSON.stringify(save)
    );
}

export const createLocalCircuit = () => {
    const key = "00000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    const id = "save/" + key;

    const obj = {
        data: {
            gates: [],
            wires: [],
        },
        meta: {
            id,
            name: key,
            last_updated: Date.now(),
        }
    };
    const obj_str = JSON.stringify(obj);

    console.log({id, obj})
    localStorage.setItem(id, obj_str);
}

export const deleteLocalCircuit = (save) => {
    const key = save.meta.id;
    localStorage.removeItem(key);
}

export const downloadCircuit = (save) => {
    downloadObjectAsJson(save, save.meta.name)
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


// const j = JSON.stringify({ gates: [], wires: [], settings: {} });
//         localStorage.setItem("save/12345", j)