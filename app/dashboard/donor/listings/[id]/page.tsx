import ActionButton from '@/components/ActionButton';
import { requireRole } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import { getEnrichedListing, getStatusTone, getUserLabel } from '@/lib/store';

export default async function DonorListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole(['donor']);
  const { id } = await params;
  const result = await getEnrichedListing(id);

  if (!result || result.listing.donorId !== user.id) {
    return <section className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-sm">Listing not found.</section>;
  }

  const { listing, claimer } = result;

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Listing details</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">{listing.title}</h1>
          <p className="mt-3 max-w-3xl text-stone-600">{listing.description}</p>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
          {listing.status}
        </span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-stone-50 p-5">
          <p className="text-sm text-stone-500">Quantity</p>
          <p className="mt-2 text-xl font-semibold text-stone-900">{listing.quantityKg} kg</p>
        </div>
        <div className="rounded-3xl bg-stone-50 p-5">
          <p className="text-sm text-stone-500">Pickup window</p>
          <p className="mt-2 text-sm font-medium text-stone-900">
            {formatDate(listing.pickupWindowStart)} to {formatDate(listing.pickupWindowEnd)}
          </p>
        </div>
        <div className="rounded-3xl bg-stone-50 p-5">
          <p className="text-sm text-stone-500">Claimed by</p>
          <p className="mt-2 text-sm font-medium text-stone-900">{claimer ? getUserLabel(claimer) : 'Not claimed yet'}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-stone-200 p-5">
        <p className="text-sm text-stone-500">Pickup address</p>
        <p className="mt-2 text-stone-900">
          {listing.pickupAddress}, {listing.pickupCity}, {listing.pickupState} - {listing.pickupPincode}
        </p>
        {listing.specialInstructions ? <p className="mt-3 text-sm text-stone-600">{listing.specialInstructions}</p> : null}
      </div>

      {listing.status === 'active' ? (
        <div className="mt-8">
          <ActionButton
            endpoint={`/api/listings/${listing.id}/cancel`}
            label="Cancel listing"
            pendingLabel="Cancelling..."
            variant="danger"
            confirmMessage="Cancel this donation listing?"
          />
        </div>
      ) : null}
    </section>
  );
}
