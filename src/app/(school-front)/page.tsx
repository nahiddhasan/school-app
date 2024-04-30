import AboutSchool from "@/components/AboutSchool";
import MainGov from "@/components/MainGov";
import NoticeCarousel from "@/components/NoticeCarousel";
import Teachers from "@/components/Teachers";
import MarqueeContainer from "@/components/marquee/MarqueeContainer";
import EmblaCarousel from "@/components/slider/EmblaSlider";

const HomePage = () => {
  return (
    <main>
      <MarqueeContainer />
      <EmblaCarousel />
      <AboutSchool />
      <MainGov />
      <Teachers />
      <NoticeCarousel />
    </main>
  );
};

export default HomePage;
