import { randomBytes, randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { mongoMappers, readDb } from '@/lib/db';
import { connectToDatabase } from '@/lib/mongodb';
import { NotificationModel, SessionModel, UserModel } from '@/lib/models';
import { hashPassword, verifyPassword } from '@/lib/password';
import type { SafeUser, UserRole } from '@/lib/types';

const SESSION_COOKIE = 'fwm_session';

function withoutPassword(user: { passwordHash: string } & Record<string, unknown>): SafeUser {
  const safeUser = mongoMappers.user(user);
  return {
    id: safeUser.id,
    name: safeUser.name,
    email: safeUser.email,
    phone: safeUser.phone,
    role: safeUser.role,
    ngoName: safeUser.ngoName,
    verificationStatus: safeUser.verificationStatus,
    isActive: safeUser.isActive,
    address: safeUser.address,
    city: safeUser.city,
    state: safeUser.state,
    pincode: safeUser.pincode,
    createdAt: safeUser.createdAt,
    updatedAt: safeUser.updatedAt,
  };
}

export function getDashboardPath(role: UserRole) {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'donor') return '/dashboard/donor';
  return '/dashboard/ngo';
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  await connectToDatabase();
  const session = await SessionModel.findOne({
    token,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) return null;

  const user = await UserModel.findOne({ _id: session.userId, isActive: true }).lean();
  return user ? withoutPassword(user as { passwordHash: string } & Record<string, unknown>) : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  return user;
}

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect(getDashboardPath(user.role));
  }
  return user;
}

export async function signupUser(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  ngoName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim().toLowerCase();

  if (
    !trimmedName ||
    !trimmedEmail ||
    !input.password ||
    !input.phone.trim() ||
    !input.address.trim() ||
    !input.city.trim() ||
    !input.state.trim() ||
    !input.pincode.trim()
  ) {
    throw new Error('All required fields must be filled.');
  }

  if (input.password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  if (input.role === 'ngo' && !input.ngoName?.trim()) {
    throw new Error('NGO name is required for NGO registration.');
  }

  await connectToDatabase();
  await readDb();

  const existing = await UserModel.findOne({ email: trimmedEmail }).lean();
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const timestamp = new Date();
  const passwordHash = await hashPassword(input.password);

  const createdUser = await UserModel.create({
    _id: randomUUID(),
    name: trimmedName,
    email: trimmedEmail,
    passwordHash,
    phone: input.phone.trim(),
    role: input.role,
    ngoName: input.ngoName?.trim() || undefined,
    verificationStatus: input.role === 'ngo' ? 'pending' : input.role === 'admin' ? 'verified' : 'not_required',
    isActive: true,
    address: input.address.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    pincode: input.pincode.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  if (input.role === 'ngo') {
    const admins = await UserModel.find({ role: 'admin' }).lean();
    if (admins.length) {
      await NotificationModel.insertMany(
        admins.map((admin) => ({
          _id: randomUUID(),
          userId: admin._id,
          type: 'ngo_verification_pending',
          title: 'NGO verification pending',
          message: `${createdUser.ngoName ?? createdUser.name} is waiting for admin approval.`,
          isRead: false,
          createdAt: timestamp,
        })),
      );
    }
  }

  return createSession(createdUser._id, createdUser.role, withoutPassword(createdUser.toObject()));
}

export async function loginUser(email: string, password: string) {
  await connectToDatabase();
  await readDb();

  const user = await UserModel.findOne({ email: email.trim().toLowerCase() }).lean();

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials.');
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials.');
  }

  return createSession(user._id, user.role, withoutPassword(user as { passwordHash: string } & Record<string, unknown>));
}

async function createSession(userId: string, role: UserRole, safeUser: SafeUser) {
  const token = `${randomUUID()}-${randomBytes(18).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await connectToDatabase();
  await SessionModel.deleteMany({ userId });
  await SessionModel.create({
    _id: randomUUID(),
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    expires: expiresAt,
  });

  return { user: safeUser, dashboardPath: getDashboardPath(role) };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  await connectToDatabase();
  if (token) {
    await SessionModel.deleteOne({ token });
  }

  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  });
}
