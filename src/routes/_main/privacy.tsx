import { createFileRoute } from '@tanstack/react-router'
import { ShieldIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/features/page-header.tsx'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_main/privacy')({
    component: PrivacyPolicy,
})

interface PolicySectionProps {
    title: string
    children: React.ReactNode
}

function PolicySection({ title, children }: PolicySectionProps) {
    return (
        <div className="grid gap-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="grid gap-2 text-sm text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    )
}

function PrivacyPolicy() {
    return (
        <section className="mx-5 grid items-center gap-6 pt-6 pb-10 md:mx-10 xl:mx-20">
            <PageHeader
                icon={ShieldIcon}
                title="Privacy Policy"
                description="What we collect, why we collect it, and what we do with it"
                gradient={false}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Privacy Policy' },
                ]}
            />

            <div className="max-w-3xl grid gap-8">

                <p className="text-sm text-muted-foreground leading-relaxed">
                    We want to be upfront about what data Everthorn collects. This page covers everything
                    across our Website, Minecraft Server, and Discord. We don't sell your data, we don't
                    use it for advertising, and we only collect what we actually need. Last updated{' '}
                    <strong className="text-foreground">16 June 2026</strong>.
                </p>

                <Separator />

                <PolicySection title="The Website">
                    <p>
                        <strong className="text-foreground">Signing in:</strong> You sign in using your
                        Discord account. When you do, we store a session cookie on your device so you stay
                        logged in. That's all it's used for — we're not tracking you around the site.
                    </p>
                    <p>
                        <strong className="text-foreground">Wiki pages:</strong> If you create or edit a
                        wiki page, your Discord account is recorded as the author. This shows up on the page
                        itself. If you ever want that removed, just ask us.
                    </p>
                    <p>
                        <strong className="text-foreground">Admin access:</strong> If you're a staff member,
                        signing in also unlocks the admin areas. Signing out removes your access immediately.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="The Discord Server">
                    <p>
                        When you join our Discord, we store a few things about you so everything works
                        properly across our services:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Your Discord ID and the date you joined</li>
                        <li>Your Xbox or PSN Gamertag (needed to get you whitelisted on the server)</li>
                        <li>Your chat level and XP in the Discord</li>
                    </ul>
                    <p>
                        Your Gamertag is what links your Discord identity to your Minecraft character. Without
                        it, we can't whitelist you. Your Discord ID is used behind the scenes to connect your
                        account across the website, Discord, and Minecraft.
                    </p>
                    <p>
                        <strong className="text-foreground">Optional stuff:</strong> You can add a birthdate
                        or an "About Me" to your profile if you want. You don't have to, and you can change
                        or remove it whenever you like.
                    </p>
                    <p>
                        <strong className="text-foreground">Thorny (our Discord bot):</strong> Thorny handles
                        things like profiles, levels, and commands in Discord. It logs command usage so things
                        run smoothly, but it doesn't store your general message history.
                    </p>
                    <p>
                        <strong className="text-foreground">Minecraft–Discord chat integration:</strong> We
                        have a bridge between Discord and the Minecraft server so chat flows between both.
                        Messages sent through this bridge may appear in both places, but they aren't stored
                        beyond normal Discord message history.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="The Minecraft Server">
                    <p>
                        While you're playing, we record some activity data. This is what makes features like
                        Quests work, and it also helps us keep an eye on server health:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>When your play sessions start and end</li>
                        <li>Blocks you've placed or broken</li>
                        <li>Mobs you've killed</li>
                        <li>Containers you've opened</li>
                    </ul>
                    <p>
                        <strong className="text-foreground">Amethyst</strong> is the plugin running on the
                        server that collects this. It's what powers things like Quest tracking (e.g. "mine
                        50 dirt blocks") and general server activity stats.
                    </p>
                    <p>
                        <strong className="text-foreground">The Live Map:</strong> If you're online, other
                        people can see your Gamertag and your current in-game location on the live map. Your
                        connection time is not shown.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="How It All Fits Together">
                    <p>
                        All of this data is managed through our backend, which connects the website, Discord,
                        and Minecraft into one system. Your Discord ID is the common thread that links your
                        identity across all three. Only Everthorn's own services can access this data — it's
                        not exposed anywhere public.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Deleting Your Data">
                    <p>
                        If you leave the Discord server, your profile is deactivated and you'll be removed
                        from the Minecraft whitelist. You won't be able to log in to the website either.
                    </p>
                    <p>
                        Some anonymised stats (like total blocks placed across the server) might still exist
                        in aggregate figures, but they won't be tied to you in any way.
                    </p>
                    <p>
                        If you want your data fully deleted — Discord ID, Gamertag, join date, all of it —
                        just ask us. We'll remove your personal information and detach your activity stats
                        from your account so they can't be traced back to you.
                    </p>
                    <p>
                        You can reach us on Discord (
                        <code className="text-foreground bg-muted px-1 py-0.5 rounded text-xs">@protocolpav</code>
                        ) or by email (
                        <a
                            href="mailto:everthornbusiness@gmail.com"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            everthornbusiness@gmail.com
                        </a>
                        ).
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Questions?">
                    <p>If anything here is unclear or you want to know more, get in touch:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>
                            Discord:{' '}
                            <code className="text-foreground bg-muted px-1 py-0.5 rounded text-xs">
                                @protocolpav
                            </code>
                        </li>
                        <li>
                            Email:{' '}
                            <a
                                href="mailto:everthornbusiness@gmail.com"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                everthornbusiness@gmail.com
                            </a>
                        </li>
                    </ul>
                </PolicySection>

            </div>
        </section>
    )
}