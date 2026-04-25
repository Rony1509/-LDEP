# TODO - Smart Volunteer Assignment System

## Task Description
Implement smart volunteer assignment with the following features:

1. **Volunteer Address Feature** - Add address field to volunteer registration
2. **Enhanced Smart Assignment** - GPS first, then area coordinates fallback
3. **Queue System** - FIFO with distance priority
4. **Auto-Assignment** - When volunteer completes task, auto-assign pending donations

## Implementation Status

### 1. Volunteer Address Feature
- [x] Add `address` field to volunteer registration API (`app/api/auth/register/volunteer/route.ts`)
- [x] Add address field to VolunteerRegisterForm in `components/auth-modal.tsx`
- [x] Update auth-context.tsx to pass address parameter
- [x] Update store.ts to include address in registration

### 2. Area Coordinates Mapping
- [x] Create `lib/areaCoordinates.ts` with Dhaka areas mapping (30+ areas)
- [x] Include common areas: Mirpur, Dhanmondi, Uttara, Mohammadpur, Gulshan, Banani, Rayer Bazar, Badda, Khilgaon, Charkhanpur, Mohampur, Golabbag, etc.

### 3. Enhanced Smart Assignment
- [x] Update `app/api/volunteers/nearest/route.ts` with:
  - Priority 1: Find volunteers with GPS location data
  - Priority 2: Fallback to area coordinates mapping
  - Priority 3: Return all approved volunteers as last resort
- [x] Add `hasLocationData` flag to response

### 4. Auto-Assignment on Task Completion
- [x] Update `app/api/tasks/[id]/status/route.ts` with auto-assignment logic:
  - Check if volunteer has no active tasks (is free)
  - Find pending donations
  - Calculate distance and find nearest donation
  - Auto-assign if within 50km
  - Send notification to volunteer

## Files Modified
1. `app/api/auth/register/volunteer/route.ts`
2. `components/auth-modal.tsx`
3. `lib/auth-context.tsx`
4. `lib/store.ts`
5. `lib/areaCoordinates.ts` (new file)
6. `app/api/volunteers/nearest/route.ts`
7. `app/api/tasks/[id]/status/route.ts`

