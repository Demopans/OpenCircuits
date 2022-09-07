import type {InputPort}  from "digital/models/ports/InputPort";
import type {OutputPort} from "digital/models/ports/OutputPort";

import {serializable} from "serialeazy";

import {DEFAULT_SIZE} from "core/utils/Constants";

import {V} from "Vector";

import {ClampedValue} from "math/ClampedValue";

import {ConstantSpacePositioner} from "core/models/ports/positioners/ConstantSpacePositioner";

import {DigitalComponent} from "digital/models/DigitalComponent";


@serializable("Decoder")
export class Decoder extends DigitalComponent {

    public constructor() {
        super(new ClampedValue(2,1,8),
              new ClampedValue(4,2,Math.pow(2,8)),
              V(DEFAULT_SIZE, DEFAULT_SIZE*2),
              new ConstantSpacePositioner<InputPort>("left", DEFAULT_SIZE),
              new ConstantSpacePositioner<OutputPort>("right", DEFAULT_SIZE));

        // activate 0th port for initial state
        super.activate(true, 0);

        this.updatePortNames();
    }

    public activate(): void {
        // Convert binary input to index of which output should be on
        const num = this.getInputPorts()
                .map((port) => (port.getIsOn() ? 1 : 0))
                .reduce((prev, cur, i) => prev | (cur << i), 0);

        // Turn everything off except i === num
        this.getOutputPorts().forEach((_, i) => {
            super.activate(i === num, i);
        });
    }

    public updatePortNames(): void {
        this.inputs.getPorts().forEach((p, i) => {
            if (p.getName() === "")
                p.setName(`I${i}`);
        });
        this.outputs.getPorts().forEach((p, i) => {
            if (p.getName() === "")
                p.setName(`O${i}`);
        });
    }

    public getDisplayName(): string {
        return "Decoder";
    }
}
