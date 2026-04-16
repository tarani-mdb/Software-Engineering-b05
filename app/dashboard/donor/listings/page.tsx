import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDbSnapshot, getStatusTone } from '@/lib/store';
import { formatDate } from '@/lib/format';

export default async function DonorListingsPage() {
  const user = await requireRole(['donor']);
  const db = await getDbSnapshot();
  const listings = db.listings.filter((listing) => listing.donorId === user.id);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">My listings</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">Track every donation</h1>
        </div>
        <Link
          href="/dashboard/donor/listings/new"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Post Donation
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-stone-200">
        <div className="grid grid-cols-1 divide-y divide-stone-200">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/dashboard/donor/listings/${listing.id}`}
              className="grid gap-3 p-5 transition hover:bg-stone-50 md:grid-cols-[1.3fr_0.6fr_0.6fr_0.5fr]"
            >
              <div>
                <p className="font-semibold text-stone-900">{listing.title}</p>
                <p className="mt-1 text-sm text-stone-600">{listing.description}</p>
              </div>
              <div className="text-sm text-stone-600">
                <p>{listing.quantityKg} kg</p>
                <p>{listing.pickupCity}</p>
              </div>
              <div className="text-sm text-stone-600">{formatDate(listing.pickupWindowEnd)}</div>
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
                  {listing.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
