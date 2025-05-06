"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DataTablePagination from "../../_components/DataTablePagination";
import PromoteDialog from "./PromoteDialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function EnrollmentDataTable<
  TData extends { status?: string; id: string },
  TValue
>({ columns, data }: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Auto-select rows where status === "PASSED"
  useEffect(() => {
    const selection: Record<string, boolean> = {};

    data.forEach((row) => {
      if (row.status === "PASSED") {
        selection[row.id] = true;
      }
    });

    setRowSelection(selection);
  }, [data]);

  // Get selected row data
  const selectedDataRow = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original);

  const selectedDataRowIds = selectedDataRow.map((row) => {
    return row.id;
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <div className="mr-4 flex items-center gap-2">
            <span>Shows</span>
            <Select
              defaultValue={table.getState().pagination.pageSize.toString()}
              onValueChange={(val) => table.setPageSize(Number(val))}
            >
              <SelectTrigger className="h-10 w-[70px] rounded-md ">
                <SelectValue placeholder="Select Page Size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Items</span>
          </div>
          <Input
            placeholder="Search By Name..."
            value={
              (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("fullName")?.setFilterValue(event.target.value)
            }
            className="max-w-md h-10 rounded-md"
          />
        </div>

        <PromoteDialog
          open={open}
          setOpen={setOpen}
          selectedDataRowIds={selectedDataRowIds}
          disabled={selectedDataRowIds.length === 0}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Student found!.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        previousPage={table.previousPage}
        canPreviousPage={table.getCanPreviousPage}
        noOfPages={table.getPageCount}
        getState={table.getState}
        setPageIndex={table.setPageIndex}
        nextPage={table.nextPage}
        canNextPage={table.getCanNextPage}
        selectedDataRowIds={selectedDataRowIds}
        selectedRows={table.getFilteredSelectedRowModel}
        totalRows={table.getFilteredRowModel}
      />
    </div>
  );
}

{
  /* <AlertDialog>
          <AlertDialogTrigger
            disabled={selectedDataRowIds.length === 0}
            asChild
          >
            <Button variant="destructive" size={"sm"} className="ml-auto">
              Promote selected <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will promote the selected
                students.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => handlePromote(selectedDataRowIds)}
              >
                Promote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */
}
