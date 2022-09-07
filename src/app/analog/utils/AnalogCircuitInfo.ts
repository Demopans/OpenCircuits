import type {AnalogCircuitDesigner} from "analog/models";
import type {AnalogSim}             from "analog/models/sim/AnalogSim";
import type {SimDataMappings}       from "analog/models/sim/NetlistGenerator";
import type {CircuitInfo}           from "core/utils/CircuitInfo";


export type AnalogCircuitInfo = Omit<CircuitInfo, "designer"> & {
    designer: AnalogCircuitDesigner;
    sim?: AnalogSim;
    simDataMappings?: SimDataMappings;
}
