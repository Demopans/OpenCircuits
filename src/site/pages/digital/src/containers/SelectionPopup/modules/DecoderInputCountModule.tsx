import {CircuitInfo} from "core/utils/CircuitInfo";

import {GroupAction} from "core/actions/GroupAction";

import {CoderPortChangeAction} from "digital/actions/ports/CoderPortChangeAction";

import {Decoder} from "digital/models/ioobjects";

import {useSelectionProps} from "shared/containers/SelectionPopup/modules/useSelectionProps";

import {NumberModuleInputField} from "shared/containers/SelectionPopup/modules/inputs/NumberModuleInputField";


type Props = {
    info: CircuitInfo;
}
export const DecoderInputCountModule = ({ info }: Props) => {
    const { history, renderer } = info;

    const [props, cs] = useSelectionProps(
        info,
        (c): c is Decoder => (c instanceof Decoder),
        (c) => ({ numInputs: c.getInputPortCount().getValue() })
    );

    if (!props)
        return null;

    return (<div>
        Input Count
        <label>
            <NumberModuleInputField
                kind="int" min={1} max={8} step={1}
                props={props.numInputs}
                alt="Number of inputs object(s) have"
                getAction={(newCount) =>
                    new GroupAction(
                        cs.map(o => new CoderPortChangeAction(o, o.getInputPortCount().getValue(), newCount)),
                        "Decoder Input Count Module"
                    )}
                onSubmit={(info) => {
                    renderer.render();
                    if (info.isValid && info.isFinal)
                        history.add(info.action);
                }} />
        </label>
    </div>);
}
