import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {cn} from "@/lib/utils.ts";
import {
    CheckIcon,
    PlusIcon,
    Icon as PhosphorIcon,
    HandGrabbingIcon,
    MapPinAreaIcon,
    HourglassLowIcon, SmileyXEyesIcon, CubeFocusIcon
} from "@phosphor-icons/react";
import {ObjectiveTypes} from "@/types/quests";

interface Customization {
    customization_id: string;
    display: string;
    icon: PhosphorIcon;
    // If empty, assumed that it is allowed on all Objective Types
    allowed_objective_types?: ObjectiveTypes[];
}

const CUSTOMIZATIONS: Customization[] = [
    {
        customization_id: 'natural_block',
        display: 'Require Natural Blocks',
        icon: CubeFocusIcon
    },
    {
        customization_id: 'mainhand',
        display: 'Require Mainhand',
        icon: HandGrabbingIcon
    },
    {
        customization_id: 'location',
        display: 'Require Location',
        icon: MapPinAreaIcon
    },
    {
        customization_id: 'timer',
        display: 'Timer',
        icon: HourglassLowIcon
    },
    {
        customization_id: 'maximum_deaths',
        display: 'Maximum Deaths',
        icon: SmileyXEyesIcon
    }
]

export function CustomizationSelect() {
    return (
        <Dialog>
            <DialogTrigger className={cn(
                "relative grid items-center gap-1 rounded-md border bg-secondary/40 p-2.5 text-sm shadow-sm w-fit"
            )}>
                <div className={'flex items-center gap-2'}>
                    <PlusIcon/>
                    Customize Objective
                </div>
                <div className={cn(
                    'absolute -right-1 -top-1 rounded-sm bg-blue-500 p-0.5'
                )}>
                    <CheckIcon size={12} weight={'bold'}/>
                </div>
            </DialogTrigger>
            <DialogContent className={'p-2'} showCloseButton={false}>
                <DialogTitle>Choose customization...</DialogTitle>
                <DialogDescription className={'flex gap-2 flex-wrap'}>
                    {CUSTOMIZATIONS.map((customization) => (
                        <div
                            key={customization.customization_id}
                            className={"relative grid items-center gap-1 rounded-md border bg-secondary/40 p-2 text-sm text-white shadow-sm w-fit"}
                        >
                            <div className={'flex items-center gap-2'}>
                                <customization.icon size={17}/>
                                {customization.display}
                            </div>
                            {/*<div className={cn(*/}
                            {/*    'absolute -right-1 -top-1 rounded-sm bg-blue-500 p-0.5'*/}
                            {/*)}>*/}
                            {/*    <CheckIcon size={12} weight={'bold'}/>*/}
                            {/*</div>*/}
                        </div>
                    ))}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}