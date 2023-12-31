import { createEffect, createMemo, onMount } from 'solid-js';
import { LiveActions } from '../../script/stores/live_circuit';

const Pin = ({
    pin,
    pinClick
}) => {
    const pinSize = 10;

    const isSelected = createMemo(() =>
        LiveActions.selection.get()?.id == pin.id
    );

    return (
        <button
            onClick={e => pinClick(e, pin.id)}
            class="absolute bg-[1px] bg-gray-500 rounded-[50%]"
            style={{
                width: `${pinSize}px`,
                height: `${pinSize}px`,
                left: `${pin.pos[0] - pinSize / 2}px`,
                top: `${pin.pos[1] - pinSize / 2}px`,
                outline: isSelected() ? "2px solid white" : "none"
            }}
        />
    );
};

export default Pin;