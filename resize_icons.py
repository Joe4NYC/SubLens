"""
resize_icons.py — SubLens icon batch resizer
Usage: python resize_icons.py
Requires: pip install Pillow
Input:  icon-1024.png  (place in the same folder as this script)
Output: icons/favicon-16.png, icons/favicon-32.png,
        icons/icon-180.png, icons/icon-192.png, icons/icon-512.png
"""

from PIL import Image
import os

SIZES = [16, 32, 180, 192, 512]
SRC_FILE = "icon-1024.png"
OUT_DIR = "icons"


def icon_name(size: int) -> str:
    return f"favicon-{size}.png" if size <= 32 else f"icon-{size}.png"


def main() -> None:
    if not os.path.exists(SRC_FILE):
        raise FileNotFoundError(
            f"Source file '{SRC_FILE}' not found. "
            "Place your 1024×1024 PNG in the same folder as this script."
        )

    os.makedirs(OUT_DIR, exist_ok=True)
    src = Image.open(SRC_FILE).convert("RGBA")

    for size in SIZES:
        name = icon_name(size)
        out_path = os.path.join(OUT_DIR, name)
        src.resize((size, size), Image.LANCZOS).save(out_path)
        print(f"Saved {out_path}")

    print("All icons generated successfully.")


if __name__ == "__main__":
    main()
