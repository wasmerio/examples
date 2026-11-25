# Components

Guide for modifying and creating components.

## Card Components

All cards extend `BaseCard.astro` for consistent styling.

| Card | Location | Purpose |
|------|----------|---------|
| ProjectCard | `src/components/ProjectCard.astro` | Case study cards |
| ArticleCard | `src/components/ArticleCard.astro` | Blog post cards |
| DecisionCard | `src/components/DecisionCard.astro` | Decision log cards |
| TalkCard | `src/components/TalkCard.astro` | Speaking cards |

### Modifying ProjectCard

**Change displayed tech stack count:**

```astro
// Default shows 4 technologies
const displayTech = techStack.slice(0, 4);

// Change to show 6
const displayTech = techStack.slice(0, 6);
```

**Add a new visual element:**

```astro
<BaseCard href={`/projects/${slug}`} class="project-card">
  {featured && (
    <span slot="badge" class="featured-badge">...</span>
  )}
  
  <!-- Add company logo -->
  {company && (
    <img src={`/logos/${company}.svg`} alt={company} class="company-logo" />
  )}
  
  <Fragment slot="meta">{role} · {year}</Fragment>
  ...
</BaseCard>

<style>
  .company-logo {
    width: 24px;
    height: 24px;
    margin-bottom: 0.5rem;
  }
</style>
```

## Adding New Fields to Content

### Step 1: Update Schema

Edit `src/content.config.ts`:

```typescript
const projectsCollection = defineCollection({
  schema: z.object({
    // Existing fields...
    title: z.string(),
    role: z.string(),
    
    // Add new field
    company: z.string().optional(),
    teamSize: z.number().optional(),
  }),
});
```

### Step 2: Update Component

Edit the component that displays the content:

```astro
---
interface Props {
  title: string;
  role: string;
  company?: string;
  teamSize?: number;
}

const { title, role, company, teamSize } = Astro.props;
---

<BaseCard>
  <Fragment slot="meta">
    {role} · {year}
    {company && ` · ${company}`}
    {teamSize && ` · ${teamSize} engineers`}
  </Fragment>
</BaseCard>
```

### Step 3: Update Content Files

```yaml
---
title: "Payment System Rebuild"
role: "Lead Engineer"
company: "Acme Corp"
teamSize: 4
---
```

## Creating New Components

### Basic Structure

```astro
---
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
}

const { title, description, variant = 'default' } = Astro.props;
---

<div class:list={['component', variant]}>
  <h3 class="title">{title}</h3>
  {description && <p class="description">{description}</p>}
  <slot />
</div>

<style>
  .component {
    padding: var(--space-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius-md);
  }
  
  .component.compact {
    padding: var(--space-md);
  }
  
  @media (max-width: 640px) {
    .component {
      padding: var(--space-md);
    }
  }
</style>
```

### Using CSS Custom Properties

Always use theme variables for consistency:

```css
/* ✅ Good */
.card {
  background: var(--color-bg-secondary);
  color: var(--color-text);
  padding: var(--space-lg);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
}

/* ❌ Bad - hardcoded values */
.card {
  background: #111111;
  color: #e5e5e5;
  padding: 24px;
}
```

## Page Customization

### Home Page

Edit `src/pages/index.astro`:
- Hero section text and CTAs
- Featured projects display
- Introduction content

### Contact Page

Edit `src/pages/contact.astro`:
- Contact messaging
- Response time expectations

### Navigation

Edit `src/components/Navigation.astro` for style changes.
Edit `src/config.ts` for navigation items.

### Footer

Edit `src/components/Footer.astro` for footer content.

## Adding New Pages

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SEO from '../components/SEO.astro';
---

<BaseLayout>
  <SEO 
    slot="head"
    title="Page Title" 
    description="Page description" 
  />
  
  <main class="page-content">
    <!-- Your content -->
  </main>
</BaseLayout>

<style>
  .page-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
</style>
```

**SEO Component Props:**
- `title` — Page title (automatically suffixed with author name)
- `description` — Meta description
- `type` — Open Graph type: `website` | `article` | `profile`
- `noSuffix` — Skip adding site name suffix (useful for homepage)

## Removing Sections

1. Remove from navigation in `src/config.ts`
2. Delete the page file (e.g., `src/pages/speaking.astro`)
3. Delete the content folder (e.g., `src/content/speaking/`)
4. Remove the collection from `src/content.config.ts`
