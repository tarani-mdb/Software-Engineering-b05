import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { readDb } from '@/lib/db';

export async function GET() {
  const user = await requireApiUser();
  const db = await readDb();
  const notifications = db.notifications.filter((notification) => notification.userId === user.id);
  return NextResponse.json({ notifications });
}
