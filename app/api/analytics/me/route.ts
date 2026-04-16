import { NextResponse } from 'next/server';
import { computeUserStats } from '@/lib/analytics';
import { requireApiUser } from '@/lib/auth';
import { readDb } from '@/lib/db';

export async function GET() {
  const user = await requireApiUser();
  const db = await readDb();
  return NextResponse.json({ stats: computeUserStats(db, user) });
}
