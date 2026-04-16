import { randomUUID } from 'crypto';
import { mongoMappers, readDb, expireStaleListings } from '@/lib/db';
import { connectToDatabase } from '@/lib/mongodb';
import { ListingModel, NotificationModel, PickupModel, SessionModel, UserModel } from '@/lib/models';
import type { ListingStatus, SafeUser, User } from '@/lib/types';

function now() {
  return new Date();
}

export async function getDbSnapshot() {
  return readDb();
}

export async function createListing(
  user: SafeUser,
  input: {
    title: string;
    description: string;
    foodType: string;
    category: string;
    quantityKg: number;
    servings?: number;
    isVegetarian?: boolean;
    preparedAt: string;
    expiresAt?: string;
    pickupWindowStart: string;
    pickupWindowEnd: string;
    pickupAddress: string;
    pickupCity: string;
    pickupState: string;
    pickupPincode: string;
    specialInstructions?: string;
  },
) {
  if (user.role !== 'donor') {
    throw new Error('Only donors can create listings.');
  }

  if (
    !input.title.trim() ||
    !input.description.trim() ||
    !input.foodType.trim() ||
    !input.category.trim() ||
    !input.pickupAddress.trim() ||
    !input.pickupCity.trim() ||
    !input.pickupState.trim() ||
    !input.pickupPincode.trim()
  ) {
    throw new Error('Please fill all listing details.');
  }

  if (!input.quantityKg || input.quantityKg <= 0) {
    throw new Error('Quantity must be greater than zero.');
  }

  if (new Date(input.pickupWindowStart).getTime() >= new Date(input.pickupWindowEnd).getTime()) {
    throw new Error('Pickup window end must be after pickup window start.');
  }

  if (new Date(input.pickupWindowEnd).getTime() <= Date.now()) {
    throw new Error('Pickup window must end in the future.');
  }

  await connectToDatabase();
  await readDb();

  const timestamp = now();
  const created = await ListingModel.create({
    _id: randomUUID(),
    donorId: user.id,
    title: input.title.trim(),
    description: input.description.trim(),
    foodType: input.foodType.trim(),
    category: input.category.trim(),
    quantityKg: Number(input.quantityKg),
    servings: input.servings ? Number(input.servings) : undefined,
    isVegetarian: Boolean(input.isVegetarian),
    preparedAt: new Date(input.preparedAt),
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
    pickupWindowStart: new Date(input.pickupWindowStart),
    pickupWindowEnd: new Date(input.pickupWindowEnd),
    pickupAddress: input.pickupAddress.trim(),
    pickupCity: input.pickupCity.trim(),
    pickupState: input.pickupState.trim(),
    pickupPincode: input.pickupPincode.trim(),
    specialInstructions: input.specialInstructions?.trim() || undefined,
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const nearbyUsers = await UserModel.find({
    _id: { $ne: user.id },
    isActive: true,
    $or: [{ role: 'volunteer' }, { role: 'ngo', verificationStatus: 'verified' }],
  }).lean();

  if (nearbyUsers.length) {
    await NotificationModel.insertMany(
      nearbyUsers.map((recipient) => ({
        _id: randomUUID(),
        userId: recipient._id,
        type: 'listing_created',
        title: 'New food listing available',
        message: `${created.title} is available for pickup in ${created.pickupCity}.`,
        isRead: false,
        createdAt: timestamp,
      })),
    );
  }

  return mongoMappers.listing(created.toObject());
}

export async function cancelListing(id: string, user: SafeUser) {
  await connectToDatabase();
  await readDb();
  await expireStaleListings();

  const filter =
    user.role === 'admin'
      ? { _id: id, status: 'active' }
      : { _id: id, donorId: user.id, status: 'active' };

  const listing = await ListingModel.findOneAndUpdate(
    filter,
    { $set: { status: 'cancelled', cancelledAt: now(), updatedAt: now() } },
    { new: true },
  ).lean();

  if (!listing) {
    throw new Error('Only active listings can be cancelled.');
  }

  return mongoMappers.listing(listing as unknown as Record<string, unknown>);
}

export async function claimListing(id: string, user: SafeUser) {
  if (!['ngo', 'volunteer'].includes(user.role)) {
    throw new Error('Only NGOs and volunteers can claim listings.');
  }
  if (user.role === 'ngo' && user.verificationStatus !== 'verified') {
    throw new Error('NGO verification is still pending.');
  }

  await connectToDatabase();
  await readDb();
  await expireStaleListings();

  const timestamp = now();
  const listing = await ListingModel.findOneAndUpdate(
    {
      _id: id,
      status: 'active',
      donorId: { $ne: user.id },
      pickupWindowEnd: { $gt: timestamp },
    },
    {
      $set: {
        status: 'claimed',
        claimedByUserId: user.id,
        claimedAt: timestamp,
        updatedAt: timestamp,
      },
    },
    { new: true },
  ).lean();

  if (!listing) {
    throw new Error('Listing is no longer available.');
  }

  await PickupModel.create({
    _id: randomUUID(),
    listingId: id,
    donorId: listing.donorId,
    claimerUserId: user.id,
    claimerRole: user.role,
    status: 'claimed',
    claimedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await NotificationModel.create({
    _id: randomUUID(),
    userId: listing.donorId,
    type: 'listing_claimed',
    title: 'Donation claimed',
    message: `${user.name} claimed "${listing.title}".`,
    isRead: false,
    createdAt: timestamp,
  });

  return mongoMappers.listing(listing as unknown as Record<string, unknown>);
}

export async function completePickup(id: string, user: SafeUser) {
  await connectToDatabase();
  await readDb();
  await expireStaleListings();

  const existing = await ListingModel.findById(id).lean();
  if (!existing) throw new Error('Listing not found.');
  if (existing.status !== 'claimed') throw new Error('Only claimed listings can be completed.');
  if (existing.claimedByUserId !== user.id && user.role !== 'admin') {
    throw new Error('You are not allowed to complete this pickup.');
  }

  const timestamp = now();
  const listing = await ListingModel.findOneAndUpdate(
    { _id: id, status: 'claimed' },
    {
      $set: {
        status: 'completed',
        completedAt: timestamp,
        updatedAt: timestamp,
      },
    },
    { new: true },
  ).lean();

  if (!listing) throw new Error('Pickup record not found.');

  await PickupModel.findOneAndUpdate(
    { listingId: id, status: 'claimed' },
    { $set: { status: 'completed', completedAt: timestamp, updatedAt: timestamp } },
  );

  await NotificationModel.create({
    _id: randomUUID(),
    userId: listing.donorId,
    type: 'pickup_completed',
    title: 'Pickup completed',
    message: `"${listing.title}" has been marked as collected successfully.`,
    isRead: false,
    createdAt: timestamp,
  });

  if (listing.claimedByUserId) {
    await NotificationModel.create({
      _id: randomUUID(),
      userId: listing.claimedByUserId,
      type: 'pickup_completed',
      title: 'Pickup completed',
      message: `You completed "${listing.title}". Thank you for redistributing surplus food.`,
      isRead: false,
      createdAt: timestamp,
    });
  }

  return mongoMappers.listing(listing as unknown as Record<string, unknown>);
}

export async function markNotificationRead(id: string, user: SafeUser) {
  await connectToDatabase();
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: id, userId: user.id },
    { $set: { isRead: true } },
    { new: true },
  ).lean();

  if (!notification) throw new Error('Notification not found.');
  return mongoMappers.notification(notification as unknown as Record<string, unknown>);
}

export async function markAllNotificationsRead(user: SafeUser) {
  await connectToDatabase();
  await NotificationModel.updateMany({ userId: user.id }, { $set: { isRead: true } });
}

export async function setNgoVerification(id: string, approved: boolean, actingUser: SafeUser) {
  if (actingUser.role !== 'admin') {
    throw new Error('Only admins can verify NGOs.');
  }

  await connectToDatabase();
  const user = await UserModel.findOneAndUpdate(
    { _id: id, role: 'ngo' },
    { $set: { verificationStatus: approved ? 'verified' : 'rejected', updatedAt: now() } },
    { new: true },
  ).lean();

  if (!user) throw new Error('NGO not found.');

  await NotificationModel.create({
    _id: randomUUID(),
    userId: user._id,
    type: approved ? 'ngo_verified' : 'ngo_rejected',
    title: approved ? 'NGO approved' : 'NGO rejected',
    message: approved
      ? 'Your NGO account has been approved. You can now claim pickups.'
      : 'Your NGO account was rejected. Please contact the admin team.',
    isRead: false,
    createdAt: now(),
  });

  return mongoMappers.user(user as unknown as Record<string, unknown>);
}

export async function toggleUserActive(id: string, actingUser: SafeUser) {
  if (actingUser.role !== 'admin') {
    throw new Error('Only admins can update user status.');
  }

  await connectToDatabase();
  const current = await UserModel.findById(id).lean();
  if (!current) throw new Error('User not found.');
  if (current.role === 'admin' && current._id === actingUser.id) {
    throw new Error('You cannot deactivate your own admin account.');
  }

  const user = await UserModel.findByIdAndUpdate(
    id,
    { $set: { isActive: !current.isActive, updatedAt: now() } },
    { new: true },
  ).lean();

  if (!user) throw new Error('User not found.');
  if (!user.isActive) {
    await SessionModel.deleteMany({ userId: user._id });
  }

  return mongoMappers.user(user as unknown as Record<string, unknown>);
}

export async function getEnrichedListing(id: string) {
  await connectToDatabase();
  await readDb();
  const listingDoc = await ListingModel.findById(id).lean();
  if (!listingDoc) return null;

  const [donorDoc, claimerDoc] = await Promise.all([
    UserModel.findById(listingDoc.donorId).lean(),
    listingDoc.claimedByUserId ? UserModel.findById(listingDoc.claimedByUserId).lean() : Promise.resolve(null),
  ]);

  return {
    listing: mongoMappers.listing(listingDoc as unknown as Record<string, unknown>),
    donor: donorDoc ? mongoMappers.user(donorDoc as unknown as Record<string, unknown>) : null,
    claimer: claimerDoc ? mongoMappers.user(claimerDoc as unknown as Record<string, unknown>) : null,
  };
}

export function getStatusTone(status: ListingStatus) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-900';
    case 'claimed':
      return 'bg-amber-100 text-amber-900';
    case 'completed':
      return 'bg-sky-100 text-sky-900';
    case 'expired':
      return 'bg-slate-200 text-slate-800';
    case 'cancelled':
      return 'bg-rose-100 text-rose-900';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

export function getUserLabel(user?: User | SafeUser | null) {
  if (!user) return 'Unknown user';
  return user.role === 'ngo' && user.ngoName ? user.ngoName : user.name;
}
