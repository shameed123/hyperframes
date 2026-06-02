#!/usr/bin/env python3
"""Copy ordered generated PNGs into a skit project with explicit offsets."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--dest-dir", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--source-offset", type=int, default=0)
    parser.add_argument("--scene-start", type=int, default=1)
    parser.add_argument("--scene-end", type=int)
    parser.add_argument("--copy-lineup-first", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    scenes = json.loads(args.manifest.read_text(encoding="utf-8"))
    scene_end = args.scene_end or len(scenes)
    if args.scene_start < 1 or scene_end > len(scenes) or args.scene_start > scene_end:
        raise SystemExit("Invalid scene range")

    sources = sorted(
        args.source_dir.glob("*.png"),
        key=lambda path: (path.stat().st_mtime_ns, path.name),
    )
    offset = args.source_offset
    required = scene_end - args.scene_start + 1 + int(args.copy_lineup_first)
    if len(sources) < offset + required:
        raise SystemExit(
            f"Not enough source PNGs: need {offset + required}, found {len(sources)}"
        )

    args.dest_dir.mkdir(parents=True, exist_ok=True)
    if args.copy_lineup_first:
        target = args.dest_dir / "character-lineup.png"
        shutil.copy2(sources[offset], target)
        print(f"{sources[offset].name} -> {target.name}")
        offset += 1

    for scene_number in range(args.scene_start, scene_end + 1):
        scene = scenes[scene_number - 1]
        source = sources[offset + scene_number - args.scene_start]
        target = args.dest_dir / scene["file"]
        shutil.copy2(source, target)
        print(f"{source.name} -> {target.name}")


if __name__ == "__main__":
    main()
