import { EventBlock } from '@/api/nexuscore/model';

export type BlockType = EventBlock['type'];
export const BLOCK_TYPES: Record<EventBlock['type'], { 
  label: string; 
  icon: string; 
  factory: () => EventBlock; 
  editorPath: string; 
}> = {
  hero: {
    label: 'Banner',
    icon: 'HeroIcon',
    factory: () => ({ block_id: 1, position: 1.0, type: 'hero', image: '', eyebrow: '', tagline: '' }),
    editorPath: '@/components/features/events-creator/editor/hero-editor.tsx',
  },
  countdown: {
    label: 'Countdown',
    icon: 'CountdownIcon',
    factory: () => ({ block_id: 2, position: 2.0, type: 'countdown', label: '', target_time: '' }),
    editorPath: '@/components/features/events-creator/editor/countdown-editor.tsx',
  },
  statRow: {
    label: 'Stats',
    icon: 'StatsIcon',
    factory: () => ({ block_id: 3, position: 3.0, type: 'stat_row', items: [] }),
    editorPath: '@/components/features/events-creator/editor/stat-row-editor.tsx',
  },
  narrative: {
    label: 'Text',
    icon: 'TextIcon',
    factory: () => ({ block_id: 4, position: 4.0, type: 'narrative', heading: '', markdown: '' }),
    editorPath: '@/components/features/events-creator/editor/narrative-editor.tsx',
  },
  highlightGrid: {
    label: 'Highlights',
    icon: 'HighlightIcon',
    factory: () => ({ block_id: 5, position: 5.0, type: 'highlight_grid', heading: '', items: [] }),
    editorPath: '@/components/features/events-creator/editor/highlight-grid-editor.tsx',
  },
  prizeTiers: {
    label: 'Rewards',
    icon: 'TrophyIcon',
    factory: () => ({ block_id: 6, position: 6.0, type: 'prize_tiers', heading: '', tiers: [] }),
    editorPath: '@/components/features/events-creator/editor/prize-tiers-editor.tsx',
  },
  rulesColumns: {
    label: 'Rules',
    icon: 'RulesIcon',
    factory: () => ({ block_id: 7, position: 7.0, type: 'rules_columns', allowed: [], disallowed: [] }),
    editorPath: '@/components/features/events-creator/editor/rules-columns-editor.tsx',
  },
  faq: {
    label: 'FAQ',
    icon: 'FaqIcon',
    factory: () => ({ block_id: 8, position: 8.0, type: 'faq', heading: '', items: [] }),
    editorPath: '@/components/features/events-creator/editor/faq-editor.tsx',
  },
  mediaGallery: {
    label: 'Media',
    icon: 'GalleryIcon',
    factory: () => ({ block_id: 9, position: 9.0, type: 'media_gallery', heading: '', items: [] }),
    editorPath: '@/components/features/events-creator/editor/media-gallery-editor.tsx',
  },
  ctaBanner: {
    label: 'CTA',
    icon: 'CtaIcon',
    factory: () => ({ block_id: 10, position: 10.0, type: 'cta_banner', heading: '', description: '', buttons: [] }),
    editorPath: '@/components/features/events-creator/editor/cta-banner-editor.tsx',
  },
  divider: {
    label: 'Divider',
    icon: 'DividerIcon',
    factory: () => ({ block_id: 11, position: 11.0, type: 'divider' }),
    editorPath: '@/components/features/events-creator/editor/divider-editor.tsx',
  },
};