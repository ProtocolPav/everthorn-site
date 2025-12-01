import GuidelineItem from "./guideline-item";
import {GameControllerIcon, UsersIcon, ListChecksIcon} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";

export default function ConnectionRules() {
    return (
        <GuidelineItem name={'Getting Started'} important>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                        <ListChecksIcon weight={'duotone'} className="size-5 text-lime-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>First Steps</h5>
                            <p className="text-sm mb-3 md:max-w-4/6">
                                You should read through these guidelines. Everything you need to know is here.
                                Everything marked with <Badge variant={'attention'}>Must Read</Badge> is highly important.
                                Everything else is good to know too though!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <UsersIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Getting Whitelisted</h5>
                            <p className="text-sm mb-3">Once you read the rules, you should probably get whitelisted:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-6 ">
                                <li>Run <Badge variant="command">/profile view</Badge> command on Discord</li>
                                <li>Click <strong>Edit Profile</strong> and enter your Xbox gamertag</li>
                                <li>Ping a Community Manager to request whitelist access</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <GameControllerIcon weight={'duotone'} className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Connecting To The Server</h5>
                            <p className="text-sm mb-3">Now that you're whitelisted, here's how to connect:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-6 ">
                                <li>Add <Badge variant="outline">PlayEverthorn</Badge> as an Xbox friend</li>
                                <li>Wait for the friend request to be accepted</li>
                                <li>Find the server in your Friends tab in Minecraft (top right)</li>
                                <li><strong>PC Players Only:</strong> You can alternatively also connect via our IP <Badge variant={'command'}>play.everthorn.net</Badge> </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}
