// src/routes/_main/downloads.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DownloadSimpleIcon, LockIcon, VaultIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/features/page-header.tsx"
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

export const Route = createFileRoute('/_main/downloads')({
    component: Downloads,
    head: () => ({
        meta: [
            { property: 'og:title', content: 'World Downloads | Everthorn' },
            { property: 'og:description', content: 'Download the Everthorn worlds. Exclusive to Everthorn members.' },
            { property: 'og:url', content: `${import.meta.env.VITE_BASE_URL}/downloads` },
        ],
    }),
})

interface WorldDownload {
    id: string
    name: string
    description: string
    image: string
    downloadUrl: string
    size?: string
}

const worlds: WorldDownload[] = [
    {
        id: "world-1",
        name: "OG Everthorn",
        description: "Where Everthorn began. It originally had 3 towns: Blackwood, Megara, and Corinth. Later, Fallholt and Tokyo were formed thousands of blocks away.",
        image: "https://cdn.everthorn.net/img/Minecraft%20Screenshot%202026.07.06%20-%2017.05.10.48.png",
        downloadUrl: "https://your-download-link-1.com",
        size: "725 MB",
    },
    {
        id: "world-2",
        name: "Old Everthorn",
        description: "Our second world, featuring even more towns: Solis, Arkadia, Blackwood II. It was the last pre-covid world.",
        image: "https://cdn.everthorn.net/img/Minecraft%20Screenshot%202026.07.06%20-%2017.07.31.93.png",
        downloadUrl: "https://your-download-link-2.com",
        size: "1.1 GB",
    },
    {
        id: "world-3",
        name: "Everthorn Kingdoms",
        description: "Everthorn completely reimagined. Instead of towns, there were now Kingdoms. Ambria, Asbahamael, Dalvasha, Eireann, and Stregabor.",
        image: "https://cdn.everthorn.net/img/Minecraft%20Screenshot%202026.07.06%20-%2017.12.39.07.png",
        downloadUrl: "https://your-download-link-3.com",
        size: "3.6 GB",
    },
]

function WorldCard({ world }: { world: WorldDownload }) {
    return (
        <Card className={cn(
            "transition-all duration-500 p-0 overflow-hidden relative h-full flex flex-col",
            "border group hover:border-primary/40 hover:shadow-lg"
        )}>
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

            <div className="flex flex-col h-full relative z-10">
                {/* World Image */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                    <img
                        src={world.image}
                        alt={world.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Gradient fade into card body */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

                    {/* File size badge */}
                    {world.size && (
                        <div className="absolute bottom-3 right-3">
                            <Badge
                                variant="secondary"
                                className="text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-lg bg-background/70 border-border/60 text-foreground"
                            >
                                {world.size}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <CardContent className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex-1 space-y-1.5">
                        <h3 className="font-bold text-lg leading-tight transition-colors duration-500 group-hover:text-primary">
                            {world.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {world.description}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    {/* Download Button */}
                    <Button asChild className="w-full gap-2">
                        <a href={world.downloadUrl} download rel="noopener noreferrer">
                            <DownloadSimpleIcon className="h-4 w-4" weight="bold" />
                            Download World
                        </a>
                    </Button>
                </CardContent>
            </div>
        </Card>
    )
}

function AccessDenied() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-xl rotate-6" />
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent rounded-xl flex items-center justify-center">
                        <LockIcon className="w-10 h-10 text-muted-foreground/40" weight="duotone" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">Members Only</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    World downloads are exclusive to Everthorn members. Sign in and join the server to access them.
                </p>
            </div>
        </div>
    )
}

function Downloads() {
    // Adjust these to however your auth context works
    const { thornyUser, isMember } = useEverthornMember()
    const isSignedIn = !!thornyUser

    const canDownload = isSignedIn && isMember

    return (
        <section className="w-full pt-5 px-5 md:px-10 xl:px-20">
            <PageHeader
                icon={VaultIcon}
                title="World Downloads"
                description="Download a copy of our past worlds, ready for you to relive."
            />

            {canDownload ? (
                <div className="pb-16 space-y-6 pt-6">
                    {/* World Cards Grid */}
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {worlds.map((world) => (
                            <WorldCard key={world.id} world={world} />
                        ))}
                    </div>
                </div>
            ) : (
                <AccessDenied />
            )}
        </section>
    )
}