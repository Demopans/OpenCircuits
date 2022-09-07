import type {SegmentType} from "./Segments";
import type {InputPort}   from "digital/models/ports/InputPort";
import type {Vector}      from "Vector";

import {serializable, serialize} from "serialeazy";

import {IO_PORT_RADIUS} from "core/utils/Constants";

import {V} from "Vector";

import {ClampedValue} from "math/ClampedValue";

import {Name} from "core/utils/Name";

import {ConstantSpacePositioner} from "core/models/ports/positioners/ConstantSpacePositioner";
import {Positioner}              from "core/models/ports/positioners/Positioner";

import {DigitalComponent} from "digital/models/DigitalComponent";

import {Segments} from "./Segments";


/**
 * Here we have the code that applies to the different segment displays.
 * There is the initial state within the constructor
 * and other functions that allow you to modify said segment display.
 */
@serializable("SegmentDisplay")
export class SegmentDisplay extends DigitalComponent {
    @serialize
    protected segmentCount: number;

    /**
     * Initializes a 7-segment display with input ports on the left side.
     *
     * @param numInputs  The number of inputs this display is allowed to have.
     * @param positioner The positioner used to position the ports.
     */
    public constructor(numInputs?: ClampedValue, positioner?: Positioner<InputPort>) {
        super(numInputs ?? new ClampedValue(7, 7, 16),
              new ClampedValue(0),
              V(70, 100),
              positioner ?? new ConstantSpacePositioner("left", 4*IO_PORT_RADIUS+2, false));

        this.segmentCount = 7;
        this.setInputPortCount(7);
    }

    /**
     * Changes the number of segements in the display.
     *
     * @param val The number of segments in the segemt display.
     */
    protected setSegmentCount(val: number): void {
        this.segmentCount = val;

        //  We do not want to reset the user typed name so we check
        // if it was set in the first place
        if (!this.name.isSet())
            this.name = new Name(this.getDisplayName());
    }

    /**
     * Sets the input port and segement count to val.
     *
     * @param val The new number of segements and input ports.
     */
    public setInputPortCount(val: number): void {
        super.setInputPortCount(val);
        this.setSegmentCount(val);
    }

    /**
     * Checks if each input port is connected to a power source that is on.
     *
     * @param segment The number of input ports.
     * @returns         If the ports are on as a boolean.
     */
    public isSegmentOn(segment: number): boolean {
        return this.getInputPort(segment).getIsOn();
    }

    /**
     * Gets the positions of the segemnts from the json file
     * depending on how many segments there are.
     *
     * @returns An array of Vectors and SegmentTypes.
     */
    public getSegments(): Array<[Vector, SegmentType]> {
        const segments = Segments[`${this.segmentCount}`];

        // Turns the array into an array of Vectors and SegmentTypes
        return segments.map((value: [number[], SegmentType]) =>
            [V(value[0][0], value[0][1]), value[1]]
        );
    }

    /**
     * Gets the number of segements in a segment display.
     *
     * @returns The number of segements.
     */
    public getSegmentCount(): number {
        return this.segmentCount;
    }

    /**
     * Gets the name to display for the history.
     *
     * @returns A string of the name to display in the history.
     */
    public getDisplayName(): string {
        return `${this.segmentCount} Segment Display`;
    }
}
