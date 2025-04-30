import { fetchClasses } from "@/lib/actions/classes.action";
import AdmissionForm from "../../_components/AdmissionForm";

const AdmissinPage = async () => {
  const classes = await fetchClasses();
  return <AdmissionForm classes={classes} />;
};

export default AdmissinPage;
