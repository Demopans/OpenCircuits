import {CircuitDesigner, Component} from "core/models";

import {ConnectionAction, DisconnectAction} from "./addition/ConnectionAction";
import {DeleteAction, PlaceAction}          from "./addition/PlaceAction";
import {GroupAction}                        from "./GroupAction";
import {TranslateAction}                    from "./transform/TranslateAction";


/**
 * Returns a GroupAction for replacing the original component with a new one. Both must have the same number of ports.
 * `original` must be placed in designer, and `replacement` must not be placed in designer.
 * This action implicitly executes on creation.
 *
 * @param    designer    The designer that original is placed on.
 * @param    original    The component to replace, already in designer.
 * @param    replacement The new component, not yet in designer.
 * @returns              A GroupAction containing the actions required to replace the component.
 * @throws {Error} If original and replacement do not have the same number of ports.
 */
 export function CreateReplaceComponentAction(designer: CircuitDesigner, original: Component,
                                              replacement: Component): GroupAction {
    const action = new GroupAction([], "Replace Component Action");
    const originalPorts = original.getPorts();
    const replacementPorts = replacement.getPorts();

    if (originalPorts.length !== replacementPorts.length)
        throw new Error("Mismatched number of ports of replacement");

    action.add(new PlaceAction(designer, replacement).execute());

    originalPorts.forEach((port, index) => {
        port.getWires().forEach((wire) => {
            const otherPort = (wire.getP1() === port) ? wire.getP2() : wire.getP1();
            action.add(new DisconnectAction(designer, wire).execute());
            action.add(new ConnectionAction(designer, replacementPorts[index], otherPort).execute());
        });
    });

    action.add(new TranslateAction([replacement], [replacement.getPos()], [original.getPos()]).execute());
    action.add(new DeleteAction(designer, original).execute());

    return action;
}