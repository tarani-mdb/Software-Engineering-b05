import { requireRole } from '@/lib/auth';
import { getDbSnapshot, getStatusTone, getUserLabel } from '@/lib/store';
import { formatDate } from '@/lib/format';

export default async function AdminListingsPage() {
  await requireRole(['admin']);
  const db = await getDbSnapshot();

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Listings monitor</p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-900">All platform listings</h1>
      <div className="mt-6 space-y-4">
        {db.listings.map((listing) => {
          const donor = db.users.find((user) => user.id === listing.donorId);
          return (
            <div key={listing.id} className="rounded-[1.5rem] border border-stone-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-stone-900">{listing.title}</p>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
                      {listing.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    {getUserLabel(donor)} · {listing.quantityKg} kg · {listing.pickupCity}
                  </p>
                </div>
                <p className="text-sm text-stone-600">Updated {formatDate(listing.updatedAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
