import {GetHelpers} from "test/helpers/Helpers";

import {IOObject} from "core/models";

import {CreateNegatedGatesAction} from "digital/actions/simplification/NegatedGatesActionFactory";

import {DigitalCircuitDesigner}                from "digital/models/DigitalCircuitDesigner";
import {DigitalObjectSet}                      from "digital/models/DigitalObjectSet";
import {ANDGate, LED, ORGate, Switch, XORGate} from "digital/models/ioobjects";

import {NOTGate} from "digital/models/ioobjects/gates/BUFGate";




describe("Simplifications", () => {
    const designer = new DigitalCircuitDesigner(0);
    const { Place, Connect } = GetHelpers(designer);

    describe("Create Negation Gates", () => {
        describe("!(a&b)", () => {
            const [a, b, and, not, o] = Place(new Switch(), new Switch(), new ANDGate(), new NOTGate(), new LED());

            const objects: IOObject[] = [
                a,
                b,
                o,
                and,
                not,
            ];

            objects.push(Connect(a, and)[0].getWire(),
                         Connect(b, and)[0].getWire(),
                         Connect(and, not)[0].getWire(),
                         Connect(not, o)[0].getWire());

            const circuit = DigitalObjectSet.From(objects);

            const [, negatedCircuit] = CreateNegatedGatesAction(designer, circuit);

            test("NOTGate and ANDGate removed", () => {
                expect(negatedCircuit.getComponents().indexOf(and)).toBe(-1);
                expect(negatedCircuit.getComponents().indexOf(not)).toBe(-1);
                expect(and.getDesigner()).toBeUndefined();
                expect(not.getDesigner()).toBeUndefined();
            });

            describe("Correct Circuit", () => {
                test("Initial State", () => {
                    expect(o.isOn()).toBe(true);
                });
                test("Input a on", () => {
                    a.activate(true);

                    expect(o.isOn()).toBe(true);
                });
                test("Input a,b on", () => {
                    b.activate(true);

                    expect(o.isOn()).toBe(false);
                });
                test("Input b on", () => {
                    a.activate(false);

                    expect(o.isOn()).toBe(true);
                });
                test("Inputs off", () => {
                    b.activate(false);

                    expect(o.isOn()).toBe(true);
                });
            });
        });

        describe("!(a|b)", () => {
            const [a, b, or, not, o] = Place(new Switch(), new Switch(), new ORGate(), new NOTGate(), new LED());

            const objects: IOObject[] = [
                a,
                b,
                o,
                or,
                not,
            ];

            objects.push(Connect(a, or)[0].getWire(),
                         Connect(b, or)[0].getWire(),
                         Connect(or, not)[0].getWire(),
                         Connect(not, o)[0].getWire());

            const circuit = DigitalObjectSet.From(objects);

            const [, negatedCircuit] = CreateNegatedGatesAction(designer, circuit);

            test("NOTGate and ORGate removed", () => {
                expect(negatedCircuit.getComponents().indexOf(or)).toBe(-1);
                expect(negatedCircuit.getComponents().indexOf(not)).toBe(-1);
                expect(or.getDesigner()).toBeUndefined();
                expect(not.getDesigner()).toBeUndefined();
            });

            describe("Correct Circuit", () => {
                test("Initial State", () => {
                    expect(o.isOn()).toBe(true);
                });
                test("Input a on", () => {
                    a.activate(true);

                    expect(o.isOn()).toBe(false);
                });
                test("Input a,b on", () => {
                    b.activate(true);

                    expect(o.isOn()).toBe(false);
                });
                test("Input b on", () => {
                    a.activate(false);

                    expect(o.isOn()).toBe(false);
                });
                test("Inputs off", () => {
                    b.activate(false);

                    expect(o.isOn()).toBe(true);
                });
            });
        });

        describe("!(a^b)", () => {
            const [a, b, xor, not, o] = Place(new Switch(), new Switch(), new XORGate(), new NOTGate(), new LED());

            const objects: IOObject[] = [
                a,
                b,
                o,
                xor,
                not,
            ];

            objects.push(Connect(a, xor)[0].getWire(),
                         Connect(b, xor)[0].getWire(),
                         Connect(xor, not)[0].getWire(),
                         Connect(not, o)[0].getWire());

            const circuit = DigitalObjectSet.From(objects);

            const [, negatedCircuit] = CreateNegatedGatesAction(designer, circuit);

            test("NOTGate and XORGate removed", () => {
                expect(negatedCircuit.getComponents().indexOf(xor)).toBe(-1);
                expect(negatedCircuit.getComponents().indexOf(not)).toBe(-1);
                expect(xor.getDesigner()).toBeUndefined();
                expect(not.getDesigner()).toBeUndefined();
            });

            describe("Correct Circuit", () => {
                test("Initial State", () => {
                    expect(o.isOn()).toBe(true);
                });
                test("Input a on", () => {
                    a.activate(true);

                    expect(o.isOn()).toBe(false);
                });
                test("Input a,b on", () => {
                    b.activate(true);

                    expect(o.isOn()).toBe(true);
                });
                test("Input b on", () => {
                    a.activate(false);

                    expect(o.isOn()).toBe(false);
                });
                test("Inputs off", () => {
                    b.activate(false);

                    expect(o.isOn()).toBe(true);
                });
            });
        });
    });
});
