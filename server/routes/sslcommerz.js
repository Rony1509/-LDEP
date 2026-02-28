import { Router } from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import MonetaryDonation from "../models/MonetaryDonation.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import donationBlockchain from "../blockchain/blockchain.js";

const router = Router();

// In-memory store for pending transactions (in production, use Redis or database)
const pendingTransactions = new Map();

// SSL Commerz credentials from environment variables
const storeId = process.env.SSL_STORE_ID || "morsh698b917e71378";
const storePassword = process.env.SSL_STORE_PASSWORD || "morsh698b917e71378";
const isLive = process.env.SSL_IS_LIVE === "true";
const successUrl = process.env.SSL_SUCCESS_URL || "http://localhost:3000/payment/success";
const failUrl = process.env.SSL_FAIL_URL || "http://localhost:3000/payment/fail";
const cancelUrl = process.env.SSL_CANCEL_URL || "http://localhost:3000/payment/cancel";

// POST /api/sslcommerz/initiate - Initialize payment
router.post("/initiate", async (req, res) => {
  try {
    const { donorId, donorName, email, phone, amount, method } = req.body;

    if (!donorId || !donorName || !email || !phone || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique transaction ID
    const tran_id = `TXN_${Date.now()}_${uuidv4().substring(0, 8)}`;

    // Store pending transaction
    pendingTransactions.set(tran_id, {
      donorId,
      donorName,
      email,
      phone,
      amount: Number(amount),
      method,
      createdAt: new Date(),
    });

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
    const sslcz = new SSLCommerzPayment(storeId, storePassword, isLive);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      return res.json({
        success: true,
        url: apiResponse.GatewayPageURL,
        tran_id,
      });
    } else {
      pendingTransactions.delete(tran_id);
      return res.status(500).json({ error: "Failed to initiate payment" });
    }
  } catch (error) {
    console.error("SSL Commerz init error:", error);
    return res.status(500).json({ error: "Payment initialization failed" });
  }
});

// POST /api/sslcommerz/success - Handle successful payment
router.post("/success", async (req, res) => {
  try {
    const { tran_id, val_id, amount, card_type, bank_tran_id } = req.body;

    // Get pending transaction
    const pendingTx = pendingTransactions.get(tran_id);
    if (!pendingTx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Record donation on blockchain
    const block = donationBlockchain.addBlock({
      type: "monetary_donation",
      donorId: pendingTx.donorId,
      donorName: pendingTx.donorName,
      amount: pendingTx.amount,
      method: pendingTx.method,
      phone: pendingTx.phone,
      val_id,
      bank_tran_id,
      timestamp: new Date().toISOString(),
    });

    // Save donation to database
    const donation = await MonetaryDonation.create({
      donorId: pendingTx.donorId,
      donorName: pendingTx.donorName,
      amount: pendingTx.amount,
      method: pendingTx.method,
      phone: pendingTx.phone,
      txHash: `0x${block.hash}`,
      blockNumber: block.index,
      status: "completed",
      paymentDetails: {
        val_id,
        bank_tran_id,
        card_type,
        amount,
      },
    });

    // Notify admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        userId: admin._id,
        message: `New donation of ৳${pendingTx.amount} from ${pendingTx.donorName} (SSL Commerz)`,
      });
    }

    // Notify donor
    await Notification.create({
      userId: pendingTx.donorId,
      message: `Your donation of ৳${pendingTx.amount} has been recorded on the blockchain.`,
    });

    // Remove pending transaction
    pendingTransactions.delete(tran_id);

    // Redirect to frontend success page
    return res.redirect(`http://localhost:3000/payment/success?tran_id=${tran_id}`);
  } catch (error) {
    console.error("SSL Commerz success error:", error);
    return res.status(500).json({ error: "Payment processing failed" });
  }
});

// POST /api/sslcommerz/fail - Handle failed payment
router.post("/fail", async (req, res) => {
  try {
    const { tran_id } = req.body;

    // Get pending transaction
    const pendingTx = pendingTransactions.get(tran_id);
    if (pendingTx) {
      // Notify donor about failed payment
      await Notification.create({
        userId: pendingTx.donorId,
        message: `Your donation payment of ৳${pendingTx.amount} has failed. Please try again.`,
      });
      
      pendingTransactions.delete(tran_id);
    }

    // Redirect to frontend fail page
    return res.redirect(`http://localhost:3000/payment/fail?tran_id=${tran_id}`);
  } catch (error) {
    console.error("SSL Commerz fail error:", error);
    return res.status(500).json({ error: "Failed to process failed payment" });
  }
});

// POST /api/sslcommerz/cancel - Handle cancelled payment
router.post("/cancel", async (req, res) => {
  try {
    const { tran_id } = req.body;

    // Get pending transaction
    const pendingTx = pendingTransactions.get(tran_id);
    if (pendingTx) {
      // Notify donor about cancelled payment
      await Notification.create({
        userId: pendingTx.donorId,
        message: `Your donation payment of ৳${pendingTx.amount} was cancelled.`,
      });
      
      pendingTransactions.delete(tran_id);
    }

    // Redirect to frontend cancel page
    return res.redirect(`http://localhost:3000/payment/cancel?tran_id=${tran_id}`);
  } catch (error) {
    console.error("SSL Commerz cancel error:", error);
    return res.status(500).json({ error: "Failed to process cancelled payment" });
  }
});

// GET /api/sslcommerz/status/:tran_id - Check transaction status
router.get("/status/:tran_id", async (req, res) => {
  try {
    const { tran_id } = req.params;
    const pendingTx = pendingTransactions.get(tran_id);
    
    if (pendingTx) {
      return res.json({
        status: "pending",
        transaction: pendingTx,
      });
    }

    // Check if already completed
    const donation = await MonetaryDonation.findOne({ 
      $or: [
        { "paymentDetails.bank_tran_id": tran_id },
        { txHash: { $regex: tran_id } }
      ]
    });

    if (donation) {
      return res.json({
        status: "completed",
        donation: {
          id: donation._id,
          amount: donation.amount,
          txHash: donation.txHash,
          blockNumber: donation.blockNumber,
        },
      });
    }

    return res.json({ status: "not_found" });
  } catch (error) {
    console.error("SSL Commerz status error:", error);
    return res.status(500).json({ error: "Failed to check transaction status" });
  }
});

export default router;
