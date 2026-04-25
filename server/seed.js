import mongoose from "mongoose";
import User from "./models/User.js";
import MonetaryDonation from "./models/MonetaryDonation.js";
import PhysicalDonation from "./models/PhysicalDonation.js";
import Task from "./models/Task.js";
import Notification from "./models/Notification.js";
import Feedback from "./models/Feedback.js";
import donationBlockchain from "./blockchain/blockchain.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://morshaline:VID9jQWVXNtlgXxw@cluster0.g8f964k.mongodb.net/LDEP?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MonetaryDonation.deleteMany({}),
      PhysicalDonation.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      Feedback.deleteMany({}),
    ]);
    console.log("Cleared existing data.");

    // Create admin user with specified credentials
    const admin = await User.create({
      name: "System Admin",
      email: "bsse1504@iit.du.ac.bd",
      phone: "01700000000",
      role: "admin",
      password: "morshaline123",
    });

    console.log("Admin user created.");
    console.log("");
    console.log("Seed completed successfully!");
    console.log("");
    console.log("Login credentials:");
    console.log("  Admin: bsse1504@iit.du.ac.bd / morshaline123");
    console.log("");
    console.log("Note: Donors and volunteers can register through the website.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

