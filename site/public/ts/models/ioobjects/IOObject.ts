import {XMLNode} from "../../utils/io/xml/XMLNode";
import {XMLable} from "../../utils/io/xml/XMLable";
import {Name} from "../../utils/Name";
import {CircuitDesigner} from "../CircuitDesigner";

export abstract class IOObject implements XMLable {
    protected designer?: CircuitDesigner;
    protected name: Name;

    constructor() {
        this.name = new Name(this.getDisplayName());
    }

	public setDesigner(designer?: CircuitDesigner): void {
		this.designer = designer;
	}

	public getDesigner(): CircuitDesigner {
		return this.designer;
	}

    public abstract activate(signal: boolean, i?: number): void;

    public getName(): string {
        return this.name.getName();
    }

    public copy(): IOObject {
        let copy: IOObject = new (<any> this.constructor)();
        copy.name = new Name(this.name.getName());
        return copy;
    }

    public save(node: XMLNode): void {
        node.addAttribute("name", this.name.getName());
    }
    public load(node: XMLNode): void {
        this.name = new Name(node.getAttribute("name"));
    }

    public abstract getDisplayName(): string;
    public abstract getXMLName(): string;

    public setName(name: string): void {
        this.name.setName(name);
    }
    public getName(): string {
        return this.name.getName();
    }
}
