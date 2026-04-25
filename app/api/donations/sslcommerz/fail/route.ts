import { NextRequest, NextResponse } from "next/server";
import { pendingTransactionsStore } from "@/lib/pending-transactions";

// Handle GET request - SSL Commerz redirects here on failure
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tran_id = searchParams.get("tran_id");
    const status = searchParams.get("status");

    // Clean up pending transaction
    if (tran_id) {
      pendingTransactionsStore.delete(tran_id);
    }

    const message = encodeURIComponent("Your payment was not completed. Please try again.");

    // Redirect to payment fail page
    return NextResponse.redirect(
      new URL(`/payment/fail?tran_id=${tran_id || ""}&message=${message}`, request.url)
    );
  } catch (error) {
    console.error("Payment fail GET handler error:", error);
    return NextResponse.redirect(
      new URL("/payment/fail", request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tran_id, status, amount } = body;

    // Clean up pending transaction
    if (tran_id) {
      pendingTransactionsStore.delete(tran_id);
    }

    return NextResponse.json({
      success: false,
      message: "Payment failed",
      tran_id,
      status,
      amount,
    });
  } catch (error) {
    console.error("Payment fail handler error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
