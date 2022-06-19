import "jest";

// TODO: Find out why Camera is being ignored and requiring a manual import
import "math/Camera";

import {Circuit} from "core/models/Circuit";

import {VersionConflictResolver} from "digital/utils/DigitalVersionConflictResolver";

import "digital/models/ioobjects";

import {LoadCircuit} from "./CircuitLoadingUtils";

import v1_1everythingJson from "./saves/v1.1_everything.json";
import v1_1muxesJson      from "./saves/v1.1_muxes.json";
import v2_1everythingJson from "./saves/v2.1_everything.json";
import v2_1muxesJson      from "./saves/v2.1_muxes.json";


describe("Save Migration Tests", () => {
    describe("v1.1 -> v2.0", () => {
        test("Save 1 – Muxes / ANDGates", () => {
            // Load old version
            VersionConflictResolver(v1_1muxesJson as Circuit);
            const circuit1 = LoadCircuit(v1_1muxesJson);
            expect.anything();

            // Load current version
            const circuit2 = LoadCircuit(v2_1muxesJson);
            expect(circuit1).toMatchCircuit(circuit2);
        });
        test("Save 2 – All Components", () => {
            // Load old version
            VersionConflictResolver(v1_1everythingJson as Circuit);
            const circuit1 = LoadCircuit(v1_1everythingJson);
            expect.anything();

            // Load current version
            const circuit2 = LoadCircuit(v2_1everythingJson);
            expect(circuit1).toMatchCircuit(circuit2);
        });
    });
});
