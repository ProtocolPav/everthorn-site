import { Card, CardContent } from "@/components/ui/card";
import logo from "/everthorn.png";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/types/map-toggle";
import { CoordinatesControl } from "./controls/coords-control";
import { PinsControl } from "./controls/pins-control";
import { LayersControl } from "./controls/layers-control";
import { Link } from "@tanstack/react-router";

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
    return (
        <div className={"leaflet-top leaflet-left"}>
            <div className={"leaflet-control flex items-center gap-2"}>
                <Card className={"bg-background/60 backdrop-blur-sm p-0 gap-0 overflow-hidden"}>
                    <CardContent className={"flex gap-1 p-1"}>
                        <Button asChild key={"home"} variant={"ghost"} size={"icon"}>
                            <Link to="/">
                                <img src={logo} alt={"logo"} className={"size-7"} />
                            </Link>
                        </Button>

                        <CoordinatesControl key={'coords'}/>

                        <LayersControl key={'layers'} layers={layers} update_layers={update_layers}/>

                        <PinsControl key={'pins'} pins={pins} update_pins={update_pins}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
