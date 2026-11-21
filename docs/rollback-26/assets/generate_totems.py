import colorsys, os, sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

SHAPE = [
"......oooo......",
".....oggggo.....",
"....olllllmo....",
"....olemmemo....",
"....ollmmmmo....",
"....oldoodmo....",
"..oo.oggggo.oo..",
".olmooxxxxoomdo.",
".olmmoxxxxomddo.",
"..ooolxxxxdooo..",
"....olmmmmdo....",
"....olmmmddo....",
"....oggggggo....",
"...olmmmmmddo...",
"...oddddddddo...",
"...oooooooooo...",
]
assert all(len(r) == 16 for r in SHAPE) and len(SHAPE) == 16

EMBLEMS = {
    "mason":       ["aaAa", "Aaaa", "aaAa"],   # brickwork
    "vanguard":    ["mmmA", "mmAm", "AAmm"],   # blade + guard
    "hearthkeeper":["mAmm", "mAAm", "aAAa"],   # flame
    "pathfinder":  ["maAm", "aAAa", "mAam"],   # compass rose
    "questbearer": ["mAAm", "AAAA", "AmmA"],   # star
    "evergreen":   ["mAAm", "AaAA", "mmam"],   # sapling
}

PAL = {  # outline, dark, mid, light, accent, accentLight
    "mason":        ("#2b1d14", "#7a4a2e", "#b06a3e", "#d9935c", "#5c3a26", "#f0c08a"),
    "vanguard":     ("#240a0e", "#6e1a22", "#a8262f", "#d64b4b", "#4a0f15", "#e9e2d0"),
    "hearthkeeper": ("#2a1206", "#8a3b10", "#c8601a", "#f08a2c", "#7a2a08", "#ffd36b"),
    "pathfinder":   ("#0b2022", "#1d5b5f", "#2c8c8c", "#4fc2b8", "#134446", "#c9fff4"),
    "questbearer":  ("#1b0f2b", "#4a2a78", "#6d43a8", "#9a72d6", "#321b55", "#ffe08a"),
    "evergreen":    ("#0d1f10", "#245a2c", "#36803c", "#5fae55", "#1a4220", "#b8f08a"),
}
GOLD, GOLD_HI, WHITE = "#e8b84a", "#fff1a8", "#fffbe8"
TIERS = ["cracked", "carved", "gilded", "undying"]
CRACKS = [(2, 9), (3, 8), (4, 8), (10, 7), (11, 8), (11, 9), (13, 6), (13, 7)]
SPARKLES = [(0, 2), (1, 13), (5, 14), (11, 1), (14, 14)]

def hx(c): c = c.lstrip("#"); return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))

def dull(c):
    r, g, b = [v / 255 for v in hx(c)]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    r, g, b = colorsys.hls_to_rgb(h, l * 0.85, s * 0.35)
    return "#%02x%02x%02x" % tuple(int(v * 255) for v in (r, g, b))

def render(arch, tier):
    o, d, m, l, a, A = PAL[arch]
    if tier == "cracked":
        o, d, m, l, a, A = map(dull, (o, d, m, l, a, A))
    trim = d if tier in ("cracked", "carved") else GOLD
    eye = {"cracked": o, "carved": o, "gilded": GOLD, "undying": WHITE}[tier]
    cmap = {"o": o, "d": d, "m": m, "l": l, "g": trim, "e": eye}
    img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = img.load()
    em = EMBLEMS[arch]
    for y, row in enumerate(SHAPE):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            if ch == "x":
                e = em[y - 7][x - 6]
                col = {"a": a, "A": A, "m": m}[e]
                if tier == "undying" and e == "A":
                    col = WHITE if arch in ("vanguard", "pathfinder") else GOLD_HI
            else:
                col = cmap[ch]
            px[x, y] = hx(col) + (255,)
    if tier == "cracked":
        for y, x in CRACKS:
            px[x, y] = hx(o) + (255,)
    if tier == "undying":
        for y, x in [(1, 7), (6, 8), (12, 6), (12, 9)]:
            px[x, y] = hx(GOLD_HI) + (255,)
        for y, x in [(2, 5)]:
            px[x, y] = hx(WHITE) + (255,)
        for y, x in SPARKLES:
            px[x, y] = hx(GOLD_HI) + (255,)
    return img

S = 8
sheet = Image.new("RGBA", (130 + len(TIERS) * 160, 40 + len(PAL) * 160), "#0a0a0f")
dr = ImageDraw.Draw(sheet)
for j, t in enumerate(TIERS):
    dr.text((130 + j * 160 + 40, 12), t.upper(), fill="#c9a84c")
for i, arch in enumerate(PAL):
    dr.text((10, 40 + i * 160 + 60), arch, fill="#f5f0e8")
    for j, t in enumerate(TIERS):
        img = render(arch, t)
        img.save(f"{OUT}/{arch}_{t}.png")
        sheet.alpha_composite(img.resize((16 * S, 16 * S), Image.NEAREST), (130 + j * 160 + 16, 40 + i * 160 + 16))
sheet.save(f"{OUT}/_preview_sheet.png")
print("ok", len(os.listdir(OUT)))
