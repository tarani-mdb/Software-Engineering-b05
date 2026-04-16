import StatCard from '@/components/StatCard';
import { computeCommunityStats } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { readDb } from '@/lib/db';

export default async function AdminDashboardPage() {
  await requireRole(['admin']);
  const db = await readDb();
  const stats = computeCommunityStats(db);
  const pendingNgos = db.users.filter((user) => user.role === 'ngo' && user.verificationStatus === 'pending').length;

  return (
    <section className="space-y-8">
      <div className="rounded-[2.5rem] border border-white/70 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Admin control panel</p>
        <h1 className="mt-2 text-4xl font-semibold text-stone-900">Run the platform with confidence</h1>
        <p className="mt-3 max-w-3xl text-stone-600">
          Review registrations, moderate operations, and monitor redistribution impact across all stakeholders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Users" value={stats.activeUsers} />
        <StatCard label="Pending NGOs" value={pendingNgos} />
        <StatCard label="Active listings" value={stats.activeListings} />
        <StatCard label="Completed pickups" value={stats.completedPickups} />
        <StatCard label="Redistributed" value={`${stats.totalFoodRedistributedKg} kg`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-2xl font-semibold text-stone-900">Operational highlights</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">Meals served</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">{stats.estimatedMealsServed}</p>
            </div>
            <div className="rounded-3xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">Money saved</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">Rs. {stats.estimatedMoneySaved}</p>
            </div>
            <div className="rounded-3xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">CO2 prevented</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">{stats.estimatedCo2PreventedKg} kg</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-900">Admin checklist</h2>
          <ul className="mt-5 space-y-3 text-stone-600">
            <li>Approve or reject pending NGO accounts</li>
            <li>Deactivate risky or inactive users</li>
            <li>Monitor listings stuck in claimed state</li>
            <li>Keep community metrics export-ready</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
