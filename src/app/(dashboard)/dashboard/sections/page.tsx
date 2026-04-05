import FacilitiesSection from "./_components/FacilitiesSection";
import HighlightsSection from "./_components/HighlightsSection";

const Sections = () => {
  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto space-y-8">
      <HighlightsSection />
      <FacilitiesSection />
    </div>
  );
};

export default Sections;
