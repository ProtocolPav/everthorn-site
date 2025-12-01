import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { Check, SendHorizonal } from "lucide-react";
import { motion } from "motion/react";

export function SubmitStep({ submitted, session }: StepProps) {
    return (
        <div className="space-y-4">
            {/* User Info */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-2.5"
            >
                {session?.user?.image && (
                    <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-border">
                        <img
                            src={session.user.image}
                            className="w-full h-full object-cover"
                            alt="Avatar"
                        />
                    </div>
                )}

                <div>
                    <h3 className="text-base font-bold mb-1">
                        Ready to submit{session?.user?.name ? `, ${session.user.name}` : ''}?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        We'll review your application and get back to you soon
                    </p>
                </div>
            </motion.div>

            {/* What's Next */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="rounded-lg border bg-card p-3 space-y-2"
            >
                <h4 className="text-xs font-semibold mb-2">What happens next:</h4>

                <div className="space-y-2">
                    {[
                        { num: "1", text: "We review your application (24-48 hours)" },
                        { num: "2", text: "Quick chat on Discord to get to know you" },
                        { num: "3", text: "Welcome to Everthorn!" }
                    ].map((item, index) => (
                        <motion.div
                            key={item.num}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                            className="flex items-start gap-2.5"
                        >
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 flex-shrink-0">
                                <span className="text-[10px] font-bold text-primary">{item.num}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
            >
                <Button
                    type="submit"
                    disabled={submitted}
                    className="w-full h-10 shadow-sm transition-all"
                >
                    {submitted ? (
                        <span className="flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Submitted!</span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <SendHorizonal className="w-4 h-4" />
                            <span className="text-sm font-medium">Submit Application</span>
                        </span>
                    )}
                </Button>
            </motion.div>

            {/* Success Message */}
            {submitted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-center"
                >
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Check your Discord for a friend request from our team!
                    </p>
                </motion.div>
            )}
        </div>
    );
}
