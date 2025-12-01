import { MoonIcon, SunIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-provider"

export function ModeToggle() {
    const { setTheme, userTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(userTheme === "light" ? "dark" : "light")}
        >
            <SunIcon className="h-6 w-[1.3rem] dark:hidden" weight={'fill'} />
            <MoonIcon className="hidden size-5 dark:block" weight={'fill'} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}