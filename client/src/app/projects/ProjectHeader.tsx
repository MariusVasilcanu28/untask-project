import Header from "@/components/Header";
import {
  Clock,
  FilterIcon,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react";
import React, { useState } from "react";
import ModalNewProject from "./ModalNewProject";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

function ProjectHeader({ activeTab, setActiveTab }: Props) {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      <div className="pt-6 pb-6 lg:pt-8 lg:pb-4">
        <Header
          name="Product Design Development"
          buttonComponent={
            <button
              className="bg-blue-primary flex items-center rounded-md px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> New Boards
            </button>
          }
        />
      </div>

      {/* Tabs */}
      <div className="dark:border-stroke-dark flex flex-wrap-reverse gap-2 border-y border-gray-200 pt-2 pb-[8px] md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="cursor-pointer text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <FilterIcon className="h-5 w-5" />
          </button>
          <button className="cursor-pointer text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="dark:border-dark-secondary dark:bg-dark-secondary rounded-md border border-gray-300 py-1 pr-4 pl-10 focus:outline-none dark:text-white"
            />
            <Grid3x3 className="absolute top-2 left-3 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex cursor-pointer items-center gap-2 px-1 py-2 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 sm:px-2 lg:px-4 dark:hover:text-white ${
        isActive
          ? "text-blue-600 after:bg-blue-600 dark:text-white"
          : "text-gray-500 dark:text-neutral-500"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
