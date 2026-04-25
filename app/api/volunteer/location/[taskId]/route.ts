import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/server/models/Task";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import { getAreaCoordinates } from "@/lib/areaCoordinates";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const { taskId } = await params;

    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Try to get coordinates from donation if not in task
    let donorLatitude = task.donorLatitude;
    let donorLongitude = task.donorLongitude;
    
    if (!donorLatitude || !donorLongitude) {
      const donation = await PhysicalDonation.findById(task.donationId);
      if (donation) {
        donorLatitude = donation.latitude;
        donorLongitude = donation.longitude;
        
        // If still no coordinates, try to get from location string
        if (!donorLatitude || !donorLongitude) {
          const coords = getAreaCoordinates(donation.location);
          if (coords) {
            donorLatitude = coords.latitude;
            donorLongitude = coords.longitude;
          }
        }
      }
    }

    // Calculate distance if both locations exist
    let distance = null;
    if (
      donorLatitude && donorLongitude &&
      task.volunteerLatitude && task.volunteerLongitude
    ) {
      distance = calculateDistance(
        task.volunteerLatitude,
        task.volunteerLongitude,
        donorLatitude,
        donorLongitude
      );
    }

    return NextResponse.json({
      taskId: task._id.toString(),
      volunteerId: task.volunteerId.toString(),
      volunteerName: task.volunteerName,
      donationType: task.donationType,
      donorName: task.donorName,
      location: task.location,
      volunteerLatitude: task.volunteerLatitude,
      volunteerLongitude: task.volunteerLongitude,
      donorLatitude: donorLatitude,
      donorLongitude: donorLongitude,
      deliveryLatitude: task.deliveryLatitude,
      deliveryLongitude: task.deliveryLongitude,
      status: task.status,
      distanceKm: distance,
      updatedAt: task.updatedAt.toISOString()
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Helper function to convert degrees to radians
function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}
