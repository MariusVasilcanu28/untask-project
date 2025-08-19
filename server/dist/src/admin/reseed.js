"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebalanceProjectDates = rebalanceProjectDates;
exports.reseedFromJson = reseedFromJson;
// src/admin/reseed.ts
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
const isDateKey = (k) => /date$/i.test(k);
const parseSeedDate = (raw) => {
    if (!raw)
        return null;
    const s = raw.includes("T") ? raw : raw.replace(" ", "T");
    const d = (0, date_fns_1.parseISO)(s);
    return (0, date_fns_1.isValid)(d) ? d : null;
};
function shiftDatesDeep(obj, deltaDays) {
    if (Array.isArray(obj))
        return obj.map((x) => shiftDatesDeep(x, deltaDays));
    if (obj && typeof obj === "object") {
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
            if (v == null)
                out[k] = v;
            else if (typeof v === "string" && isDateKey(k)) {
                const d = parseSeedDate(v);
                out[k] = d ? (0, date_fns_1.addDays)(d, deltaDays).toISOString() : v;
            }
            else {
                out[k] = shiftDatesDeep(v, deltaDays);
            }
        }
        return out;
    }
    return obj;
}
function readJson(seedDir, file) {
    return JSON.parse(fs_1.default.readFileSync(path_1.default.join(seedDir, file), "utf-8"));
}
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
/**
 * Randomly marks ~doneRatio of projects as Done (endDate < today),
 * the rest as Active (endDate > today).
 * Guarantees the exact count = round(total * doneRatio).
 */
function rebalanceProjectDates(projects, { doneRatio = 0.5 } = {}) {
    const today = (0, date_fns_1.startOfDay)(new Date());
    const total = projects.length;
    const doneCount = Math.round(total * doneRatio);
    // Pick which indices will be Done
    const indices = shuffle([...projects.keys()]);
    const doneSet = new Set(indices.slice(0, doneCount));
    return projects.map((proj, idx) => {
        if (doneSet.has(idx)) {
            // DONE: end in past, start before that
            const end = (0, date_fns_1.addDays)(today, -rnd(5, 60));
            const start = (0, date_fns_1.addDays)(end, -rnd(30, 180));
            return Object.assign(Object.assign({}, proj), { startDate: start.toISOString(), endDate: end.toISOString() });
        }
        else {
            // ACTIVE: end in future, started recently
            const start = (0, date_fns_1.addDays)(today, -rnd(5, 30));
            const end = (0, date_fns_1.addDays)(start, rnd(30, 180));
            return Object.assign(Object.assign({}, proj), { startDate: start.toISOString(), endDate: end.toISOString() });
        }
    });
}
/**
 * Re-seed DB using JSON files, shifting any "*Date" fields.
 * - Truncates all tables and resets sequences
 * - Seeds in FK-safe order
 * - deltaDays: fixed shift (optional)
 * - anchorDaysAgo: if provided (e.g., 90), auto-shifts so earliest seed date ~= now - anchorDaysAgo
 */
function reseedFromJson(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const seedDir = (_a = opts === null || opts === void 0 ? void 0 : opts.seedDir) !== null && _a !== void 0 ? _a : path_1.default.resolve(process.cwd(), "prisma/seedData");
        // 1) Reset everything (order not required with CASCADE)
        yield prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "ProjectTeam",
      "TaskAssignment",
      "Attachment",
      "Comment",
      "Task",
      "Project",
      "User",
      "Team"
    RESTART IDENTITY CASCADE;
  `);
        // 2) Compute deltaDays
        let deltaDays = (_b = opts === null || opts === void 0 ? void 0 : opts.deltaDays) !== null && _b !== void 0 ? _b : 0;
        if ((opts === null || opts === void 0 ? void 0 : opts.deltaDays) == null) {
            let earliest = null;
            for (const f of ["project.json", "task.json"]) {
                const rows = readJson(seedDir, f);
                for (const r of rows) {
                    for (const [k, v] of Object.entries(r)) {
                        if (typeof v === "string" && isDateKey(k)) {
                            const d = parseSeedDate(v);
                            if (d && (!earliest || d < earliest))
                                earliest = d;
                        }
                    }
                }
            }
            if (earliest) {
                const anchor = (0, date_fns_1.addDays)((0, date_fns_1.startOfDay)(new Date()), -((_c = opts === null || opts === void 0 ? void 0 : opts.anchorDaysAgo) !== null && _c !== void 0 ? _c : 90));
                deltaDays = (0, date_fns_1.differenceInCalendarDays)(anchor, earliest);
            }
        }
        // 3) Read + shift
        const teams = readJson(seedDir, "team.json"); // no id -> will autoincrement 1..n
        const users = readJson(seedDir, "user.json"); // no userId -> will autoincrement 1..n
        let projects = shiftDatesDeep(readJson(seedDir, "project.json"), deltaDays);
        projects = rebalanceProjectDates(projects, { doneRatio: 0.6 }); // now random which ones are done
        const projectTeams = readJson(seedDir, "projectTeam.json");
        const tasks = shiftDatesDeep(readJson(seedDir, "task.json"), deltaDays); // has id 1..40, FKs to users/projects
        const attachments = readJson(seedDir, "attachment.json");
        const comments = readJson(seedDir, "comment.json");
        const taskAssignments = readJson(seedDir, "taskAssignment.json");
        // 4) Seed in FK-safe order
        // Team
        for (const row of teams) {
            yield prisma.team.create({ data: row });
        }
        // User (references Team via teamId)
        for (const row of users) {
            yield prisma.user.create({ data: row });
        }
        // Project
        for (const row of projects) {
            yield prisma.project.create({ data: row });
        }
        // ProjectTeam (joins Team & Project)
        for (const row of projectTeams) {
            yield prisma.projectTeam.create({ data: row });
        }
        // Task (references Project, User author/assignee)
        for (const row of tasks) {
            yield prisma.task.create({ data: row });
        }
        // Attachment (references Task, User)
        for (const row of attachments) {
            yield prisma.attachment.create({ data: row });
        }
        // Comment (references Task, User)
        for (const row of comments) {
            yield prisma.comment.create({ data: row });
        }
        // TaskAssignment (references Task, User)
        for (const row of taskAssignments) {
            yield prisma.taskAssignment.create({ data: row });
        }
        return { deltaDays };
    });
}
