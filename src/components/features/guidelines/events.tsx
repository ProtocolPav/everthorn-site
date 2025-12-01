import GuidelineItem from "./guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {InfoIcon, ShoppingBagIcon, TrophyIcon, FinnTheHumanIcon} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";

export default function EventsRules() {
    return (
        <GuidelineItem name={'Events, Quests & Market'}>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                        <FinnTheHumanIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Events</h5>
                            <p className="text-sm mb-2">Join community events with exciting activities:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>4 times a year, we host a massive community event</li>
                                <li>UHC, Boss Fights, Dream Worlds, and more!</li>
                                <li>Prizes for all participants</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <TrophyIcon weight={'duotone'} className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Weekly Quests</h5>
                            <p className="text-sm mb-2">Complete quests to earn rewards and have some fun:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Earn Nugs and in-game items</li>
                                <li>Participate in Storylines, where multiple quests follow the same plot</li>
                                <li>Use <Badge variant={'command'}>/quests view</Badge> to start</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <ShoppingBagIcon weight={'duotone'} className="size-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Monthly Market</h5>
                            <p className="text-sm mb-2">Shop for exclusive themed items with limited availability:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Different items each month. From high-end goods to common items in bulk</li>
                                <li>Items have a limited stock</li>
                                <li>Pay with diamonds or Nugs, our virtual discord currency</li>
                            </ul>

                            <Alert variant={'info'} className={'mt-3'}>
                                <InfoIcon weight={'duotone'} className="size-4" />
                                <AlertDescription>
                                    <div>
                                        Every month, the market message is sent in
                                        the <Badge variant={'outline'}>#market</Badge> channel.
                                        <ul className="text-sm grid gap-2 list-disc pl-4 my-2">
                                            <li>For diamond purchases you should place them in a barrel with your name at <Badge variant={'secondary'}>[80, -20]</Badge></li>
                                            <li>For Nugs, you run <Badge variant={'command'}>/pay @market payment</Badge> in discord.</li>
                                        </ul>
                                        Your items will then be delivered, and you will receive a DM on discord informing you of this.
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}
