import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";

export function SubmitStep({ submitted, session }: StepProps) {
    return (
        <div className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto px-1">
            {/* User Avatar/Welcome Section */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img
                        src={session?.user?.image || ""}
                        className="w-12 h-12 rounded-full border-2 border-white"
                        alt="Avatar"
                    />
                </div>
                <p className="text-muted-foreground">
                    Great job, {session?.user?.name || 'there'}! 🎯
                </p>
            </div>

            {/* Next Steps */}
            <div className="rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">What happens next:</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        <span>We'll review your application</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        <span>Quick friendly chat on Discord</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                        <span>Welcome to Everthorn!</span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
                <Button
                    type="submit"
                    disabled={submitted}
                    className="w-full font-semibold"
                    size="lg"
                >
                    {submitted ? 'Application Sent! 🎊' : 'Submit Application 🚀'}
                </Button>

                {!submitted && (
                    <p className="text-sm text-muted-foreground mt-3">
                        We'll be in touch soon!
                    </p>
                )}
            </div>
        </div>
    );
}
