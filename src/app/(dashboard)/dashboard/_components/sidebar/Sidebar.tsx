"use client";
import { sidebarItems } from "@/const/data";
import { SidebarItem as SidebarItemType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, CircleDashed } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "../navbar/ModeToggle";

const Sidebar = () => {
  const depthLevel = 0;
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between p-4 py-2">
        <Link href={"/dashboard"} className="">
          Dashboard
        </Link>
        <ModeToggle />
      </div>
      <div>
        {sidebarItems.map((item) => (
          <SidebarItems key={item.title} items={item} depthLevel={depthLevel} />
        ))}
      </div>
    </div>
  );
};

const SidebarItems = ({
  items,
  depthLevel,
}: {
  items: SidebarItemType;
  depthLevel?: number;
}) => {
  const pathname = usePathname();
  const [subItem, setSubitem] = useState(false);
  const Icon = items.icon;
  const { data: session } = useSession();

  const shouldRenderItem = (itemRole: string | undefined) => {
    if (!itemRole) return true;
    return session?.user.role === itemRole;
  };

  if (items.submenu) {
    if (!shouldRenderItem(items.role)) {
      return null;
    }
    return (
      <div>
        <div
          onClick={() => setSubitem(!subItem)}
          className={cn(
            "flex items-center justify-between px-2 py-2 border-l-2 border-transparent hover:bg-zinc-300 dark:hover:bg-zinc-950 transition-all duration-300 cursor-pointer",
            {
              "border-l-2 border-red-500 dark:bg-zinc-950 bg-zinc-300  ":
                subItem,
            }
          )}
        >
          <div className={cn("flex gap-2")}>
            <span>
              {items.icon ? <Icon size={18} /> : <CircleDashed size={18} />}
            </span>
            <span>{items.title}</span>
          </div>
          <span
            className={cn("", {
              "-rotate-90 transition-all duration-300 ": subItem,
            })}
          >
            <ChevronLeft size={14} />
          </span>
        </div>
        <SidebarItem
          subItems={items.submenu}
          subItem={subItem}
          depthLevel={depthLevel}
        />
      </div>
    );
  } else {
    if (!shouldRenderItem(items.role)) {
      return null;
    }
    return (
      <Link
        href={items.path!}
        className={cn(
          "flex items-center gap-2 px-2 py-2 border-l-2 border-transparent hover:bg-zinc-300 dark:hover:bg-zinc-950 transition-all duration-300",
          {
            "bg-zinc-300 dark:bg-zinc-950  border-l-2 border-red-500":
              pathname === items.path,
          }
        )}
      >
        <span>
          {items.icon ? (
            <Icon size={depthLevel && depthLevel > 0 ? 14 : 18} />
          ) : (
            <CircleDashed size={depthLevel && depthLevel > 0 ? 12 : 18} />
          )}
        </span>
        <span>{items.title}</span>
      </Link>
    );
  }
};

const SidebarItem = ({
  subItems,
  subItem,
  depthLevel,
}: {
  subItems: SidebarItemType[];
  subItem: boolean;
  depthLevel?: number;
}) => {
  depthLevel = depthLevel && depthLevel + 1;

  return (
    <div
      className={cn("bg-zinc-200 dark:bg-zinc-800 ml-4 text-sm my-1 hidden", {
        block: subItem,
      })}
    >
      {subItems.map((item) => (
        <SidebarItems key={item.title} items={item} />
      ))}
    </div>
  );
};

export default Sidebar;
