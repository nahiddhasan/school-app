"use client";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/const/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type props = {
  totalCount: number;
};
const PaginationCom = ({ totalCount }: props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = searchParams.get("page") || "1";

  const params = new URLSearchParams(searchParams);

  const hasPrev = PAGE_SIZE * (parseInt(page) - 1) > 0;
  const hasNext = PAGE_SIZE * (parseInt(page) - 1) + PAGE_SIZE < totalCount;
  const noOfPages = Math.ceil(totalCount / PAGE_SIZE);

  const pageChange = (type: "next" | "prev") => {
    type === "prev"
      ? params.set("page", String(parseInt(page) - 1))
      : params.set("page", String(parseInt(page) + 1));

    replace(`${pathname}?${params}`);
  };
  const handlePage = (pageNo: number) => {
    params.set("page", String(pageNo + 1));
    replace(`${pathname}?${params}`);
  };
  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => pageChange("prev")}
          disabled={!hasPrev}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={17} /> <span>Previous</span>
        </Button>

        {Array.from({ length: noOfPages }, (_, i) => i + 1).map((item, i) => (
          <Button
            key={i}
            variant={parseInt(page) === i + 1 ? "secondary" : "ghost"}
            size={"sm"}
            onClick={() => handlePage(i)}
          >
            {item}
          </Button>
        ))}

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
    </div>
  );
};

export default PaginationCom;
