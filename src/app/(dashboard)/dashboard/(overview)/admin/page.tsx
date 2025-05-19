import Announcements from "../_components/Announcements";
import { AttendenceChart } from "../_components/AttendenceChart";
import Cards from "../_components/Cards";
import CalenderComponent from "../_components/EventsCalender";
import { ExpenseChart } from "../_components/ExpenseChart";
import { StudnetChart } from "../_components/StudentChart";

type searchParams = { [key: string]: string | string[] | undefined };

const AdminPage = async ({ searchParams }: { searchParams: searchParams }) => {
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
        <CalenderComponent searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
