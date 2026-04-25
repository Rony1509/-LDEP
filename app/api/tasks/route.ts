import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/server/models/Task";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import User from "@/server/models/User";
import Notification from "@/server/models/Notification";
import { notifyVolunteerAssigned } from "@/lib/email-service";

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json(tasks.map(formatTask));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { donationId, volunteerId, deadline, distance, estimatedTime } = await request.json();

    const donation = await PhysicalDonation.findById(donationId);
    const volunteer = await User.findById(volunteerId);

    // Duplicate assignment check
    const existingTask = await Task.findOne({ donationId });
    if (existingTask) {
      return NextResponse.json(
        { error: "This donation has already been assigned to a volunteer." },
        { status: 400 }
      );
    }

    // Volunteer availability check
    if (!volunteer.isAvailable || volunteer.activeTaskCount > 0) {
      return NextResponse.json(
        { error: "This volunteer is currently busy with another task." },
        { status: 400 }
      );
    }

    // Fetch donor User record as fallback for phone
    const donor = await User.findById(donation.donorId);

    const task = await Task.create({
      donationId,
      volunteerId,
      volunteerName: volunteer.name,
      donorName: donation.donorName,
      donationType: donation.type,
      location: donation.location,
      deadline: new Date(deadline),
      status: "pending",
      assignedAt: new Date(),
      donorLatitude: donation.latitude || null,
      donorLongitude: donation.longitude || null,
      donorPhone: donation.phone || donor?.phone || "",
      distance: distance || "",
      estimatedTime: estimatedTime || "",
    });

    // Mark volunteer as busy
    await User.findByIdAndUpdate(volunteerId, {
      isAvailable: false,
      activeTaskCount: 1,
      currentTaskId: task._id,
    });

    // Create in-app notification
    await Notification.create({
      userId: volunteerId,
      message: `A new task has been assigned. Please pick up ${donation.type} from ${donation.location} and begin the task promptly.`,
    });

    // Send email notification to volunteer
    if (volunteer.email) {
      notifyVolunteerAssigned(volunteer.email, volunteer.name, donation.type, donation.location).catch(console.error);
    }

    return NextResponse.json(formatTask(task), { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function formatTask(t: InstanceType<typeof Task>) {
  return {
    id: t._id.toString(),
    donationId: t.donationId.toString(),
    volunteerId: t.volunteerId.toString(),
    volunteerName: t.volunteerName,
    donorName: t.donorName,
    donationType: t.donationType,
    location: t.location,
    deadline: t.deadline.toISOString(),
    status: t.status,
    proofPhotoUrl: t.proofPhotoUrl || "",
    pickupPhotoUrl: t.pickupPhotoUrl || "",
    deliveryPhotoUrl: t.deliveryPhotoUrl || "",
    donorLatitude: t.donorLatitude,
    donorLongitude: t.donorLongitude,
    deliveryLatitude: t.deliveryLatitude,
    deliveryLongitude: t.deliveryLongitude,
    volunteerLatitude: t.volunteerLatitude,
    volunteerLongitude: t.volunteerLongitude,
    donorPhone: t.donorPhone,
    distance: t.distance || "",
    estimatedTime: t.estimatedTime || "",
    assignedAt: t.assignedAt.toISOString(),
    completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    startedAt: t.startedAt ? t.startedAt.toISOString() : null,
  };
}