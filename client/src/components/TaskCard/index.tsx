import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type TaskCardProps = {
  task: Task;
};

const statusClass: Record<string, string> = {
  "To Do":
    "bg-gray-200 text-gray-700 dark:bg-neutral-700 dark:text-neutral-200",
  "In Progress":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  Stage: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
  QC: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  Done: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-200",
};

const priorityClass: Record<string, string> = {
  Urgent: "bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-200",
  High: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  Medium:
    "bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-200",
  Low: "bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
};

const TaskCard = ({ task }: TaskCardProps) => {
  const tags =
    task.tags
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [];

  const start = task.startDate ? format(new Date(task.startDate), "P") : "";
  const due = task.dueDate ? format(new Date(task.dueDate), "P") : "";

  return (
    <div className="group dark:border-stroke-dark dark:bg-dark-secondary overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:text-white">
      {/* Attachment preview */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="relative">
          <Image
            src={`https://untask-s3.s3.eu-central-1.amazonaws.com/${task.attachments[0].fileURL}`}
            alt={task.attachments[0].fileName || "Attachment"}
            width={800}
            height={600}
            className="h-40 w-full object-cover md:h-48"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Title + ID */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h3>
          <span className="dark:bg-dark-tertiary rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:text-neutral-300">
            #{task.id}
          </span>
        </div>

        {/* Status / Priority */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {task.status && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                statusClass[task.status] ??
                "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {task.status}
            </span>
          )}
          {task.priority && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                priorityClass[task.priority] ??
                "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {task.priority}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="dark:bg-dark-tertiary rounded-full bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700 dark:text-white/80"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500 dark:text-neutral-500">
              No tags
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-700 dark:text-neutral-400">
          {task.description || "No description provided"}
        </p>

        {/* Divider */}
        <div className="dark:border-stroke-dark mt-4 border-t border-gray-200" />

        {/* Meta: dates + people */}
        <div className="mt-3 flex flex-col gap-2 text-xs text-gray-600 dark:text-neutral-400">
          <div className="flex flex-wrap gap-2">
            <span className="font-medium text-gray-700 dark:text-neutral-300">
              Start:
            </span>
            <span>{start || "Not set"}</span>
            <span className="dark:bg-stroke-dark mx-2 h-3 w-px self-center bg-gray-200" />
            <span className="font-medium text-gray-700 dark:text-neutral-300">
              Due:
            </span>
            <span>{due || "Not set"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="font-medium text-gray-700 dark:text-neutral-300">
              Author:
            </span>
            <span>{task.author ? task.author.username : "Unknown"}</span>
            <span className="dark:bg-stroke-dark mx-2 h-3 w-px self-center bg-gray-200" />
            <span className="font-medium text-gray-700 dark:text-neutral-300">
              Assignee:
            </span>
            <span>{task.assignee ? task.assignee.username : "Unassigned"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
