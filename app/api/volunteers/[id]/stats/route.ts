import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";
import Task from "@/server/models/Task";
import Feedback from "@/server/models/Feedback";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ volunteerId: string }> }
) {
  try {
    await connectDB();
    const { volunteerId } = await params;

    // Get volunteer info
    const volunteer = await User.findById(volunteerId).select("name email phone qualifications bio profilePicture");
    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    // Get all tasks for this volunteer
    const tasks = await Task.find({ volunteerId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
    const pendingTasks = tasks.filter(t => t.status === "pending").length;

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate average delivery time (from startedAt to completedAt)
    const completedTasksWithTime = tasks.filter(t => t.status === "completed" && t.startedAt && t.completedAt);
    let avgDeliveryTimeMinutes = 0;
    
    if (completedTasksWithTime.length > 0) {
      const totalTime = completedTasksWithTime.reduce((sum, task) => {
        const start = new Date(task.startedAt!).getTime();
        const end = new Date(task.completedAt!).getTime();
        return sum + (end - start);
      }, 0);
      avgDeliveryTimeMinutes = Math.round(totalTime / completedTasksWithTime.length / 60000); // Convert to minutes
    }

    // Get feedback for this volunteer
    const feedbacks = await Feedback.find({ volunteerId });
    const totalRatings = feedbacks.length;
    const avgRating = totalRatings > 0 
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalRatings 
      : 0;

    // Get recent feedback
    const recentFeedback = feedbacks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(f => ({
        id: f._id.toString(),
        donorName: f.donorName,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt.toISOString(),
      }));

    // Calculate response time (time from assigned to started)
    const tasksWithResponse = tasks.filter(t => t.assignedAt && t.startedAt);
    let avgResponseTimeMinutes = 0;
    
    if (tasksWithResponse.length > 0) {
      const totalResponseTime = tasksWithResponse.reduce((sum, task) => {
        const assigned = new Date(task.assignedAt!).getTime();
        const started = new Date(task.startedAt!).getTime();
        return sum + (started - assigned);
      }, 0);
      avgResponseTimeMinutes = Math.round(totalResponseTime / tasksWithResponse.length / 60000);
    }

    return NextResponse.json({
      volunteer: {
        id: volunteer._id.toString(),
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        qualifications: volunteer.qualifications,
        bio: volunteer.bio,
        profilePicture: volunteer.profilePicture,
      },
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        completionRate,
        avgDeliveryTimeMinutes,
        avgResponseTimeMinutes,
        totalRatings,
        avgRating: Math.round(avgRating * 10) / 10,
      },
      recentFeedback,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

