"""Dev-only: shrinks public/assets/cards/*.png (about 350 KB -> 60 KB each). Run after tools/card-images.mjs. Needs Pillow."""
import glob
from PIL import Image
for f in sorted(glob.glob("public/assets/cards/*.png")):
    Image.open(f).convert("RGB").quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(f, "PNG", optimize=True)
