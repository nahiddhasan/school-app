"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sidebarItems } from "@/const/data";
import { useAcademicLink } from "@/hooks/useAcademicLink";
import { SidebarItem as SidebarItemType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, CircleDashed } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "../navbar/ModeToggle";
const fetchAcademicYears = async () => {
  const res = await fetch("/api/academic-years");
  if (!res.ok) throw new Error("Failed to fetch academic years");
  return res.json();
};
const fetchCurrentYear = async () => {
  const res = await fetch("/api/academic-year/current");
  if (!res.ok) throw new Error("Failed to fetch academic years");
  return res.json();
};

const Sidebar = () => {
  const depthLevel = 0;
  const { selectedYearId, setSelectedYear } = useAcademicYearStore();

  const {
    data: years,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["academicYears"],
    queryFn: fetchAcademicYears,
  });

  const { data: currentYear, isLoading: currentYearLoading } = useQuery({
    queryKey: ["currentYear"],
    queryFn: fetchCurrentYear,
  });

  useEffect(() => {
    if (!currentYearLoading && currentYear) {
      setSelectedYear(currentYear.id);
    }
  }, [currentYearLoading, currentYear, setSelectedYear]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between p-4 py-2">
        <Link href={"/dashboard"} className="">
          Dashboard
        </Link>
        <ModeToggle />
      </div>
      <div>
        <div className="w-[90%] mb-4 mx-auto">
          <Select
            value={selectedYearId as string}
            onValueChange={(selectedValue) => setSelectedYear(selectedValue)}
          >
            <SelectTrigger className="w-full h-10 rounded-md">
              <SelectValue placeholder="Select Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {!isLoading &&
                years.map((year: any) => (
                  <SelectItem key={year.id} value={year.id}>
                    Academic Year: {year.year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

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
  const admissionLink = useAcademicLink(items.path!);
  const checkRole = (itemRole: string | undefined) => {
    if (!itemRole) return true;
    return session?.user.role === itemRole;
  };

  if (items.submenu) {
    if (!checkRole(items.role)) {
      return null;
    }
    return (
      <div>
        <div
          onClick={() => setSubitem(!subItem)}
          className={cn(
            "flex items-center justify-between px-4 py-2 border-l-2 border-transparent hover:bg-zinc-300 dark:hover:bg-zinc-950 transition-all duration-300 cursor-pointer",
            {
              "navgradient dark:bg-zinc-950 bg-zinc-300  ": subItem,
            }
          )}
        >
          <div className={cn("flex gap-2")}>
            <span>
              {items.icon ? <Icon size={18} /> : <CircleDashed size={18} />}
            </span>
            <span className="truncate">{items.title}</span>
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
    if (!checkRole(items.role)) {
      return null;
    }
    return (
      <Link
        href={admissionLink}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border-l-2 border-transparent hover:bg-zinc-300 dark:hover:bg-zinc-950 transition-all duration-300",
          {
            "bg-zinc-300 dark:bg-zinc-950 navgradient": pathname === items.path,
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
        <span className="truncate">{items.title}</span>
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
      className={cn(
        "bg-zinc-200 dark:bg-zinc-800 ml-4 text-sm my-1 hidden invisible transition-all duration-300 ease-out",
        {
          "block visible transition-all duration-300 ease-out": subItem,
        }
      )}
    >
      {subItems.map((item) => (
        <SidebarItems key={item.title} items={item} />
      ))}
    </div>
  );
};

export default Sidebar;
