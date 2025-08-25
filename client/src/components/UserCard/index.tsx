import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type UserCardProps = {
  user: User;
};

function initialsFrom(user: User) {
  const base = (user.username || user.email || "?").trim();
  const parts = base.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

const UserCard = ({ user }: UserCardProps) => {
  const hasAvatar = Boolean(user.profilePictureUrl);

  return (
    <div className="group dark:border-stroke-dark dark:bg-dark-secondary flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5 dark:text-white">
      {/* Left: Avatar + name/email */}
      <div className="flex min-w-0 items-center gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 shrink-0">
          {hasAvatar ? (
            <Image
              src={`https://untask-s3.s3.eu-central-1.amazonaws.com/${user.profilePictureUrl!}`}
              alt={user.username ? `${user.username}'s avatar` : "User avatar"}
              width={48}
              height={48}
              className="dark:border-dark-secondary h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="dark:border-dark-secondary dark:bg-dark-tertiary flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gray-200 font-semibold text-gray-700 dark:text-white">
              {initialsFrom(user)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {user.username || "Unknown user"}
          </h3>
          <p className="truncate text-xs text-gray-600 dark:text-neutral-400">
            {user.email || "No email"}
          </p>
        </div>
      </div>

      {/* Right: ID badge (optional) */}
      {"userId" in user && user.userId !== undefined && (
        <span className="dark:bg-dark-tertiary rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:text-neutral-300">
          #{String(user.userId)}
        </span>
      )}
    </div>
  );
};

export default UserCard;
