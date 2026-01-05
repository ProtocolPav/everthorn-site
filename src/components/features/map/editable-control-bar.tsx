import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/types/map-toggle";
import { CoordinatesControl } from "./controls/coords-control";
import { PinsControl } from "./controls/pins-control";
import { LayersControl } from "./controls/layers-control";
import { EditControl } from "./controls/edit-control";
import {cn} from "@/lib/utils.ts";

export function EditableControlBar({
    pins,
    update_pins,
    layers,
    update_layers,
    isEditing,
    setIsEditing,
}: {
    pins: Toggle[];
    update_pins: Function;
    layers: Toggle[];
    update_layers: Function;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}) {
    return (
        <div className={"leaflet-top leaflet-left"}>
            <div className={"leaflet-control flex flex-col gap-1"}>
                <Card className={cn(
                    "bg-background/60 backdrop-blur-sm p-0 gap-0 overflow-hidden transition-all duration-200",
                    isEditing ? 'ring-4 ring-orange-500/80' : ''
                )}>
                    <CardContent className={"border border-white/20 rounded-xl flex gap-1 p-1 transition-all"}>
                        <div className={'hidden md:block'}>
                            <CoordinatesControl key={'coords'}/>
                        </div>

                        <LayersControl key={'layers'} layers={layers} update_layers={update_layers}/>

                        <PinsControl key={'pins'} pins={pins} update_pins={update_pins}/>

                        <EditControl key={'edit'} isEditing={isEditing} setIsEditing={setIsEditing}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}