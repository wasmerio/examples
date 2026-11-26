# CSS Grid Configuration Guide

## Current Grid Setup

### Container Configuration (`index.astro`)
```html
<main class="... lg:grid-cols-4 lg:grid-rows-10 ...">
```

This creates:
- **4 columns** on large screens (≥1024px)
- **10 rows** on large screens
- **2 columns** on medium screens (≥768px) 
- **No explicit row limit** on medium/small screens (auto-rows)

### Current Card Sizes

| Card | Medium (md) | Large (lg) | Row Span |
|------|-------------|------------|----------|
| IntroCard | 2 cols | 4 cols | 1 row |
| CVCard | 2 cols | 1 col | 1 row |
| InterestsCard | 2 cols | 3 cols | 1 row |
| ExperienceCard | 2 cols | 1 col | 1 row |
| ValuesCard | 2 cols | 3 cols | 1 row |
| PersonalityCard | 2 cols | 1 col | 1 row |
| AspirationsCard | 2 cols | 3 cols | 1 row |
| StudyCard | 2 cols | 1 col | 1 row |
| StretchingCard | 2 cols | 3 cols | 1 row |
| ProudOfCard | 2 cols | 4 cols | 2 rows |

## How CSS Grid Works

### Grid Lines vs Grid Tracks

CSS Grid uses **grid lines** (numbered starting at 1):
```
|    1    |    2    |    3    |    4    |    5    |
|  col-1  |  col-2  |  col-3  |  col-4  |
```

- 4 columns = 5 grid lines
- Columns are between lines 1-2, 2-3, 3-4, 4-5

### Column Span (`col-span-X`)

`col-span-2` means: "Start at the current position, span 2 columns"

**Example with 4-column grid:**
- `col-span-1` = 1 column wide (25% width)
- `col-span-2` = 2 columns wide (50% width)
- `col-span-3` = 3 columns wide (75% width)
- `col-span-4` = 4 columns wide (100% width)

### Row Span (`row-span-X`)

`row-span-2` means: "Start at the current position, span 2 rows"

**Important:** Row span determines **height**, not width.

## Grid Layout Patterns

### Pattern 1: Uniform Cards (2×2)
All cards are the same size:
```
┌─────────┬─────────┐
│  Card 1 │  Card 2 │
│  (2×2)  │  (2×2)  │
├─────────┼─────────┤
│  Card 3 │  Card 4 │
│  (2×2)  │  (2×2)  │
└─────────┴─────────┘
```
**Values:** `lg:col-span-2 lg:row-span-2` for all cards
**Grid:** `lg:grid-rows-4` (each card is 2 rows, so 4 cards = 8 rows needed)

### Pattern 2: Mixed Sizes (1×1 + 3×1)
Small card + Large card per row:
```
┌─────┬─────────────────┐
│ CV  │   Interests     │
│(1×1)│      (3×1)       │
├─────┼─────────────────┤
│Exp  │     Values       │
│(1×1)│      (3×1)       │
└─────┴─────────────────┘
```
**Values:** 
- Small: `lg:col-span-1 lg:row-span-1`
- Large: `lg:col-span-3 lg:row-span-1`

### Pattern 3: Full Width Hero + Grid
```
┌─────────────────────────────┐
│      IntroCard (4 cols)      │
│           (1 row)            │
├─────────┬───────────────────┤
│  Card 1  │     Card 2       │
│  (2×2)   │      (2×2)        │
└─────────┴───────────────────┘
```

## Calculating Grid Rows

The `grid-rows-X` value should accommodate all your content.

**Formula:**
```
Total rows needed = Sum of all row spans
```

**Example with current layout:**
- All cards use `row-span-1`
- You have 9 cards
- Each card needs 1 row
- But cards flow naturally, so you need fewer explicit rows if cards fit side-by-side

**Better approach:** Let CSS Grid auto-calculate rows:
```html
<!-- Remove lg:grid-rows-10, let it auto-calculate -->
class="... lg:grid-cols-4 ..."
```

Or calculate minimum:
- If cards are `row-span-1` and wrap naturally, grid-rows isn't critical
- If cards are `row-span-2`, you need at least: (number of rows of cards) × 2

## Responsive Breakpoints

### Tailwind Breakpoints
- `sm:` - ≥640px (small tablets)
- `md:` - ≥768px (tablets)
- `lg:` - ≥1024px (desktops)
- `xl:` - ≥1280px (large desktops)

### Current Behavior
- **Small (<768px):** Single column, auto-rows
- **Medium (768-1023px):** 2 columns, auto-rows
- **Large (≥1024px):** 4 columns, 10 explicit rows

## Configuration Examples

### Example 1: All Uniform Cards (2 cols × 2 rows)
```astro
<!-- Container -->
<main class="... lg:grid-cols-4 lg:grid-rows-8 ...">

<!-- Each card -->
<Card colSpan="md:col-span-2 lg:col-span-2" rowSpan="md:row-span-2 lg:row-span-2">
```
**Layout:** 2 cards per row, 2 rows tall each
**Grid rows needed:** 8 (4 rows of cards × 2 row-span = 8)

### Example 2: Small + Large Pattern
```astro
<!-- Container -->
<main class="... lg:grid-cols-4 ...">

<!-- Small card (1 col) -->
<Card colSpan="md:col-span-2 lg:col-span-1" rowSpan="md:row-span-1">

<!-- Large card (3 cols) -->
<Card colSpan="md:col-span-2 lg:col-span-3" rowSpan="md:row-span-1">
```
**Layout:** 1 small + 1 large per row
**Grid rows:** Auto-calculate based on content

### Example 3: Masonry/Staggered Layout
```astro
<!-- Container -->
<main class="... lg:grid-cols-4 ...">

<!-- Mixed heights -->
<Card colSpan="lg:col-span-2" rowSpan="lg:row-span-2"> <!-- Tall -->
<Card colSpan="lg:col-span-2" rowSpan="lg:row-span-1"> <!-- Short -->
<Card colSpan="lg:col-span-2" rowSpan="lg:row-span-1"> <!-- Short -->
<Card colSpan="lg:col-span-2" rowSpan="lg:row-span-2"> <!-- Tall -->
```

## Best Practices

### 1. Let Grid Auto-Calculate Rows When Possible
Instead of:
```html
lg:grid-rows-10
```

Use:
```html
<!-- No explicit rows, let it auto-calculate -->
lg:grid-cols-4
```

### 2. Ensure Column Spans Add Up Correctly
In a 4-column grid, cards in the same row should sum to 4:
- ✅ 1 + 3 = 4
- ✅ 2 + 2 = 4
- ✅ 4 alone = 4
- ❌ 1 + 2 = 3 (leaves 1 column empty)
- ❌ 3 + 3 = 6 (won't fit in 4 columns)

### 3. Use Consistent Row Heights for Uniform Look
If all cards should be the same height:
- Use the same `row-span` value for all cards
- Consider card content: text-heavy cards might need `row-span-2` or `row-span-3`

### 4. Account for Gaps
Your current setup has:
- `gap-2` (small screens)
- `md:gap-3` (medium)
- `lg:gap-4` (large)

Gaps are automatically handled by CSS Grid - they don't count toward column spans.

## Current Layout Analysis

### Your Current Setup
```
Row 1: [IntroCard - 4 cols]
Row 2: [CVCard - 1 col] [InterestsCard - 3 cols]
Row 3: [ExperienceCard - 1 col] [ValuesCard - 3 cols]
Row 4: [PersonalityCard - 1 col] [AspirationsCard - 3 cols]
Row 5: [StudyCard - 1 col] [StretchingCard - 3 cols]
Row 6: [ProudOfCard - 4 cols]
```

### Issues/Considerations

1. **Row Height:** All cards use `row-span-1`, which might create:
   - Tall narrow cards (1 col cards)
   - Wide short cards (3 col cards)
   - Height mismatch causing white space

2. **Grid Rows:** You have `lg:grid-rows-10` but only need ~6 rows with current layout
   - Can reduce to `lg:grid-rows-6` or remove entirely

3. **Visual Balance:** Consider making row heights match content:
   - PDF viewer in CVCard might need more height
   - Text lists might be fine with 1 row
   - Cards with badges might need different heights

## Quick Reference

| Desired Layout | Container | Card Values |
|----------------|-----------|-------------|
| 2×2 uniform | `lg:grid-cols-4 lg:grid-rows-8` | `lg:col-span-2 lg:row-span-2` |
| 1+3 pattern | `lg:grid-cols-4` | Small: `lg:col-span-1`, Large: `lg:col-span-3` |
| Full width top | `lg:grid-cols-4` | Top: `lg:col-span-4`, Others: `lg:col-span-2` |
| Auto rows | `lg:grid-cols-4` | Let CSS Grid calculate rows automatically |

## Recommendations for Your Site

### Option 1: Uniform Heights (Reduce White Space)
```astro
<!-- All cards -->
<Card colSpan="md:col-span-2 lg:col-span-2" rowSpan="md:row-span-2 lg:row-span-2">
<!-- Container -->
<main class="... lg:grid-cols-4 lg:grid-rows-8 ...">
```

### Option 2: Content-Aware Heights
```astro
<!-- Text-heavy cards: taller -->
<Card rowSpan="lg:row-span-2"> <!-- Values, Interests, etc. -->

<!-- Compact cards: shorter -->
<Card rowSpan="lg:row-span-1"> <!-- Study, Personality -->

<!-- CV with PDF: needs more height -->
<Card rowSpan="lg:row-span-3"> <!-- CVCard -->
```

### Option 3: Keep Current, Adjust Grid Rows
```astro
<!-- Reduce from 10 to 6 -->
<main class="... lg:grid-rows-6 ...">
<!-- Or remove entirely for auto-calculation -->
<main class="... lg:grid-cols-4 ...">
```

