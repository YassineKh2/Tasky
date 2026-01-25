import { NextResponse } from "next/server";
import { dayOffService } from "@/lib/db";

/**
 * DELETE /api/days-off/[dateStr]
 * Unmark a day as off
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ dateStr: string }> },
) {
  try {
    const { dateStr } = await params;
    const result = await dayOffService.unmarkAsOff(dateStr);

    if (!result) {
      return NextResponse.json({ error: "Day off not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Day off removed successfully" });
  } catch (error) {
    console.error("Error removing day off:", error);
    return NextResponse.json(
      { error: "Failed to remove day off" },
      { status: 500 },
    );
  }
}
