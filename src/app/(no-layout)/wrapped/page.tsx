// app/wrapped/page.tsx
"use client"

import { useSession } from "next-auth/react";
import { useWrappedWithUsers } from "@/hooks/use-wrapped-with-users";
import Loader from "@/components/layout/loader";
import { AccessDeniedScreen } from "@/components/screens/access-denied";
import { WrappedContainer } from "@/components/features/wrapped/wrapped-container";

// Import section components (we'll create these next)
import { IntroSection } from "@/components/features/wrapped/sections/intro-section";
import {TotalPlaytime} from "@/components/features/wrapped/sections/total-playtime";
import {MostAddictedDay} from "@/components/features/wrapped/sections/most-addicted-day";
import {PrimeTime} from "@/components/features/wrapped/sections/prime-time";
import {QuestStats} from "@/components/features/wrapped/sections/quest-stats";
import {TotalLoot} from "@/components/features/wrapped/sections/total-loot";
import {MobSlayer} from "@/components/features/wrapped/sections/mob-slayer";
import {ArchNemesis} from "@/components/features/wrapped/sections/arch-nemesis";
import {PlayerType} from "@/components/features/wrapped/sections/player-type";
import {BlockTimeline} from "@/components/features/wrapped/sections/block-timeline";
import {FavoritePeople} from "@/components/features/wrapped/sections/favourite-people";
import {FavoriteProject} from "@/components/features/wrapped/sections/favourite-project";
import {GrindDay} from "@/components/features/wrapped/sections/grind-day";
import {OutroSection} from "@/components/features/wrapped/sections/outro";
import {WrappedLoginScreen} from "@/components/features/wrapped/login-screen";
import {motion} from "motion/react";
import Link from "next/link";
import {WrappedTeaserScreen} from "@/components/features/wrapped/wrapped-teaser";
import {WrappedNoDataScreen} from "@/components/features/wrapped/wrapped-no-data";
import {WrappedErrorScreen} from "@/components/features/wrapped/wrapped-error";

export default function WrappedPage() {
    const { data: session, status } = useSession();

    const thornyId = session?.user?.everthornMemberInfo?.thorny_id || null;
    const { wrapped, isLoading, isError } = useWrappedWithUsers(thornyId);

    const now = new Date();
    const releaseDate = new Date('2025-12-12T00:00:00Z'); // adjust timezone if needed

    const isBeforeRelease = now < releaseDate;

    if (isBeforeRelease) {
        return <WrappedTeaserScreen />;
    }

    // Loading state
    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    // Not authenticated
    if (status === "unauthenticated" || !session?.user) {
        return <WrappedLoginScreen />;
    }

    // Error state
    if (isError) {
        return (
            <WrappedErrorScreen/>
        );
    }

    // No data state
    if (!wrapped) {
        return (
            <WrappedNoDataScreen/>
        );
    }

    return (
        <WrappedContainer>
            {/* Always show intro */}
            <IntroSection username={wrapped.username} />

            {/* Conditionally render sections based on data availability */}
            {wrapped.playtime && (
                <>
                    <TotalPlaytime data={wrapped.playtime} />
                    <MostAddictedDay data={wrapped.playtime} />
                    <PrimeTime data={wrapped.playtime} />
                </>
            )}

            {wrapped.quests && (
                <QuestStats data={wrapped.quests} />
            )}

            {wrapped.rewards && (
                <TotalLoot data={wrapped.rewards} />
            )}

            {wrapped.interactions && (
                <>
                    {wrapped.interactions.kill_counts && wrapped.interactions.kill_counts.length > 0 && (
                        <MobSlayer killCounts={wrapped.interactions.kill_counts} />
                    )}

                    {wrapped.interactions.arch_nemesis && (
                        <ArchNemesis
                            archNemesis={wrapped.interactions.arch_nemesis}
                            deathCount={wrapped.interactions.death_count}
                        />
                    )}

                    <PlayerType
                        playerType={wrapped.interactions.player_type}
                        blocksPlaced={wrapped.interactions.blocks_placed}
                        blocksMined={wrapped.interactions.blocks_mined}
                    />

                    {wrapped.interactions.block_timeline && wrapped.interactions.block_timeline.length > 0 && (
                        <BlockTimeline timeline={wrapped.interactions.block_timeline} />
                    )}
                </>
            )}

            {wrapped.social?.favourite_people && wrapped.social.favourite_people.length > 0 && (
                <FavoritePeople people={wrapped.social.favourite_people} />
            )}

            {wrapped.projects && (
                <>
                    {wrapped.projects.favourite_project_name && (
                        <FavoriteProject
                            projectName={wrapped.projects.favourite_project_name}
                            blocksPlaced={wrapped.projects.favourite_project_blocks_placed}
                        />
                    )}

                    {/*{wrapped.projects.most_active_project_name && (*/}
                    {/*    <Masterpiece data={wrapped.projects} />*/}
                    {/*)}*/}
                </>
            )}

            {wrapped.grind_day && (
                <GrindDay data={wrapped.grind_day} />
            )}

            {/* Always show outro */}
            <OutroSection
                username={wrapped.username}
                wrapped={wrapped}
                year={2025}
            />
        </WrappedContainer>
    );
}
