import { NextRequest, NextResponse } from "next/server";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import { pendingTransactionsStore } from "@/lib/pending-transactions";

// SSL Commerz credentials from environment variables
const storeId = process.env.SSL_STORE_ID || "morsh698b917e71378";
const storePassword = process.env.SSL_STORE_PASSWORD || "morsh698b917e71378@ssl";
const isLive = process.env.SSL_IS_LIVE === "true";
const successUrl = process.env.SSL_SUCCESS_URL || "http://localhost:3000/api/donations/sslcommerz/success";
const failUrl = process.env.SSL_FAIL_URL || "http://localhost:3000/api/donations/sslcommerz/fail";
const cancelUrl = process.env.SSL_CANCEL_URL || "http://localhost:3000/api/donations/sslcommerz/cancel";

// Handle GET request - redirect to home with error
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/?payment=error&message=Invalid payment request", request.url));
}

export async function POST(request: NextRequest) {
  try {
    const { donorId, donorName, email, phone, amount, method } = await request.json();

    if (!donorId || !donorName || !email || !phone || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const tran_id = `TXN_${Date.now()}_${uuidv4().substring(0, 8)}`;

    // Store pending transaction
    pendingTransactionsStore.set(tran_id, {
      donorId,
      donorName,
      email,
      phone,
      amount: Number(amount),
      method,
      createdAt: new Date(),
    });

    // Check if running in demo mode (no real SSL Commerz)
    if (process.env.SSL_DEMO_MODE === "true" || !storeId || !storePassword) {
      // Demo mode - return a fake URL that will trigger the success callback
      return NextResponse.json({
        success: true,
        url: `/api/donations/sslcommerz/success?tran_id=${tran_id}&demo=true`,
        tran_id,
        isDemo: true,
      });
    }

    // Prepare SSL Commerz payment data
    const data = {
      total_amount: Number(amount),
      currency: "BDT",
      tran_id,
      success_url: successUrl,
      fail_url: failUrl,
      cancel_url: cancelUrl,
      cus_name: donorName,
      cus_email: email,
      cus_phone: phone,
      cus_add1: "Bangladesh",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: "Donation",
      product_category: "Donation",
      product_profile: "general",
    };

    // Initialize SSL Commerz payment
    try {
      const sslcz = new SSLCommerzPayment(storeId, storePassword, isLive);
      const apiResponse = await sslcz.init(data);

      if (apiResponse?.GatewayPageURL) {
        return NextResponse.json({
          success: true,
          url: apiResponse.GatewayPageURL,
          tran_id,
        });
      }
    } catch (sslError) {
      console.error("SSL Commerz error:", sslError);
      // Fall through to demo mode
    }

    // Demo mode fallback - if SSL Commerz fails
    console.log("Falling back to demo mode");
    return NextResponse.json({
      success: true,
      url: `/api/donations/sslcommerz/success?tran_id=${tran_id}&demo=true`,
      tran_id,
      isDemo: true,
    });
  } catch (error) {
    console.error("SSL Commerz init error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
