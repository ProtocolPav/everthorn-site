import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@phosphor-icons/react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface PageHeaderProps {
    icon?: Icon
    title: string
    description?: string
    breadcrumbs?: { label: string; href?: string }[]
    actions?: ReactNode
    gradient?: boolean
    className?: string
}

export function PageHeader({
                               icon: IconComponent,
                               title,
                               description,
                               breadcrumbs,
                               actions,
                               gradient = false,
                               className
                           }: PageHeaderProps) {
    return (
        <div className={cn("space-y-4 pb-6 border-b border-border/50", className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <BreadcrumbItem key={index}>
                                {index < breadcrumbs.length - 1 ? (
                                    <>
                                        <BreadcrumbLink href={crumb.href}>
                                            {crumb.label}
                                        </BreadcrumbLink>
                                        <BreadcrumbSeparator />
                                    </>
                                ) : (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}

            {/* Header content */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 sm:items-center flex-1 min-w-0">
                    {/* Icon */}
                    {IconComponent && (
                        <div className={cn(
                            "relative inline-flex overflow-hidden rounded-lg flex-shrink-0 w-fit",
                            gradient ? "p-[1.5px]" : ""
                        )}>
                            {gradient && (
                                <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ecd4ff_0%,#ffd9c4_14%,#fff9d4_28%,#d4ffd4_42%,#d4f4ff_56%,#d4dcff_70%,#e4d4ff_84%,#ecd4ff_100%)]" />
                            )}
                            <div className={cn(
                                "relative flex items-center justify-center w-12 h-12 rounded-lg z-10",
                                gradient
                                    ? "bg-background/95 backdrop-blur-xl"
                                    : "bg-muted"
                            )}>
                                <IconComponent
                                    weight="duotone"
                                    className="w-6 h-6 text-foreground"
                                />
                            </div>
                        </div>
                    )}

                    {/* Title and description */}
                    <div className="min-w-0 flex-1">
                        <h3>{title}</h3>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
