# TODO - Fix Donation Approval Error

## Task
Fix "Failed to approve donation" console error by adding proper ID validation in the API route.

## Steps:
- [x] 1. Analyze the error and understand the codebase
- [x] 2. Add proper MongoDB ObjectId validation to approve route
- [x] 3. Add proper MongoDB ObjectId validation to reject route (for consistency)

## Details
- Error: "Failed to approve donation" at components/admin/transaction-ledger.tsx:68
- Cause: Invalid donation ID not being validated before MongoDB query
- Solution: Added ObjectId validation using mongoose.Types.ObjectId.isValid() and return proper error messages
- Admin mobile number 01405091911 already configured in lib/payment-config.ts

