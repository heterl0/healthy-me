# Recommended Structure

```text
src/
├── app/
│   ├── antd-app.tsx          # AntD ConfigProvider
│   ├── root.tsx              # Router, providers
│   ├── routes.ts             # Route definitions
│   └── app.scss              # Global styles
│
├── features/                 # 👈 Core change — rename from pages
│   ├── chat/
│   │   ├── components/       # Chat-specific components
│   │   ├── hooks/            # useChat, useStream
│   │   ├── api/              # LLM calls
│   │   ├── store/            # Chat redux slice
│   │   ├── types/            # Chat types
│   │   ├── utils/            # Chat helpers
│   │   └── index.tsx         # Page entry point
│   │
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/            # useAuth
│   │   ├── lib/              # jwt, cookie utils
│   │   └── index.tsx
│   │
│   └── history/
│       ├── components/
│       ├── hooks/
│       └── index.tsx
│
├── shared/                   # 👈 Truly shared across features
│   ├── components/           # Button wrappers, Layout, etc
│   ├── hooks/                # useDebounce, useLocalStorage
│   ├── utils/                # formatDate, cn()
│   └── types/                # Global types
│
├── store/                    # Root redux store + combine slices
└── lib/                      # 3rd party config (axios instance etc)
```

---

## The Rule That Makes This Work

```text
features/chat  ✅ can import from  shared/
features/chat  ✅ can import from  lib/
features/chat  ❌ cannot import from  features/history/
```

Features **never import from each other**. If two features need the same thing — it moves to `shared/`.

---

## What I'd Disagree With Your Current Structure

| Current               | Issue                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| `store/` at root      | Split slices into each feature, only root combiner stays at root          |
| `types/` at root      | Types should live with their feature, only global types in `shared/types` |
| `welcome/` folder     | Should be `features/welcome/` for consistency                             |
| `lib/` inside `app/`  | Move to root-level `lib/` — it's not app-specific                         |
| `routes.ts` flat file | Fine for now, but will grow — consider splitting per feature              |

---

## Your `routes.ts` With This Structure

```typescript
// app/routes.ts
import { lazy } from "react";

const ChatPage = lazy(() => import("../features/chat"));
const AuthPage = lazy(() => import("../features/auth"));
const HistoryPage = lazy(() => import("../features/history"));

export const routes = [
  { path: "/login", element: <AuthPage /> },
  { path: "/chat", element: <ChatPage />, protected: true },
  { path: "/history", element: <HistoryPage />, protected: true },
];
```

Each feature's `index.tsx` is the **only public API** of that feature — everything else is internal.
