# Manual Payment Verification System - Implementation Plan

## Tasks
- [ ] 1. Create payment config file (lib/payment-config.ts)
- [ ] 2. Update MonetaryDonation model - status: "pending" default
- [ ] 3. Create manual payment submission API (app/api/donations/manual-submit/route.ts)
- [ ] 4. Update frontend component - show payment instructions + transaction ID input
- [ ] 5. Create admin approval API (app/api/donations/monetary/[id]/approve/route.ts)
- [ ] 6. Create admin rejection API (app/api/donations/monetary/[id]/reject/route.ts)
- [ ] 7. Update admin dashboard to show pending donations with approve/reject

## Files to Create/Edit
1. lib/payment-config.ts (NEW)
2. server/models/MonetaryDonation.js (UPDATE - status default)
3. app/api/donations/manual-submit/route.ts (NEW)
4. app/api/donations/monetary/[id]/approve/route.ts (NEW)
5. app/api/donations/monetary/[id]/reject/route.ts (NEW)
6. components/donor/monetary-donation.tsx (UPDATE)
7. components/admin/transaction-ledger.tsx (UPDATE)

## Flow
1. Donor selects payment method (bKash/Nagad/Bank)
2. Shows admin payment number/account + amount
3. Donor enters Transaction ID from their app
4. Save to MongoDB (status: pending) + Blockchain (immutable)
5. Admin dashboard shows pending donations
6. Admin verifies manually and approves/rejects
7. Donor gets notification

