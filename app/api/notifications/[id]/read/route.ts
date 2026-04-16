import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { markNotificationRead } from '@/lib/store';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    await markNotificationRead(id, user);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update notification.' },
      { status: 400 },
    );
  }
}
