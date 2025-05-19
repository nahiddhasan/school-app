import { Announcement } from "@/app/generated/prisma";
import { auth } from "@/auth";
import TooltipComp from "@/components/ui/TooltipComp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteAnnouncementModal from "./DeleteAnnonucementModal";
import UpdateAnnounceModal from "./UpdateAnnouncementModal";
type props = {
  data: Announcement[];
};

const AnnouncementDataTable = async ({ data }: props) => {
  const session = await auth();

  return (
    <div>
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Announcements" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>

              <TableCell>{item.desc}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
              </TableCell>

              <TableCell>
                <div className="flex items-center  gap-2">
                  {session?.user.role === "ADMIN" && (
                    <>
                      <TooltipComp text="Update">
                        <UpdateAnnounceModal announcement={item} />
                      </TooltipComp>
                      <TooltipComp text="Delete">
                        <DeleteAnnouncementModal id={item.id} />
                      </TooltipComp>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnnouncementDataTable;
