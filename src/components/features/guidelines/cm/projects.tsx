import GuidelineItem from "../guideline-item";

export default function CMProjects() {
    return (
        <GuidelineItem name="Projects">
            <div className="text-muted-foreground">
                This is the foundation of Everthorn in this current world. Without Projects,
                everything falls apart. It is our job to ensure that everything gets
                followed correctly.

                <h2 className="mt-5 text-xl font-extrabold text-primary">
                    <span>Applications</span>
                </h2>
                <ul className="flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2">
                    <li>
                        Project applications come into the Project Applications thread.
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Wait-list</span> a project if:
                        <ul className="flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2">
                            <li>
                                The project seems too large for one person to complete
                            </li>

                            <li>
                                The coordinates are too close to someone else's project. You must ask that
                                project if they are fine with a new project popping up near them.
                            </li>

                            <li>
                                If you are generally unsure of the project. Better to discuss with other CMs
                                rather than accepting. You can't undo an acceptance.
                            </li>
                        </ul>

                        <section className={'mt-4 rounded-lg bg-slate-800 py-2'}>
                            <p className='mx-3 my-0 text-sm font-bold text-yellow-400'>
                                The Wait List is essentially informing other CM's that this project needs some
                                discussion before we accept it.
                            </p>
                        </section>
                    </li>

                    <li>
                        <span className='font-bold text-attention2'>Accept</span> a project if:
                        <ul className="flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2">
                            <li>
                                Everything seems fine!
                            </li>

                            <li>
                                You have talked with other CMs about it.
                            </li>
                        </ul>

                        <section className={'mt-4 rounded-lg bg-slate-800 py-2'}>
                            <p className='mx-3 my-0 text-sm text-slate-300'>
                                You can't undo a project acceptance. So make sure everything is fine BEFORE accepting :)
                            </p>
                        </section>
                    </li>
                </ul>

                <h2 className="mt-5 text-xl font-extrabold text-primary">
                    <span>Roads</span>
                </h2>
                <ul className="flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2">
                    <li>
                        All projects must be connected to the roads system. Check up regularly on new projects
                        to ensure they have roads connecting to them.
                    </li>
                    <li>
                        Remind new project leads to connect their project to the roads. Let them know that this is
                        highly important. If they do not prioritize it then you must start giving daily reminders.
                    </li>
                </ul>

                <h2 className="mt-5 text-xl font-extrabold text-primary">
                    <span>Large Projects</span>
                </h2>
                <ul className="flex max-w-[800px] list-disc flex-col space-y-4 pl-8 pt-2">
                    <li>
                        We generally do NOT accept large-scale projects anymore. We have
                        too many of them that have not been completed. This means, large scale projects
                        will be in the waiting list until others are completed.
                    </li>
                </ul>
            </div>
        </GuidelineItem>
    )
}