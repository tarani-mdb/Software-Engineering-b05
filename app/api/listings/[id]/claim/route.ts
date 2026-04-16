import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { claimListing } from '@/lib/store';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const listing = await claimListing(id, user);
    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to claim listing.' },
      { status: 409 },
    );
  }
}
