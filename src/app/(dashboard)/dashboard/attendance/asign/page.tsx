import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import TooltipComp from "@/components/ui/TooltipComp";
import { prisma } from "@/lib/connect";
import CreateScheduleForm from "../../_components/AddAssignedTeacherModal";
import DeleteAsignTeacherModal from "../../_components/DeleteAssignTeacherModal";

const AssignedTeachres = async () => {
  const session = await auth();
  const assignedClasses = await prisma.assignedAttendanceTeacher.findMany({
    where: {
      schoolId: session?.user.schoolId,
    },
    include: {
      teacher: {
        select: {
          name: true,
        },
      },
      class: {
        select: { className: true },
      },
    },
  });

  return (
    <div className="h-[calc(100%-48px)] overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assigned Attendance Teachers</h1>
          <TooltipComp text="Assign Teacher">
            <CreateScheduleForm />
          </TooltipComp>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedClasses.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No teacher assigned.
            </div>
          ) : (
            assignedClasses.map((assignment) => (
              <Card
                key={assignment.id}
                className="p-4 shadow-sm border rounded-md relative group"
              >
                <h3 className="text-lg font-semibold">
                  {assignment.class.className}
                </h3>
                <p className="text-muted-foreground">
                  Section: {assignment.section}
                </p>
                <p className="text-muted-foreground">
                  Teacher: {assignment.teacher.name}
                </p>
                <p className="text-xs text-gray-500">
                  Assigned on:{" "}
                  {new Date(assignment.createdAt).toLocaleDateString()}
                </p>
                <div className="absolute top-2 right-2 hidden opacity-0 group-hover:block group-hover:opacity-100 transition-all duration-300">
                  <DeleteAsignTeacherModal id={assignment.id} />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedTeachres;
