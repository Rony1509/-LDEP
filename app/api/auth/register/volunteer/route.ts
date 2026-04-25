import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";
import Notification from "@/server/models/Notification";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, phone, qualifications, password, address } =
      await request.json();
    
    // Validate phone number (must be 11 digits)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11) {
      return NextResponse.json(
        { error: "Phone number must be exactly 11 digits" },
        { status: 400 }
      );
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    const user = await User.create({
      name,
      email,
      phone,
      qualifications,
      address: address || "",
      role: "volunteer",
      volunteerStatus: "pending",
      password,
    });

    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        userId: admin._id,
        message: `New volunteer registration request: ${name}`,
      });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address || "",
          qualifications: user.qualifications || "",
          bio: "",
          profilePicture: "",
          volunteerStatus: user.volunteerStatus,
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
