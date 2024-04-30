"use client";
import { cn } from "@/lib/utils";
import { UserRoundCog, UserRoundPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[3];
  return (
    <div className="p-2 border-r w-full h-full space-y-4">
      <div className="space-y-2 ">
        <h1 className="text-sm">Users Section</h1>
        <div
          className={cn(
            "w-full px-4 py-2 rounded-sm bg-transparent border-l-2 border-transparent hover:dark:bg-zinc-700 hover:bg-zinc-300",
            {
              "dark:bg-zinc-900 bg-zinc-300 border-l-2 border-red-500":
                currentPath === "add-user",
            }
          )}
        >
          <Link
            href={"/dashboard/settings/add-user"}
            className="flex items-center gap-4"
          >
            <UserRoundPlus size={20} /> Add New User
          </Link>
        </div>
        <div
          className={cn(
            "w-full px-4 py-2 rounded-sm bg-transparent border-l-2 border-transparent hover:dark:bg-zinc-700 hover:bg-zinc-300",
            {
              "dark:bg-zinc-900 bg-zinc-300 border-l-2 border-red-500":
                currentPath === "current-users",
            }
          )}
        >
          <Link
            href={"/dashboard/settings/current-users"}
            className="flex items-center gap-4"
          >
            <UsersRound size={20} /> All Users
          </Link>
        </div>
        <div
          className={cn(
            "w-full px-4 py-2 rounded-sm bg-transparent border-l-2 border-transparent hover:dark:bg-zinc-700 hover:bg-zinc-300",
            {
              "dark:bg-zinc-900 bg-zinc-300 border-l-2 border-red-500":
                currentPath === "update-profile",
            }
          )}
        >
          <Link
            href={"/dashboard/settings/update-profile"}
            className="flex items-center gap-4"
          >
            <UserRoundCog size={20} /> Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
