import type {Event} from "core/utils/Events";
import type {Input} from "core/utils/Input";
import type {Key}   from "core/utils/Key";

import {useEffect} from "react";


export const useKeyDownEvent = (input: Input, key: Key, f: () => void, deps?: React.DependencyList) => {
    useEffect(() => {
        if (!input)
            return;

        const LookForKey = (ev: Event) => {
            if (ev.type === "keydown" && ev.key === key)
                f();
        }

        input.addListener(LookForKey);

        return () => input.removeListener(LookForKey);
    }, [input, key, ...(deps ?? [])]);
}

export const useWindowKeyDownEvent = (key: Key, f: () => void, deps?: React.DependencyList) => {
    useEffect(() => {
        const LookForKey = (ev: KeyboardEvent) => {
            if (!(document.activeElement instanceof HTMLInputElement) && ev.key === key)
                f();
        }

        window.addEventListener("keydown", LookForKey);

        return () => window.removeEventListener("keydown", LookForKey);
    }, [key, ...(deps ?? [])]);
}

