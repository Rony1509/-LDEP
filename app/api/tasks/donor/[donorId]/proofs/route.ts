import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/server/models/Task";
import PhysicalDonation from "@/server/models/PhysicalDonation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ donorId: string }> }
) {
  try {
    await connectDB();
    const { donorId } = await params;

    // Find physical donations by this donor
    const donations = await PhysicalDonation.find({ donorId }).select("_id");
    const donationIds = donations.map(d => d._id);

    // Find tasks for these donations
    const tasks = await Task.find({ 
      donationId: { $in: donationIds }
    }).sort({ createdAt: -1 });

    const proofs = tasks.map(task => ({
      taskId: task._id.toString(),
      donationType: task.donationType,
      location: task.location,
      volunteerName: task.volunteerName,
      status: task.status,
      pickupPhotoUrl: task.pickupPhotoUrl || "",
      deliveryPhotoUrl: task.deliveryPhotoUrl || "",
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    }));

    return NextResponse.json(proofs);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

