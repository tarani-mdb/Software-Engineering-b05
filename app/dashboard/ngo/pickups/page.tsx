import ActionButton from '@/components/ActionButton';
import { requireRole } from '@/lib/auth';
import { getDbSnapshot, getStatusTone } from '@/lib/store';
import { formatDate } from '@/lib/format';

export default async function MyPickupsPage() {
  const user = await requireRole(['ngo', 'volunteer']);
  const db = await getDbSnapshot();
  const pickups = db.pickups.filter((pickup) => pickup.claimerUserId === user.id);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Pickup queue</p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-900">Manage claimed donations</h1>

      <div className="mt-6 space-y-5">
        {pickups.length === 0 ? (
          <p className="text-stone-500">You have not claimed any listings yet.</p>
        ) : (
          pickups.map((pickup) => {
            const listing = db.listings.find((entry) => entry.id === pickup.listingId);
            if (!listing) return null;

            return (
              <div key={pickup.id} className="rounded-[1.5rem] border border-stone-200 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-stone-900">{listing.title}</h2>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                      <p><span className="font-semibold text-stone-900">Claimed:</span> {formatDate(pickup.claimedAt)}</p>
                      <p><span className="font-semibold text-stone-900">Pickup city:</span> {listing.pickupCity}</p>
                      <p><span className="font-semibold text-stone-900">Address:</span> {listing.pickupAddress}</p>
                      <p><span className="font-semibold text-stone-900">Window ends:</span> {formatDate(listing.pickupWindowEnd)}</p>
                    </div>
                  </div>

                  {pickup.status === 'claimed' ? (
                    <ActionButton
                      endpoint={`/api/listings/${listing.id}/complete`}
                      label="Mark completed"
                      pendingLabel="Completing..."
                      confirmMessage="Confirm that this pickup has been completed?"
                    />
                  ) : (
                    <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      Completed on {formatDate(pickup.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
