import { createFileRoute, Outlet } from '@tanstack/react-router'
import SiteHeader from "@/components/layout/header/header.tsx";
import {Footer} from "@/components/ui/footer.tsx";
import {YoutubeLogoIcon} from "@phosphor-icons/react";
import {Banner} from "@/components/common/banner.tsx";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";


export const Route = createFileRoute('/_main')({
  component: RouteComponent,
})

function RouteComponent() {
    const {thornyUser} = useEverthornMember()

  return (
      <>
          <SiteHeader/>

          {thornyUser && thornyUser.username === "dumbeyyuraya" && (
              <Banner variant={'info'} className={'text-sm'}>
                  Hey, <b>{thornyUser.username}</b>!
                  We liked your application and would like to invite you to the next stage of our recruitment process! <br/><br/>
                  We were unable to contact you via Discord so this is our last hope. Hopefully you see this. <br/><br/>
                  Please join our interview server: <a className={'text-base underline text-white'} href={"https://discord.gg/UFmhXT4S3S"}>https://discord.gg/UFmhXT4S3S</a>
              </Banner>
          )}

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
