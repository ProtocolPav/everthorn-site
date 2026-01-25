import GuidelineItem from "../guideline-item";

export default function RecruitsManagerDuties() {
    return (
        <GuidelineItem name="Recruits Manager Duties">
            <ul className='flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2'>
                <div>
                    The following is the responsibilities of the Recruits Manager
                </div>

                <li>
                    <span className='font-bold text-attention2'>Check in regularly. </span>
                    You're their clingy girlfriend! Never stop asking them about how they're doing!
                    Are you enjoying the server? Have you built a road to your project? What you working on?
                </li>

                <li>
                    <span className='font-bold text-attention2'>Keep track and report. </span>
                    You're our eyes and ears. Report to us what the newbies are up to. Did they get diamond gear within a week?
                    Are they building a beautiful house? Are they acting sus? Tell us.
                </li>

                <li>
                    <span className='font-bold text-attention2'>Remind about rules. </span>
                    You're their personal guidebook. Remind them that they should apply for projects using the command,
                    remind them about roads, remind them that they can always join somebody else's projects. Remind. Remind. Remind!
                </li>

                <li>
                    <span className='font-bold text-attention2'>Make posts. </span>
                    We recruit 5-7 people every 6 months. Make posts, do interviews, and have the team decide who to accept
                    or reject. Always discuss the best time to make posts and what to include in them.
                </li>

            </ul>
        </GuidelineItem>
    )
}