import { fetchClasses } from "@/lib/actions/classes.action";
import ResultImportForm from "../../_components/ResultImportForm";
import SampleResultData from "../../_components/SampleResultData";

const ManageResultPage = async () => {
  const classes = await fetchClasses();

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-scroll bg-card rounded-lg">
      <div className="">
        <span className="text-xl">Import Citeria</span>
      </div>
      <div className="mt-6">
        <ol>
          <li>1. Do not edit the header row from the sample CSV file.</li>
          <li>2. Do not add or remove any columns from the file.</li>
          <li>3. Ensure all the columns included.</li>
          <li>3. Select class and section to insert specific class.</li>
        </ol>
        <SampleResultData />
        <ResultImportForm />
      </div>
    </div>
  );
};

export default ManageResultPage;
