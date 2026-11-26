import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface QuestSubpageHeaderProps {
    questId: string;
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
}

/** Lighter masthead for quest sub-pages (performance, player progress). */
export function QuestSubpageHeader({ questId, eyebrow, title, description, actions }: QuestSubpageHeaderProps) {
    return (
        <header className="flex flex-col gap-3 border-b px-6 py-5">
            <Link
                to="/admin/quests/$id"
                params={{ id: questId }}
                className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeftIcon className="size-3.5" />
                Back to quest
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{eyebrow}</p>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <div className="text-sm font-light text-muted-foreground">{description}</div>
                    )}
                </div>
                {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
            </div>
        </header>
    );
}
