import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { setNgoVerification } from '@/lib/store';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const ngo = await setNgoVerification(id, false, user);
    return NextResponse.json({ ngo });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reject NGO.' },
      { status: 400 },
    );
  }
}
