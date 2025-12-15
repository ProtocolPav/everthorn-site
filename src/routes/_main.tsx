import { createFileRoute, Outlet } from '@tanstack/react-router'
import SiteHeader from "@/components/layout/header/header.tsx";
import {Footer} from "@/components/ui/footer.tsx";
import logo from "/everthorn.png";
import {PatreonLogoIcon, YoutubeLogoIcon} from "@phosphor-icons/react";


export const Route = createFileRoute('/_main')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
          <SiteHeader/>
          <Outlet/>
          <Footer
              logo={<img src={logo} alt="Everthorn Logo" className="size-9" />}
              brandName="Everthorn"
              socialLinks={[
                  {
                      icon: <PatreonLogoIcon weight={'fill'} className="h-5 w-5" />,
                      href: "/support",
                      label: "Patreon",
                  },
                  {
                      icon: <YoutubeLogoIcon weight={'fill'} className="h-5 w-5" />,
                      href: "/youtube",
                      label: "Youtube",
                  },
              ]}
              mainLinks={[
                  { href: "/guidelines", label: "Guidelines" },
                  { href: "/about", label: "About" },
                  { href: "/events", label: "Events" },
                  { href: "/wiki", label: "Wiki" },
                  { href: "/map", label: "Map" },
              ]}
              legalLinks={[
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "Terms" },
              ]}
              copyright={{
                  text: "© 2026 Everthorn",
                  license: "All rights reserved. Not an official Minecraft product. Not associated with Mojang or Microsoft.",
              }}
          />
      </>
  )
}
