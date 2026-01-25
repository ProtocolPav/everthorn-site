"use client"
import {Accordion,} from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as React from "react"
import { BookIcon, WarningIcon} from "@phosphor-icons/react"
import ServerRules from "@/components/features/guidelines/server";
import DiscordRules from "@/components/features/guidelines/discord";
import ProjectRules from "@/components/features/guidelines/projects";
import EventsRules from "@/components/features/guidelines/events";
import ConnectionRules from "@/components/features/guidelines/connection";
import StrikesRules from "@/components/features/guidelines/strikes";
import ServerAddons from "@/components/features/guidelines/addons";

export default function Guidelines() {
  return (
      <section className="mx-5 grid items-center gap-6 pt-6 md:mx-10 md:pb-10 xl:mx-20">
          <div className="grid gap-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted flex-shrink-0">
                      <BookIcon weight={'duotone'} className="w-5 h-5 text-muted-foreground"/>
                  </div>
                  <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Guidelines</h1>
                      <p className="text-sm text-muted-foreground">Community rules and standards</p>
                  </div>
              </div>
          </div>

          <Accordion defaultValue={'getting-started'} type="single" collapsible className="w-full space-y-2">
              <ConnectionRules/>
              <ServerRules/>
              <ProjectRules/>
              <DiscordRules/>
              <StrikesRules/>
              <EventsRules/>
              <ServerAddons/>
          </Accordion>

          <div className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/20 px-2 mb-2 py-1.5 sm:px-3 sm:py-2 rounded-sm border">
              <WarningIcon weight={'duotone'} className="size-3 sm:size-4 text-amber-500 mt-0.5 flex-shrink-0"/>
              <span className="leading-tight">
                <strong className="text-foreground">Note:</strong> These rules are strictly enforced.
                Violations may result in removal from the community.
              </span>
          </div>
      </section>
  )
}
