# ITC Procurement · Decision Support

Interactive After prototype for Shrikant’s eucalyptus procurement workflow: coverage → farms → compare → scenarios → verification → field → findings → plan → alert.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:8443](http://localhost:8443).

Production-style preview (after `pnpm build`):

```bash
pnpm preview --host 0.0.0.0 --port 8443
```

## Stack

Vite, React, TypeScript, [Material UI](https://mui.com/material-ui/) throughout (`@mui/material` layout, Paper, Dialog, Drawer, Table, Slider, etc.), plus Tailwind for map SVG utilities.

The requested [MaterialDesignInXamlToolkit](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit) is a WPF (XAML) kit, so this web app uses Material UI for React with the same Material Design language.


- **Font:** Manrope
- **Accent:** `#0BAFAF`
- **Spacing:** Material 8dp grid (`theme.spacing`, 8 / 16 / 24 / 32)
- **Surfaces:** terrain canvas → open strips → map plane (not a card wall)
- **Semantics:** canopy / earth status colors (not default green/red SaaS)
- **Taxonomy:** shared status chips (confidence, evidence, visits, constraints)
- **Hero focus:** Coverage, Scenario Planning, Plan Recovery
