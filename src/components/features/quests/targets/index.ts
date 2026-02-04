import {TargetComponent, TargetRegistryEntry, TargetType} from "./types";
import {KillTarget} from "./kill-target";
import {MineTarget} from "./mine-target";
import {ScriptEventTarget} from "./scriptevent-target";

export * from "./types";

const targetRegistry = new Map<TargetType, TargetRegistryEntry>();

export function registerTarget(entry: TargetRegistryEntry): void {
    targetRegistry.set(entry.type, entry);
}

export function getTargetComponent(type: TargetType): TargetComponent | undefined {
    return targetRegistry.get(type)?.component;
}

export function getTargetLabel(type: TargetType): string {
    return targetRegistry.get(type)?.label ?? type;
}

registerTarget({
    type: "kill",
    component: KillTarget,
    label: "Kill",
});

registerTarget({
    type: "mine",
    component: MineTarget,
    label: "Mine",
});

registerTarget({
    type: "scriptevent",
    component: ScriptEventTarget,
    label: "Custom Script",
});
