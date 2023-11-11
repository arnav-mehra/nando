import { createEffect, createSignal } from "solid-js"

const Notifs = ({
    notifQueue,
    setNotifQueue
}) => {
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
                position: "fixed",
                background: "white",
                left: "calc(50% - 120px)",
                bottom: isShown() ? "5px" : "-50px",
                transition: "bottom 0.5s ease",

                width: "240px",
                "border-radius": "5px",
                "text-align": "center",
                "font-weight": "600",
                display: "flex",
                "align-items": "center" 
            }}
        >
            {notif()?.text.includes("Save") &&
                <svg style={{ "padding": "10px" }} width="24px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="lightblue" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                </svg>
            }
            <div style={{
                "padding": "10px"
            }}>
                {notif()?.text}
            </div>
        </div>
    )
}

export default Notifs