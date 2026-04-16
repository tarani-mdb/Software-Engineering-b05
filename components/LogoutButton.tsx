'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
      }}
      className="btn-secondary px-4 py-2 text-sm"
      disabled={loading}
    >
      {loading ? 'Signing out...' : 'Logout'}
    </button>
  );
}
