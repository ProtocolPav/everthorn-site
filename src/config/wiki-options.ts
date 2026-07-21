// @/config/wiki-options.ts
import {
    ScrollIcon,
    MapPinIcon,
    SwordIcon,
    BookOpenIcon,
    UsersThreeIcon,
    ConfettiIcon,
    ListDashesIcon,
    CastleTurretIcon,
} from "@phosphor-icons/react";
import type { SeamlessSelectOption } from "@/components/common/seamless-select";

// ── Categories ──────────────────────────────────────────────────────

/**
 * A wiki category.
 * Extends SeamlessSelectOption so it can be passed directly to <SeamlessSelect>.
 *
 * adminOnly: when true the category is only visible / selectable by CMs/Owners.
 */
export interface CategoryOption extends SeamlessSelectOption {
    /** The URL-safe identifier (also used as the filter value). */
    slug: string;
    /** HSL hue for the fallback cover gradient. */
    hue: number;
    /** Tailwind classes for the in-article category badge. */
    badge: string;
    /** When true, only admins (CM / Owner) can see and assign this category. */
    adminOnly?: boolean;
}

export const WIKI_CATEGORIES: CategoryOption[] = [
    {
        slug: "all",
        value: "all",
        label: "All",
        icon: ListDashesIcon,
        hue: 240,
        badge: "",
    },
    {
        slug: "lore",
        value: "lore",
        label: "Lore",
        icon: ScrollIcon,
        hue: 38,
        badge: "bg-amber-900/80 text-amber-200 border-amber-500/30 backdrop-blur-sm",
    },
    {
        slug: "history",
        value: "history",
        label: "History",
        icon: BookOpenIcon,
        hue: 220,
        badge: "bg-slate-800/80 text-blue-200 border-blue-400/30 backdrop-blur-sm",
    },
    {
        slug: "characters",
        value: "characters",
        label: "Characters",
        icon: UsersThreeIcon,
        hue: 340,
        badge: "bg-rose-900/80 text-rose-200 border-rose-400/30 backdrop-blur-sm",
    },
    {
        slug: "locations",
        value: "locations",
        label: "Locations",
        icon: MapPinIcon,
        hue: 185,
        badge: "bg-cyan-900/80 text-cyan-200 border-cyan-400/30 backdrop-blur-sm",
    },
    {
        slug: "projects",
        value: "projects",
        label: "Projects",
        icon: CastleTurretIcon,
        hue: 155,
        badge: "bg-emerald-900/80 text-emerald-200 border-emerald-400/30 backdrop-blur-sm",
        adminOnly: true,
    },
    {
        slug: "events",
        value: "events",
        label: "Events",
        icon: ConfettiIcon,
        hue: 310,
        badge: "bg-pink-900/80 text-pink-200 border-pink-400/30 backdrop-blur-sm",
        adminOnly: true,
    },
    {
        slug: "guides",
        value: "guides",
        label: "Guides",
        icon: SwordIcon,
        hue: 270,
        badge: "bg-violet-900/80 text-violet-200 border-violet-400/30 backdrop-blur-sm",
    },
];

// ── Helpers ─────────────────────────────────────────────────────────

const categoryBySlug = new Map(WIKI_CATEGORIES.map((c) => [c.slug, c]));

/**
 * Returns the subset of categories a given user may see/use.
 * Admins see everything; regular users see non-adminOnly entries.
 *
 * @param isAdmin  true when the current user is a CM or Owner.
 * @param includeAll  include the "all" meta-entry (default true).
 */
export function getVisibleCategories(
    isAdmin: boolean,
    includeAll = true,
): CategoryOption[] {
    return WIKI_CATEGORIES.filter(
        (c) =>
            (includeAll || c.slug !== "all") &&
            (!c.adminOnly || isAdmin),
    );
}

const DEFAULT_BADGE = "bg-black/60 text-white/80 border-white/20 backdrop-blur-sm";

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

// ── Sort Options ────────────────────────────────────────────────────

export interface SortOption {
    value: string;
    label: string;
    sortBy: "created_at" | "title" | "updated_at";
    sortOrder: "asc" | "desc";
}

export const WIKI_SORT_OPTIONS: SortOption[] = [
    { value: "newest", label: "Newest First", sortBy: "created_at", sortOrder: "desc" },
    { value: "oldest", label: "Oldest First", sortBy: "created_at", sortOrder: "asc" },
    { value: "updated", label: "Recently Updated", sortBy: "updated_at", sortOrder: "desc" },
];
