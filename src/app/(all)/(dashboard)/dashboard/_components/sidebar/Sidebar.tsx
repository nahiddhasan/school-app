// "use client";

// import { ChevronLeft, CircleDashed } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { sidebarItems } from "@/const/data";
// import { hasAccess } from "@/lib/handlerFn";
// import { SidebarItem as SidebarItemType } from "@/lib/types";
// import { cn } from "@/lib/utils";
// import { useAcademicYearStore } from "@/store/useAcademicYearStore";
// import { useQuery } from "@tanstack/react-query";
// import { ModeToggle } from "../navbar/ModeToggle";

// const fetchAcademicYears = async () => {
//   const res = await fetch("/api/academic-years");
//   if (!res.ok) throw new Error("Failed to fetch academic years");
//   return res.json();
// };

// const fetchCurrentYear = async () => {
//   const res = await fetch("/api/academic-year/current");
//   if (!res.ok) throw new Error("Failed to fetch current year");
//   return res.json();
// };

// const Sidebar = () => {
//   const { selectedYearId, setSelectedYear } = useAcademicYearStore();
//   const { data: years } = useQuery({
//     queryKey: ["academicYears"],
//     queryFn: fetchAcademicYears,
//   });
//   const { data: currentYear, isLoading: currentYearLoading } = useQuery({
//     queryKey: ["currentYear"],
//     queryFn: fetchCurrentYear,
//   });

//   useEffect(() => {
//     if (!currentYearLoading && currentYear) {
//       setSelectedYear(currentYear.id);
//     }
//   }, [currentYearLoading, currentYear, setSelectedYear]);

//   return (
//     <div className="h-full overflow-y-auto">
//       <div className="flex items-center justify-between p-4 py-2">
//         <Link href="/dashboard">Dashboard</Link>
//         <ModeToggle />
//       </div>

//       <div className="w-[90%] mb-4 mx-auto">
//         <Select
//           value={selectedYearId as string}
//           onValueChange={setSelectedYear}
//         >
//           <SelectTrigger className="w-full h-10 rounded-md">
//             <SelectValue placeholder="Select Academic Year" />
//           </SelectTrigger>
//           <SelectContent>
//             {years?.map((year: any) => (
//               <SelectItem key={year.id} value={year.id}>
//                 Academic Year: {year.year}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-1">
//         {sidebarItems.map((item) => (
//           <SidebarLink key={item.title} item={item} />
//         ))}
//       </div>
//     </div>
//   );
// };

// const SidebarLink = ({
//   item,
//   level = 0,
// }: {
//   item: SidebarItemType;
//   level?: number;
// }) => {
//   const pathname = usePathname();
//   const { data: session } = useSession();
//   const { selectedYearId } = useAcademicYearStore();
//   const [expanded, setExpanded] = useState(false);
//   const Icon = item.icon || CircleDashed;

//   const checkRole = (path?: string) => {
//     if (!path || !session?.user?.role) return true;
//     return hasAccess(path, session.user.role);
//   };

//   const isActive = pathname === item.path;

//   const filteredSubmenu = item.submenu?.filter((sub) => checkRole(sub.path));

//   if (item.submenu && filteredSubmenu?.length === 0) return null;

//   if (!item.submenu && !checkRole(item.path)) return null;

//   return (
//     <div>
//       <div
//         onClick={() =>
//           filteredSubmenu && filteredSubmenu.length > 0
//             ? setExpanded((prev) => !prev)
//             : null
//         }
//         className={cn(
//           "flex items-center justify-between px-4 py-2 mx-2 rounded-md transition-all duration-300 hover:bg-secondary border-l-2 border-transparent cursor-pointer",
//           {
//             "bg-secondary navgradient transition-all": isActive,
//             // "pl-2": level > 0,
//           }
//         )}
//       >
//         {filteredSubmenu && filteredSubmenu.length > 0 ? (
//           <div className="flex items-center gap-2 truncate">
//             <Icon size={level > 0 ? 14 : 18} />
//             <span>{item.title}</span>
//           </div>
//         ) : (
//           <Link
//             href={{
//               pathname: item.path,
//               query: {
//                 selectedYearId,
//               },
//             }}
//             className="flex items-center gap-2 truncate w-full"
//           >
//             <Icon size={level > 0 ? 14 : 18} />
//             <span>{item.title}</span>
//           </Link>
//         )}

//         {filteredSubmenu && filteredSubmenu.length > 0 && (
//           <ChevronLeft
//             size={14}
//             className={cn("transition-transform", {
//               "-rotate-90": expanded,
//             })}
//           />
//         )}
//       </div>

//       {filteredSubmenu && filteredSubmenu.length > 0 && (
//         <div
//           className={cn("ml-6 transition-all border-l-2 border-border", {
//             hidden: !expanded,
//           })}
//         >
//           {filteredSubmenu.map((subItem) => (
//             <SidebarLink key={subItem.title} item={subItem} level={level + 1} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

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
  }, [allYears]);

  useEffect(() => {
    if (currentYear) {
      setCurrentYear(currentYear);
    }
  }, [currentYear]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const yearId = url.searchParams.get("selectedYearId");

    if (yearId) {
      setSelectedYear(yearId);
    } else if (!loadingCurrent && currentYear) {
      setCurrentYear(currentYear);
    }
  }, [loadingCurrent, currentYear, setSelectedYear, setCurrentYear]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between p-4 py-2">
        <Link href="/dashboard">Dashboard</Link>
        <ModeToggle />
      </div>

      <div className="w-[90%] mb-4 mx-auto">
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
      </div>

      <div className="space-y-1">
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
  const { selectedYearId } = useAcademicYearStore();
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon || CircleDashed;

  const checkRole = (path?: string) => {
    if (!path || !session?.user?.role) return true;
    return hasAccess(path, session.user.role);
  };

  const isActive = pathname === item.path;

  const filteredSubmenu = item.submenu?.filter((sub) => checkRole(sub.path));
  if (item.submenu && filteredSubmenu?.length === 0) return null;
  if (!item.submenu && !checkRole(item.path)) return null;

  return (
    <div>
      <div
        onClick={() =>
          filteredSubmenu && filteredSubmenu.length > 0
            ? setExpanded((prev) => !prev)
            : null
        }
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
