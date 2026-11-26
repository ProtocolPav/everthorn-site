// OpenLayers styles for the live map.
// Markers render on a canvas, so the old Leaflet HTML `divIcon`s are redrawn here pixel for pixel.
import { Fill, Icon, Stroke, Style } from "ol/style";
import type { Region } from "./map-regions";

const pixelRatio = () => (typeof window === "undefined" ? 1 : Math.max(1, window.devicePixelRatio || 1));

// --- Fonts -------------------------------------------------------------------------------------

const FONT_TEN = "'Minecraft Ten', sans-serif";
const FONT_SEVEN = "'Minecraft Seven', monospace";

let fontsReady: Promise<void> | null = null;

/** Resolves once the Minecraft fonts can be drawn on a canvas. Clears cached text styles. */
export function ensureMapFonts(): Promise<void> {
    if (!fontsReady) {
        fontsReady = Promise.all([
            document.fonts.load(`17px ${FONT_TEN}`),
            document.fonts.load(`12px ${FONT_SEVEN}`),
        ])
            .catch(() => undefined)
            .then(() => {
                textStyleCache.clear();
            });
    }
    return fontsReady;
}

// --- Canvas helpers ----------------------------------------------------------------------------

function createCanvas(width: number, height: number) {
    const ratio = pixelRatio();
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(ratio, ratio);
    return { canvas, ctx, ratio };
}

/** Draws text vertically centered in a box, like `line-height: 1` + flex centering. */
function drawCenteredText(ctx: CanvasRenderingContext2D, text: string, cx: number, top: number, height: number) {
    const m = ctx.measureText(text);
    const ascent = m.actualBoundingBoxAscent;
    const descent = m.actualBoundingBoxDescent;
    ctx.fillText(text, cx, top + (height + ascent - descent) / 2);
}

/** Beveled block face: CSS `box-shadow: inset 2px 2px light, inset -2px -2px dark`. */
function drawBevel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    light: string,
    dark: string,
    size = 2,
) {
    ctx.fillStyle = dark;
    ctx.fillRect(x, y + h - size, w, size);
    ctx.fillRect(x + w - size, y, size, h);
    ctx.fillStyle = light;
    ctx.fillRect(x, y, w - size, size);
    ctx.fillRect(x, y, size, h - size);
}

const textStyleCache = new Map<string, Style>();

// --- 1. MINECRAFT BLOCK STYLE (cluster count) --------------------------------------------------

const BLOCK_PALETTES = {
    grass: { bg: "#74a753", border: "#092B00", light: "rgba(255,255,255,0.3)", dark: "rgba(0,0,0,0.25)" },
    gold: { bg: "#f0c534", border: "#594A00", light: "rgba(255,255,255,0.4)", dark: "rgba(0,0,0,0.2)" },
    diamond: { bg: "#64efff", border: "#005954", light: "rgba(255,255,255,0.5)", dark: "rgba(0,0,0,0.2)" },
};

const BLOCK_SIZE = 32;

export function createMinecraftBlockStyle(count: number): Style {
    const key = `block:${count}`;
    const cached = textStyleCache.get(key);
    if (cached) return cached;

    const c = count >= 30 ? BLOCK_PALETTES.diamond : count >= 10 ? BLOCK_PALETTES.gold : BLOCK_PALETTES.grass;
    const { canvas, ctx, ratio } = createCanvas(BLOCK_SIZE, BLOCK_SIZE);

    // border: 2px solid
    ctx.fillStyle = c.border;
    ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fillStyle = c.bg;
    ctx.fillRect(2, 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
    drawBevel(ctx, 2, 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4, c.light, c.dark);

    // 17px white text, text-shadow: 1px 1px 0 #696969
    ctx.font = `17px ${FONT_TEN}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const text = String(count);
    ctx.fillStyle = "#696969";
    drawCenteredText(ctx, text, BLOCK_SIZE / 2 + 1, 1, BLOCK_SIZE);
    ctx.fillStyle = "#fff";
    drawCenteredText(ctx, text, BLOCK_SIZE / 2, 0, BLOCK_SIZE);

    const style = new Style({
        image: new Icon({ img: canvas, scale: 1 / ratio, anchor: [0.5, 0.5] }),
        zIndex: 1000 + count,
    });
    textStyleCache.set(key, style);
    return style;
}

// --- 2. REGION BADGE STYLE (collapsed region) --------------------------------------------------

export function createRegionBadgeStyle(region: Region, count: number): Style {
    const key = `region:${region.id}:${count}`;
    const cached = textStyleCache.get(key);
    if (cached) return cached;

    const measure = createCanvas(1, 1).ctx;
    measure.font = `16px ${FONT_TEN}`;
    const nameWidth = measure.measureText(region.name).width;
    measure.font = `12px ${FONT_SEVEN}`;
    const countText = String(count);
    const countWidth = Math.max(16, measure.measureText(countText).width) + 12; // padding 4px 6px 2px 6px

    const border = 2;
    const padX = 8;
    const padY = 5;
    const gap = 8;
    const contentHeight = 18; // count slot: 12px + 4px + 2px padding (stretches the name too)
    const shadow = 2; // drop shadow: 2px 2px 0 rgba(0,0,0,0.4)

    const width = border * 2 + padX * 2 + nameWidth + gap + countWidth;
    const height = border * 2 + padY * 2 + contentHeight;

    const { canvas, ctx, ratio } = createCanvas(width + shadow, height + shadow);

    // drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(shadow, shadow, width, height);

    // border + face
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, width, height);
    ctx.clearRect(border, border, width - border * 2, height - border * 2);
    ctx.fillStyle = region.color;
    ctx.fillRect(border, border, width - border * 2, height - border * 2);
    drawBevel(ctx, border, border, width - border * 2, height - border * 2, "rgba(255,255,255,0.3)", "rgba(0,0,0,0.25)");

    const contentTop = border + padY;

    // region name, text-shadow: 2px 2px 0 rgba(0,0,0,0.4)
    ctx.font = `16px ${FONT_TEN}`;
    ctx.textAlign = "left";
    const nameX = border + padX;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    drawCenteredText(ctx, region.name, nameX + 2, contentTop + 2, contentHeight);
    ctx.fillStyle = "#fff";
    drawCenteredText(ctx, region.name, nameX, contentTop, contentHeight);

    // count "slot"
    const slotX = nameX + nameWidth + gap;
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.roundRect(slotX, contentTop, countWidth, contentHeight, 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.6)"; // inset 1px 1px dark
    ctx.fillRect(slotX + 1, contentTop, countWidth - 2, 1);
    ctx.fillRect(slotX, contentTop + 1, 1, contentHeight - 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)"; // bottom lip highlight
    ctx.fillRect(slotX + 1, contentTop + contentHeight, countWidth - 2, 1);

    ctx.font = `12px ${FONT_SEVEN}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#f0f0f0";
    // padding 4px top / 2px bottom: optical centering for the pixel font
    drawCenteredText(ctx, countText, slotX + countWidth / 2, contentTop + 1, contentHeight);

    const style = new Style({
        image: new Icon({
            img: canvas,
            scale: 1 / ratio,
            // translate(-50%, -50%) of the badge itself, ignoring the drop shadow
            anchor: [width / 2 / (width + shadow), height / 2 / (height + shadow)],
        }),
        zIndex: 2000,
    });
    textStyleCache.set(key, style);
    return style;
}

// --- 3. MARKER ICONS ---------------------------------------------------------------------------

const iconStyleCache = new Map<string, Style>();

interface MarkerIconOptions {
    /** Icon size in CSS px (Leaflet `iconSize`). */
    size: [number, number];
    /** Anchor as a fraction of the size (Leaflet `iconAnchor` / `iconSize`). */
    anchor: [number, number];
}

/** A plain image marker, cached per source and size. */
export function createMarkerIconStyle(src: string, { size, anchor }: MarkerIconOptions): Style {
    const key = `${src}:${size.join("x")}:${anchor.join(",")}`;
    const cached = iconStyleCache.get(key);
    if (cached) return cached;

    const style = new Style({
        image: new Icon({ src, width: size[0], height: size[1], anchor }),
    });
    iconStyleCache.set(key, style);
    return style;
}

// --- 4. PLAYER HEADS ---------------------------------------------------------------------------

export const PLAYER_ICON_SIZE = 24;
/** Tailwind `rounded` (0.25rem) on a 24px icon. */
const PLAYER_ICON_RADIUS = 4;

const playerCanvasCache = new Map<string, Promise<HTMLCanvasElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Renders a player icon with the old CSS classes baked in: `rounded`, and for players underground
 * `grayscale contrast-125`. Uses blend modes rather than pixel reads, so cross-origin skins work.
 */
export function loadPlayerIcon(src: string, underground: boolean): Promise<HTMLCanvasElement> {
    const key = `${src}:${underground}`;
    let promise = playerCanvasCache.get(key);
    if (!promise) {
        promise = loadImage(src).then((img) => {
            const size = PLAYER_ICON_SIZE;
            const { canvas, ctx } = createCanvas(size, size);

            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, PLAYER_ICON_RADIUS);
            ctx.clip();

            if (underground && "filter" in ctx) ctx.filter = "contrast(1.25)";
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, size, size);
            ctx.filter = "none";

            if (underground) {
                // grayscale: take luminosity from the image, saturation 0 from the fill
                ctx.globalCompositeOperation = "saturation";
                ctx.fillStyle = "#808080";
                ctx.fillRect(0, 0, size, size);
                // restore the image's transparency
                ctx.globalCompositeOperation = "destination-in";
                ctx.drawImage(img, 0, 0, size, size);
                ctx.globalCompositeOperation = "source-over";
            }
            return canvas;
        });
        promise.catch(() => playerCanvasCache.delete(key));
        playerCanvasCache.set(key, promise);
    }
    return promise;
}

export function createPlayerIconStyle(img: HTMLCanvasElement | string, opacity: number): Style {
    const icon =
        typeof img === "string"
            ? new Icon({ src: img, width: PLAYER_ICON_SIZE, height: PLAYER_ICON_SIZE, opacity })
            : new Icon({ img, scale: PLAYER_ICON_SIZE / (img.width || PLAYER_ICON_SIZE), opacity });
    // Players draw above projects and pins
    return new Style({ image: icon, zIndex: 10 });
}

// --- 5. POLYGONS -------------------------------------------------------------------------------

/** Region outline (Leaflet pathOptions: weight 2, fillOpacity 0.2). */
export function createRegionPolygonStyle(color: string, opacity = 1): Style {
    return new Style({
        stroke: new Stroke({ color: withAlpha(color, opacity), width: 2 }),
        fill: new Fill({ color: withAlpha(color, 0.2) }),
    });
}

/** Leaflet.markercluster's default "coverage on hover" polygon (Leaflet default path style). */
export const CLUSTER_COVERAGE_STYLE = new Style({
    stroke: new Stroke({ color: "#3388ff", width: 3 }),
    fill: new Fill({ color: "rgba(51,136,255,0.2)" }),
});

/** Spiderfy legs (Leaflet.markercluster default `spiderLegPolylineOptions`). */
export const SPIDER_LEG_STYLE = new Style({
    stroke: new Stroke({ color: "rgba(34,34,34,0.5)", width: 1.5 }),
});

function withAlpha(hex: string, alpha: number): string {
    const value = hex.replace("#", "");
    const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
    const n = parseInt(full, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
