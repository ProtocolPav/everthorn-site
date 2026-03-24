import { Card, CardContent } from "@/components/ui/card.tsx";
import {Icon as PhosphorIcon, PencilSimpleIcon, XIcon} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { ReactNode } from "react";
import {cn} from "@/lib/utils.ts";

interface CustomizationCardProps {
    title: string;
    icon: PhosphorIcon;
    hint: string;
    children?: ReactNode;
    onRemove: () => void;
    warning?: boolean;
}

export function CustomizationCard({ title, icon: Icon, hint, children, onRemove, warning }: CustomizationCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className={cn(warning && 'border-yellow-800', 'group/customization transition-all p-0 rounded-lg text-sm hover:bg-background/40 hover:cursor-pointer')}>
                    <CardContent className={'p-2 gap-1'}>
                        <div className={'flex justify-between gap-2'}>
                            <div className="flex items-center gap-1.5">
                                <Icon size={18} weight="fill" />
                                {title}
                                {children && (
                                    <span className="size-1.5 rounded-full bg-primary/50 shrink-0 [@media(hover:hover)]:hidden" />
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className={cn(
                                    "relative text-muted-foreground hover:text-destructive",
                                    !children && "opacity-0 pointer-events-none"
                                )}
                                onClick={onRemove}
                                type="button"
                            >
                                {children && (
                                    <PencilSimpleIcon
                                        size={10}
                                        weight="duotone"
                                        className={cn(
                                            "absolute transition-opacity",
                                            // Desktop: visible as indicator, fades on hover
                                            "opacity-40 group-hover/customization:opacity-0",
                                            // Mobile: hide it entirely, dot handles the indicator role
                                            "[@media(hover:none)]:hidden"
                                        )}
                                    />
                                )}
                                <XIcon
                                    size={14}
                                    className={cn(
                                        "transition-opacity",
                                        children
                                            ? "opacity-0 group-hover/customization:opacity-100 [@media(hover:none)]:opacity-100"
                                            : "opacity-100"
                                    )}
                                />
                            </Button>
                        </div>
                        <div className={'text-muted-foreground font-mono'}>
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
