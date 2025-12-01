import { LinkBreakIcon, HouseIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
                    {/* Simple animated icon */}
                    <div className="relative">
                        <LinkBreakIcon
                            size={64}
                            className="text-amber-500 animate-pulse"
                        />
                        <div className="absolute inset-0 animate-ping">
                            <LinkBreakIcon
                                size={64}
                                className="text-amber-500 opacity-20"
                            />
                        </div>
                    </div>

                    {/* Error code */}
                    <h1 className="text-6xl font-bold text-amber-500 font-mono">
                        404
                    </h1>

                    {/* Simple message */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">
                            Page Not Found
                        </h2>
                        <p className="text-muted-foreground">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Link to="/" className="flex-1">
                            <Button className="w-full" size="default">
                                <HouseIcon className="mr-2 h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            size="default"
                            onClick={() => window.history.back()}
                            className="flex-1"
                        >
                            <ArrowLeftIcon /> Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
