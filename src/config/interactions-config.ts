import {
    SwordIcon,
    ShovelIcon,
    CubeIcon,
    LightningIcon,
    SkullIcon,
    FileTextIcon,
} from '@phosphor-icons/react';

export const interactionTypes = {
    kill:        { label: 'Kill',         icon: SwordIcon,      variant: 'red'    as const },
    mine:        { label: 'Mine',         icon: ShovelIcon,    variant: 'cyan'   as const },
    place:       { label: 'Place',        icon: CubeIcon,       variant: 'green'  as const },
    use:         { label: 'Use',          icon: LightningIcon,  variant: 'purple' as const },
    die:         { label: 'Die',          icon: SkullIcon,      variant: 'amber'  as const },
    scriptevent: { label: 'Script Event', icon: FileTextIcon,   variant: 'pink'   as const },
} as const;

export const dimensions = {
    'minecraft:overworld': { label: 'Overworld', img: '/map/ui/grass_block.png'  },
    'minecraft:nether':    { label: 'Nether',    img: '/map/ui/netherrack.png'   },
    'minecraft:the_end':   { label: 'End',       img: '/map/ui/endstone.png'     },
} as const;