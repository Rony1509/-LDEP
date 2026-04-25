import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/server/models/Task";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import { getAreaCoordinates } from "@/lib/areaCoordinates";

// GET: Fetch all tasks for a specific donor
export async function GET(
  request: Request,
  { params }: { params: Promise<{ donorId: string }> }
) {
  try {
    await connectDB();
    const { donorId } = await params;
    
    // Find all physical donations by this donor
    const donations = await PhysicalDonation.find({ donorId });
    const donationMap = new Map(donations.map(d => [d._id.toString(), d]));
    const donationIds = donations.map(d => d._id);
    
    // Find all tasks for these donations
    const tasks = await Task.find({ 
      donationId: { $in: donationIds }
    }).sort({ createdAt: -1 });

    const formattedTasks = tasks.map(t => {
      const donation = donationMap.get(t.donationId.toString());
      
      // Get coordinates from task or fall back to donation coordinates
      let donorLatitude = t.donorLatitude;
      let donorLongitude = t.donorLongitude;
      
      // If task doesn't have coordinates, try to get from donation
      if ((!donorLatitude || !donorLongitude) && donation) {
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
        donorLatitude: donorLatitude,
        donorLongitude: donorLongitude,
        deliveryLatitude: t.deliveryLatitude,
        deliveryLongitude: t.deliveryLongitude,
        volunteerLatitude: t.volunteerLatitude,
        volunteerLongitude: t.volunteerLongitude,
        assignedAt: t.assignedAt.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
        startedAt: t.startedAt ? t.startedAt.toISOString() : null,
      };
    });

    return NextResponse.json(formattedTasks);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

