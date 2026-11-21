# Extracts the vanilla Minecraft (Bedrock) textures the Rollback uses from Mojang/bedrock-samples.
# Usage: python3 docs/rollback-26/assets/extract_vanilla_textures.py .tmp/resource_pack/textures public/rollback/textures
# Mob/player heads are cropped from the entity skins (8x8 front face, upscaled to 16x16 nearest-neighbour).
import os, shutil, sys
from PIL import Image
SRC = sys.argv[1]  # bedrock-samples resource_pack/textures
OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
copy = {
 "blocks/planks_big_oak.png": "dark_oak_planks.png", "blocks/log_big_oak.png": "dark_oak_log.png",
 "blocks/stripped_dark_oak_log.png": "stripped_dark_oak_log.png", "blocks/deepslate/deepslate_bricks.png": "deepslate_bricks.png",
 "blocks/stonebrick.png": "stone_bricks.png", "blocks/wool_colored_red.png": "red_wool.png", "blocks/glowstone.png": "glowstone.png",
 "blocks/quartz_block_side.png": "quartz_block_side.png", "blocks/quartz_block_top.png": "quartz_block_top.png",
 "blocks/polished_blackstone.png": "polished_blackstone.png", "blocks/chain1.png": "chain.png",
 "blocks/jukebox_side.png": "jukebox_side.png", "blocks/jukebox_top.png": "jukebox_top.png",
 "blocks/itemframe_background.png": "item_frame_background.png", "blocks/rail_normal.png": "rail.png", "blocks/planks_oak.png": "oak_planks.png",
 "items/clock_item.png": "clock.png", "items/diamond_sword.png": "diamond_sword.png", "items/diamond_pickaxe.png": "diamond_pickaxe.png",
 "items/netherite_pickaxe.png": "netherite_pickaxe.png", "items/book_normal.png": "book.png", "items/book_written.png": "written_book.png",
 "items/map_filled.png": "filled_map.png", "items/brick.png": "brick.png", "items/record_pigstep.png": "music_disc_pigstep.png",
 "items/sign_darkoak.png": "dark_oak_sign.png", "items/sign.png": "oak_sign.png", "items/minecart_normal.png": "minecart.png",
 "items/name_tag.png": "name_tag.png", "items/paper.png": "paper.png", "items/compass_item.png": "compass.png",
 "items/lantern.png": "lantern.png", "items/item_frame.png": "item_frame.png", "items/campfire.png": "campfire.png",
 "ui/experiencebarempty.png": "ui_xp_empty.png", "ui/experiencebarfull.png": "ui_xp_full.png",
 "ui/selected_hotbar_slot.png": "ui_hotbar_selected.png", "ui/hotbar_0.png": "ui_hotbar_slot.png",
 "ui/hotbar_start_cap.png": "ui_hotbar_start.png", "ui/hotbar_end_cap.png": "ui_hotbar_end.png",
}
for s, d in copy.items():
    shutil.copy(os.path.join(SRC, s), os.path.join(OUT, d))
def face(src, x, y, name, overlay=None):
    im = Image.open(os.path.join(SRC, src)).convert("RGBA")
    f = im.crop((x, y, x + 8, y + 8))
    if overlay:
        f.alpha_composite(im.crop((overlay[0], overlay[1], overlay[0] + 8, overlay[1] + 8)))
    f.resize((16, 16), Image.NEAREST).save(os.path.join(OUT, name))
face("entity/creeper/creeper.png", 8, 8, "head_creeper.png")
face("entity/zombie/zombie.png", 8, 8, "head_zombie.png")
face("entity/skeleton/skeleton.png", 8, 8, "head_skeleton.png")
face("entity/spider/spider.tga", 40, 12, "head_spider.png")
face("entity/steve.png", 8, 8, "head_steve.png", overlay=(40, 8))
for n in sorted(os.listdir(OUT)):
    print(n, Image.open(os.path.join(OUT, n)).size)
