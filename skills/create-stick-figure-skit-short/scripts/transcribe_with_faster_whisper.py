#!/usr/bin/env python3
"""Create word and sentence timestamps with a Windows-friendly Whisper path."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("audio", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--model", default="base.en")
    parser.add_argument("--language", default="en")
    parser.add_argument("--sentence-cap", type=float, default=12.0)
    return parser.parse_args()


def ensure_model(model_name: str) -> Path:
    from huggingface_hub import snapshot_download

    model_dir = Path.home() / ".cache" / "hyperframes" / "faster-whisper" / model_name
    config = model_dir / "config.json"
    if not config.exists():
        snapshot_download(
            f"Systran/faster-whisper-{model_name}",
            local_dir=str(model_dir),
        )
    return model_dir


def group_sentences(words: list[dict[str, object]], cap: float) -> list[dict[str, object]]:
    sentences: list[dict[str, object]] = []
    buffer: list[str] = []
    start: float | None = None

    for word in words:
        word_start = float(word["start"])
        word_end = float(word["end"])
        text = str(word["text"])
        if start is None:
            start = word_start
        buffer.append(text)
        terminal = re.search(r"""[.!?]["']?$""", text) is not None
        too_long = word_end - start >= cap
        if terminal or too_long:
            sentences.append(
                {
                    "id": f"s{len(sentences)}",
                    "text": " ".join(buffer),
                    "start": round(start, 3),
                    "end": round(word_end, 3),
                }
            )
            buffer = []
            start = None

    if buffer and start is not None:
        sentences.append(
            {
                "id": f"s{len(sentences)}",
                "text": " ".join(buffer),
                "start": round(start, 3),
                "end": round(float(words[-1]["end"]), 3),
            }
        )
    return sentences


def main() -> None:
    args = parse_args()
    from faster_whisper import WhisperModel

    args.output_dir.mkdir(parents=True, exist_ok=True)
    model_dir = ensure_model(args.model)
    model = WhisperModel(str(model_dir), device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        str(args.audio),
        language=args.language,
        word_timestamps=True,
        vad_filter=True,
        beam_size=5,
    )

    words: list[dict[str, object]] = []
    normalized_segments: list[dict[str, object]] = []
    for segment_index, segment in enumerate(segments):
        segment_word_ids: list[str] = []
        for raw_word in segment.words or []:
            text = raw_word.word.strip()
            if not text:
                continue
            word = {
                "id": f"w{len(words)}",
                "text": text,
                "start": round(float(raw_word.start), 3),
                "end": round(float(raw_word.end), 3),
            }
            words.append(word)
            segment_word_ids.append(str(word["id"]))
        normalized_segments.append(
            {
                "id": f"seg{segment_index}",
                "text": segment.text.strip(),
                "start": round(float(segment.start), 3),
                "end": round(float(segment.end), 3),
                "words": segment_word_ids,
            }
        )

    word_payload = {
        "source": str(args.audio),
        "language": info.language,
        "language_probability": round(float(info.language_probability), 4),
        "duration_seconds": round(float(info.duration), 3),
        "words": words,
        "segments": normalized_segments,
    }
    sentence_payload = {
        "source": str(args.audio),
        "method": (
            f"faster-whisper {args.model} word timestamps grouped by terminal "
            f"punctuation, with a {args.sentence_cap:g}-second cap"
        ),
        "sentences": group_sentences(words, args.sentence_cap),
    }
    (args.output_dir / "transcript-words.json").write_text(
        json.dumps(word_payload, indent=2), encoding="utf-8"
    )
    (args.output_dir / "sentence-timestamps.json").write_text(
        json.dumps(sentence_payload, indent=2), encoding="utf-8"
    )
    print(
        f"words={len(words)} sentences={len(sentence_payload['sentences'])} "
        f"duration={word_payload['duration_seconds']}"
    )


if __name__ == "__main__":
    main()
