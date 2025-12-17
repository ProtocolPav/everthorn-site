import {useSidebar} from "@/components/ui/sidebar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SquareHalfIcon} from "@phosphor-icons/react";
import {cn} from "@/lib/utils.ts";
import {Separator} from "@/components/ui/separator.tsx";

export function AdminSidebarTrigger() {
    const { toggleSidebar, open } = useSidebar()

    return (
        <div className={cn(open ? "hidden" : "flex items-center gap-2")}>
            <Button
                size={'icon'}
                variant={'ghost'}
                onClick={toggleSidebar}
            >
                <SquareHalfIcon weight={'bold'} />
            </Button>

            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
        </div>
    )
}