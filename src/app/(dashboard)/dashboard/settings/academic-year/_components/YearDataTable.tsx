import { AcademicYear } from "@/app/generated/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import UpdateButton from "./UpdateButton";
type props = {
  data: AcademicYear[];
};
const YearDataTable = ({ data }: props) => {
  return (
    <div>
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Academic Years" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Academic Year</TableHead>
            <TableHead>IsCurrent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.year}</TableCell>
                <TableCell>
                  {item.current ? (
                    <span className="bg-green-300/85 text-green-700 rounded-full px-2">
                      current
                    </span>
                  ) : (
                    ""
                  )}
                </TableCell>

                <TableCell className="flex gap-2">
                  <UpdateButton data={item} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default YearDataTable;
