export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  const mono = isDarkMode
    ? {
        text: "#e5e7eb",
        bg: "#1d1f21",
        hoverBg: "#222629",
        selBg: "#262a2e",
        selHoverBg: "#2a2f33",
        border: "#2d3135",
        ring: "#3b3f44",
      }
    : {
        text: "#374151",
        bg: "#ffffff",
        hoverBg: "#f9fafb",
        selBg: "#f3f4f6",
        selHoverBg: "#e5e7eb",
        border: "#e5e7eb",
        ring: "#d1d5db",
      };

  return {
    "& .MuiDataGrid-columnHeaders": {
      color: isDarkMode ? mono.text : "",
      '& [role="row"] > *': {
        backgroundColor: isDarkMode ? mono.bg : mono.bg,
        borderColor: isDarkMode ? mono.border : "",
      },
    },

    // DO NOT TOUCH mainContent per your request
    "& .MuiDataGrid-mainContent": {
      color: isDarkMode ? mono.text : "",
      backgroundColor: isDarkMode ? mono.bg : mono.bg,
      borderColor: isDarkMode ? mono.border : "",
    },

    // Monochrome highlights
    "& .MuiDataGrid-row:hover": {
      color: isDarkMode ? mono.text : mono.text,
      backgroundColor: mono.hoverBg,
      borderColor: mono.border,
    },

    "& .MuiDataGrid-row.Mui-selected": {
      color: isDarkMode ? mono.text : mono.text,
      backgroundColor: mono.selBg,
      borderColor: mono.border,
      boxShadow: `inset 0 0 0 1px ${mono.ring}`,
    },

    "& .MuiDataGrid-row.Mui-selected:hover": {
      color: isDarkMode ? mono.text : mono.text,
      backgroundColor: mono.selHoverBg,
      borderColor: mono.border,
    },

    // Misc
    "& .MuiIconButton-root": {
      color: isDarkMode ? "#a3a3a3" : "",
    },
    "& .MuiTablePagination-root": {
      color: isDarkMode ? "#a3a3a3" : "",
    },
    "& .MuiTablePagination-selectIcon": {
      color: isDarkMode ? "#a3a3a3" : "",
    },
    "& .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? mono.border : mono.border}`,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: isDarkMode ? mono.border : mono.border,
    },
  };
};
