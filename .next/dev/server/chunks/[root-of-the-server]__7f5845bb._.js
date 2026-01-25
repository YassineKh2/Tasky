module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const prisma = global.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        "error"
    ]
});
if ("TURBOPACK compile-time truthy", 1) {
    global.prisma = prisma;
}
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dayOffService",
    ()=>dayOffService,
    "taskAssignmentService",
    ()=>taskAssignmentService,
    "taskDefinitionService",
    ()=>taskDefinitionService,
    "taskTrackingService",
    ()=>taskTrackingService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
;
const taskDefinitionService = {
    // Get all task definitions
    async getAll () {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskDefinition.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    },
    // Get a single task definition
    async getById (id) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskDefinition.findUnique({
            where: {
                id
            },
            include: {
                assignments: true,
                trackingHistory: true
            }
        });
    },
    // Create a new task definition
    async create (data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskDefinition.create({
            data: {
                text: data.text,
                description: data.description,
                baselineDuration: data.baselineDuration,
                isRecurring: data.isRecurring,
                recurringDays: JSON.stringify(data.recurringDays)
            }
        });
    },
    // Update a task definition
    async update (id, data) {
        const updateData = {
            ...data
        };
        if (data.recurringDays) {
            updateData.recurringDays = JSON.stringify(data.recurringDays);
        }
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskDefinition.update({
            where: {
                id
            },
            data: updateData
        });
    },
    // Delete a task definition
    async delete (id) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskDefinition.delete({
            where: {
                id
            }
        });
    }
};
const taskAssignmentService = {
    // Get all assignments for a date range
    async getByDateRange (startDate, endDate) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskAssignment.findMany({
            where: {
                dateStr: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                task: true
            },
            orderBy: {
                dateStr: "asc"
            }
        });
    },
    // Get assignments for a specific date
    async getByDate (dateStr) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskAssignment.findMany({
            where: {
                dateStr
            },
            include: {
                task: true
            },
            orderBy: {
                createdAt: "asc"
            }
        });
    },
    // Get all assignments for a task
    async getByTaskId (taskId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskAssignment.findMany({
            where: {
                taskId
            },
            orderBy: {
                dateStr: "desc"
            }
        });
    },
    // Create a new assignment
    async create (data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskAssignment.create({
            data: {
                taskId: data.taskId,
                dateStr: data.dateStr,
                durationOverride: data.durationOverride,
                loggedHours: data.loggedHours || 0,
                completed: data.completed ?? false
            }
        });
    },
    // Update an assignment
    async update (id, data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskAssignment.update({
            where: {
                id
            },
            data
        });
    },
    // Delete an assignment
    async delete (id) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskAssignment.delete({
            where: {
                id
            }
        });
    }
};
const dayOffService = {
    // Get all days off in a date range
    async getByDateRange (startDate, endDate) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dayOff.findMany({
            where: {
                dateStr: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    },
    // Check if a date is a day off
    async isDateOff (dateStr) {
        const dayOff = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dayOff.findUnique({
            where: {
                dateStr
            }
        });
        return !!dayOff;
    },
    // Mark a day as off
    async markAsOff (dateStr) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dayOff.upsert({
            where: {
                dateStr
            },
            update: {},
            create: {
                dateStr
            }
        });
    },
    // Unmark a day as off
    async unmarkAsOff (dateStr) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dayOff.delete({
            where: {
                dateStr
            }
        }).catch(()=>null); // Return null if not found
    }
};
const taskTrackingService = {
    // Get tracking history for a task
    async getByTaskId (taskId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskTracking.findMany({
            where: {
                taskId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },
    // Get tracking history for an assignment
    async getByAssignmentId (assignmentId) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskTracking.findMany({
            where: {
                assignmentId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },
    // Create tracking record
    async create (data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskTracking.create({
            data: {
                assignmentId: data.assignmentId,
                taskId: data.taskId,
                hoursLogged: data.hoursLogged,
                dayCompleted: data.dayCompleted || false,
                totalHours: data.totalHours || 0,
                recurringDays: data.recurringDays ? JSON.stringify(data.recurringDays) : null,
                completionDate: data.dayCompleted ? new Date() : null
            }
        });
    },
    // Update tracking record
    async update (id, data) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskTracking.update({
            where: {
                id
            },
            data: {
                ...data,
                completionDate: data.dayCompleted ? new Date() : undefined
            }
        });
    },
    // Get aggregated statistics for a task
    async getTaskStats (taskId) {
        const tracking = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].taskTracking.findMany({
            where: {
                taskId
            }
        });
        const totalHours = tracking.reduce((sum, t)=>sum + t.hoursLogged, 0);
        const daysCompleted = tracking.filter((t)=>t.dayCompleted).length;
        const totalInstances = tracking.length;
        return {
            taskId,
            totalHours,
            daysCompleted,
            totalInstances,
            averageHoursPerDay: totalInstances > 0 ? totalHours / totalInstances : 0
        };
    }
};
}),
"[project]/app/api/days-off/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        if (!startDate || !endDate) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Please provide startDate and endDate parameters"
            }, {
                status: 400
            });
        }
        const daysOff = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dayOffService"].getByDateRange(startDate, endDate);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(daysOff);
    } catch (error) {
        console.error("Error fetching days off:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch days off"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        if (!body.dateStr) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "dateStr is required"
            }, {
                status: 400
            });
        }
        const dayOff = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dayOffService"].markAsOff(body.dateStr);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(dayOff, {
            status: 201
        });
    } catch (error) {
        console.error("Error marking day off:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to mark day off"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f5845bb._.js.map