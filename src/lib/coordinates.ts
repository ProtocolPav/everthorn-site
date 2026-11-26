export type Coordinates = [number, number, number];

/**
 * Stands in for "any height" where the API needs a vertical radius number.
 * The overworld is 384 blocks tall, so this reaches every Y from any point.
 */
export const ANY_HEIGHT_RADIUS = 384;

/** Whether a stored vertical radius means "any height". */
export function isAnyHeight(vertical: number | null | undefined, horizontal?: number | null): boolean {
    return vertical == null || (vertical >= ANY_HEIGHT_RADIUS && vertical !== horizontal);
}

/**
 * Pulls every number out of a pasted string, whatever separates them.
 * Handles F3 output ("XYZ: 12.5 / 64 / -30"), commands ("/tp @s 12 64 -30"),
 * map copies ("12, -30") and plain lists ("12 64 -30").
 */
export function parseNumbers(text: string): number[] {
    const matches = text.match(/-?\d+(?:\.\d+)?/g) ?? [];
    return matches.map(Number).filter((n) => Number.isFinite(n));
}

/**
 * Applies pasted text to an XYZ tuple. Returns null when the paste holds
 * fewer than two numbers, so a normal single-value paste goes through untouched.
 * Two numbers are read as X and Z (the format the world map copies); Y is kept.
 */
export function applyPastedCoordinates(
    text: string,
    current: Partial<Coordinates> | undefined,
): Coordinates | null {
    const numbers = parseNumbers(text);
    const base = [current?.[0], current?.[1], current?.[2]] as Coordinates;

    if (numbers.length >= 3) return [numbers[0], numbers[1], numbers[2]];
    if (numbers.length === 2) return [numbers[0], base[1], numbers[1]];
    return null;
}

interface AreaValue {
    coordinates?: Partial<Coordinates>;
    horizontal_radius?: number | null;
    vertical_radius?: number | null;
}

/**
 * Applies a point + radius picked on the map. The map has no height, so Y is kept.
 * When the area is a sphere (equal radii) the vertical radius follows the new radius.
 */
export function applyMapArea<T extends AreaValue>(
    value: T,
    area: { x: number; z: number; radius: number },
): T & { coordinates: Coordinates; horizontal_radius: number } {
    const isSphere = value.horizontal_radius != null && value.horizontal_radius === value.vertical_radius;
    return {
        ...value,
        coordinates: [area.x, value.coordinates?.[1] as number, area.z],
        horizontal_radius: area.radius,
        ...(isSphere ? { vertical_radius: area.radius } : {}),
    };
}
