import ActionButton from '@/components/ActionButton';
import { requireRole } from '@/lib/auth';
import { getDbSnapshot, getStatusTone, getUserLabel } from '@/lib/store';
import { formatDate } from '@/lib/format';

export default async function NgoListingsPage() {
  await requireRole(['ngo', 'volunteer']);
  const db = await getDbSnapshot();
  const listings = db.listings.filter((listing) => listing.status === 'active');

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Browse donations</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">Available food listings</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Claiming is atomic, so only one team can secure a listing at a time.
        </p>
      </div>

      <div className="grid gap-5">
        {listings.map((listing) => {
          const donor = db.users.find((entry) => entry.id === listing.donorId);
          return (
            <div key={listing.id} className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-stone-900">{listing.title}</h2>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
                      {listing.status}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-stone-600">{listing.description}</p>
                  <div className="mt-4 grid gap-3 text-sm text-stone-600 sm:grid-cols-2 xl:grid-cols-4">
                    <p><span className="font-semibold text-stone-900">Donor:</span> {getUserLabel(donor)}</p>
                    <p><span className="font-semibold text-stone-900">Quantity:</span> {listing.quantityKg} kg</p>
                    <p><span className="font-semibold text-stone-900">City:</span> {listing.pickupCity}</p>
                    <p><span className="font-semibold text-stone-900">Pickup ends:</span> {formatDate(listing.pickupWindowEnd)}</p>
                  </div>
                </div>
                <div className="lg:w-52">
                  <ActionButton
                    endpoint={`/api/listings/${listing.id}/claim`}
                    label="Claim Pickup"
                    pendingLabel="Claiming..."
                    confirmMessage="Claim this listing for pickup?"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
