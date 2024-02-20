import AboutSchool from "@/components/AboutSchool";
import MainGov from "@/components/MainGov";
import NoticeScroll from "@/components/NoticeScroll";
import Teachers from "@/components/Teachers";
import MarqueeContainer from "@/components/marquee/MarqueeContainer";
import Slider from "@/components/slider/Slider";

const HomePage = () => {
  return (
    <main>
      <MarqueeContainer />
      <Slider />
      <AboutSchool />
      <MainGov />
      <Teachers />
      <NoticeScroll />
    </main>
  );
};

export default HomePage;
