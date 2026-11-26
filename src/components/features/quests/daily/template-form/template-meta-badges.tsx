import { ScalesIcon, SunIcon, UserIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { withTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { useGetUserV1GuildsMeUsersThornyIdGet } from "@/api/nexuscore/users/users.ts";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyTemplateFormValues } from "@/lib/schemas/daily-template-form.tsx";

/** Same size and shape as the quest editor's SeamlessSelect badges. */
const badgeTrigger = "h-7 px-2.5 py-0.5 rounded-md border text-xs font-medium shadow-none gap-1.5";

function CreatorName({ thornyId }: { thornyId: number | undefined }) {
    const { data: user } = useGetUserV1GuildsMeUsersThornyIdGet(thornyId ?? 0, { query: { enabled: !!thornyId } });
    if (!thornyId) return <span className="text-muted-foreground">Pick a creator</span>;
    return <>{user?.username ?? `Thorny #${thornyId}`}</>;
}

interface TemplateMetaBadgesProps {
    /** Other enabled templates' total weight, to show this template's share of days. */
    otherEnabledWeight: number;
}

/**
 * The badge row under the template name, where the quest editor has the
 * quest type and dates: Daily Template, Enabled, Weight and Creator.
 */
export const TemplateMetaBadges = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: {} as TemplateMetaBadgesProps,
    render: function Render({ form, otherEnabledWeight }) {
        const { thornyUser } = useEverthornMember();

        return (
            <div className="flex flex-wrap items-center gap-2">
                <Badge
                    variant="outline"
                    className={cn(badgeTrigger, "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300 dark:border-amber-500/30")}
                >
                    <SunIcon className="text-amber-600 dark:text-amber-400" />
                    Daily Template
                </Badge>

                <form.AppField
                    name="enabled"
                    children={(field) => (
                        <Button
                            type="button"
                            variant="outline"
                            role="switch"
                            aria-checked={field.state.value}
                            onClick={() => field.handleChange(!field.state.value)}
                            className={cn(
                                badgeTrigger,
                                field.state.value
                                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                                    : "text-muted-foreground",
                            )}
                        >
                            <span
                                className={cn("size-1.5 rounded-full", field.state.value ? "bg-emerald-500" : "bg-muted-foreground/40")}
                                aria-hidden="true"
                            />
                            {field.state.value ? "Enabled" : "Disabled"}
                        </Button>
                    )}
                />

                <form.Subscribe
                    selector={(state) => ({ weight: state.values.weight, enabled: state.values.enabled })}
                    children={({ weight, enabled }) => {
                        const value = Number(weight) || 0;
                        const share = enabled && value > 0 ? value / (otherEnabledWeight + value) : 0;
                        return (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button type="button" variant="outline" className={badgeTrigger}>
                                        <ScalesIcon />
                                        Weight {weight}
                                        {enabled && (
                                            <span className="font-normal text-muted-foreground">· ~{Math.round(share * 100)}% of days</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3" align="start">
                                    <form.AppField
                                        name="weight"
                                        children={(field) => (
                                            <div className="flex flex-col gap-1.5">
                                                <Label htmlFor="template-weight" className="text-xs text-muted-foreground">
                                                    Weight
                                                </Label>
                                                <Input
                                                    id="template-weight"
                                                    type="number"
                                                    min={1}
                                                    autoFocus
                                                    value={field.state.value ?? ""}
                                                    aria-invalid={!field.state.meta.isValid}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value))
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                </PopoverContent>
                            </Popover>
                        );
                    }}
                />

                <form.AppField
                    name="created_by"
                    children={(field) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(badgeTrigger, !field.state.meta.isValid && "ring-2 ring-destructive")}
                                >
                                    <UserIcon />
                                    <CreatorName thornyId={field.state.value} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-3" align="start">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="template-creator" className="text-xs text-muted-foreground">
                                        Creator's Thorny ID
                                    </Label>
                                    <Input
                                        id="template-creator"
                                        type="number"
                                        value={field.state.value ?? ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value))
                                        }
                                    />
                                    {thornyUser && thornyUser.thorny_id !== field.state.value && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => field.handleChange(thornyUser.thorny_id)}
                                        >
                                            Credit to me ({thornyUser.username})
                                        </Button>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                />
            </div>
        );
    },
});
