"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { EnrollmentData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columns: ColumnDef<EnrollmentData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentId",
    header: "Student Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("studentId")}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <div className="flex gap-3 items-center">
          Name
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "className",
    header: () => <div className="text-center">Class</div>,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="text-center capitalize">
          <span>
            {student.className} ({student.section})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "classRoll",
    header: () => <div className="text-center">Roll</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("classRoll")}</div>
    ),
  },
  {
    accessorKey: "gpa",
    header: () => <div className="text-center">Gpa</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("gpa")}</div>
    ),
  },
  {
    accessorKey: "position",
    header: () => <div className="text-center">Position</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("position")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">
        <span
          className={`text-sm px-2 rounded-full ${
            row.getValue("status") === "PASSED"
              ? "bg-green-300 text-green-700"
              : "bg-red-300 text-red-700"
          }`}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
  },
];

export default columns;
