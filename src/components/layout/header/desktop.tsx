import * as React from "react"
import { Link } from "@tanstack/react-router"
import { navigationItems } from "@/config/navigation"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// TODO: Replace this with your actual Auth hook for TanStack Start
function useAuth() {
    return { user: null, isCM: false, isAuthenticated: false }
}

export function Desktop() {
    const { isCM } = useAuth()

    return (
        <NavigationMenu className="hidden md:flex" delayDuration={50}>
            <NavigationMenuList>
                {navigationItems.map((item) => {
                    if (item.mobile_only) return null
                    if (item.admin && !isCM) return null

                    // 1. Dropdown Menu Handling
                    if (item.sub_links && item.sub_links.length > 0) {
                        return (
                            <NavigationMenuItem key={item.label}>
                                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                                    {item.label}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-0.5 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {/* 1. First Item: Parent Link (Overview) */}
                                        <ListItem
                                            to={item.href}
                                            title={item.label}
                                            icon={item.icon}
                                            className="bg-muted/40" // Adds subtle contrast to show it's the main link
                                        >
                                            View {item.label} Overview
                                        </ListItem>

                                        {/* 2. Remaining Sub-links */}
                                        {item.sub_links.map((sub) => (
                                            <ListItem
                                                key={sub.href}
                                                title={sub.label}
                                                to={sub.href}
                                                icon={sub.icon}
                                            >
                                                Navigate to {sub.label}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )
                    }

                    // 2. Standard Link Handling
                    return (
                        <NavigationMenuItem key={item.href}>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                                <Link to={item.href}>{item.label}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

// Define the props explicitly
interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    to: string  // TanStack Router uses 'to', not 'href'
    title: string
    icon?: React.ComponentType<{ className?: string }> // Better typing for icons
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
    ({ className, title, children, icon: Icon, to, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <Link
                        to={to}
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/40 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="flex items-center gap-2 text-sm font-medium leading-none text-foreground">
                            {Icon && <Icon className="size-4" />}
                            {title}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </Link>
                </NavigationMenuLink>
            </li>
        )
    }
)
ListItem.displayName = "ListItem"

