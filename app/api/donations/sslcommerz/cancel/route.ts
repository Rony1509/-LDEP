import { NextRequest, NextResponse } from "next/server";
import { pendingTransactionsStore } from "@/lib/pending-transactions";

// Handle GET request - SSL Commerz redirects here on cancellation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tran_id = searchParams.get("tran_id");

    // Clean up pending transaction
    if (tran_id) {
      pendingTransactionsStore.delete(tran_id);
    }

    // Redirect to payment cancel page
    return NextResponse.redirect(
      new URL(`/payment/cancel?tran_id=${tran_id || ""}`, request.url)
    );
  } catch (error) {
    console.error("Payment cancel GET handler error:", error);
    return NextResponse.redirect(
      new URL("/payment/cancel", request.url)
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
      message: "Payment cancelled",
      tran_id,
      status,
      amount,
    });
  } catch (error) {
    console.error("Payment cancel handler error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
