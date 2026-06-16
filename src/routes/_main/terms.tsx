import { createFileRoute } from '@tanstack/react-router'
import { FileTextIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/features/page-header.tsx'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_main/terms')({
    component: TermsOfUse,
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

function TermsOfUse() {
    return (
        <section className="mx-5 grid items-center gap-6 pt-6 pb-10 md:mx-10 xl:mx-20">
            <PageHeader
                icon={FileTextIcon}
                title="Terms of Use"
                description="Rules and expectations for participating in the Everthorn community"
                gradient={false}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Terms of Use' },
                ]}
            />

            <div className="max-w-3xl grid gap-8">

                <p className="text-sm text-muted-foreground leading-relaxed">
                    By joining and participating in any Everthorn service — including the Website,
                    Minecraft Server, Discord server, or any associated platform — you agree to
                    these Terms of Use. These terms exist to keep the community fair, safe, and enjoyable
                    for everyone. They were last updated on <strong>16 June 2026</strong>.
                </p>

                <Separator />

                <PolicySection title="Eligibility">
                    <p>
                        Everthorn is open to players of all ages, however you must comply with Discord's
                        own Terms of Service (minimum age 13, or 16 in certain regions) to participate via
                        Discord. By joining, you confirm that you meet these requirements.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Community Conduct">
                    <p>
                        All members are expected to behave respectfully across every Everthorn platform.
                        This includes, but is not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Following the Everthorn Community Guidelines at all times</li>
                        <li>Treating other players and staff with respect</li>
                        <li>Not exploiting bugs, glitches, or loopholes in any of our services</li>
                        <li>Not attempting to access administrative or restricted areas without permission</li>
                        <li>Not engaging in harassment, hate speech, or discriminatory behaviour</li>
                    </ul>
                </PolicySection>

                <Separator />

                <PolicySection title="Data Consent">
                    <p>
                        By joining Everthorn's Discord server or playing on the Minecraft server, you
                        consent to the collection and use of data as described in our{' '}
                        <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                            Privacy Policy
                        </a>
                        . This includes session data, in-game activity metrics, and your Discord profile
                        information.
                    </p>
                    <p>
                        You can withdraw consent and request data deletion at any time by contacting us.
                        Withdrawal of consent will result in removal from the server whitelist and
                        deactivation of your Everthorn account.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="User-Generated Content">
                    <p>
                        When you contribute to the Everthorn wiki or other content areas on the website,
                        you grant Everthorn a non-exclusive, royalty-free right to display and maintain
                        that content as part of the community platform. You retain ownership of your
                        contributions, and you can request removal of your content at any time.
                    </p>
                    <p>
                        You must not submit content that is unlawful, harmful, defamatory, or infringes
                        on another party's intellectual property.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Account Termination">
                    <p>
                        Everthorn staff reserve the right to remove any member from any or all services
                        for violations of these terms or the Community Guidelines. Removals may be
                        temporary (kicks/timeouts) or permanent (bans), at the discretion of the staff
                        team.
                    </p>
                    <p>
                        If you believe a removal was made in error, you may appeal by contacting us
                        directly. Appeals are reviewed on a case-by-case basis.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Disclaimer">
                    <p>
                        Everthorn is a community-run project provided on a best-effort basis. We make
                        no guarantees of uptime, data preservation beyond what is described in the Privacy
                        Policy, or continuity of any specific service or feature. We are not responsible
                        for any loss of in-game progress due to technical failures, server resets, or
                        administrative actions carried out in good faith.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Changes to These Terms">
                    <p>
                        We may update these terms from time to time. Significant changes will be announced
                        in the Everthorn Discord server. Continued participation after a change constitutes
                        acceptance of the updated terms.
                    </p>
                </PolicySection>

                <Separator />

                <PolicySection title="Contact">
                    <p>Questions about these terms? Reach us at:</p>
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