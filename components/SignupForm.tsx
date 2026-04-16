'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const roles = [
  { value: 'donor', label: 'Donor' },
  { value: 'ngo', label: 'NGO' },
  { value: 'volunteer', label: 'Volunteer' },
] as const;

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<(typeof roles)[number]['value']>('donor');
  const [ngoName, setNgoName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone || !address || !city || !state || !pincode) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (role === 'ngo' && !ngoName.trim()) {
      setError('Please enter your NGO name');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          role,
          ngoName,
          address,
          city,
          state,
          pincode,
          password,
        }),
      });

      const data = (await response.json()) as { error?: string; dashboardPath?: string };

      if (!response.ok) {
        setError(data.error ?? 'Unable to create account.');
        return;
      }

      router.push(data.dashboardPath ?? '/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="app-input"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="app-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="app-input"
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Register As
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as (typeof roles)[number]['value'])}
            className="app-select"
          >
            {roles.map((roleOption) => (
              <option key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {role === 'ngo' && (
        <div>
          <label htmlFor="ngoName" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            NGO Name
          </label>
          <input
            id="ngoName"
            type="text"
            value={ngoName}
            onChange={(e) => setNgoName(e.target.value)}
            placeholder="Care Kitchen Foundation"
            className="app-input"
          />
        </div>
      )}

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="app-input"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="app-input"
        />
      </div>

      <div>
        <label htmlFor="address" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Pickup / Contact Address
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, area, landmark"
          className="app-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="city" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label htmlFor="state" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            State
          </label>
          <input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="app-input"
          />
        </div>
        <div>
          <label htmlFor="pincode" className="mb-2 block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Pincode
          </label>
          <input
            id="pincode"
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="app-input"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="text-muted text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="link-brand">
          Login here
        </Link>
      </div>
    </form>
  );
}
