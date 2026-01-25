import GuidelineItem from "../guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    FolderPlusIcon,
    GlobeIcon,
    HardDrivesIcon,
    HeartIcon,
    ImageBrokenIcon,
    InfoIcon, NewspaperIcon,
    QuestionMarkIcon,
    WrenchIcon,
    XCircleIcon
} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";

export default function ServerMaintenance() {
    return (
        <GuidelineItem name="Server Management" important>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <Alert variant={'info'}>
                        <InfoIcon weight={'duotone'} className="size-4" />
                        <AlertDescription>
                            This is important to know how to manage the Server and Geode.
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start gap-3">
                        <ImageBrokenIcon weight={'duotone'} className="size-5 text-fuchsia-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Glitches, Griefing or Corruption</h5>
                            <p className="text-sm mb-2">
                                In such cases, we require rollbacks. Luckily, CMs are now able to do these too!
                            </p>
                            <ul className="text-sm grid gap-2 list-decimal pl-4">
                                <li>Inform people that they must leave the world.</li>
                                <li>
                                    Investigate the situation.
                                    Make sure that indeed the person died due to a glitch,
                                    or that there indeed is corruption, or that a VERY major griefing occured.
                                </li>
                                <li className={'flex gap-2 items-center'}>
                                    Go to the Server Panel and on the top right click on the
                                    <Badge variant={"secondary"}><HardDrivesIcon/></Badge> Icon.
                                </li>
                                <li>Select the latest backup, and click RESTORE.</li>
                            </ul>

                            <p className="text-sm mb-2">
                                Sometimes a rollback is not necessary, or hard to do.
                                If someone died and the latest rollback is 50 mins ago,
                                and the server did a lot of progress, it is reasonable to first ask everyone involved if they're
                                fine with a rollback. Maybe the person is fine with just getting replacement gear.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <QuestionMarkIcon weight={'duotone'} className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>How to Check for Corruption</h5>
                            <p className="text-sm mb-2">
                                This is how you check for corruption, which usually happens after the server CRASHES.
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>
                                    Check for corrupted chunks. Usually located at spawn, but can be elsewhere.
                                    These chunks essentially reset any building done where there should be building.
                                </li>
                                <li>Check for reports of lag. This can indicate low-level hidden corruption</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <FolderPlusIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Update Policy</h5>
                            <p className="text-sm mb-2">
                                Minecraft updates happen automatically. But you can manually trigger them:
                            </p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Run <Badge variant={'command'}>/stop</Badge> and <Badge variant={'command'}>/start</Badge></li>
                                <li>Check that when the server starts, you get the "Amethyst Connect Plugin" message</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}