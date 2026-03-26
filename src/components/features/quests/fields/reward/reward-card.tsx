import { Icon as PhosphorIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { ReactNode } from "react";

interface RewardCardProps {
    title: string;
    icon: PhosphorIcon;
    hint: string;
    children: ReactNode;
    onRemove: () => void;
    buttonContent?: ReactNode; // overrides the default [Icon Title] button content
}

export function RewardCard({ title, icon: Icon, hint, children, onRemove, buttonContent }: RewardCardProps) {
    return (
        <Dialog>
            <Tooltip>
                <ButtonGroup>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" type="button" className="gap-1.5">
                                {buttonContent ?? (
                                    <>
                                        <Icon size={14} weight="fill" />
                                        {title}
                                    </>
                                )}
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        className="px-1.5 text-muted-foreground hover:text-destructive"
                        onClick={onRemove}
                    >
                        <XIcon size={12} />
                    </Button>
                </ButtonGroup>
                <TooltipContent side="bottom">
                    {hint}
                </TooltipContent>
            </Tooltip>

            <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <div className="space-y-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
