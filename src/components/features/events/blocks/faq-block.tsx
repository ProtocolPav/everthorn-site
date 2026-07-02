import type { FaqBlock as FaqBlockType } from '@/api/nexuscore/model'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { ChatCircleIcon } from '@phosphor-icons/react'

interface FaqBlockProps {
    block: FaqBlockType
}

export function FaqBlock({ block }: FaqBlockProps) {
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div className="mb-8 flex items-center gap-2.5">
                    <ChatCircleIcon className="w-6 h-6 text-primary" weight="duotone" />
                    <h2 className="text-2xl md:text-3xl font-bold">
                        {block.heading ?? 'Frequently Asked Questions'}
                    </h2>
                </div>
                <div className="rounded-xl border bg-card overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                        {block.items.map((item, i) => (
                            <AccordionItem
                                key={i}
                                value={`faq-${i}`}
                                className="border-b last:border-0 px-5"
                            >
                                <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
