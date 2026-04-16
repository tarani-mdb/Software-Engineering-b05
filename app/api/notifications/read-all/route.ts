import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { markAllNotificationsRead } from '@/lib/store';

export async function POST() {
  try {
    const user = await requireApiUser();
    await markAllNotificationsRead(user);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update notifications.' },
      { status: 400 },
    );
  }
}
