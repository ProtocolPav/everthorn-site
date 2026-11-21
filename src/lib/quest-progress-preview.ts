import { getQuestLifecycle } from "@/lib/quest-lifecycle";
import type {
    CustomizationProgress,
    ObjectiveOut,
    ObjectiveProgressOut,
    ObjectiveProgressOutStatus,
    QuestOut,
    QuestProgressOut,
    QuestProgressOutStatus,
} from "@/api/nexuscore/model";

/**
 * Preview data for the quest hub's player lists.
 *
 * There is no endpoint that lists the players of a quest yet, so this module
 * fabricates deterministic players from the quest's own objectives. Swapping
 * this for a real hook later only touches the hub route + the user page.
 */

export interface PreviewPerson {
    thorny_id: number;
    username: string;
    gamertag: string | null;
    role: string;
}

export interface PreviewPlayer extends PreviewPerson {
    progress: QuestProgressOut;
}

const PEOPLE: PreviewPerson[] = [
    { thorny_id: 10421, username: "wren", gamertag: "WrenTheBold", role: "Patron" },
    { thorny_id: 10422, username: "atlas", gamertag: "AtlasVale", role: "Member" },
    { thorny_id: 10423, username: "juniper", gamertag: "JuneBug", role: "Member" },
    { thorny_id: 10424, username: "sable", gamertag: "SableNight", role: "Patron" },
    { thorny_id: 10425, username: "oak", gamertag: "Oakenshield", role: "Member" },
    { thorny_id: 10426, username: "marlow", gamertag: "MarlowFox", role: "Member" },
    { thorny_id: 10427, username: "eden", gamertag: "EdenRose", role: "Member" },
    { thorny_id: 10428, username: "rune", gamertag: "RuneCarver", role: "Member" },
    { thorny_id: 10429, username: "pike", gamertag: "PikeTheQuick", role: "Member" },
    { thorny_id: 10430, username: "clover", gamertag: "CloverField", role: "Member" },
    { thorny_id: 10431, username: "ashen", gamertag: "AshenWisp", role: "Member" },
    { thorny_id: 10432, username: "nix", gamertag: "NixUnder", role: "Member" },
];

interface Scenario {
    status: QuestProgressOutStatus;
    /** Number of objectives already completed (clamped per quest). */
    step: number;
    /** 0–1 progress inside the current objective. */
    fraction: number;
}

const SCENARIOS: Scenario[] = [
    { status: "active", step: 2, fraction: 0.6 },
    { status: "active", step: 1, fraction: 0.35 },
    { status: "pending", step: 0, fraction: 0 },
    { status: "active", step: 3, fraction: 0.8 },
    { status: "completed", step: 99, fraction: 1 },
    { status: "completed", step: 99, fraction: 1 },
    { status: "completed", step: 99, fraction: 1 },
    { status: "failed", step: 2, fraction: 0.5 },
    { status: "failed", step: 1, fraction: 0.2 },
];

const PREVIEW_PLAYER_COUNT = 9;

function sortedObjectives(quest: QuestOut): ObjectiveOut[] {
    return [...quest.objectives].sort((a, b) => a.order_index - b.order_index);
}

function buildTargetProgress(objective: ObjectiveOut, fraction: number): ObjectiveProgressOut["target_progress"] {
    return objective.targets.map((target) => {
        const required = target.count;
        const current = Math.max(0, Math.min(required, Math.round(required * fraction)));

        if (target.target_type === "visit") {
            return {
                target_uuid: target.target_uuid,
                target_type: "visit",
                count: current,
                seconds: Math.round((target.seconds ?? 0) * fraction),
            };
        }

        return {
            target_uuid: target.target_uuid,
            target_type: target.target_type,
            count: current,
        };
    }) as ObjectiveProgressOut["target_progress"];
}

function buildCustomizationProgress(objective: ObjectiveOut, fraction: number): CustomizationProgress {
    const max = objective.customizations.maximum_deaths;
    if (!max) return {};

    const deaths = fraction >= 1 ? 0 : Math.min(max.deaths, Math.round((1 - fraction) * max.deaths));
    return { maximum_deaths: { deaths } };
}

function buildObjectiveProgress(
    objective: ObjectiveOut,
    status: ObjectiveProgressOutStatus,
    fraction: number,
    index: number,
    baseMs: number,
): ObjectiveProgressOut {
    const start = new Date(baseMs + index * 20 * 60_000).toISOString();
    const end = new Date(baseMs + (index + 1) * 20 * 60_000).toISOString();

    return {
        progress_id: 0,
        objective_id: objective.objective_id,
        start_time: status === "pending" ? null : start,
        end_time: status === "completed" || status === "failed" ? end : null,
        status,
        target_progress: buildTargetProgress(objective, fraction),
        customization_progress: buildCustomizationProgress(objective, fraction),
    };
}

function buildPlayer(quest: QuestOut, person: PreviewPerson, scenario: Scenario, index: number): PreviewPlayer {
    const objectives = sortedObjectives(quest);
    const total = objectives.length;
    const step =
        scenario.status === "completed" ? total : Math.min(scenario.step, Math.max(0, total - 1));

    const progressObjectives = objectives.map((objective, objectiveIndex) => {
        let status: ObjectiveProgressOutStatus = "pending";
        let fraction = 0;

        if (scenario.status === "completed") {
            status = "completed";
            fraction = 1;
        } else if (scenario.status === "failed") {
            if (objectiveIndex < step) {
                status = "completed";
                fraction = 1;
            } else if (objectiveIndex === step) {
                status = "failed";
                fraction = scenario.fraction;
            }
        } else if (scenario.status === "active") {
            if (objectiveIndex < step) {
                status = "completed";
                fraction = 1;
            } else if (objectiveIndex === step) {
                status = "active";
                fraction = scenario.fraction;
            }
        }

        const baseMs = new Date(quest.start_time).getTime();
        return buildObjectiveProgress(objective, status, fraction, objectiveIndex, baseMs);
    });

    const baseMs = new Date(quest.start_time).getTime();
    const acceptedAt = baseMs + index * 20 * 60_000;
    const finished = scenario.status === "completed" || scenario.status === "failed";

    return {
        ...person,
        progress: {
            progress_id: 9000 + index,
            thorny_id: person.thorny_id,
            quest_id: quest.quest_id,
            accept_time: new Date(acceptedAt).toISOString(),
            start_time: scenario.status === "pending" ? null : new Date(acceptedAt + 5 * 60_000).toISOString(),
            end_time: finished ? new Date(acceptedAt + (index + 2) * 60 * 60_000).toISOString() : null,
            status: scenario.status,
            objectives: progressObjectives,
        },
    };
}

/** Players for the hub's lists. A scheduled quest has none; an expired one has only finished players. */
export function getPreviewPlayers(quest: QuestOut): PreviewPlayer[] {
    const lifecycle = getQuestLifecycle(quest);
    if (lifecycle === "scheduled") return [];

    return PEOPLE.slice(0, PREVIEW_PLAYER_COUNT).map((person, index) => {
        let scenario = SCENARIOS[index % SCENARIOS.length];

        if (lifecycle === "expired" && (scenario.status === "active" || scenario.status === "pending")) {
            scenario = { ...scenario, status: "failed" };
        }

        return buildPlayer(quest, person, scenario, index);
    });
}

export function getPreviewPlayer(quest: QuestOut, thornyId: number): PreviewPlayer | null {
    return getPreviewPlayers(quest).find((player) => player.thorny_id === thornyId) ?? null;
}

/** People who could be added to the quest (the tail of the roster, unused by the lists). */
export function getPreviewCandidates(quest: QuestOut): PreviewPerson[] {
    if (getQuestLifecycle(quest) === "scheduled") return [];
    return PEOPLE.slice(PREVIEW_PLAYER_COUNT);
}
