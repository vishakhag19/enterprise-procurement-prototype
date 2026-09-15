# ITC Procurement Workspace

A clickable prototype for planning, optimizing, monitoring, and adjusting wood-fibre procurement against a business target. The connected flow follows an Eucalyptus target from Monday coverage review through recommendations, farm comparison, interactive scenarios, selective field verification, and plan recovery.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

## Prototype routes

- `/` — Monday target coverage, risk, and decision queue
- `/decisions/week-3-gap` — explainable farm recommendations
- `/compare` — side-by-side farm comparison
- `/scenarios` — interactive constraints, scenario tradeoffs, and Ravi’s verification route
- `/plan` — active plan monitoring and a simulated supply disruption

The app uses Next.js, TypeScript, Tailwind CSS, and shadcn/ui. All data is mocked in the client; there is no authentication, database, or external service.
