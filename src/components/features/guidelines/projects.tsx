import GuidelineItem from "./guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {InfoIcon, CheckCircleIcon, MapPinIcon, GlobeIcon, BoundingBoxIcon} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import {Link} from "@tanstack/react-router";

export default function ProjectRules() {
    return (
        <GuidelineItem name={'Project Rules'} important>
            <div className="grid gap-6">
                <Alert variant={'info'}>
                    <InfoIcon weight={'duotone'} className="size-4" />
                    <AlertDescription>
                        <div>
                            Projects are how we organize and showcase community builds. Every build needs to be registered as a project.
                        </div>
                    </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon weight={'duotone'} className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>How to Apply</h5>
                            <p className="text-sm mb-2">To start building, you need to register your project:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Use <Badge variant="command">/project apply</Badge> on Discord</li>
                                <li>Provide coordinates, description, and name</li>
                            </ul>

                            <Alert className={'mt-3'}>
                                <BoundingBoxIcon weight={'duotone'} className="size-4" />
                                <AlertDescription>
                                    <div>
                                        First timers should start small.
                                        Large projects require you to have completed <strong>at least one project</strong> beforehand and
                                        will otherwise be <strong>denied.</strong>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPinIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Build A Road</h5>
                            <p className="text-sm">
                                <strong>All projects must connect to our road system.</strong> This can be a simple dirt path or an elaborate decorated route.
                                You are responsible for getting your own road built, but you can always ask for help 😀
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <GlobeIcon weight={'duotone'} className="size-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Project Benefits</h5>
                            <p className="text-sm mb-2">When your project is approved, you'll receive:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li><strong>Map Pin</strong> - Featured on our <Link to="/map" className="text-blue-600 underline hover:text-blue-800">world map</Link> for discovery</li>
                                <li><strong>Discord Thread</strong> - Share progress and get community feedback</li>
                                <li><Badge variant={'cyan'}>Coming Soon!</Badge> <strong>Wiki Page</strong> - Document lore, updates, and project information</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}