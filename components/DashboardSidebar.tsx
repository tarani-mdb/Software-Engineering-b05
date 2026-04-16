'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SafeUser } from '@/lib/types';

function linksForRole(user: SafeUser) {
  if (user.role === 'donor') {
    return [
      { href: '/dashboard/donor', label: 'Overview' },
      { href: '/dashboard/donor/listings', label: 'My Listings' },
      { href: '/dashboard/donor/listings/new', label: 'Post Donation' },
      { href: '/dashboard/donor/impact', label: 'Impact' },
      { href: '/notifications', label: 'Notifications' },
      { href: '/profile', label: 'Profile' },
    ];
  }

  if (user.role === 'admin') {
    return [
      { href: '/dashboard/admin', label: 'Overview' },
      { href: '/dashboard/admin/ngo-verification', label: 'NGO Verification' },
      { href: '/dashboard/admin/users', label: 'Users' },
      { href: '/dashboard/admin/listings', label: 'Listings' },
      { href: '/dashboard/admin/pickups', label: 'Pickups' },
      { href: '/dashboard/admin/reports', label: 'Reports' },
      { href: '/notifications', label: 'Notifications' },
    ];
  }

  return [
    { href: '/dashboard/ngo', label: 'Overview' },
    { href: '/dashboard/ngo/listings', label: 'Browse Listings' },
    { href: '/dashboard/ngo/pickups', label: 'My Pickups' },
    { href: '/dashboard/ngo/impact', label: 'Impact' },
    { href: '/notifications', label: 'Notifications' },
    { href: '/profile', label: 'Profile' },
  ];
}

export default function DashboardSidebar({ user }: { user: SafeUser }) {
  const pathname = usePathname();
  const links = linksForRole(user);

  return (
    <aside className="panel-soft rounded-[2rem] p-5">
      <div className="hero-panel mb-6 rounded-[1.5rem] px-4 py-5 text-emerald-50">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Signed in as</p>
        <h2 className="mt-2 text-lg font-semibold">{user.ngoName ?? user.name}</h2>
        <p className="mt-1 text-sm text-emerald-200">{user.role.toUpperCase()}</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? 'btn-primary text-white shadow-sm'
                  : 'hover:bg-white/40'
              }`}
              style={active ? undefined : { color: 'var(--foreground)' }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
