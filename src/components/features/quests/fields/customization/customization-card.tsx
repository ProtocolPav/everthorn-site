import { Card, CardContent } from "@/components/ui/card.tsx";
import { TrashIcon, Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx";
import { ReactNode } from "react";

interface CustomizationFieldProps {
    title: string;
    icon: PhosphorIcon;
    hint: string;
    children?: ReactNode;
    onRemove: () => void;
}

export function CustomizationField({ title, icon: Icon, hint, children, onRemove }: CustomizationFieldProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {/*border-yellow-800*/}
                <Card className={'group/customization transition-all p-0 rounded-lg text-sm hover:bg-background/40'}>
                    <CardContent className={'p-2 gap-1'}>
                        <div className={'flex justify-between gap-1'}>
                            <div className="flex items-center gap-1">
                                <Icon size={18} weight={'fill'}/>
                                {title}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground opacity-0 group-hover/customization:opacity-100 hover:text-destructive"
                                onClick={onRemove}
                                type="button"
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                        <div className={'text-muted-foreground font-mono'}>
                            {hint}
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            {children && (
                <DialogContent showCloseButton={false} className={'p-2'}>
                    {children}
                </DialogContent>
            )}
        </Dialog>
    );
}
