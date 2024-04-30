import { Button } from "@/components/ui/button";

import { getClasses, getSession } from "@/lib/data";
import ResultImportForm from "../_components/ResultImportForm";

const ManageResultPage = async () => {
  const sessions = await getSession();
  const classes = await getClasses();

  // const handleSubmit = (e: any) => {
  //   e.preventDefault();

  //   if (!file) {
  //     return;
  //   }

  //   let csv = [];
  //   parseCSV(file)
  //     .then((data) => {
  //       csv = data;
  //     })
  //     .catch((errors) => {
  //       console.error("Parsing errors:", errors);
  //       toast.error("Invalid CSV data");
  //     });

  //   // importResults(csv).then((res) => {
  //   //   if (res.success) {
  //   //     toast.success(res.success);
  //   //   } else {
  //   //     toast.error(res.error);
  //   //   }
  //   // });
  // };
  const downloadFile = () => {};

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl">Import Citeria</span>
        <Button variant={"link"} size={"sm"}>
          <a href={"/public/assets/import_result.csv"} download>
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

        <ResultImportForm sessions={sessions} classes={classes} />
      </div>
    </div>
  );
};

export default ManageResultPage;
