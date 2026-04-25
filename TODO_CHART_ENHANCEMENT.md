# TODO - Chart Data Enhancement

## Task
Connect all charts to real data from MongoDB instead of placeholder/random values.

## Plan

### Phase 1: Create Chart Data API
- [x] 1. Create `/api/stats/charts` endpoint for comprehensive chart data
  - Monthly donation trends (monetary + physical count)
  - Category-wise physical donations (grouped by type)
  - Monthly active users (unique donors per month)
  - Volunteer performance (completed tasks per volunteer)
  - Area-wise donation data for map

### Phase 2: Update Admin Overview Charts
- [x] 2. Update admin-overview.tsx to use real API data
  - Donation Trends (Line Chart) - real monthly data
  - Donation Type Breakdown (Pie Chart) - real totals
  - Category-wise Physical Donations (Bar Chart) - real category counts
  - Volunteer Performance (Bar Chart) - real task counts
  - Monthly Active Users (Area Chart) - real unique donors

### Phase 3: Update Landing Page
- [x] 3. Update landing-page.tsx with real area-wise data
  - Live counter with actual totals
  - Map with real area distribution based on donor locations

## Implementation Steps

### Step 1: Create Chart Stats API ✅
- Created: `app/api/stats/charts/route.ts`

### Step 2: Add store function ✅
- Added `getChartStats()` to `lib/store.ts`

### Step 3: Update components ✅
- Updated `components/admin/admin-overview.tsx`
- Updated `components/landing-page.tsx`

## Status: COMPLETED ✅

