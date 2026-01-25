import { NextResponse } from "next/server";
import { taskAssignmentService } from "@/lib/db";

/**
 * GET /api/assignments
 * Get assignments with optional filters
 * Query params: startDate, endDate, dateStr, taskId
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const dateStr = searchParams.get("dateStr");
    const taskId = searchParams.get("taskId");

    let assignments;

    if (dateStr) {
      assignments = await taskAssignmentService.getByDate(dateStr);
    } else if (taskId) {
      assignments = await taskAssignmentService.getByTaskId(taskId);
    } else if (startDate && endDate) {
      assignments = await taskAssignmentService.getByDateRange(
        startDate,
        endDate,
      );
    } else {
      return NextResponse.json(
        {
          error:
            "Please provide either dateStr, taskId, or startDate+endDate parameters",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/assignments
 * Create a new task assignment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const assignment = await taskAssignmentService.create({
      taskId: body.taskId,
      dateStr: body.dateStr,
      durationOverride: body.durationOverride,
      loggedHours: body.loggedHours,
      completed: body.completed,
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 },
    );
  }
}
