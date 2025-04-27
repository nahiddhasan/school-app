import {
  createNewSessionAndSetCurrent,
  totalStudentCount,
} from "@/lib/actions";
import DashBoardCard from "./_components/DashBoardCard";
import PieChartComp from "./_components/PieChartComp";
const data = [
  { name: "Group A", value: 15 },
  { name: "Group B", value: 15 },
];
const Dashboard = async () => {
  await createNewSessionAndSetCurrent();
  const student = await totalStudentCount();

  return (
    <div className="h-full flex gap-3 flex-col overflow-y-auto p-4 text-white">
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-green-500">
          <h1 className="text-2xl font-semibold">Total Students</h1>
          <h2 className="font-semibold text-2xl">{student?.totalStudent}</h2>
        </div>
        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-orange-500 ">
          <h1 className="text-2xl font-semibold">Total Teachers</h1>
          <h2 className="font-semibold text-2xl">15</h2>
        </div>

        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-rose-600">
          <h1 className="text-2xl font-semibold">Class Six</h1>
          <h2 className="font-semibold text-xl">{student?.six}</h2>
          <div className="flex gap-3">
            <span className="font-semibold text-xl">
              Boy: {student?.sixBoy}
            </span>
            <span className="font-semibold text-xl">
              Girl: {student?.sixGirl}
            </span>
          </div>
        </div>
        <DashBoardCard student={student} />
        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-lime-600">
          <h1 className="text-2xl font-semibold">Class Seven</h1>
          <h2 className="font-semibold text-2xl">{student?.seven}</h2>
          <div className="flex gap-3">
            <span className="font-semibold text-xl">
              Boy: {student?.sevenBoy}
            </span>
            <span className="font-semibold text-xl">
              Girl: {student?.sevenGirl}
            </span>
          </div>
        </div>
        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-amber-600">
          <h1 className="text-2xl font-semibold">Class Eight</h1>
          <h2 className="font-semibold text-2xl">{student?.eight}</h2>
          <div className="flex gap-3">
            <span className="font-semibold text-xl">
              Boy: {student?.eightBoy}
            </span>
            <span className="font-semibold text-xl">
              Girl: {student?.eightGirl}
            </span>
          </div>
        </div>
        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-emerald-600">
          <h1 className="text-2xl font-semibold">Class Nine</h1>
          <h2 className="font-semibold text-2xl">{student?.nine}</h2>
          <div className="flex gap-3">
            <span className="font-semibold text-xl">
              Boy: {student?.nineBoy}
            </span>
            <span className="font-semibold text-xl">
              Girl: {student?.nineGirl}
            </span>
          </div>
        </div>
        <div className="w-full h-[120px] flex flex-col items-center justify-center bg-green-600">
          <h1 className="text-2xl font-semibold">Class Ten</h1>
          <h2 className="font-semibold text-2xl">{student?.ten}</h2>
          <div className="flex gap-3">
            <span className="font-semibold text-xl">
              Boy: {student?.tenBoy}
            </span>
            <span className="font-semibold text-xl">
              Girl: {student?.tenGirl}
            </span>
          </div>
        </div>
      </div>

      <PieChartComp data={data} />
    </div>
  );
};

export default Dashboard;
