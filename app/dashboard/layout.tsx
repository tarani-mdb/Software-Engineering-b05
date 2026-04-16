import DashboardSidebar from '@/components/DashboardSidebar';
import { requireUser } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <main className="page-shell mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar user={user} />
        <div className="space-y-8">{children}</div>
      </div>
    </main>
  );
}
