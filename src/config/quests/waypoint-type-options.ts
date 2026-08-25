export interface WaypointTypeOption {
    value: string;
    label: string;
    /** URL to the PNG icon of how the waypoint looks in-game */
    iconUrl?: string;
    triggerClassName?: string;
    iconClassName?: string;
}

export const WAYPOINT_TYPE_OPTIONS: WaypointTypeOption[] = [
    {
        value: 'star',
        label: 'Star',
        triggerClassName: "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
        iconClassName: "text-amber-600/80 dark:text-amber-400/80"
    },
    {
        value: 'question',
        label: 'Question',
        triggerClassName: "bg-sky-500/10 text-sky-700 border-sky-500/20 hover:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30",
        iconClassName: "text-sky-600/80 dark:text-sky-400/80"
    },
];
