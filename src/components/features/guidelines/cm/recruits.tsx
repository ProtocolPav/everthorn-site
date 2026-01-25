import {Badge} from "@/components/ui/badge";
import GuidelineItem from "../guideline-item";

export default function NewRecruitProcedures() {
    return (
        <GuidelineItem name="New Recruit Procedures" important>
            <ul className='flex max-w-[800px] list-decimal flex-col space-y-4 pl-8 pt-2'>
                <div>
                    The following is the entire procedure that must be followed for every
                    new recruit.
                </div>

                <li>
                    <span className='font-bold text-attention2'>Give a warm welcome. </span>
                    When a new recruit first joins the discord, they must be welcomed by everyone. Make them feel
                    special.
                </li>

                <li>
                    <span className='font-bold text-attention2'>Ask to read the Guidelines. </span>
                    They should have already read them during the interview, but ask just in case. The
                    sections marked <Badge variant={'attention'}>Must-Read</Badge> should be read 100%.
                </li>

                <li>
                    <span className='font-bold text-attention2'>Add to whitelist. </span>
                    Once they add their gamertag and are ready to play, you can add them to the server whitelist!
                </li>

                <section className={'mt-4 rounded-lg bg-slate-800 py-2'}>
                    <p className='mx-3 my-0 text-sm text-slate-300'>
                        Set up a tour for them. <b className={'text-yellow-400'}>Tours can be done by ANYONE, so long as they
                        have been a member on Everthorn for enough time.</b> However, you are still responsible for setting one up.
                    </p>
                </section>

                <li>
                    <span className='font-bold text-attention2'>Inform about projects. </span>
                    Yes, they have read the guidelines twice, but believe it or not I've seen people forget
                    about the projects system entirely. Remind them constantly about projects, and guide them to the
                    guidelines if they have any more questions.
                </li>

                <section className={'mt-4 rounded-lg bg-slate-800 py-2'}>
                    <p className='mx-3 my-0 text-sm text-slate-300'>
                        A New Recruit must be part of a project. Either their own, or someone elses. <br/>
                        <b className={'text-yellow-400'}> It is YOUR JOB to keep track of all New Recruits to ensure that they are indeed in a project. </b>
                        <br/><br/>
                        This is probably the most important thing, getting people accustomed to our Projects System.
                    </p>
                </section>
            </ul>
        </GuidelineItem>
    )
}