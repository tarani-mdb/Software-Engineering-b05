# Waste Food Management App Implementation Spec

This document is a build-ready implementation guide derived from `FoodWasteManager_Report.docx` and adapted to the current repository, which is a Next.js app rather than a separate React + Express codebase.

## 1. Purpose

Build a web platform that connects:

- Donors who want to post surplus food
- NGOs and volunteers who can claim and collect food
- Admins who verify users, oversee operations, and track impact

The app must reduce food waste, improve pickup coordination, and provide measurable impact analytics.

## 2. Product Goals

- Let donors create and manage food donation listings
- Let NGOs/volunteers browse and claim available listings
- Prevent duplicate claims on the same listing
- Notify users at every critical status change
- Give admins a real-time operational dashboard
- Show personal and community impact statistics

## 3. Target Users

### Donor

- Household
- Restaurant
- Hotel
- Event organizer
- Food business

Core needs:

- Create a listing quickly
- Track claim and pickup status
- See personal impact stats

### NGO / Volunteer

- Browse active donations
- Filter by location, category, and time window
- Claim only eligible listings
- Mark pickups complete

### Admin

- Verify NGO accounts
- Monitor listings, pickups, and users
- Deactivate bad actors or unsafe listings
- Export reports and review analytics

## 4. Recommended Repo Direction

The report describes a MERN architecture, but this repo already uses Next.js App Router. Build the full product in this structure:

- Frontend: Next.js App Router with React and Tailwind
- Backend: Next.js route handlers under `app/api/*`
- Auth/session: JWT or signed session cookies
- Database: MongoDB with Mongoose
- Notifications: database-backed in-app notifications plus email
- Charts: Recharts or Chart.js

This keeps one deployable app and avoids splitting the codebase into separate frontend/backend projects.

## 5. Core Domain Model

### User

Fields:

- `id`
- `name`
- `email`
- `passwordHash`
- `phone`
- `role` = `donor | ngo | volunteer | admin`
- `ngoName` nullable
- `verificationStatus` = `not_required | pending | verified | rejected`
- `isActive`
- `address`
- `city`
- `state`
- `pincode`
- `geo` optional `{ lat, lng }`
- `createdAt`
- `updatedAt`

Rules:

- Donors do not require manual verification
- NGOs require admin verification before claiming
- Volunteers may optionally belong to an NGO
- Inactive users cannot log in or act on listings

### Listing

Fields:

- `id`
- `donorId`
- `title`
- `description`
- `foodType`
- `category`
- `quantityKg`
- `servings` optional
- `isVegetarian` optional
- `preparedAt`
- `expiresAt` optional
- `pickupWindowStart`
- `pickupWindowEnd`
- `pickupAddress`
- `pickupCity`
- `pickupState`
- `pickupPincode`
- `pickupGeo` optional `{ lat, lng }`
- `specialInstructions`
- `images` optional
- `status` = `active | claimed | completed | expired | cancelled`
- `claimedByUserId` nullable
- `claimedAt` nullable
- `completedAt` nullable
- `cancelledAt` nullable
- `createdAt`
- `updatedAt`

Rules:

- Only donors can create listings
- Only `active` listings are claimable
- Expired listings cannot be claimed
- Claimed listings can be completed only by claimant or admin

### Pickup

Fields:

- `id`
- `listingId`
- `donorId`
- `claimerUserId`
- `claimerRole`
- `status` = `claimed | completed | cancelled`
- `claimedAt`
- `completedAt` nullable
- `notes` optional
- `proofPhotoUrl` optional
- `createdAt`
- `updatedAt`

Rules:

- One active pickup per listing
- Create pickup record when listing is claimed

### Notification

Fields:

- `id`
- `userId`
- `type`
- `title`
- `message`
- `data` JSON
- `isRead`
- `createdAt`

Suggested types:

- `listing_created`
- `listing_claimed`
- `pickup_completed`
- `ngo_verification_pending`
- `ngo_verified`
- `ngo_rejected`
- `listing_expired`
- `admin_alert`

### ImpactStat

This can be computed on demand or materialized.

Fields if materialized:

- `userId`
- `totalListingsCreated`
- `totalListingsClaimed`
- `totalPickupsCompleted`
- `totalFoodRedistributedKg`
- `estimatedMealsServed`
- `estimatedMoneySaved`
- `estimatedCo2PreventedKg`
- `updatedAt`

## 6. Main User Flows

### Flow 1: Donor Registration

1. User signs up as `donor`
2. Account becomes active immediately
3. User lands on donor dashboard

### Flow 2: NGO Registration

1. User signs up as `ngo`
2. Account is created with `verificationStatus = pending`
3. Admin is notified
4. NGO can log in but cannot claim listings until verified

### Flow 3: Donor Creates Listing

1. Donor opens listing form
2. Fills food and pickup details
3. Listing is saved as `active`
4. Nearby NGOs/volunteers see it in browse view

### Flow 4: NGO/Volunteer Claims Listing

1. Verified NGO/eligible volunteer opens active listing
2. Clicks `Claim Pickup`
3. Server performs atomic claim
4. Listing becomes `claimed`
5. Donor receives notification

### Flow 5: Pickup Completion

1. Claimer marks pickup complete
2. Listing becomes `completed`
3. Pickup record closes
4. Donor and claimer stats update
5. Donor receives completion notification

### Flow 6: Admin Oversight

1. Admin reviews pending NGOs
2. Approves/rejects accounts
3. Monitors listings and pickups
4. Exports reports

## 7. Functional Requirements

### Authentication and Roles

- Signup with name, email, password, phone, address, and role
- Secure password hashing
- Login/logout
- Protected routes
- Role-based authorization

### Donor Features

- Create listing
- Edit active listing before claim
- Cancel own active listing
- View listing history
- View personal impact stats

### NGO / Volunteer Features

- Browse active listings
- Filter by category, city, pickup window, and status
- Claim a listing
- View claimed pickups
- Mark pickup complete
- View own activity stats

### Admin Features

- Admin dashboard summary cards
- NGO verification queue
- User management
- Listing moderation
- Pickup monitoring
- Analytics and export

### Notifications

- In-app notifications
- Optional email notifications
- Unread count in navbar

### Analytics

- Personal user stats
- Community totals
- Admin operational charts

## 8. Non-Functional Requirements

- Responsive on mobile and desktop
- Standard interactions should feel under 2 seconds
- Prevent duplicate claims with atomic database updates
- Validate all request payloads on server
- Use audit-friendly timestamps
- Protect all privileged endpoints with role checks

## 9. Pages and Routes

### Public

- `/` landing page
- `/auth/login`
- `/auth/signup`

### Shared Authenticated

- `/notifications`
- `/profile`

### Donor

- `/dashboard/donor`
- `/dashboard/donor/listings`
- `/dashboard/donor/listings/new`
- `/dashboard/donor/listings/[id]`
- `/dashboard/donor/impact`

### NGO / Volunteer

- `/dashboard/ngo`
- `/dashboard/ngo/listings`
- `/dashboard/ngo/pickups`
- `/dashboard/ngo/impact`

### Admin

- `/dashboard/admin`
- `/dashboard/admin/users`
- `/dashboard/admin/ngo-verification`
- `/dashboard/admin/listings`
- `/dashboard/admin/pickups`
- `/dashboard/admin/reports`

## 10. API Contract

Implement with Next.js route handlers.

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Listings

- `GET /api/listings`
- `POST /api/listings`
- `GET /api/listings/:id`
- `PATCH /api/listings/:id`
- `POST /api/listings/:id/cancel`
- `POST /api/listings/:id/claim`
- `POST /api/listings/:id/complete`

### Pickups

- `GET /api/pickups`
- `GET /api/pickups/:id`

### Notifications

- `GET /api/notifications`
- `POST /api/notifications/:id/read`
- `POST /api/notifications/read-all`

### Admin

- `GET /api/admin/summary`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/ngos/pending`
- `POST /api/admin/ngos/:id/approve`
- `POST /api/admin/ngos/:id/reject`
- `GET /api/admin/reports/impact`

### Analytics

- `GET /api/analytics/community`
- `GET /api/analytics/me`

## 11. Atomic Claim Logic

This is mandatory because the report explicitly calls out concurrent claim race conditions.

Mongo-style rule:

- Match listing only when `status = active`
- In one atomic update, set:
  - `status = claimed`
  - `claimedByUserId = currentUser.id`
  - `claimedAt = now`

If no document is updated:

- Return `409 Conflict`

This logic should live in a dedicated server action/service so it is not duplicated.

## 12. Validation Rules

### Signup

- Valid email
- Password minimum length
- Role required
- NGO requires organization name

### Listing

- `title` required
- `foodType` required
- `quantityKg > 0`
- `pickupWindowStart < pickupWindowEnd`
- `pickupWindowEnd` must be in the future at creation time
- Pickup address fields required

### Claim

- User must be verified if role is `ngo`
- Listing must be `active`
- Listing must not be expired
- Donor cannot claim own listing

### Complete Pickup

- Only claimer or admin can complete
- Listing must already be `claimed`

## 13. Suggested Folder Structure

```text
app/
  api/
    auth/
    listings/
    pickups/
    notifications/
    admin/
    analytics/
  auth/
    login/
    signup/
  dashboard/
    donor/
    ngo/
    admin/
  notifications/
  profile/
components/
  auth/
  dashboard/
  listings/
  notifications/
  charts/
  ui/
lib/
  auth/
  db/
  models/
  services/
  validations/
  analytics/
  notifications/
middleware.ts
```

## 14. Implementation Modules

### Module A: Foundation

- MongoDB connection
- User model
- Auth session/JWT utilities
- Role middleware
- Shared UI shell

### Module B: Auth

- Replace current mock/in-memory auth flow
- Persist users in MongoDB
- Add role and verification fields
- Add auth guards for dashboards

### Module C: Listings

- Donor listing CRUD
- Listing browse page
- Filters and status badges

### Module D: Pickup Coordination

- Claim endpoint with atomic update
- Claimed pickup dashboard
- Completion flow

### Module E: Notifications

- Notification schema
- Notification center page
- Navbar unread badge
- Email adapter

### Module F: Analytics

- Community totals
- User contribution stats
- Admin charts and report endpoints

### Module G: Admin

- NGO verification queue
- User moderation
- Listing moderation
- Exportable reports

## 15. UI Requirements

- Keep landing page mission-focused and green-themed
- Role-specific dashboards must show only relevant actions
- Listing cards should always show:
  - food type
  - quantity
  - pickup area
  - pickup window
  - current status
- Include mobile-friendly tables or card fallbacks for admin screens
- Show clear empty states and error states

## 16. Dashboard Requirements

### Donor Dashboard

- Summary cards:
  - active listings
  - claimed listings
  - completed donations
  - total kg donated
- Recent listings table/card list
- `Post New Donation` CTA

### NGO Dashboard

- Summary cards:
  - available nearby listings
  - claimed pickups
  - completed pickups
  - total kg collected
- Browse listings section
- Claimed pickups queue

### Admin Dashboard

- Summary cards:
  - total users
  - pending NGOs
  - active listings
  - completed pickups
  - total food redistributed
- Charts:
  - listings by status
  - pickups over time
  - users by role

## 17. Notification Triggers

- NGO registration submitted -> notify admin
- NGO approved/rejected -> notify NGO
- Listing created -> optionally notify nearby NGOs/volunteers
- Listing claimed -> notify donor
- Pickup completed -> notify donor and claimer
- Listing expired -> notify donor

## 18. Analytics Formulas

Use configurable constants so values can be tuned later.

Suggested derived metrics:

- `estimatedMealsServed = floor(quantityKg * 2.5)`
- `estimatedMoneySaved = quantityKg * AVG_FOOD_VALUE_PER_KG`
- `estimatedCo2PreventedKg = quantityKg * AVG_CO2_SAVED_PER_KG`

Community analytics should aggregate:

- total active donors
- total verified NGOs
- total listings created
- total pickups completed
- total food redistributed kg
- estimated meals served
- estimated money saved
- estimated CO2 prevented

## 19. Security Requirements

- Hash passwords with bcrypt
- Never return password hashes
- Protect privileged routes with role checks
- Sanitize and validate all payloads
- Use secure cookies if session-based auth is chosen
- Rate-limit auth endpoints if possible
- Log moderation and approval actions

## 20. Testing Plan

### Unit Tests

- Auth validators
- Listing validators
- Claim service
- Analytics calculators

### Integration Tests

- Signup/login flow
- Donor listing creation
- NGO claim flow
- Admin NGO approval flow
- Notification creation on major events

### End-to-End Scenarios

- Donor creates listing -> NGO claims -> NGO completes pickup
- Unverified NGO tries to claim and is blocked
- Two NGOs attempt to claim same listing and only one succeeds
- Admin deactivates user and access is revoked

## 21. Delivery Order

Build in this order:

1. Database connection and schemas
2. Real authentication and role-aware sessions
3. Protected layouts and dashboard shells
4. Listing CRUD for donors
5. Listing browse + claim flow for NGO/volunteers
6. Notifications
7. Analytics
8. Admin moderation and reports
9. Automated tests
10. Production hardening

## 22. Immediate Gaps In Current Repo

The current repo already has:

- Landing page
- Signup page
- Login page
- Basic auth API stubs

The current repo still needs:

- Persistent database
- Real user model with roles
- Session handling
- All listing, pickup, notification, analytics, and admin features
- Protected route architecture
- Testing

## 23. Build Checklist

- [ ] Add MongoDB + Mongoose
- [ ] Define `User`, `Listing`, `Pickup`, `Notification` models
- [ ] Replace in-memory user storage
- [ ] Implement auth/session flow
- [ ] Add role-based route protection
- [ ] Build donor dashboard and listing form
- [ ] Build NGO browse and claim flow
- [ ] Implement atomic claim service
- [ ] Build completion flow
- [ ] Add notification center and email adapter
- [ ] Add analytics endpoints and charts
- [ ] Build admin verification and moderation pages
- [ ] Add automated tests
- [ ] Add seed data for local development

## 24. Final Implementation Notes

- Prefer Next.js server route handlers over introducing a separate Express server
- Keep business logic in `lib/services/*` so pages and APIs stay thin
- Use shared validation schemas for both client and server where possible
- Treat race-condition prevention on claim as a top-priority correctness requirement
- Build the app around role-specific dashboards, not a single generic dashboard

## 25. Suggested Next Step

Use this document as the implementation source of truth, then start with:

1. database setup
2. user schema + auth refactor
3. donor listing module

Those three unlock most of the rest of the product.
