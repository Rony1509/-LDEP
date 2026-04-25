import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { pendingTransactionsStore } from "@/lib/pending-transactions";

const storeId = process.env.SSL_STORE_ID || "morsh698b917e71378";
const storePassword = process.env.SSL_STORE_PASSWORD || "morsh698b917e71378@ssl";
const isLive = process.env.SSL_IS_LIVE === "true";
const successUrl = process.env.SSL_SUCCESS_URL || "http://localhost:3000/api/donations/sslcommerz/success";
const failUrl = process.env.SSL_FAIL_URL || "http://localhost:3000/api/donations/sslcommerz/fail";
const cancelUrl = process.env.SSL_CANCEL_URL || "http://localhost:3000/api/donations/sslcommerz/cancel";

const SSL_API_URL = isLive
  ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
  : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/?payment=error&message=Invalid payment request", request.url));
}

export async function POST(request: NextRequest) {
  try {
    const { donorId, donorName, email, phone, amount, method } = await request.json();

    if (!donorId) return NextResponse.json({ error: "Donor ID is required." }, { status: 400 });
    if (!donorName) return NextResponse.json({ error: "Donor name is required." }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    if (!amount || Number(amount) < 10) return NextResponse.json({ error: "Amount must be at least ৳10" }, { status: 400 });

    const tran_id = `TXN_${Date.now()}_${uuidv4().substring(0, 8)}`;

    pendingTransactionsStore.set(tran_id, {
      donorId,
      donorName,
      email,
      phone,
      amount: Number(amount),
      method,
      createdAt: new Date(),
    });

    // SSLCommerz API direct call using FormData
    const formData = new URLSearchParams();
    formData.append("store_id", storeId);
    formData.append("store_passwd", storePassword);
    formData.append("total_amount", String(Number(amount)));
    formData.append("currency", "BDT");
    formData.append("tran_id", tran_id);
    formData.append("success_url", successUrl);
    formData.append("fail_url", failUrl);
    formData.append("cancel_url", cancelUrl);
    formData.append("cus_name", donorName);
    formData.append("cus_email", email);
    formData.append("cus_phone", phone);
    formData.append("cus_add1", "Bangladesh");
    formData.append("cus_country", "Bangladesh");
    formData.append("shipping_method", "NO");
    formData.append("product_name", "Donation");
    formData.append("product_category", "Donation");
    formData.append("product_profile", "general");

    const sslResponse = await fetch(SSL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const apiResponse = await sslResponse.json();

    if (apiResponse?.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        url: apiResponse.GatewayPageURL,
        tran_id,
      });
    }

    console.error("SSLCommerz response:", apiResponse);
    return NextResponse.json(
      { error: apiResponse?.failedreason || "Failed to get payment URL from SSLCommerz" },
      { status: 500 }
    );

  } catch (error) {
    console.error("SSL Commerz init error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}