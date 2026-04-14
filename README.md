# Healthy Me

Demo-oriented React app using **TypeScript**, **React Router 7** (SSR), **Redux Toolkit**, **Ant Design** (including **Ant Design Charts**), **SCSS modules**, and the **Gemini API** from the browser.

## Security warning (Gemini)

`VITE_GEMINI_API_KEY` is embedded in the **client bundle**. Anyone can read it from DevTools or the built assets. This is intentional for **local demos only**. Do not use this pattern in production; call Gemini from a server and keep secrets out of the client.

## Prerequisites

- Node.js (see your environment; project is tested with current LTS-style releases)
- npm (this repo uses `install-strategy=nested` in [`.npmrc`](./.npmrc) to avoid an npm 11 dependency-resolution issue with AntV packages)

## Setup

```bash
npm install
# Copy env template (PowerShell: Copy-Item .env.example .env)
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY for the Gemini demo card
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Dev server with HMR                  |
| `npm run build`   | Production build (client + server)   |
| `npm run start`   | Run the production server locally    |
| `npm run typecheck` | Route typegen + `tsc`              |

## Stack

- **TypeScript** — strict project references via `tsc`
- **Redux Toolkit** — `app/store` with a small `app` slice (see [`app/store`](./app/store))
- **Ant Design** — UI components; SSR uses `@ant-design/cssinjs` (`StyleProvider`, `extractStyle`) in [`app/antd-app.tsx`](./app/antd-app.tsx)
- **SCSS modules** — e.g. [`app/welcome/welcome.module.scss`](./app/welcome/welcome.module.scss)
- **Ant Design Charts** — demo line chart on the home page
- **Gemini** — [`@google/generative-ai`](https://www.npmjs.com/package/@google/generative-ai) called from the client ([`app/lib/gemini.ts`](./app/lib/gemini.ts))

## Building for production

```bash
npm run build
```

Output layout:

```
build/
├── client/ # Static assets
└── server/    # Server bundle
```

## Deployment

If you deploy the Node server, ship the `build/` output plus `package.json` (and lockfile) and run `npm run start` (or your host’s equivalent) so it serves `./build/server/index.js`.

Container-oriented hosts (Docker, Fly.io, Railway, etc.) follow the same idea: build the app, run the React Router server entry from `build/server`.

## Troubleshooting

- **Gemini errors** — Confirm the API key, billing, and that `gemini-1.5-flash` is available for your project. Adjust the model string in [`app/lib/gemini.ts`](./app/lib/gemini.ts) if your account requires a different model id.
- **`npm install` failures on Windows** — Ensure [`.npmrc`](./.npmrc) keeps `install-strategy=nested`, or install with `npm install --install-strategy=nested`.
