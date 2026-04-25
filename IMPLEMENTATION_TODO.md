# Implementation TODO - Advanced Features

## Phase 1: Notification System Upgrade
- [x] Integrate email sending in monetary donation API
- [x] Integrate email sending in task assignment API  
- [x] Integrate email sending when delivery is completed
- [x] Integrate email sending when volunteer is approved

## Phase 2: Photo Proof System Enhancement
- [x] Update Task model to include proof photo URLs (already exists)
- [x] Create API to fetch proof photos for donors
- [x] Update donor dashboard to show proof photos

## Phase 3: Public Donation Impact Dashboard
- [x] Create public impact page at /impact
- [x] Implement area-wise donation stats
- [x] Add live counter to the impact page

## Phase 4: Smart Volunteer Assignment
- [x] Add location fields to User model (latitude, longitude)
- [x] Create distance calculation utility (lib/distance.ts)
- [x] Implement auto-suggest nearest volunteer API
- [x] Update task management to show nearest volunteers

## Phase 5: Volunteer Rating Stats
- [x] Add completion rate calculation to volunteer stats
- [x] Add average delivery time calculation
- [x] Create public volunteer profile/stats API
- [x] Display stats in volunteer management

## Phase 6: Referral System
- [x] Add referral fields to User model
- [x] Create referral code generation
- [x] Implement referral bonus points in leaderboard
- [x] Add referral API route

## Phase 7: Homepage Live Counter
- [x] Verify existing live counter functionality
- [x] Enhance with real-time updates

