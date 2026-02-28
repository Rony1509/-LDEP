import mongoose from "mongoose";

const monetaryDonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorName: { type: String, required: true },
    email: { type: String },
    amount: { type: Number, required: true },
    method: { 
      type: String, 
      enum: ["bkash", "nagad", "card", "bank", "sslcommerz", "manual"], 
      required: true 
    },
    phone: { type: String, required: true },
    txHash: { type: String },
    blockNumber: { type: Number },
    // Manual payment fields
    manualTransactionId: { type: String },
    // SSL Commerz specific fields
    sslTransactionId: { type: String },
    sslValidationId: { type: String },
    cardType: { type: String },
    cardBrand: { type: String },
    cardIssuer: { type: String },
    bankName: { type: String },
    status: {
      type: String,
      enum: ["completed", "pending", "rejected"],
      default: "pending",
    },
    // Admin verification fields
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: { type: Date },
    adminNote: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite error in development
const MonetaryDonation = mongoose.models.MonetaryDonation || 
  mongoose.model("MonetaryDonation", monetaryDonationSchema);

export default MonetaryDonation;
