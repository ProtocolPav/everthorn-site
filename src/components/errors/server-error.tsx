import {HouseIcon, SmileyMeltingIcon, ArrowClockwiseIcon} from "@phosphor-icons/react";
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

export function ServerErrorScreen() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SmileyMeltingIcon />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>
                        Something's wrong on our side. We're sorry! You can try again in a bit.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <Link to="/">
                            <Button>
                                <HouseIcon /> Home
                            </Button>
                        </Link>

                        <Button
                            variant={'outline'}
                            onClick={() => window.location.reload()}
                        >
                            <ArrowClockwiseIcon /> Reload
                        </Button>
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    );
}
