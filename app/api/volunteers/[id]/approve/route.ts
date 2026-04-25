import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";
import Notification from "@/server/models/Notification";
import { notifyVolunteerWelcome } from "@/lib/email-service";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findByIdAndUpdate(
      id,
      { volunteerStatus: "approved" },
      { new: true }
    );
    if (!user)
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );

    // Create in-app notification
    await Notification.create({
      userId: user._id,
      message:
        "Your volunteer registration has been approved! You can now log in.",
    });

    // Send welcome email to volunteer
    if (user.email) {
      notifyVolunteerWelcome(user.email, user.name).catch(console.error);
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      qualifications: user.qualifications || "",
      volunteerStatus: user.volunteerStatus,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
