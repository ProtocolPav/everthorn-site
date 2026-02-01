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

export function createDefaultTarget(type: TargetType) {
    switch (type) {
        case "kill":
            return {
                target_type: "kill" as const,
                count: 1,
                entity: "",
            };
        case "mine":
            return {
                target_type: "mine" as const,
                count: 1,
                block: "",
            };
        case "scriptevent":
            return {
                target_type: "scriptevent" as const,
                count: 1,
                script_id: "",
            };
        default:
            throw new Error(`Unknown target type: ${type}`);
    }
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
