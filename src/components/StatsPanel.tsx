import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, TrendingUp, Flame, Trophy } from "lucide-react";
import { StatCard } from "./StatCard";
import { TaskStatsCard } from "./TaskStatsCard";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { CompletionTrendChart } from "./CompletionTrendChart";
import { TaskDistributionChart } from "./TaskDistributionChart";
import { DayDetailsModal } from "./DayDetailsModal";

interface TaskDefinition {
  id: string;
  text: string;
  description?: string;
  baselineDuration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

interface TaskAssignment {
  id: string;
  taskId: string;
  dateStr: string;
  durationOverride?: number;
  completed: boolean;
}

interface StatsPanelProps {
  taskDefinitions: TaskDefinition[];
  assignments: TaskAssignment[];
  daysOff: string[];
  notes?: Record<string, string>;
  onSaveNote?: (dateStr: string, content: string) => Promise<void>;
}

export function StatsPanel({
  taskDefinitions,
  assignments,
  daysOff,
  notes = {},
  onSaveNote,
}: StatsPanelProps) {
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  // Helper to get local date string (YYYY-MM-DD)
  const getLocalDateStr = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateStats = () => {
    const statsStartDate = new Date("2026-01-14");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize counters
    let globalCompletedDays = 0;
    let globalMissedDays = 0;
    let globalTotalMinutes = 0;

    // Data structures for charts
    const heatmapData: {
      date: string;
      count: number;
      missed: number;
      level: number;
    }[] = [];
    const dailyStats = new Map<string, { completed: number; missed: number }>();
    const taskCompletionCounts = new Map<string, number>();

    const taskStatsMap = new Map<
      string,
      {
        completedCount: number;
        missedCount: number;
        totalMinutes: number;
      }
    >();

    // Initialize task map
    taskDefinitions.forEach((def) => {
      taskStatsMap.set(def.id, {
        completedCount: 0,
        missedCount: 0,
        totalMinutes: 0,
      });
      taskCompletionCounts.set(def.text, 0);
    });

    // Iterate day by day from start date to today
    const current = new Date(statsStartDate);
    const dayStatsList: {
      date: Date;
      allCompleted: boolean;
      hasTasks: boolean;
      isRestDay: boolean;
    }[] = [];

    while (current <= today) {
      const dateStr = getLocalDateStr(current);
      const dayOfWeek = current.getDay();

      // Skip if marked as rest day
      if (daysOff.includes(dateStr)) {
        dayStatsList.push({
          date: new Date(current),
          allCompleted: false,
          hasTasks: false,
          isRestDay: true,
        });
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Identify expected tasks for this day
      const expectedTaskIds = new Set<string>();

      // Add recurring tasks
      taskDefinitions.forEach((def) => {
        if (def.isRecurring && def.recurringDays.includes(dayOfWeek)) {
          expectedTaskIds.add(def.id);
        }
      });

      // Add one-off assignments for this date
      const dayAssignments = assignments.filter((a) => a.dateStr === dateStr);
      dayAssignments.forEach((a) => expectedTaskIds.add(a.taskId));

      let dailyCompletedCount = 0;
      let dailyMissedCount = 0;

      // Check status for this day
      if (expectedTaskIds.size > 0) {
        let allDayTasksCompleted = true;
        let anyDayTaskMissed = false;

        expectedTaskIds.forEach((taskId) => {
          const def = taskDefinitions.find((d) => d.id === taskId);
          if (!def) return;

          // Find assignment for this task on this day
          const assignment = assignments.find(
            (a) => a.taskId === taskId && a.dateStr === dateStr,
          );

          const isCompleted = !!assignment?.completed;
          const taskStat = taskStatsMap.get(taskId)!;

          if (isCompleted) {
            taskStat.completedCount++;
            const duration =
              assignment!.durationOverride || def.baselineDuration;
            taskStat.totalMinutes += duration;
            globalTotalMinutes += duration;

            dailyCompletedCount++;
            taskCompletionCounts.set(
              def.text,
              (taskCompletionCounts.get(def.text) || 0) + 1,
            );
          } else {
            taskStat.missedCount++;
            dailyMissedCount++;
            allDayTasksCompleted = false;
            anyDayTaskMissed = true;
          }
        });

        if (allDayTasksCompleted) {
          globalCompletedDays++;
        } else if (anyDayTaskMissed) {
          globalMissedDays++;
        }

        dayStatsList.push({
          date: new Date(current),
          allCompleted: allDayTasksCompleted,
          hasTasks: true,
          isRestDay: false,
        });
      } else {
        dayStatsList.push({
          date: new Date(current),
          allCompleted: false,
          hasTasks: false,
          isRestDay: false,
        });
      }

      // Populate Chart Data
      // Heatmap level logic (0-4) based on absolute count
      let level = 0;
      if (dailyCompletedCount > 0) {
        if (dailyCompletedCount >= 7) level = 4;
        else if (dailyCompletedCount >= 5) level = 3;
        else if (dailyCompletedCount >= 3) level = 2;
        else level = 1;
      }
      heatmapData.push({
        date: dateStr,
        count: dailyCompletedCount,
        missed: dailyMissedCount,
        level,
      });

      // Daily stats for trends
      dailyStats.set(dateStr, {
        completed: dailyCompletedCount,
        missed: dailyMissedCount,
      });

      // Next day
      current.setDate(current.getDate() + 1);
    }

    // Calculate Streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Iterate backwards for current streak
    // Iterate backwards for current streak
    for (let i = dayStatsList.length - 1; i >= 0; i--) {
      const stat = dayStatsList[i];

      // Check if day relates to streak (tasks assigned OR rest day)
      if (stat.hasTasks || stat.isRestDay) {
        // Completed if tasks done OR it is a rest day
        if (stat.allCompleted || stat.isRestDay) {
          currentStreak++;
        } else {
          break;
        }
      }
      // If empty day (no tasks, not rest day), preserve streak (do not break, do not increment)
    }

    // Iterate forwards for longest streak
    for (const stat of dayStatsList) {
      if (stat.hasTasks || stat.isRestDay) {
        if (stat.allCompleted || stat.isRestDay) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Prepare Trend Data (Last 30 days)
    const trendData = [];
    const trendStart = new Date(today);
    trendStart.setDate(trendStart.getDate() - 30);

    let trendCurrent = new Date(trendStart);
    while (trendCurrent <= today) {
      if (trendCurrent >= statsStartDate) {
        const dateStr = getLocalDateStr(trendCurrent);
        const stats = dailyStats.get(dateStr) || { completed: 0, missed: 0 };
        trendData.push({
          date: trendCurrent.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          completed: stats.completed,
          missed: stats.missed,
        });
      }
      trendCurrent.setDate(trendCurrent.getDate() + 1);
    }

    // Prepare Distribution Data
    const distributionData = Array.from(taskCompletionCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);

    return {
      global: {
        totalHours: Math.round((globalTotalMinutes / 60) * 10) / 10,
        completedDays: globalCompletedDays,
        missedDays: globalMissedDays,
        currentStreak,
        longestStreak,
      },
      charts: {
        heatmapData,
        trendData,
        distributionData,
      },
      tasks: taskDefinitions.map((def) => {
        const stat = taskStatsMap.get(def.id)!;
        return {
          taskName: def.text,
          description: def.description,
          totalHours: Math.round((stat.totalMinutes / 60) * 10) / 10,
          completedCount: stat.completedCount,
          missedCount: stat.missedCount,
          isRecurring: def.isRecurring,
          recurringDays: def.recurringDays,
        };
      }),
    };
  };

  const { global: globalStats, tasks: taskStats, charts } = calculateStats();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="font-handwriting text-4xl text-[#2C2416] mb-2">
          Your Progress
        </h2>
        <p className="font-serif-text text-sm text-[#8B7355] italic">
          Keep building those habits!
        </p>
        <div className="h-px w-32 mx-auto bg-[#E8DCC4] mt-2" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Streak"
          value={globalStats.currentStreak}
          icon={Flame}
          subtitle="Days in a row (including rest days)"
          index={0}
        />
        <StatCard
          label="Longest Streak"
          value={globalStats.longestStreak}
          icon={Trophy}
          subtitle="All time best (including rest days)"
          index={1}
        />
        <StatCard
          label="Completed Days"
          value={globalStats.completedDays}
          icon={CheckCircle2}
          subtitle="Perfect days"
          index={2}
        />
        <StatCard
          label="Total Time"
          value={`${globalStats.totalHours}h`}
          icon={Clock}
          subtitle="Focus time"
          index={3}
        />
      </div>

      {/* Heatmap Section */}
      <ActivityHeatmap
        data={charts.heatmapData}
        daysOff={daysOff}
        onDayClick={setSelectedDayStr}
      />

      <DayDetailsModal
        isOpen={!!selectedDayStr}
        onClose={() => setSelectedDayStr(null)}
        dateStr={selectedDayStr}
        taskDefinitions={taskDefinitions}
        assignments={assignments.filter((a) => a.dateStr === selectedDayStr)}
        isRestDay={!!selectedDayStr && daysOff.includes(selectedDayStr)}
        noteContent={selectedDayStr ? notes[selectedDayStr] || "" : ""}
        onSaveNote={onSaveNote}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletionTrendChart data={charts.trendData} />
        <TaskDistributionChart data={charts.distributionData} />
      </div>

      {/* Advanced Stats Table / List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#8B7355]" />
          <h3 className="font-serif-text text-lg font-bold text-[#8B7355] uppercase tracking-wider">
            Detailed Breakdown
          </h3>
        </div>

        {taskStats.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#E8DCC4]">
            <p className="font-handwriting text-2xl text-[#8B7355]">
              No task data yet...
            </p>
            <p className="font-serif-text text-sm text-[#8B7355] mt-2">
              Complete some tasks to see statistics!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {taskStats.map((stat, index) => (
              <TaskStatsCard
                key={index}
                taskName={stat!.taskName}
                description={stat!.description}
                totalHours={stat!.totalHours}
                completedCount={stat!.completedCount}
                missedCount={stat!.missedCount}
                isRecurring={stat!.isRecurring}
                recurringDays={stat!.recurringDays}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
