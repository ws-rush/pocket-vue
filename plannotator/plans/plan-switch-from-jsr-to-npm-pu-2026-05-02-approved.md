# Plan: Switch from JSR to npm publishing with `@rush/pico-vue`

## Context
The project is currently published to JSR which doesn't serve CDN bundles. All CDN links in docs (`unpkg.com/pico-vue`, `cdn.jsdelivr.net/npm/pico-vue`, etc.) are broken. Switching to npm with the scoped name `@rush/pico-vue` will make all CDN links work.

## Files to Modify

### Code/Config (6 files)
1. **`package.json`** — Change name to `@rush/pico-vue`, add `publishConfig.access: "public"`
2. **`jsr.json`** — Remove (no longer needed)
3. **`.github/workflows/jsr-publish.yml`** — Rename to `npm-publish.yml`, replace JSR publish with npm publish using `NODE_AUTH_TOKEN` secret
4. **`scripts/release.cjs`** — Replace `jsr.json` version update with just `package.json`, keep npm publish in CI
5. **`vite.config.ts`** — Update `name: 'PicoVue'` to `name: 'PicoVue'` (keep — this is the global name, not the package name)
6. **`src/index.ts`** — No changes needed

### Docs (17 files) — update all CDN links and import references
All `unpkg.com/pico-vue` → `unpkg.com/@rush/pico-vue`
All `cdn.jsdelivr.net/npm/pico-vue` → `cdn.jsdelivr.net/npm/@rush/pico-vue`
All `esm.sh/pico-vue` → `esm.sh/@rush/pico-vue`
All `npm install pico-vue` → `npm install @rush/pico-vue`
All `from 'pico-vue'` → `from '@rush/pico-vue'`

## Steps
- [ ] Update `package.json` name and publishConfig
- [ ] Delete `jsr.json`
- [ ] Replace GitHub Actions workflow: JSR → npm publish
- [ ] Update `scripts/release.cjs`
- [ ] Update all docs CDN links and npm references

## Verification
- `pnpm build` passes
- `pnpm test:once` passes
- All docs reference `@rush/pico-vue`
