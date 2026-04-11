import { NextResponse } from "next/server";
import { taskDefinitionService } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

/**
 * GET /api/tasks
 * Get all task definitions for the logged-in user
 */
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await taskDefinitionService.getAll(userId);
    // Parse JSON fields
    const parsedTasks = tasks.map((task) => ({
      ...task,
      recurringDays:
        typeof task.recurringDays === "string"
          ? JSON.parse(task.recurringDays)
          : task.recurringDays,
    }));
    return NextResponse.json(parsedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/tasks
 * Create a new task definition for the logged-in user
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const task = await taskDefinitionService.create(userId, {
      text: body.text,
      description: body.description,
      baselineDuration: body.baselineDuration,
      isRecurring: body.isRecurring,
      recurringDays: body.recurringDays || [],
      startDate: body.startDate,
      endDate: body.endDate,
    });

    // Parse JSON fields
    return NextResponse.json(
      {
        ...task,
        recurringDays:
          typeof task.recurringDays === "string"
            ? JSON.parse(task.recurringDays)
            : task.recurringDays,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
