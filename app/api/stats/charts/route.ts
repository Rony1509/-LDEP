import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import Task from "@/server/models/Task";

export async function GET() {
  try {
    await connectDB();

    // Get last 6 months for trend data
    const now = new Date();
    const months: { date: Date; monthKey: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months.push({ date, monthKey, label });
    }

    const startDate = months[0].date;
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 1. Monthly Donation Trends
    const monthlyMonetary = await MonetaryDonation.aggregate([
      { $match: { status: "completed", timestamp: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyPhysical = await PhysicalDonation.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 2. Monthly Active Users (unique donors per month)
    const monthlyDonors = await MonetaryDonation.aggregate([
      { $match: { status: "completed", timestamp: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" }
          },
          donors: { $addToSet: "$donorId" }
        }
      },
      {
        $project: {
          _id: 1,
          activeDonors: { $size: "$donors" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 3. Category-wise Physical Donations
    const categoryData = await PhysicalDonation.aggregate([
      { $match: { status: { $ne: "rejected" } } },
      {
        $group: {
          _id: "$type",
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    // 4. Volunteer Performance (tasks completed per volunteer)
    const volunteerPerformance = await Task.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$volunteerId",
          completedTasks: { $sum: 1 }
        }
      },
      { $sort: { completedTasks: -1 } },
      { $limit: 10 }
    ]);

    // Get volunteer names
    const volunteerIds = volunteerPerformance.map(v => v._id);
    const volunteers = await User.find({ _id: { $in: volunteerIds } }).select("name");
    const volunteerMap = new Map(volunteers.map(v => [v._id.toString(), v.name]));

    const volunteerData = volunteerPerformance.map(v => ({
      name: volunteerMap.get(v._id.toString())?.split(" ")[0] || "Unknown",
      tasks: v.completedTasks
    }));

    // 5. Area-wise donations (using location field from physical donations)
    const areaData = await PhysicalDonation.aggregate([
      { $match: { status: { $ne: "rejected" } } },
      {
        $group: {
          _id: "$location",
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // 6. Donation Type Totals
    const monetaryTotal = await MonetaryDonation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const physicalTotal = await PhysicalDonation.aggregate([
      { $match: { status: { $ne: "rejected" } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    // Build trend data for all months
    const trendData = months.map((m, idx) => {
      const mon = monthlyMonetary.find(x => x._id.year === m.date.getFullYear() && x._id.month === m.date.getMonth() + 1);
      const phys = monthlyPhysical.find(x => x._id.year === m.date.getFullYear() && x._id.month === m.date.getMonth() + 1);
      const donors = monthlyDonors.find(x => x._id.year === m.date.getFullYear() && x._id.month === m.date.getMonth() + 1);
      
      return {
        month: m.label,
        monetary: mon ? mon.total : 0,
        physical: phys ? phys.count : 0,
        donors: donors ? donors.activeDonors : 0
      };
    });

    // Calculate totals
    const totalMonetaryAmount = monetaryTotal.length > 0 ? monetaryTotal[0].total : 0;
    const totalPhysicalItems = physicalTotal.length > 0 ? physicalTotal[0].total : 0;

    return NextResponse.json({
      // Trend data for Line, Area charts
      trends: trendData,
      
      // Donation type breakdown
      donationTypes: [
        { name: "Monetary", value: totalMonetaryAmount },
        { name: "Physical", value: totalPhysicalItems }
      ],
      
      // Category-wise (for bar chart)
      categories: categoryData.map(c => ({
        name: c._id || "Others",
        value: c.totalQuantity
      })),
      
      // Volunteer performance (for bar chart)
      volunteerPerformance: volunteerData,
      
      // Area-wise donations (for map)
      areas: areaData.map(a => ({
        name: a._id || "Unknown",
        value: a.totalQuantity,
        count: a.count
      })),
      
      // Summary totals
      totals: {
        monetary: totalMonetaryAmount,
        physical: totalPhysicalItems,
        activeDonors: monthlyDonors.reduce((sum, d) => sum + d.activeDonors, 0)
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("Chart stats error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

