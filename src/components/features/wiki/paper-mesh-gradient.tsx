import { StaticMeshGradient } from "@paper-design/shaders-react";

// ─── Hash helper — deterministic per slug ──────────────────────────

function hashString(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return Math.abs(h >>> 0);
}

// ─── Interesting palettes — hash-driven, not a single muted preset ──
// We keep the mesh *shape* from the 1960s preset you liked, but generate
// a distinct 4-stop palette per slug so each chronicle feels like its own
// tapestry. Hue families rotate 0-360, keeping dark/light contrast for
// white text on cards while letting colour be genuinely varied.

function generatePalette(hash: number): string[] {
    // Handles negative hashes too, so every hue is safely in 0–359.
    const mod = (value: number, divisor: number) =>
        ((value % divisor) + divisor) % divisor;

    const baseHue = mod(hash, 360);
    const h2 = mod(hash >>> 11, 360);
    const strategy = mod(hash, 3);

    if (strategy === 0) {
        // Analogous — earthy editorial / archival.
        // Ink → coloured shadow → warm paper → terracotta/gold accent.
        return [
            hslToHex(baseHue, 24, 11),
            hslToHex(mod(baseHue + 20, 360), 42, 23),
            hslToHex(mod(baseHue + 42, 360), 34, 84),
            hslToHex(mod(baseHue + 28, 360), 64, 48),
        ];
    }

    if (strategy === 1) {
        // Complementary — dusk and jewel tones.
        // The background is still dark, but visibly coloured rather than black.
        return [
            hslToHex(baseHue, 30, 12),
            hslToHex(mod(baseHue + 188, 360), 48, 25),
            hslToHex(mod(baseHue + 24, 360), 30, 86),
            hslToHex(mod(baseHue + 180, 360), 68, 52),
        ];
    }

    // Split-triad — more playful without becoming overly neon.
    return [
        hslToHex(h2, 26, 12),
        hslToHex(mod(h2 + 30, 360), 46, 24),
        hslToHex(mod(h2 + 56, 360), 32, 87),
        hslToHex(mod(h2 + 145, 360), 60, 50),
    ];
}

function hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export interface PaperMeshProps {
    slug: string;
    category: string;
    className?: string;
}

/**
 * Paper Shader fallback for wiki pages without a cover image.
 * Uses the StaticMeshGradient shape you liked, but with a per-page
 * 4-stop palette generated from `slug` + `category` — each chronicle gets
 * its own tapestry (warm, jewel, triadic) while staying dark enough for
 * white card text. Geometry (rotation, scale, offset, wave) also varies.
 */
export function WikiPaperMesh({ slug, category, className }: PaperMeshProps) {
    const key = `${slug}::${category}`;
    const h = hashString(key);

    // Deterministic geometry from hash — keeps the sixtiesPreset look but makes each page unique
    const rotation = h % 360;
    const scale = 0.85 + ((h >> 8) % 35) / 100; // 0.85 - 1.20
    const offsetX = (((h >> 12) % 200) - 100) / 300; // -0.33 .. 0.33
    const offsetY = (((h >> 16) % 200) - 100) / 300;
    const positions = 30 + (h % 28); // 30 - 58
    const waveX = 0.32 + ((h >> 4) % 22) / 100; // 0.32 - 0.54
    const waveY = 0.85 + ((h >> 6) % 15) / 100; // 0.85 - 1.00
    const waveXShift = ((h >> 10) % 100) / 100;
    const waveYShift = ((h >> 14) % 100) / 100;

    // Per-page palette — genuinely varied, not just ±20° shifts of a single muted preset
    const colors = generatePalette(h);

    return (
        <div className={className ?? "absolute inset-0 overflow-hidden"} aria-hidden>
            <StaticMeshGradient
                colors={colors}
                positions={positions}
                waveX={waveX}
                waveXShift={waveXShift}
                waveY={waveY}
                waveYShift={waveYShift}
                mixing={0}
                grainMixer={0.37}
                grainOverlay={0.78}
                rotation={rotation}
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
                // Sizing — fill the container, cover mode, no extra world scaling
                width="100%"
                height="100%"
                fit="cover"
                style={{ width: "100%", height: "100%" }}
            />
            {/* Subtle paper grain already handled by shader's grainMixer/grainOverlay, but keep a faint overlay for depth when shader is still hydrating */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
