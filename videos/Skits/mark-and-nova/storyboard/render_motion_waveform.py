#!/usr/bin/env python3
"""Render Mark and Nova with Ken Burns motion and Nova-only audio waveform."""

from __future__ import annotations

import argparse
import json
import math
import subprocess
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-dir", type=Path, default=Path("."))
    parser.add_argument("--manifest", type=Path, default=Path("storyboard/full-scenes.json"))
    parser.add_argument("--intervals", type=Path, default=Path("storyboard/nova-speaking-intervals.json"))
    parser.add_argument("--images-dir", type=Path, default=Path("assets/storyboard/full"))
    parser.add_argument("--audio", type=Path, default=Path("resources/Nova and Mark.mp3"))
    parser.add_argument("--output", type=Path, default=Path("renders/mark-and-nova-motion-waveform.mp4"))
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--width", type=int, default=1080)
    parser.add_argument("--height", type=int, default=1920)
    return parser.parse_args()


def project_path(project_dir: Path, value: Path) -> Path:
    return value if value.is_absolute() else project_dir / value


def ffmpeg_quote(value: str) -> str:
    return value.replace("\\", "/").replace("'", r"\'")


def enable_expression(intervals: list[dict[str, float]]) -> str:
    return "+".join(
        f"between(t,{float(interval['start']):.3f},{float(interval['end']):.3f})"
        for interval in intervals
    )


def build_filter(
    scenes: list[dict[str, object]],
    intervals: list[dict[str, float]],
    fps: int,
    width: int,
    height: int,
) -> str:
    lines: list[str] = []
    video_labels: list[str] = []
    for index, scene in enumerate(scenes):
        start = float(scene["start"])
        end = float(scene["end"])
        duration = end - start
        frames = max(1, int(math.ceil(duration * fps)))
        # Alternate gentle push-in and pull-back so every still breathes without
        # feeling like a synthetic camera move.
        if index % 2 == 0:
            zoom_expr = f"1.015+0.025*on/{frames}"
        else:
            zoom_expr = f"1.040-0.025*on/{frames}"
        x_nudge = "10*sin(on*0.035)" if index % 3 == 0 else "-10*sin(on*0.030)"
        y_nudge = "-8*sin(on*0.025)" if index % 4 == 0 else "8*sin(on*0.022)"
        label = f"v{index}"
        lines.append(
            f"[{index}:v]"
            f"scale={width}:{height}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height},setsar=1,"
            f"zoompan=z='{zoom_expr}':"
            f"x='iw/2-(iw/zoom/2)+{x_nudge}':"
            f"y='ih/2-(ih/zoom/2)+{y_nudge}':"
            f"d={frames}:s={width}x{height}:fps={fps},"
            f"trim=duration={duration:.6f},setpts=PTS-STARTPTS[{label}]"
        )
        video_labels.append(f"[{label}]")

    lines.append(
        "".join(video_labels)
        + f"concat=n={len(video_labels)}:v=1:a=0,format=rgba[base]"
    )

    enable = enable_expression(intervals)
    audio_input_index = len(scenes)
    wave_width = int(width * 0.56)
    wave_height = int(height * 0.075)
    wave_x = int((width - wave_width) / 2)
    wave_y = int(height * 0.835)
    lines.append(
        f"[{audio_input_index}:a]"
        f"showwaves=s={wave_width}x{wave_height}:mode=cline:"
        f"colors=65EFFF@0.95|00A8FF@0.85:scale=sqrt:draw=full:rate={fps},"
        f"format=rgba,colorkey=0x000000:0.06:0.03,setpts=PTS-STARTPTS[wave]"
    )
    lines.append(
        f"[base][wave]overlay=x={wave_x}:y={wave_y}:"
        f"enable='{enable}',format=yuv420p[outv]"
    )
    return ";\n".join(lines)


def main() -> None:
    args = parse_args()
    project_dir = args.project_dir.resolve()
    manifest = project_path(project_dir, args.manifest)
    intervals_path = project_path(project_dir, args.intervals)
    images_dir = project_path(project_dir, args.images_dir)
    audio = project_path(project_dir, args.audio)
    output = project_path(project_dir, args.output)

    scenes = json.loads(manifest.read_text(encoding="utf-8"))
    intervals = json.loads(intervals_path.read_text(encoding="utf-8"))
    previous_end = 0.0
    image_paths: list[Path] = []
    for scene in scenes:
        start = float(scene["start"])
        end = float(scene["end"])
        if abs(start - previous_end) > 0.02:
            raise SystemExit(f"Manifest is not continuous at {scene['id']}")
        if end <= start:
            raise SystemExit(f"Scene {scene['id']} has invalid duration")
        image_path = images_dir / str(scene["file"])
        if not image_path.exists():
            raise SystemExit(f"Missing scene image: {image_path}")
        image_paths.append(image_path)
        previous_end = end
    if not audio.exists():
        raise SystemExit(f"Missing audio: {audio}")

    output.parent.mkdir(parents=True, exist_ok=True)
    filter_script = output.with_suffix(".filter_complex.txt")
    filter_script.write_text(
        build_filter(scenes, intervals, args.fps, args.width, args.height),
        encoding="utf-8",
    )

    command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
    for image_path in image_paths:
        command.extend(["-loop", "1", "-i", str(image_path)])
    command.extend(["-i", str(audio)])
    command.extend(
        [
            "-filter_complex_script",
            str(filter_script),
            "-map",
            "[outv]",
            "-map",
            f"{len(image_paths)}:a:0",
            "-r",
            str(args.fps),
            "-t",
            f"{previous_end:.6f}",
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
    )
    subprocess.run(command, check=True)


if __name__ == "__main__":
    main()
