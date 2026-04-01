// @/config/wiki-options.ts
import {
    ScrollIcon,
    MapPinIcon,
    SwordIcon,
    BookOpenIcon,
    UsersThreeIcon,
    ConfettiIcon,
    ListDashesIcon,
    type Icon as PhosphorIcon, CastleTurretIcon,
} from "@phosphor-icons/react";

// ── Categories ──────────────────────────────────────────────────────

interface CategoryOption {
    slug: string;
    label: string;
    icon: PhosphorIcon;
    hue: number;
    badge: string;
}

export const WIKI_CATEGORIES: CategoryOption[] = [
    { slug: "all",        label: "All",        icon: ListDashesIcon,  hue: 240, badge: "" },
    { slug: "lore",       label: "Lore",       icon: ScrollIcon,      hue: 38,  badge: "bg-amber-900/80 text-amber-200 border-amber-500/30 backdrop-blur-sm" },
    { slug: "history",    label: "History",    icon: BookOpenIcon,    hue: 220, badge: "bg-slate-800/80 text-blue-200 border-blue-400/30 backdrop-blur-sm" },
    { slug: "characters", label: "Characters", icon: UsersThreeIcon,  hue: 340, badge: "bg-rose-900/80 text-rose-200 border-rose-400/30 backdrop-blur-sm" },
    { slug: "locations",  label: "Locations",  icon: MapPinIcon,      hue: 185, badge: "bg-cyan-900/80 text-cyan-200 border-cyan-400/30 backdrop-blur-sm" },
    { slug: "projects",   label: "Projects",   icon: CastleTurretIcon,   hue: 155, badge: "bg-emerald-900/80 text-emerald-200 border-emerald-400/30 backdrop-blur-sm" },
    { slug: "events",     label: "Events",     icon: ConfettiIcon,    hue: 310, badge: "bg-pink-900/80 text-pink-200 border-pink-400/30 backdrop-blur-sm" },
    { slug: "guides",     label: "Guides",     icon: SwordIcon,       hue: 270, badge: "bg-violet-900/80 text-violet-200 border-violet-400/30 backdrop-blur-sm" },
];

const DEFAULT_BADGE = "bg-black/60 text-white/80 border-white/20 backdrop-blur-sm";

const categoryBySlug = new Map(WIKI_CATEGORIES.map((c) => [c.slug, c]));

// ── Helpers ─────────────────────────────────────────────────────────

export function getCategoryBadge(category: string): string {
    return categoryBySlug.get(category.toLowerCase())?.badge ?? DEFAULT_BADGE;
}

export function getFallbackCoverStyle(pageId: string, category: string) {
    const hue = categoryBySlug.get(category.toLowerCase())?.hue ?? 240;

    let hash = 0;
    for (let i = 0; i < pageId.length; i++) {
        hash = ((hash << 5) - hash + pageId.charCodeAt(i)) | 0;
    }
    const angle = (Math.abs(hash) % 40) + 140;
    const shift = (Math.abs(hash) % 16) - 8;

    return {
        background: `
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.14'/%3E%3C/svg%3E"),
      linear-gradient(${angle}deg, hsl(${hue + shift}, 18%, 18%) 0%, hsl(${hue}, 20%, 14%) 50%, hsl(${hue - shift}, 15%, 11%) 100%)`,
        backgroundBlendMode: "overlay, normal" as const,
    };
}

export function formatViewCount(count: number) {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
}
