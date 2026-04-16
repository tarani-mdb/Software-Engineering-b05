import Link from 'next/link';
import StatCard from '@/components/StatCard';
import { computeUserStats } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { getDbSnapshot, getStatusTone } from '@/lib/store';
import { formatDate } from '@/lib/format';

export default async function DonorDashboardPage() {
  const user = await requireRole(['donor']);
  const db = await getDbSnapshot();
  const stats = computeUserStats(db, user);
  const listings = db.listings.filter((listing) => listing.donorId === user.id).slice(0, 5);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2.5rem] border border-white/70 bg-white p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Donor dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-900">Keep surplus food moving.</h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Post new donations, track claims in real time, and measure how much food your team has redirected.
          </p>
        </div>
        <Link
          href="/dashboard/donor/listings/new"
          className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Post New Donation
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active listings" value={stats.activeListings} />
        <StatCard label="Claimed listings" value={stats.claimedListings} />
        <StatCard label="Completed donations" value={stats.completedDonations} />
        <StatCard label="Food redistributed" value={`${stats.totalFoodRedistributedKg} kg`} />
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-stone-900">Recent listings</h2>
          <Link href="/dashboard/donor/listings" className="text-sm font-semibold text-emerald-700">
            View all
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {listings.length === 0 ? (
            <p className="text-stone-500">No listings yet. Create your first donation to start redistributing food.</p>
          ) : (
            listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/donor/listings/${listing.id}`}
                className="block rounded-[1.5rem] border border-stone-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">{listing.title}</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {listing.quantityKg} kg · {listing.pickupCity} · Pickup until {formatDate(listing.pickupWindowEnd)}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusTone(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
