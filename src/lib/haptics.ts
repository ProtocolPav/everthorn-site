/**
 * Best-effort haptic feedback for touch UI.
 *
 * Android Chrome exposes the Vibration API. iOS Safari doesn't, but since iOS 18 toggling a native
 * `<input type="checkbox" switch>` plays the system "selection" tick, so we keep a hidden one
 * around and click it. Both only fire inside a user gesture, and both silently do nothing where
 * unsupported (desktop, older iOS, haptics turned off in system settings).
 */

export type HapticKind = "grab" | "tick" | "limit";

const VIBRATION_PATTERNS: Record<HapticKind, number | number[]> = {
    grab: 8,
    tick: 12,
    limit: [14, 50, 14],
};

let iosSwitch: HTMLLabelElement | null = null;

function supportsVibration() {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

function getIosSwitch() {
    if (iosSwitch?.isConnected) return iosSwitch;

    const label = document.createElement("label");
    label.ariaHidden = "true";
    label.style.cssText = "position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.tabIndex = -1;
    input.setAttribute("switch", "");
    label.appendChild(input);
    document.body.appendChild(label);

    iosSwitch = label;
    return label;
}

export function haptic(kind: HapticKind) {
    if (typeof window === "undefined") return;

    if (supportsVibration()) {
        navigator.vibrate(VIBRATION_PATTERNS[kind]);
        return;
    }

    // iOS gives one kind of tick only; play it twice for a limit so it still reads differently
    const label = getIosSwitch();
    label.click();
    if (kind === "limit") window.setTimeout(() => label.click(), 60);
}
