import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PhysicalDonation",
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteerName: { type: String, required: true },
    donorName: { type: String, required: true },
    donationType: { type: String, required: true },
    location: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    donorPhone: { type: String, default: "" },
distance: { type: String, default: "" },
estimatedTime: { type: String, default: "" },
    proofPhotoUrl: { type: String, default: "" },
    // Pickup location coordinates
    donorLatitude: { type: Number, default: null },
    donorLongitude: { type: Number, default: null },
    // Delivery location coordinates
    deliveryLatitude: { type: Number, default: null },
    deliveryLongitude: { type: Number, default: null },
    // Real-time volunteer location
    volunteerLatitude: { type: Number, default: null },
    volunteerLongitude: { type: Number, default: null },
    // Proof photos
    pickupPhotoUrl: { type: String, default: "" },
    deliveryPhotoUrl: { type: String, default: "" },
    
    assignedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    startedAt: { type: Date, default: null },
     
  },
  { timestamps: true }
);

// Prevent model overwrite error in development
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
