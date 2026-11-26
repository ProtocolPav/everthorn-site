import * as React from "react";

const COARSE_POINTER_QUERY = "(pointer: coarse)";
const getServerSnapshot = () => false;

/** True on touch-first devices (phones, tablets), where the primary pointer is a finger. */
export function useCoarsePointer() {
    const subscribe = React.useCallback((onStoreChange: () => void) => {
        const mql = window.matchMedia(COARSE_POINTER_QUERY);
        mql.addEventListener("change", onStoreChange);
        return () => mql.removeEventListener("change", onStoreChange);
    }, []);

    const getSnapshot = React.useCallback(() => window.matchMedia(COARSE_POINTER_QUERY).matches, []);

    return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
