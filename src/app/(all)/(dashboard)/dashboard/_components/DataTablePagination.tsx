import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DataTablePagination = ({
  previousPage,
  canPreviousPage,
  noOfPages,
  getState,
  setPageIndex,
  nextPage,
  canNextPage,
  selectedDataRowIds,
  selectedRows,
  totalRows,
}: any) => {
  return (
    <div className="flex items-center justify-between space-x-2 py-4 ">
      {/* prev and next button  */}
      <div className="space-x-2 flex ">
        <Button
          variant={"ghost"}
          size="sm"
          onClick={() => previousPage}
          disabled={!canPreviousPage()}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={17} /> <span>Previous</span>
        </Button>
        {/* {Array.from({ length: noOfPages() }, (_, i) => i + 1).map((item, i) => (
          <Button
            key={i}
            variant={
              getState().pagination.pageIndex + 1 === i + 1
                ? "secondary"
                : "ghost"
            }
            size={"sm"}
            onClick={() => setPageIndex(i)}
          >
            {item}
          </Button>
        ))} */}

        <span className="flex items-center gap-1">
          | Go to page:
          <Input
            type="number"
            defaultValue={getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(page);
            }}
            className="border p-1 rounded w-14"
          />
        </span>
        <Button
          variant={"ghost"}
          size="sm"
          onClick={() => nextPage()}
          disabled={!canNextPage()}
          className="flex items-center gap-1"
        >
          <span>Next</span> <ChevronRight size={17} />
        </Button>
      </div>
      {/* number of page shows  */}
      <div>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <div>Page</div>
          <strong>
            {getState().pagination.pageIndex + 1} of{" "}
            {noOfPages().toLocaleString()}
          </strong>
        </span>
      </div>

      {/* number of selected rows shows  */}

      {selectedDataRowIds.length > 0 && (
        <div className=" text-sm text-muted-foreground">
          {selectedRows().rows.length} of {totalRows().rows.length} row(s)
          selected.
        </div>
      )}
    </div>
  );
};

export default DataTablePagination;
