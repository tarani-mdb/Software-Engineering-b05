import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { findUserByEmail } from '@/lib/user';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  const isValid = await compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  // Here you would generate a session or JWT token
  return NextResponse.json({ message: 'Login successful.', user: { email: user.email } });
}
