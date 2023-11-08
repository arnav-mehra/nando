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
                left: "calc(50% - 110px)",
                bottom: isShown() ? "5px" : "-50px",
                transition: "bottom 1s ease",

                width: "220px",
                "border-radius": "15px",
                "text-align": "center",
                padding: "5px",
                height: "20px"
            }}
        >
            {notif()?.text}
        </div>
    )
}

export default Notifs