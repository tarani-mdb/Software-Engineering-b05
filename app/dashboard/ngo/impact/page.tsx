import StatCard from '@/components/StatCard';
import { computeCommunityStats, computeUserStats } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function NgoImpactPage() {
  const user = await requireRole(['ngo', 'volunteer']);
  const db = await readDb();
  const personal = computeUserStats(db, user);
  const community = computeCommunityStats(db);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Impact analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">Track collection outcomes</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Completed pickups" value={personal.completedPickups} />
        <StatCard label="Food collected" value={`${personal.totalFoodRedistributedKg} kg`} />
        <StatCard label="Estimated meals" value={personal.estimatedMealsServed} />
        <StatCard label="Money preserved" value={formatCurrency(personal.estimatedMoneySaved)} />
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-900">Community totals</h2>
        <div className="mt-5 grid gap-3 text-stone-600 sm:grid-cols-2 lg:grid-cols-4">
          <p>Total food redistributed: {community.totalFoodRedistributedKg} kg</p>
          <p>Estimated meals served: {community.estimatedMealsServed}</p>
          <p>CO2 prevented: {community.estimatedCo2PreventedKg} kg</p>
          <p>Verified NGOs: {community.verifiedNgos}</p>
        </div>
      </div>
    </section>
  );
}
