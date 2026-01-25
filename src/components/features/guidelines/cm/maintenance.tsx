import GuidelineItem from "../guideline-item";

export default function ServerMaintenance() {
    return (
        <GuidelineItem name="Server Maintenance" important>
            <ul className='flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2'>
                <div>
                    The following is everything that <b>ALL</b> CMs should be doing and looking out for to ensure that
                    the server works as expected!
                </div>

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
                        <span className='font-bold text-attention2'>Inform Ezio & Pav. </span>
                        Either one of them will have to investigate further and decide whether a rollback is necessary, and perform one.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Inform the discord. </span>
                        You do not have to ping, just send an announcement that the server is down for xyz reasons.
                    </li>
                </ul>

                <li>
                    <span className='font-bold text-yellow-400'>Checking for corruption/crashes: </span>
                    <br/> Corruption and crashes are not as easy to spot anymore, but with the help of Amethyst, it has become easier.
                </li>

                <ul className='flex max-w-[800px] list-decimal flex-col space-y-1 pl-8'>
                    <li>
                        <span className='font-bold text-attention2'>Check the world for corrupted chunks. </span>
                        The easiest way to spot corruption are corrupted chunks. They usually happen at spawn, but can also happen elsewhere,
                        so visit spawn and a little bit around spawn.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Check for reports of lag. </span>
                        If people are reporting lag, we should keep that in mind as it may mean corruption.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Check #server logs. </span>
                        Amethyst now sends new LOGS in the #server channel when it starts or stops.
                        If the server STARTS without there being a STOP or a PREEMPTION log, then something fishy is going on
                        and you must report it immediately!!!
                    </li>
                </ul>

                <li>
                    <span className='font-bold text-yellow-400'>Minecraft Update Policy: </span>
                    <br/> Currently automatic updates are disabled due to technical reasons. You can ignore this section.
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
                        <span className='text-lg font-extrabold text-attention2'>INFORM EZIO & PAV!!! </span>
                        Perhaps the most important thing. DO NOT update if Ezio or Pav isn't available. They need to check
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