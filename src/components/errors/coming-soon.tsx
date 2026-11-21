import {HouseIcon, CaretLeftIcon} from "@phosphor-icons/react";
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
import {ConstructionIcon} from "lucide-react";

export function ComingSoonScreen() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ConstructionIcon />
                    </EmptyMedia>
                    <EmptyTitle>Coming Soon</EmptyTitle>
                    <EmptyDescription>
                        We're working really hard on this page. Check back later!
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
                            onClick={() => window.history.back()}
                        >
                            <CaretLeftIcon /> Go Back
                        </Button>
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    );
}
