import { NextResponse } from "next/server";
import { dayNotesService } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

/**
 * DELETE /api/day-notes/[dateStr]
 * Delete a note for a specific date for the logged-in user
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ dateStr: string }> },
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dateStr } = await params;

    if (!dateStr) {
      return NextResponse.json(
        { error: "dateStr parameter is required" },
        { status: 400 },
      );
    }

    await dayNotesService.delete(dateStr, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting day note:", error);
    return NextResponse.json(
      { error: "Failed to delete day note" },
      { status: 500 },
    );
  }
}
