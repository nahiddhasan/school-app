import Announcements from "../_components/Announcements";
import { AttendenceChart } from "../_components/AttendenceChart";
import CalenderComponent from "../_components/Calender";
import Cards from "../_components/Cards";
import { ExpenseChart } from "../_components/ExpenseChart";
import { StudnetChart } from "../_components/StudentChart";

const AdminPage = () => {
  return (
    <div className="flex gap-4 p-4 overflow-y-scroll h-[calc(100vh-48px)]">
      <div className="w-2/3">
        <Cards />
        <div className="flex gap-4 my-4">
          <AttendenceChart />
          <StudnetChart />
        </div>
        <ExpenseChart />
      </div>
      <div className="w-1/3 flex flex-col gap-4">
        <CalenderComponent />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
