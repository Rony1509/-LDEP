import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import Task from "@/server/models/Task";
import Notification from "@/server/models/Notification";
import Feedback from "@/server/models/Feedback";

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MonetaryDonation.deleteMany({}),
      PhysicalDonation.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      Feedback.deleteMany({}),
    ]);

    // Create admin user with specified credentials
    const admin = await User.create({
      name: "System Admin",
      email: "bsse1504@iit.du.ac.bd",
      phone: "01700000000",
      role: "admin",
      password: "morshaline123",
    });

    // Create a welcome notification for admin
    await Notification.create({
      userId: admin._id,
      message: "Welcome to DonateChain! You can now register new donors and volunteers.",
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      credentials: {
        admin: "bsse1504@iit.du.ac.bd / morshaline123",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

