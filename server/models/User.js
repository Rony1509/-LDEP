import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "donor", "volunteer"],
      required: true,
    },
    password: { type: String, required: true },
    address: { type: String, default: "" },
    qualifications: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    volunteerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    // Location for smart volunteer assignment
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    serviceArea: { type: String, default: "" },
    // Referral system
    referralCode: { type: String, default: "" },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    referralPoints: { type: Number, default: 0 },
    // Volunteer availability
    isAvailable: { type: Boolean, default: true },
    activeTaskCount: { type: Number, default: 0 },
    currentTaskId: { type: String, default: null },

  },
  { timestamps: true }
);

// Prevent model overwrite error in development
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
