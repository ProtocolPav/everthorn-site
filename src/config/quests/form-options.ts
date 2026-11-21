import {SeamlessSelectOption} from "@/components/common/seamless-select.tsx";
import {
    AlienIcon,
    CheckCircleIcon,
    ClockCounterClockwiseIcon, CommandIcon, CursorClickIcon,
    HandWavingIcon, MapPinAreaIcon, PackageIcon,
    SealQuestionIcon, ShovelIcon, SwordIcon,
} from "@phosphor-icons/react";
import {ObjectiveOutLogic, ObjectiveOutObjectiveType} from "@/api/nexuscore/model";

export const QUEST_TYPES: SeamlessSelectOption[] = [
    {
        value: 'minor',
        label: 'Minor Quest',
        icon: HandWavingIcon,
        triggerClassName: "bg-neutral-500/10 text-neutral-700 border-neutral-500/20 hover:bg-neutral-500/20 dark:text-neutral-300 dark:border-neutral-500/30",
        iconClassName: "text-neutral-600 dark:text-neutral-400",
        info: 'Typically have 1-2 objectives and run for only a few days'
    },
    {
        value: 'story',
        label: 'Story Quest',
        icon: CheckCircleIcon,
        triggerClassName: "bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30",
        iconClassName: "text-violet-600 dark:text-violet-400",
        info: 'Part of a larger storyline. Has more objectives, and more story infused'
    },
    {
        value: 'weekly',
        label: 'Weekly Quest',
        icon: SealQuestionIcon,
        triggerClassName: "bg-sky-500/10 text-sky-700 border-sky-500/20 hover:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
        iconClassName: "text-sky-600 dark:text-sky-400",
        info: 'Normal weekly quests. These replace Side Quests.'
    },
    {
        value: 'side',
        label: 'Side Quest',
        icon: ClockCounterClockwiseIcon,
        triggerClassName: "bg-sky-500/10 text-sky-700 border-sky-500/20 hover:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
        iconClassName: "text-sky-600 dark:text-sky-400",
        disabled: true,
        hidden: true
    },
];

export const OBJECTIVE_TYPES: SeamlessSelectOption[] = [
    {
        value: ObjectiveOutObjectiveType.kill,
        label: 'Kill',
        icon: SwordIcon
    },
    {
        value: ObjectiveOutObjectiveType.mine,
        label: 'Mine',
        icon: ShovelIcon
    },
    {
        value: ObjectiveOutObjectiveType.visit,
        label: 'Locate',
        icon: MapPinAreaIcon
    },
    {
        value: 'interact',
        label: 'Interact',
        icon: CursorClickIcon,
        disabled: true
    },
    {
        value: 'deliver',
        label: 'Drop Off',
        icon: PackageIcon,
        disabled: true
    },
    {
        value: 'boss',
        label: 'Kill Boss',
        icon: AlienIcon,
        triggerClassName: "bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20 dark:text-red-300 dark:border-red-500/30",
        iconClassName: "text-red-600 dark:text-red-400",
        disabled: true
    },
    {
        value: ObjectiveOutObjectiveType.scriptevent,
        label: 'Custom Script',
        icon: CommandIcon,
        triggerClassName: "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
        iconClassName: "text-orange-600 dark:text-orange-400",
        info: "For fine-grained customization using command blocks"
    }
];

export const LOGIC_OPTIONS: SeamlessSelectOption[] = [
    {
        value: ObjectiveOutLogic.and,
        label: "and"
    },
    {
        value: ObjectiveOutLogic.or,
        label: "or"
    },
    {
        value: ObjectiveOutLogic.sequential,
        label: "then",
        info: "All targets must be completed in sequence"
    },
];
