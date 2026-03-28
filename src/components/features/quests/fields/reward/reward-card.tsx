import { Icon as PhosphorIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

interface RewardCardProps {
    title: string;
    icon: PhosphorIcon;
    hint: string;
    children: ReactNode;
    onRemove: () => void;
    buttonContent?: ReactNode; // overrides the default [Icon Title] button content
    hasErrors?: boolean;
}

export function RewardCard({ title, icon: Icon, hint, children, onRemove, buttonContent, hasErrors }: RewardCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className={cn("group/reward transition-all p-0 rounded-lg text-sm hover:bg-background/40", hasErrors && "border-destructive")}>
                    <CardContent className="p-2 gap-1">
                        <div className="flex items-start justify-between gap-2">
                            <Button
                                variant="invisible"
                                size="sm"
                                type="button"
                                className="h-auto p-0 gap-1.5 justify-start text-left font-medium text-foreground hover:bg-transparent"
                            >
                                {buttonContent ?? (
                                    <>
                                        <Icon size={16} weight="fill" />
                                        <span className="truncate">{title}</span>
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                type="button"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={onRemove}
                            >
                                <XIcon size={14} />
                            </Button>
                        </div>

                        <div className="text-hint">
                            {hint}
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <div className="space-y-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
