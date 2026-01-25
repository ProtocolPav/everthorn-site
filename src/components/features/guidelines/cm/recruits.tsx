import {Badge} from "@/components/ui/badge";
import GuidelineItem from "../guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    BookIcon,
    FolderPlusIcon,
    HandWavingIcon,
    HardDrivesIcon,
    ImageBrokenIcon,
    InfoIcon, PlusCircleIcon,
    QuestionMarkIcon
} from "@phosphor-icons/react";

export default function NewRecruitProcedures() {
    return (
        <GuidelineItem name="Newbie Welcoming" important>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <Alert variant={'info'}>
                        <InfoIcon weight={'duotone'} className="size-4" />
                        <AlertDescription>
                            All CMs should be involved with Newbies
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start gap-3">
                        <HandWavingIcon weight={'duotone'} className="size-5 text-fuchsia-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Warm Welcomes</h5>
                            <p className="text-sm mb-2">
                                Give them all a warm welcome in discord chat, and help them find a BUDDY!!!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <BookIcon weight={'duotone'} className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Guidelines Read?</h5>
                            <p className="text-sm mb-2">
                                Make sure they have read the guidelines. They should have already, but make sure again.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <PlusCircleIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Whitelist!</h5>
                            <p className="text-sm mb-2">
                                Now is time to whitelist them! Make sure they have a Buddy to guide them round.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}