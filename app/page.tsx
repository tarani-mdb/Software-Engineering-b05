import Link from 'next/link';
import StatCard from '@/components/StatCard';
import { computeCommunityStats } from '@/lib/analytics';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = await readDb();
  const stats = computeCommunityStats(db);

  return (
    <main className="page-shell">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <div className="hero-panel rounded-[2.5rem] p-8 text-white sm:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Waste food management platform</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
            Rescue good food before it becomes waste.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-emerald-50/90">
            Donors publish surplus food, NGOs and volunteers claim pickups, and admins track impact across the whole community from one web app.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/auth/signup"
              className="btn-secondary px-6 py-3 font-semibold"
              style={{ color: 'var(--brand-strong)' }}
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-4xl font-semibold">{stats.activeUsers}</p>
              <p className="mt-2 text-sm text-emerald-100">Active users already on the platform</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">{stats.totalFoodRedistributedKg} kg</p>
              <p className="mt-2 text-sm text-emerald-100">Food already redistributed</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">{stats.estimatedMealsServed}</p>
              <p className="mt-2 text-sm text-emerald-100">Estimated meals served</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <StatCard label="Verified NGOs" value={stats.verifiedNgos} hint="Approved and ready to claim pickups" />
          <StatCard label="Live Listings" value={stats.activeListings} hint="Donations waiting for pickup right now" />
          <StatCard
            label="CO2 Prevented"
            value={`${stats.estimatedCo2PreventedKg} kg`}
            hint="Estimated climate impact of rescued food"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="panel rounded-[2rem] p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Donors</p>
            <h2 className="mt-4 text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Post food quickly</h2>
            <p className="text-muted mt-3">
              Create donation listings with quantity, timing, and pickup location. Track every listing from posted to collected.
            </p>
          </article>
          <article className="panel rounded-[2rem] p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-700">NGOs & Volunteers</p>
            <h2 className="mt-4 text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Claim with confidence</h2>
            <p className="text-muted mt-3">
              Browse live listings, claim pickups atomically, and update completion status without double-booking.
            </p>
          </article>
          <article className="panel rounded-[2rem] p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-700">Admins</p>
            <h2 className="mt-4 text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Govern the network</h2>
            <p className="text-muted mt-3">
              Verify NGOs, monitor users, review listings, and measure food redistribution through one operational dashboard.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="panel-soft rounded-[2.5rem] p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="section-kicker text-sm uppercase tracking-[0.28em]">Demo Accounts</p>
              <h2 className="mt-4 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>Start exploring immediately</h2>
              <p className="text-muted mt-3">
                Use any of the seeded accounts below with password <span className="font-semibold">password123</span>.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel-muted rounded-3xl p-5">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Admin</p>
                <p className="text-muted mt-2 text-sm">admin@foodwaste.local</p>
              </div>
              <div className="panel-muted rounded-3xl p-5">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Donor</p>
                <p className="text-muted mt-2 text-sm">donor@foodwaste.local</p>
              </div>
              <div className="panel-muted rounded-3xl p-5">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>NGO</p>
                <p className="text-muted mt-2 text-sm">ngo@foodwaste.local</p>
              </div>
              <div className="panel-muted rounded-3xl p-5">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Volunteer</p>
                <p className="text-muted mt-2 text-sm">volunteer@foodwaste.local</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
