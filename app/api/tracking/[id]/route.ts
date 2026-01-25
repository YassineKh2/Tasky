import { NextResponse } from "next/server";
import { taskTrackingService } from "@/lib/db";

/**
 * PUT /api/tracking/[id]
 * Update a tracking record
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const tracking = await taskTrackingService.update(id, {
      hoursLogged: body.hoursLogged,
      dayCompleted: body.dayCompleted,
      totalHours: body.totalHours,
    });

    return NextResponse.json(tracking);
  } catch (error) {
    console.error("Error updating tracking record:", error);
    return NextResponse.json(
      { error: "Failed to update tracking record" },
      { status: 500 },
    );
  }
}
