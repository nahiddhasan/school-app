import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const AttendancePage = async () => {
  const session = await auth();

  const assignedClass = await prisma.assignedAttendanceTeacher.findMany({
    where: {
      teacherId: session?.user.teacherId,
    },
    include: {
      class: true,
    },
  });

  return (
    <div className="h-[calc(100%-48px)] p-4 flex items-center justify-center overflow-y-auto">
      <div className="w-full h-full bg-card rounded-lg p-4 shadow-md ">
        <h1 className="text-3xl py-4 font-bold">Select Class</h1>
        {assignedClass.length > 0 ? (
          assignedClass.map((item) => (
            <Link
              href={`/dashboard/attendance/take?className=${item.class.className}&section=${item.section}`}
              key={item.id}
              className="bg-input mb-4 flex items-center justify-between p-4 rounded-lg max-w-lg cursor-pointer"
            >
              <div>
                <h2>{item.class.className}</h2>
                <h3>{item.section}</h3>
              </div>
              <div>
                <ChevronRight />
              </div>
            </Link>
          ))
        ) : (
          <p>No assigned class found.</p>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
