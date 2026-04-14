import GuidelineItem from "../guideline-item";

export default function TechnicalManagerDuties() {
    return (
        <GuidelineItem name="Technical Manager Duties">
            <ul className='flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2'>
                <div>
                    The following is the responsibilities of the Technical Manager
                </div>

                <li>
                    <span className='font-bold text-attention2'>Regular checkups. </span>
                    Go into the logs and look through them for any errors that may happen, and report!
                </li>

                <li>
                    <span className='font-bold text-attention2'>Be active. </span>
                    You are in charge of restoring backups, and of making sure that the server is running smoothly on the
                    technical side. Be active and make sure you deal with the issues ASAP!
                </li>

                <li>
                    <span className='font-bold text-attention2'>Check for updates. </span>
                    Make sure that you are up-to-date on minecraft updates, and that Amethyst is working as needed.
                </li>

            </ul>
        </GuidelineItem>
    )
}