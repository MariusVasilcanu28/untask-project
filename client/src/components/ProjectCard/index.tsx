import { Project } from "@/state/api";
import { format } from "date-fns";
import React from "react";

type ProjectCardProps = {
  project: Project;
};

function ProjectCard({ project }: ProjectCardProps) {
  const start = project.startDate
    ? format(new Date(project.startDate), "P")
    : "";
  const end = project.endDate ? format(new Date(project.endDate), "P") : "";

  return (
    <div className="group dark:border-stroke-dark dark:bg-dark-secondary overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:text-white">
      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Title + ID */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>
          {typeof project.id !== "undefined" && (
            <span className="dark:bg-dark-tertiary rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:text-neutral-300">
              #{project.id}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-700 dark:text-neutral-400">
          {project.description || "No description provided"}
        </p>

        {/* Divider */}
        <div className="dark:border-stroke-dark mt-4 border-t border-gray-200" />

        {/* Meta: dates */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-neutral-400">
          <span className="font-medium text-gray-700 dark:text-neutral-300">
            Start:
          </span>
          <span>{start || "Not set"}</span>
          <span className="dark:bg-stroke-dark mx-2 h-3 w-px self-center bg-gray-200" />
          <span className="font-medium text-gray-700 dark:text-neutral-300">
            End:
          </span>
          <span>{end || "Not set"}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
