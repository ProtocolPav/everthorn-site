import { createFileRoute, Outlet } from '@tanstack/react-router'
import SiteHeader from "@/components/layout/header/header.tsx";
import {Footer} from "@/components/ui/footer.tsx";
import {YoutubeLogoIcon} from "@phosphor-icons/react";


export const Route = createFileRoute('/_main')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
          <SiteHeader/>
          <Outlet/>
          <Footer
              logo={<img
                  src={"https://cdn.everthorn.net/img/everthorn-logo-2026.png"}
                  alt="Everthorn Logo"
                  className="size-9"
              />}
              brandName="Everthorn"
              socialLinks={[
                  {
                      icon:
                          <img
                            src={'https://cdn.everthorn.net/img/kofi_symbol.svg'}
                            alt="Kofi Logo"
                            className="m-auto size-5"
                          />,
                      href: "/support",
                      label: "Ko-Fi",
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
                  license: "All rights reserved",
              }}
          />
      </>
  )
}
