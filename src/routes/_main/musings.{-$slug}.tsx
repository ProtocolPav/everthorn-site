import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/musings/{-$slug}')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen bg-background text-foreground py-16 px-6 sm:px-10 flex justify-center">
            <article className="max-w-2xl w-full font-serif text-lg leading-relaxed space-y-6">
                <p className="text-xl font-semibold tracking-tight text-foreground">
                    Hey, stranger!
                </p>

                <p>
                    A couple of days ago, I was browsing website analytics for this website, and I came across some
                    unusual pages that were being accessed. Specifically these ones, &ldquo;Musings&rdquo;.
                </p>

                <p>
                    That sent me down a little rabbit hole. It honestly didn&apos;t even phase me that this website,{' '}
                    <span className="font-sans font-medium text-foreground">everthorn.net</span>, was probably owned by many
                    other people in the past! I think this is really, really cool :)) It&apos;s like a piece of history on this
                    vast internet.
                </p>

                <p>
                    Anyway, I went and used the <strong className="font-semibold text-foreground">Wayback Machine</strong> to see
                    if it had any archives of this website with the URL of &ldquo;/Musings&rdquo;. And lo and behold, it did!
                </p>

                <p>I found loads of archives, dating back from 2008 to 2009 and seemingly, it ends in 2013.</p>

                <p>
                    I&apos;m assuming you are curious to see your old musings about life and such. It&apos;s not pretty, and
                    probably has a lot of missing details, but here&apos;s a link you can start from:
                </p>

                <div className="my-4 p-4 rounded-lg bg-muted/60 border border-border font-sans text-sm">
                    <a
                        href="https://web.archive.org/web/20100223002443/http://everthorn.net/musings/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline underline-offset-4 break-all font-medium transition-colors"
                    >
                        https://web.archive.org/web/20100223002443/http://everthorn.net/musings/
                    </a>
                </div>

                <p>I hope you find what you&apos;re looking for :))</p>

                <p>- Pavel</p>

                <footer className="pt-6 text-base text-muted-foreground italic border-t border-border">
                    P.S. I am really curious as to what &ldquo;Everthorn&rdquo; was to you. If you&apos;d like to talk, you can
                    email me at{' '}
                    <a
                        href="mailto:pavel@everthorn.net"
                        className="text-foreground not-italic font-medium underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        pavel@everthorn.net
                    </a>
                </footer>
            </article>
        </div>
    )
}