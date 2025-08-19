"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Loading from "../loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  format,
  isBefore,
  isValid,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const toDateSafe = (raw: unknown): Date | null => {
  if (!raw) return null;
  const s = String(raw).trim();

  const iso = parseISO(s);
  if (isValid(iso)) return iso;

  const sqlTs = parse(s, "yyyy-MM-dd HH:mm:ss", new Date());
  if (isValid(sqlTs)) return sqlTs;

  const dateOnly = parse(s.split(/[T ]/)[0], "yyyy-MM-dd", new Date());
  return isValid(dateOnly) ? dateOnly : null;
};

function HomePage() {
  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useGetTasksQuery({ projectId: parseInt("5") });

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isTasksLoading || isProjectsLoading) return <Loading />;
  if (isTasksLoading || !tasks || !projects)
    return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;

      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const today = startOfDay(new Date());

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project) => {
      // robust parse: supports ISO; if your strings are "YYYY-MM-DD HH:mm:ss", normalize:
      const end = project.endDate
        ? parseISO(
            project.endDate.includes("T")
              ? project.endDate
              : project.endDate.replace(" ", "T"),
          )
        : null;

      const status = end && isBefore(end, today) ? "Done" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priorty", width: 150 },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      // Always has row/value
      renderCell: (params) => {
        const d = toDateSafe(params.row?.dueDate ?? params.value);
        return <span>{d ? format(d, "dd/MM/yyyy") : "—"}</span>;
      },
      // Optional: make sorting logical by date
      sortComparator: (v1, v2) => {
        const d1 = toDateSafe(v1)?.getTime() ?? 0;
        const d2 = toDateSafe(v2)?.getTime() ?? 0;
        return d1 - d2;
      },
    },
  ];

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#e0e0e0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="dark:bg-dark-secondary rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="dark:bg-dark-secondary rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dark:bg-dark-secondary rounded-lg bg-white p-4 shadow md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Tasks Status
          </h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={isTasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
