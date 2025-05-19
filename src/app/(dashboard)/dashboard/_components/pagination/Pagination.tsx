"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type props = {
  totalCount: number;
};
const PaginationCom = ({ totalCount }: props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") || "1");

  const params = new URLSearchParams(searchParams);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  const hasPrev = pageSize * (page - 1) > 0;
  const hasNext = pageSize * (page - 1) + pageSize < totalCount;
  const noOfPages = Math.ceil(totalCount / pageSize);

  const pageChange = (type: "next" | "prev") => {
    type === "prev"
      ? params.set("page", String(page - 1))
      : params.set("page", String(page + 1));

    replace(`${pathname}?${params}`);
  };
  const handlePage = (pageNo: number) => {
    const validPageNo = pageNo > 0 ? pageNo : pageNo + 1;
    params.set("page", String(validPageNo));
    replace(`${pathname}?${params}`);
  };
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 flex-1">
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => pageChange("prev")}
          disabled={!hasPrev}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={17} /> <span>Previous</span>
        </Button>

        {/* {Array.from({ length: noOfPages }, (_, i) => i + 1).map((item, i) => (
        <Button
          key={i}
          variant={page === i + 1 ? "secondary" : "ghost"}
          size={"sm"}
          onClick={() => handlePage(i)}
        >
          {item}
        </Button>
      ))} */}
        <span className="flex items-center gap-1">
          | Go to page:
          <Input
            type="number"
            className="border p-1 rounded w-14"
            min={1}
            max={noOfPages}
            placeholder={String(page)}
            value={Number(page)}
            onChange={(e) => handlePage(Number(e.target.value))}
          />
        </span>

        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => pageChange("next")}
          disabled={!hasNext}
          className="flex items-center gap-1"
        >
          <span>Next</span> <ChevronRight size={17} />
        </Button>
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>Page</span>
        <strong>
          {page} of {noOfPages.toLocaleString()}
        </strong>
      </div>
    </div>
  );
};

export default PaginationCom;
