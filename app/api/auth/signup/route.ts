import { NextRequest, NextResponse } from 'next/server';
import { signupUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name: string;
      email: string;
      phone: string;
      role: 'donor' | 'ngo' | 'volunteer';
      ngoName?: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      password: string;
    };

    const result = await signupUser(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create account.' },
      { status: 400 },
    );
  }
}
