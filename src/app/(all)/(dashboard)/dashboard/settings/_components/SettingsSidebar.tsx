"use client";
import { settingsSidebarItems } from "@/const/data";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const checkRole = (itemRole: string | undefined) => {
    if (!itemRole) return true;
    return session?.user.role === itemRole;
  };

  return (
    <div className="p-2 border-r w-full h-full space-y-4">
      {settingsSidebarItems.map((section, i) => (
        <div key={i} className="space-y-2 ">
          <h1 className="text-sm">{section.title}</h1>
          {section.content.map((item) => {
            if (checkRole(item.role)) {
              return (
                <div
                  key={item.path}
                  className={cn(
                    "w-full px-4 py-2 rounded-sm bg-transparent border-l-2 border-transparent hover:dark:bg-zinc-700 hover:bg-zinc-300",
                    {
                      "dark:bg-zinc-900 bg-zinc-300 border-l-2 border-red-500":
                        pathname === item.path,
                    }
                  )}
                >
                  <Link href={item.path} className="flex items-center gap-4">
                    {<item.icon size={20} />}
                    {item.title}
                  </Link>
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default SettingsSidebar;
