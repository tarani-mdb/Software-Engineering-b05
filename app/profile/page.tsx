import { requireUser } from '@/lib/auth';

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <main className="page-shell mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel rounded-[2rem] p-8">
        <p className="section-kicker text-sm uppercase tracking-[0.28em]">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>{user.ngoName ?? user.name}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="panel-muted rounded-3xl p-5">
            <p className="text-muted text-sm">Email</p>
            <p className="mt-2 font-medium" style={{ color: 'var(--foreground)' }}>{user.email}</p>
          </div>
          <div className="panel-muted rounded-3xl p-5">
            <p className="text-muted text-sm">Role</p>
            <p className="mt-2 font-medium capitalize" style={{ color: 'var(--foreground)' }}>{user.role}</p>
          </div>
          <div className="panel-muted rounded-3xl p-5">
            <p className="text-muted text-sm">Phone</p>
            <p className="mt-2 font-medium" style={{ color: 'var(--foreground)' }}>{user.phone}</p>
          </div>
          <div className="panel-muted rounded-3xl p-5">
            <p className="text-muted text-sm">Verification</p>
            <p className="mt-2 font-medium capitalize" style={{ color: 'var(--foreground)' }}>{user.verificationStatus}</p>
          </div>
        </div>
        <div className="panel-muted mt-6 rounded-3xl p-5">
          <p className="text-muted text-sm">Address</p>
          <p className="mt-2" style={{ color: 'var(--foreground)' }}>
            {user.address}, {user.city}, {user.state} - {user.pincode}
          </p>
        </div>
      </section>
    </main>
  );
}
