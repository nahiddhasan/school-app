import AboutSchool from "@/components/AboutSchool";
import MainGov from "@/components/MainGov";
import PhotoGalery from "@/components/PhotoGalery";
import Teachers from "@/components/Teachers";
import MarqueeContainer from "@/components/notices/marquee/MarqueeContainer";
import NoticeBoard from "@/components/notices/noticeBoard/NoticeBoard";
import EmblaCarousel from "@/components/slider/EmblaSlider";
import { getNotices } from "@/lib/data";

const HomePage = async () => {
  const notices = await getNotices();

  return (
    <main>
      <MarqueeContainer notices={notices} />
      <EmblaCarousel />
      <AboutSchool />
      <MainGov />
      <Teachers />
      <NoticeBoard notices={notices} />
      <PhotoGalery />
    </main>
  );
};

export default HomePage;
