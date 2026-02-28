import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import Notification from "@/server/models/Notification";
import User from "@/server/models/User";
import donationBlockchain from "@/server/blockchain/blockchain";
import { pendingTransactionsStore } from "@/lib/pending-transactions";

// Handle GET request - SSL Commerz redirects here after payment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tran_id = searchParams.get("tran_id");
    const status = searchParams.get("status");
    const isDemo = searchParams.get("demo") === "true";

    if (!tran_id) {
      // Redirect to frontend with error
      return NextResponse.redirect(
        new URL("/?payment=error&message=Missing transaction ID", request.url)
      );
    }

    if (status === "FAILED" || status === "CANCELLED") {
      pendingTransactionsStore.delete(tran_id);
      return NextResponse.redirect(
        new URL(`/?payment=failed&tran_id=${tran_id}`, request.url)
      );
    }

    // For demo mode, redirect to frontend with success params
    if (isDemo) {
      return NextResponse.redirect(
        new URL(`/?payment=success&tran_id=${tran_id}&demo=true`, request.url)
      );
    }

    // Redirect to frontend to handle the actual payment processing
    return NextResponse.redirect(
      new URL(`/?payment=success&tran_id=${tran_id}`, request.url)
    );
  } catch (error) {
    console.error("Payment success GET handler error:", error);
    return NextResponse.redirect(
      new URL("/?payment=error&message=Unknown error", request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { 
      tran_id, 
      amount, 
      card_type, 
      card_brand,
      card_issuer,
      bank_tran_id,
      val_id,
      status 
    } = body;

    // Validate required fields
    if (!tran_id || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map payment method to valid enum values
    const mapMethodToEnum = (methodVal: string | undefined, cardType: string | undefined): string => {
      const val = methodVal || cardType || "";
      const lowerVal = val.toLowerCase();
      
      if (lowerVal.includes("bkash") || lowerVal.includes("bKash")) return "bkash";
      if (lowerVal.includes("nagad") || lowerVal.includes("Nagad")) return "nagad";
      if (lowerVal.includes("card") || lowerVal.includes("visa") || lowerVal.includes("master")) return "card";
      if (lowerVal.includes("ssl") || lowerVal.includes("digital")) return "sslcommerz";
      
      // Default to sslcommerz for demo mode
      return "sslcommerz";
    };

    // Get pending transaction data
    const pendingData = pendingTransactionsStore.get(tran_id);
    
    // For demo mode or when pending transaction is not found
    let donorId = pendingData?.donorId;
    let donorName = pendingData?.donorName;
    let email = pendingData?.email;
    let phone = pendingData?.phone;
    let method = pendingData?.method;
    let donationAmount = Number(amount);

    // If no pending data, try to find a donor user or use a default
    if (!pendingData || !donorId) {
      console.log("No pending transaction found, using demo mode");
      
      // Try to find a donor user to associate with
      const donorUser = await User.findOne({ role: "donor" });
      
      if (donorUser) {
        donorId = donorUser._id.toString();
        donorName = donorUser.name || "Demo Donor";
        email = donorUser.email || body.email || "demo@example.com";
      } else {
        // Use the body data if available
        donorId = body.donorId || undefined;
        donorName = body.donorName || "Demo Donor";
        email = body.email || "demo@example.com";
      }
      phone = body.phone || "+8801234567890";
      method = "sslcommerz"; // Use valid enum value
    }

    // If donorId is still not a valid ObjectId, we need to find a donor
    if (donorId && typeof donorId === "string" && !donorId.match(/^[0-9a-fA-F]{24}$/)) {
      const donorUser = await User.findOne({ role: "donor" });
      if (donorUser) {
        donorId = donorUser._id.toString();
        donorName = donorUser.name || donorName;
        email = donorUser.email || email;
      }
    }

    // Map the method to valid enum value
    const validatedMethod = mapMethodToEnum(method, card_type);

    // Check payment status
    if (status === "FAILED" || status === "CANCELLED") {
      pendingTransactionsStore.delete(tran_id);
      return NextResponse.json(
        { error: `Payment ${status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Step 1: Record on blockchain
    const block = donationBlockchain.addBlock({
      type: "monetary_donation",
      donorId,
      donorName,
      amount: donationAmount,
      method: method || "demo",
      phone: phone || "N/A",
      email: email || "N/A",
      sslTransactionId: bank_tran_id || tran_id,
      sslValidationId: val_id,
      cardType: card_type || "N/A",
      cardBrand: card_brand || "N/A",
      cardIssuer: card_issuer || "N/A",
      timestamp: new Date().toISOString(),
    });

    // Step 2: Save to MongoDB
    // Make sure donorId is a valid ObjectId
    let donorIdForDb = donorId;
    if (donorId && typeof donorId === "object" && "_id" in donorId) {
      donorIdForDb = (donorId as Record<string, any>)._id;
    }

    const donation = await MonetaryDonation.create({
      donorId: donorIdForDb,
      donorName,
      email,
      amount: donationAmount,
      method: validatedMethod,
      phone,
      txHash: `0x${block.hash}`,
      blockNumber: block.index,
      sslTransactionId: bank_tran_id || tran_id,
      sslValidationId: val_id,
      cardType: card_type,
      cardBrand: card_brand,
      cardIssuer: card_issuer,
      status: "completed",
    });

    // Clean up pending transaction
    if (pendingData) {
      pendingTransactionsStore.delete(tran_id);
    }

    // Step 3: Create notifications
    try {
      // Notify admin
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        await Notification.create({
          userId: admin._id,
          message: `New donation of ৳${donationAmount} from ${donorName} via ${card_type || method}`,
        });
      }

      // Notify donor
      if (donorId) {
        await Notification.create({
          userId: donorId,
          message: `Your donation of ৳${donationAmount} has been recorded on the blockchain. Transaction ID: ${tran_id}`,
        });
      }
    } catch (notifyError) {
      console.error("Notification error:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: "Payment successful and recorded",
      donation: {
        id: donation._id.toString(),
        donorId: donation.donorId.toString(),
        donorName: donation.donorName,
        amount: donation.amount,
        method: donation.method,
        phone: donation.phone,
        txHash: donation.txHash,
        blockNumber: donation.blockNumber,
        sslTransactionId: donation.sslTransactionId,
        timestamp: donation.createdAt.toISOString(),
        status: donation.status,
      },
    });
  } catch (error) {
    console.error("Payment success handler error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
