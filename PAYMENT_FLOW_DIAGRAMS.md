# SSLCommerz Payment & Blockchain Verification Flow

## 🔄 Donor Payment Flow Diagram

```
┌─────────────────────────────────────┐
│   Donor Dashboard                   │
│   "Donate Money" Section            │
└──────────────┬──────────────────────┘
               │
               ├─→ [Manual Payment Tab]
               │   ├─ bKash
               │   ├─ Nagad
               │   └─ Bank Transfer
               │       → Admin Verification → Blockchain
               │
               └─→ [SSLCommerz Payment Tab] ← NEW
                   ├─ Enter Amount (৳)
                   ├─ Enter Phone Number
                   └─ Click "Donate Now"
                       │
                       ↓
                   ┌──────────────────────┐
                   │ SSLCommerz Sandbox   │
                   │ Payment Page Opens   │
                   └──────────┬───────────┘
                              │
                              ├─ Select Payment Method
                              ├─ Enter OTP
                              └─ Click Success Button
                                  │
                                  ↓
                              ┌──────────────────────┐
                              │ Payment Successful   │
                              │ - Transaction ID     │
                              │ - TxHash             │
                              │ - Block Number       │
                              │ - Status: Verified   │
                              │ - "Go to Dashboard"  │
                              └──────────┬───────────┘
                                         │
                                         ↓
                              ┌──────────────────────┐
                              │ Donor Dashboard      │
                              │ Back to Main View    │
                              └──────────────────────┘
```

---

## 📊 Donor Verify Blockchain Flow

```
┌──────────────────────────────────────┐
│  Donor Dashboard                     │
│  Sidebar Navigation                  │
├──────────────────────────────────────┤
│ • Overview                           │
│ • Donate Money                       │
│ • Physical Items                     │
│ • Track Pickup                       │
│ • Verify Blockchain ← NEW ✨         │
│ • Feedback                           │
│ • Leaderboard                        │
│ • Profile                            │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Verify Blockchain View               │
├──────────────────────────────────────┤
│ [Stats Cards]                        │
│ ├─ Verified Donations: N             │
│ └─ Total Block Number: #XXXX         │
│                                      │
│ [Search Section]                     │
│ ├─ Search by TxHash                  │
│ ├─ Search by Transaction ID          │
│ └─ Search by Amount                  │
│                                      │
│ [Blockchain Records Table]           │
│ ├─ Amount (৳)                        │
│ ├─ Payment Method [Badge]            │
│ ├─ Transaction ID                    │
│ ├─ Block #                           │
│ ├─ TxHash [Copy Button]              │
│ └─ Status: Verified ✓                │
└──────────────────────────────────────┘
```

---

## 👨‍💼 Admin Blockchain Verification Flow

```
┌──────────────────────────────────────┐
│  Admin Dashboard                     │
│  Sidebar Navigation                  │
├──────────────────────────────────────┤
│ • Overview                           │
│ • Volunteers                         │
│ • Donations                          │
│ • Tasks                              │
│ • Live Map                           │
│ • Blockchain ← ENHANCED ✨           │
│ • Leaderboard                        │
│ • Feedback                           │
│ • Messages                           │
│ • Profile                            │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Admin Blockchain Verification View   │
├──────────────────────────────────────┤
│ [Statistics]                         │
│ ├─ Verified Donations: N             │
│ └─ Total Block Numbers: #XXXX        │
│                                      │
│ [Advanced Search]                    │
│ ├─ [Donor Name] [Phone] [TxHash]     │
│ └─ Search Input + Clear Button       │
│                                      │
│ [Verified Records Table]             │
│ ├─ Donor Name                        │
│ ├─ Phone Number                      │
│ ├─ Amount (৳)                        │
│ ├─ Payment Method [Colored Badge]    │
│ │  ├─ bKash [Purple]                 │
│ │  ├─ Nagad [Orange]                 │
│ │  ├─ Bank [Blue]                    │
│ │  └─ SSLCommerz [Green]             │
│ ├─ Transaction ID                    │
│ ├─ Block #                           │
│ ├─ TxHash [Truncated, Copy Btn]      │
│ └─ Status: Verified ✓                │
│                                      │
│ [Information Card]                   │
│ └─ Blockchain verification details   │
└──────────────────────────────────────┘
```

---

## 💰 Payment Method Comparison

| Feature | Manual Payment | SSLCommerz |
|---------|---|---|
| **Setup Time** | Instant | Instant |
| **Payment Methods** | bKash, Nagad, Bank | Credit/Debit Card, Mobile Banking |
| **Verification** | Admin Manual | Automatic |
| **Blockchain Recording** | After verification | Immediate |
| **Transaction Time** | 24-48 hours | Real-time |
| **Cost** | Bank-dependent | SSLCommerz fees |
| **User Experience** | Manual entry | Automated |
| **Sandbox Testing** | Demo mode | Fully simulated |

---

## 🔐 Data Flow: SSLCommerz to Blockchain

```
User Input (Amount + Phone)
        │
        ↓
SSLCommerz API Initiation
        │
        ↓
Sandbox Payment Page
        │
        ├─ Select Payment Method
        ├─ Enter OTP
        └─ Click Success
        │
        ↓
SSLCommerz Success Handler
        │
        ├─ Validate Transaction
        ├─ Generate Unique TxHash
        ├─ Assign Block Number
        └─ Record Payment Method
        │
        ↓
MongoDB Storage (MonetaryDonation)
        │
        ├─ donorId
        ├─ donorName
        ├─ amount
        ├─ method: "sslcommerz"
        ├─ phone
        ├─ sslTransactionId (from SSLCommerz)
        ├─ txHash (blockchain hash)
        ├─ blockNumber (blockchain block)
        ├─ status: "completed"
        └─ timestamp
        │
        ↓
Blockchain Recording
        │
        ├─ Create immutable transaction record
        ├─ Generate unique TxHash
        ├─ Assign sequential block number
        └─ Make available for verification
        │
        ↓
Donor Can View in "Verify Blockchain"
Donor Can Share TxHash for Proof
```

---

## 📱 Component Architecture

```
Donor Dashboard
├── Overview
├── Donate Money (MonetaryDonation.tsx)
│   ├── Manual Payment Section
│   │   └── Radio selection for bKash/Nagad/Bank
│   └── SSLCommerz Payment Section
│       └── SSLCommerzPaymentForm.tsx
│           ├── Amount Input
│           ├── Phone Input
│           ├── Payment Processing
│           └── Receipt Display
├── Physical Items
├── Track Pickup
├── Verify Blockchain (DonorVerifyBlockchain.tsx) ← NEW
│   ├── Statistics Cards
│   ├── Search Section
│   └── Blockchain Records Table
├── Feedback
├── Leaderboard
└── Profile

Admin Dashboard
├── Overview
├── Volunteers
├── Donations
├── Tasks
├── Live Map
├── Blockchain (AdminBlockchainVerification.tsx) ← NEW
│   ├── Statistics Cards
│   ├── Advanced Search
│   └── Verified Records Table
├── Leaderboard
├── Feedback
├── Messages
└── Profile
```

---

## 🎯 Key Features Checklist

### Donor Features
- ✅ SSLCommerz payment option
- ✅ Fast checkout (Amount + Phone)
- ✅ Sandbox payment simulation
- ✅ Transaction receipt display
- ✅ Blockchain verification view
- ✅ Transaction search by TxHash
- ✅ Copy TxHash to clipboard
- ✅ View payment method on record
- ✅ See transaction confirmation
- ✅ Block number verification

### Admin Features
- ✅ All verified donations dashboard
- ✅ Search by Donor Name
- ✅ Search by Phone Number
- ✅ Search by TxHash
- ✅ Color-coded payment methods
- ✅ Donation statistics
- ✅ Block number summary
- ✅ Copy TxHash button
- ✅ Donor information display
- ✅ Status verification

---

## 🚀 Database Schema

### MonetaryDonation Collection
```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref: User),
  donorName: String,
  email: String,
  amount: Number,
  method: "bkash" | "nagad" | "bank" | "sslcommerz",
  phone: String,
  txHash: String,           // Blockchain hash
  blockNumber: Number,       // Blockchain block
  manualTransactionId: String,    // For manual payments
  sslTransactionId: String,       // For SSLCommerz
  sslValidationId: String,        // SSLCommerz validation
  cardType: String,         // Credit/Debit
  cardBrand: String,        // Visa/Mastercard
  cardIssuer: String,       // Bank name
  bankName: String,         // For bank transfers
  status: "completed" | "pending" | "rejected",
  verifiedBy: ObjectId (ref: User),
  verifiedAt: Date,
  adminNote: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚡ Quick Reference

### Environment Variables Required
```
MONGODB_URI=mongodb+srv://...
SSL_STORE_ID=morsh698b917e71378
SSL_STORE_PASSWORD=morsh698b917e71378@ssl
SSL_IS_LIVE=false
SSL_DEMO_MODE=true
```

### API Endpoints
```
POST   /api/donations/sslcommerz/initiate
GET/POST /api/donations/sslcommerz/success
GET/POST /api/donations/sslcommerz/fail
GET/POST /api/donations/sslcommerz/cancel
GET    /api/donations/monetary
GET    /api/donations/monetary/donor/[donorId]
```

### Component Paths
```
components/donor/sslcommerz-payment-form.tsx
components/donor/donor-verify-blockchain.tsx
components/admin/admin-blockchain-verification.tsx
```

---

**Implementation Complete! 🎉**
All features are ready for testing and deployment.
