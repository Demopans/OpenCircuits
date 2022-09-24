import {v4 as uuid} from "uuid";

import {LEFT_MOUSE_BUTTON} from "core/utils/Constants";

import {V} from "Vector";

import {CircuitInfo}       from "core/utils/CircuitInfo";
import {CalcWorldMousePos} from "core/utils/CircuitInfoUtils";
import {Event}             from "core/utils/Events";
import {SnapToGrid}        from "core/utils/SnapUtils";

import {Action}      from "core/actions/Action";
import {GroupAction} from "core/actions/GroupAction";

import {DeselectAll, Select} from "core/actions/units/Select";
import {SetProperty}         from "core/actions/units/SetProperty";
import {Split}               from "core/actions/units/Split";

import {Tool} from "core/tools/Tool";

import {AnyNode, AnyWire} from "core/models/types";


export const SplitWireTool: Tool = (() => {
    let node: AnyNode;

    let action: GroupAction;

    let tempAction: Action | undefined;

    return {
        shouldActivate(event: Event, { locked, circuit, input, curPressedObjID }: CircuitInfo): boolean {
            if (locked)
                return false;
            if (!curPressedObjID)
                return false;
            // Activate if the user dragged over a wire with 1 touch/finger
            return (event.type === "mousedrag" && event.button === LEFT_MOUSE_BUTTON &&
                    input.getTouchCount() === 1 &&
                    circuit.getObj(curPressedObjID)!.baseKind === "Wire");
        },
        shouldDeactivate(event: Event, {}: CircuitInfo): boolean {
            // Deactivate if stopped dragging by releasing mouse
            return (event.type === "mouseup");
        },

        onActivate(event: Event, info: CircuitInfo): void {
            const { circuit, selections, curPressedObjID } = info;

            const wire = circuit.getObj(curPressedObjID!) as AnyWire;

            // Make UUID for the node ourselves so we can keep track of it
            const nodeID = uuid();

            action = new GroupAction([
                DeselectAll(selections),
                Split(circuit, wire, nodeID),
                Select(selections, nodeID),
            ], "Split Wire");

            info.curPressedObjID = nodeID;

            node = circuit.getObj(nodeID)! as AnyNode;

            // explicitly start a drag
            this.onEvent(event, info);
        },
        onDeactivate({}: Event, { history }: CircuitInfo): void {
            if (!tempAction)
                throw new Error("No temp action for SplitWireTool?");
            history.add(action.add(tempAction));
            tempAction = undefined;
        },

        // Translate the noded
        onEvent(event: Event, info: CircuitInfo): boolean {
            if (event.type !== "mousedrag")
                return false;

            const { input, circuit } = info;

            tempAction?.undo();

            // Move node onto cursor and snap if holding shift
            let newPos = CalcWorldMousePos(info);
            if (input.isShiftKeyDown())
                newPos = SnapToGrid(newPos);

            tempAction = new GroupAction([
                SetProperty(circuit, node.id, "x", newPos.x),
                SetProperty(circuit, node.id, "y", newPos.y),
            ]);

            return true;
        },
    }
})();
