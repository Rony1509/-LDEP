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

    // Update donation status to rejected
    donation.status = "rejected";
    
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
        message: `Your donation of ৳${donation.amount} has been rejected. Transaction ID: ${donation.manualTransactionId}. Reason: ${note || "Invalid transaction"}`,
      });
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: "Donation rejected",
      donation: {
        id: donation._id.toString(),
        status: donation.status,
        verifiedAt: donation.verifiedAt,
        adminNote: donation.adminNote,
      },
    });
  } catch (error) {
    console.error("Reject donation error:", error);
    return NextResponse.json(
      { error: "Failed to reject donation", success: false },
      { status: 500 }
    );
  }
}

