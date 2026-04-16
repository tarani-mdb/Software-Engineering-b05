'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Prepared Food', 'Raw Ingredients', 'Bakery', 'Packaged', 'Beverages'];

export default function ListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    foodType: '',
    category: categories[0],
    quantityKg: '5',
    servings: '10',
    preparedAt: '',
    expiresAt: '',
    pickupWindowStart: '',
    pickupWindowEnd: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupPincode: '',
    specialInstructions: '',
    isVegetarian: true,
  });

  function updateField(name: string, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            quantityKg: Number(form.quantityKg),
            servings: Number(form.servings),
          }),
        });

        const data = (await response.json()) as { error?: string; listingId?: string };

        if (!response.ok) {
          setError(data.error ?? 'Unable to create listing.');
          setLoading(false);
          return;
        }

        router.push(`/dashboard/donor/listings/${data.listingId}`);
        router.refresh();
      }}
    >
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Listing Title</label>
          <input
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="app-input"
            placeholder="Fresh meals from corporate lunch"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Food Type</label>
          <input
            value={form.foodType}
            onChange={(e) => updateField('foodType', e.target.value)}
            className="app-input"
            placeholder="Cooked Meals"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="app-textarea min-h-28"
          placeholder="Describe condition, packaging, and any pickup notes."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Category</label>
          <select
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="app-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Quantity (kg)</label>
          <input
            type="number"
            min="1"
            step="0.5"
            value={form.quantityKg}
            onChange={(e) => updateField('quantityKg', e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Estimated Servings</label>
          <input
            type="number"
            min="1"
            value={form.servings}
            onChange={(e) => updateField('servings', e.target.value)}
            className="app-input"
          />
        </div>
        <label className="panel-muted mt-8 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          <input
            type="checkbox"
            checked={form.isVegetarian}
            onChange={(e) => updateField('isVegetarian', e.target.checked)}
            className="h-4 w-4"
          />
          Vegetarian
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Prepared At</label>
          <input
            type="datetime-local"
            value={form.preparedAt}
            onChange={(e) => updateField('preparedAt', e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Pickup Window Start</label>
          <input
            type="datetime-local"
            value={form.pickupWindowStart}
            onChange={(e) => updateField('pickupWindowStart', e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Pickup Window End</label>
          <input
            type="datetime-local"
            value={form.pickupWindowEnd}
            onChange={(e) => updateField('pickupWindowEnd', e.target.value)}
            className="app-input"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Address</label>
        <input
          value={form.pickupAddress}
          onChange={(e) => updateField('pickupAddress', e.target.value)}
          className="app-input"
          placeholder="Street address or pickup landmark"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>City</label>
          <input
            value={form.pickupCity}
            onChange={(e) => updateField('pickupCity', e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>State</label>
          <input
            value={form.pickupState}
            onChange={(e) => updateField('pickupState', e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Pincode</label>
          <input
            value={form.pickupPincode}
            onChange={(e) => updateField('pickupPincode', e.target.value)}
            className="app-input"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Special Instructions</label>
        <textarea
          value={form.specialInstructions}
          onChange={(e) => updateField('specialInstructions', e.target.value)}
          className="app-textarea min-h-24"
          placeholder="Packaging notes, contact person, parking tips, etc."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-6 py-3 disabled:opacity-60"
      >
        {loading ? 'Publishing...' : 'Publish Donation'}
      </button>
    </form>
  );
}
