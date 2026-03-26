import { Card, CardContent } from "@/components/ui/card.tsx";
import { Icon as PhosphorIcon, PencilSimpleIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

interface RewardCardProps {
    title: string;
    icon: PhosphorIcon;
    hint: string;
    children?: ReactNode;
    onRemove: () => void;
}

export function RewardCard({ title, icon: Icon, hint, children, onRemove }: RewardCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="group/reward transition-all p-0 rounded-lg text-sm hover:bg-background/40 hover:cursor-pointer">
                    <CardContent className="p-2 gap-1">
                        <div className="flex justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                                <Icon size={18} weight="fill" />
                                {title}
                            </div>

                            {children && (
                                <Button
                                    variant="invisible"
                                    size="icon-sm"
                                    type="button"
                                    className="[@media(hover:hover)]:hidden"
                                >
                                    <PencilSimpleIcon weight="duotone" />
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="relative text-muted-foreground hover:text-destructive"
                                onClick={onRemove}
                                type="button"
                            >
                                {children && (
                                    <PencilSimpleIcon
                                        size={10}
                                        weight="duotone"
                                        className={cn(
                                            "absolute transition-opacity",
                                            "opacity-40 group-hover/reward:opacity-0",
                                            "[@media(hover:none)]:hidden"
                                        )}
                                    />
                                )}
                                <XIcon
                                    size={14}
                                    className={cn(
                                        "transition-opacity",
                                        children
                                            ? "opacity-0 group-hover/reward:opacity-100 [@media(hover:none)]:opacity-100"
                                            : "opacity-100"
                                    )}
                                />
                            </Button>
                        </div>
                        <div className="text-muted-foreground font-mono">
                            {hint}
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>

            {children && (
                <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                    <DialogTitle className="sr-only">{title}</DialogTitle>
                    <div className="space-y-4">
                        {children}
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}
