// src/admin/reseed.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import {
  addDays,
  differenceInCalendarDays,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";

const prisma = new PrismaClient();

const isDateKey = (k: string) => /date$/i.test(k);

const parseSeedDate = (raw: string) => {
  if (!raw) return null;
  const s = raw.includes("T") ? raw : raw.replace(" ", "T");
  const d = parseISO(s);
  return isValid(d) ? d : null;
};

function shiftDatesDeep<T>(obj: T, deltaDays: number): T {
  if (Array.isArray(obj))
    return obj.map((x) => shiftDatesDeep(x, deltaDays)) as unknown as T;
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as any)) {
      if (v == null) out[k] = v;
      else if (typeof v === "string" && isDateKey(k)) {
        const d = parseSeedDate(v);
        out[k] = d ? addDays(d, deltaDays).toISOString() : v;
      } else {
        out[k] = shiftDatesDeep(v, deltaDays);
      }
    }
    return out as T;
  }
  return obj;
}

function readJson<T = any[]>(seedDir: string, file: string): T {
  return JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf-8"));
}

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle<T>(arr: T[]) {
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
export function rebalanceProjectDates<
  T extends { startDate?: string; endDate?: string }
>(projects: T[], { doneRatio = 0.5 }: { doneRatio?: number } = {}): T[] {
  const today = startOfDay(new Date());
  const total = projects.length;
  const doneCount = Math.round(total * doneRatio);

  // Pick which indices will be Done
  const indices = shuffle([...projects.keys()]);
  const doneSet = new Set(indices.slice(0, doneCount));

  return projects.map((proj, idx) => {
    if (doneSet.has(idx)) {
      // DONE: end in past, start before that
      const end = addDays(today, -rnd(5, 60));
      const start = addDays(end, -rnd(30, 180));
      return {
        ...proj,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    } else {
      // ACTIVE: end in future, started recently
      const start = addDays(today, -rnd(5, 30));
      const end = addDays(start, rnd(30, 180));
      return {
        ...proj,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
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
export async function reseedFromJson(opts?: {
  seedDir?: string;
  deltaDays?: number;
  anchorDaysAgo?: number;
}) {
  const seedDir =
    opts?.seedDir ?? path.resolve(process.cwd(), "prisma/seedData");

  // 1) Reset everything (order not required with CASCADE)
  await prisma.$executeRawUnsafe(`
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
  let deltaDays = opts?.deltaDays ?? 0;
  if (opts?.deltaDays == null) {
    let earliest: Date | null = null;
    for (const f of ["project.json", "task.json"]) {
      const rows: any[] = readJson(seedDir, f);
      for (const r of rows) {
        for (const [k, v] of Object.entries(r)) {
          if (typeof v === "string" && isDateKey(k)) {
            const d = parseSeedDate(v);
            if (d && (!earliest || d < earliest)) earliest = d;
          }
        }
      }
    }
    if (earliest) {
      const anchor = addDays(
        startOfDay(new Date()),
        -(opts?.anchorDaysAgo ?? 90)
      );
      deltaDays = differenceInCalendarDays(anchor, earliest);
    }
  }

  // 3) Read + shift
  const teams = readJson<any[]>(seedDir, "team.json"); // no id -> will autoincrement 1..n
  const users = readJson<any[]>(seedDir, "user.json"); // no userId -> will autoincrement 1..n
  let projects = shiftDatesDeep(
    readJson<any[]>(seedDir, "project.json"),
    deltaDays
  );
  projects = rebalanceProjectDates(projects, { doneRatio: 0.6 }); // now random which ones are done

  const projectTeams = readJson<any[]>(seedDir, "projectTeam.json");
  const tasks = shiftDatesDeep(
    readJson<any[]>(seedDir, "task.json"),
    deltaDays
  ); // has id 1..40, FKs to users/projects
  const attachments = readJson<any[]>(seedDir, "attachment.json");
  const comments = readJson<any[]>(seedDir, "comment.json");
  const taskAssignments = readJson<any[]>(seedDir, "taskAssignment.json");

  // 4) Seed in FK-safe order
  // Team
  for (const row of teams) {
    await prisma.team.create({ data: row });
  }
  // User (references Team via teamId)
  for (const row of users) {
    await prisma.user.create({ data: row });
  }
  // Project
  for (const row of projects) {
    await prisma.project.create({ data: row });
  }
  // ProjectTeam (joins Team & Project)
  for (const row of projectTeams) {
    await prisma.projectTeam.create({ data: row });
  }
  // Task (references Project, User author/assignee)
  for (const row of tasks) {
    await prisma.task.create({ data: row });
  }
  // Attachment (references Task, User)
  for (const row of attachments) {
    await prisma.attachment.create({ data: row });
  }
  // Comment (references Task, User)
  for (const row of comments) {
    await prisma.comment.create({ data: row });
  }
  // TaskAssignment (references Task, User)
  for (const row of taskAssignments) {
    await prisma.taskAssignment.create({ data: row });
  }

  return { deltaDays };
}
