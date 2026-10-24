import { cn } from "@/lib/utils";
import type { ObjectiveProgressOutStatus, QuestProgressOutStatus } from "@/api/nexuscore/model";

type Status = QuestProgressOutStatus | ObjectiveProgressOutStatus;

const config: Record<Status, { label: string; dot: string; text: string }> = {
    pending: { label: "Pending", dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
    active: { label: "Active", dot: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
    completed: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
    failed: { label: "Failed", dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
};

interface ProgressStatusProps {
    status: Status;
    label?: string;
    className?: string;
}

/** Dot + label status used across the player rows and the progress editor. */
export function ProgressStatus({ status, label, className }: ProgressStatusProps) {
    const value = config[status];

    return (
        <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", value.text, className)}>
            <span className={cn("size-1.5 shrink-0 rounded-full", value.dot)} aria-hidden="true" />
            {label ?? value.label}
        </span>
    );
}
