import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/server/models/Task";
import User from "@/server/models/User";
import Notification from "@/server/models/Notification";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import { notifyDeliveryCompleted } from "@/lib/email-service";


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status, proofPhotoUrl, pickupPhotoUrl, deliveryPhotoUrl } = await request.json();
    const updates: Record<string, unknown> = { status };

    if (proofPhotoUrl) updates.proofPhotoUrl = proofPhotoUrl;
    if (pickupPhotoUrl) updates.pickupPhotoUrl = pickupPhotoUrl;
    if (deliveryPhotoUrl) updates.deliveryPhotoUrl = deliveryPhotoUrl;

    if (status === "in-progress") {
      updates.startedAt = new Date();
    }

    if (status === "completed") {
      updates.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    if (status === "completed") {
      await User.findByIdAndUpdate(task.volunteerId, {
        isAvailable: true,
        activeTaskCount: 0,
        currentTaskId: null,
      });
    }

    if (status === "completed") {
      const admin = await User.findOne({ role: "admin" });

      if (admin) {
        await Notification.create({
          userId: admin._id,
          message: `Task completed by ${task.volunteerName}: ${task.donationType}`,
        });
      }

     const donation = await PhysicalDonation.findById(task.donationId);
if (donation) {
  // Mark donation as completed so it won't be auto-assigned again
  await PhysicalDonation.findByIdAndUpdate(task.donationId, {
    status: "completed",
  });

  const donor = await User.findById(donation.donorId);
  if (donor && donor.email) {
    notifyDeliveryCompleted(donor.email, task.donorName, task.volunteerName, task.donationType).catch(console.error);
  }

  await Notification.create({
    userId: donation.donorId,
    message: `Your donation (${task.donationType}) has been delivered by ${task.volunteerName}!`,
  });
}




           
    }

    return NextResponse.json({
      id: task._id.toString(),
      donationId: task.donationId.toString(),
      volunteerId: task.volunteerId.toString(),
      volunteerName: task.volunteerName,
      donorName: task.donorName,
      donationType: task.donationType,
      location: task.location,
      deadline: task.deadline.toISOString(),
      status: task.status,
      proofPhotoUrl: task.proofPhotoUrl || "",
      pickupPhotoUrl: task.pickupPhotoUrl || "",
      deliveryPhotoUrl: task.deliveryPhotoUrl || "",
      assignedAt: task.assignedAt.toISOString(),
      startedAt: task.startedAt ? task.startedAt.toISOString() : null,
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}