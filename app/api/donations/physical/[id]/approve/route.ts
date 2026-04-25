import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import Notification from "@/server/models/Notification";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const approvedCount = await PhysicalDonation.countDocuments({
      status: "approved",
    })
    const blockNumber = (100 + approvedCount + 1).toString()
    const txHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")

    const donation = await PhysicalDonation.findByIdAndUpdate(
      id,
      {
        status: "approved",
        blockNumber: blockNumber.toString(),
        txHash: txHash,
      },
      { new: true }
    );

    if (!donation)
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );

      await Notification.create({
  userId: donation.donorId,
  message: `We appreciate your donation. Thank you for supporting our mission.`,
});

    return NextResponse.json({
      id: donation._id.toString(),
      donorId: donation.donorId.toString(),
      donorName: donation.donorName,
      type: donation.type,
      quantity: donation.quantity,
      location: donation.location,
      photoUrl: donation.photoUrl,
      description: donation.description,
      status: donation.status,
      blockNumber: donation.blockNumber,
      txHash: donation.txHash,
      createdAt: donation.createdAt.toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
