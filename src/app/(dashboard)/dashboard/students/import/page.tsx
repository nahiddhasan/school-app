import { Button } from "@/components/ui/button";
import { getClasses } from "@/lib/data";
import StudentImportForm from "../../_components/StudentImportForm";

const ImportPage = async () => {
  const classes = await getClasses();
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl">Import Citeria</span>
        <Button variant={"link"} size={"sm"} asChild>
          <a href={"/public/assets/import_student.csv"} download>
            Download Sample Data
          </a>
        </Button>
      </div>
      <div className="mt-6">
        <ol>
          <li>
            1. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Nostrum, repudiandae.
          </li>
          <li>2. Lorem ipsum dolor sit amet consectetur, adipisicing elit.</li>
          <li>
            3. Lorem ipsum dolor sit amet consectetur adipisicing elit. At
            asperiores ad nulla?
          </li>
          <li>
            4. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto
            perferendis quidem accusamus! Tempore, perferendis quod.
          </li>
          <li>5. Lorem ipsum, dolor sit amet consectetur adipisicing.</li>
        </ol>

        <StudentImportForm classes={classes} />
      </div>
    </div>
  );
};

export default ImportPage;
