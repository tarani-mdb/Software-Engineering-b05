import { NextResponse } from 'next/server';
import { computeCommunityStats } from '@/lib/analytics';
import { readDb } from '@/lib/db';

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ stats: computeCommunityStats(db) });
}
