import StatCard from '@/components/StatCard';
import { computeCommunityStats, computeUserStats } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function DonorImpactPage() {
  const user = await requireRole(['donor']);
  const db = await readDb();
  const personal = computeUserStats(db, user);
  const community = computeCommunityStats(db);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Impact analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">See your contribution clearly</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          These numbers estimate how much good your completed donations are doing across nutrition, cost savings, and climate impact.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Food redistributed" value={`${personal.totalFoodRedistributedKg} kg`} />
        <StatCard label="Estimated meals" value={personal.estimatedMealsServed} />
        <StatCard label="Money saved" value={formatCurrency(personal.estimatedMoneySaved)} />
        <StatCard label="CO2 prevented" value={`${personal.estimatedCo2PreventedKg} kg`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Personal milestones</h2>
          <ul className="mt-4 space-y-3 text-stone-600">
            <li>Completed donations: {personal.completedDonations}</li>
            <li>Currently active listings: {personal.activeListings}</li>
            <li>Claimed but pending collection: {personal.claimedListings}</li>
          </ul>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Community context</h2>
          <ul className="mt-4 space-y-3 text-stone-600">
            <li>Total community users: {community.activeUsers}</li>
            <li>Community food redistributed: {community.totalFoodRedistributedKg} kg</li>
            <li>Community estimated meals: {community.estimatedMealsServed}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
