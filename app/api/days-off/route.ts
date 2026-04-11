import { NextResponse } from "next/server";
import { dayOffService } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

/**
 * GET /api/days-off
 * Get days off for a date range, scoped to user
 * Query params: startDate, endDate
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Please provide startDate and endDate parameters" },
        { status: 400 },
      );
    }

    const daysOff = await dayOffService.getByDateRange(startDate, endDate, userId);
    return NextResponse.json(daysOff);
  } catch (error) {
    console.error("Error fetching days off:", error);
    return NextResponse.json(
      { error: "Failed to fetch days off" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/days-off
 * Mark a day as off for the logged-in user
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.dateStr) {
      return NextResponse.json(
        { error: "dateStr is required" },
        { status: 400 },
      );
    }

    const dayOff = await dayOffService.markAsOff(body.dateStr, userId, body.type, body.reason);
    return NextResponse.json(dayOff, { status: 201 });
  } catch (error) {
    console.error("Error marking day off:", error);
    return NextResponse.json(
      { error: "Failed to mark day off" },
      { status: 500 },
    );
  }
}
