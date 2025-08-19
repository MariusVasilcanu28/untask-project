import Header from "@/components/Header";
import ReseedButton from "@/components/ReseedButton";
import React from "react";

const Settings = () => {
  const userSettings = {
    username: "testuser",
    email: "test.user@email.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  const labelStyles = "block text-sm font-medium dark:text-whtie";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={textStyles}>{userSettings.username}</div>
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>{userSettings.email}</div>
        </div>
        <div>
          <label className={labelStyles}>Team</label>
          <div className={textStyles}>{userSettings.teamName}</div>
        </div>
        <div>
          <label className={labelStyles}>Role</label>
          <div className={textStyles}>{userSettings.roleName}</div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 text-lg font-semibold dark:text-white">
          Developer tools
        </h3>
        <ReseedButton anchorDaysAgo={90} />
      </div>
    </div>
  );
};

export default Settings;
