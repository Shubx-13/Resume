from pathlib import Path
import math
import numpy as np
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES = {
    "milky-way.jpg": 85,
    "bougainvillea-portrait.jpg": 85,
    "revision-cycle-overview.png": 92,
    "class9.jpg": 85,
    "class11.jpg": 85,
    "Scarnchx.jpg": 90,
    "foundation-day-collage.jpg": 85,
    "flower-bicycle-contact.jpg": 85,
    "mountain-view.jpg": 85,
}


def convert(source_name: str, quality: int) -> None:
    source = ROOT / "images" / source_name
    destination = source.with_name(f"{source.stem}-test.webp")
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        image.save(destination, "WEBP", quality=quality, method=6)
    with Image.open(source) as original, Image.open(destination) as converted:
        before = np.asarray(original.convert("RGB"), dtype=np.float32)
        after = np.asarray(converted.convert("RGB"), dtype=np.float32)
        mse = np.mean((before - after) ** 2)
        psnr = 99.0 if mse == 0 else 10 * math.log10((255**2) / mse)
    print(
        f"{source.name}: {source.stat().st_size:,} -> {destination.name}: "
        f"{destination.stat().st_size:,} ({psnr:.1f} dB)"
    )


for name, quality in IMAGES.items():
    convert(name, quality)
