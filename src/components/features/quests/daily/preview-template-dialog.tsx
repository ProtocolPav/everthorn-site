import { useState, type ReactNode } from "react";
import { DiceFiveIcon, SpinnerGapIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ObjectiveSummary } from "@/components/features/quests/daily/objective-summary.tsx";
import { getCustomizationHint } from "@/components/features/quests/fields/objective/quick-look.tsx";
import { CUSTOMIZATIONS, type CustomizationId } from "@/config/quests/customization-options.ts";
import { formatNamespacedId } from "@/config/minecraft-options.ts";
import { usePreviewDailyTemplateV1GuildsMeQuestsDailyTemplatesPreviewPost } from "@/api/nexuscore/daily-quests/daily-quests.ts";
import { getSubmitErrorMessage } from "@/lib/quest-orval-errors.ts";
import type { DailyQuestIn, DailyTemplateIn, RewardIn } from "@/api/nexuscore/model";

interface PreviewTemplateDialogProps {
    /**
     * Returns the template to roll, read when the dialog opens and on every
     * "Roll again" so unsaved editor changes are included. Return null to
     * cancel (e.g. the form is invalid).
     */
    getTemplate: () => DailyTemplateIn | null;
    name: string;
    trigger: ReactNode;
}

function SectionLabel({ children }: { children: ReactNode }) {
    return (
        <div className="text-section-label flex items-center gap-1.5">
            {children}
            <Separator className="flex-1" />
        </div>
    );
}

function rewardLabel(reward: RewardIn): { title: string; amount: string } {
    if (reward.balance != null) return { title: "Nugs", amount: `${reward.balance}` };
    const title = reward.display_name || (reward.item ? formatNamespacedId(reward.item) : "Item");
    return { title, amount: `×${reward.count ?? 1}` };
}

function RolledQuest({ quest }: { quest: DailyQuestIn }) {
    const objective = quest.objectives[0];
    const customizations = Object.entries(objective?.customizations ?? {}).filter(([, value]) => value != null) as [
        CustomizationId,
        Record<string, unknown>,
    ][];

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex gap-1.5">
                <Badge variant="amber" className="text-[10px] px-1.5 py-0.5 font-semibold tracking-wide">
                    Daily Quest
                </Badge>
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{quest.title}</h3>
            <p className="text-hint">{quest.description}</p>

            {objective && (
                <Card className="p-0 gap-0 bg-zinc-900/40">
                    <CardContent className="p-2.5 flex flex-col gap-2.5">
                        <div className="text-sm font-medium leading-snug">
                            <ObjectiveSummary objective={objective} />
                        </div>
                        <p className="text-hint">{objective.description}</p>

                        <SectionLabel>Customization</SectionLabel>
                        {customizations.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {customizations.map(([id, value]) => {
                                    const config = CUSTOMIZATIONS[id];
                                    const Icon = config?.icon;
                                    return (
                                        <Card key={id} className="p-0 rounded-lg text-sm">
                                            <CardContent className="p-2 flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    {Icon && <Icon size={16} weight="fill" />}
                                                    {config?.display ?? id}
                                                </span>
                                                <span className="text-hint">{getCustomizationHint(id, value)}</span>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground/50 italic">None rolled this time</p>
                        )}

                        <SectionLabel>Rewards</SectionLabel>
                        {objective.rewards.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {objective.rewards.map((reward, index) => {
                                    const { title, amount } = rewardLabel(reward);
                                    return (
                                        <Card key={index} className="p-0 rounded-lg text-sm">
                                            <CardContent className="p-2 flex items-center gap-1.5">
                                                <span>{title}</span>
                                                <span className="text-muted-foreground">{amount}</span>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground/50 italic">No rewards</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

/**
 * Rolls a template without saving anything (POST /daily/templates/preview)
 * and shows the generated quest. "Roll again" calls it again to show the
 * randomisation.
 */
export function PreviewTemplateDialog({ getTemplate, name, trigger }: PreviewTemplateDialogProps) {
    const [open, setOpen] = useState(false);
    const [rolls, setRolls] = useState(0);
    const preview = usePreviewDailyTemplateV1GuildsMeQuestsDailyTemplatesPreviewPost();

    function roll(): boolean {
        const template = getTemplate();
        if (!template) return false;
        setRolls((count) => count + 1);
        preview.mutate({ data: template });
        return true;
    }

    function handleOpenChange(next: boolean) {
        if (next && !roll()) return;
        if (!next) {
            setRolls(0);
            preview.reset();
        }
        setOpen(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-3 pr-6">
                        <DialogTitle>Preview roll: {name}</DialogTitle>
                        {rolls > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-semibold tracking-wide shrink-0">
                                Roll #{rolls}
                            </Badge>
                        )}
                    </div>
                    <DialogDescription>
                        A sample roll. Nothing is saved.
                    </DialogDescription>
                </DialogHeader>

                {preview.isPending ? (
                    <div className="flex flex-col gap-2.5">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-7 w-2/3" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : preview.isError ? (
                    <Alert variant="destructive" className="bg-destructive/5">
                        <WarningCircleIcon />
                        <AlertTitle>Couldn't roll this template</AlertTitle>
                        <AlertDescription>{getSubmitErrorMessage(preview.error)}</AlertDescription>
                    </Alert>
                ) : preview.data ? (
                    <RolledQuest quest={preview.data} />
                ) : null}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button onClick={() => roll()} disabled={preview.isPending}>
                        {preview.isPending ? <SpinnerGapIcon className="animate-spin" /> : <DiceFiveIcon />}
                        Roll again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
