'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface ActionButtonProps {
  endpoint: string;
  label: string;
  pendingLabel?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  confirmMessage?: string;
  payload?: Record<string, unknown>;
}

export default function ActionButton({
  endpoint,
  label,
  pendingLabel,
  variant = 'primary',
  confirmMessage,
  payload,
}: ActionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const variantClass =
    variant === 'primary'
      ? 'btn-primary text-white'
      : variant === 'danger'
        ? 'btn-danger text-white'
        : 'btn-secondary';

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirmMessage && !window.confirm(confirmMessage)) {
            return;
          }

          setError('');
          setSuccess(false);

          startTransition(async () => {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload ?? {}),
            });
            const data = (await response.json()) as { error?: string };
            if (!response.ok) {
              setError(data.error ?? 'Action failed.');
              return;
            }

            setSuccess(true);
            router.refresh();
          });
        }}
        className={`px-4 py-2 text-sm font-semibold disabled:opacity-60 ${variantClass}`}
      >
        {isPending ? pendingLabel ?? 'Working...' : label}
      </button>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="text-brand text-sm">Updated successfully.</p> : null}
    </div>
  );
}
