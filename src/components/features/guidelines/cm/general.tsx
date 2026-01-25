import {Badge} from "@/components/ui/badge";
import GuidelineItem from "../guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    ChatIcon,
    GlobeIcon,
    HandDepositIcon,
    HeartIcon,
    InfoIcon,
    VoicemailIcon,
    WrenchIcon,
    XCircleIcon
} from "@phosphor-icons/react";
import * as React from "react";

export default function GeneralDuties() {
    return (
        <GuidelineItem name="General Duties" important>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <Alert variant={'info'}>
                        <InfoIcon weight={'duotone'} className="size-4" />
                        <AlertDescription>
                            All CMs should follow these guidelines to the best of their abilities
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start gap-3">
                        <HeartIcon weight={'duotone'} className="size-5 text-fuchsia-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Be fair and respectful</h5>
                            <p className="text-sm">
                                No matter who it is, or what they did, always be fair and respectful when speaking with them.
                                De-escalate situations when appropriate
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <HandDepositIcon weight={'duotone'} className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Be Active and Participate</h5>
                            <p className="text-sm">
                                You should be in the loop of what's going on in the server.
                                Follow events, learn who new players are, and be in the loop!
                            </p>

                            <p className="text-sm">
                                Answering questions as soon as you can is also good. Help other people :))
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <ChatIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Communicate</h5>
                            <p className="text-sm mb-2">
                                Communication is key for a thriving CM Team. We have these systems set up:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Any drama between people is reported in <Badge variant={'command'}>#player-profiles</Badge></li>
                                <li>Any news is reported in <Badge variant={'command'}>#information</Badge></li>
                                <li>Other, general discussion goes on in <Badge variant={'command'}>#general</Badge></li>
                                <li>Regular CM meetings should be happening, at least once a month, but ideally weekly.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}