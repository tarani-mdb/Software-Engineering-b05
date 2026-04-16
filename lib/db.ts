import { randomUUID } from 'crypto';
import type { AppDb, Listing, Notification, Pickup, Session, User } from '@/lib/types';
import { hashPassword } from '@/lib/password';
import { connectToDatabase } from '@/lib/mongodb';
import { ListingModel, NotificationModel, PickupModel, SessionModel, UserModel } from '@/lib/models';

function iso(value: Date | string | undefined | null) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function normalizeUser(doc: Record<string, unknown>): User {
  return {
    id: String(doc._id),
    name: String(doc.name),
    email: String(doc.email),
    passwordHash: String(doc.passwordHash),
    phone: String(doc.phone),
    role: doc.role as User['role'],
    ngoName: doc.ngoName ? String(doc.ngoName) : undefined,
    verificationStatus: doc.verificationStatus as User['verificationStatus'],
    isActive: Boolean(doc.isActive),
    address: String(doc.address),
    city: String(doc.city),
    state: String(doc.state),
    pincode: String(doc.pincode),
    createdAt: iso(doc.createdAt as Date)!,
    updatedAt: iso(doc.updatedAt as Date)!,
  };
}

function normalizeListing(doc: Record<string, unknown>): Listing {
  return {
    id: String(doc._id),
    donorId: String(doc.donorId),
    title: String(doc.title),
    description: String(doc.description),
    foodType: String(doc.foodType),
    category: String(doc.category),
    quantityKg: Number(doc.quantityKg),
    servings: typeof doc.servings === 'number' ? doc.servings : undefined,
    isVegetarian: typeof doc.isVegetarian === 'boolean' ? doc.isVegetarian : undefined,
    preparedAt: iso(doc.preparedAt as Date)!,
    expiresAt: iso(doc.expiresAt as Date),
    pickupWindowStart: iso(doc.pickupWindowStart as Date)!,
    pickupWindowEnd: iso(doc.pickupWindowEnd as Date)!,
    pickupAddress: String(doc.pickupAddress),
    pickupCity: String(doc.pickupCity),
    pickupState: String(doc.pickupState),
    pickupPincode: String(doc.pickupPincode),
    specialInstructions: doc.specialInstructions ? String(doc.specialInstructions) : undefined,
    status: doc.status as Listing['status'],
    claimedByUserId: doc.claimedByUserId ? String(doc.claimedByUserId) : undefined,
    claimedAt: iso(doc.claimedAt as Date),
    completedAt: iso(doc.completedAt as Date),
    cancelledAt: iso(doc.cancelledAt as Date),
    createdAt: iso(doc.createdAt as Date)!,
    updatedAt: iso(doc.updatedAt as Date)!,
  };
}

function normalizePickup(doc: Record<string, unknown>): Pickup {
  return {
    id: String(doc._id),
    listingId: String(doc.listingId),
    donorId: String(doc.donorId),
    claimerUserId: String(doc.claimerUserId),
    claimerRole: doc.claimerRole as Pickup['claimerRole'],
    status: doc.status as Pickup['status'],
    claimedAt: iso(doc.claimedAt as Date)!,
    completedAt: iso(doc.completedAt as Date),
    notes: doc.notes ? String(doc.notes) : undefined,
    createdAt: iso(doc.createdAt as Date)!,
    updatedAt: iso(doc.updatedAt as Date)!,
  };
}

function normalizeNotification(doc: Record<string, unknown>): Notification {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    type: doc.type as Notification['type'],
    title: String(doc.title),
    message: String(doc.message),
    isRead: Boolean(doc.isRead),
    createdAt: iso(doc.createdAt as Date)!,
  };
}

function normalizeSession(doc: Record<string, unknown>): Session {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    token: String(doc.token),
    expiresAt: iso(doc.expiresAt as Date)!,
    createdAt: iso(doc.createdAt as Date)!,
  };
}

async function seedDatabase() {
  await connectToDatabase();

  const userCount = await UserModel.countDocuments();
  if (userCount > 0) return;

  const timestamp = new Date();
  const passwordHash = await hashPassword('password123');

  const users = await UserModel.insertMany([
    {
      _id: randomUUID(),
      name: 'Admin User',
      email: 'admin@foodwaste.local',
      passwordHash,
      phone: '9999999999',
      role: 'admin',
      verificationStatus: 'verified',
      isActive: true,
      address: 'Sample community hub',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560036',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      _id: randomUUID(),
      name: 'Ananya Foods',
      email: 'donor@foodwaste.local',
      passwordHash,
      phone: '9999999999',
      role: 'donor',
      verificationStatus: 'not_required',
      isActive: true,
      address: 'Sample community hub',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560036',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      _id: randomUUID(),
      name: 'Care Kitchen',
      email: 'ngo@foodwaste.local',
      passwordHash,
      phone: '9999999999',
      role: 'ngo',
      ngoName: 'Care Kitchen Foundation',
      verificationStatus: 'verified',
      isActive: true,
      address: 'Sample community hub',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560036',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      _id: randomUUID(),
      name: 'Rohit Volunteer',
      email: 'volunteer@foodwaste.local',
      passwordHash,
      phone: '9999999999',
      role: 'volunteer',
      verificationStatus: 'not_required',
      isActive: true,
      address: 'Sample community hub',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560036',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      _id: randomUUID(),
      name: 'Meals for All',
      email: 'pending-ngo@foodwaste.local',
      passwordHash,
      phone: '9999999999',
      role: 'ngo',
      ngoName: 'Meals for All',
      verificationStatus: 'pending',
      isActive: true,
      address: 'Sample community hub',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560036',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ]);

  const admin = users.find((user) => user.email === 'admin@foodwaste.local')!;
  const donor = users.find((user) => user.email === 'donor@foodwaste.local')!;
  const ngo = users.find((user) => user.email === 'ngo@foodwaste.local')!;
  const pendingNgo = users.find((user) => user.email === 'pending-ngo@foodwaste.local')!;

  const listing1Id = randomUUID();
  const listing2Id = randomUUID();

  await ListingModel.insertMany([
    {
      _id: listing1Id,
      donorId: donor._id,
      title: 'Fresh lunch boxes from office event',
      description: 'Packed veg meals from a corporate lunch. Safe for same-day distribution.',
      foodType: 'Cooked Meals',
      category: 'Prepared Food',
      quantityKg: 18,
      servings: 35,
      isVegetarian: true,
      preparedAt: timestamp,
      pickupWindowStart: timestamp,
      pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 4),
      pickupAddress: 'KR Puram Main Road',
      pickupCity: 'Bengaluru',
      pickupState: 'Karnataka',
      pickupPincode: '560036',
      specialInstructions: 'Please bring insulated containers.',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      _id: listing2Id,
      donorId: donor._id,
      title: 'Bakery surplus bread and buns',
      description: 'Assorted bread items from morning production.',
      foodType: 'Bakery',
      category: 'Packaged',
      quantityKg: 10,
      servings: 20,
      preparedAt: timestamp,
      pickupWindowStart: timestamp,
      pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 2),
      pickupAddress: 'Old Madras Road',
      pickupCity: 'Bengaluru',
      pickupState: 'Karnataka',
      pickupPincode: '560049',
      specialInstructions: 'Pickup before 6 PM.',
      status: 'claimed',
      claimedByUserId: ngo._id,
      claimedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ]);

  await PickupModel.create({
    _id: randomUUID(),
    listingId: listing2Id,
    donorId: donor._id,
    claimerUserId: ngo._id,
    claimerRole: 'ngo',
    status: 'claimed',
    claimedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await NotificationModel.insertMany([
    {
      _id: randomUUID(),
      userId: donor._id,
      type: 'listing_claimed',
      title: 'Donation claimed',
      message: 'Care Kitchen Foundation claimed your bakery surplus listing.',
      isRead: false,
      createdAt: timestamp,
    },
    {
      _id: randomUUID(),
      userId: admin._id,
      type: 'ngo_verification_pending',
      title: 'NGO verification pending',
      message: `${pendingNgo.ngoName ?? pendingNgo.name} is waiting for approval.`,
      isRead: false,
      createdAt: timestamp,
    },
  ]);
}

export async function expireStaleListings() {
  await connectToDatabase();
  await ListingModel.updateMany(
    { status: 'active', pickupWindowEnd: { $lt: new Date() } },
    { $set: { status: 'expired', updatedAt: new Date() } },
  );
}

export async function readDb(): Promise<AppDb> {
  await seedDatabase();
  await expireStaleListings();

  const [users, listings, pickups, notifications, sessions] = await Promise.all([
    UserModel.find().sort({ createdAt: -1 }).lean(),
    ListingModel.find().sort({ createdAt: -1 }).lean(),
    PickupModel.find().sort({ createdAt: -1 }).lean(),
    NotificationModel.find().sort({ createdAt: -1 }).lean(),
    SessionModel.find().sort({ createdAt: -1 }).lean(),
  ]);

  return {
    users: users.map((doc) => normalizeUser(doc as unknown as Record<string, unknown>)),
    listings: listings.map((doc) => normalizeListing(doc as unknown as Record<string, unknown>)),
    pickups: pickups.map((doc) => normalizePickup(doc as unknown as Record<string, unknown>)),
    notifications: notifications.map((doc) => normalizeNotification(doc as unknown as Record<string, unknown>)),
    sessions: sessions.map((doc) => normalizeSession(doc as unknown as Record<string, unknown>)),
  };
}

export const mongoMappers = {
  user: normalizeUser,
  listing: normalizeListing,
  pickup: normalizePickup,
  notification: normalizeNotification,
  session: normalizeSession,
};
