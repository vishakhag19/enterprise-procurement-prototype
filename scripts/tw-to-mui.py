#!/usr/bin/env python3
"""Convert Tailwind/raw HTML layout in App.tsx to MUI Box/Typography/Stack."""
from __future__ import annotations

import re
from pathlib import Path

PATH = Path("/workspace/src/App.tsx")

CLASS_MAP: dict[str, tuple[str, object] | None] = {
    "flex": ("display", "flex"),
    "flex-col": ("flexDirection", "column"),
    "flex-row": ("flexDirection", "row"),
    "flex-1": ("flex", 1),
    "flex-shrink-0": ("flexShrink", 0),
    "items-center": ("alignItems", "center"),
    "items-start": ("alignItems", "flex-start"),
    "items-end": ("alignItems", "flex-end"),
    "justify-center": ("justifyContent", "center"),
    "justify-between": ("justifyContent", "space-between"),
    "justify-end": ("justifyContent", "flex-end"),
    "relative": ("position", "relative"),
    "absolute": ("position", "absolute"),
    "overflow-hidden": ("overflow", "hidden"),
    "overflow-y-auto": ("overflowY", "auto"),
    "h-full": ("height", "100%"),
    "w-full": ("width", "100%"),
    "min-h-0": ("minHeight", 0),
    "max-w-3xl": ("maxWidth", 768),
    "max-w-2xl": ("maxWidth", 672),
    "text-right": ("textAlign", "right"),
    "text-center": ("textAlign", "center"),
    "cursor-pointer": ("cursor", "pointer"),
    "cursor-col-resize": ("cursor", "col-resize"),
    "touch-none": ("touchAction", "none"),
    "z-10": ("zIndex", 10),
    "rounded": ("borderRadius", 1),
    "rounded-sm": ("borderRadius", "2px"),
    "rounded-full": ("borderRadius", "50%"),
    "bg-white": ("bgcolor", "background.paper"),
    "bg-gray-50": ("bgcolor", "grey.50"),
    "bg-gray-100": ("bgcolor", "grey.100"),
    "bg-gray-700": ("bgcolor", "grey.700"),
    "border": ("border", 1),
    "border-b": ("borderBottom", 1),
    "border-t": ("borderTop", 1),
    "border-r": ("borderRight", 1),
    "border-l": ("borderLeft", 1),
    "border-y": ("borderTop", 1),  # + borderBottom handled below
    "border-gray-100": ("borderColor", "divider"),
    "border-gray-200": ("borderColor", "divider"),
    "border-gray-300": ("borderColor", "divider"),
    "border-dashed": ("borderStyle", "dashed"),
    "border-amber-200": ("borderColor", "warning.light"),
    "border-amber-700": ("borderColor", "warning.dark"),
    "border-red-300": ("borderColor", "error.light"),
    "bg-amber-700": ("bgcolor", "warning.dark"),
    "bg-amber-100": ("bgcolor", "#FEF3C7"),
    "bg-red-50": ("bgcolor", "#FEF2F2"),
    "bg-amber-50": ("bgcolor", "#FFFBEB"),
    "text-white": ("color", "#fff"),
    "text-gray-300": ("color", "grey.300"),
    "text-gray-400": ("color", "text.secondary"),
    "text-gray-500": ("color", "text.secondary"),
    "text-gray-600": ("color", "text.secondary"),
    "text-gray-700": ("color", "text.primary"),
    "text-gray-800": ("color", "text.primary"),
    "text-gray-900": ("color", "text.primary"),
    "text-red-600": ("color", "error.main"),
    "text-red-700": ("color", "error.dark"),
    "text-red-800": ("color", "error.dark"),
    "text-amber-700": ("color", "warning.dark"),
    "text-amber-800": ("color", "warning.dark"),
    "text-amber-900": ("color", "#78350F"),
    "text-emerald-600": ("color", "success.main"),
    "text-emerald-700": ("color", "success.dark"),
    "font-bold": ("fontWeight", 700),
    "font-semibold": ("fontWeight", 650),
    "font-medium": ("fontWeight", 500),
    "uppercase": ("textTransform", "uppercase"),
    "leading-relaxed": ("lineHeight", 1.6),
    "line-through": ("textDecoration", "line-through"),
    "whitespace-nowrap": ("whiteSpace", "nowrap"),
    "transition-all": ("transition", "all 0.2s"),
    "transition-colors": ("transition", "background-color 0.15s"),
    "gap-2": ("gap", 1),
    "gap-4": ("gap", 2),
    "gap-x-3": ("columnGap", 1.5),
    "gap-y-1": ("rowGap", 0.5),
    "p-3": ("p", 1.5),
    "p-4": ("p", 2),
    "p-6": ("p", 3),
    "px-2": ("px", 1),
    "px-4": ("px", 2),
    "px-6": ("px", 3),
    "py-1": ("py", 0.5),
    "py-4": ("py", 2),
    "py-6": ("py", 3),
    "pt-1": ("pt", 0.5),
    "pt-4": ("pt", 2),
    "pb-4": ("pb", 2),
    "pl-4": ("pl", 2),
    "pr-4": ("pr", 2),
    "mb-1": ("mb", 0.5),
    "mb-2": ("mb", 1),
    "mb-4": ("mb", 2),
    "mb-6": ("mb", 3),
    "mb-8": ("mb", 4),
    "mt-1": ("mt", 0.5),
    "mt-2": ("mt", 1),
    "mt-4": ("mt", 2),
    "mt-auto": ("mt", "auto"),
    "mr-auto": ("mr", "auto"),
    "ml-6": ("ml", 3),
    "ml-auto": ("ml", "auto"),
    "w-1.5": ("width", 6),
    "w-2": ("width", 8),
    "w-3": ("width", 12),
    "h-1": ("height", 4),
    "h-1.5": ("height", 6),
    "h-3": ("height", 12),
    "h-5": ("height", 20),
    "h-24": ("height", 96),
    "h-32": ("height", 128),
    "w-72": ("width", 288),
    "min-w-96": ("minWidth", 384),
    "max-w-[440px]": ("maxWidth", 440),
    "max-w-[220px]": ("maxWidth", 220),
    "w-[34%]": ("width", "34%"),
    "text-xs": ("fontSize", "0.75rem"),
    "text-sm": ("fontSize", "0.875rem"),
    "text-base": ("fontSize", "1rem"),
    "text-lg": ("fontSize", "1.125rem"),
    "text-xl": ("fontSize", "1.25rem"),
    "text-2xl": ("fontSize", "1.5rem"),
    "text-[9px]": ("fontSize", 9),
    "text-[10px]": ("fontSize", 10),
    "tracking-widest": ("letterSpacing", "0.14em"),
    "grid": ("display", "grid"),
    "grid-cols-2": ("gridTemplateColumns", "1fr 1fr"),
    "grid-cols-4": ("gridTemplateColumns", "repeat(4, 1fr)"),
    "flex-wrap": ("flexWrap", "wrap"),
    "-left-1": ("left", -4),
    "top-0": ("top", 0),
    "bottom-0": ("bottom", 0),
    "bottom-2": ("bottom", 8),
    "left-2": ("left", 8),
    "mx-auto": ("mx", "auto"),
    "w-px": ("width", "1px"),
    "bg-transparent": ("bgcolor", "transparent"),
}


def lit(v: object) -> str:
    if isinstance(v, str):
        if v.startswith("'") or v.startswith("`") or v.startswith("{"):
            return v
        return f"'{v}'"
    return str(v)


def classes_to_sx(cls: str) -> tuple[dict[str, object], list[str]]:
    sx: dict[str, object] = {}
    keep: list[str] = []
    tokens = cls.split()
    for c in tokens:
        if c.startswith(("hover:", "first:", "last:", "group-hover:")):
            continue
        if c in ("group", "scroll-hide", "space-y-1", "space-y-1.5", "space-y-0"):
            if c == "scroll-hide":
                sx["scrollbarWidth"] = "none"
                sx["msOverflowStyle"] = "none"
            if c.startswith("space-y"):
                sx["display"] = "flex"
                sx["flexDirection"] = "column"
                sx["gap"] = 1 if c != "space-y-1.5" else 1.5
            continue
        if c == "font-data":
            keep.append("font-data")
            continue
        if c == "border-y":
            sx["borderTop"] = 1
            sx["borderBottom"] = 1
            continue
        if c in ("w-5", "h-5") and "w-5" in tokens and "h-5" in tokens:
            sx["width"] = 20
            sx["height"] = 20
            continue
        mapped = CLASS_MAP.get(c)
        if mapped:
            k, v = mapped
            sx[k] = v
    return sx, keep


def merge_sx(existing: str | None, new_sx: dict[str, object]) -> str:
    if not new_sx and not existing:
        return ""
    parts = [f"{k}: {lit(v)}" for k, v in new_sx.items()]
    if existing:
        existing = existing.strip()
        if existing.startswith("{") and existing.endswith("}"):
            inner = existing[1:-1].strip()
            if inner:
                parts.append(inner)
        else:
            parts.append(f"...{existing}")
    return "{ " + ", ".join(parts) + " }"


TAG_MAP = {
    "div": "Box",
    "p": "Typography",
    "h2": "Typography",
    "h3": "Typography",
    "span": "Box",
    "ul": "Box",
    "li": "Stack",
    "strong": "Box",
}


def convert_open_tag(match: re.Match[str]) -> str:
    tag = match.group("tag")
    attrs = match.group("attrs") or ""
    self_close = match.group("slash") or ""

    # Extract className="..."
    cls_m = re.search(r'className="([^"]*)"', attrs)
    cls_expr_m = re.search(r"className=\{([^}]*)\}", attrs)
    cls = cls_m.group(1) if cls_m else ""
    dynamic_cls = cls_expr_m.group(1).strip() if cls_expr_m else None

    # Extract existing sx=
    sx_m = re.search(r"sx=\{((?:[^{}]|\{[^{}]*\})*)\}", attrs)
    existing_sx = sx_m.group(1) if sx_m else None

    # Extract style=
    style_m = re.search(r"style=\{((?:[^{}]|\{[^{}]*\})*)\}", attrs)

    new_sx, keep = classes_to_sx(cls) if cls else ({}, [])

    # Typography defaults
    component = TAG_MAP.get(tag, "Box")
    extra_attrs = ""
    if tag == "p":
        if "fontSize" not in new_sx:
            extra_attrs += ' variant="body2"'
        else:
            # keep fontSize in sx; use body2 as base sometimes
            pass
    if tag == "h2":
        extra_attrs += ' variant="h2"'
        new_sx.setdefault("color", "text.primary")
    if tag == "h3":
        extra_attrs += ' variant="h3"'
        new_sx.setdefault("color", "text.primary")
    if tag == "span":
        extra_attrs += ' component="span"'
    if tag == "strong":
        extra_attrs += ' component="strong"'
        new_sx.setdefault("fontWeight", 700)
        new_sx.setdefault("display", "inline")
    if tag == "ul":
        extra_attrs += ' component="ul"'
        new_sx.setdefault("m", 0)
        new_sx.setdefault("p", 0)
        new_sx.setdefault("listStyle", "none")
    if tag == "li":
        extra_attrs += ' component="li" direction="row"'
        new_sx.setdefault("alignItems", "center")

    # Remove className / sx / style from attrs for rebuild
    clean = attrs
    clean = re.sub(r'\s*className="[^"]*"', "", clean)
    clean = re.sub(r"\s*className=\{[^}]*\}", "", clean)
    clean = re.sub(r"\s*sx=\{(?:[^{}]|\{[^{}]*\})*\}", "", clean)
    # Keep style as sx merge if simple object
    if style_m:
        style_inner = style_m.group(1).strip()
        clean = re.sub(r"\s*style=\{(?:[^{}]|\{[^{}]*\})*\}", "", clean)
        # merge style into sx via spread
        if existing_sx:
            existing_sx = f"{{ ...{existing_sx}, ...{style_inner} }}" if not existing_sx.strip().startswith("{") else existing_sx
            # simpler: append spread
            merged = merge_sx(None, new_sx)
            if merged:
                # strip braces
                inner = merged[1:-1].strip()
                sx_attr = f" sx={{{{ {inner}, ...{style_inner} }}}}"
            else:
                sx_attr = f" sx={{{style_inner}}}"
        else:
            merged = merge_sx(None, new_sx)
            if merged:
                inner = merged[1:-1].strip()
                sx_attr = f" sx={{{{ {inner}, ...{style_inner} }}}}"
            else:
                sx_attr = f" sx={{{style_inner}}}"
    else:
        merged = merge_sx(existing_sx, new_sx)
        sx_attr = f" sx={{{merged}}}" if merged else ""

    class_attr = ""
    if keep:
        class_attr = f' className="{" ".join(keep)}"'
    elif dynamic_cls:
        # keep dynamic className expressions (template with conditionals)
        class_attr = f" className={{{dynamic_cls}}}"

    # PrimaryBtn fullWidth shortcut
    if "w-full" in cls and "justify-center" in cls:
        # handled via sx width 100%
        pass

    clean = re.sub(r"\s+", " ", clean).strip()
    if clean and not clean.startswith(" "):
        clean = " " + clean

    return f"<{component}{extra_attrs}{class_attr}{sx_attr}{clean}{self_close}>"


def convert_file(src: str) -> str:
    # Convert opening tags with optional className
    pattern = re.compile(
        r"<(?P<tag>div|p|h2|h3|span|ul|li|strong)(?P<attrs>(?:\s[^>]*)?)(?P<slash>/?)>",
        re.MULTILINE,
    )

    def repl(m: re.Match[str]) -> str:
        attrs = m.group("attrs") or ""
        # Skip if already looks like it has only event handlers and no class - still convert div→Box
        # Don't convert inside comments
        return convert_open_tag(m)

    out = pattern.sub(repl, src)

    # Close tags
    out = out.replace("</div>", "</Box>")
    out = out.replace("</p>", "</Typography>")
    out = out.replace("</h2>", "</Typography>")
    out = out.replace("</h3>", "</Typography>")
    out = out.replace("</span>", "</Box>")
    out = out.replace("</ul>", "</Box>")
    out = out.replace("</li>", "</Stack>")
    out = out.replace("</strong>", "</Box>")

    # SVG keeps style= for layout (native SVG has no sx); map common classes to style
    def svg_cls(m: re.Match[str]) -> str:
        cls = m.group(1)
        style_bits = []
        if "w-full" in cls.split():
            style_bits.append("width: '100%'")
        if "h-full" in cls.split():
            style_bits.append("height: '100%'")
        if "h-24" in cls.split():
            style_bits.append("height: 96")
        if "rounded" in cls.split():
            style_bits.append("borderRadius: 4")
        if "border" in cls.split():
            style_bits.append("border: '1px solid rgba(12,21,32,0.12)'")
        if "w-3" in cls.split():
            style_bits.append("width: 12")
        if "h-3" in cls.split():
            style_bits.append("height: 12")
        if "text-white" in cls.split():
            style_bits.append("color: '#fff'")
        style_attr = f" style={{{{ {', '.join(style_bits)} }}}}" if style_bits else ""
        return f"<svg{style_attr}"

    out = re.sub(r'<svg className="([^"]*)"', svg_cls, out)

    # Fix PrimaryBtn className="w-full justify-center" → fullWidth
    out = out.replace(
        'className="w-full justify-center"',
        "fullWidth",
    )

    # RegionMap sizeClass still uses tw strings - leave those as they are passed to svg className
    # Fix double-converted Typography variant conflicts later via tsc

    return out


def main() -> None:
    src = PATH.read_text()
    out = convert_file(src)
    PATH.write_text(out)
    print("className after:", out.count("className="))
    print("div left:", len(re.findall(r"<div\b", out)))
    print("p left:", len(re.findall(r"<p\b", out)))
    print("Box count:", len(re.findall(r"<Box\b", out)))
    print("Typography count:", len(re.findall(r"<Typography\b", out)))


if __name__ == "__main__":
    main()
