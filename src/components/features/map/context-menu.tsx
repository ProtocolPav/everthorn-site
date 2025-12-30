import ReactLeafletRightClick, {useLeafletRightClick} from "react-leaflet-rightclick";
import {LeafletMouseEvent} from "leaflet";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CheckIcon, CopyIcon, LinkIcon} from "@phosphor-icons/react";

import {toast} from "sonner";
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {AnimatePresence, motion} from "motion/react";
import {useState} from "react";


function ContextMenuComponent(event: LeafletMouseEvent | null) {
    const [coordsCopied, setCoordsCopied] = useState(false)
    const [linkCopied, setLinkCopied] = useState(false)

    const coordinates = event
        ? { z: -Math.floor(event.latlng.lat), x: Math.floor(event?.latlng.lng) }
        : {x:0, z:0}

    const handleCopyCoordinates = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click

        const coords = `${coordinates.x} 70 ${coordinates.z}`
        navigator.clipboard.writeText(coords).then()
        toast.success(`Copied ${coords} to clipboard`)
        setCoordsCopied(true)
        setTimeout(() => setCoordsCopied(false), 2000)
    }

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent card click

        const coords = `${coordinates.x} 70 ${coordinates.z}`
        navigator.clipboard.writeText(coords).then()
        toast.success(`Copied ${coords} to clipboard`)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
    }

    return (
        <Card className={'rounded-md rounded-tl-none bg-background/60 backdrop-blur-sm p-0'}>
            <CardContent className={'grid gap-1 p-0'}>
                <ButtonGroup>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-tl-none text-[10px] md:text-xs px-2 gap-1.5 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                        onClick={handleCopyCoordinates}
                    >
                        <span className="font-minecraft-seven tabular-nums">
                            {coordinates.x}, {coordinates.z}
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] md:text-xs px-2 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                        onClick={handleCopyCoordinates}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {coordsCopied ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <CheckIcon className="size-3.5" weight="bold" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <CopyIcon className="size-3.5" weight="bold" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] md:text-xs px-2 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                        onClick={handleCopyLink}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {linkCopied ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <CheckIcon className="size-3.5" weight="bold" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <LinkIcon className="size-3.5" weight="bold" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </ButtonGroup>
            </CardContent>
        </Card>
    )
}


export default function ContextMenu() {
    const event = useLeafletRightClick();

    return (
        <ReactLeafletRightClick customComponent={ContextMenuComponent(event)}/>
    )
}