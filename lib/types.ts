export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

export type VerificationStatus = 'not_required' | 'pending' | 'verified' | 'rejected';

export type ListingStatus = 'active' | 'claimed' | 'completed' | 'expired' | 'cancelled';

export type PickupStatus = 'claimed' | 'completed' | 'cancelled';

export type NotificationType =
  | 'listing_created'
  | 'listing_claimed'
  | 'pickup_completed'
  | 'ngo_verification_pending'
  | 'ngo_verified'
  | 'ngo_rejected'
  | 'listing_expired'
  | 'admin_alert';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
  ngoName?: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  donorId: string;
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
  status: ListingStatus;
  claimedByUserId?: string;
  claimedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pickup {
  id: string;
  listingId: string;
  donorId: string;
  claimerUserId: string;
  claimerRole: UserRole;
  status: PickupStatus;
  claimedAt: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface AppDb {
  users: User[];
  listings: Listing[];
  pickups: Pickup[];
  notifications: Notification[];
  sessions: Session[];
}

export type SafeUser = Omit<User, 'passwordHash'>;
