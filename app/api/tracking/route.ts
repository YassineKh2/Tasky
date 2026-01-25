import { NextResponse } from "next/server";
import { taskTrackingService } from "@/lib/db";

/**
 * GET /api/tracking
 * Get tracking records with filters
 * Query params: taskId, assignmentId
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");
    const assignmentId = searchParams.get("assignmentId");

    let tracking;

    if (taskId) {
      tracking = await taskTrackingService.getByTaskId(taskId);
    } else if (assignmentId) {
      tracking = await taskTrackingService.getByAssignmentId(assignmentId);
    } else {
      return NextResponse.json(
        { error: "Please provide either taskId or assignmentId" },
        { status: 400 },
      );
    }

    return NextResponse.json(tracking);
  } catch (error) {
    console.error("Error fetching tracking records:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking records" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/tracking
 * Create a new tracking record
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tracking = await taskTrackingService.create({
      assignmentId: body.assignmentId,
      taskId: body.taskId,
      hoursLogged: body.hoursLogged,
      dayCompleted: body.dayCompleted,
      totalHours: body.totalHours,
      recurringDays: body.recurringDays,
    });

    return NextResponse.json(tracking, { status: 201 });
  } catch (error) {
    console.error("Error creating tracking record:", error);
    return NextResponse.json(
      { error: "Failed to create tracking record" },
      { status: 500 },
    );
  }
}
