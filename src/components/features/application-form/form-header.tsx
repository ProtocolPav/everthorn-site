// components/features/application-form/form-header.tsx
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface FormHeaderProps {
    currentStep: number;
    totalSteps: number;
    progress: number;
}

export function FormHeader({ currentStep, totalSteps, progress }: FormHeaderProps) {
    return (
        <div className="mb-5">
            {/* Step Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-sm font-medium text-foreground">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                </div>
                <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/90 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_ease-in-out_infinite]" />
                </motion.div>
            </div>
        </div>
    );
}
