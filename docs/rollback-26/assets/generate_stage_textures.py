import random, sys, os
from PIL import Image
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
def hx(c): c=c.lstrip('#'); return tuple(int(c[i:i+2],16) for i in (0,2,4))
def noise_tex(name, cols, seed, fn=None):
    r = random.Random(seed); im = Image.new('RGBA',(16,16)); p = im.load()
    for y in range(16):
        for x in range(16):
            c = fn(x,y,r) if fn else r.choice(cols)
            p[x,y] = hx(c)+(255,)
    im.save(f'{OUT}/{name}.png')
# dark oak planks: 4 horizontal boards, seams
def planks(x,y,r):
    if y % 4 == 3: return '#2a1a0e'
    if (y//4) % 2 == 0 and x == 7: return '#2a1a0e'
    if (y//4) % 2 == 1 and x == 15: return '#2a1a0e'
    return r.choice(['#4a2f1a','#4f331c','#45291a','#553820'])
noise_tex('planks', None, 1, planks)
def plank_side(x,y,r):
    if x % 8 == 7: return '#2a1a0e'
    return r.choice(['#3e2716','#432a18','#3a2414'])
noise_tex('plank_side', None, 2, plank_side)
def bricks(x,y,r):
    if y % 8 == 7: return '#1c1c22'
    off = 0 if (y//8)%2==0 else 4
    if (x+off) % 8 == 7: return '#1c1c22'
    return r.choice(['#3a3a44','#35353f','#3f3f4a','#33333c'])
noise_tex('stone_bricks', None, 3, bricks)
def wool(x,y,r):
    base = ['#8e1b1b','#9a2020','#851818','#a32626']
    if x % 4 == 0: return r.choice(['#6e1212','#771414'])
    return r.choice(base)
noise_tex('red_wool', None, 4, wool)
def glow(x,y,r):
    v = r.random()
    if v < .15: return '#6b4a1e'
    if v < .45: return '#c98a2e'
    if v < .8: return '#f2c056'
    return '#fff2b0'
noise_tex('glowstone', None, 5, glow)
def quartz(x,y,r):
    if x in (0,15) or y in (0,15): return '#c9c2b6'
    return r.choice(['#ece6dc','#e6dfd3','#f1ece4'])
noise_tex('quartz', None, 6, quartz)
def blackstone(x,y,r):
    return r.choice(['#1a1720','#201c27','#16131b','#25212c'])
noise_tex('blackstone', None, 7, blackstone)
def sign(x,y,r):
    if y % 5 == 4: return '#8a6a3a'
    return r.choice(['#b48d55','#ad8650','#ba9459'])
noise_tex('oak_sign', None, 8, sign)
def paper(x,y,r):
    return r.choice(['#efe6cf','#ebe1c8','#f3ebd6'])
noise_tex('paper', None, 9, paper)

def sprite(name, rows, pal):
    im = Image.new('RGBA',(16,16),(0,0,0,0)); p = im.load()
    for y,row in enumerate(rows):
        for x,ch in enumerate(row):
            if ch != '.': p[x,y] = hx(pal[ch])+(255,)
    im.save(f'{OUT}/{name}.png')
sprite('lantern', [
"................","......kkkk......","......k..k......",".....kkkkkk.....",
"....kddddddk....","....kdyyyydk....","....kdyoyydk....","....kyoowoyk....",
"....kyowwoyk....","....kdyooydk....","....kdyyyydk....","....kddddddk....",
".....kkkkkk.....","................","................","................"],
{'k':'#1d1f26','d':'#3b3f4c','y':'#f2b84a','o':'#ffd770','w':'#fff6cf'})
sprite('pickaxe', [
"................","...cccccccc.....","..c#######c.....","...cc...#dc.....",
"........#d......","........#d......",".......#d.......","......#d........",
".....#d.........","....#d..........","...#d...........","..#d............",
".#d.............","................","................","................"],
{'c':'#2fd6c4','#':'#6b4a2a','d':'#4a321c'})
sprite('sword', [
"................","............ss..","...........sws..","..........sws...",
".........sws....","........sws.....",".......sws......","..g...sws.......",
"...g.sws........","....gss.........","....hg..........","...h..g.........",
"..h.............",".h..............","................","................"],
{'s':'#c9ced6','w':'#ffffff','g':'#d9a82e','h':'#6b4a2a'})
sprite('book', [
"................","..bbbbbbbbbb....","..brrrrrrrrpb...","..brrrrrrrrpb...",
"..brryyyyrrpb...","..brrrrrrrrpb...","..brrrrrrrrpb...","..brrrrrrrrpb...",
"..brrrrrrrrpb...","..brrrrrrrrpb...","..brrrrrrrrpb...","..bbbbbbbbbbb...",
"................","................","................","................"],
{'b':'#3a1a12','r':'#8a2e22','y':'#e8c34a','p':'#efe6cf'})
sprite('clock', [
"................",".....kkkkkk.....","....kggggggk....","...kgyyyyyygk...",
"...kgyykkyygk...","...kgyykyyygk...","...kgyykkkygk...","...kgyyyyyygk...",
"...kgbbbbbbgk...","...kgbbbbbbgk...","....kggggggk....",".....kkkkkk.....",
"................","................","................","................"],
{'k':'#3d2a08','g':'#d9a82e','y':'#9fd2ff','b':'#2b3d6b'})
sprite('map', [
"................","..kkkkkkkkkkkk..","..kppppppppppk..","..kpgggpppbbpk..",
"..kpggppppbbpk..","..kppppggpppbk..","..kpbbpggpppppk.","..kpbbppppgggpk.",
"..kppppppppggpk.","..kppprppppppk..","..kpppppppppppk.","..kkkkkkkkkkkk..",
"................","................","................","................"],
{'k':'#5a4524','p':'#e8dcb2','g':'#5aa64b','b':'#4a7fd1','r':'#c43c3c'})
sprite('bricks_icon', [
"................","................","..mmmmmmmmmmmm..","..rrrrmrrrrrmr..",
"..rrrrmrrrrrmr..","..mmmmmmmmmmmm..","..rrmrrrrrmrrr..","..rrmrrrrrmrrr..",
"..mmmmmmmmmmmm..","..rrrrmrrrrrmr..","..rrrrmrrrrrmr..","..mmmmmmmmmmmm..",
"................","................","................","................"],
{'m':'#d8cfc0','r':'#9b4a34'})
sprite('disc', [
"................",".....kkkkkk.....","....kddddddk....","...kddggggddk...",
"..kddgggggggdk..","..kdggkkkkggdk..","..kdggkwwkggdk..","..kdggkwwkggdk..",
"..kdggkkkkggdk..","..kddgggggggdk..","...kddggggddk...","....kddddddk....",
".....kkkkkk.....","................","................","................"],
{'k':'#0e0e12','d':'#24242c','g':'#4fc2b8','w':'#ffffff'})
# generic mob heads (original, 16x16 faces)
sprite('head_green', ["gggggggggggggggg"]*3+["ggkkggggggggkkgg","ggkkggggggggkkgg"]+["gggggggggggggggg"]*3+["ggggggkkkkgggggg","ggggggkkkkgggggg","gggggkkggkkggggg"]+["gggggggggggggggg"]*5,
       {'g':'#3f8f3a','k':'#14240f'})
sprite('head_bone', ["bbbbbbbbbbbbbbbb"]*4+["bbkkkbbbbbbkkkbb","bbkkkbbbbbbkkkbb"]+["bbbbbbbbbbbbbbbb"]*3+["bbbbbbbkkbbbbbbb"]+["bbbbbbbbbbbbbbbb"]+["bbkbkbkbkbkbkbbb"]+["bbbbbbbbbbbbbbbb"]*4,
       {'b':'#c9c4b8','k':'#2b2a28'})
sprite('head_dark', ["dddddddddddddddd"]*4+["ddrrddrrddrrddrr","ddrrddrrddrrddrr"]+["dddddddddddddddd"]*4+["dddddkkkkkkddddd"]+["dddddddddddddddd"]*5,
       {'d':'#2b2530','r':'#d0303a','k':'#120f14'})
sprite('head_player', ["hhhhhhhhhhhhhhhh"]*3+["hssssssssssssssh"]+["ssssssssssssssss"]*2+["sswwkssssskwwsss","sswwkssssskwwsss"]+["ssssssssssssssss"]*2+["sssssbbbbbbsssss","ssssssssssssssss"]+["ssssssssssssssss"]*4,
       {'h':'#3a2a1a','s':'#c99a74','w':'#ffffff','k':'#3a5aa8','b':'#8a5a44'})
print(sorted(os.listdir(OUT)))
