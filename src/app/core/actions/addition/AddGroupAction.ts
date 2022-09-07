import type {IOObjectSet} from "core/utils/ComponentUtils";

import type {CircuitDesigner} from "core/models/CircuitDesigner";

import type {Action} from "../Action";


export class AddGroupAction implements Action {
    private readonly designer: CircuitDesigner;
    private readonly group: IOObjectSet;

    public constructor(designer: CircuitDesigner, group: IOObjectSet) {
        this.designer = designer;
        this.group = group;
    }

    public execute() {
        this.designer.addGroup(this.group);

        return this;
    }

    public undo() {
        this.group.getComponents().forEach((c) => this.designer.removeObject(c));
        this.group.getWires().forEach((w) => this.designer.removeWire(w));

        return this;
    }

    public getName(): string {
        return "Added Group Action"
    }
}
