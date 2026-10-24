import { InfoIcon } from "@phosphor-icons/react";

/** Marks a region as preview data so nobody mistakes it for live API output. */
export function PreviewNotice({ children }: { children: React.ReactNode }) {
    return (
        <p className="flex items-start gap-2 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-[11px] font-light leading-relaxed text-muted-foreground">
            <InfoIcon className="mt-px size-3.5 shrink-0" weight="duotone" />
            <span>{children}</span>
        </p>
    );
}
