import { redirect } from 'next/navigation';
import { getDashboardPath, requireUser } from '@/lib/auth';

export default async function DashboardEntryPage() {
  const user = await requireUser();
  redirect(getDashboardPath(user.role));
}
