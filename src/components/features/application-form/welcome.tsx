import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {StepProps} from "@/types/application-step";

export function WelcomeStep({ session, nextStep }: StepProps) {
    return (
        <div className="space-y-6">
            <Card className="bg-muted/50 border-none p-3">
                <CardContent className="">
                    <div className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <img src={session?.user?.image || ""} className="aspect-square rounded-full" alt="Avatar"/>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Hello, @{session?.user?.name || 'there'}! 👋
                            </h3>
                            <p className="text-muted-foreground">
                                Ready to join the Everthorn community? We're excited to learn more about you!
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button
                type="button"
                onClick={nextStep}
                className="w-full"
                size="lg"
            >
                Let's get started! 🚀
            </Button>
        </div>
    )
}