import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClasses } from "@/lib/data";
import UpdateClassModal from "../../_components/UpdateClassModal";

const Classes = async () => {
  const classes = await getClasses();

  return (
    <div className="p-4 px-16">
      <h1 className="text-3xl mb-4">All Classes</h1>
      <div className=" ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ClassName</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead className="text-center w-16">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.className}</TableCell>
                <TableCell>
                  {cls.sectionName.map((item, i) => (
                    <span key={i} className="mr-2">
                      {item}

                      {cls.sectionName.length! - 1 > i && ","}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="flex items-center justify-center w-16">
                  <UpdateClassModal cls={cls} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Classes;
