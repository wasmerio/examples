/**
 * Dashboard Navigation Configuration
 *
 * @description
 * Defines the sidebar navigation structure for dashboard pages.
 * Supports nested navigation (up to 2 levels) and section headers.
 */

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name
  children?: DashboardNavItem[];
}

export interface DashboardNavSection {
  title?: string; // Optional section header
  items: DashboardNavItem[];
}

export const dashboardNavigation: DashboardNavSection[] = [
  {
    items: [
      {
        label: 'Overview',
        href: '/dashboard',
        icon: 'layout-dashboard',
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: 'folder',
      },
      {
        label: 'Team',
        href: '/dashboard/settings/team',
        icon: 'users',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: 'settings',
        children: [
          {
            label: 'Profile',
            href: '/dashboard/settings/profile',
            icon: 'user',
          },
          {
            label: 'Billing',
            href: '/dashboard/settings/billing',
            icon: 'credit-card',
          },
        ],
      },
    ],
  },
];
