import { NextResponse } from "next/server";
import { taskAssignmentService } from "@/lib/db";

/**
 * GET /api/assignments/[id]
 * Get a specific task assignment
 */
export async function GET(
  _request: Request,
  _context: { params: Promise<{ id: string }> },
) {
  try {
    // Note: Prisma doesn't provide a direct getById for assignments
    // This would need to be added to the db service or use findUnique if id is unique
    return NextResponse.json(
      { error: "Use query parameters to filter assignments" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/assignments/[id]
 * Update a task assignment
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const assignment = await taskAssignmentService.update(id, {
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
 * Delete a task assignment
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await taskAssignmentService.delete(id);
    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 },
    );
  }
}
