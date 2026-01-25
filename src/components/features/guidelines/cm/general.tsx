import {Badge} from "@/components/ui/badge";
import GuidelineItem from "../guideline-item";

export default function GeneralDuties() {
    return (
        <GuidelineItem name="General Duties" important>
            <ul className='flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2'>
                <div>
                    The following is everything that <b>ALL</b> CMs should be doing and looking out for.
                </div>

                <li>
                    <span className='font-bold text-attention2'>Be fair and respectful. </span>
                    No matter who it is, or what they did, always be fair and respectful when speaking with them.
                </li>

                <li>
                    <span className='font-bold text-attention2'>Be active and participate. </span>
                    You should be in the loop of what's going on. <br/> Constantly asking questions like "who is this" or "what's this" are unacceptable
                    and show that you have not been paying attention to the server.
                </li>

                <li>
                    <span className='font-bold text-attention2'>Answer ASAP. </span>
                    If somebody has a question or an issue, try to answer as soon as you see it,
                    and make sure that when you <i>can</i> be available, that you <i>actually are!</i>
                </li>

                <li>
                    <span className='font-bold text-attention2'>Regularly check on projects. </span>
                    All projects, new and old should be connected to the <b>ROAD NETWORK!!!</b>
                </li>

                <li>
                    <span className='font-bold text-attention2'>Communicate. </span>
                    If something happens on the server, communicate so we are all in the same loop.
                    Best place to communicate is via the <Badge variant='command' className={'mx-1'}>#announcements</Badge> channel.
                </li>

                <li>
                    <span className='font-bold text-attention2'>Have regular meetings, </span>
                    or if you can't meet live, post regularly about your specific role and what's going on.
                </li>

                <li>
                    <span className='font-bold text-yellow-400'>What to do in case of a glitch/grief/corruption: </span>
                    <br/> If somebody reports dying by a glitch, or reports corruption or griefing, you must follow this procedure.
                </li>

                <ul className='flex max-w-[800px] list-decimal flex-col space-y-1 pl-8'>
                    <li>
                        <span className='font-bold text-attention2'>Stop the server immediately. </span>
                        9 times out of 10, we will have to rollback. Stopping the server prevents people from making progress that
                        will be lost.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Inform Ezio. </span>
                        Ezio will have to investigate further and decide whether a rollback is necessary, and perform one.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Inform the discord. </span>
                        You do not have to ping, just send an announcement that the server is down for xyz reasons.
                    </li>
                </ul>

                <li>
                    <span className='font-bold text-yellow-400'>Minecraft Update Policy: </span>
                </li>

                <ul className='flex max-w-[800px] list-disc flex-col space-y-1 pl-8'>
                    <li>
                        <span className='font-bold text-attention2'>Updates happen automatically. </span>
                        Each time the server starts, it checks and applies any updates that are released by Mojang.
                        The server is also set to auto-restart once every 3 days, so sometimes you may not have to do anything.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Wait 1 hour before manually updating. </span>
                        You can always update by restarting the server, but wait 1-2 hours after an update releases.
                        Mojang will not always release the update to <b>EVERYONE</b> immediately.
                    </li>

                    <li>
                        <span className='text-lg font-extrabold text-attention2'>INFORM EZIO!!! </span>
                        Perhaps the most important thing. DO NOT update if Ezio isn't available. He needs to check
                        and update Amethyst if necessary. If Amethyst is not updated, our services like Chat-Link and
                        Player Logs break!
                    </li>

                    <li>
                        <span className='font-extrabold text-attention2'>Stop the server. </span>
                        Test by joining the server. If you receive a welcome message, Amethyst works. Otherwise,
                        it is broken. <b>STOP THE SERVER IF AMETHYST IS BROKEN</b>
                    </li>

                </ul>

            </ul>
        </GuidelineItem>
    )
}