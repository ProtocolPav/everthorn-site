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
import {Badge} from "@/components/ui/badge"; // Assuming you have a util, otherwise standard template literals work

export default function StrikesRules() {
    return (
        <GuidelineItem name={'Warning System'} important>
            <div className="grid gap-6">

                <Alert variant={'info'}>
                    <InfoIcon weight={'duotone'} className="size-4" />
                    <AlertDescription>
                        <div>
                            Our goal is a fair environment. We use a <strong>3 Strikes</strong> system.
                            You typically face punishment only after accumulating 3 active warnings,
                            with severity based on how quickly you accumulated them.
                        </div>
                    </AlertDescription>
                </Alert>

                <div className="flex items-start gap-3">
                    <WarningIcon weight={'duotone'} className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h5>Warning Levels</h5>
                        <p className="text-sm mb-2">We have 3 levels of warning, corresponding to the severity of your actions.</p>
                        <ul className="text-sm grid gap-2 list-disc pl-4">
                            <li>
                                <Badge variant={'slate'} className={'mr-2'}>Light Warning</Badge>
                                Minor infractions like avoidable mistakes, petty arguing, or chat spam.
                            </li>

                            <li>
                                <Badge variant={'amber'} className={'mr-2'}>Medium Warning</Badge>
                                Serious issues such as in-game killing, breaking builds, theft, or toxic arguments.
                            </li>

                            <li>
                                <Badge variant={'red'} className={'mr-2'}>RED Warning</Badge>
                                Critical violations like griefing,
                                mass killing, or disrupting events. <strong>
                                    These carry permanent consequences.
                                </strong>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <ClockIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h5>3 Strikes System</h5>
                        <p className="text-sm mb-2">Once is a mistake, twice is intentional, three times is plain disrespect</p>
                        <ul className="text-sm grid gap-2 list-disc pl-4">
                            <li>
                                We only look at your <strong>3 most recent</strong> warnings.
                                Older warnings "expire" as new ones come in.
                            </li>

                            <li>
                                Punishments are based on warning frequency. Getting 3 warnings in a week will result in a
                                much harsher punishment than 3 warnings in 4 months.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <XCircleIcon weight={'duotone'} className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h5>The <span className={'text-red-600'}>RED</span> Rule</h5>
                        <p className="text-sm mb-2">Red warnings are the highest level you can get, and work differently.</p>
                        <ul className="text-sm grid gap-2 list-disc pl-4">
                            <li>
                                <Badge variant={'red'}>RED Warnings</Badge> are permanent, and never expire.
                            </li>

                            <li>
                                Punishments can be given immediately, regardless of warning counts.
                            </li>
                        </ul>

                        <Alert className={'mt-3'}>
                            <InfoIcon weight={'duotone'} className="size-4" />
                            <AlertDescription>
                                <div>
                                    Because Red Warnings never expire, your strikes threshold drops permanently.
                                    Instead of 3 strikes, <strong>you will face CM Action after just 2 strikes</strong>.
                                </div>
                            </AlertDescription>
                        </Alert>
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

                    <div>
                        All decisions are made at <strong>CM discretion</strong> based on the specific situation, context, and intent behind your actions.
                    </div>

                    <div>
                        We may take minor actions to de-escalate situations, such as muting or giving a 24-hour suspension. <strong>Such actions do not require previous warnings.</strong>

                    </div>
                </div>

            </div>
        </GuidelineItem>
    )
}
