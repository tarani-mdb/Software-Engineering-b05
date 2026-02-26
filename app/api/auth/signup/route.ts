import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { saveUser, findUserByEmail } from '@/lib/user';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }
  const hashedPassword = await hash(password, 10);
  const user = await saveUser({ email, password: hashedPassword });
  return NextResponse.json({ message: 'User created successfully.', user: { email: user.email } });
}
