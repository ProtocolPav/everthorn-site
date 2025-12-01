import GuidelineItem from "./guideline-item";
import {Button} from "@/components/ui/button";
import {ArrowRightIcon} from "@phosphor-icons/react";
import {Link} from "@tanstack/react-router";

export default function ServerAddons() {
    return (
        <GuidelineItem name={'Server Addons'}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                <div>
                    <h5 className="font-medium mb-1">Technical Features & Custom Content</h5>
                    <p className="text-sm text-muted-foreground">
                        Learn about our third-party addons, custom server software, exclusive items, and End dimension features.
                    </p>
                </div>
                <Button asChild variant="default" className="w-full sm:w-auto">
                    <Link to="/technical" className="flex items-center gap-2">
                        View Technical Page
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </Button>
            </div>
        </GuidelineItem>
    )
}
