import { prisma } from "./prisma";

/**
 * Task Definition utilities
 */
export const taskDefinitionService = {
  // Get all task definitions
  async getAll() {
    return await prisma.taskDefinition.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Get a single task definition
  async getById(id: string) {
    return await prisma.taskDefinition.findUnique({
      where: { id },
      include: {
        assignments: true,
        trackingHistory: true,
      },
    });
  },

  // Create a new task definition
  async create(data: {
    text: string;
    description?: string;
    baselineDuration: number;
    isRecurring: boolean;
    recurringDays: number[];
  }) {
    return await prisma.taskDefinition.create({
      data: {
        text: data.text,
        description: data.description,
        baselineDuration: data.baselineDuration,
        isRecurring: data.isRecurring,
        recurringDays: JSON.stringify(data.recurringDays),
      },
    });
  },

  // Update a task definition
  async update(
    id: string,
    data: Partial<{
      text: string;
      description?: string;
      baselineDuration: number;
      isRecurring: boolean;
      recurringDays: number[];
    }>,
  ) {
    const updateData: any = { ...data };
    if (data.recurringDays) {
      updateData.recurringDays = JSON.stringify(data.recurringDays);
    }
    return await prisma.taskDefinition.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete a task definition
  async delete(id: string) {
    return await prisma.taskDefinition.delete({
      where: { id },
    });
  },
};

/**
 * Task Assignment utilities
 */
export const taskAssignmentService = {
  // Get all assignments for a date range
  async getByDateRange(startDate: string, endDate: string) {
    return await prisma.taskAssignment.findMany({
      where: {
        dateStr: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        task: true,
      },
      orderBy: {
        dateStr: "asc",
      },
    });
  },

  // Get assignments for a specific date
  async getByDate(dateStr: string) {
    return await prisma.taskAssignment.findMany({
      where: { dateStr },
      include: { task: true },
      orderBy: { createdAt: "asc" },
    });
  },

  // Get all assignments for a task
  async getByTaskId(taskId: string) {
    return await prisma.taskAssignment.findMany({
      where: { taskId },
      orderBy: { dateStr: "desc" },
    });
  },

  // Create a new assignment
  async create(data: {
    taskId: string;
    dateStr: string;
    durationOverride?: number;
    loggedHours?: number;
    completed?: boolean;
  }) {
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

  // Update an assignment
  async update(
    id: string,
    data: Partial<{
      durationOverride?: number;
      completed: boolean;
      loggedHours: number;
    }>,
  ) {
    return await prisma.taskAssignment.update({
      where: { id },
      data,
    });
  },

  // Delete an assignment
  async delete(id: string) {
    return await prisma.taskAssignment.delete({
      where: { id },
    });
  },
};

/**
 * Day Off utilities
 */
export const dayOffService = {
  // Get all days off in a date range
  async getByDateRange(startDate: string, endDate: string) {
    return await prisma.dayOff.findMany({
      where: {
        dateStr: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },

  // Check if a date is a day off
  async isDateOff(dateStr: string) {
    const dayOff = await prisma.dayOff.findUnique({
      where: { dateStr },
    });
    return !!dayOff;
  },

  // Mark a day as off
  async markAsOff(dateStr: string) {
    return await prisma.dayOff.upsert({
      where: { dateStr },
      update: {},
      create: { dateStr },
    });
  },

  // Unmark a day as off
  async unmarkAsOff(dateStr: string) {
    return await prisma.dayOff
      .delete({
        where: { dateStr },
      })
      .catch(() => null); // Return null if not found
  },
};

/**
 * Day Notes utilities
 */
export const dayNotesService = {
  // Get all notes for a date range
  async getByDateRange(startDate: string, endDate: string) {
    return await prisma.dayNotes.findMany({
      where: {
        dateStr: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },

  // Get a note for a specific date
  async getByDate(dateStr: string) {
    return await prisma.dayNotes.findUnique({
      where: { dateStr },
    });
  },

  // Save or update a note for a date
  async upsert(dateStr: string, content: string) {
    return await prisma.dayNotes.upsert({
      where: { dateStr },
      update: { content },
      create: { dateStr, content },
    });
  },

  // Delete a note for a date
  async delete(dateStr: string) {
    return await prisma.dayNotes
      .delete({
        where: { dateStr },
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
