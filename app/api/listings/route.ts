import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth';
import { createListing, getDbSnapshot } from '@/lib/store';

export async function GET() {
  const db = await getDbSnapshot();
  return NextResponse.json({ listings: db.listings });
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireApiUser();
    const body = await req.json();
    const listing = await createListing(user, {
      ...body,
      preparedAt: body.preparedAt ? new Date(body.preparedAt).toISOString() : new Date().toISOString(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt).toISOString() : undefined,
      pickupWindowStart: new Date(body.pickupWindowStart).toISOString(),
      pickupWindowEnd: new Date(body.pickupWindowEnd).toISOString(),
    });

    return NextResponse.json({ listingId: listing.id, listing });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create listing.' },
      { status: 400 },
    );
  }
}
