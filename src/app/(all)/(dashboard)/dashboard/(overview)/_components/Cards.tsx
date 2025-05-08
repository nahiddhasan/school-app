import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/connect";
import Image from "next/image";
import parrents from "../../../../../../../public/img/parrents.png";
import stafs from "../../../../../../../public/img/stafs.png";
import student from "../../../../../../../public/img/student.png";
import teacher from "../../../../../../../public/img/teacher.png";
const Cards = async () => {
  const currentYear = await prisma.academicYear.findFirst({
    where: { current: true },
  });

  const students = await prisma.student.count({
    where: {
      enrollments: {
        some: {
          academicYearId: currentYear?.id,
        },
      },
    },
  });

  return (
    <div className="grid grid-cols-4 gap-2">
      <CountCard
        title="Students"
        count={students}
        year={currentYear?.year!}
        img={student}
      />
      <CountCard
        title="Teachers"
        count={55}
        year={currentYear?.year!}
        img={teacher}
      />
      <CountCard
        title="Parrents"
        count={students}
        year={currentYear?.year!}
        img={parrents}
      />
      <CountCard
        title="Stafs"
        count={20}
        year={currentYear?.year!}
        img={stafs}
      />
    </div>
  );
};

export default Cards;
const CountCard = ({
  title,
  count,
  year,
  img,
}: {
  title: string;
  count: number;
  year: number;
  img: any;
}) => {
  return (
    <Card className="h-32 p-4 relative overflow-hidden shadow-md border-none">
      <span className="px-2 bg-zinc-100 dark:bg-zinc-700 text-muted-foreground rounded-full text-xs">
        {year}
      </span>
      <h1 className="text-2xl font-bold my-2">{count}</h1>
      <p className="text-muted-foreground ">{title}</p>

      <Image
        src={img}
        height={80}
        width={80}
        alt={title}
        className="absolute top-1/2 -translate-y-1/2 right-0 opacity-20"
      />
    </Card>
  );
};
