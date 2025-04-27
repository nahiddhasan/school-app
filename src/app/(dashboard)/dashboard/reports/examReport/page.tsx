import { getClasses, resultReport } from "@/lib/data";
import Test from "../../_components/PieChartComp";
import SearchForm from "../../_components/searchFrom/SearchForm";

const ExamReoprt = async () => {
  const report = await resultReport();
  const classes = await getClasses();
  return (
    <div className="p-4">
      <SearchForm classes={classes} />
      ExamReoprt <Test />
    </div>
  );
};

export default ExamReoprt;
