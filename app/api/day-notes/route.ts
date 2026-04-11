import { NextResponse } from "next/server";
import { dayNotesService } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

/**
 * GET /api/day-notes
 * Get notes for a date range, scoped to user
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

    const notes = await dayNotesService.getByDateRange(startDate, endDate, userId);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching day notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch day notes" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/day-notes
 * Save or update a note for a date for the logged-in user
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

    // Allow empty content for clearing notes
    const content = body.content !== undefined ? body.content : "";

    const note = await dayNotesService.upsert(body.dateStr, content, userId);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error saving day note:", error);
    return NextResponse.json(
      { error: "Failed to save day note" },
      { status: 500 },
    );
  }
}
