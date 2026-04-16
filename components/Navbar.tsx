import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { readDb } from '@/lib/db';
import LogoutButton from '@/components/LogoutButton';
import ThemeToggle from '@/components/ThemeToggle';

export default async function Navbar() {
  const user = await getCurrentUser();
  const db = user ? await readDb() : null;
  const unreadCount = user
    ? db?.notifications.filter((notification) => notification.userId === user.id && !notification.isRead).length ?? 0
    : 0;

  return (
    <nav className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="btn-primary flex h-11 w-11 items-center justify-center rounded-2xl text-xl shadow-sm">
              F
            </div>
            <div>
              <span className="section-kicker block text-xs uppercase tracking-[0.3em]">Waste Food</span>
              <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Manager</span>
            </div>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="btn-secondary px-4 py-2 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/notifications"
              className="btn-secondary px-4 py-2 text-sm"
            >
              Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
            </Link>
            <div className="panel-soft hidden rounded-full px-4 py-2 text-sm font-medium md:block" style={{ color: 'var(--foreground)' }}>
              {user.ngoName ?? user.name}
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="btn-ghost px-4 py-2 text-sm"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary px-5 py-2 text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
