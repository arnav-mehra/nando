import { createSignal } from "solid-js";

export const [ notifQueue, setNotifQueue ] = createSignal([]);

export const pushNotif = (text) => {
    const q = notifQueue();
    const newNotif = { text };
    setNotifQueue([ ...q, newNotif ]);
}