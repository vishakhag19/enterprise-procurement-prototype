# ITC Procurement · Decision Support

Interactive After prototype for Shrikant’s eucalyptus procurement workflow: coverage → farms → compare → scenarios → verification → field → findings → plan → alert.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:43127](http://localhost:43127).

Production-style preview (after `pnpm build`):

```bash
pnpm preview --host 0.0.0.0 --port 43129
```

## Stack

Vite, React, TypeScript, Tailwind CSS v4, [Material UI](https://mui.com/material-ui/) (`@mui/material`).

The requested [MaterialDesignInXamlToolkit](https://github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit) is a WPF (XAML) kit, so this web app uses Material UI for React with the same Material Design language.

## Design

- **Font:** Manrope
- **Accent:** `#0BAFAF`
