import { NextRequest, NextResponse } from 'next/server';
import { loginUser, logoutUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const result = await loginUser(email, password);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to login.' },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  await logoutUser();
  return NextResponse.json({ success: true });
}
