# vite-mf-race-condition

Minimal reproduction for a production-only shared module shape mismatch with Vite + Module Federation.

## What this repro does

- `remote` exposes `./definition`.
- `remote/src/definition.ts` imports `roundFormat` from `@repro/shared-lib` and immediately calls `roundFormat.sync()`.
- `host` registers `@repro/shared-lib` through `@module-federation/enhanced/runtime` and loads `remote/definition`.
- In the buggy path, production remote loader reads an entry from `__mf_module_cache__.share` and treats it as exports, but receives the wrong shape, causing a runtime error around `sync`/`roundFormat`.

## Install

```bash
pnpm install
pnpm exec playwright install --with-deps chromium
```

## Reproduce

```bash
pnpm build
pnpm test
```

Expected with bug present:
- test passes by observing `ERR:` in host status output.

Expected after upstream fix:
- host shows `OK:sync-ok`.
- update test assertion in `tests/repro.spec.ts` accordingly.

## Optional local workaround toggle

In `host/src/main.ts`, set `seedWorkaround = true` to seed:
- `__mf_module_cache__.share['@repro/shared-lib']`
- `__mf_module_cache__.share['default:@repro/shared-lib']`

This usually makes the repro turn green (`OK:sync-ok`) by forcing direct export objects into the cache.
