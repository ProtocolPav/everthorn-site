import type {Toggle} from "@/types/map-toggle";
import project from "/map/ui/project.png";
import player from "/map/ui/steve.png";
import farm from "/map/ui/farm.png";
import relic from "/map/ui/relic.png";
import shop from "/map/ui/shop.png";
import grass_block from "/map/ui/grass_block.png";
import netherrack from "/map/ui/netherrack.png";
import deepslate from "/map/ui/deepslate.png";
import endstone from "/map/ui/endstone.png";

export const DEFAULT_PINS: Toggle[] = [
    {
        id: "projects",
        name: "Projects",
        image: project,
        visible: true,
        label_visible: true,
    },
    {
        id: "players",
        name: "Players",
        image: player,
        visible: true,
        label_visible: true,
    },
    {
        id: "relics",
        name: "Landmarks",
        image: relic,
        visible: true,
        label_visible: false,
    },
    {
        id: "farms",
        name: "Farms",
        image: farm,
        visible: false,
        label_visible: false,
    },
    {
        id: "shops",
        name: "Shops",
        image: shop,
        visible: false,
        label_visible: false,
    },
    {
        id: "regions",
        name: "Regions",
        image: shop,
        visible: true,
        label_visible: false,
    },
];

export const DEFAULT_LAYERS: Toggle[] = [
    { id: "overworld", name: "Overworld", image: grass_block, visible: true, description: '80' },
    { id: "subway", name: "Subway", image: deepslate, visible: false, description: '-48' },
    { id: "nether", name: "Nether", image: netherrack, visible: false, description: '40' },
    { id: "the_end", name: "The End", image: endstone, visible: false, description: '80' },
];