"use client";

import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  ExportCsv,
  FilterPanelTrigger,
  GridColDef,
  gridColumnLookupSelector,
  GridDownloadIcon,
  gridFilterActiveItemsSelector, // <-- read filter model via selector
  GridFilterItem,
  GridFilterListIcon,
  gridFilterModelSelector,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Loading from "../loading";
import { useAppSelector } from "../redux";
import { useGetTeamsQuery } from "@/state/api";

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
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", minWidth: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", minWidth: 200 },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    minWidth: 200,
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <Loading />;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div className="h-[650px] w-full">
        <DataGrid
          rows={teams}
          columns={columns}
          getRowId={(row) => row.id}
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

export default Teams;
