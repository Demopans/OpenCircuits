import type {EventHandler} from "../EventHandler";
import type {CircuitInfo}  from "core/utils/CircuitInfo";
import type {Event}        from "core/utils/Events";

import {V} from "Vector";

import {CopyGroupAction} from "core/actions/CopyGroupAction";
import {GroupAction}     from "core/actions/GroupAction";

import {CreateDeselectAllAction,
        CreateGroupSelectAction} from "core/actions/selection/SelectAction";

import {TranslateAction} from "core/actions/transform/TranslateAction";

import {IOObject} from "core/models";


export const DuplicateHandler: EventHandler = ({
    conditions: (event: Event, { input, selections }: CircuitInfo) =>
        (event.type === "keydown" &&
         event.key === "d" &&
         input.isModifierKeyDown() &&
         selections.amount() > 0),

    getResponse: ({ history, designer, selections }: CircuitInfo) => {
        const objs = selections.get().filter((o) => o instanceof IOObject) as IOObject[];

        const copyGroupAction = new CopyGroupAction(designer, objs);
        const components = copyGroupAction.getCopies().getComponents();

        // Copy the group and then select them and move them over slightly
        history.add(new GroupAction([
            copyGroupAction.execute(),
            CreateDeselectAllAction(selections).execute(),
            CreateGroupSelectAction(selections, components).execute(),
            new TranslateAction(components,
                                components.map((o) => o.getPos()),
                                components.map((o) => o.getPos().add(V(5, 5)))).execute(),
        ], "Duplicate Handler"));
    },
});
