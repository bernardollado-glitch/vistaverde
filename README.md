# Vista Verde

A cooperative farming game prototype for Decentraland SDK7, developed by the Vista Verde team with AI-assisted coding.

## Playable scene

**[Play Vista Verde](https://decentraland.org/jump/?realm=vistaverde.dcl.eth)** — World: `vistaverde.dcl.eth`. Published on 15 October 2026. The creator confirmed harvest-count recovery in the published World. Public multi-client synchronization and mobile behavior are not yet verified. This repository is being prepared for a Creator Success V0 application; it is not a completed funded vertical slice.

## Current prototype

- Four shared beds with planting, timed lettuce growth, harvesting, wilting and cleaning.
- One watering bucket per crop: blue before use, brown after watering, with a short sound. Watering does not yet affect growth.
- Shared harvest counter, a five-harvest demonstration celebration, and server-side saved state.
- Creator self-tests with two identities in desktop and Chrome; screenshots in [design/evidencia](design/evidencia/README.md).

Watermelon, currency, proportional rewards, daily goals, community levels, weekly ranking and mobile controls are planned, not implemented. The demonstration celebration is not the future daily-goal system.

## Design

- [Game Design Document](design/gdd.md)
- [Readable GDD](design/gdd.html)
- [Prototype evidence](design/evidencia/README.md)

The four-week plan describes a tentative later development scope. The initial V0 vertical-slice scope must be agreed with Creator Success if selected.

## Run locally

Install Node.js and npm (Node 20 or newer recommended for this project), then run from the scene root:

```sh
npm ci
npm run start
```

The start script selects the pinned Hammurabi preview server and disables automatic reloads, following the configuration that worked in the creator's local tests. Keep the terminal open. Stop and restart after source changes. On this Mac, `Abrir granja.command` is an additional shortcut that uses Creator Hub's bundled Node.js.

For a second client, open Chrome with the realm printed by the server. If the preview listens on port 8000:

https://decentraland.org/bevy-web/?preview=true&realm=http%3A%2F%2Flocalhost%3A8000&position=0%2C0

The scene uses an authoritative multiplayer-server SDK build. Local server storage is excluded from Git; another checkout starts with its own local state. The published World was reached by the creator, who confirmed harvest-count recovery; public multi-client behavior remains unverified.

## Verify

```sh
npm run build
node --test tests/*.test.cjs
```

Tests cover crop-state transitions, duplicate action rejection, persistence and server-message handling. They do not establish mobile support, retention or production readiness.

## Contact

Team: Vista Verde · Discord: irondanu · Email: bernardo.llado@gmail.com
