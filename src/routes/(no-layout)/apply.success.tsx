// routes/(no-layout)/apply/success.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, MessageSquare, Clock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export const Route = createFileRoute('/(no-layout)/apply/success')({
    component: ApplicationSuccess,
});

function ApplicationSuccess() {
    const { data: session } = authClient.useSession();
    const navigate = useNavigate();

    // Trigger confetti on mount
    useEffect(() => {
        // Initial burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Continuous confetti for 3 seconds
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="relative backdrop-blur-sm bg-background/80 border-border/50 shadow-2xl overflow-hidden">
                    {/* Subtle gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary/5 pointer-events-none" />

                    <CardHeader className="text-center pt-8 pb-4 px-6 relative">
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.1
                            }}
                            className="flex justify-center mb-4"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                                </div>
                                {/* Pulsing ring */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 0, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 rounded-full border-2 border-green-500"
                                />
                            </div>
                        </motion.div>

                        {/* User Avatar */}
                        {session?.user && 'image' in session.user && session.user.image && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-center mb-3"
                            >
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border">
                                    <img
                                        src={session.user.image as string}
                                        className="w-full h-full object-cover"
                                        alt="Avatar"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h1 className="text-2xl font-bold mb-2">
                                Application Submitted!
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Thanks for applying{session?.user && 'name' in session.user ? `, ${session.user.name as string}` : ''}! We're excited to review your application.
                            </p>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-4 relative">
                        {/* What Happens Next */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="rounded-lg border bg-card p-4 space-y-3"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-semibold">What happens next</h2>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        icon: Clock,
                                        title: "Review (24-48 hours)",
                                        description: "Our team will carefully review your application"
                                    },
                                    {
                                        icon: MessageSquare,
                                        title: "Discord Interview",
                                        description: "We'll send you a friend request for a quick chat"
                                    },
                                    {
                                        icon: CheckCircle2,
                                        title: "Welcome to Everthorn",
                                        description: "Join our community and start your adventure!"
                                    }
                                ].map((step, index) => (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <step.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <p className="text-sm font-medium mb-0.5">{step.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Important Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="rounded-lg border border-primary/20 bg-primary/5 p-3"
                        >
                            <div className="flex items-start gap-2.5">
                                <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium mb-1">
                                        Keep an eye on Discord
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Make sure your Discord DMs are open so we can reach out to you. Check your friend requests regularly!
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="space-y-2 pt-2"
                        >
                            <Button
                                type="button"
                                onClick={() => navigate({ to: '/' })}
                                className="w-full h-10"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Explore our Website!
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-center text-xs text-muted-foreground mt-6"
                >
                    Questions? Reach out on Reddit u/Skavandross
                </motion.p>
            </div>
        </div>
    );
}
