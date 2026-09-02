# Plan: Replace blue/teal UI with orange on CASY course-catalog

## Goal
Convert the course-catalog page from its current blue/cyan/teal accent system to a consistent orange/amber accent system, while keeping the dark command-deck surfaces and the existing orange hero already in place.

## Why an override file is the right approach
- `course-catalog.css` is ~31k lines and contains many stacked patches and conflicting rules (the same selectors are overridden multiple times down the file).
- Editing individual rules in place would require touching hundreds of rules and risks breaking existing patches.
- A single, loaded-last CSS file lets us redefine CSS variables globally and patch only the outliers. It is reversible and auditable.

## Implementation approach

### 1. Create `assets/catalog-orange-theme.css`
Load it after `assets/casy-hero-unify.css` in `course-catalog.html`:
```html
<link rel="stylesheet" href="assets/catalog-orange-theme.css" />
```

### 2. Redefine the global accent variables (both themes)
Override the blue/teal token families to map to an orange scale:

| Old token family | New orange mapping |
|---|---|
| `--accent-saffron` / `--primary` | `#F59E0B` (amber-500) / `#1D4ED8` light → `#D97706` |
| `--accent-cyan` / `--teal-*` | `#F97316` / `#EA580C` / `#C2410C` |
| `--blue-*` | reuse orange scale, e.g. `#F59E0B`, `#F97316`, `#EA580C` |
| `--globe-halo` / `--globe-marker` / `--globe-arc` | `#F59E0B` / `#F97316` |
| `--focus-ring` glows | `rgba(245, 158, 11, 0.30)` |
| `--landing-accent-green` | map to `#F59E0B` so old green CTAs become orange |
| `--cv-moss` / `--cv-indigo` accents | map to amber/orange variants where they appear as primary accents |

### 3. Re-map the CourseVerify / dataviz palette
- Redefine `--teal`, `--teal-400`, `--teal-500`, `--teal-600`, `--teal-700`, `--teal-bg`, `--teal-glow`.
- Redefine `--blue`, `--blue-400`, `--blue-500`, `--blue-600`, `--blue-700`, `--blue-bg`, `--blue-glow`.
- Redefine `--accent`, `--accent-light`, `--accent-dark`, `--accent-glow`.
- Redefine `--globe-*` colors.

### 4. Patch JS-generated colors
In `assets/app.js`:
- `GLOBE_THEMES.light`/`dark`: change `halo`, `marker`, `arc` from `#22D3EE` / `#1D4ED8` / `#0891B2` to orange (`#F59E0B`, `#F97316`).
- `getDomainColor()`: the function already has an orange entry for `Legal & Ethical` (`#f59e0b`). Keep the per-domain semantic palette, but change the fallback from `#22D3EE` to `#F59E0B` and change `System & Endpoint` from cyan to a neutral or orange tone.
- Active selection marker `#00f2fe` → `#FFB347` (warm amber).

### 5. Patch outliers that hard-code teal/blue values
Add high-specificity overrides for:
- `.field-guide-overlay` / `.catalog-help-btn` (already orange, keep it)
- Any remaining `#22D3EE`, `#06b6d4`, `#0891B2`, `#007aff` literals found in `course-catalog.css`
- Scroll progress bar (`--primary` will cover it once variable is remapped)
- Active filter pills, domain chips, skill pills (casy-hero-unify already makes these amber; confirm)
- Dashboard metric values and bar fills (casy-hero-unify already makes these amber; confirm)

### 6. What will NOT change
- The deep navy surfaces (`--casy-surface`, `--bg`, `--bg-surface`).
- Text colors (white/off-white/gray).
- Error (`--red`) and success (`--green`) status colors.
- The field-guide dashboard orange theme (it is already on-brand; only adjust if it clashes).

## Files to change
1. `course-catalog.html` — add one `<link>` for the new theme override.
2. `assets/catalog-orange-theme.css` — new file with variable remaps and outlier overrides.
3. `assets/app.js` — globe theme colors, domain fallback, active marker.

## Validation
After the change, a page search for `#22D3EE`, `#06b6d4`, `#0891B2`, `#1D4ED8`, `#007aff`, `#00f2fe`, `#38BDF8` should return no visible UI occurrences (only definitions in the base CSS that are overridden by the new file). We will hard-refresh the page and spot-check: hero, search button, globe, filter pills, course cards, Guide button, field-guide modal, pagination.
