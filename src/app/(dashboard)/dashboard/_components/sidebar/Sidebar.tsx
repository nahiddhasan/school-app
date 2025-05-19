"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, CircleDashed } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AcademicYear } from "@/app/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sidebarItems } from "@/const/data";
import { hasAccess } from "@/lib/handlerFn";
import { SidebarItem as SidebarItemType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { ModeToggle } from "../navbar/ModeToggle";

// Fetchers
const fetchAcademicYears = async () => {
  const res = await fetch("/api/academic-years");
  if (!res.ok) throw new Error("Failed to fetch academic years");
  return res.json();
};

const fetchCurrentYear = async (): Promise<AcademicYear> => {
  const res = await fetch("/api/academic-year/current");
  if (!res.ok) throw new Error("Failed to fetch current year");
  return res.json();
};

const Sidebar = () => {
  const { selectedYearId, setSelectedYear, setYears, setCurrentYear, years } =
    useAcademicYearStore();

  const { data: session } = useSession();

  const { data: allYears } = useQuery({
    queryKey: ["academicYears"],
    queryFn: fetchAcademicYears,
    staleTime: Infinity,
  });

  const { data: currentYear, isLoading: loadingCurrent } = useQuery({
    queryKey: ["currentYear"],
    queryFn: fetchCurrentYear,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (allYears) {
      setYears(allYears);
    }
  }, [allYears, setYears]);

  useEffect(() => {
    if (currentYear) {
      setCurrentYear(currentYear);
    }
  }, [currentYear, setCurrentYear]);

  useEffect(() => {
    if (selectedYearId) {
      setSelectedYear(selectedYearId);
    } else if (!loadingCurrent && currentYear) {
      setCurrentYear(currentYear);
    }
  }, [
    loadingCurrent,
    currentYear,
    setSelectedYear,
    setCurrentYear,
    selectedYearId,
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 py-2">
        <Link href="/dashboard">🧾 EduSphere</Link>
        <ModeToggle />
      </div>

      <div className="w-[90%] mb-4 mx-auto">
        {session?.user.role === "ADMIN" && (
          <Select value={selectedYearId ?? ""} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full h-10 rounded-md">
              <SelectValue placeholder="Select Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  Academic Year: {year.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <SidebarLink key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
};

const SidebarLink = ({
  item,
  level = 0,
}: {
  item: SidebarItemType;
  level?: number;
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { selectedYearId, isCurrent } = useAcademicYearStore();
  const storageKey = `sidebar_expanded_${item.title.replace(/\s+/g, "_")}`;
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "true") {
      setExpanded(true);
    }
  }, [storageKey]);
  const Icon = item.icon || CircleDashed;

  const checkRole = (path?: string) => {
    if (!path || !session?.user?.role) return true;
    return hasAccess(path, session.user.role);
  };

  const isActive = pathname === item.path;

  const filteredSubmenu = item.submenu?.filter((sub) => checkRole(sub.path));
  if (item.submenu && filteredSubmenu?.length === 0) return null;
  if (!item.submenu && !checkRole(item.path)) return null;

  const toggleExpanded = () => {
    const newState = !expanded;
    setExpanded(newState);
    localStorage.setItem(storageKey, String(newState));
  };
  return (
    <div>
      <div
        onClick={() => {
          if (filteredSubmenu && filteredSubmenu.length > 0) toggleExpanded();
        }}
        className={cn(
          "flex items-center justify-between px-4 py-2 mx-2 rounded-md transition-all duration-300 hover:bg-secondary border-l-2 border-transparent cursor-pointer",
          {
            "bg-secondary navgradient transition-all": isActive,
          }
        )}
      >
        {filteredSubmenu && filteredSubmenu.length > 0 ? (
          <div className="flex items-center gap-2 truncate">
            <Icon size={level > 0 ? 14 : 18} />
            <span>{item.title}</span>
          </div>
        ) : (
          <Link
            href={{
              pathname: item.path,
              query: {
                selectedYearId,
                isCurrent,
              },
            }}
            className="flex items-center gap-2 truncate w-full"
          >
            <Icon size={level > 0 ? 14 : 18} />
            <span>{item.title}</span>
          </Link>
        )}

        {filteredSubmenu && filteredSubmenu.length > 0 && (
          <ChevronLeft
            size={14}
            className={cn("transition-transform", {
              "-rotate-90": expanded,
            })}
          />
        )}
      </div>

      {filteredSubmenu && filteredSubmenu.length > 0 && (
        <div
          className={cn("ml-6 transition-all border-l-2 border-border", {
            hidden: !expanded,
          })}
        >
          {filteredSubmenu.map((subItem) => (
            <SidebarLink key={subItem.title} item={subItem} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
