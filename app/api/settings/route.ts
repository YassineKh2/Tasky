import { NextResponse } from "next/server";
import { userSettingsService } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

// GET /api/settings
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await userSettingsService.getSettings(userId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/settings
export async function PATCH(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Whitelist the allowed settings fields
    const {
      countRestDaysAsMissing,
      countVacationDaysAsMissing,
      countOtherDaysAsMissing,
      resetStreakAtRestDay,
      resetStreakAtVacationDay,
      resetStreakAtOtherDay,
    } = body;
    
    const updateData: any = {};
    if (countRestDaysAsMissing !== undefined) updateData.countRestDaysAsMissing = countRestDaysAsMissing;
    if (countVacationDaysAsMissing !== undefined) updateData.countVacationDaysAsMissing = countVacationDaysAsMissing;
    if (countOtherDaysAsMissing !== undefined) updateData.countOtherDaysAsMissing = countOtherDaysAsMissing;
    if (resetStreakAtRestDay !== undefined) updateData.resetStreakAtRestDay = resetStreakAtRestDay;
    if (resetStreakAtVacationDay !== undefined) updateData.resetStreakAtVacationDay = resetStreakAtVacationDay;
    if (resetStreakAtOtherDay !== undefined) updateData.resetStreakAtOtherDay = resetStreakAtOtherDay;

    const updatedSettings = await userSettingsService.updateSettings(userId, updateData);
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
