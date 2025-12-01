import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {ReactNode} from "react";

interface GuidelineItemProps {
    name: string
    children: ReactNode
    important?: boolean
}

export default function GuidelineItem({ name, children, important }: GuidelineItemProps) {
    const key = name.replace(' ', '-').toLowerCase()

    return (
        <AccordionItem value={key} className="border rounded-lg last:border">
            <AccordionTrigger className="px-5 py-3 hover:cursor-pointer hover:no-underline hover:text-muted-foreground">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    {important && (
                        <Badge variant={'attention'}>
                            Must Read
                        </Badge>
                    )}
                </div>
            </AccordionTrigger>

            <AccordionContent className={'px-4'}>
                {children}
            </AccordionContent>
        </AccordionItem>
    )
}