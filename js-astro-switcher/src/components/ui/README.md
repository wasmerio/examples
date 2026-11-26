# Component Library

A production-ready, theme-aware component library built for Astro Theme Switcher. All components use semantic design tokens and work seamlessly across all themes.

## Principles

- ✅ **No hardcoded colors** - All colors use semantic tokens (`--token-color-*`)
- ✅ **Variants map to semantic tokens** - Component variants use theme tokens
- ✅ **Motion uses motion tokens** - All animations use `--token-motion-*` tokens
- ✅ **Accessible by default** - ARIA attributes, keyboard navigation, focus states
- ✅ **Works across all themes** - Components adapt to any theme automatically

## Components

### Button

A versatile button component with multiple variants and sizes.

```astro
---
import Button from '@/components/ui/Button.astro';
---

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" href="/about">Learn More</Button>
<Button variant="outline" size="lg">Get Started</Button>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `success`, `warning`, `error`  
**Sizes:** `sm`, `md`, `lg`

### Card

A container component with elevation variants.

```astro
---
import Card from '@/components/ui/Card.astro';
---

<Card variant="elevated" padding="lg">
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

**Variants:** `default`, `elevated`, `outlined`  
**Padding:** `none`, `sm`, `md`, `lg`

### Alert

An alert component for notifications and messages.

```astro
---
import Alert from '@/components/ui/Alert.astro';
---

<Alert variant="success" title="Success!" dismissible>
  Your changes have been saved.
</Alert>
```

**Variants:** `success`, `warning`, `error`, `info`

### Badge

A badge component for labels and status indicators.

```astro
---
import Badge from '@/components/ui/Badge.astro';
---

<Badge variant="primary" size="md">New</Badge>
<Badge variant="success">Active</Badge>
```

**Variants:** `default`, `primary`, `success`, `warning`, `error`, `info`  
**Sizes:** `sm`, `md`, `lg`

### Input

A form input component with error states and accessibility.

```astro
---
import Input from '@/components/ui/Input.astro';
---

<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  required
  error="Please enter a valid email"
/>
```

**Types:** `text`, `email`, `password`, `number`, `tel`, `url`, `search`

### Navbar

A navigation bar component (example/wrapper).

```astro
---
import Navbar from '@/components/ui/Navbar.astro';
---

<Navbar
  brand="My Site"
  items={[
    { label: 'Home', href: '/', current: true },
    { label: 'About', href: '/about' },
  ]}
/>
```

### Footer

A footer component (example/wrapper).

```astro
---
import Footer from '@/components/ui/Footer.astro';
---

<Footer
  brand="My Site"
  description="A description of the site"
  sections={[
    {
      title: 'Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
    },
  ]}
/>
```

### Hero

A hero section component.

```astro
---
import Hero from '@/components/ui/Hero.astro';
---

<Hero
  title="Build Something Amazing"
  subtitle="A production-ready themeable design system"
  primaryCta={{ text: 'Get Started', href: '/start' }}
  secondaryCta={{ text: 'Learn More', href: '/about' }}
/>
```

### PricingTable

A pricing table component.

```astro
---
import PricingTable from '@/components/ui/PricingTable.astro';
---

<PricingTable
  plans={[
    {
      name: 'Basic',
      price: '$9',
      period: 'month',
      description: 'Perfect for getting started',
      features: ['Feature 1', 'Feature 2'],
      cta: { text: 'Get Started', href: '/signup', variant: 'primary' },
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'month',
      description: 'For professionals',
      features: ['All Basic features', 'Feature 3', 'Feature 4'],
      cta: { text: 'Get Started', href: '/signup', variant: 'primary' },
      popular: true,
    },
  ]}
/>
```

### Modal

A modal/dialog component for displaying content, forms, and confirmations.

```astro
---
import Modal from '@/components/ui/Modal.astro';
import Button from '@/components/ui/Button.astro';
---

<Button onclick="openModal('my-modal')">Open Modal</Button>

<Modal id="my-modal" title="Example Modal" size="md">
  <p>Modal content goes here.</p>
</Modal>
```

**Sizes:** `sm`, `md`, `lg`, `xl`, `fullscreen`  
**Variants:** `default`, `alert`, `form`

### Toast

A toast notification component for user feedback.

```astro
---
import ToastContainer, { toast } from '@/components/ui/ToastContainer.tsx';
import Button from '@/components/ui/Button.astro';
---

<Button onclick="toast({ message: 'Success!', variant: 'success' })">
  Show Toast
</Button>

<ToastContainer client:load />
```

**Variants:** `success`, `error`, `warning`, `info`  
**Positions:** `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`

### Accordion

An accordion component for collapsible content sections.

```astro
---
import Accordion from '@/components/ui/Accordion.astro';
---

<Accordion
  client:load
  items={[
    {
      id: 'item-1',
      title: 'Question 1?',
      content: 'Answer to question 1.',
    },
    {
      id: 'item-2',
      title: 'Question 2?',
      content: 'Answer to question 2.',
    },
  ]}
  allowMultiple={false}
  variant="default"
/>
```

**Variants:** `default`, `bordered`, `flush`  
**Options:** `allowMultiple` - Allow multiple items open at once

### Tabs

A tabs component for organizing content.

```astro
---
import Tabs from '@/components/ui/Tabs.astro';
---

<Tabs
  client:load
  items={[
    {
      id: 'tab-1',
      label: 'Tab One',
      content: '<p>Content for tab one.</p>',
    },
    {
      id: 'tab-2',
      label: 'Tab Two',
      content: '<p>Content for tab two.</p>',
    },
  ]}
  variant="default"
  orientation="horizontal"
/>
```

**Variants:** `default`, `pills`, `underlined`  
**Orientations:** `horizontal`, `vertical`

### DataTable

A data table component with sorting, filtering, and pagination.

```astro
---
import DataTable from '@/components/ui/DataTable.astro';
---

<DataTable
  client:load
  data={[
    { name: 'John', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane', email: 'jane@example.com', role: 'User' },
  ]}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ]}
  searchable={true}
  sortable={true}
  pagination={true}
/>
```

**Features:** Searchable, sortable columns, pagination, responsive

## Usage

All components automatically adapt to the current theme. Simply switch themes and components will update their colors, shadows, and motion accordingly.

```astro
---
import { Button, Card, Alert, Modal, Accordion, Tabs, DataTable } from '@/components/ui';
import { ToastContainer, toast } from '@/components/ui/ToastContainer.tsx';
---

<Card variant="elevated">
  <Alert variant="info">This is an info alert</Alert>
  <Button variant="primary" onclick="toast({ message: 'Clicked!', variant: 'success' })">
    Action
  </Button>
</Card>

<ToastContainer client:load />
```

## Token Reference

Components use these semantic tokens:

- **Colors:** `--token-color-primary`, `--token-color-background`, `--token-color-text-primary`, etc.
- **Motion:** `--token-motion-duration-*`, `--token-motion-easing-*`
- **Radius:** `--token-radius-*`
- **Shadow:** `--token-shadow-*`

See `src/themes/types.ts` for the complete token system.
