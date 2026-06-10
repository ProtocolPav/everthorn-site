"use client"
import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react"
import {cn} from "@/lib/utils";

export function AnniversaryLetterBanner({ className }: { className?: string }) {
    return (
        <Link
            href="/community-letter-from-pav"
            className={cn("group flex items-end justify-between gap-8 border-t border-b border-border py-6 md:py-8", className)}
        >
            <div className="flex flex-col gap-1">
                <p className="font-smythe text-sm uppercase tracking-[0.22em] text-muted-foreground md:text-base">
                    A Community Letter from Pav &nbsp;·&nbsp; 7 Years
                </p>
                <h3 className="font-smythe text-3xl leading-tight text-foreground md:text-5xl">
                    Happy 7 Years, Everthorn
                </h3>
                <p className="font-alegreya mt-1 text-base italic text-muted-foreground md:text-xl">
                    "Thank you all for playing every day. Thank you all for being you."
                </p>
            </div>

            <div className="shrink-0 font-smythe text-sm uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground flex items-center gap-2 pb-1">
                Read
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    )
}