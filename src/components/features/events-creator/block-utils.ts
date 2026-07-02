import type { 
  Block, 
  BlockId, 
  BlockPosition, 
  BlockTypeRegistry, 
  CreateBlockFn, 
  UpdateBlockFn 
} from '@/components/features/events-creator/block-registry';
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
import { createHeroBlock, createCountdownBlock, createStatRowBlock, createNarrativeBlock, createHighlightGridBlock, createPrizeTiersBlock, createRulesColumnsBlock, createFaqBlock, createMediaGalleryBlock, createCtaBannerBlock, createDividerBlock } from '@/components/features/events-creator/block-factories';

/**
 * Utility functions for managing block operations
 */
export function updateBlock(block: Block, updates: Partial<Block>): Block {
  return { ...block, ...updates };
}
export function moveBlock(blocks: Block[], fromIndex: number, toIndex: number): Block[] {
  const [movedBlock] = blocks.splice(fromIndex, 1);
  blocks.splice(toIndex, 0, movedBlock);
  return blocks;
}
export function addBlock(blocks: Block[], newBlock: Block): Block[] {
  return [...blocks, newBlock];
}
export function removeBlock(blocks: Block[], blockId: BlockId): Block[] {
  return blocks.filter(b => b.block_id !== blockId);
}
export function initializeBlockId(blocks: Block[]): BlockId {
  const existingIds = blocks.map(b => b.block_id);
  return Math.max(...existingIds) + 1 || 1;
}
export function calculatePosition(blocks: Block[]): void {
  // Implementation based on actual insert logic
  blocks.forEach((b, index) => b.position = index + 1.0);
}

/**
 * Block registry with factories and operations
 */
export const blockRegistry: BlockTypeRegistry = {
  hero: {
    label: 'Banner',
    icon: 'HeroIcon',
    factory: createHeroBlock,
    editorPath: '@/components/features/events-creator/editor/hero-editor.tsx',
  },
  countdown: {
    label: 'Countdown',
    icon: 'CountdownIcon',
    factory: createCountdownBlock,
    editorPath: '@/components/features/events-creator/editor/countdown-editor.tsx',
  },
  statRow: {
    label: 'Stats',
    icon: 'StatsIcon',
    factory: createStatRowBlock,
    editorPath: '@/components/features/events-creator/editor/stat-row-editor.tsx',
  },
  narrative: {
    label: 'Text',
    icon: 'TextIcon',
    factory: createNarrativeBlock,
    editorPath: '@/components/features/events-creator/editor/narrative-editor.tsx',
  },
  highlightGrid: {
    label: 'Highlights',
    icon: 'HighlightIcon',
    factory: createHighlightGridBlock,
    editorPath: '@/components/features/events-creator/editor/highlight-grid-editor.tsx',
  },
  prizeTiers: {
    label: 'Rewards',
    icon: 'TrophyIcon',
    factory: createPrizeTiersBlock,
    editorPath: '@/components/features/events-creator/editor/prize-tiers-editor.tsx',
  },
  rulesColumns: {
    label: 'Rules',
    icon: 'RulesIcon',
    factory: createRulesColumnsBlock,
    editorPath: '@/components/features/events-creator/editor/rules-columns-editor.tsx',
  },
  faq: {
    label: 'FAQ',
    icon: 'FaqIcon',
    factory: createFaqBlock,
    editorPath: '@/components/features/events-creator/editor/faq-editor.tsx',
  },
  mediaGallery: {
    label: 'Media',
    icon: 'GalleryIcon',
    factory: createMediaGalleryBlock,
    editorPath: '@/components/features/events-creator/editor/media-gallery-editor.tsx',
  },
  ctaBanner: {
    label: 'CTA',
    icon: 'CtaIcon',
    factory: createCtaBannerBlock,
    editorPath: '@/components/features/events-creator/editor/cta-banner-editor.tsx',
  },
  divider: {
    label: 'Divider',
    icon: 'DividerIcon',
    factory: createDividerBlock,
    editorPath: '@/components/features/events-creator/editor/divider-editor.tsx',
  },
};
type EventBlock = Block;
export type BlockId = number;
type BlockPosition = number;
