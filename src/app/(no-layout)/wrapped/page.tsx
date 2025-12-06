// app/wrapped/page.tsx
"use client"

import { useSession } from "next-auth/react";
import { useWrappedWithUsers } from "@/hooks/use-wrapped-with-users";
import Loader from "@/components/layout/loader";
import { AccessDeniedScreen } from "@/components/screens/access-denied";

export default function WrappedPage() {
    const { data: session, status } = useSession();

    const thornyId = session?.user?.everthornMemberInfo?.thorny_id || null;
    const { wrapped, isLoading, isError } = useWrappedWithUsers(thornyId);

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
        return <AccessDeniedScreen />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500">Error Loading Wrapped</h2>
                    <p className="text-muted-foreground mt-2">Failed to fetch your wrapped data.</p>
                </div>
            </div>
        );
    }

    // No data
    if (!wrapped) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">No Wrapped Data</h2>
                    <p className="text-muted-foreground mt-2">No wrapped data found for your account.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Everthorn Wrapped 2025</h1>

            {/* User Info */}
            <section className="mb-8 p-6 bg-card rounded-lg border">
                <h2 className="text-2xl font-semibold mb-2">User</h2>
                <p className="text-lg">Username: {wrapped.username}</p>
                <p className="text-sm text-muted-foreground">Thorny ID: {wrapped.thorny_id}</p>
            </section>

            {/* Playtime */}
            {wrapped.playtime && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Playtime</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Hours</p>
                            <p className="text-xl font-bold">{(wrapped.playtime.total_seconds / 3600).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Most Active Hour</p>
                            <p className="text-xl font-bold">{wrapped.playtime.most_active_hour}:00</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Highest Day</p>
                            <p className="text-xl font-bold">{new Date(wrapped.playtime.highest_day).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Hours That Day</p>
                            <p className="text-xl font-bold">{(wrapped.playtime.highest_day_seconds / 3600).toFixed(2)}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Quests */}
            {wrapped.quests && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Quests</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Accepted</p>
                            <p className="text-xl font-bold">{wrapped.quests.total_accepted}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Completed</p>
                            <p className="text-xl font-bold">{wrapped.quests.total_completed}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                            <p className="text-xl font-bold">{wrapped.quests.completion_rate}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Fastest Quest</p>
                            <p className="text-lg font-bold">{wrapped.quests.fastest_quest_title}</p>
                            <p className="text-sm text-muted-foreground">{(wrapped.quests.fastest_quest_duration_seconds / 60).toFixed(2)} min</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Rewards */}
            {wrapped.rewards && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Rewards</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Rewards</p>
                            <p className="text-xl font-bold">{wrapped.rewards.total_rewards}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Balance Earned</p>
                            <p className="text-xl font-bold">{wrapped.rewards.total_balance_earned}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Items Earned</p>
                            <p className="text-xl font-bold">{wrapped.rewards.total_items_earned}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Unique Items</p>
                            <p className="text-xl font-bold">{wrapped.rewards.unique_items}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Interactions */}
            {wrapped.interactions && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Interactions</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Blocks Placed</p>
                            <p className="text-xl font-bold">{wrapped.interactions.blocks_placed.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Blocks Mined</p>
                            <p className="text-xl font-bold">{wrapped.interactions.blocks_mined.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Player Type</p>
                            <p className="text-xl font-bold">{wrapped.interactions.player_type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Arch Nemesis</p>
                            <p className="text-lg font-bold">{wrapped.interactions.arch_nemesis}</p>
                            <p className="text-sm text-muted-foreground">{wrapped.interactions.death_count} deaths</p>
                        </div>
                    </div>

                    {wrapped.interactions.kill_counts && wrapped.interactions.kill_counts.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Top Kills</p>
                            <div className="space-y-1">
                                {wrapped.interactions.kill_counts.slice(0, 5).map((kill, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-sm">{kill.mob_type}</span>
                                        <span className="text-sm font-semibold">{kill.kill_count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Projects */}
            {wrapped.projects && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Projects</h2>
                    {wrapped.projects.favourite_project_name && (
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Favourite Project</p>
                            <p className="text-xl font-bold">{wrapped.projects.favourite_project_name}</p>
                            <p className="text-sm text-muted-foreground">{wrapped.projects.favourite_project_blocks_placed.toLocaleString()} blocks placed</p>
                        </div>
                    )}
                    {wrapped.projects.most_active_project_name && (
                        <div>
                            <p className="text-sm text-muted-foreground">Most Active Project</p>
                            <p className="text-xl font-bold">{wrapped.projects.most_active_project_name}</p>
                            <p className="text-sm text-muted-foreground">{wrapped.projects.most_active_project_total_activity.toLocaleString()} total actions</p>
                        </div>
                    )}
                </section>
            )}

            {/* Grind Day */}
            {wrapped.grind_day && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Peak Grind Day</h2>
                    <p className="text-lg mb-4">{new Date(wrapped.grind_day.grind_date).toLocaleDateString()}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Hours Played</p>
                            <p className="text-xl font-bold">{wrapped.grind_day.hours_played}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sessions</p>
                            <p className="text-xl font-bold">{wrapped.grind_day.sessions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Actions</p>
                            <p className="text-xl font-bold">{wrapped.grind_day.total_combined_actions.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Blocks</p>
                            <p className="text-xl font-bold">{wrapped.grind_day.blocks.toLocaleString()}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Social */}
            {wrapped.social?.favourite_people && wrapped.social.favourite_people.length > 0 && (
                <section className="mb-8 p-6 bg-card rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">Top Players You Played With</h2>
                    <div className="space-y-3">
                        {wrapped.social.favourite_people.map((person, idx) => (
                            <div key={person.other_player_id} className="flex justify-between items-center p-3 bg-muted rounded">
                                <div>
                                    <p className="font-semibold">#{idx + 1} {person.username}</p>
                                    {person.user && (
                                        <p className="text-xs text-muted-foreground">Level {person.user.level}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{(person.seconds_played_together / 3600).toFixed(2)} hrs</p>
                                    <p className="text-xs text-muted-foreground">together</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
