import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { cancelListing } from '@/lib/store';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const listing = await cancelListing(id, user);
    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to cancel listing.' },
      { status: 400 },
    );
  }
}
