import { NextResponse } from "next/server";
import { taskDefinitionService } from "@/lib/db";

/**
 * GET /api/tasks/[id]
 * Get a specific task definition
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await taskDefinitionService.getById(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Parse JSON fields
    return NextResponse.json({
      ...task,
      recurringDays:
        typeof task.recurringDays === "string"
          ? JSON.parse(task.recurringDays)
          : task.recurringDays,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/tasks/[id]
 * Update a task definition
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const task = await taskDefinitionService.update(id, {
      text: body.text,
      description: body.description,
      baselineDuration: body.baselineDuration,
      isRecurring: body.isRecurring,
      recurringDays: body.recurringDays,
    });

    return NextResponse.json({
      ...task,
      recurringDays:
        typeof task.recurringDays === "string"
          ? JSON.parse(task.recurringDays)
          : task.recurringDays,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task definition
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await taskDefinitionService.delete(id);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
