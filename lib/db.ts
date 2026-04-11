import { prisma } from "./prisma";

/**
 * Task Definition utilities
 */
export const taskDefinitionService = {
  // Get all task definitions for a user
  async getAll(userId: string) {
    return await prisma.taskDefinition.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Get a single task definition (with ownership check)
  async getById(id: string, userId: string) {
    return await prisma.taskDefinition.findFirst({
      where: { id, userId },
      include: {
        assignments: true,
        trackingHistory: true,
      },
    });
  },

  // Create a new task definition
  async create(
    userId: string,
    data: {
      text: string;
      description?: string;
      baselineDuration: number;
      isRecurring: boolean;
      recurringDays: number[];
      startDate?: string;
      endDate?: string | null;
    },
  ) {
    return await prisma.taskDefinition.create({
      data: {
        userId,
        text: data.text,
        description: data.description,
        baselineDuration: data.baselineDuration,
        isRecurring: data.isRecurring,
        recurringDays: JSON.stringify(data.recurringDays),
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
  },

  // Update a task definition (with ownership check)
  async update(
    id: string,
    userId: string,
    data: Partial<{
      text: string;
      description?: string;
      baselineDuration: number;
      isRecurring: boolean;
      recurringDays: number[];
      startDate: string;
      endDate: string | null;
    }>,
  ) {
    // Verify ownership first
    const task = await prisma.taskDefinition.findFirst({
      where: { id, userId },
    });
    if (!task) return null;

    const updateData: any = { ...data };
    if (data.recurringDays) {
      updateData.recurringDays = JSON.stringify(data.recurringDays);
    }
    return await prisma.taskDefinition.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete a task definition (with ownership check)
  async delete(id: string, userId: string) {
    const task = await prisma.taskDefinition.findFirst({
      where: { id, userId },
    });
    if (!task) return null;

    return await prisma.taskDefinition.delete({
      where: { id },
    });
  },
};

/**
 * Task Assignment utilities
 */
export const taskAssignmentService = {
  // Get all assignments for a date range (scoped to user's tasks)
  async getByDateRange(startDate: string, endDate: string, userId: string) {
    return await prisma.taskAssignment.findMany({
      where: {
        dateStr: {
          gte: startDate,
          lte: endDate,
        },
        task: { userId },
      },
      include: {
        task: true,
      },
      orderBy: {
        dateStr: "asc",
      },
    });
  },

  // Get assignments for a specific date (scoped to user's tasks)
  async getByDate(dateStr: string, userId: string) {
    return await prisma.taskAssignment.findMany({
      where: { dateStr, task: { userId } },
      include: { task: true },
      orderBy: { createdAt: "asc" },
    });
  },

  // Get all assignments for a task
  async getByTaskId(taskId: string, userId: string) {
    return await prisma.taskAssignment.findMany({
      where: { taskId, task: { userId } },
      orderBy: { dateStr: "desc" },
    });
  },

  // Create a new assignment (verify task ownership)
  async create(
    userId: string,
    data: {
      taskId: string;
      dateStr: string;
      durationOverride?: number;
      loggedHours?: number;
      completed?: boolean;
    },
  ) {
    // Verify the task belongs to the user
    const task = await prisma.taskDefinition.findFirst({
      where: { id: data.taskId, userId },
    });
    if (!task) throw new Error("Task not found or unauthorized");

    return await prisma.taskAssignment.create({
      data: {
        taskId: data.taskId,
        dateStr: data.dateStr,
        durationOverride: data.durationOverride,
        loggedHours: data.loggedHours || 0,
        completed: data.completed ?? false,
      },
    });
  },

  // Update an assignment (verify ownership through task)
  async update(
    id: string,
    userId: string,
    data: Partial<{
      durationOverride?: number;
      completed: boolean;
      loggedHours: number;
    }>,
  ) {
    const assignment = await prisma.taskAssignment.findFirst({
      where: { id, task: { userId } },
    });
    if (!assignment) throw new Error("Assignment not found or unauthorized");

    return await prisma.taskAssignment.update({
      where: { id },
      data,
    });
  },

  // Delete an assignment (verify ownership through task)
  async delete(id: string, userId: string) {
    const assignment = await prisma.taskAssignment.findFirst({
      where: { id, task: { userId } },
    });
    if (!assignment) throw new Error("Assignment not found or unauthorized");

    return await prisma.taskAssignment.delete({
      where: { id },
    });
  },
};

/**
 * Day Off utilities
 */
export const dayOffService = {
  // Get all days off in a date range for a user
  async getByDateRange(startDate: string, endDate: string, userId: string) {
    return await prisma.dayOff.findMany({
      where: {
        userId,
        dateStr: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },

  // Check if a date is a day off for a user
  async isDateOff(dateStr: string, userId: string) {
    const dayOff = await prisma.dayOff.findUnique({
      where: { userId_dateStr: { userId, dateStr } },
    });
    return !!dayOff;
  },

  // Mark a day as off for a user
  async markAsOff(
    dateStr: string,
    userId: string,
    type: string = "REST",
    reason: string | null = null,
  ) {
    return await prisma.dayOff.upsert({
      where: { userId_dateStr: { userId, dateStr } },
      update: { type, reason },
      create: { userId, dateStr, type, reason },
    });
  },

  // Unmark a day as off for a user
  async unmarkAsOff(dateStr: string, userId: string) {
    return await prisma.dayOff
      .delete({
        where: { userId_dateStr: { userId, dateStr } },
      })
      .catch(() => null); // Return null if not found
  },
};

/**
 * Day Notes utilities
 */
export const dayNotesService = {
  // Get all notes for a date range for a user
  async getByDateRange(startDate: string, endDate: string, userId: string) {
    return await prisma.dayNotes.findMany({
      where: {
        userId,
        dateStr: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },

  // Get a note for a specific date for a user
  async getByDate(dateStr: string, userId: string) {
    return await prisma.dayNotes.findUnique({
      where: { userId_dateStr: { userId, dateStr } },
    });
  },

  // Save or update a note for a date for a user
  async upsert(dateStr: string, content: string, userId: string) {
    return await prisma.dayNotes.upsert({
      where: { userId_dateStr: { userId, dateStr } },
      update: { content },
      create: { userId, dateStr, content },
    });
  },

  // Delete a note for a date for a user
  async delete(dateStr: string, userId: string) {
    return await prisma.dayNotes
      .delete({
        where: { userId_dateStr: { userId, dateStr } },
      })
      .catch(() => null); // Return null if not found
  },
};

/**
 * Task Tracking utilities
 */
export const taskTrackingService = {
  // Get tracking history for a task
  async getByTaskId(taskId: string) {
    return await prisma.taskTracking.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get tracking history for an assignment
  async getByAssignmentId(assignmentId: string) {
    return await prisma.taskTracking.findMany({
      where: { assignmentId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Create tracking record
  async create(data: {
    assignmentId: string;
    taskId: string;
    hoursLogged: number;
    dayCompleted?: boolean;
    totalHours?: number;
    recurringDays?: number[];
  }) {
    return await prisma.taskTracking.create({
      data: {
        assignmentId: data.assignmentId,
        taskId: data.taskId,
        hoursLogged: data.hoursLogged,
        dayCompleted: data.dayCompleted || false,
        totalHours: data.totalHours || 0,
        recurringDays: data.recurringDays
          ? JSON.stringify(data.recurringDays)
          : null,
        completionDate: data.dayCompleted ? new Date() : null,
      },
    });
  },

  // Update tracking record
  async update(
    id: string,
    data: Partial<{
      hoursLogged: number;
      dayCompleted: boolean;
      totalHours: number;
    }>,
  ) {
    return await prisma.taskTracking.update({
      where: { id },
      data: {
        ...data,
        completionDate: data.dayCompleted ? new Date() : undefined,
      },
    });
  },

  // Get aggregated statistics for a task
  async getTaskStats(taskId: string) {
    const tracking = await prisma.taskTracking.findMany({
      where: { taskId },
    });

    const totalHours = tracking.reduce((sum, t) => sum + t.hoursLogged, 0);
    const daysCompleted = tracking.filter((t) => t.dayCompleted).length;
    const totalInstances = tracking.length;

    return {
      taskId,
      totalHours,
      daysCompleted,
      totalInstances,
      averageHoursPerDay: totalInstances > 0 ? totalHours / totalInstances : 0,
    };
  },
};

/**
 * User Settings utilities
 */
export const userSettingsService = {
  // Get settings for a user, or initialize with defaults
  async getSettings(userId: string) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (settings) {
      return settings;
    }

    // Initialize with defaults if doesn't exist
    return await prisma.userSettings.create({
      data: {
        userId,
        countRestDaysAsMissing: false,
        countVacationDaysAsMissing: false,
        countOtherDaysAsMissing: false,
        resetStreakAtRestDay: false,
        resetStreakAtVacationDay: false,
        resetStreakAtOtherDay: false,
      },
    });
  },

  // Update settings for a user
  async updateSettings(
    userId: string,
    data: Partial<{
      countRestDaysAsMissing: boolean;
      countVacationDaysAsMissing: boolean;
      countOtherDaysAsMissing: boolean;
      resetStreakAtRestDay: boolean;
      resetStreakAtVacationDay: boolean;
      resetStreakAtOtherDay: boolean;
    }>,
  ) {
    return await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  },
};
