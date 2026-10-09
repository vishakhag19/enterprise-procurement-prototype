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

## Shareable deploy (GitHub Pages)

**Live site:** https://vishakhag19.github.io/enterprise-procurement-prototype/

**Design system (case study):** https://vishakhag19.github.io/enterprise-procurement-prototype/design-system.html

Repo: https://github.com/vishakhag19/enterprise-procurement-prototype

Local design system page: [http://localhost:8443/design-system.html](http://localhost:8443/design-system.html)


This repo includes `.github/workflows/deploy-pages.yml`. After the project is on GitHub:

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Push to a watched branch (or run the workflow manually)
3. Share `https://<your-user>.github.io/<repo>/`

Local production build with the Pages base path:

```bash
VITE_BASE=/<repo>/ npm run build
```

## Stack

Vite, React, TypeScript, and [Material UI](https://mui.com/material-ui/) for the full UI surface (`ThemeProvider`, layout primitives, Paper, Dialog, Drawer, Table, Slider, Chip, TextField, etc.).

The requested [MaterialDesignInXamlToolkit](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit) is a WPF (XAML) kit, so this web app uses Material UI for React with the same Material Design language.

- **Font:** Manrope
- **Accent:** `#0BAFAF`
- **Spacing:** Material 8dp grid (`theme.spacing`, 8 / 16 / 24 / 32)
- **Surfaces:** terrain canvas → open strips → map plane (not a card wall)
- **Semantics:** canopy / earth status colors (not default green/red SaaS)
- **Taxonomy:** shared status chips (confidence, evidence, visits, constraints)
- **Hero focus:** Coverage, Scenario Planning, Plan Recovery
