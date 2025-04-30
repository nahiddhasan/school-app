import { getClasses } from "@/lib/data";
import AdmissionForm from "../_components/AdmissionForm";

const page = async () => {
  const classes = await getClasses();
  return (
    <div className="h-full overflow-y-auto">
      <AdmissionForm classes={classes} />
    </div>
  );
};

export default page;
