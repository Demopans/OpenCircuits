import type {CircuitInfo} from "core/utils/CircuitInfo";
import type {Selectable}  from "core/utils/Selectable";

import {GroupAction}   from "core/actions/GroupAction";
import {SetNameAction} from "core/actions/SetNameAction";

import {TextModuleInputField} from "./inputs/TextModuleInputField";
import {useSelectionProps}    from "./useSelectionProps";


type Props = {
    info: CircuitInfo;
}
export const TitleModule = ({ info }: Props) => {
    const { selections, renderer, history } = info;

    const [props] = useSelectionProps(
        info,
        (s): s is Selectable => true,
        (s) => ({ name: s.getName() })
    );

    if (!props)
        return null;

    const s = selections.get();

    return (<div>
        <label>
            <TextModuleInputField
                props={props.name}
                placeholder="<Multiple>"
                alt="Name of object(s)"
                getAction={(newNames) => new GroupAction(
                    s.map((o,i) => new SetNameAction(o, newNames[i])),
                    "Title Module"
                )}
                onSubmit={({ isFinal, action }) => {
                    renderer.render();
                    if (isFinal)
                        history.add(action);
                }} />
        </label>
    </div>)
}
