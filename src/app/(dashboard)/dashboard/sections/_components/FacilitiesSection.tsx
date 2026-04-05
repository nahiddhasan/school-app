import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import EditableFacilityCard from "./EditableFacilityCard";

const FacilitiesSection = async () => {
  const session = await auth();
  const data = await prisma.facility.findMany({
    where: {
      schoolId: session?.user.schoolId,
    },
  });

  return (
    <div>
      <h1 className="text-3xl mb-4 font-bold ">Facilities</h1>
      <div className="grid gap-4 grid-cols-3 ">
        {data.map((item) => (
          <EditableFacilityCard key={item.id} facility={item} />
        ))}
      </div>
    </div>
  );
};

export default FacilitiesSection;
