// components/layout/header/desktop.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { WikiSection } from "./sections/wiki-section"
import { AdminSection } from "./sections/admin-section"

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/events', label: 'Events' },
]

export function Desktop() {
  const { data: session, status } = useSession()
  const isCM = status === 'authenticated' && session?.user?.everthornMemberInfo.isCM

  return (
      <NavigationMenu className="hidden md:flex" delayDuration={50}>
        <NavigationMenuList>
          {/* Simple navigation items */}
          {navigationItems.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={href}>{label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
          ))}

          {/* Wiki dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Wiki</NavigationMenuTrigger>
            <NavigationMenuContent>
              <WikiSection />
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Admin dropdown - only for CMs */}
          {isCM && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Admin Dashboard</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <AdminSection />
                </NavigationMenuContent>
              </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
  )
}
