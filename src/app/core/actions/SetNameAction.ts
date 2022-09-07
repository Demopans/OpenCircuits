import type {Selectable} from "core/utils/Selectable";

import type {Action} from "core/actions/Action";


export class SetNameAction implements Action {
    private readonly obj: Selectable;
    private readonly newName: string;
    private readonly oldName: string;

    public constructor(o: Selectable, newName: string) {
        this.obj = o;
        this.newName = newName;
        this.oldName = o.getName();
    }

    public execute(): Action {
        this.obj.setName(this.newName);
        return this;
    }

    public undo(): Action {
        this.obj.setName(this.oldName);
        return this;
    }

    public getName(): string {
        return "Set Name";
    }

}
