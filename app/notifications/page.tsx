import ActionButton from '@/components/ActionButton';
import { requireUser } from '@/lib/auth';
import { readDb } from '@/lib/db';
import { formatDate } from '@/lib/format';

export default async function NotificationsPage() {
  const user = await requireUser();
  const db = await readDb();
  const notifications = db.notifications
    .filter((notification) => notification.userId === user.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <main className="page-shell mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel rounded-[2rem] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker text-sm uppercase tracking-[0.28em]">Notifications</p>
            <h1 className="mt-2 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>Recent platform updates</h1>
          </div>
          <ActionButton endpoint="/api/notifications/read-all" label="Mark all read" pendingLabel="Saving..." variant="secondary" />
        </div>

        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-[1.5rem] p-5 ${notification.isRead ? 'panel-muted' : 'panel-soft border border-emerald-300/50'}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{notification.title}</p>
                  <p className="text-muted mt-2">{notification.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-muted text-sm">{formatDate(notification.createdAt)}</p>
                  {!notification.isRead ? (
                    <ActionButton endpoint={`/api/notifications/${notification.id}/read`} label="Mark read" pendingLabel="Saving..." variant="secondary" />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
