"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";
import StoreProvider, { useAppSelector } from "./redux";
import ThemeBridge from "./ThemeBridge";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />

      <main
        className={`dark:bg-dark flex w-full flex-col bg-gray-50 ${isSidebarCollapsed ? "" : "md:pl-64"}`}
      >
        <Navbar />

        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeBridge />
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
