import {Badge} from "@/components/ui/badge";
import GuidelineItem from "../guideline-item";

export default function CMCommands() {
    return (
        <GuidelineItem name="Commands">
            <ul className='flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2'>
                <div>
                    The following are a list of all the commands you may need to use and their functions.
                    Every command has some parameters, such as "id" which discord will automatically ask you to fill in.
                    Thus, the parameters will NOT be explained here, only the function of each command.
                </div>

                <li>
                    <Badge variant='command' className={'mx-1'}>/stop</Badge>
                    <Badge variant='command' className={'mx-1'}>/start</Badge>
                    Starts and stops the server. Wait at least 2 seconds after stopping to start again.
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/send message</Badge>
                    Schedules a message to be sent to the server. Messages get sent every 2 hours.
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/send announcement</Badge>
                    Sends a one-time announcement to the server. Announcements display <b>above</b> the inventory, and
                    play a sound for people.
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/send boot</Badge>
                    Kick somebody from the server.
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/balance edit</Badge>
                    Edit someone's nugs balance. If you put a negative number, this decreases their balance.
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/gulag</Badge>
                    Send someone to the discord gulag. It will disable their permissions to view anything except the gulag.
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/whitelist add</Badge>
                    Add a user to the whitelist. <b>Note: The user must have already entered their gamertag using
                    the profile.</b>
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/whitelist remove</Badge>
                    Remove someone from the whitelist.
                    <span className="font-bold text-yellow-400"> Currently, this command half-works.
                        It will remove the user from the whitelist, but will not update it on Thorny.
                        Thus, you cannot re-whitelist the person. Ezio must manually update the NexusCore whitelist.
                    </span>
                </li>

                <li>
                    <Badge variant='command' className={'mx-1'}>/whitelist view</Badge>
                    View the whitelist, seeing each member's name and their Gamertag that is entered in the whitelist.
                    <span className="font-bold text-yellow-400"> Doesn't work for now.</span>
                </li>
            </ul>
        </GuidelineItem>
    )
}