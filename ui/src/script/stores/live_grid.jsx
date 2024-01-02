import { LiveCircuit } from "./live_circuit";

const { floor, ceil } = Math;
const PANEL_SIZE = 250;

export class LiveGrid {
    static panels = new Map();

    static createPanel(sx, sy) {
        return (
            <svg
                width={PANEL_SIZE} height={PANEL_SIZE} class="fixed"
                xmlns="http://www.w3.org/2000/svg"
                style={{ left: `${sx}px`, top: `${sy + 5}px` }}
            >
                <defs>
                    <pattern id="sub-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                    </pattern>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="url(#sub-grid)" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="250px" height="250px" fill="url(#grid)" />
            </svg>
        );
    }

    static updatePanels(left, top, right, bot) {
        const newPanels = new Map();

        for (let x = floor(left / PANEL_SIZE); x <= ceil(right / PANEL_SIZE); x++) {
            for (let y = floor((top - 5) / PANEL_SIZE); y <= ceil(bot / PANEL_SIZE); y++) {
                if (!newPanels[x]) newPanels[x] = new Map();

                if (LiveGrid.panels[x] && LiveGrid.panels[x][y]) {
                    newPanels[x][y] = LiveGrid.panels[x][y];
                    delete LiveGrid.panels[x][y];
                }
                else {
                    const el = LiveGrid.createPanel(PANEL_SIZE * x, PANEL_SIZE * y);
                    newPanels[x][y] = el;
                    LiveCircuit.ref.appendChild(el);
                }
            }
        }

        Object.values(LiveGrid.panels).forEach(obj => {
            Object.values(obj).forEach(el => {
                el.remove();
            });
        });

        LiveGrid.panels = newPanels;
    }
};