import { Button } from "@/components/ui/button";
import { fetchClasses } from "@/lib/actions/classes.action";
import StudentImportForm from "../../_components/StudentImportForm";

const ImportPage = async () => {
  const classes = await fetchClasses();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl">Import Student</span>
        <Button variant={"link"} size={"sm"} asChild>
          <a href="/assets/student.csv" download="demo_student.csv">
            Download Sample Data
          </a>
        </Button>
      </div>
      <div className="mt-6">
        <ol>
          <li>1. Do not edit the header row from the sample CSV file.</li>
          <li>2. Do not add or remove any columns from the file.</li>
          <li>3. Ensure all the columns included.</li>
          <li>3. Select class and section to insert specific class.</li>
        </ol>

        <StudentImportForm classes={classes} />
      </div>
    </div>
  );
};

export default ImportPage;
