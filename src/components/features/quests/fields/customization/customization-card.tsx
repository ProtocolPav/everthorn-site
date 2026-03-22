import { Card, CardContent } from "@/components/ui/card.tsx";
import {Icon as PhosphorIcon, PencilIcon, XIcon} from "@phosphor-icons/react";
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
                <Card className={cn(warning && 'border-yellow-800', 'group/customization transition-all p-0 rounded-lg text-sm hover:bg-background/40')}>
                    <CardContent className={'p-2 gap-1'}>
                        <div className={'flex justify-between gap-2'}>
                            <div className="flex items-center gap-1">
                                <Icon size={18} weight={'fill'}/>
                                {title}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className={cn(
                                    "relative text-muted-foreground hover:text-destructive",
                                    children ? "opacity-100" : "opacity-0",
                                    "group-hover/customization:opacity-100"
                                )}
                                onClick={onRemove}
                                type="button"
                            >
                                {children && (
                                    <PencilIcon
                                        size={10}
                                        weight="duotone"
                                        className="transition-opacity group-hover/customization:opacity-0"
                                    />
                                )}
                                <XIcon
                                    className={cn(
                                        "transition-opacity",
                                        children ? "absolute opacity-0 group-hover/customization:opacity-100" : ""
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
                <DialogContent showCloseButton={false} className="p-2 sm:max-w-md">
                    <DialogTitle className="sr-only">{title}</DialogTitle>
                    <div className="space-y-4">
                        {children}
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}
