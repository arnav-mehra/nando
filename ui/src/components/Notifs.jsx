import { createEffect, createSignal } from "solid-js"
import { notifQueue, setNotifQueue } from "../script/stores/notifs";

const Notifs = () => {
    const [ isShown, setIsShown ] = createSignal();
    const [ notif, setNotif ] = createSignal();

    createEffect(() => {
        const q = notifQueue();
        if (q.length == 0) return;

        const newNotif = q[0];

        setTimeout(() => {
            setNotif(newNotif);
            setIsShown(true);
        }, 500);

        setTimeout(() => {
            setIsShown(false);
        }, 2500);

        setTimeout(() => {
            q.shift(1);
            setNotifQueue([ ...q ]);
            setNotif(null);
        }, 3000);
    });

    return (
        <div
            style={{
                bottom: isShown() ? "5px" : "-50px",
                transition: "bottom 0.5s ease",
            }}
            class="fixed w-full flex justify-center text-black"
            id="notifs"
        >
            <div class="p-4 gap-2 rounded-md bg-white flex items-between">
                {notif()?.text.includes("Save") &&
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="w-6 h-6 stroke-blue-400 stroke-[1.5px] fill-none"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                    </svg>
                }

                <div>
                    {notif()?.text}
                </div>
            </div>
        </div>
    );
};

export default Notifs;