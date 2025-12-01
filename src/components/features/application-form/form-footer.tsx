// components/features/application-form/form-footer.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";

interface FormFooterProps {
    currentStep: number;
    totalSteps: number;
    canGoBack: boolean;
    canGoForward: boolean;
    onBack: () => void;
    onNext: () => void;
}

export function FormFooter({
                               currentStep,
                               totalSteps,
                               canGoBack,
                               canGoForward,
                               onBack,
                               onNext
                           }: FormFooterProps) {
    const { data: session } = authClient.useSession();

    // Disable next if not logged in and not on first step (welcome step)
    const isNextDisabled = !canGoForward || (currentStep === 0 && !session);

    return (
        <div className="space-y-3">
            {/* Navigation - Back and Next */}
            <div className="flex items-center justify-between border-t border-border/30 pt-2">
                {/* Back Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    disabled={!canGoBack}
                    className={`group h-8 px-3 transition-all ${
                        !canGoBack ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-xs">Back</span>
                </Button>

                {/* Step Dots */}
                <div className="flex items-center justify-center gap-1.5 py-1">
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <motion.div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${
                                i < currentStep
                                    ? "w-1.5 h-1.5 bg-primary"
                                    : i === currentStep
                                        ? "w-5 h-1.5 bg-primary"
                                        : "w-1.5 h-1.5 bg-muted-foreground/30"
                            }`}
                            animate={i === currentStep ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`group h-8 px-3 ${isNextDisabled ? "opacity-0 pointer-events-none" : ""}`}
                >
                    <span className="text-xs">Next</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
