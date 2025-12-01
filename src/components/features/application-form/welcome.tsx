import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { ArrowRight, Clock, MessageSquare, Shield, LogIn, Info } from "lucide-react";
import { motion } from "motion/react";
import { authClient, signIn } from "@/lib/auth-client";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import {useNavigate} from "@tanstack/react-router";

export function WelcomeStep({ nextStep }: StepProps) {
    const { data: session, isPending } = authClient.useSession();
    const { isMember } = useEverthornMember();
    const navigate = useNavigate();

    // Loading state
    if (isPending) {
        return (
            <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Not logged in - show sign in
    if (!session) {
        return (
            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-2"
                >
                    <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <LogIn className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold">Sign in to continue</h2>
                        <p className="text-xs text-muted-foreground">
                            Sign in with Discord to apply
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-lg border bg-card p-2.5"
                >
                    <h3 className="font-semibold text-xs mb-1.5">Why Discord?</h3>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>All community communication</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Helps us reach out to you</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>Private and secure</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Button
                        type="button"
                        onClick={() => signIn()}
                        className="w-full h-9"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign in with Discord
                    </Button>
                </motion.div>

                {/* Go Home */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Button
                        type="button"
                        variant={'invisible'}
                        onClick={async () => await navigate({to: '/'})}
                        className="w-full h-9"
                    >
                        I'll look around for now
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Already a member - can't apply again (FIXED: was !isMember, should be isMember)
    if (isMember) {
        return (
            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-2"
                >
                    {session.user?.image && (
                        <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-border">
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div>
                        <h2 className="text-base font-bold">
                            Welcome back, {session.user?.name}!
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            You're already a member of Everthorn
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-lg border border-primary/20 bg-primary/5 p-2.5"
                >
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium mb-0.5">
                                You don't need to apply again
                            </p>
                            <p className="text-xs text-muted-foreground">
                                You're already part of our community! Reach out to staff on Discord if you need help.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Button
                        type="button"
                        onClick={async () => await navigate({to: '/'})}
                        className="w-full h-9"
                        variant="outline"
                    >
                        Return Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Logged in and not a member - show welcome content
    return (
        <div className="space-y-3">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-2"
            >
                {session.user?.image && (
                    <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-border">
                        <img
                            src={session.user.image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div>
                    <h2 className="text-base font-bold">
                        Welcome, {session.user?.name}!
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Let's get to know you better
                    </p>
                </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-1.5"
            >
                <div className="rounded-lg border bg-card p-2.5">
                    <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-medium text-xs">Takes 5-7 minutes</h3>
                            <p className="text-xs text-muted-foreground">
                                Questions about your Minecraft experience
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-2.5">
                    <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-medium text-xs">Your privacy matters</h3>
                            <p className="text-xs text-muted-foreground">
                                Only shared with our staff team
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-2.5">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-medium text-xs">Be yourself</h3>
                            <p className="text-xs text-muted-foreground">
                                No wrong answers, just be genuine
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full h-9"
                >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>

            {/* Go Home */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Button
                    type="button"
                    variant={'invisible'}
                    onClick={async () => await navigate({to: '/'})}
                    className="w-full h-9"
                >
                    I'll look around for now
                </Button>
            </motion.div>
        </div>
    );
}
