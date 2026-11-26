import { describe, expect, it } from "vitest";

import { ANY_HEIGHT_RADIUS, applyMapArea, applyPastedCoordinates, isAnyHeight, parseNumbers } from "./coordinates.ts";

describe("parseNumbers", () => {
    it("reads numbers whatever separates them", () => {
        expect(parseNumbers("12 64 -30")).toEqual([12, 64, -30]);
        expect(parseNumbers("12,64,-30")).toEqual([12, 64, -30]);
        expect(parseNumbers("XYZ: 12.5 / 64.00000 / -30.25")).toEqual([12.5, 64, -30.25]);
        expect(parseNumbers("/tp @s 12 64 -30")).toEqual([12, 64, -30]);
        expect(parseNumbers("x=12;y=64;z=-30")).toEqual([12, 64, -30]);
    });
});

describe("applyPastedCoordinates", () => {
    it("fills all three from three numbers", () => {
        expect(applyPastedCoordinates("1 2 3", undefined)).toEqual([1, 2, 3]);
    });

    it("reads two numbers as X and Z and keeps Y", () => {
        expect(applyPastedCoordinates("100, -200", [0, 70, 0])).toEqual([100, 70, -200]);
    });

    it("leaves a single number to the normal paste", () => {
        expect(applyPastedCoordinates("42", [0, 0, 0])).toBeNull();
    });
});

describe("applyMapArea", () => {
    it("keeps Y and the height of a cylinder", () => {
        const next = applyMapArea({ coordinates: [0, 64, 0], horizontal_radius: 10, vertical_radius: 4 }, { x: 5, z: -5, radius: 20 });
        expect(next).toEqual({ coordinates: [5, 64, -5], horizontal_radius: 20, vertical_radius: 4 });
    });

    it("grows a sphere in every direction", () => {
        const next = applyMapArea({ coordinates: [0, 64, 0], horizontal_radius: 10, vertical_radius: 10 }, { x: 5, z: -5, radius: 20 });
        expect(next.vertical_radius).toBe(20);
    });
});

describe("isAnyHeight", () => {
    it("treats a missing or full-height vertical radius as any height", () => {
        expect(isAnyHeight(undefined, 10)).toBe(true);
        expect(isAnyHeight(null, 10)).toBe(true);
        expect(isAnyHeight(ANY_HEIGHT_RADIUS, 10)).toBe(true);
        expect(isAnyHeight(8, 10)).toBe(false);
    });

    it("keeps a large sphere a sphere", () => {
        expect(isAnyHeight(500, 500)).toBe(false);
    });
});
