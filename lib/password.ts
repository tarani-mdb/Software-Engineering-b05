import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${derived}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, expected] = storedHash.split(':');
  if (!salt || !expected) return false;

  const derived = scryptSync(password, salt, KEY_LENGTH);
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (derived.length !== expectedBuffer.length) return false;
  return timingSafeEqual(derived, expectedBuffer);
}
