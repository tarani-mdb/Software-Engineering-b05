import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { toggleUserActive } from '@/lib/store';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const updated = await toggleUserActive(id, user);
    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update user.' },
      { status: 400 },
    );
  }
}
