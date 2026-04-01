export function decomposeDuration(totalSeconds: number): { h: number; m: number; s: number } {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s };
}

export function formatDuration(totalSeconds: number): string {
    const { h, m, s } = decomposeDuration(totalSeconds);
    const parts: string[] = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
}
