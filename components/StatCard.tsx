interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="panel rounded-[1.75rem] p-5">
      <p className="text-muted text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>{value}</p>
      {hint ? <p className="text-muted mt-2 text-sm">{hint}</p> : null}
    </div>
  );
}
