import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {InfoIcon} from "@phosphor-icons/react";
import {ReactNode} from "react";

interface FieldInfoTooltipProps {
    children: ReactNode
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
}

export function FieldInfoTooltip({children, side = "bottom", align = "end"}: FieldInfoTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors cursor-default">
                    <InfoIcon size={16} weight="fill" />
                </span>
            </TooltipTrigger>
            <TooltipContent align={align} side={side}>
                {children}
            </TooltipContent>
        </Tooltip>
    )
}
