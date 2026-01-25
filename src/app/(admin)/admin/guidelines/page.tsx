"use client"
import Link from "next/link"

import {
  Accordion,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {Button} from "@/components/ui/button";
import { BookIcon, WarningIcon } from "@phosphor-icons/react"
import GeneralDuties from "@/components/features/guidelines/cm/general"
import ServerMaintenance from "@/components/features/guidelines/cm/maintenance"
import NewRecruitProcedures from "@/components/features/guidelines/cm/recruits"
import CMProjects from "@/components/features/guidelines/cm/projects"
import CMCommands from "@/components/features/guidelines/cm/commands"
import EventManagerDuties from "@/components/features/guidelines/cm/events"
import RecruitsManagerDuties from "@/components/features/guidelines/cm/recruits-manager"
import TechnicalManagerDuties from "@/components/features/guidelines/cm/technical"
import WarningGuidelines from "@/components/features/guidelines/cm/warnings";


export default function CMGuidelines() {
  return (
      <section className="grid items-center gap-6 pt-6 md:mx-10 md:pb-10 xl:mx-20">
          <div className="grid gap-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted flex-shrink-0">
                      <BookIcon weight={'duotone'} className="w-5 h-5 text-muted-foreground"/>
                  </div>
                  <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Community Manager Guidelines</h1>
                      <p className="text-sm text-muted-foreground">Everything that's important for the CM's to function properly.</p>
                  </div>
              </div>
          </div>
          
          <Accordion defaultValue={'general'} type="single" collapsible className="w-full space-y-2">

            <GeneralDuties />

            <WarningGuidelines/>

            <ServerMaintenance />
         
            <NewRecruitProcedures />
         
            <CMProjects />

            <CMCommands />

            {/*<EventManagerDuties />*/}

            {/*<RecruitsManagerDuties />*/}

            {/*<TechnicalManagerDuties />*/}
            
          </Accordion>

          <div className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/20 px-2 mb-2 py-1.5 sm:px-3 sm:py-2 rounded-sm border">
              <WarningIcon weight={'duotone'} className="size-3 sm:size-4 text-amber-500 mt-0.5 flex-shrink-0"/>
              <span className="leading-tight">
                <strong className="text-foreground">Note:</strong> These guidelines are strictly enforced.
                Violations may result in removal from the community.
              </span>
          </div>
      </section>
    )
}
