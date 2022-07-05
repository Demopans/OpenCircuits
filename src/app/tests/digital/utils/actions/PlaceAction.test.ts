import {PlaceAction} from "core/actions/addition/PlaceAction";

import {DigitalCircuitDesigner} from "digital/models/DigitalCircuitDesigner";

import {Switch} from "digital/models/ioobjects/inputs/Switch";


describe("Place Action", () => {
    test("Undo/Redo", () => {
        const designer = new DigitalCircuitDesigner(0);
        const a = new Switch();

        const a1 = new PlaceAction(designer, a).execute();

        expect(designer.getObjects()).toHaveLength(1);
        expect(designer.getObjects()[0]).toBe(a);

        a1.undo();
        expect(designer.getObjects()).toHaveLength(0);

        a1.execute();
        expect(designer.getObjects()).toHaveLength(1);
        expect(designer.getObjects()[0]).toBe(a);
    });
});
