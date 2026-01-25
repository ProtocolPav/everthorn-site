import GuidelineItem from "./guideline-item";
import {
    WarningIcon,
    XCircleIcon,
    ShieldWarningIcon,
    GavelIcon,
    ClockIcon,
    ArrowRightIcon, InfoIcon, CheckCircleIcon, BoundingBoxIcon, LineVerticalIcon, CaretRightIcon
} from "@phosphor-icons/react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";

export default function StrikesRules() {
    return (
        <GuidelineItem name={'Warning System'} important>
            <div className="grid gap-6">

                <Alert variant={'info'}>
                    <InfoIcon weight={'duotone'} className="size-4" />
                    <AlertDescription>
                        We use a <strong>3 Warnings</strong> system for fairness.
                        Punishments typically apply after 3 active warnings, with severity based on how quickly they were accumulated.
                    </AlertDescription>
                </Alert>

                <div className="flex items-start gap-3">
                    <WarningIcon weight={'duotone'} className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h5>Warning Levels</h5>
                        <p className="text-sm mb-2">Three levels corresponding to severity:</p>
                        <ul className="text-sm grid gap-2 list-disc pl-4">
                            <li>
                                <Badge variant={'slate'} className={'mr-2'}>Light Warning</Badge>
                                Minor issues like avoidable mistakes, petty arguing, or chat spam.
                            </li>

                            <li>
                                <Badge variant={'amber'} className={'mr-2'}>Medium Warning</Badge>
                                Serious issues like in-game killing, breaking builds, theft, or toxic arguments.
                            </li>

                            <li>
                                <Badge variant={'red'} className={'mr-2'}>RED Warning</Badge>
                                Critical violations like griefing, mass killing, or disrupting events. <strong>These are permanent.</strong>
                            </li>
                        </ul>

                        <div className={'text-xs mt-2 text-muted-foreground'}>
                            Examples are indicative only and don't represent all possible actions.
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <ClockIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h5>How It Works</h5>
                        <p className="text-sm mb-2">Once is a mistake, twice is intentional, three times is disrespect.</p>
                        <ul className="text-sm grid gap-2 list-disc pl-4">
                            <li>
                                Only your <strong>3 most recent</strong> warnings count. Older ones expire as new ones come in.
                            </li>

                            <li>
                                Punishment severity depends on frequency. 3 warnings in a week results in harsher consequences than 3 warnings over 4 months.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <XCircleIcon weight={'duotone'} className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h5>The <span className={'text-red-600'}>RED</span> Rule</h5>
                        <p className="text-sm mb-2">Red warnings work differently:</p>
                        <ul className="text-sm grid gap-2 list-disc pl-4">
                            <li>
                                <Badge variant={'red'}>RED Warnings</Badge> never expire and are <strong>always</strong> considered in CM decisions.
                            </li>

                            <li>
                                Each RED lowers your punishment threshold. 0 REDs = 3 warnings needed. 1 RED = 2 warnings needed.
                            </li>

                            <li>
                                CMs may issue immediate punishments regardless of warning count.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-muted/30 grid gap-2 rounded-md p-4 border border-border/50">
                    <div className={'flex flex-col md:flex-row gap-4 md:items-center justify-between'}>
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                            <GavelIcon className="size-4" />
                            Punishments & CM Discretion
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>Mutes</span>
                            <LineVerticalIcon className="size-3 opacity-50" />
                            <span>Fines</span>
                            <LineVerticalIcon className="size-3 opacity-50" />
                            <span>Event Bans</span>
                            <LineVerticalIcon className="size-3 opacity-50" />
                            <span>Temp Bans</span>
                            <LineVerticalIcon className="size-3 opacity-50" />
                            <span className="text-red-600 font-medium">Permanent Ban</span>
                        </div>
                    </div>

                    <div className="text-sm">
                        All decisions are made at <strong>CM discretion</strong> based on context, situation, and intent.
                    </div>

                    <div className="text-sm">
                        Minor actions (mutes, 24h suspensions) may be issued immediately to de-escalate situations <strong>without requiring prior warnings</strong>.
                    </div>
                </div>

            </div>
        </GuidelineItem>
    )
}
