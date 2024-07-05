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
import * as React from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bulkDelete } from "@/lib/actions";
import { DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import DataTablePagination from "../../_components/DataTablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function BulkDeleteData<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
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

  //get selected row array with full information
  const selectedDataRow = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original);

  //get selected rowId as array
  const selectedDataRowIds = selectedDataRow.map((row) => {
    //@ts-ignore
    return row.id;
  });

  const handleBulkDelete = async (selectedDataRowIds: string[]) => {
    await bulkDelete(selectedDataRowIds).then((res) => {
      if (res.messege) {
        toast.success(res.messege);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="mr-4 flex items-center gap-2">
          <span>Shows</span>
          <select
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            defaultValue={table.getState().pagination.pageSize}
            className="p-1 dark:bg-zinc-950 ring-1 dark:ring-zinc-800 outline-none border-none focus:outline-none"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
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
          className="max-w-sm"
        />
        <AlertDialog>
          <AlertDialogTrigger
            disabled={selectedDataRowIds.length === 0}
            asChild
          >
            <Button variant="destructive" size={"sm"} className="ml-auto">
              Delete <DeleteIcon className="ml-2 h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                selected students from database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => handleBulkDelete(selectedDataRowIds)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  No results.
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

// {
//   (<div className="flex items-center justify-between space-x-2 py-4 ">
//   {/* prev and next button  */}
//   <div className="space-x-2 flex ">
//     <Button
//       variant={"ghost"}
//       size="sm"
//       onClick={() => table.previousPage()}
//       disabled={!table.getCanPreviousPage()}
//       className="flex items-center gap-1"
//     >
//       <ChevronLeft size={17} /> <span>Previous</span>
//     </Button>
//     {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
//       (item, i) => (
//         <Button
//           key={i}
//           variant={
//             table.getState().pagination.pageIndex + 1 === i + 1
//               ? "secondary"
//               : "ghost"
//           }
//           size={"sm"}
//           onClick={() => table.setPageIndex(i)}
//         >
//           {item}
//         </Button>
//       )
//     )}
//     <Button
//       variant={"ghost"}
//       size="sm"
//       onClick={() => table.nextPage()}
//       disabled={!table.getCanNextPage()}
//       className="flex items-center gap-1"
//     >
//       <span>Next</span> <ChevronRight size={17} />
//     </Button>
//   </div>
//   {/* number of page shows  */}
//   <div>
//     <span className="flex items-center gap-1 text-sm text-muted-foreground">
//       <div>Page</div>
//       <strong>
//         {table.getState().pagination.pageIndex + 1} of{" "}
//         {table.getPageCount().toLocaleString()}
//       </strong>
//     </span>
//   </div>

//   {/* number of selected rows shows  */}
//   {selectedDataRowIds.length > 0 && (
//     <div className=" text-sm text-muted-foreground">
//       {table.getFilteredSelectedRowModel().rows.length} of{" "}
//       {table.getFilteredRowModel().rows.length} row(s) selected.
//     </div>
//   )}
// </div>)
// }
