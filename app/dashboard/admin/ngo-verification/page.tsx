import ActionButton from '@/components/ActionButton';
import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';

export default async function AdminNgoVerificationPage() {
  await requireRole(['admin']);
  const db = await readDb();
  const ngos = db.users.filter((user) => user.role === 'ngo');

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">NGO verification</p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-900">Approve redistribution partners</h1>
      <div className="mt-6 space-y-5">
        {ngos.map((ngo) => (
          <div key={ngo.id} className="rounded-[1.5rem] border border-stone-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xl font-semibold text-stone-900">{ngo.ngoName ?? ngo.name}</p>
                <p className="mt-1 text-sm text-stone-600">{ngo.email} · {ngo.city}, {ngo.state}</p>
                <p className="mt-2 text-sm text-stone-600">
                  Current status: <span className="font-semibold capitalize text-stone-900">{ngo.verificationStatus}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ActionButton endpoint={`/api/admin/ngos/${ngo.id}/approve`} label="Approve" pendingLabel="Approving..." />
                <ActionButton endpoint={`/api/admin/ngos/${ngo.id}/reject`} label="Reject" pendingLabel="Rejecting..." variant="danger" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
