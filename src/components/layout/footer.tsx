"use client";

import Image from "next/image";
import Link from "next/link";
import { YoutubeLogoIcon, HeartIcon } from "@phosphor-icons/react";
import logo from "../../../public/everthorn.png";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SiteFooter() {
  const sections = [
    {
      title: "Community",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Team", href: "/team" },
        { name: "Apply To Join", href: "/apply" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Guidelines", href: "/guidelines" },
        { name: "Wiki", href: "/wiki" },
        { name: "World Map", href: "/map" },
      ],
    },
  ];

  const connectLinks = [{ href: "/youtube", icon: YoutubeLogoIcon }];

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid sm:flex gap-8 justify-between">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src={logo} alt="Everthorn Logo" width={40} height={40} />
              <div>
                <h2 className="text-lg font-bold text-foreground">Everthorn</h2>
                <p className="text-xs text-muted-foreground">
                  Together We Stand
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              A Minecraft Bedrock community building memories for 5+ years.
            </p>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {connectLinks.map(({ href, icon: Icon }) => (
                <Button key={href} asChild variant="ghost" size="icon">
                  <Link href={href} target="_blank" rel="noreferrer">
                    <Icon className="size-4" weight="fill" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-20 px-20">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-foreground mb-3 text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section - Bottom always, horizontal on desktop, vertical on mobile */}
        <div className="py-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            {/* Content Section */}
            <div className="lg:flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <HeartIcon className="size-5 text-red-500" weight="fill" />
                <h3 className="text-lg font-semibold text-foreground">
                  Support Everthorn
                </h3>
              </div>
              <div className="text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Help keep our server running and show your support for the
                community. Every bit counts!
              </div>
            </div>

            {/* Button Section */}
            <div className="lg:flex-none">
              <Button
                asChild
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 px-8 py-3 text-base"
              >
                <Link href="/support" target="_blank" rel="noreferrer">
                  <img
                    src={"kofi_symbol.svg"}
                    alt="Kofi Logo"
                    className="mr-2 size-5"
                  />
                  Become a Supporter
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="text-sm text-muted-foreground">
            © 2025 Everthorn Community. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
