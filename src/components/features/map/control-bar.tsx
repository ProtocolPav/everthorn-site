import { Link } from "@tanstack/react-router";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Toggle } from "@/types/map-toggle";
import { CoordinatesControl } from "./controls/coords-control";
import { PinsControl } from "./controls/pins-control";
import { LayersControl } from "./controls/layers-control";

export function ControlBar({
    pins,
    update_pins,
    layers,
    update_layers,
}: {
    pins: Toggle[];
    update_pins: Function;
    layers: Toggle[];
    update_layers: Function;
    online_players: number;
}) {
    // Sits on top of the map viewport (not inside it), so its clicks, drags and wheel never reach the map
    return (
        <div data-slot="map-control-bar" className={"absolute top-0 left-0 z-10 m-2.5 flex items-center gap-2"}>
            <Card className={"bg-background/60 backdrop-blur-sm p-0 gap-0 overflow-hidden rounded-2xl"}>
                <CardContent className={"border border-white/20 rounded-xl flex gap-1 p-1"}>
                    <Button asChild key={"home"} variant={"ghost"} size={"icon"}>
                        <Link to="/">
                            <img
                                src={"https://cdn.everthorn.net/img/everthorn-logo-2026.png"}
                                alt={"logo"}
                                className={"size-7"}
                            />
                        </Link>
                    </Button>

                    <CoordinatesControl key={"coords"} />

                    <LayersControl key={"layers"} layers={layers} update_layers={update_layers} />

                    <PinsControl key={"pins"} pins={pins} update_pins={update_pins} />
                </CardContent>
            </Card>
        </div>
    );
}
