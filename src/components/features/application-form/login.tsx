"use client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DiscordButton } from "@/components/layout/discord/discord-button"
import { Users, MessageCircle, Shield, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogInPrompt() {
    const router = useRouter()

    const handleBackToHome = () => {
        router.push('/')
    }

    return (
        <div className="h-screen bg-background flex items-center justify-center p-4 md:p-6 overflow-hidden">
            <div className="mx-auto max-w-md w-full">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-primary-foreground" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl mb-2">
                            Welcome to Everthorn! 👋
                        </CardTitle>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Ready to start your journey?
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                How exciting! You're about to start your journey to joining Everthorn.
                            </p>

                            <div className="grid grid-cols-1 gap-4 my-8">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium">Discord Integration</p>
                                        <p className="text-xs text-muted-foreground">We use Discord for all communication</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium">Secure Authentication</p>
                                        <p className="text-xs text-muted-foreground">We'll contact you directly on Discord</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm">
                                Please log in with Discord to ensure we contact the correct person.
                            </p>
                        </div>

                        <div className="flex justify-center pt-4">
                            <DiscordButton className="transform hover:scale-105 transition-transform duration-200" />
                        </div>

                        {/* Back to Home Button */}
                        <div className="flex justify-center">
                            <Button
                                variant="link"
                                onClick={handleBackToHome}
                                className="flex items-center gap-2 text-muted-foreground/10 hover:text-foreground"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                I'll keep looking for now!
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
