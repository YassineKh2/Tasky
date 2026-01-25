"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, PenTool } from "lucide-react";
import { WeekView } from "../components/WeekView";
import { MonthCalendar } from "../components/MonthCalendar";
import { ViewToggle } from "../components/ViewToggle";
import { CompleteDayButton } from "../components/CompleteDayButton";
import { TaskCreationModal } from "../components/TaskCreationModal";
import { TaskEditModal } from "../components/TaskEditModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { TaskLibrary } from "../components/TaskLibrary";
import { TaskAssignmentModal } from "../components/TaskAssignmentModal";
import { BulkActionsBar } from "../components/BulkActionsBar";
import { DayData, Task } from "../components/DayCard";
import { StatsPanel } from "../components/StatsPanel";
import { useTasksAPI, type TaskDefinition } from "../hooks/useTasksAPI";
import { useAssignmentsAPI } from "../hooks/useAssignmentsAPI";
import { useDaysOffAPI } from "../hooks/useDaysOffAPI";
// Helper to get local date string (fixes timezone offset bug)
const getLocalDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export function JournalTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month" | "stats">("week");
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDefinition | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskDefinition | null>(null);
  const [assignModalTask, setAssignModalTask] = useState<TaskDefinition | null>(
    null,
  );
  // Selection state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // API hooks
  const { 
    tasks: taskDefinitions, 
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  } = useTasksAPI();
  const {
    assignments,
    getByDateRange,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignmentsAPI();
  const { 
    daysOff, 
    getByDateRange: getDaysOffRange,
    markDayOff,
    unmarkDayOff
  } = useDaysOffAPI();

  // Helper to generate recurring task assignments ONLY in UI (not in database)
  const generateRecurringTasksForView = useCallback(
    (
      tasks: typeof taskDefinitions,
      existingAssignments: typeof assignments,
      startDate: string,
      endDate: string,
    ): typeof assignments => {
      // Parse date strings
      const [startYear, startMonth, startDay] = startDate
        .split("-")
        .map(Number);
      const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);

      // Collect all dates in range
      const allDates: string[] = [];
      const current = new Date(start);
      while (current <= end) {
        allDates.push(getLocalDateStr(current));
        current.setDate(current.getDate() + 1);
      }

      // Generate virtual assignments for recurring tasks (UI-only, not persisted)
      const generatedAssignments = [...existingAssignments];

      for (const task of tasks) {
        if (task.isRecurring && task.recurringDays.length > 0) {
          for (const dateStr of allDates) {
            // Check if assignment already exists in database
            const assignmentExists = existingAssignments.some(
              (a) => a.taskId === task.id && a.dateStr === dateStr,
            );

            if (!assignmentExists) {
              // Get day of week (0 = Sunday, 1 = Monday, etc.)
              const date = new Date(dateStr);
              const dayOfWeek = date.getDay();

              // Check if this task should appear on this day
              if (task.recurringDays.includes(dayOfWeek)) {
                // Create a virtual assignment (UI-only, not persisted to DB)
                generatedAssignments.push({
                  id: `virtual-${task.id}-${dateStr}`,
                  taskId: task.id,
                  dateStr,
                  completed: false,
                  durationOverride: undefined,
                });
              }
            }
          }
        }
      }

      return generatedAssignments;
    },
    [],
  );

  // Load data on mount and when date changes
  useEffect(() => {
    const loadData = async () => {
      // Fetch for current month +/- 1 month to cover all views
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        0,
      );
      const startStr = getLocalDateStr(start);
      const endStr = getLocalDateStr(end);

      await Promise.all([
        fetchTasks(),
        getByDateRange(startStr, endStr),
        getDaysOffRange(startStr, endStr),
      ]);
    };
    loadData();
  }, [currentDate, fetchTasks, getByDateRange, getDaysOffRange]);

  // Compute assignments with virtual recurring tasks (UI-only)
  const allAssignments = useMemo(() => {
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      0,
    );
    const startStr = getLocalDateStr(start);
    const endStr = getLocalDateStr(end);

    return generateRecurringTasksForView(
      taskDefinitions,
      assignments,
      startStr,
      endStr,
    );
  }, [
    taskDefinitions,
    assignments,
    currentDate,
    generateRecurringTasksForView,
  ]);
  // Helper to get tasks for a specific date
  const getTasksForDate = useCallback(
    (date: Date): Task[] => {
      const dateStr = getLocalDateStr(date); // Use local date helper
      return allAssignments
        .filter((a) => a.dateStr === dateStr)
        .map((assignment) => {
          const def = taskDefinitions.find((d) => d.id === assignment.taskId);
          if (!def) return null;
          return {
            id: def.id,
            assignmentId: assignment.id,
            text: def.text,
            completed: assignment.completed,
            duration: assignment.durationOverride || def.baselineDuration,
            isRecurring: def.isRecurring,
          } as Task;
        })
        .filter((t): t is Task => t !== null);
    },
    [allAssignments, taskDefinitions],
  );

  // Helper to generate view data
  const generateViewData = useCallback((): DayData[] => {
    const days: DayData[] = [];
    if (view === "week" || view === "stats") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const isoDate = getLocalDateStr(date);
        const tasks = getTasksForDate(date);
        const isDayOff = daysOff.includes(isoDate);
        const isComplete = tasks.length > 0 && tasks.every((t) => t.completed);
        days.push({
          id: isoDate,
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          dayName: date.toLocaleDateString("en-US", {
            weekday: "long",
          }),
          fullDate: date,
          isToday: date.toDateString() === new Date().toDateString(),
          isDayOff,
          isComplete,
          tasks,
          hourLogs: [],
        });
      }
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const startDay = firstDayOfMonth.getDay();
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(1 - startDay);
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const isoDate = getLocalDateStr(date);
        const tasks = getTasksForDate(date);
        const isDayOff = daysOff.includes(isoDate);
        const isComplete = tasks.length > 0 && tasks.every((t) => t.completed);
        days.push({
          id: isoDate,
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          dayName: date.toLocaleDateString("en-US", {
            weekday: "long",
          }),
          fullDate: date,
          isToday: date.toDateString() === new Date().toDateString(),
          isDayOff,
          isComplete,
          tasks,
          hourLogs: [],
        });
      }
    }
    return days;
  }, [view, currentDate, getTasksForDate, daysOff]);

  // Memoize the current view data to ensure immediate UI updates
  const currentData = useMemo(() => {
    return generateViewData();
  }, [generateViewData]);

// Hooks already initialized at the top


  const handleCreateTaskDef = async (data: {
    text: string;
    description?: string;
    baselineDuration: number;
    isRecurring: boolean;
    recurringDays: number[];
  }) => {
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
      // Refetch tasks and assignments
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        0,
      );
      const startStr = getLocalDateStr(start);
      const endStr = getLocalDateStr(end);

      await Promise.all([fetchTasks(), getByDateRange(startStr, endStr)]);
      // Recurring tasks will be automatically generated in allAssignments
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleUpdateTaskDef = async (
    id: string,
    updates: Partial<TaskDefinition>,
  ) => {
    try {
      await updateTask(id, updates);
      setEditingTask(null);
      // Refetch tasks and assignments
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        0,
      );
      const startStr = getLocalDateStr(start);
      const endStr = getLocalDateStr(end);

      await Promise.all([fetchTasks(), getByDateRange(startStr, endStr)]);
      // Recurring tasks will be automatically generated in allAssignments
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteTaskDef = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      // Refetch assignments as they may be affected
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        0,
      );
      await getByDateRange(getLocalDateStr(start), getLocalDateStr(end));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleAssignTask = async (dateStr: string, duration?: number) => {
    if (!assignModalTask) return;
    try {
      await createAssignment({
        taskId: assignModalTask.id,
        dateStr,
        durationOverride: duration,
        completed: false,
      });
      setAssignModalTask(null);
    } catch (err) {
      console.error("Failed to assign task", err);
    }
  };

  const handleDropTask = async (taskId: string, dateStr: string) => {
    try {
      await createAssignment({
        taskId,
        dateStr,
        completed: false,
      });
    } catch (err) {
      console.error("Failed to drop task", err);
    }
  };

  const handleRemoveTask = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId);
    } catch (err) {
      console.error("Failed to remove task", err);
    }
  };

  const handleToggleTask = async (assignmentId: string) => {
    // Try to find a real assignment first
    const assignment = assignments.find((a) => a.id === assignmentId);
    // If it's a real assignment, update it
    if (assignment) {
      try {
        await updateAssignment(assignmentId, {
          completed: !assignment.completed,
        });
      } catch (err) {
        console.error("Failed to toggle task", err);
      }
      return;
    }

    // If not found, it may be a virtual assignment (UI-only for recurring tasks)
    // Virtual IDs are created as `virtual-${task.id}-${dateStr}`
    if (assignmentId.startsWith("virtual-")) {
      try {
        const rest = assignmentId.replace("virtual-", "");
        const dashIdx = rest.indexOf("-");
        if (dashIdx === -1) return;
        const taskId = rest.slice(0, dashIdx);
        const dateStr = rest.slice(dashIdx + 1);

        // Create a real assignment and mark it completed
        await createAssignment({ taskId, dateStr, completed: true });
      } catch (err) {
        console.error("Failed to create assignment from virtual item", err);
      }
      return;
    }
  };

  const handleDurationChange = async (
    assignmentId: string,
    duration: number,
  ) => {
    try {
      await updateAssignment(assignmentId, {
        durationOverride: duration,
      });
    } catch (err) {
      console.error("Failed to change duration", err);
    }
  };

  const handleToggleDayOff = async (dayId: string) => {
    try {
      if (daysOff.includes(dayId)) {
        await unmarkDayOff(dayId);
      } else {
        await markDayOff(dayId);
      }
    } catch (err) {
      console.error("Failed to toggle day off", err);
    }
  };

  const handleMarkTodayComplete = async () => {
    const todayStr = getLocalDateStr(new Date());
    const todayAssignments = assignments.filter((a) => a.dateStr === todayStr);
    if (todayAssignments.length === 0) return;
    const allComplete = todayAssignments.every((a) => a.completed);

    try {
      await Promise.all(
        todayAssignments.map((a) =>
          updateAssignment(a.id, { completed: !allComplete }),
        ),
      );
    } catch (err) {
      console.error("Failed to mark today complete", err);
    }
  };

  // Selection Handlers
  const handleToggleSelectDay = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId],
    );
  };

  const handleBulkComplete = async () => {
    try {
      // Get all assignments (real and virtual) for selected days
      const toUpdate = allAssignments.filter((a) =>
        selectedDays.includes(a.dateStr),
      );

      // Separate real and virtual assignments
      const realAssignments = toUpdate.filter(
        (a) => !a.id.startsWith("virtual-"),
      );
      const virtualAssignments = toUpdate.filter((a) =>
        a.id.startsWith("virtual-"),
      );

      // Update real assignments
      if (realAssignments.length > 0) {
        await Promise.all(
          realAssignments.map((a) =>
            updateAssignment(a.id, { completed: true }),
          ),
        );
      }

      // Create real assignments from virtual ones
      if (virtualAssignments.length > 0) {
        const createPromises = virtualAssignments.map(async (va) => {
          const taskId = va.id.split("-")[1];
          if (!taskId) return;

          const res = await fetch("/api/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId,
              dateStr: va.dateStr,
              completed: true,
              durationOverride: va.durationOverride || 0,
            }),
          });

          if (!res.ok) throw new Error("Failed to create assignment");
        });

        await Promise.all(createPromises);
      }

      // Refetch assignments to update UI
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 2,
        0,
      );
      const startStr = getLocalDateStr(start);
      const endStr = getLocalDateStr(end);
      await getByDateRange(startStr, endStr);

      setSelectedDays([]);
      setIsSelectMode(false);
    } catch (err) {
      console.error("Failed to bulk complete", err);
    }
  };
  // Navigation
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "week") newDate.setDate(newDate.getDate() + 7);
    else if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "week") newDate.setDate(newDate.getDate() - 7);
    else if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  const getHeaderText = () => {
    if (view === "week") {
      if (currentData.length === 0) return "";
      return `${currentData[0].date} - ${currentData[6].date}`;
    }
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };
  const todayTasks = getTasksForDate(new Date());
  const isTodayComplete =
    todayTasks.length > 0 && todayTasks.every((t) => t.completed);
  return (
    <div className="min-h-screen bg-paper-texture p-4 md:p-8 font-serif-text overflow-x-hidden">
      <div className="max-w-7xl mx-auto transition-all duration-300">
        {/* Header */}
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="p-3 bg-[#2C2416] rounded-full text-[#FAF7F0] shadow-lg">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-handwriting text-5xl font-bold text-[#2C2416] leading-none">
                Weekly Journal
              </h1>
              <p className="text-[#8B7355] italic text-lg">
                Focus on what matters, one day at a time.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            <CompleteDayButton
              isComplete={isTodayComplete}
              onClick={handleMarkTodayComplete}
            />
            <div className="h-8 w-px bg-[#E8DCC4] hidden md:block" />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </header>

        {/* Navigation Bar - Only show for week/month views */}
        {view !== "stats" && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-6 bg-[#FFFBF5] px-6 py-3 rounded-full shadow-sm border border-[#E8DCC4] mx-auto md:mx-0">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-[#E8DCC4]/30 rounded-full text-[#2C2416]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="font-handwriting text-2xl font-bold min-w-[140px] text-center text-[#2C2416]">
                {getHeaderText()}
              </span>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-[#E8DCC4]/30 rounded-full text-[#2C2416]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="relative min-h-[500px]">
          {view === "week" ? (
            <WeekView
              weekData={currentData}
              direction={0}
              onToggleTask={handleToggleTask}
              onToggleDayOff={handleToggleDayOff}
              onDurationChange={handleDurationChange}
              onDropTask={handleDropTask}
              onRemoveTask={handleRemoveTask}
            />
          ) : view === "month" ? (
            <MonthCalendar
              currentDate={currentDate}
              days={currentData}
              onDayClick={(id) => console.log("Clicked day", id)}
              selectedDays={selectedDays}
              onToggleSelectDay={handleToggleSelectDay}
              isSelectMode={isSelectMode}
              onToggleSelectMode={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedDays([]);
              }}
            />
          ) : (
            <StatsPanel
              taskDefinitions={taskDefinitions}
              assignments={assignments}
              daysOff={daysOff}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center opacity-60">
          <p className="font-handwriting text-2xl text-[#6B5D4F]">
            "The secret of your future is hidden in your daily routine."
          </p>
        </footer>
      </div>

      {/* Task Library Sidebar */}
      <TaskLibrary
        tasks={taskDefinitions}
        onAssign={(taskId) => {
          const task = taskDefinitions.find((t) => t.id === taskId);
          if (task) setAssignModalTask(task);
        }}
        onCreateTask={() => setIsCreateModalOpen(true)}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedDays.length}
        onClearSelection={() => setSelectedDays([])}
        onMarkComplete={handleBulkComplete}
      />

      {/* Modals */}
      <TaskCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTaskDef}
      />

      {editingTask && (
        <TaskEditModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTaskDef}
          task={editingTask}
        />
      )}

      {deletingTask && (
        <DeleteConfirmModal
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDeleteTaskDef}
          taskName={deletingTask.text}
        />
      )}

      {assignModalTask && (
        <TaskAssignmentModal
          isOpen={!!assignModalTask}
          onClose={() => setAssignModalTask(null)}
          onAssign={handleAssignTask}
          taskName={assignModalTask.text}
          baselineDuration={assignModalTask.baselineDuration}
        />
      )}
    </div>
  );
}
