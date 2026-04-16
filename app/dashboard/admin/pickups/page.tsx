import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';
import { formatDate } from '@/lib/format';
import { getUserLabel } from '@/lib/store';

export default async function AdminPickupsPage() {
  await requireRole(['admin']);
  const db = await readDb();

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Pickup monitoring</p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-900">Claimed and completed pickups</h1>
      <div className="mt-6 space-y-4">
        {db.pickups.map((pickup) => {
          const listing = db.listings.find((entry) => entry.id === pickup.listingId);
          const claimer = db.users.find((entry) => entry.id === pickup.claimerUserId);
          return (
            <div key={pickup.id} className="rounded-[1.5rem] border border-stone-200 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-stone-900">{listing?.title ?? 'Listing not found'}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Claimed by {getUserLabel(claimer)} · {pickup.status}
                  </p>
                </div>
                <div className="text-sm text-stone-600">
                  <p>Claimed: {formatDate(pickup.claimedAt)}</p>
                  <p>Completed: {formatDate(pickup.completedAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
