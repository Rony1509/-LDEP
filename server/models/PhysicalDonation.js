import mongoose from "mongoose";

const physicalDonationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorName: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    condition: {
      type: String,
      enum: ["New", "Like New", "Used", "Needs Repair", ""],
      default: "",
    },
    foodType: {
      type: String,
      enum: ["Cooked", "Packaged", ""],
      default: "",
    },
    expiryDate: { type: Date, default: null },
    location: { type: String, required: true },
    preferredDate: { type: Date, default: null },
    timeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", ""],
      default: "",
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    specialInstructions: { type: String, default: "" },
    rejectReason: { type: String, default: "" },
    blockNumber: { type: String, default: null },
    txHash: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

const PhysicalDonation =
  mongoose.models.PhysicalDonation ||
  mongoose.model("PhysicalDonation", physicalDonationSchema);

export default PhysicalDonation;