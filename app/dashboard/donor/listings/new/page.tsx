import ListingForm from '@/components/ListingForm';
import { requireRole } from '@/lib/auth';

export default async function NewListingPage() {
  await requireRole(['donor']);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">New donation</p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-900">Create a food listing</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Add enough detail for NGOs and volunteers to make a quick decision and collect safely.
      </p>
      <div className="mt-8">
        <ListingForm />
      </div>
    </section>
  );
}
