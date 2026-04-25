# Google Maps Volunteer Tracking - Implementation Plan

## Information Gathered

### Current Project Structure

**Volunteer Dashboard (`components/volunteer/volunteer-dashboard.tsx`)**
- Currently has 3 tabs: Overview, My Tasks, Profile
- `volunteer-tasks.tsx` already has Pending/In Progress/Completed sections with task management

**Admin Dashboard (`components/admin/admin-dashboard.tsx`)**
- Has tabs: Overview, Volunteers, Donations, Tasks, Blockchain, Leaderboard, Feedback, Profile
- `task-management.tsx` for assigning tasks

**Donor Dashboard (`components/donor/donor-dashboard.tsx`)**
- Has tabs: Overview, Donate Money, Physical Items, Feedback, Leaderboard, Profile
- `donor-overview.tsx` shows donation stats

**Backend**
- `server/models/Task.js` - Task schema without location tracking
- `app/api/tasks/route.ts` - Task CRUD endpoints
- `lib/store.ts` - API client functions

---

## Plan

### Phase 1: Backend - Volunteer Location API

1. **Update Task Model** (`server/models/Task.js`)
   - Add `donorLatitude`, `donorLongitude` fields for pickup location
   - Add `deliveryLatitude`, `deliveryLongitude` fields for delivery location
   - Add `volunteerLatitude`, `volunteerLongitude` fields for real-time tracking

2. **Create Volunteer Location API** (`app/api/volunteer/location/route.ts`)
   - POST endpoint: Volunteer sends location updates (every 30 seconds)
   - GET endpoint: Admin/Donor fetches active volunteer locations

3. **Update Store** (`lib/store.ts`)
   - Add `updateVolunteerLocation(volunteerId, lat, lng)` function
   - Add `getActiveVolunteerLocations()` function
   - Add `getVolunteerLocationByTask(taskId)` function

### Phase 2: Volunteer Dashboard Updates

4. **Update Volunteer Dashboard Tabs** (`components/volunteer/volunteer-dashboard.tsx`)
   - Add "My Location" tab with tracking toggle
   - Add "Upload Proof" tab for photo upload
   - Keep Profile but enhance with stats

5. **Create Volunteer My Location Component** (`components/volunteer/volunteer-my-location.tsx`)
   - Toggle switch "Start Tracking"
   - useEffect with Geolocation API (every 30 seconds)
   - POST location to backend
   - Show current coordinates

6. **Create Volunteer Upload Proof Component** (`components/volunteer/volunteer-upload-proof.tsx`)
   - Show active task details
   - Photo upload for "Before Pickup" and "After Delivery"
   - URL input for photo proof (or file upload simulation)

7. **Enhance Profile Tab** (`components/profile-settings.tsx`)
   - Add "Total completed tasks" stat
   - Add "Average rating" from feedback
   - Add "Badges/Rewards" section

### Phase 3: Admin Dashboard - Google Maps Integration

8. **Add Volunteer Map Tab** (`components/admin/admin-dashboard.tsx`)
   - Add new tab "Live Map" with Map icon

9. **Create Admin Volunteer Map Component** (`components/admin/volunteer-live-map.tsx`)
   - Google Maps JavaScript API integration
   - Show all active volunteer locations as pins
   - Show routes to pickup locations using Directions API
   - List of volunteers with status

### Phase 4: Donor Dashboard - Track Pickup

10. **Add Track Pickup Section** (`components/donor/donor-overview.tsx` or new component)
    - "Track My Pickup" button for active donations
    - Show volunteer distance and ETA
    - Google Maps embed showing volunteer location

---

## Files to be Edited/Created

### New Files to Create:
1. `app/api/volunteer/location/route.ts` - Location API
2. `components/volunteer/volunteer-my-location.tsx` - Location tracking
3. `components/volunteer/volunteer-upload-proof.tsx` - Proof upload
4. `components/admin/volunteer-live-map.tsx` - Admin map view
5. `components/donor/donor-track-pickup.tsx` - Donor tracking

### Files to Edit:
1. `server/models/Task.js` - Add location fields
2. `lib/types.ts` - Add location types
3. `lib/store.ts` - Add location store functions
4. `components/volunteer/volunteer-dashboard.tsx` - Add new tabs
5. `components/admin/admin-dashboard.tsx` - Add Live Map tab
6. `components/donor/donor-dashboard.tsx` - Add Track Pickup

---

## Environment Variables Required
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps JavaScript API key

---

## Followup Steps
1. Test geolocation permission in browser
2. Test real-time location updates
3. Test admin map rendering with sample coordinates
4. Test donor tracking view

---

## Google Maps Integration Code Structure

```
javascript
// Volunteer location tracking (useEffect)
useEffect(() => {
  if (isTracking) {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetch('/api/volunteer/location', {
          method: 'POST',
          body: JSON.stringify({
            volunteerId: user.id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        })
      })
    }, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }
}, [isTracking])
