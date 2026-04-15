# Structure Status (Current + Roadmap)

This document is the architecture reference for the current codebase and a roadmap for future changes.

## Current implemented structure (Now)

```text
app/
├── antd-app.tsx
├── app.scss
├── root.tsx
├── routes.ts                    # currently only home route
├── lib/
│   └── gemini.ts
├── store/
│   ├── index.ts                 # root store config
│   ├── appSlice.ts              # app/report state
│   └── hooks.ts
├── features/
│   └── home/
│       ├── index.tsx
│       ├── hooks/
│       └── components/
│           ├── form-fitness/
│           └── report-card/
├── shared/
│   ├── hooks/
│   ├── schema/
│   ├── types/
│   └── utils/
└── MOCK/
    └── data.ts
```

Current route entry:

```ts
export default [index("features/home/index.tsx")] satisfies RouteConfig;
```

## Import boundary rule (Now)

```text
features/home ✅ can import from shared/
features/home ✅ can import from app/lib/
features/home ❌ should not import from other features directly
```

If code is reused across features, move it into `shared/`.

## Recommended target structure (Later)

Use this only as a roadmap when the app grows beyond a single primary feature.

```text
app/
├── core app files (root.tsx, routes.ts, antd-app.tsx)
├── features/
│   ├── home/
│   ├── auth/        # planned
│   ├── chat/        # planned
│   └── history/     # planned
├── shared/
├── store/           # root combine/store config
└── lib/             # app-wide 3rd-party integrations
```

## Roadmap items and status

| Item | Status | Notes |
| --- | --- | --- |
| Add feature routes (`auth`, `chat`, `history`) | Later | Not implemented in `app/routes.ts` yet |
| Keep features isolated from each other | Now | Enforced by convention; continue reviewing imports |
| Split large route config by feature if needed | Later | Current single route does not require modularization yet |
| Move app-wide integrations to stable `lib` location | Now | `app/lib/gemini.ts` is current source of truth |
| Move slice ownership closer to features when needed | Later | Current centralized store is acceptable for present scope |

## Guidance for future contributors

- Treat this file as a living reference: update `Now` when implementation changes.
- Do not describe roadmap items as active migrations unless work has started.
- Keep `routes.ts`, `store`, and feature folder examples synchronized with real code.
