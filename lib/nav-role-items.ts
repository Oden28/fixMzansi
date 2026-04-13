import type { AppSession } from '@/lib/server-session';

export type SidebarNavItem = { href: string; label: string };

export type SidebarNavSection = { id: string; title: string; items: SidebarNavItem[] };

/** Navigation visible in the app sidebar — strictly scoped by role (no cross-role items). */
export function getSidebarSectionsForRole(role: AppSession['role']): SidebarNavSection[] {
  if (role === 'consumer') {
    return [
      {
        id: 'workspace',
        title: 'Your workspace',
        items: [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/bookings', label: 'Bookings' },
          { href: '/notifications', label: 'Notifications' },
        ],
      },
      {
        id: 'marketplace',
        title: 'Marketplace',
        items: [
          { href: '/requests', label: 'Post a request' },
          { href: '/pros', label: 'Browse pros' },
          { href: '/how-it-works', label: 'How it works' },
        ],
      },
    ];
  }

  if (role === 'pro') {
    return [
      {
        id: 'workspace',
        title: 'Pro workspace',
        items: [
          { href: '/pro-dashboard', label: 'Overview' },
          { href: '/bookings', label: 'Bookings' },
          { href: '/notifications', label: 'Notifications' },
        ],
      },
      {
        id: 'marketplace',
        title: 'Marketplace',
        items: [
          { href: '/pros', label: 'Browse pros' },
          { href: '/how-it-works', label: 'How it works' },
        ],
      },
    ];
  }

  return [
    {
      id: 'operations',
      title: 'Operations',
      items: [
        { href: '/admin', label: 'Admin console' },
        { href: '/notifications', label: 'Notifications' },
      ],
    },
    {
      id: 'supply',
      title: 'Supply',
      items: [{ href: '/pros', label: 'Browse pros' }],
    },
  ];
}

export function roleLabel(role: AppSession['role']): string {
  if (role === 'consumer') return 'Customer';
  if (role === 'pro') return 'Pro';
  return 'Admin';
}
