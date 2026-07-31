// src/lib/map-styles.ts
import type { Region } from "./map-regions";

// --- Helper: build the inline-style string for the OL overlay div ---

// --- 1. MINECRAFT BLOCK STYLE (Standard cluster icon HTML) ---
export function createMinecraftBlockHtml(count: number): string {
    let c = {
        bg: '#74a753',
        border: '#092B00',
        light: 'rgba(255,255,255,0.3)',
        dark: 'rgba(0,0,0,0.25)'
    };

    if (count >= 30) {
        c = { bg: '#64efff', border: '#005954', light: 'rgba(255,255,255,0.5)', dark: 'rgba(0,0,0,0.2)' };
    } else if (count >= 10) {
        c = { bg: '#f0c534', border: '#594A00', light: 'rgba(255,255,255,0.4)', dark: 'rgba(0,0,0,0.2)' };
    }

    const style = [
        `width:32px`,
        `height:32px`,
        `background-color:${c.bg}`,
        `border:2px solid ${c.border}`,
        `box-sizing:border-box`,
        `display:flex`,
        `align-items:center`,
        `justify-content:center`,
        `color:#fff`,
        `font-size:17px`,
        `line-height:1`,
        `text-shadow:1px 1px 0px #696969`,
        `box-shadow:inset 2px 2px 0px ${c.light},inset -2px -2px 0px ${c.dark}`,
        `user-select:none`,
        `cursor:pointer`,
        `image-rendering:pixelated`,
    ].join(';');

    return `<div style="${style}" class="font-minecraft-ten">${count}</div>`;
}

// --- 2. REGION BADGE STYLE ---
export function createRegionBadgeHtml(count: number, region: Region): string {
    const containerStyle = [
        `display:flex`,
        `text-align:center`,
        `gap:8px`,
        `padding:5px 8px`,
        `background-color:${region.color}`,
        `border:2px solid rgba(0,0,0,0.6)`,
        `box-shadow:inset 2px 2px 0px rgba(255,255,255,0.3),inset -2px -2px 0px rgba(0,0,0,0.25),2px 2px 0px rgba(0,0,0,0.4)`,
        `color:#fff`,
        `white-space:nowrap`,
        `user-select:none`,
        `image-rendering:pixelated`,
    ].join(';');

    const textStyle = [
        `font-size:16px`,
        `line-height:1`,
        `text-shadow:2px 2px 0px rgba(0,0,0,0.4)`,
    ].join(';');

    const countStyle = [
        `font-family:var(--font-minecraft-seven),monospace`,
        `font-size:12px`,
        `line-height:1`,
        `background-color:rgba(0,0,0,0.45)`,
        `box-shadow:inset 1px 1px 0px rgba(0,0,0,0.6),inset -1px -1px 0px rgba(255,255,255,0.05),0px 1px 0px rgba(255,255,255,0.2)`,
        `border-radius:2px`,
        `padding:4px 6px 2px 6px`,
        `min-width:16px`,
        `text-align:center`,
        `color:#f0f0f0`,
    ].join(';');

    return [
        `<div style="${containerStyle}">`,
        `  <span class="font-minecraft-ten" style="${textStyle}">${region.name}</span>`,
        `  <span class="font-minecraft-seven" style="${countStyle}">${count}</span>`,
        `</div>`,
    ].join('');
}
