"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const handlePageSize = (value: number) => {
    const pageSize = value.toString();

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

  const selectedPageSize = params.get("pageSize") || "10";

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="mr-4 flex items-center gap-2">
          <span>Shows</span>

          <Select
            defaultValue={selectedPageSize}
            onValueChange={(val) => handlePageSize(Number(val))}
          >
            <SelectTrigger className="h-10 w-[70px] rounded-md bg-transparent">
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
        <div className="flex items-center border border-input w-1/3 rounded-md h-10">
          <Search className="mx-2" size={18} />
          <Input
            onChange={handleSearch}
            placeholder={inputLabel}
            className="max-w-sm border-none outline-none px-1 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
