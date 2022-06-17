import {V} from "Vector";

import {CircuitInfo} from "core/utils/CircuitInfo";

import {TranslateAction} from "core/actions/transform/TranslateAction";

import {Component} from "core/models";

import {useSelectionProps} from "./useSelectionProps";
import {NumberModuleInputField} from "./inputs/NumberModuleInputField";


type Props = {
    info: CircuitInfo;
}
export const PositionModule = ({ info }: Props) => {
    const { renderer, history } = info;

    const [props, cs] = useSelectionProps(
        info,
        (s): s is Component => (s instanceof Component),
        (s) => ({ x: s.getPos().x/100, y: s.getPos().y/100 })
    );

    if (!props)
        return null;

    return <div>
        Position
        <label>
            <NumberModuleInputField
                kind="float"
                props={props.x}
                getAction={(newX) =>
                    new TranslateAction(
                        cs,
                        cs.map(c => c.getPos()),
                        cs.map(c => V(newX*100, c.getPos().y)),
                        false
                    )
                }
                onSubmit={(info) => {
                    renderer.render();
                    if (info.isValid && info.isFinal) /// Only add final action to history
                        history.add(info.action);
                }}
                getCustomDisplayVal={(v) => parseFloat(v.toFixed(2))}
                step={1}
                alt="X-Position of object(s)" />
            <NumberModuleInputField
                kind="float"
                props={props.y}
                getAction={(newY) =>
                    new TranslateAction(
                        cs,
                        cs.map(c => c.getPos()),
                        cs.map(c => V(c.getPos().x, newY*100)),
                        false
                    )
                }
                onSubmit={(info) => {
                    renderer.render();
                    if (info.isValid && info.isFinal) /// Only add final action to history
                        history.add(info.action);
                }}
                getCustomDisplayVal={(v) => parseFloat(v.toFixed(2))}
                step={1}
                alt="Y-Position of object(s)" />
        </label>
    </div>
}
