---
name: design-preferences
description: Recurring UI polish requests and preferred styling decisions for the CASY course-catalog.
metadata:
  type: project
---

User prefers a clean, dark command-deck aesthetic and dislikes empty/placeholder-looking space.

- **No black filler blocks:** When filter pills are hidden, the gaps between accordion panels should not read as solid black voids; the sidebar background should feel continuous.
- **Dependent filter hiding:** Hide filter options that have zero matching courses, but keep "All" and currently selected options visible.
- **Orange-white accent theme** for help / field-guide sections.
- **Human, purposeful copy** rather than AI-generated onboarding questions.

**Why:** The user pointed out visible black bands between collapsed/empty filter sections and asked to remove them.

**How to apply:** When changing filter visibility, also review the sidebar/panel spacing and background so empty areas blend into the surrounding surface rather than creating dark rectangular holes.
