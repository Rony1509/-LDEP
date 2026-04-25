import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";

// Generate unique referral code
function generateReferralCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DC-${timestamp}${random}`;
}

// GET - Get user's referral info
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;

    const user = await User.findById(userId)
      .select("name email referralCode referralPoints referredBy createdAt")
      .populate("referredBy", "name email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get referred users
    const referredUsers = await User.find({ referredBy: userId })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      referralCode: user.referralCode,
      referralPoints: user.referralPoints,
      referredBy: user.referredBy ? {
        name: (user.referredBy as any).name,
        email: (user.referredBy as any).email,
      } : null,
      referredUsers: referredUsers.map((u) => ({
        name: u.name,
        email: u.email,
        joinedAt: u.createdAt,
      })),
      totalReferrals: referredUsers.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - Apply a referral code
export async function POST(request: Request) {
  try {
    await connectDB();
    const { userId, referralCode } = await request.json();

    if (!userId || !referralCode) {
      return NextResponse.json(
        { error: "User ID and referral code are required" },
        { status: 400 }
      );
    }

    // Find the user who owns this referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    // Prevent self-referral
    if (referrer._id.toString() === userId) {
      return NextResponse.json(
        { error: "You cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Check if user already has a referrer
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.referredBy) {
      return NextResponse.json(
        { error: "You already have a referral" },
        { status: 400 }
      );
    }

    // Apply referral
    user.referredBy = referrer._id;
    await user.save();

    // Award points to referrer (bonus points for successful referral)
    const BONUS_POINTS = 100;
    referrer.referralPoints += BONUS_POINTS;
    await referrer.save();

    return NextResponse.json({
      success: true,
      message: `Referral applied! ${BONUS_POINTS} bonus points awarded to ${referrer.name}`,
      referrer: {
        name: referrer.name,
        email: referrer.email,
      },
      bonusPoints: BONUS_POINTS,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT - Generate new referral code
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new unique referral code
    let newCode = generateReferralCode();
    let exists = await User.findOne({ referralCode: newCode });
    
    // Keep generating until unique
    while (exists) {
      newCode = generateReferralCode();
      exists = await User.findOne({ referralCode: newCode });
    }

    user.referralCode = newCode;
    await user.save();

    return NextResponse.json({
      success: true,
      referralCode: newCode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

