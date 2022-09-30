import {useLayoutEffect} from "react";

import {HEADER_HEIGHT} from "shared/utils/Constants";

import {V} from "Vector";

import {Input} from "core/utils/Input";

import {PlaceGroup}  from "core/actions/units/Place";
import {DeselectAll} from "core/actions/units/Select";

import {AllComponentInfo} from "core/models/info";

import {DigitalComponentInfo} from "core/models/info/digital";

import {CreateComponent} from "core/models/utils/CreateComponent";

import {DigitalCircuitInfo} from "digital/utils/DigitalCircuitInfo";

import {GetRenderFunc} from "shared/utils/GetRenderingFunc";

import {usePageVisibility} from "shared/utils/hooks/usePageVisibility";
import {useWindowSize}     from "shared/utils/hooks/useWindowSize";

import {Droppable} from "shared/components/DragDroppable/Droppable";

// import {DigitalCreateN, SmartPlace, SmartPlaceOptions} from "site/digital/utils/DigitalCreate";

import {useDigitalSelector} from "site/digital/utils/hooks/useDigital";

import "./index.scss";


type Props = {
    info: DigitalCircuitInfo;
    canvas: React.RefObject<HTMLCanvasElement>;
}
export const MainDesigner = ({ info, canvas }: Props) => {
    const isPageVisible = usePageVisibility();

    const { isLocked } = useDigitalSelector(
        (state) => ({ isLocked: state.circuit.isLocked })
    );

    const { w, h } = useWindowSize();

    // On resize (useLayoutEffect happens sychronously so
    //  there's no pause/glitch when resizing the screen)
    useLayoutEffect(() => {
        info.camera.resize(w, h-HEADER_HEIGHT); // Update camera size when w/h changes
        info.renderer.render(); // Re-render
    }, [info, w, h]);

    // Initial function called after the canvas first shows up
    useLayoutEffect(() => {
        if (!canvas.current)
            throw new Error("MainDesigner.useLayoutEffect failed: canvas is null");
        // Create input w/ canvas
        info.input = new Input(canvas.current);

        // Get render function
        const renderFunc = GetRenderFunc({ canvas: canvas.current, info });

        // Add input listener
        info.input.addListener((event) => {
            const change = info.toolManager.onEvent(event, info);
            if (change)
                info.renderer.render();
        });

        // // Add render callbacks and set render function
        // info.designer.addCallback(() => info.renderer.render());

        info.renderer.setRenderFunction(() => renderFunc());
        info.renderer.render();
    }, [info, canvas]); // Pass empty array so that this only runs once on mount


    // Lock/unlock circuit
    useLayoutEffect(() => {
        info.locked = isLocked;
        if (isLocked) // Deselect everything
            info.history.add(DeselectAll(info.selections));
        info.history.setDisabled(isLocked);
        info.selections.setDisabled(isLocked);
    }, [info, isLocked]);

    useLayoutEffect(() => {
        // if (isPageVisible)
        //     info.designer.resume();
        // else
        //     info.designer.pause();
    }, [info, isPageVisible]);

    return (
        <Droppable
            ref={canvas}
            onDrop={(pos, itemKind, num) => {
                if (!canvas.current)
                    throw new Error("MainDesigner.Droppable.onDrop failed: canvas.current is null");
                num = num ?? 1;
                if (!itemKind || !(typeof itemKind === "string") || !(typeof num === "number"))
                    return;
                if (!(itemKind in DigitalComponentInfo)) {
                    console.warn(`Attempted to place item of kind: ${itemKind} which doesn't have info.`);
                    return;
                }
                pos = info.camera.getWorldPos(pos.sub(V(0, canvas.current.getBoundingClientRect().top)));

                const [comp, ports] = CreateComponent(
                    itemKind as keyof typeof DigitalComponentInfo,
                    info.viewManager.getTopDepth() + 1
                );
                comp.x = pos.x;
                comp.y = pos.y;
                info.history.add(PlaceGroup(info.circuit, [comp, ...ports]));
                // info.history.add(
                //     PlaceComponent(info.circuit, itemID as keyof typeof AllComponentInfo),
                // );
                // info.history.add(

                // );
                // if (smartPlaceOptions !== SmartPlaceOptions.Off) {
                //     info.history.add(SmartPlace(pos, itemId, info.designer, num, smartPlaceOptions));
                // } else {
                //     info.history.add(
                //         PlaceGroup(info.designer, DigitalCreateN(pos, itemId, info.designer, num))
                //     );
                // }
                info.renderer.render();
            }}>
            <canvas className="main__canvas"
                    width={w}
                    height={h-HEADER_HEIGHT} />
        </Droppable>
    );
}
