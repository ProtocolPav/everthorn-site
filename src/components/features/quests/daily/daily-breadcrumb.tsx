import { Link } from "@tanstack/react-router";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DailyBreadcrumbProps {
    /** The current page. Defaults to "Daily". */
    current?: string;
}

/** Admin header trail: Quests / Daily [/ current]. */
export function DailyBreadcrumb({ current }: DailyBreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-1.5">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/admin/quests" search={{}}>Quests</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {current ? (
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin/quests/daily">Daily</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold">Daily</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
                {current && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="max-w-[32ch] truncate font-semibold">{current}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
