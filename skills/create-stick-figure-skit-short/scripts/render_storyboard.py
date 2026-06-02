#!/usr/bin/env python3
"""Render a vertical still-image storyboard against narration audio."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-dir", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--images-dir", type=Path, required=True)
    parser.add_argument("--audio", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--width", type=int, default=1080)
    parser.add_argument("--height", type=int, default=1920)
    parser.add_argument("--fps", type=int, default=30)
    return parser.parse_args()


def project_path(project_dir: Path, value: Path) -> Path:
    return value if value.is_absolute() else project_dir / value


def validate_manifest(scenes: list[dict[str, object]], images_dir: Path) -> None:
    if not scenes:
        raise SystemExit("Manifest contains no scenes")
    previous_end = 0.0
    for index, scene in enumerate(scenes, start=1):
        start = float(scene["start"])
        end = float(scene["end"])
        if abs(start - previous_end) > 0.02:
            raise SystemExit(
                f"Scene {index} is not continuous: starts {start}, expected {previous_end}"
            )
        if end <= start:
            raise SystemExit(f"Scene {index} has invalid duration")
        image = images_dir / str(scene["file"])
        if not image.exists():
            raise SystemExit(f"Missing scene image: {image}")
        previous_end = end


def main() -> None:
    args = parse_args()
    project_dir = args.project_dir.resolve()
    manifest = project_path(project_dir, args.manifest)
    images_dir = project_path(project_dir, args.images_dir)
    audio = project_path(project_dir, args.audio)
    output = project_path(project_dir, args.output)
    scenes = json.loads(manifest.read_text(encoding="utf-8"))
    validate_manifest(scenes, images_dir)
    if not audio.exists():
        raise SystemExit(f"Missing audio: {audio}")

    output.parent.mkdir(parents=True, exist_ok=True)
    concat_file = output.with_suffix(".concat.txt")
    concat_lines: list[str] = []
    for scene in scenes:
        image = (images_dir / str(scene["file"])).resolve().as_posix()
        duration = float(scene["end"]) - float(scene["start"])
        concat_lines.extend([f"file '{image}'", f"duration {duration:.6f}"])
    concat_lines.append(f"file '{(images_dir / str(scenes[-1]['file'])).resolve().as_posix()}'")
    concat_file.write_text("\n".join(concat_lines) + "\n", encoding="ascii")

    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_file),
        "-i",
        str(audio),
        "-vf",
        (
            f"scale={args.width}:{args.height}:force_original_aspect_ratio=increase,"
            f"crop={args.width}:{args.height},setsar=1,format=yuv420p"
        ),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-r",
        str(args.fps),
        "-t",
        f"{float(scenes[-1]['end']):.6f}",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        str(output),
    ]
    subprocess.run(command, check=True)
    subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,size:stream=codec_name,width,height,r_frame_rate",
            "-of",
            "json",
            str(output),
        ],
        check=True,
    )


if __name__ == "__main__":
    main()
