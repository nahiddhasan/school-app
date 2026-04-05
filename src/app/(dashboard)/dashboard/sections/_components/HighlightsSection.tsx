import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import EditableHighlightCard from "./EditableHighlightCard";

const HighlightsSection = async () => {
  const session = await auth();
  const data = await prisma.highlight.findMany({
    where: {
      schoolId: session?.user.schoolId,
    },
  });

  return (
    <div>
      <h1 className="text-3xl mb-4 font-bold ">Heiglights</h1>
      <div className="grid gap-4 grid-cols-3 ">
        {data.map((item) => (
          <EditableHighlightCard key={item.id} highlight={item} />
        ))}
      </div>
    </div>
  );
};

export default HighlightsSection;
