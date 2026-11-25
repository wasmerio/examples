# Dashboard

The Virex theme includes a comprehensive dashboard layout system that provides authenticated page layouts with sidebar navigation, reusable components, and example pages. This feature differentiates the theme from competitors by offering more than just marketing pages - it provides a complete foundation for building SaaS application interfaces.

## Introduction

### What's Included

The dashboard system provides:

- **Complete Layout Shell**: Responsive sidebar navigation, top navigation bar, and content area
- **15 Reusable Components**: StatCard, DataTable, Card, Modal, Toast, Chart, and more
- **4 Example Pages**: Overview, Settings (Profile, Team, Billing), and Projects (List, Detail)
- **Sample Data**: Realistic but fictional data for demonstration purposes
- **Theme Support**: Full light/dark mode support consistent with marketing pages
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### Important Notes

⚠️ **Authentication Not Included**: The dashboard pages are starting points that demonstrate UI patterns. You must implement your own authentication system. See the [Authentication](#authentication) section for guidance.

⚠️ **Sample Data Only**: All dashboard pages use placeholder data from `src/lib/dashboard-data.ts`. You'll need to replace this with real API calls for production use.

⚠️ **Starting Point**: These components and pages are designed to be customized and extended for your specific needs. They demonstrate common SaaS patterns but are not complete applications.

## Getting Started

### Accessing Dashboard Pages

The dashboard is available at the following routes:

- `/dashboard` - Overview page with metrics and charts
- `/dashboard/settings/profile` - User profile settings
- `/dashboard/settings/team` - Team management
- `/dashboard/settings/billing` - Billing information
- `/dashboard/projects` - Projects list
- `/dashboard/projects/[id]` - Project detail/edit

### Path Aliases

The dashboard components use convenient path aliases for cleaner imports:

- `@dashboard/*` - Dashboard layout components (Sidebar, TopNav, etc.)
- `@dashboard-ui/*` - Reusable dashboard UI components (StatCard, DataTable, etc.)
- `@layout/*` - Page layouts (DashboardLayout, BaseLayout, etc.)
- `@/*` - Any file in src directory

**Example:**
```astro
// Instead of relative paths
import DashboardLayout from '../../layouts/DashboardLayout.astro';
import Card from '../../components/dashboard-ui/Card.astro';

// Use path aliases
import DashboardLayout from '@/layouts/DashboardLayout.astro';
import Card from '@dashboard-ui/Card.astro';
```

### Quick Example

Here's how to create a new dashboard page:

```astro
---
// src/pages/dashboard/my-page.astro
import DashboardLayout from '@/layouts/DashboardLayout.astro';
import Card from '@dashboard-ui/Card.astro';

const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Page' }
];
---

<DashboardLayout
  title="My Page"
  description="Description for SEO"
  breadcrumbs={breadcrumbs}
>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">My Page</h1>
      <button class="btn btn-primary">Action</button>
    </div>

    <Card title="Content Section">
      <p>Your content here</p>
    </Card>
  </div>
</DashboardLayout>
```

## Layout System

### DashboardLayout

The main layout component that wraps all dashboard pages.

**Props:**
```typescript
interface Props {
  title: string;           // Page title for SEO
  description: string;     // Meta description
  breadcrumbs?: Array<{    // Optional breadcrumb navigation
    label: string;
    href?: string;         // Last item typically has no href
  }>;
}
```

**Usage:**
```astro
<DashboardLayout
  title="Dashboard Overview"
  description="View your key metrics and recent activity"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Overview' }
  ]}
>
  <!-- Your page content -->
</DashboardLayout>
```

### DashboardShell

The shell component provides the dashboard structure with sidebar, top navigation, and content area. It's automatically included by `DashboardLayout` and manages:

- Sidebar collapse state (persisted in localStorage)
- Mobile navigation drawer
- Responsive breakpoints (768px for mobile)
- Breadcrumb rendering

You typically don't use this component directly - use `DashboardLayout` instead.

### Responsive Behavior

The dashboard adapts to different screen sizes:

**Desktop (≥ 1024px)**:
- Persistent sidebar (256px expanded, 64px collapsed)
- Full top navigation
- Multi-column layouts

**Tablet (768px - 1023px)**:
- Collapsed sidebar by default
- Expands on hover
- Adjusted spacing

**Mobile (< 768px)**:
- Hidden sidebar
- Hamburger menu button
- Slide-in drawer navigation
- Single column layouts
- Horizontal scroll for tables

## Navigation

### Sidebar Navigation

The sidebar provides the main navigation for dashboard pages. It supports:

- **Nested Navigation**: Up to 2 levels deep
- **Active Highlighting**: Current page is highlighted
- **Collapse/Expand**: Icon-only mode with hover expansion
- **Section Headers**: Group related items
- **Icons**: All items have Lucide icons

### Customizing Navigation

Edit `src/config/dashboard-navigation.ts` to customize the sidebar menu:

```typescript
export const dashboardNavigation: DashboardNavSection[] = [
  {
    // Section without header
    items: [
      {
        label: 'Overview',
        href: '/dashboard',
        icon: 'layout-dashboard',
      },
    ],
  },
  {
    // Section with header
    title: 'Management',
    items: [
      {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: 'folder',
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: 'settings',
        // Nested items
        children: [
          {
            label: 'Profile',
            href: '/dashboard/settings/profile',
            icon: 'user',
          },
        ],
      },
    ],
  },
];
```

### Mobile Navigation

On mobile devices (< 768px), the sidebar is replaced with a slide-in drawer that:

- Opens via hamburger button in top navigation
- Closes on backdrop click or navigation
- Uses the same navigation structure as desktop
- Includes smooth transitions

### Top Navigation

The top navigation bar includes:

- **Search Input**: Placeholder for search functionality
- **Notifications**: Button with badge indicator
- **Theme Toggle**: Switch between light/dark mode
- **User Menu**: Dropdown with profile, settings, and logout links
- **Hamburger Menu**: Mobile-only button to open drawer

### Breadcrumbs

Breadcrumbs show the page hierarchy and are passed via the `breadcrumbs` prop:

```astro
<DashboardLayout
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/dashboard/projects' },
    { label: 'Project Name' } // Current page, no href
  ]}
>
```

## Components Reference

### StatCard

Display key metrics with trend indicators.

**Props:**
```typescript
interface Props {
  title: string;
  value: string | number;
  trend?: {
    value: number;      // Percentage
    direction: 'up' | 'down';
  };
  icon?: string;        // Lucide icon name
  description?: string;
}
```

**Example:**
```astro
<StatCard
  title="Total Users"
  value="1,234"
  trend={{ value: 12, direction: 'up' }}
  icon="users"
  description="+12% from last month"
/>
```

**Import:**
```astro
import StatCard from '@dashboard-ui/StatCard.astro';
```

### DataTable

Table component with sorting, pagination, and actions.

**Props:**
```typescript
interface Props {
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
  data: Array<Record<string, any>>;
  actions?: Array<{
    label: string;
    onClick: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  emptyMessage?: string;
}
```

**Example:**
```astro
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
  ]}
  data={teamMembers}
  actions={[
    { label: 'Edit', onClick: 'editMember', variant: 'secondary' },
    { label: 'Remove', onClick: 'removeMember', variant: 'danger' },
  ]}
  emptyMessage="No team members found"
/>
```

**Import:**
```astro
import DataTable from '@dashboard-ui/DataTable.astro';
```

### Card

Generic content card for dashboard sections.

**Props:**
```typescript
interface Props {
  title?: string;
  description?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  noBorder?: boolean;
}
```

**Example:**
```astro
<Card title="User Information" description="Update your profile details">
  <form>
    <!-- Form fields -->
  </form>
</Card>
```

**Import:**
```astro
import Card from '@dashboard-ui/Card.astro';
```

### Modal

Dialog/modal component for confirmations and forms.

**Props:**
```typescript
interface Props {
  id: string;           // Unique identifier
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Example:**
```astro
<Modal id="confirm-delete" title="Confirm Deletion" size="sm">
  <p>Are you sure you want to delete this item?</p>
  <div slot="footer">
    <button class="btn btn-secondary" onclick="closeModal('confirm-delete')">
      Cancel
    </button>
    <button class="btn btn-danger" onclick="confirmDelete()">
      Delete
    </button>
  </div>
</Modal>

<script>
  function closeModal(id) {
    document.getElementById(id)?.classList.add('hidden');
  }
</script>
```

**Import:**
```astro
import Modal from '@dashboard-ui/Modal.astro';
```

### Toast

Notification toast for user feedback.

**JavaScript API:**
```typescript
window.showToast({
  message: string,
  variant: 'success' | 'error' | 'warning' | 'info',
  duration?: number  // milliseconds, default 5000
});
```

**Example:**
```astro
<Toast />

<script>
  function saveChanges() {
    // Save logic...
    window.showToast({
      message: 'Changes saved successfully',
      variant: 'success'
    });
  }
</script>
```

**Import:**
```astro
import Toast from '@dashboard-ui/Toast.astro';
```

### Chart

Chart visualization wrapper using Chart.js.

**Props:**
```typescript
interface Props {
  type: 'line' | 'bar' | 'area';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      color?: string;
    }>;
  };
  height?: number;  // Default 300px
}
```

**Example:**
```astro
<Chart
  type="line"
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Projects Created',
      data: [3, 5, 2, 8, 4, 6, 7]
    }]
  }}
  height={300}
/>
```

**Import:**
```astro
import Chart from '@dashboard-ui/Chart.astro';
```

### EmptyState

Placeholder for empty data states.

**Props:**
```typescript
interface Props {
  icon?: string;        // Lucide icon name
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}
```

**Example:**
```astro
<EmptyState
  icon="folder"
  title="No projects yet"
  description="Get started by creating your first project"
  actionLabel="Create Project"
  actionHref="/dashboard/projects/new"
/>
```

**Import:**
```astro
import EmptyState from '@dashboard-ui/EmptyState.astro';
```

### LoadingSkeleton

Loading state component with shimmer effect.

**Props:**
```typescript
interface Props {
  variant: 'card' | 'table' | 'text' | 'stat';
  count?: number;  // Number of skeleton items
}
```

**Example:**
```astro
{loading ? (
  <LoadingSkeleton variant="stat" count={4} />
) : (
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {metrics.map(metric => <StatCard {...metric} />)}
  </div>
)}
```

**Import:**
```astro
import LoadingSkeleton from '@dashboard-ui/LoadingSkeleton.astro';
```

## Example Pages

### Overview Page

**Route**: `/dashboard`

Displays key metrics and analytics:
- 4 StatCards in responsive grid
- Line chart showing 7-day trend
- Recent activity section

**Key Features**:
- Responsive grid layout (2x2 desktop, 1 column mobile)
- Sample metrics with trend indicators
- Chart visualization

### Settings Pages

**Routes**:
- `/dashboard/settings/profile` - User profile form
- `/dashboard/settings/team` - Team member management
- `/dashboard/settings/billing` - Billing information

**Profile Settings**:
- User information form (name, email, bio)
- Avatar upload placeholder
- Password change section

**Team Settings**:
- DataTable with team members
- Invite member button
- Member management actions

**Billing Settings**:
- Current plan information
- Payment method display
- Billing history table

### Projects Pages

**Routes**:
- `/dashboard/projects` - Projects list
- `/dashboard/projects/[id]` - Project detail/edit

**Projects List**:
- DataTable with search/filter
- Pagination (10 items per page)
- "New Project" button
- Status badges

**Project Detail**:
- Edit form with validation
- Readonly fields (created, updated dates)
- Delete button in danger zone

## Customization

### Adding New Dashboard Pages

1. Create a new file in `src/pages/dashboard/`:

```astro
---
// src/pages/dashboard/analytics.astro
import DashboardLayout from '@/layouts/DashboardLayout.astro';
import Card from '@dashboard-ui/Card.astro';

const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics' }
];
---

<DashboardLayout
  title="Analytics"
  description="View detailed analytics"
  breadcrumbs={breadcrumbs}
>
  <h1 class="text-3xl font-bold mb-6">Analytics</h1>
  <Card>
    <!-- Your content -->
  </Card>
</DashboardLayout>
```

2. Add to navigation in `src/config/dashboard-navigation.ts`:

```typescript
{
  label: 'Analytics',
  href: '/dashboard/analytics',
  icon: 'bar-chart',
}
```

### Customizing Components

All dashboard components can be customized by:

1. **Modifying Styles**: Edit component files in `src/components/dashboard/` and `src/components/dashboard-ui/`
2. **Extending Props**: Add new props to component interfaces
3. **Creating Variants**: Copy and modify components for specific use cases

Example - Custom StatCard variant:

```astro
---
// src/components/dashboard-ui/StatCardLarge.astro
import StatCard from '@dashboard-ui/StatCard.astro';

interface Props {
  title: string;
  value: string | number;
  // ... other props
}

const { title, value, ...rest } = Astro.props;
---

<div class="col-span-2">
  <StatCard title={title} value={value} {...rest} />
</div>
```

### Customizing Sample Data

Replace functions in `src/lib/dashboard-data.ts`:

```typescript
// Before (sample data)
export function getProjects(): Project[] {
  return [
    { id: '1', name: 'Sample Project', ... },
    // ...
  ];
}

// After (real API)
export async function getProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects');
  return response.json();
}
```

Then update your pages to handle async data:

```astro
---
const projects = await getProjects();
---
```

## Styling and Theming

### Color Tokens

The dashboard uses the same color system as marketing pages:

```css
/* Light Mode */
--color-background: oklch(1 0 0);
--color-surface: oklch(0.98 0 0);
--color-text: oklch(0.15 0 0);
--color-text-muted: oklch(0.45 0 0);
--color-border: oklch(0.9 0 0);
--color-primary: oklch(0.55 0.2 265);

/* Dark Mode */
--color-background: oklch(0.15 0 0);
--color-surface: oklch(0.2 0 0);
--color-text: oklch(0.95 0 0);
--color-text-muted: oklch(0.65 0 0);
--color-border: oklch(0.3 0 0);
```

### Status Colors

Additional colors for dashboard components:

```css
/* Status Colors */
--color-success: oklch(0.65 0.2 145);
--color-warning: oklch(0.75 0.2 85);
--color-error: oklch(0.6 0.25 25);
--color-info: oklch(0.6 0.2 240);
```

### Customizing Theme

To customize the dashboard theme:

1. **Edit Color Tokens** in `src/styles/global.css`:

```css
@theme {
  --color-primary: oklch(0.55 0.2 265); /* Change primary color */
  --color-success: oklch(0.65 0.2 145); /* Change success color */
}
```

2. **Modify Component Styles**: Edit individual component files to change specific styling

3. **Add Custom Utilities**: Add Tailwind utilities in `tailwind.config.mjs`

### Dark Mode

The dashboard automatically supports dark mode through the theme toggle. All components use CSS variables that adapt to the current theme.

To test dark mode:
- Click the theme toggle in the top navigation
- Or use system preference detection

## Authentication

### Important: No Authentication Included

The dashboard pages are UI demonstrations only. You must implement your own authentication system.

### Recommended Approach

1. **Choose an Auth Provider**:
   - [Supabase](https://supabase.com/) - Open source Firebase alternative
   - [Auth0](https://auth0.com/) - Enterprise auth platform
   - [Clerk](https://clerk.com/) - Modern auth for React/Next.js
   - Custom solution with JWT tokens

2. **Implement Middleware** to protect dashboard routes:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const session = context.cookies.get('session');
    
    if (!session) {
      return context.redirect('/login');
    }
    
    // Verify session and attach user to context
    const user = await verifySession(session.value);
    if (!user) {
      return context.redirect('/login');
    }
    
    context.locals.user = user;
  }
  
  return next();
});
```

3. **Update Components** to use real user data:

```astro
---
// src/components/dashboard/UserMenu.astro
const user = Astro.locals.user || {
  name: 'Demo User',
  email: 'demo@example.com'
};
---

<div class="user-menu">
  <span>{user.name}</span>
  <span class="text-sm text-text-muted">{user.email}</span>
</div>
```

### Session Management

Implement session management based on your auth provider:

```typescript
// Example with JWT
import jwt from 'jsonwebtoken';

export async function verifySession(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}
```

### Logout Functionality

Implement logout by clearing the session:

```astro
---
// src/pages/api/logout.ts
export async function POST({ cookies, redirect }) {
  cookies.delete('session', { path: '/' });
  return redirect('/login');
}
---
```

Update the logout link in UserMenu:

```astro
<form action="/api/logout" method="POST">
  <button type="submit">Logout</button>
</form>
```

## Sample Data

### Data Structure

Sample data is provided in `src/lib/dashboard-data.ts`:

```typescript
// Projects
export function getProjects(): Project[] {
  return [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      owner: 'Sarah Mitchell'
    },
    // ...
  ];
}

// Team Members
export function getTeamMembers(): TeamMember[] {
  return [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@virex.com',
      role: 'owner',
      joinedAt: new Date('2023-01-15')
    },
    // ...
  ];
}

// Metrics
export function getMetrics(): Metric[] {
  return [
    {
      title: 'Total Projects',
      value: '24',
      trend: { value: 12, direction: 'up' },
      icon: 'folder'
    },
    // ...
  ];
}
```

### Replacing with Real Data

To connect to real APIs:

1. **Make Functions Async**:

```typescript
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}
```

2. **Update Pages**:

```astro
---
const projects = await getProjects();
---
```

3. **Add Error Handling**:

```typescript
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}
```

### API Integration Patterns

**REST API Example**:

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.PUBLIC_API_URL;

export async function fetchProjects(token: string) {
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function createProject(token: string, data: ProjectInput) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}
```

**GraphQL Example**:

```typescript
// src/lib/graphql.ts
export async function queryProjects(token: string) {
  const response = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query GetProjects {
          projects {
            id
            name
            status
            createdAt
          }
        }
      `
    })
  });
  
  const { data } = await response.json();
  return data.projects;
}
```

## Best Practices

### Accessibility

**Keyboard Navigation**:
- All interactive elements are keyboard accessible
- Tab through navigation items
- Enter/Space to activate links and buttons
- ESC to close modals and dropdowns
- Arrow keys for nested navigation

**Screen Readers**:
- Use semantic HTML (`<nav>`, `<main>`, `<aside>`)
- Add ARIA labels to icon buttons
- Include skip links for main content
- Use live regions for toast notifications
- Provide alternative text for charts

**Focus Management**:
- Visible focus indicators on all interactive elements
- Logical tab order following visual layout
- Focus trap in modals when open
- Return focus to trigger element when closing

**Color Contrast**:
- All text meets WCAG AA standards (4.5:1 ratio)
- Status colors have sufficient contrast
- Test in both light and dark modes

### Performance

**Code Splitting**:
- Chart.js loaded only on pages that use charts
- Use Astro's `client:*` directives appropriately
- Lazy load images with `loading="lazy"`

**Optimize Images**:
- Use Astro's Image component for avatars
- Provide appropriate sizes and formats
- Use fallback initials when no image

**Minimize JavaScript**:
- Progressive enhancement approach
- Core functionality works without JS
- Enhanced interactions with JS
- Keep client-side state minimal

### Security

**Input Validation**:
- Validate all form inputs client-side and server-side
- Sanitize user input before display
- Use prepared statements for database queries

**Authentication**:
- Use secure session management
- Implement CSRF protection
- Set secure cookie flags
- Use HTTPS in production

**API Security**:
- Validate authentication tokens
- Implement rate limiting
- Use CORS appropriately
- Never expose sensitive data in client code

### SEO for Dashboard Pages

**Meta Tags**:
- Use descriptive titles for each page
- Add meta descriptions
- Use `noindex` for authenticated pages if needed

**Example**:
```astro
<DashboardLayout
  title="Project Settings - Virex Dashboard"
  description="Manage your project settings and configuration"
>
```

### Code Organization

**Component Structure**:
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Add JSDoc comments for documentation
- Follow existing naming conventions

**File Organization**:
- Dashboard components in `src/components/dashboard/`
- Reusable UI in `src/components/dashboard-ui/`
- Pages in `src/pages/dashboard/`
- Configuration in `src/config/`
- Utilities in `src/lib/`

### Testing

**Manual Testing Checklist**:
- [ ] Test all pages in light and dark mode
- [ ] Verify responsive behavior on mobile, tablet, desktop
- [ ] Test keyboard navigation throughout
- [ ] Verify screen reader announcements
- [ ] Test form validation
- [ ] Check loading states
- [ ] Verify empty states
- [ ] Test error handling

**Automated Testing** (recommended):
- Unit tests for utility functions
- Component tests for UI components
- E2E tests for critical user flows
- Accessibility tests with axe-core

### Common Patterns

**Loading States**:
```astro
{loading ? (
  <LoadingSkeleton variant="table" />
) : data.length > 0 ? (
  <DataTable columns={columns} data={data} />
) : (
  <EmptyState title="No data" />
)}
```

**Error Handling**:
```astro
{error ? (
  <div class="p-4 rounded-md bg-error/10 border border-error">
    <p class="text-error font-medium">{error.message}</p>
    <button onclick="retry()">Retry</button>
  </div>
) : (
  <!-- Normal content -->
)}
```

**Form Submission**:
```astro
<form onsubmit="handleSubmit(event)">
  <!-- Form fields -->
  <button type="submit">Save Changes</button>
</form>

<script>
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        window.showToast({
          message: 'Changes saved successfully',
          variant: 'success'
        });
      }
    } catch (error) {
      window.showToast({
        message: 'Failed to save changes',
        variant: 'error'
      });
    }
  }
</script>
```

## Troubleshooting

### Sidebar Not Collapsing

Check that localStorage is available and not blocked:

```javascript
// Test in browser console
localStorage.setItem('test', 'value');
localStorage.getItem('test');
```

### Charts Not Rendering

Ensure Chart.js is installed:

```bash
npm install chart.js
```

Verify the Chart component has `client:load` directive.

### Navigation Not Highlighting Active Page

Check that the `href` in navigation config matches the current pathname exactly:

```typescript
// Correct
{ label: 'Projects', href: '/dashboard/projects' }

// Incorrect (missing leading slash)
{ label: 'Projects', href: 'dashboard/projects' }
```

### Dark Mode Not Working

Verify the theme toggle is present and the global CSS includes dark mode variables.

### Mobile Navigation Not Opening

Check that the mobile nav component has the `client:load` directive and JavaScript is enabled.

## Next Steps

Now that you understand the dashboard system:

1. **Implement Authentication**: Follow the [Authentication](#authentication) section to protect your dashboard routes
2. **Connect Real Data**: Replace sample data with API calls in `src/lib/dashboard-data.ts`
3. **Customize Navigation**: Edit `src/config/dashboard-navigation.ts` to match your app structure
4. **Add New Pages**: Create additional dashboard pages for your specific needs
5. **Extend Components**: Customize existing components or create new ones
6. **Add Business Logic**: Implement your application's specific functionality
