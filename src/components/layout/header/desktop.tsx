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
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts"
import { CaretRightIcon, Icon as PhosphorIcon } from "@phosphor-icons/react"

export function Desktop() {
    const { isCM } = useEverthornMember()

    return (
        <NavigationMenu viewport={false} className="hidden md:flex" delayDuration={120}>
            <NavigationMenuList>
                {navigationItems.map((item) => {
                    if (item.mobile_only) return null
                    if (item.admin && !isCM) return null

                    if (item.sub_links && item.sub_links.length > 0) {
                        return (
                            <NavigationMenuItem key={item.label}>
                                <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                                    {item.label}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className={'rounded-xl! p-1.5'}>
                                    <div className="grid w-[400px] grid-cols-[180px_1px_1fr] items-stretch md:w-[480px]">
                                        {/* Featured link */}
                                        <Link
                                            to={item.href}
                                            className="group flex flex-col gap-2 rounded-l-lg p-4 transition-colors hover:bg-accent/40"
                                        >
                                            {item.icon && (
                                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                                                    <item.icon className="size-[18px]" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium leading-none mb-1.5">{item.label}</div>
                                                <p className="text-[13px] leading-[1.45] text-muted-foreground line-clamp-5">
                                                    {item.description || `View ${item.label} Overview`}
                                                </p>
                                            </div>
                                            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[12px] font-medium text-muted-foreground/50 transition-colors group-hover:text-primary">
                                                Go to {item.label}
                                                <CaretRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                                            </span>
                                        </Link>

                                        {/* Divider */}
                                        <div className="bg-border/40" />

                                        {/* Sub-links */}
                                        <ul className="flex flex-col gap-0.5 pr-0 pl-1.5 justify-center">
                                            {item.sub_links.map((sub) => (
                                                <ListItem
                                                    key={sub.href}
                                                    title={sub.label}
                                                    to={sub.href}
                                                    icon={sub.icon}
                                                >
                                                    {sub.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )
                    }

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

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    to: string
    title: string
    icon?: PhosphorIcon
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
    ({ className, title, children, icon: Icon, to, style, ...props }, ref) => {
        return (
            <li className="nav-sublink-item" style={style}>
                <NavigationMenuLink asChild>
                    <Link
                        to={to}
                        ref={ref}
                        className={cn(
                            "flex flex-col h-17 rounded-md px-2.5 justify-center text-[13px] leading-tight transition-colors hover:bg-accent/50 focus:bg-accent focus:text-accent-foreground outline-none group/item",
                            className
                        )}
                        {...props}
                    >
                        {/* Title row — icon inline with title text */}
                        <div className="flex items-center gap-2.5">
                            {Icon && (
                                <Icon
                                    className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/item:text-foreground"
                                    weight="duotone"
                                />
                            )}
                            <span className="font-medium">{title}</span>
                        </div>

                        {/* Description + caret row */}
                        <div className="flex items-end justify-between gap-2 mt-0.5">
                            {children && (
                                <p className="text-[12px] leading-[1.4] text-muted-foreground line-clamp-1">
                                    {children}
                                </p>
                            )}
                            <CaretRightIcon className="size-3 shrink-0 ml-auto text-muted-foreground/0 transition-all group-hover/item:text-muted-foreground/60 group-hover/item:translate-x-0.5" />
                        </div>
                    </Link>
                </NavigationMenuLink>
            </li>
        )
    }
)
ListItem.displayName = "ListItem"
