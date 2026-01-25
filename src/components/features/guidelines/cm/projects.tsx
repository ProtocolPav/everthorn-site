import GuidelineItem from "../guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {BoundingBoxIcon, CheckCircleIcon, GlobeIcon, InfoIcon, MapPinIcon} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import * as React from "react";

export default function CMProjects() {
    return (
        <GuidelineItem name="Projects">
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon weight={'duotone'} className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Project Applications</h5>
                            <p className="text-sm mb-2">
                                They are found in the main server under <Badge variant={'command'}>#projects</Badge>,
                                in the Project Applications thread.
                            </p>

                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>
                                    <strong>Wait-List if: </strong>
                                    there is something wrong, like coordinates are too close, or it is too large.
                                </li>
                                <li><strong>Accept if: </strong>
                                    Everything is OK! Coords are fine, project size is fine.
                                    You can't Un-accept a project, so be sure about it!
                                </li>
                            </ul>

                            <Alert className={'mt-3'}>
                                <BoundingBoxIcon weight={'duotone'} className="size-4" />
                                <AlertDescription>
                                    <div>
                                        We do NOT accept large-scale projects. If a project is deemed too large, wait-list it
                                        and ask Pav or Ezio to delete it.
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPinIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Roads</h5>
                            <p className="text-sm">
                                Roads are a PRIORITY! Make sure all projects are connected to roads, and remind people regularly
                                to do so.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}