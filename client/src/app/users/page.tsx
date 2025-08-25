"use client";

import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetUsersQuery } from "@/state/api";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  FilterPanelTrigger,
  GridColDef,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  gridFilterModelSelector, // <-- read filter model via selector
  GridFilterItem,
  GridFilterListIcon,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
  GridToolbarExport,
  ExportCsv,
  GridDownloadIcon,
} from "@mui/x-data-grid";
import Image from "next/image";
import Loading from "../loading";
import { useAppSelector } from "../redux";
import React from "react";
import { MenuIcon } from "lucide-react";
import MenuItem from "@mui/material/MenuItem";

const CustomToolbar = () => {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector); // <- current model

  const removeFilter = (target: GridFilterItem) => {
    const nextItems = (filterModel.items ?? []).filter((it) =>
      target.id != null
        ? it.id !== target.id
        : !(
            it.field === target.field &&
            it.operator === target.operator &&
            it.value === target.value
          ),
    );

    apiRef.current.setFilterModel({
      ...filterModel,
      items: nextItems,
    });
  };

  return (
    <Toolbar className="toolbar flex gap-2">
      <Tooltip
        title="Filters"
        className="flex items-center justify-between gap-1"
      >
        <FilterPanelTrigger render={<ToolbarButton className="" />}>
          <GridFilterListIcon />
          <span className="text-sm font-semibold">Filter</span>
        </FilterPanelTrigger>
      </Tooltip>

      <Tooltip title="Export as CSV">
        <ExportCsv
          render={<ToolbarButton />}
          className="flex items-center justify-between gap-1"
        >
          <GridDownloadIcon />
          <span className="text-sm font-semibold">Export as CSV</span>
        </ExportCsv>
      </Tooltip>

      <Stack direction="row" sx={{ gap: 0.5, flex: 1 }}>
        {activeFilters.map((filter) => {
          const column = columns[filter.field];
          const fieldLabel = column?.headerName ?? filter.field;
          const value = filter.value ?? "";
          return (
            <Chip
              key={filter.id ?? `${filter.field}-${filter.operator}-${value}`}
              label={`${fieldLabel}: ${value}`}
              onDelete={() => removeFilter(filter)}
              sx={{ mx: 0.25 }}
            />
          );
        })}
      </Stack>
    </Toolbar>
  );
};

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", minWidth: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Image
            src={`https://untask-s3.s3.eu-central-1.amazonaws.com/${params.value || "placeholder-avatar.png"}`}
            alt={params.row.username || "user"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <Loading />;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div className="h-[650px] w-full">
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          slots={{ toolbar: CustomToolbar }}
          showToolbar
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Users;
