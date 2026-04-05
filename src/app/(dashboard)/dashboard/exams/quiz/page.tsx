const Quiz = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px)] w-full">
      <div className="text-center mt-12 font-sans">
        <h1 className="text-2xl text-gray-700">No Quiz Found!</h1>
        <p className="text-lg text-gray-500">
          Please check back later for available quizzes.
        </p>
      </div>
    </div>
  );
};

export default Quiz;
