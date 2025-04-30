"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

const SearchFilter = ({
  inputLabel = "Search...",
}: {
  inputLabel?: string;
}) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams.toString());

  const handlePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const pageSize = e.target.value;

    if (pageSize) {
      params.set("pageSize", pageSize);
      params.set("page", "1");
    } else {
      params.delete("pageSize");
    }
    replace(`${pathname}?${params}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    if (search) {
      params.set("search", search);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params}`);
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="mr-4 flex items-center gap-2">
          <span>Shows</span>
          <select
            onChange={handlePageSize}
            className="p-1 h-9 rounded-md dark:bg-zinc-950 ring-1 dark:ring-zinc-800 outline-none border-none focus:outline-none"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>Items</span>
        </div>
        <div className="flex items-center border border-input w-1/3 rounded-md h-10">
          <Search className="mx-2" size={18} />
          <Input
            onChange={handleSearch}
            placeholder={inputLabel}
            className="max-w-sm border-none outline-none px-1"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
