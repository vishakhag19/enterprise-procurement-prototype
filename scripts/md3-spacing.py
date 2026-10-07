#!/usr/bin/env python3
"""Scale raw spacing multipliers in sx={{...}} from 8dp-units to 4dp-units (×2).

Does not touch string/template contents or space.* tokens.
"""
from __future__ import annotations

import re
from pathlib import Path

KEYS = (
    "p", "px", "py", "pt", "pb", "pl", "pr",
    "m", "mx", "my", "mt", "mb", "ml", "mr",
    "gap", "rowGap", "columnGap",
)
NUM = r"-?\d+(?:\.\d+)?"
KEY_RE = re.compile(rf"\b({'|'.join(KEYS)}):\s*({NUM})\b")


def scale_num(n: float) -> str:
    if n == 0:
        return "0"
    scaled = n * 2
    if scaled == int(scaled):
        return str(int(scaled))
    return f"{scaled:.3f}".rstrip("0").rstrip(".")


def strip_strings(s: str) -> tuple[str, list[str]]:
    """Replace string/template literals with placeholders so keys inside text aren't matched."""
    parts: list[str] = []

    def repl(m: re.Match[str]) -> str:
        parts.append(m.group(0))
        return f"__STR{len(parts) - 1}__"

    # templates first, then double, then single quotes
    out = re.sub(r"`(?:\\.|[^`\\])*`", repl, s)
    out = re.sub(r'"(?:\\.|[^"\\])*"', repl, out)
    out = re.sub(r"'(?:\\.|[^'\\])*'", repl, out)
    return out, parts


def restore_strings(s: str, parts: list[str]) -> str:
    for i, p in enumerate(parts):
        s = s.replace(f"__STR{i}__", p)
    return s


def transform_sx_body(body: str) -> str:
    masked, parts = strip_strings(body)

    def repl(m: re.Match[str]) -> str:
        key, num = m.group(1), float(m.group(2))
        return f"{key}: {scale_num(num)}"

    masked = KEY_RE.sub(repl, masked)
    return restore_strings(masked, parts)


def find_sx_blocks(src: str) -> str:
    """Find sx={{ ... }} with nested braces and transform interiors."""
    out = []
    i = 0
    while True:
        j = src.find("sx={{", i)
        if j < 0:
            out.append(src[i:])
            break
        out.append(src[i:j])
        # start after sx={{
        start = j + len("sx={{")
        depth = 2  # already opened {{
        k = start
        while k < len(src) and depth > 0:
            c = src[k]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            k += 1
        # k is just past closing; body is start..k with trailing }} 
        # Actually when depth hits 0 we've consumed the final }. For sx={{ }}, depth starts at 2.
        # After consuming both closing braces depth=0, k points after last }
        body_with_close = src[start:k]
        # body ends with }}
        if not body_with_close.endswith("}}"):
            # fallback: don't transform
            out.append(src[j:k])
        else:
            body = body_with_close[:-2]
            out.append("sx={{")
            out.append(transform_sx_body(body))
            out.append("}}")
        i = k
    return "".join(out)


def transform_spacing_attrs(src: str) -> str:
    return re.sub(
        rf"\bspacing=\{{({NUM})\}}",
        lambda m: f"spacing={{{scale_num(float(m.group(1)))}}}",
        src,
    )


def main() -> None:
    for rel in ("src/App.tsx", "src/ui.tsx"):
        path = Path(rel)
        before = path.read_text()
        after = transform_spacing_attrs(find_sx_blocks(before))
        path.write_text(after)
        # sanity: 620 must remain
        if "620" in before and "1240" in after:
            raise SystemExit(f"CORRUPTION in {rel}: 620 became 1240")
        if "620 t" in before and "620 t" not in after:
            raise SystemExit(f"CORRUPTION in {rel}: lost '620 t'")
        print(f"{rel}: ok changed={before != after}")


if __name__ == "__main__":
    main()
