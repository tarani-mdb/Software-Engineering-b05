import type { AppDb, Listing, SafeUser } from '@/lib/types';

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function completedListings(db: AppDb): Listing[] {
  return db.listings.filter((listing) => listing.status === 'completed');
}

export function computeCommunityStats(db: AppDb) {
  const completed = completedListings(db);
  const totalFoodRedistributedKg = completed.reduce((sum, listing) => sum + listing.quantityKg, 0);

  return {
    activeUsers: db.users.filter((user) => user.isActive).length,
    verifiedNgos: db.users.filter(
      (user) => user.role === 'ngo' && user.verificationStatus === 'verified' && user.isActive,
    ).length,
    totalListings: db.listings.length,
    activeListings: db.listings.filter((listing) => listing.status === 'active').length,
    completedPickups: db.pickups.filter((pickup) => pickup.status === 'completed').length,
    totalFoodRedistributedKg: round(totalFoodRedistributedKg),
    estimatedMealsServed: Math.floor(totalFoodRedistributedKg * 2.5),
    estimatedMoneySaved: round(totalFoodRedistributedKg * 180),
    estimatedCo2PreventedKg: round(totalFoodRedistributedKg * 2.1),
  };
}

export function computeUserStats(db: AppDb, user: SafeUser) {
  const donorListings = db.listings.filter((listing) => listing.donorId === user.id);
  const claimedPickups = db.pickups.filter((pickup) => pickup.claimerUserId === user.id);
  const completedDonations = donorListings.filter((listing) => listing.status === 'completed');
  const completedPickups = claimedPickups.filter((pickup) => pickup.status === 'completed');

  const totalFoodRedistributedKg =
    user.role === 'donor'
      ? completedDonations.reduce((sum, listing) => sum + listing.quantityKg, 0)
      : completedPickups.reduce((sum, pickup) => {
          const listing = db.listings.find((entry) => entry.id === pickup.listingId);
          return sum + (listing?.quantityKg ?? 0);
        }, 0);

  return {
    activeListings: donorListings.filter((listing) => listing.status === 'active').length,
    claimedListings: donorListings.filter((listing) => listing.status === 'claimed').length,
    completedDonations: completedDonations.length,
    claimedPickups: claimedPickups.filter((pickup) => pickup.status === 'claimed').length,
    completedPickups: completedPickups.length,
    totalFoodRedistributedKg: round(totalFoodRedistributedKg),
    estimatedMealsServed: Math.floor(totalFoodRedistributedKg * 2.5),
    estimatedMoneySaved: round(totalFoodRedistributedKg * 180),
    estimatedCo2PreventedKg: round(totalFoodRedistributedKg * 2.1),
  };
}

