import type { 
  HeroBlock, 
  CountdownBlock, 
  StatRowBlock, 
  NarrativeBlock, 
  HighlightGridBlock, 
  PrizeTiersBlock, 
  RulesColumnsBlock, 
  FaqBlock, 
  MediaGalleryBlock, 
  CtaBannerBlock, 
  DividerBlock 
} from '@/api/nexuscore/model';
import type { StatItem } from '@/api/nexuscore/model/statItem';
import type { HighlightItem } from '@/api/nexuscore/model/highlightItem';
import type { PrizeTier } from '@/api/nexuscore/model/prizeTier';
import type { FaqItem } from '@/api/nexuscore/model/faqItem';
import type { MediaItem } from '@/api/nexuscore/model/mediaItem';
import type { CtaButton } from '@/api/nexuscore/model/ctaButton';

/**
 * Factory functions for creating default instances of each block type
 * All required fields are populated with sensible defaults
 */

export function createHeroBlock(id: number, position: number): HeroBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'hero',
    image: '',
    eyebrow: '',
    tagline: '',
  };
}

export function createCountdownBlock(id: number, position: number): CountdownBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'countdown',
    label: '',
    target_time: new Date().toISOString(), // Default to now
  };
}

export function createStatRowBlock(id: number, position: number): StatRowBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'stat_row',
    items: [], // Will be populated via editor
  };
}

export function createNarrativeBlock(id: number, position: number): NarrativeBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'narrative',
    heading: '',
    markdown: '',
  };
}

export function createHighlightGridBlock(id: number, position: number): HighlightGridBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'highlight_grid',
    heading: '',
    items: [], // Will be populated via editor
  };
}

export function createPrizeTiersBlock(id: number, position: number): PrizeTiersBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'prize_tiers',
    heading: '',
    tiers: [], // Will be populated via editor
  };
}

export function createRulesColumnsBlock(id: number, position: number): RulesColumnsBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'rules_columns',
    allowed: [],
    disallowed: [],
  };
}

export function createFaqBlock(id: number, position: number): FaqBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'faq',
    heading: '',
    items: [], // Will be populated via editor
  };
}

export function createMediaGalleryBlock(id: number, position: number): MediaGalleryBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'media_gallery',
    heading: '',
    items: [], // Will be populated via editor
  };
}

export function createCtaBannerBlock(id: number, position: number): CtaBannerBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'cta_banner',
    heading: '',
    description: '',
    buttons: [], // Will be populated via editor
  };
}

export function createDividerBlock(id: number, position: number): DividerBlock {
  return {
    block_id: id,
    position,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: 'divider',
  };
}