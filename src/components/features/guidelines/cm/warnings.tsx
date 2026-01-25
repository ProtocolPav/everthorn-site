import {Badge} from "@/components/ui/badge";
import GuidelineItem from "../guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    ChatIcon,
    WrenchIcon,
    InfoIcon,
    UsersIcon,
    WarningIcon,
    GavelIcon,
    NotebookIcon
} from "@phosphor-icons/react";
import * as React from "react";

export default function WarningGuidelines() {
    return (
        <GuidelineItem name="Warning Guidelines" important>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <Alert variant={'info'}>
                        <InfoIcon weight={'duotone'} className="size-4" />
                        <AlertDescription>
                            Follow these guidelines to maintain consistency and fairness when moderating
                        </AlertDescription>
                    </Alert>

                    <Alert variant={'amber'}>
                        <WrenchIcon weight={'duotone'} className="size-4" />
                        <AlertDescription className={'flex'}>
                            Warning commands are in development. Log all warnings in <Badge variant={'command'}>#strikes</Badge> until ready.
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start gap-3">
                        <WarningIcon weight={'duotone'} className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Warning Levels</h5>
                            <p className="text-sm mb-2">
                                We use a holistic approach based on severity and impact:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>
                                    <Badge variant={'slate'}>Light</Badge> - Annoying behavior (chat spam, petty arguments, minor trolling)
                                </li>
                                <li>
                                    <Badge variant={'amber'}>Medium</Badge> - Intentional harm to individuals (killing without consent, breaking builds, theft, harassment)
                                </li>
                                <li>
                                    <Badge variant={'red'}>RED</Badge> - Severe community damage (mass griefing, event disruption, hacking). <strong>Can result in immediate major punishments without prior warnings.</strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <GavelIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>How to Issue Warnings</h5>
                            <p className="text-sm mb-2">
                                Use <Badge variant={'command'}>/warn</Badge> and select the appropriate level. For punishments (mutes, temp bans, event bans, fines), select <Badge variant={'default'}>PUNISHMENT</Badge> to log it.
                            </p>
                            <p className="text-sm">
                                Always include details: what happened, evidence, and your reasoning.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <UsersIcon weight={'duotone'} className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Minor Punishments</h5>
                            <p className="text-sm mb-2">
                                Issue these freely to de-escalate situations <strong>without needing prior warnings</strong>:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Temporary mutes (stop spam or heated arguments)</li>
                                <li>Gulags (temporary time-outs)</li>
                                <li>24-hour suspensions</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <NotebookIcon weight={'duotone'} className="size-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Check Player History</h5>
                            <p className="text-sm mb-2">
                                <Badge variant={'command'}>#player-profiles</Badge> logs all incidents per player. Always check before taking action:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Review their past offenses and patterns</li>
                                <li>Consider context - first-time mistake vs. repeat offender</li>
                                <li>Log all new incidents for other CMs</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <ChatIcon weight={'duotone'} className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Communication</h5>
                            <p className="text-sm mb-2">
                                With players:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Explain what rule was broken and why you chose this warning level</li>
                                <li>Share their current warning count and potential consequences</li>
                                <li>Give them a chance to respond</li>
                            </ul>
                            <p className="text-sm mt-3 mb-2">
                                With the CM team:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Discuss <Badge variant={'red'}>RED</Badge> warnings with another CM before issuing</li>
                                <li>Get team consensus for permanent bans when possible</li>
                                <li>Ask for input when uncertain or if you're personally involved</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}
