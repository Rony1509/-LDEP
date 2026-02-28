import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import Notification from "@/server/models/Notification";
import User from "@/server/models/User";
import donationBlockchain from "@/server/blockchain/blockchain";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { 
      donorId, 
      donorName, 
      email, 
      phone, 
      amount, 
      method,
      transactionId 
    } = body;

    // Validate required fields
    if (!donorId || !donorName || !phone || !amount || !method || !transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate transaction ID format (basic validation)
    if (transactionId.length < 5) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    // Record on blockchain (immutable)
    const block = donationBlockchain.addBlock({
      type: "monetary_donation",
      donorId,
      donorName,
      amount: Number(amount),
      method,
      phone,
      email: email || "N/A",
      transactionId,
      timestamp: new Date().toISOString(),
    });

    // Save to MongoDB with pending status
    const donation = await MonetaryDonation.create({
      donorId,
      donorName,
      email,
      amount: Number(amount),
      method,
      phone,
      txHash: `0x${block.hash}`,
      blockNumber: block.index,
      manualTransactionId: transactionId,
      status: "pending", // Default status is pending
    });

    // Create notification for admin
    try {
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        await Notification.create({
          userId: admin._id,
          message: `New donation of ৳${amount} from ${donorName} via ${method}. Transaction ID: ${transactionId}. Please verify.`,
        });
      }
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: "Donation submitted successfully. Waiting for admin verification.",
      donation: {
        id: donation._id.toString(),
        donorId: donation.donorId.toString(),
        donorName: donation.donorName,
        amount: donation.amount,
        method: donation.method,
        phone: donation.phone,
        transactionId: donation.manualTransactionId,
        txHash: donation.txHash,
        blockNumber: donation.blockNumber,
        status: donation.status,
        timestamp: donation.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Manual payment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit donation" },
      { status: 500 }
    );
  }
}

