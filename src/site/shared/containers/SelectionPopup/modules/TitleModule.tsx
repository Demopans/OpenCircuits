import {CircuitInfo} from "core/utils/CircuitInfo";
import {Selectable}  from "core/utils/Selectable";

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
                getAction={(newName) => new GroupAction(s.map(o => new SetNameAction(o, newName)), "Title Module")}
                placeholder="<Multiple>"
                alt="Name of object(s)"
                onSubmit={(info) => {
                    renderer.render();
                    if (info.isValid && info.isFinal) // / Only add final action to history
                        history.add(info.action);
                }} />
        </label>
    </div>)
}
