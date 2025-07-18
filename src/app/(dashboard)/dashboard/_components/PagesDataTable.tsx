import { Page } from "@/app/generated/prisma";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";
type props = {
  data: Page[];
};

const PagesDataTable = async ({ data }: props) => {
  const session = await auth();

  return (
    <Card>
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Pages" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>

              <TableCell>{item.slug}</TableCell>

              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  {(session?.user.role === "SUPERADMIN" ||
                    session?.user.role === "ADMIN") && (
                    <>
                      {item.slug && (
                        <Link href={`/dashboard/pages/view/${item.id}`}>
                          <Eye size={18} />
                        </Link>
                      )}
                      <Link href={`/dashboard/pages/edit/${item.id}`}>
                        <Edit size={16} className=" text-green-500" />
                      </Link>
                      <Link href={"/"}>
                        <Trash size={16} className=" text-red-500" />
                      </Link>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PagesDataTable;
