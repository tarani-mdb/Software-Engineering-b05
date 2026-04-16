import StatCard from '@/components/StatCard';
import { computeCommunityStats } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export default async function AdminReportsPage() {
  await requireRole(['admin']);
  const db = await readDb();
  const stats = computeCommunityStats(db);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Impact reports</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">Community summary snapshot</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total listings" value={stats.totalListings} />
        <StatCard label="Food redistributed" value={`${stats.totalFoodRedistributedKg} kg`} />
        <StatCard label="Estimated meals" value={stats.estimatedMealsServed} />
        <StatCard label="Money saved" value={formatCurrency(stats.estimatedMoneySaved)} />
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-900">Export-friendly metrics</h2>
        <div className="mt-5 grid gap-3 text-stone-600 sm:grid-cols-2 lg:grid-cols-3">
          <p>Active users: {stats.activeUsers}</p>
          <p>Verified NGOs: {stats.verifiedNgos}</p>
          <p>Completed pickups: {stats.completedPickups}</p>
          <p>Active listings: {stats.activeListings}</p>
          <p>Estimated CO2 prevented: {stats.estimatedCo2PreventedKg} kg</p>
          <p>Current report timestamp: {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>
    </section>
  );
}
