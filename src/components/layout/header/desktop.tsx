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
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CaretRightIcon, Icon as PhosphorIcon, } from "@phosphor-icons/react"

export function Desktop() {
    const { isCM } = useEverthornMember()

    return (
        <NavigationMenu className="hidden md:flex">
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
                                    <div className="rounded-xl grid w-[400px] gap-3 p-0 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                                        {/* 1. First Item: Parent Link as Card */}
                                        <Link
                                            to={item.href}
                                            className="group"
                                        >
                                            <Card className="rounded-lg h-full min-h-[180px] bg-gradient-to-br from-background to-muted/30 border-border transition-colors hover:border-primary/20 cursor-pointer">
                                                <CardHeader className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        {item.icon && (
                                                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                                <item.icon className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                        <h3 className="font-semibold">{item.label}</h3>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="flex flex-col justify-between flex-1">
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        {item.description || `View ${item.label} Overview`}
                                                    </p>

                                                    {/* Bottom arrow with label */}
                                                    <div className="flex items-center gap-1.5 text-muted-foreground/50 group-hover:text-primary transition-colors">
                                                        <span className="text-xs font-medium">View</span>
                                                        <CaretRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>

                                        {/* 2. Remaining Sub-links */}
                                        <ul className="grid gap-3">
                                            {item.sub_links.map((sub) => (
                                                <ListItem
                                                    key={sub.href}
                                                    title={sub.label}
                                                    to={sub.href}
                                                    icon={sub.icon}
                                                >
                                                    {sub.description || `Navigate to ${sub.label}`}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </div>
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
    to: string
    title: string
    icon?: PhosphorIcon
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
                            {Icon && <Icon className="size-5" weight={'duotone'} />}
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

