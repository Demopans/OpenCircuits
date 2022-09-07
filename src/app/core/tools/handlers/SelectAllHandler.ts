import type {EventHandler} from "../EventHandler";
import type {CircuitInfo}  from "core/utils/CircuitInfo";
import type {Event}        from "core/utils/Events";

import {CreateGroupSelectAction} from "core/actions/selection/SelectAction";


export const SelectAllHandler: EventHandler = ({
    conditions: (event: Event, { input, designer, selections }: CircuitInfo) =>
        (event.type === "keydown" &&
         event.key === "a" &&
         input.isModifierKeyDown() &&
         // Don't want to select all if nothing to select or everything is already selected
         designer.getObjects().length > 0 &&
         designer.getObjects().length !== selections.amount()),

    getResponse: ({ history, designer, selections }: CircuitInfo) =>
        history.add(CreateGroupSelectAction(selections, designer.getObjects()).execute()),
});
