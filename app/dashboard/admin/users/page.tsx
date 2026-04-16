import ActionButton from '@/components/ActionButton';
import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';
import { formatDate } from '@/lib/format';

export default async function AdminUsersPage() {
  await requireRole(['admin']);
  const db = await readDb();

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">User management</p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-900">All registered users</h1>
      <div className="mt-6 space-y-4">
        {db.users.map((user) => (
          <div key={user.id} className="grid gap-4 rounded-[1.5rem] border border-stone-200 p-5 lg:grid-cols-[1.2fr_0.7fr_0.6fr_0.7fr_0.7fr]">
            <div>
              <p className="font-semibold text-stone-900">{user.ngoName ?? user.name}</p>
              <p className="mt-1 text-sm text-stone-600">{user.email}</p>
            </div>
            <div className="text-sm text-stone-600">
              <p className="font-semibold text-stone-900 capitalize">{user.role}</p>
              <p>{user.city}, {user.state}</p>
            </div>
            <div className="text-sm text-stone-600 capitalize">{user.verificationStatus}</div>
            <div className="text-sm text-stone-600">{formatDate(user.createdAt)}</div>
            <div>
              <ActionButton
                endpoint={`/api/admin/users/${user.id}/toggle-active`}
                label={user.isActive ? 'Deactivate' : 'Activate'}
                pendingLabel="Saving..."
                variant={user.isActive ? 'danger' : 'primary'}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
