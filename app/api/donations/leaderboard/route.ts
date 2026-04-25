import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import User from "@/server/models/User";

export async function GET() {
  try {
    await connectDB();
    
    // Get donation stats
    const donationResult = await MonetaryDonation.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$donorId",
          donorName: { $first: "$donorName" },
          totalAmount: { $sum: "$amount" },
          donationCount: { $sum: 1 },
        },
      },
    ]);

    // Get users with referral points
    const usersWithReferrals = await User.find({
      referralPoints: { $gt: 0 },
    }).select("name email referralPoints");

    // Create a map of referral points by user ID
    const referralPointsMap = new Map();
    usersWithReferrals.forEach((user) => {
      referralPointsMap.set(user._id.toString(), user.referralPoints);
    });

    // Combine donation data with referral points
    const leaderboard = donationResult.map((r) => {
      const donorId = r._id.toString();
      const referralPoints = referralPointsMap.get(donorId) || 0;
      const totalPoints = r.totalAmount + referralPoints; // Points = donation amount + referral bonus
      
      return {
        donorId,
        donorName: r.donorName,
        totalAmount: r.totalAmount,
        donationCount: r.donationCount,
        referralPoints,
        totalPoints,
      };
    });

    // Sort by total points (donation + referral)
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json(rankedLeaderboard);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
