import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/server/models/Task";

// GET: Fetch all active volunteer locations (for admin map)
export async function GET() {
  try {
    await connectDB();
    // Get all in-progress tasks with volunteer locations
    const tasks = await Task.find({ 
      status: "in-progress",
      volunteerLatitude: { $ne: null },
      volunteerLongitude: { $ne: null }
    }).sort({ updatedAt: -1 });

    const locations = tasks.map(t => ({
      taskId: t._id.toString(),
      volunteerId: t.volunteerId.toString(),
      volunteerName: t.volunteerName,
      donationType: t.donationType,
      donorName: t.donorName,
      location: t.location,
      volunteerLatitude: t.volunteerLatitude,
      volunteerLongitude: t.volunteerLongitude,
      donorLatitude: t.donorLatitude,
      donorLongitude: t.donorLongitude,
      deliveryLatitude: t.deliveryLatitude,
      deliveryLongitude: t.deliveryLongitude,
      status: t.status,
      updatedAt: t.updatedAt.toISOString()
    }));

    return NextResponse.json(locations);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Update volunteer location
export async function POST(request: Request) {
  try {
    await connectDB();
    const { volunteerId, lat, lng } = await request.json();

    if (!volunteerId || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: volunteerId, lat, lng" },
        { status: 400 }
      );
    }

    // Find the in-progress task for this volunteer and update location
    const task = await Task.findOneAndUpdate(
      { volunteerId, status: "in-progress" },
      { 
        volunteerLatitude: lat,
        volunteerLongitude: lng,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { error: "No active task found for this volunteer" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Location updated",
      taskId: task._id.toString()
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
