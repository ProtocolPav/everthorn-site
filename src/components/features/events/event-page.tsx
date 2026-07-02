import type { EventOut } from '@/api/nexuscore/model'
import { HeroBlock } from './blocks/hero-block'
import { CountdownBlock } from './blocks/countdown-block'
import { StatRowBlock } from './blocks/stat-row-block'
import { NarrativeBlock } from './blocks/narrative-block'
import { HighlightGridBlock } from './blocks/highlight-grid-block'
import { PrizeTiersBlock } from './blocks/prize-tiers-block'
import { RulesColumnsBlock } from './blocks/rules-columns-block'
import { FaqBlock } from './blocks/faq-block'
import { MediaGalleryBlock } from './blocks/media-gallery-block'
import { CtaBannerBlock } from './blocks/cta-banner-block'
import { DividerBlock } from './blocks/divider-block'

interface EventPageProps {
    event: EventOut
}

export function EventPage({ event }: EventPageProps) {
    return (
        <div className="min-h-screen">
            {event.blocks.map((block) => {
                const key = block.id
                switch (block.type) {
                    case 'hero':
                        return <HeroBlock key={key} block={block} event={event} />
                    case 'countdown':
                        return <CountdownBlock key={key} block={block} />
                    case 'stat_row':
                        return <StatRowBlock key={key} block={block} />
                    case 'narrative':
                        return <NarrativeBlock key={key} block={block} />
                    case 'highlight_grid':
                        return <HighlightGridBlock key={key} block={block} />
                    case 'prize_tiers':
                        return <PrizeTiersBlock key={key} block={block} />
                    case 'rules_columns':
                        return <RulesColumnsBlock key={key} block={block} />
                    case 'faq':
                        return <FaqBlock key={key} block={block} />
                    case 'media_gallery':
                        return <MediaGalleryBlock key={key} block={block} />
                    case 'cta_banner':
                        return <CtaBannerBlock key={key} block={block} />
                    case 'divider':
                        return <DividerBlock key={key} block={block} />
                    default:
                        return null
                }
            })}
        </div>
    )
}
