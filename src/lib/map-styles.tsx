// src/lib/map-styles.ts
import L from "leaflet";
import { Region } from "./map-regions";

// --- 1. MINECRAFT BLOCK STYLE (Standard - Unchanged) ---
export const createMinecraftBlockIcon = (cluster: any) => {
    const count = cluster.getChildCount();

    // Grass
    let c = {
        bg: '#74a753',
        border: '#092B00',
        light: 'rgba(255,255,255,0.3)',
        dark: 'rgba(0,0,0,0.25)'
    };

    // Diamond
    if (count >= 30) {
        c = {
            bg: '#64efff',
            border: '#005954',
            light: 'rgba(255,255,255,0.5)',
            dark: 'rgba(0,0,0,0.2)'
        };
    }
    // Gold
    else if (count >= 10) {
        c = {
            bg: '#f0c534',
            border: '#594A00',
            light: 'rgba(255,255,255,0.4)',
            dark: 'rgba(0,0,0,0.2)'
        };
    }

    const style = `
        width: 100%; 
        height: 100%;
        background-color: ${c.bg};
        border: 2px solid ${c.border};
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 17px;
        line-height: 1;
        text-shadow: 1px 1px 0px #696969;
        box-shadow: inset 2px 2px 0px ${c.light}, inset -2px -2px 0px ${c.dark};
        user-select: none;
        cursor: pointer;
        image-rendering: pixelated;
    `.replace(/\n/g, '');

    return L.divIcon({
        html: `<div style="${style}" class="font-minecraft-ten">${count}</div>`,
        className: '',
        iconSize: L.point(32, 32),
        iconAnchor: [16, 16],
    });
};

// --- 2. REGION BADGE STYLE (Refined) ---
export const createRegionBadgeIcon = (cluster: any, region: Region) => {
    const count = cluster.getChildCount();

    // The Container (Button/Label Look)
    const style = `
        display: flex;
        text-align: center; /* Vertical center alignment */
        gap: 8px; /* Space between Name and Count */
        padding: 5px 8px;
        
        background-color: ${region.color};
        border: 2px solid rgba(0,0,0,0.6);
        
        /* 3D Bevel Highlight & Shadow */
        box-shadow: 
            inset 2px 2px 0px rgba(255,255,255,0.3), 
            inset -2px -2px 0px rgba(0,0,0,0.25),
            2px 2px 0px rgba(0,0,0,0.4);
            
        color: #fff;
        white-space: nowrap;
        user-select: none;
        image-rendering: pixelated;
        
        /* Centering */
        transform: translate(-50%, -50%);
    `.replace(/\n/g, '');

    // The Region Name
    const textStyle = `
        font-size: 16px;
        line-height: 1;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.4);
    `.replace(/\n/g, '');

    // The Count (Inset Slot Look)
    const countStyle = `
        font-size: 12px;
        line-height: 1;
        
        /* Dark Inset Background */
        background-color: rgba(0, 0, 0, 0.3);
        
        /* Inset Shadows */
        box-shadow: 
            inset 1px 1px 0px rgba(0,0,0,0.3),
            0px 1px 0px rgba(255,255,255,0.1); /* Bottom lip highlight */
            
        border-radius: 3px;
        padding: 3px 5px 2px 5px;
        min-width: 14px;
        text-align: center;
    `.replace(/\n/g, '');

    const html = `
        <div style="position: absolute; left: 0; top: 0;">
            <div style="${style}">
                <span class="font-minecraft-ten" style="${textStyle}">
                    ${region.name}
                </span>
                <span class="font-minecraft-seven" style="${countStyle}">
                    ${count}
                </span>
            </div>
        </div>
    `;

    return L.divIcon({
        html: html,
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
};
