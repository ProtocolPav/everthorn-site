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
        iconUrl: '/textures/star.png',
        triggerClassName: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 hover:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30",
        iconClassName: "text-yellow-600/80 dark:text-yellow-400/80"
    },
    {
        value: 'question',
        label: 'Question',
        iconUrl: '/textures/question.png',
        triggerClassName: "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
        iconClassName: "text-orange-600/80 dark:text-orange-400/80"
    },
];
