import mongoose, { Model, Schema } from 'mongoose';
import { randomUUID } from 'crypto';
import type { ListingStatus, NotificationType, PickupStatus, UserRole, VerificationStatus } from '@/lib/types';

const userSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin'] satisfies UserRole[], required: true },
    ngoName: { type: String, trim: true },
    verificationStatus: {
      type: String,
      enum: ['not_required', 'pending', 'verified', 'rejected'] satisfies VerificationStatus[],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false },
);

const listingSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    donorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    foodType: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantityKg: { type: Number, required: true },
    servings: Number,
    isVegetarian: Boolean,
    preparedAt: { type: Date, required: true },
    expiresAt: Date,
    pickupWindowStart: { type: Date, required: true },
    pickupWindowEnd: { type: Date, required: true, index: true },
    pickupAddress: { type: String, required: true, trim: true },
    pickupCity: { type: String, required: true, trim: true },
    pickupState: { type: String, required: true, trim: true },
    pickupPincode: { type: String, required: true, trim: true },
    specialInstructions: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'claimed', 'completed', 'expired', 'cancelled'] satisfies ListingStatus[],
      required: true,
      index: true,
    },
    claimedByUserId: { type: String, index: true },
    claimedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true, versionKey: false },
);

const pickupSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    listingId: { type: String, required: true, index: true },
    donorId: { type: String, required: true, index: true },
    claimerUserId: { type: String, required: true, index: true },
    claimerRole: { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin'] satisfies UserRole[], required: true },
    status: { type: String, enum: ['claimed', 'completed', 'cancelled'] satisfies PickupStatus[], required: true },
    claimedAt: { type: Date, required: true },
    completedAt: Date,
    notes: String,
  },
  { timestamps: true, versionKey: false },
);

const notificationSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        'listing_created',
        'listing_claimed',
        'pickup_completed',
        'ngo_verification_pending',
        'ngo_verified',
        'ngo_rejected',
        'listing_expired',
        'admin_alert',
      ] satisfies NotificationType[],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, updatedAt: false },
);

const sessionSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, updatedAt: false },
);

export type UserDocument = mongoose.InferSchemaType<typeof userSchema>;
export type ListingDocument = mongoose.InferSchemaType<typeof listingSchema>;
export type PickupDocument = mongoose.InferSchemaType<typeof pickupSchema>;
export type NotificationDocument = mongoose.InferSchemaType<typeof notificationSchema>;
export type SessionDocument = mongoose.InferSchemaType<typeof sessionSchema>;

export const UserModel: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
export const ListingModel: Model<ListingDocument> =
  mongoose.models.Listing || mongoose.model<ListingDocument>('Listing', listingSchema);
export const PickupModel: Model<PickupDocument> =
  mongoose.models.Pickup || mongoose.model<PickupDocument>('Pickup', pickupSchema);
export const NotificationModel: Model<NotificationDocument> =
  mongoose.models.Notification || mongoose.model<NotificationDocument>('Notification', notificationSchema);
export const SessionModel: Model<SessionDocument> =
  mongoose.models.Session || mongoose.model<SessionDocument>('Session', sessionSchema);
