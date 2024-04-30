import { getClasses } from "@/lib/data";
import AdmissionForm from "../../_components/admitionForm/AdmissionForm";

const AdmissinPage = async () => {
  const classes = await getClasses();
  return <AdmissionForm classes={classes} />;
};

export default AdmissinPage;
