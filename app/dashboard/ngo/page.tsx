import Link from 'next/link';
import StatCard from '@/components/StatCard';
import { computeUserStats } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { getDbSnapshot, getStatusTone } from '@/lib/store';
import { formatDate } from '@/lib/format';

export default async function NgoDashboardPage() {
  const user = await requireRole(['ngo', 'volunteer']);
  const db = await getDbSnapshot();
  const stats = computeUserStats(db, user);
  const availableListings = db.listings.filter((listing) => listing.status === 'active').slice(0, 5);
  const myPickups = db.pickups.filter((pickup) => pickup.claimerUserId === user.id).slice(0, 5);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2.5rem] border border-white/70 bg-white p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Pickup dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-900">
            {user.role === 'ngo' ? 'Coordinate pickups faster.' : 'Collect and complete pickups.'}
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Browse eligible donations, claim available listings, and keep your collection queue updated in real time.
          </p>
        </div>
        <Link
          href="/dashboard/ngo/listings"
          className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Browse Listings
        </Link>
      </div>

      {user.role === 'ngo' && user.verificationStatus !== 'verified' ? (
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-amber-900">
          Your NGO account is currently <span className="font-semibold capitalize">{user.verificationStatus}</span>. You can explore listings, but claiming is disabled until an admin approves the account.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Available listings" value={availableListings.length} />
        <StatCard label="Claimed pickups" value={stats.claimedPickups} />
        <StatCard label="Completed pickups" value={stats.completedPickups} />
        <StatCard label="Food collected" value={`${stats.totalFoodRedistributedKg} kg`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-stone-900">Available now</h2>
            <Link href="/dashboard/ngo/listings" className="text-sm font-semibold text-emerald-700">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {availableListings.map((listing) => (
              <Link
                key={listing.id}
                href="/dashboard/ngo/listings"
                className="block rounded-[1.5rem] border border-stone-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">{listing.title}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {listing.quantityKg} kg · {listing.pickupCity}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-stone-900">My pickup queue</h2>
            <Link href="/dashboard/ngo/pickups" className="text-sm font-semibold text-emerald-700">
              View queue
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {myPickups.length === 0 ? (
              <p className="text-stone-500">No pickups yet. Claim a listing to start helping.</p>
            ) : (
              myPickups.map((pickup) => {
                const listing = db.listings.find((entry) => entry.id === pickup.listingId);
                return (
                  <div key={pickup.id} className="rounded-[1.5rem] border border-stone-200 p-5">
                    <p className="font-semibold text-stone-900">{listing?.title ?? 'Deleted listing'}</p>
                    <p className="mt-1 text-sm text-stone-600">Claimed on {formatDate(pickup.claimedAt)}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
