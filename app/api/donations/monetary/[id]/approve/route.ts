import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import Notification from "@/server/models/Notification";
import User from "@/server/models/User";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { donationId, adminId, note } = body;

    // Validate donationId is provided
    if (!donationId) {
      return NextResponse.json(
        { error: "Missing donation ID", success: false },
        { status: 400 }
      );
    }

    // Validate donationId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return NextResponse.json(
        { error: "Invalid donation ID format", success: false },
        { status: 400 }
      );
    }

    // Find the donation
    const donation = await MonetaryDonation.findById(donationId);
    
    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found", success: false },
        { status: 404 }
      );
    }

    // Check if already processed
    if (donation.status !== "pending") {
      return NextResponse.json(
        { error: `Donation already ${donation.status}`, success: false },
        { status: 400 }
      );
    }

    // Update donation status to completed
    // Generate unique blockchain record (monetary starts at 1, physical starts at 100)
    const monetaryCount = await MonetaryDonation.countDocuments({ status: "completed" });
    donation.blockNumber = monetaryCount + 1;
    donation.txHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");

    // Update donation status to completed
    donation.status = "completed";
    
    // Only set verifiedBy if it's a valid ObjectId
    if (adminId && typeof adminId === "string" && mongoose.Types.ObjectId.isValid(adminId) && adminId.match(/^[0-9a-fA-F]{24}$/)) {
      donation.verifiedBy = adminId;
    }
    
    donation.verifiedAt = new Date();
    if (note) {
      donation.adminNote = note;
    }
    
    await donation.save();

    // Notify donor
    try {
        await Notification.create({
  userId: donation.donorId,
  message: `We appreciate your donation. Thank you for supporting our mission.`,
});
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: "Donation approved successfully",
      donation: {
        id: donation._id.toString(),
        status: donation.status,
        verifiedAt: donation.verifiedAt,
        adminNote: donation.adminNote,
      },
    });
  } catch (error) {
    console.error("Approve donation error:", error);
    return NextResponse.json(
      { error: "Failed to approve donation", success: false },
      { status: 500 }
    );
  }
}

