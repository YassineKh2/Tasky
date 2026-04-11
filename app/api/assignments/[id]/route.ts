import { NextResponse } from "next/server";
import { taskAssignmentService } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

/**
 * PUT /api/assignments/[id]
 * Update a task assignment (verifies ownership through task)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const assignment = await taskAssignmentService.update(id, userId, {
      durationOverride: body.durationOverride,
      completed: body.completed,
      loggedHours: body.loggedHours,
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/assignments/[id]
 * Delete a task assignment (verifies ownership through task)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await taskAssignmentService.delete(id, userId);
    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 },
    );
  }
}
