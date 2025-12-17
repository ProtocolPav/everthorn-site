import {HouseIcon, RobotIcon, CaretLeftIcon} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/components/ui/empty";

export function NotFoundScreen() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <RobotIcon />
                    </EmptyMedia>
                    <EmptyTitle>Page Not Found</EmptyTitle>
                    <EmptyDescription>
                        This page doesn't exist or has been moved.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <Link to="/">
                            <Button>
                                <HouseIcon /> Home
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant={'outline'}>
                                <CaretLeftIcon /> Go Back
                            </Button>
                        </Link>
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    );
}
