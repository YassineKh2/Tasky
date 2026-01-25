import { NextResponse } from "next/server";
import { taskTrackingService } from "@/lib/db";

/**
 * GET /api/tracking/stats/[taskId]
 * Get aggregated statistics for a task
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const { taskId } = await params;
    const stats = await taskTrackingService.getTaskStats(taskId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching task stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch task statistics" },
      { status: 500 },
    );
  }
}
