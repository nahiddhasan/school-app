const DashBoardCard = ({ student }) => {
  return (
    <div className="w-full h-[120px] flex flex-col items-center justify-center bg-rose-600">
      <h1 className="text-2xl font-semibold">Class Six</h1>
      <h2 className="font-semibold text-xl">{student?.six}</h2>
      <div className="flex gap-3">
        <span className="font-semibold text-xl">Boy: {student?.sixBoy}</span>
        <span className="font-semibold text-xl">Girl: {student?.sixGirl}</span>
      </div>
    </div>
  );
};

export default DashBoardCard;
