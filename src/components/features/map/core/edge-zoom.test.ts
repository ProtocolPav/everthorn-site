import { describe, expect, it } from "vitest";

import { MAP_ZOOM } from "../../../../lib/map-projections.ts";
import { PX_PER_ZOOM_LEVEL, dragZoom, zoomTier } from "./edge-zoom";

describe("dragZoom", () => {
    it("zooms in when dragging up and out when dragging down", () => {
        expect(dragZoom(6, -PX_PER_ZOOM_LEVEL)).toBe(7);
        expect(dragZoom(6, PX_PER_ZOOM_LEVEL * 2)).toBe(4);
        expect(dragZoom(6, -PX_PER_ZOOM_LEVEL / 2)).toBe(6.5);
    });

    it("clamps to the map's zoom range", () => {
        expect(dragZoom(6, -10_000)).toBe(MAP_ZOOM.max);
        expect(dragZoom(6, 10_000)).toBe(MAP_ZOOM.min);
    });
});

describe("zoomTier", () => {
    it("goes from sky to ground as you zoom in", () => {
        expect(zoomTier(MAP_ZOOM.min).id).toBe("phantom");
        expect(zoomTier(4).id).toBe("elytra");
        expect(zoomTier(MAP_ZOOM.default).id).toBe("parrot");
        expect(zoomTier(8.6).id).toBe("bee");
        expect(zoomTier(9.6).id).toBe("silverfish");
        expect(zoomTier(MAP_ZOOM.max).id).toBe("silverfish");
    });
});
