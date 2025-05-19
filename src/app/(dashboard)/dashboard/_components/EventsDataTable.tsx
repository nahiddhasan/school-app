import { Event } from "@/app/generated/prisma";
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

import DeleteEventModal from "./DeleteEventModal";
import UpdateEventModal from "./UpdateEventModal";
type props = {
  data: Event[];
};

const EventsDataTable = async ({ data }: props) => {
  const session = await auth();

  return (
    <div>
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Events" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>

              <TableCell>{item.desc}</TableCell>
              <TableCell>
                {new Date(item.date).toLocaleDateString("en-GB")}
              </TableCell>

              <TableCell>
                {new Date(item.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>

              <TableCell>
                {new Date(item.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>

              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  {session?.user.role === "ADMIN" && (
                    <>
                      <TooltipComp text="Update">
                        <UpdateEventModal event={item} />
                      </TooltipComp>
                      <TooltipComp text="Delete">
                        <DeleteEventModal id={item.id} />
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

export default EventsDataTable;
